---
name: security
description: >
  Unified security rules for Dev + QA — all platforms (API, Web UI, Mobile).
  Dev: secure coding (OWASP prevention, input validation, auth patterns).
  QA: security test scenario design + automation patterns (Playwright, RF).
  Triggers: "security", "OWASP", "auth test", "permission matrix", "injection",
  "secure coding", "security hardening", "security scenarios", Pre-flight Q5 = Yes.
version: 2.0.0
last_improved: 2026-06-20
improvement_count: 1
---

# Security Rules (Dev + QA Unified)

> One source of truth for security — how to BUILD secure + how to TEST it's secure.
> Loaded when feature involves auth, permissions, user input, or sensitive data.

---

## When to Load This Skill

| Signal | Who | Phase |
|--------|-----|-------|
| Pre-flight Q5 = "Yes (security concern)" | QA | 2.2 + 2.4 |
| Feature has login/auth/token | Both | Any |
| Feature has role-based access | Both | Any |
| Feature has user input → backend | Both | Any |
| Feature handles sensitive data (PII, financial) | Both | Any |
| "secure coding", "security hardening" | Dev | 3.1 |

### Internal Analysis Steps (run automatically when this skill is loaded in Phase 2.2)

When loaded during test scenario design, execute these sub-steps internally:

1. **Codebase auth scan** — Scan existing auth/permission implementation in codebase (uses CONTEXT.md from Lite Inception). Identify: what auth middleware exists, what roles are defined, what endpoints are protected.
2. **Adversarial review (doubt-driven)** — "How can auth be bypassed?", "If attacker sends X, what happens?", "Are there unprotected endpoints?"
3. **OWASP verification (source-driven)** — Cross-check against OWASP Top 10 checklist (Part 2.3 table below). Each applicable item → 1 `[Security]` scenario.

Output: list of security test conditions → feeds directly into scenario design batches.

---

## Part 1: Dev — Secure Coding (Prevention)

> How to WRITE secure code. Used during Phase 3.1 (Implementation).

### 1.1 Three-Tier Boundary System

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
- Adding file upload handlers
- Modifying rate limiting
- Granting elevated permissions

**Never Do:**
- Commit secrets to version control
- Log sensitive data (passwords, tokens, full card numbers)
- Trust client-side validation as security boundary
- Disable security headers for convenience
- Use `eval()` or `innerHTML` with user data
- Store auth tokens in localStorage
- Expose stack traces to users

### 1.2 OWASP Top 10 — Implementation Patterns

#### Injection (SQL, NoSQL, Command)
```typescript
// BAD
const query = `SELECT * FROM users WHERE id = '${userId}'`;

// GOOD: Parameterized
const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

// GOOD: ORM
const user = await prisma.user.findUnique({ where: { id: userId } });
```

#### Broken Authentication
```typescript
import { hash, compare } from 'bcrypt';
const SALT_ROUNDS = 12;
const hashedPassword = await hash(plaintext, SALT_ROUNDS);

// Session config
cookie: { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 }
```

#### XSS (Cross-Site Scripting)
```typescript
// BAD
element.innerHTML = userInput;

// GOOD: Framework auto-escaping (React)
return <div>{userInput}</div>;

// If MUST render HTML → sanitize
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
```

#### Broken Access Control
```typescript
app.patch('/api/tasks/:id', authenticate, async (req, res) => {
  const task = await taskService.findById(req.params.id);
  if (task.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'FORBIDDEN' });
  }
  // proceed
});
```

#### Security Misconfiguration
```typescript
import helmet from 'helmet';
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(','), credentials: true }));
```

### 1.3 Input Validation Pattern
```typescript
import { z } from 'zod';

const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

app.post('/api/tasks', async (req, res) => {
  const result = CreateTaskSchema.safeParse(req.body);
  if (!result.success) return res.status(422).json({ error: result.error.flatten() });
  const task = await taskService.create(result.data);
  return res.status(201).json(task);
});
```

