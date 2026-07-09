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

> One source of truth — how to BUILD secure + how to TEST it's secure.

## Mode Detection (auto — do NOT ask)

| Signal | Mode | Load |
|--------|------|------|
| "secure coding", "security hardening", during `/build` | **Dev** | `references/dev.md` |
| "security scenarios", "security test", security concern flagged, test design/scripts | **QA** | `references/qa.md` |
| Feature has auth + QA task active | **Both** | both |

## When to Load This Skill

| Signal | Who | Stage |
|--------|-----|-------|
| Security concern flagged during `/spec` | QA | test design + scripts |
| Feature has login/auth/token | Both | Any |
| Feature has role-based access | Both | Any |
| Feature has user input → backend | Both | Any |
| Feature handles sensitive data (PII, financial) | Both | Any |
| "secure coding", "security hardening" | Dev | `/build` |

## Anti-Rationalization

| Excuse | Rebuttal |
|--------|----------|
| "This is an internal tool" | Internal tools get compromised. Attackers target the weakest link. |
| "We'll add security later" | Retrofitting is 10x harder. Add it now. |
| "No one would exploit this" | Automated scanners find it. Obscurity ≠ security. |
| "The framework handles it" | Frameworks provide tools, not guarantees. Use them correctly. |
| "It's just a prototype" | Prototypes become production. Build the habit from day one. |
| "Feature has no auth" | Still has user input → injection is possible. Check the matrix. |
