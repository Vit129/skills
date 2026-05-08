# LATS Simulation

Compare multiple strategies side-by-side and select the best hybrid combination.

## When to use

- Multiple valid approaches exist and you're unsure which is best
- Decision has significant impact on downstream work
- Need to justify the choice with evidence

## How it works

1. Assess complexity → decide number of simulations:
   - Simple (1-5 items): 3 simulations
   - Medium (6-15 items): 4 simulations
   - Complex (16+ items): 5 simulations (never more)
2. List what's forbidden — patterns that violate known constraints
3. Generate N distinct strategies — each must differ by at least 30%
4. Score each on relevant criteria — 0 to 10
5. Check similarity — reject if two strategies overlap >70%
6. Select hybrid — always combine the best aspects of top 2-3, never just pick one
7. Evaluation Gate — validate hybrid against 3 scenarios
8. Resilience Strategy — define retry, timeout, mocking
9. If all scores <5 → stop and ask for human input

## Scoring Criteria

### Architecture (API/Web UI)

| Criterion | What to check | Scale |
| --- | --- | --- |
| Reusability (R) | Can services/components be reused? Independent and composable? | 0-10 |
| Maintainability (M) | Easy to understand/modify? Files < 300 lines? Clear separation? | 0-10 |
| Compliance (C) | Follows api.md/webUi.md rules? Integrates with DB Strategy? | 0-10 |

Final Score: (R + M + C) / 3

### Test Scenario

| Criterion | Weight |
| --- | --- |
| Risk coverage | Highest |
| Business value | Medium |
| Implementation effort | Lowest |

## Scoring Template

```text
Sim 1: [Name] — [approach] — Score: X/10 — Strong at: [A, B]
Sim 2: [Name] — [approach] — Score: X/10 — Strong at: [C, D]
Sim 3: [Name] — [approach] — Score: X/10 — Strong at: [E]

Hybrid: [A from Sim 1] + [C from Sim 2] — because [reason]
```

## Hybrid Selection (MANDATORY)

Always propose a hybrid that combines strengths of top 2-3 simulations:

1. Identify top 2-3 simulations by score
2. Extract unique strengths from each
3. Combine complementary aspects
4. Avoid conflicting components

```text
🏆 Final Recommendation: Hybrid Pattern
- Selected: [Best aspects from top simulations]
- Justification: Combines [strength from Sim X] + [strength from Sim Y]
- Hybrid Components:
  - [Component A] from Sim [N] (Reason: [strength])
  - [Component B] from Sim [M] (Reason: [strength])
```

## Evaluation Gate (Mental Walkthrough)

Validate selected pattern against 3 real scenarios:

```text
- Happy Path: ✅/❌ (Service calls API → 200 → Updates state)
- Error Path: ✅/❌ (Try-catch → Retry logic → Fallback)
- Edge Case: ✅/❌ (Transaction lock → FIFO queue → Mutex)
```

- All 3 pass → proceed
- Any fail → reject pattern, regenerate

## Resilience Strategy (after hybrid selection)

Define retry, timeout, and mocking strategies for external dependencies:

| Dependency | Retry Policy | Timeout | Mock Strategy |
| --- | --- | --- | --- |
| {API name} | {N retries, backoff} | {ms} | {mock response or fixture} |
| {DB name} | {N retries} | {ms} | {in-memory fallback} |
| {Auth provider} | {N retries} | {ms} | {storageState or token fixture} |

Decision tree:
- External API (payment, SMS, email) → add to mock list
- Flaky service (3rd party) → add retry policy
- Slow operation (file upload, report) → increase timeout

## Locator Strategy (UI only)

Document locator priority and justifications per dynamic element:

```text
- Priority: getByRole (60%), getByLabel (25%), getByTestId (10% - dynamic content only)
- Justifications: [element] uses testId for dynamic IDs
- Fallback: [element] uses filter({ hasText }) when testId unavailable
```

## Tips

- Criteria depend on context — for architecture: reusability, maintainability, compliance. For UX: usability, performance, accessibility
- Tie-breaker: whichever scores higher on the most important criterion wins
- Don't fake diversity — if only 2 real options exist, simulate 2, not 5
- If all scores < 5 → stop and ask user for input

## Rules

- LATS simulation is internal reasoning — do NOT display to user in chat
- Write all simulation output to implementation plan Appendix silently
- Show only: "✅ LATS Simulation recorded to file"
- Never select a single pattern — always create hybrid
