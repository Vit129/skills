# Security — Dev + QA Rules

> One source of truth — how to BUILD secure + how to TEST it's secure.

## Part 1: Dev — Secure Coding

> How to WRITE secure code. Used during `/build`.

### Three-Tier Boundary System

**Always Do (No Exceptions):**
- Validate all external input at system boundary
- Parameterize all database queries — never concatenate user input into SQL
- Encode output to prevent XSS (use framework auto-escaping)
- Use HTTPS for all external communication
- Hash passwords with bcrypt/scrypt/argon2 (salt rounds ≥ 12)
- Set security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- Use httpOnly, secure, sameSite cookies for sessions
- Run `npm audit` before every release

**Ask First (Requires Human Approval):**
- Adding new authentication flows
- Storing new categories of sensitive data (PII, payment)
- Adding external service integrations
- Changing CORS configuration
- Adding file upload handlers / Modifying rate limiting / Granting elevated permissions

**Never Do:**
- Commit secrets to version control
- Log sensitive data (passwords, tokens, full card numbers)
- Trust client-side validation as security boundary
- Use `eval()` or `innerHTML` with user data / Store auth tokens in localStorage
- Expose stack traces to users

### OWASP Top 10 — Implementation Patterns

```typescript
// Injection: Parameterized query
const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

// Broken Auth: bcrypt + session config
const hashedPassword = await hash(plaintext, 12);
cookie: { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 86400000 }

// XSS: framework auto-escaping (React)
return <div>{userInput}</div>;
// If MUST render HTML: DOMPurify.sanitize(userInput)

// Broken Access Control: ownership check
if (task.ownerId !== req.user.id) return res.status(403).json({ error: 'FORBIDDEN' });

// Security Misconfiguration
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(','), credentials: true }));
```

### Input Validation
```typescript
import { z } from 'zod';
const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});
const result = CreateTaskSchema.safeParse(req.body);
if (!result.success) return res.status(422).json({ error: result.error.flatten() });
```

### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use('/api/auth/', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));
```

### Secrets Management
```
.env.example  → Committed (template with placeholders)
.env          → NOT committed (real secrets)
.gitignore must include: .env, .env.local, *.pem, *.key
```

### Dev Review Checklist

```markdown
### Authentication
- [ ] Passwords hashed (bcrypt, salt ≥ 12)
- [ ] Sessions httpOnly, secure, sameSite
- [ ] Login has rate limiting / Reset tokens expire + single-use

### Authorization
- [ ] Every endpoint checks permissions
- [ ] Users can only access own resources (no IDOR)
- [ ] Admin actions require admin role

### Input
- [ ] All input validated at boundary
- [ ] SQL queries parameterized / HTML output encoded

### Data
- [ ] No secrets in code/VCS
- [ ] Sensitive fields excluded from API responses
- [ ] PII encrypted at rest (if applicable)

### Infrastructure
- [ ] Security headers configured (helmet)
- [ ] CORS restricted to known origins
- [ ] `npm audit` — no critical/high vulnerabilities
- [ ] Error messages don't expose internals
```

---

## Part 2: QA — Test Scenario Design + Automation

> How to DESIGN and IMPLEMENT security test scenarios.

### Internal Analysis (auto-run when loaded during test scenario design)

1. **Codebase auth scan** — scan auth/permission implementation. Identify: middleware, roles defined, endpoints protected.
2. **Adversarial review** (interview — doubt mode) — "How can auth be bypassed?", "What if attacker sends X?"
3. **OWASP verification** (interview — source mode) — cross-check OWASP Top 10 table below. Each applicable item → 1 `[Security]` scenario.

### [Security] Category Rules

- Prefix: `[Security]` — NEVER use `[Alternative]`
- **Separate file:** `testScenarioPbi{ID}-security.md`
- **Priority:** Critical (auth bypass, injection) or High (permission, rate limit)
- **Tag:** `@Security` in automation

### Title Convention

```
[{Platform}][Security] {verb} {what} {condition}
```
Examples:
- `[API][Security] ปฏิเสธ access เมื่อไม่มี token`
- `[UI][Security] ป้องกัน XSS เมื่อกรอก script tag ในช่อง name`

### OWASP-Based Test Conditions

| OWASP Category | Test Condition | Dev Must Implement | QA Must Test |
|---|---|---|---|
| Broken Authentication | Invalid/expired/missing token | bcrypt + session config | 401 on bad token |
| Broken Access Control (IDOR) | Access resource with wrong user | ownership check | 403 on other's resource |
| Injection (SQL/NoSQL) | Malicious payloads in input | parameterized queries | no 500, no data leak |
| XSS | Script tags in input | output encoding | reflected script not executed |
| CSRF | Action without CSRF token | CSRF middleware | 403 without token |
| Rate Limiting | Exceed request limit | rate-limit middleware | 429 after threshold |
| Mass Assignment | Extra fields in request | whitelist fields | extra fields ignored |
| File Upload | Malicious file types | file type validation | 400 on .exe/.php |
| Sensitive Data Exposure | PII in response | field filtering | password/token not in response |

### Permission Matrix

```markdown
| Role | Create | Read Own | Read All | Update | Delete | Expected |
|------|--------|----------|----------|--------|--------|----------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | 200 |
| Manager | ✅ | ✅ | ✅ | ✅ | ❌ | 403 on delete |
| User | ✅ | ✅ | ❌ | own only | ❌ | 403 on others |
| Guest | ❌ | ❌ | ❌ | ❌ | ❌ | 401 |
```
Each ❌ = 1 `[Security]` scenario. Each "own only" = 1 IDOR scenario.

### Minimum Scenarios

| Feature type | Minimum [Security] scenarios |
|---|---|
| Has auth (login/token) | 3: no token, expired token, invalid token |
| Has roles (multi-user) | Permission matrix: 1 per denied action per role |
| Has user input → DB | 2: SQL injection, XSS |
| Has file upload | 2: wrong type, oversized |
| Has sensitive data in response | 1: verify PII not leaked |
| Has rate-limited action | 1: exceed limit |

---

### Automation Patterns (Playwright)

```typescript
// Unauthorized Access
test('reject without token [Security]', async ({ request }) => {
  const res = await request.get('/api/v1/orders', { headers: { Authorization: '' } });
  expect(res.status()).toBe(401);
});

