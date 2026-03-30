# LATS Simulation

Compare multiple strategies side-by-side and select the best hybrid combination.

## When to use
- Multiple valid approaches exist and you're unsure which is best
- Decision has significant impact on downstream work
- Need to justify the choice with evidence

## How it works
1. Assess complexity → decide number of simulations (3-5, never more)
2. List what's forbidden — patterns that violate known constraints
3. Generate N distinct strategies — each must differ by at least 30%
4. Score each on relevant criteria (e.g., reusability, maintainability, simplicity) — 0 to 10
5. Check similarity — reject if two strategies overlap >70%
6. Select hybrid — always combine the best aspects of top 2-3, never just pick one
7. Validate the hybrid against 3 scenarios: happy path, error path, edge case
8. If all scores <5 → stop and ask for human input

## Scoring template
```
Sim 1: [Name] — [approach] — Score: X/10 — Strong at: [A, B]
Sim 2: [Name] — [approach] — Score: X/10 — Strong at: [C, D]
Sim 3: [Name] — [approach] — Score: X/10 — Strong at: [E]

Hybrid: [A from Sim 1] + [C from Sim 2] — because [reason]
Validation: Happy ✅ / Error ✅ / Edge ✅
```

## Tips
- Criteria depend on context — for architecture: reusability, maintainability, compliance. For UX: usability, performance, accessibility
- Tie-breaker: whichever scores higher on the most important criterion wins
- Don't fake diversity — if only 2 real options exist, simulate 2, not 5
