# Doubt-Driven Review

Adversarial self-review before non-trivial output stands.

## When (any one is true)
- Branching logic / crosses module boundary
- Type system can't verify (thread safety, idempotence, ordering)
- Blast radius is irreversible (prod deploy, migration, public API)
- Reviewing a plan, PR, or design doc

## Process

**CLAIM** — name the decision:
```
CLAIM: [what stands — 2-3 lines]
WHY IT MATTERS: [impact if wrong]
```
Can't write it compactly → you have a vibe, not a decision.

**SIMPLIFY?** — before reviewing, ask:
- Do nothing — is the problem real?
- Delete instead — does removing fix it?
- Simpler alternative — half the code, same result?

**EXTRACT** — isolate the smallest unit to challenge.

**DOUBT** — adversarial questions:
- What assumption would make this wrong?
- What's the worst realistic failure mode?
- What does this break that already works?
- Is the blast radius bounded?

**RECONCILE** — classify findings:
| Level | Meaning | Action |
|---|---|---|
| Critical | Wrong output / data loss / security | Fix before proceeding |
| Important | Degraded behavior under load/edge | Fix or explicitly accept risk |
| Minor | Style, naming, non-load-bearing | Note, fix later |

**STOP** — after reconciling critical + important findings. Minor = log only.
