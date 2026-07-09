---
name: security
description: >
  Unified security rules for Dev + QA — all platforms (API, Web UI, Mobile).
  Dev: secure coding (OWASP prevention, input validation, auth patterns).
  QA: security test scenario design + automation patterns (Playwright, RF).
  Triggers: "security", "OWASP", "auth test", "permission matrix", "injection",
  "secure coding", "security hardening", "security scenarios", security concern flagged during /spec.
version: 2.1.0
last_improved: 2026-06-25
improvement_count: 2
---

# Security

> One source of truth — how to BUILD secure + how to TEST it's secure. `references/rules.md` has both halves (Dev + QA) in one file — a security feature always needs both together, splitting them saved nothing.

## Load

| Task | Load |
|------|------|
| Secure coding, security test design, or both | `references/rules.md` |

## When to Load This Skill

| Signal | Who | Stage |
|--------|-----|-------|
| Security concern flagged during `/spec` | QA | test design + scripts |
| Feature has login/auth/token | Both | Any |
| Feature has role-based access | Both | Any |
| Feature has user input → backend | Both | Any |
| Feature handles sensitive data (PII, financial) | Both | Any |
| "secure coding", "security hardening" | Dev | `/build` |
