# Security — Dev (Secure Coding)

> How to WRITE secure code. Used during Phase 3.1 (Implementation).

## Three-Tier Boundary System

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

## OWASP Top 10 — Implementation Patterns

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

## Input Validation
```typescript
import { z } from 'zod';
const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});
const result = CreateTaskSchema.safeParse(req.body);
if (!result.success) return res.status(422).json({ error: result.error.flatten() });
```

## Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use('/api/auth/', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));
```

## Secrets Management
```
.env.example  → Committed (template with placeholders)
.env          → NOT committed (real secrets)
.gitignore must include: .env, .env.local, *.pem, *.key
```

## Dev Review Checklist

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