### 1.4 Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use('/api/auth/', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));
```

### 1.5 Secrets Management
```
.env.example  → Committed (template with placeholders)
.env          → NOT committed (real secrets)
.gitignore must include: .env, .env.local, *.pem, *.key
```

---

## Part 2: QA — Test Scenario Design (Verification)

> How to DESIGN security test scenarios. Used during Phase 2.2 (Test Case Design).

### 2.1 [Security] Category

- `[Security]` is a standalone prefix — NEVER use `[Alternative]` for security cases
- **Separate file:** `testScenarioPbi{ID}-security.md` (covers all platforms)
- **Priority:** Critical (auth bypass, injection) or High (permission, rate limit)
- **Tag:** `@Security` in automation

### 2.2 Title Convention

```
[{Platform}][Security] {verb} {what} {condition}
```

Examples:
- `[API][Security] ปฏิเสธ access เมื่อไม่มี token`
- `[API][Security] ป้องกัน SQL injection ใน search field`
- `[UI][Security] ป้องกัน XSS เมื่อกรอก script tag ในช่อง name`
- `[API][Security] จำกัด rate limit login ไม่เกิน 5 ครั้ง/นาที`
- `[Mobile][Security] ปฏิเสธ access เมื่อ session หมดอายุ`

### 2.3 OWASP-Based Test Conditions

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

### 2.4 Permission Matrix

```markdown
| Role | Create | Read Own | Read All | Update | Delete | Expected |
|------|--------|----------|----------|--------|--------|----------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | 200 |
| Manager | ✅ | ✅ | ✅ | ✅ | ❌ | 403 on delete |
| User | ✅ | ✅ | ❌ | own only | ❌ | 403 on others |
| Guest | ❌ | ❌ | ❌ | ❌ | ❌ | 401 |
```

Each ❌ = 1 `[Security]` scenario. Each "own only" = 1 IDOR scenario.

### 2.5 Minimum Security Scenarios

| Feature type | Minimum [Security] scenarios |
|---|---|
| Has auth (login/token) | 3: no token, expired token, invalid token |
| Has roles (multi-user) | Permission matrix: 1 per denied action per role |
| Has user input → DB | 2: SQL injection, XSS |
| Has file upload | 2: wrong type, oversized |
| Has sensitive data in response | 1: verify PII not leaked |
| Has rate-limited action | 1: exceed limit |

---

## Part 3: QA — Automation Patterns (Playwright)

> How to IMPLEMENT security tests. Used during Phase 2.4 (Test Script).

### 3.1 Unauthorized Access
```typescript
test.describe('@Critical @Security Authentication', () => {
  test('reject without token [Security]', async ({ request }) => {
    const res = await request.get('/api/v1/orders', { headers: { Authorization: '' } });
    expect(res.status()).toBe(401);
  });

  test('reject expired token [Security]', async ({ request }) => {
    const res = await request.get('/api/v1/orders', { headers: { Authorization: `Bearer ${expiredToken}` } });
    expect(res.status()).toBe(401);
  });
});
```

### 3.2 Permission Matrix (data-driven)
```typescript
import { permissionMatrix } from '../fixtures/security/permissionMatrix';

