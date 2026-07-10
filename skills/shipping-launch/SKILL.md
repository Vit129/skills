---
name: shipping-launch
description: Pre-launch checklist, staged rollout, feature flags, rollback strategy, and monitoring setup. Use when preparing to deploy to production.
version: 2.0.0
last_improved: 2026-06-30
improvement_count: 1
---

# Shipping and Launch

Ship with confidence. Every launch should be reversible, observable, and incremental.

---

## Load Right Reference

| Task | Load |
|------|------|
| Pre-launch quality/security/perf/infra/docs checks | `references/checklist.md` |
| Feature flags + staged rollout + decision thresholds | `references/rollout.md` |
| Rollback plan + trigger conditions + post-deploy verification | `references/rollback.md` |
| Monitoring setup + what to watch + first-hour protocol | `references/monitoring.md` |

---

## Anti-Rationalization

| Excuse | Rebuttal |
|--------|----------|
| "It works in staging" | Production has different data, traffic, edge cases. Monitor after deploy. |
| "We don't need feature flags" | Every feature benefits from a kill switch. Even "simple" changes break things. |
| "Monitoring is overhead" | Without monitoring, you discover problems from user complaints. |
| "We'll add monitoring later" | Add before launch. Can't debug what you can't see. |
| "Rolling back is admitting failure" | Rolling back is responsible engineering. Shipping broken is the failure. |

---

## Red Flags

- Deploying without a rollback plan
- No monitoring or error reporting in production
- Big-bang releases (everything at once)
- Feature flags with no expiration or owner
- No one monitoring the deploy for the first hour
- Production config done by memory, not code