// Permission Matrix (data-driven)
for (const { role, action, resource, expectedStatus } of permissionMatrix) {
  test(`${role} ${action} ${resource} → ${expectedStatus} [Security]`, async ({ request }) => {
    const token = await getTokenForRole(role);
    const res = await request[action.toLowerCase()](`/api/v1/${resource}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(expectedStatus);
  });
}

// IDOR
test('cannot access other user resource [Security]', async ({ request }) => {
  const userAToken = await getTokenForUser('userA');
  const res = await request.get('/api/v1/orders/userB-order-id', {
    headers: { Authorization: `Bearer ${userAToken}` },
  });
  expect(res.status()).toBe(403);
});

// Injection (data-driven)
for (const payload of injectionPayloads) {
  test(`reject: ${payload.label} [Security]`, async ({ request }) => {
    const res = await request.post('/api/v1/search', { data: { query: payload.value } });
    expect(res.status()).not.toBe(500);
    expect(await res.text()).not.toContain(payload.errorSignal);
  });
}

// Rate Limiting
test('enforce rate limit [Security]', async ({ request }) => {
  const responses = await Promise.all(
    Array.from({ length: 10 }, () =>
      request.post('/api/v1/auth/login', { data: { email: 'x@x.com', password: 'wrong' } })
    )
  );
  expect(responses.filter(r => r.status() === 429).length).toBeGreaterThan(0);
});

// File Upload
test('reject executable [Security]', async ({ request }) => {
  const res = await request.post('/api/v1/upload', {
    multipart: { file: { name: 'x.exe', mimeType: 'application/x-msdownload', buffer: Buffer.from('MZ') } },
  });
  expect(res.status()).toBe(400);
});
```

### Mobile Patterns (Robot Framework)

```robot
[Security] Reject Access When Session Expired
    [Tags]    @Security    @Critical
    Login As    valid_user
    Force Session Expiry
    Navigate To    Profile Page
    Page Should Contain    Session expired

[Security] Block Deep Link Without Auth
    [Tags]    @Security    @High
    Open Deep Link    myapp://orders/123
    Current Page Should Be    Login Page
    Page Should Not Contain    Order #123
```

### Fixture Structure + Pipeline

```
fixtures/security/
├── permissionMatrix.ts
├── injectionPayloads.ts
├── expiredTokens.ts
└── maliciousFiles/
```

```yaml
- script: npx playwright test --grep @Security --reporter=junit
  displayName: "Security Tests"
  continueOnError: false  # BLOCKS pipeline on failure
```

### QA Verification

- [ ] `[Security]` scenarios in separate file
- [ ] Priority = Critical or High
- [ ] Permission matrix designed (if multi-role)
- [ ] OWASP checklist reviewed
- [ ] `@Security` tag on all tests
- [ ] Pipeline blocks on security failure (`continueOnError: false`)

---

## Anti-Rationalization (Dev + QA)

| Excuse | Rebuttal |
|--------|----------|
| "This is an internal tool" | Internal tools get compromised. Attackers target the weakest link. |
| "We'll add security later" | Retrofitting is 10x harder. Add it now. |
| "No one would exploit this" | Automated scanners find it. Obscurity ≠ security. |
| "The framework handles it" | Frameworks provide tools, not guarantees. Use them correctly. |
| "It's just a prototype" | Prototypes become production. Build the habit from day one. |
| "Feature has no auth" | Still has user input → injection is possible. Check the matrix. |