test.describe('@Critical @Security RBAC', () => {
  for (const { role, action, resource, expectedStatus } of permissionMatrix) {
    test(`${role} ${action} ${resource} → ${expectedStatus} [Security]`, async ({ request }) => {
      const token = await getTokenForRole(role);
      const res = await request[action.toLowerCase()](`/api/v1/${resource}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status()).toBe(expectedStatus);
    });
  }
});
```

### 3.3 IDOR
```typescript
test('cannot access other user resource [Security]', async ({ request }) => {
  const userAToken = await getTokenForUser('userA');
  const res = await request.get('/api/v1/orders/userB-order-id', {
    headers: { Authorization: `Bearer ${userAToken}` },
  });
  expect(res.status()).toBe(403);
});
```

### 3.4 Input Injection
```typescript
import { injectionPayloads } from '../fixtures/security/injectionPayloads';

test.describe('@High @Security Injection', () => {
  for (const payload of injectionPayloads) {
    test(`reject: ${payload.label} [Security]`, async ({ request }) => {
      const res = await request.post('/api/v1/search', { data: { query: payload.value } });
      expect(res.status()).not.toBe(500);
      expect(await res.text()).not.toContain(payload.errorSignal);
    });
  }
});
```

### 3.5 Rate Limiting
```typescript
test('enforce rate limit [Security]', async ({ request }) => {
  const attempts = Array.from({ length: 10 }, () =>
    request.post('/api/v1/auth/login', { data: { email: 'x@x.com', password: 'wrong' } })
  );
  const responses = await Promise.all(attempts);
  expect(responses.filter(r => r.status() === 429).length).toBeGreaterThan(0);
});
```

### 3.6 File Upload
```typescript
test.describe('@High @Security Upload', () => {
  test('reject executable [Security]', async ({ request }) => {
    const res = await request.post('/api/v1/upload', {
      multipart: { file: { name: 'x.exe', mimeType: 'application/x-msdownload', buffer: Buffer.from('MZ') } },
    });
    expect(res.status()).toBe(400);
  });

  test('reject oversized [Security]', async ({ request }) => {
    const res = await request.post('/api/v1/upload', {
      multipart: { file: { name: 'big.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(11 * 1024 * 1024) } },
    });
    expect(res.status()).toBe(413);
  });
});
```

---

## Part 4: QA — Mobile Patterns (Robot Framework)

### 4.1 Session Expiry
```robot
[Security] Reject Access When Session Expired
    [Tags]    @Security    @Critical
    Login As    valid_user
    Force Session Expiry
    Navigate To    Profile Page
    Page Should Contain    Session expired
    Current Page Should Be    Login Page
```

### 4.2 Deep Link Without Auth
```robot
[Security] Block Deep Link Without Auth
    [Tags]    @Security    @High
    Open Deep Link    myapp://orders/123
    Current Page Should Be    Login Page
    Page Should Not Contain    Order #123
```

---

## Part 5: Fixture Structure + Pipeline

### Fixtures
```
fixtures/security/
├── permissionMatrix.ts
├── injectionPayloads.ts
├── expiredTokens.ts
└── maliciousFiles/
```

### Pipeline
```yaml
- script: |
    npx playwright test --grep @Security --reporter=junit
  displayName: "Security Tests"
  continueOnError: false  # BLOCKS pipeline on failure
```

**Rule:** Security test failures BLOCK pipeline (`continueOnError: false`).

---

## Part 6: Dev Review Checklist

```markdown
### Authentication
- [ ] Passwords hashed (bcrypt, salt ≥ 12)
- [ ] Sessions httpOnly, secure, sameSite
- [ ] Login has rate limiting
- [ ] Reset tokens expire + single-use

### Authorization
- [ ] Every endpoint checks permissions
- [ ] Users can only access own resources (no IDOR)
- [ ] Admin actions require admin role

### Input
- [ ] All input validated at boundary
- [ ] SQL queries parameterized
- [ ] HTML output encoded/escaped

### Data
- [ ] No secrets in code/VCS
- [ ] Sensitive fields excluded from API responses
- [ ] PII encrypted at rest (if applicable)

### Infrastructure
- [ ] Security headers configured (helmet)
- [ ] CORS restricted to known origins
- [ ] Dependencies audited (`npm audit`)
- [ ] Error messages don't expose internals
```

---

## Anti-Rationalization

| Excuse | Rebuttal |
|--------|----------|
| "This is an internal tool" | Internal tools get compromised. Attackers target weakest link. |
| "We'll add security later" | Retrofitting is 10x harder. Add it now. |
| "No one would exploit this" | Automated scanners find it. Obscurity ≠ security. |
| "The framework handles it" | Frameworks provide tools, not guarantees. Use them correctly. |
| "It's just a prototype" | Prototypes become production. Security habits from day one. |
| "Feature has no auth" | Still has user input → injection is possible. Check the matrix. |

---

## Verification

**Dev:**
- [ ] `npm audit` — no critical/high vulnerabilities
- [ ] No secrets in source code or git history
- [ ] All user input validated at boundaries
- [ ] Auth + authz checked on every protected endpoint
- [ ] Security headers present
- [ ] Error responses don't expose internals

**QA:**
- [ ] `[Security]` scenarios in separate file
- [ ] Priority = Critical or High
- [ ] Permission matrix designed (if multi-role)
- [ ] OWASP checklist reviewed
- [ ] `@Security` tag on all tests
- [ ] Pipeline blocks on security failure

---

## Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md`
- **Hook:** `skill-improve.json` logs corrections
- **Promotion:** 3x same issue → auto-fix + bump version
