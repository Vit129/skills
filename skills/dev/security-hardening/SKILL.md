---
name: security-hardening
description: Secure coding practices based on OWASP Top 10. Use when handling user input, authentication, data storage, or external integrations. Complements security-scanning (CI tools) with design-time prevention.
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# Security and Hardening

## AIDLC Gate

⚠️ If this skill is triggered as part of a coding/QA task:
- AIDLC governance MUST be active (`.aidlc/` folder exists with DECISIONS + PLAN)
- If not → STOP and route to `governance/aidlc/` first
- Exception: pure investigation/analysis (no code changes) can proceed without AIDLC


## Overview

Security-first development practices. Treat every external input as hostile, every secret as sacred, every authorization check as mandatory. This skill covers **prevention** (how to write secure code) — complementing `devops-pipeline/security-scanning.md` which covers **detection** (CI tools like Trivy, CodeQL).

## When to Use

- Building anything that accepts user input
- Implementing authentication or authorization
- Storing or transmitting sensitive data
- Integrating with external APIs or services
- Adding file uploads, webhooks, or callbacks
- Handling payment or PII data

## Three-Tier Boundary System

### Always Do (No Exceptions)

- Validate all external input at system boundary
- Parameterize all database queries — never concatenate user input into SQL
- Encode output to prevent XSS (use framework auto-escaping)
- Use HTTPS for all external communication
- Hash passwords with bcrypt/scrypt/argon2 (salt rounds ≥ 12)
- Set security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- Use httpOnly, secure, sameSite cookies for sessions
- Run `npm audit` before every release

### Ask First (Requires Human Approval)

- Adding new authentication flows
- Storing new categories of sensitive data (PII, payment)
- Adding external service integrations
- Changing CORS configuration
- Adding file upload handlers
- Modifying rate limiting
- Granting elevated permissions

### Never Do

- Commit secrets to version control
- Log sensitive data (passwords, tokens, full card numbers)
- Trust client-side validation as security boundary
- Disable security headers for convenience
- Use `eval()` or `innerHTML` with user data
- Store auth tokens in localStorage
- Expose stack traces to users

## OWASP Top 10 Prevention

### 1. Injection (SQL, NoSQL, Command)

```typescript
// BAD: SQL injection
const query = `SELECT * FROM users WHERE id = '${userId}'`;

// GOOD: Parameterized query
const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

// GOOD: ORM
const user = await prisma.user.findUnique({ where: { id: userId } });
```

### 2. Broken Authentication

```typescript
import { hash, compare } from 'bcrypt';
const SALT_ROUNDS = 12;
const hashedPassword = await hash(plaintext, SALT_ROUNDS);

// Session config
cookie: {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000,
}
```

### 3. XSS (Cross-Site Scripting)

```typescript
// BAD
element.innerHTML = userInput;

// GOOD: Framework auto-escaping (React)
return <div>{userInput}</div>;

// If MUST render HTML → sanitize
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
```

### 4. Broken Access Control

```typescript
// Always check authorization, not just authentication
app.patch('/api/tasks/:id', authenticate, async (req, res) => {
  const task = await taskService.findById(req.params.id);
  if (task.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'FORBIDDEN' });
  }
  // proceed
});
```

### 5. Security Misconfiguration

```typescript
import helmet from 'helmet';
app.use(helmet());

// CORS — restrict to known origins
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
}));
```

## Input Validation Pattern

```typescript
import { z } from 'zod';

const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

app.post('/api/tasks', async (req, res) => {
  const result = CreateTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({ error: result.error.flatten() });
  }
  const task = await taskService.create(result.data);
  return res.status(201).json(task);
});
```

## Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// General API
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Stricter for auth
app.use('/api/auth/', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));
```

## Secrets Management

```
.env.example  → Committed (template with placeholders)
.env          → NOT committed (real secrets)
.env.local    → NOT committed (local overrides)

.gitignore must include: .env, .env.local, *.pem, *.key
```

## Security Review Checklist

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
- [ ] Security headers configured
- [ ] CORS restricted to known origins
- [ ] Dependencies audited
- [ ] Error messages don't expose internals
```

## Anti-Rationalization

| Excuse | Rebuttal |
|--------|----------|
| "This is an internal tool" | Internal tools get compromised. Attackers target weakest link. |
| "We'll add security later" | Retrofitting is 10x harder. Add it now. |
| "No one would exploit this" | Automated scanners will find it. Obscurity ≠ security. |
| "The framework handles it" | Frameworks provide tools, not guarantees. Use them correctly. |
| "It's just a prototype" | Prototypes become production. Security habits from day one. |

## Red Flags

- User input passed directly to queries, shell, or HTML
- Secrets in source code or commit history
- Endpoints without auth/authz checks
- Wildcard CORS (`*`)
- No rate limiting on auth endpoints
- Stack traces exposed to users
- Dependencies with known critical CVEs


## Consistency Contract

> These steps MUST execute in the same order every time this skill runs.
> Output may vary, but the workflow is fixed.
> If any step is skipped without a documented skip condition, the session-save hook will flag this skill.

## Verification

- [ ] `npm audit` shows no critical/high vulnerabilities
- [ ] No secrets in source code or git history
- [ ] All user input validated at boundaries
- [ ] Auth + authz checked on every protected endpoint
- [ ] Security headers present (check DevTools)
- [ ] Error responses don't expose internals
- [ ] Rate limiting active on auth endpoints


---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| OWASP Top 10 guidelines | Security standard | Prevention patterns for common vulnerabilities |
| Existing auth patterns in codebase | Source code | Understand current security posture |
| Threat model (if exists) | Security analysis | Identify attack surfaces and priorities |
| `npm audit` / dependency scan results | Vulnerability data | Known CVEs in current dependencies |
| `knowledge/lessons/` | Lessons learnt | Check before execute |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After threat assessment | Checkbox (confirm attack surfaces) | After identifying vulnerabilities/risks |
| Before implementing security changes | Single select (approach options) | Before modifying auth, CORS, rate limiting |
| New sensitive data category | Open field | When storing new PII/payment data |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.

## Self-Learning

After user approves the output:

1. **Record good example:** Save approved output to `knowledge/lessons/security/{pattern}.md`
2. **Record failures:** If output was rejected → note what went wrong for next time
3. **Progressive update:** If a new pattern proved effective → append to relevant knowledge index
4. **Confidence tracking:** `confidence: 1.0` (user-approved) vs `confidence: 0.7` (auto-generated)

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
