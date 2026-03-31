# Chain of Thought (CoT)

Break a complex problem into explicit sequential steps before producing a final answer.

## When to use
- Problem has multiple interacting parts
- Risk of skipping a step or making a wrong assumption
- Need traceable reasoning for review later

## How it works
1. State the problem clearly
2. Decompose into numbered steps — each step produces a concrete intermediate result
3. Execute steps in order — no skipping
4. Conclude based on accumulated results

## Tips
- Keep each step to 1-3 lines — compact is better than verbose
- If a step reveals new complexity, add a sub-step instead of cramming
- After finishing, do a self-review: pick one adversarial method and challenge your own output
  - Pre-mortem: "Assume this fails — what did I miss?"
  - Inversion: "How would I guarantee this breaks?"
  - Red Team: "If I were a malicious user, what would I try?"
  - Constraint Removal: "What if there were no validation? What breaks?"
  - Stakeholder lens: "Does this look right from every user role?"

## Example: Architecture Decomposition
```
Problem: Design API structure for a booking system

Step 1: Count endpoints — 8 total (CRUD bookings + auth + search)
Step 2: Group by domain — Auth (2), Booking (4), Search (2)
Step 3: Identify shared logic — Auth token reused across all, date validation shared
Step 4: Complexity — Medium (8 endpoints, 3 domains) → 4 LATS simulations
Step 5: Verify — Multi-service ✅, no inline logic ✅, DB integration needed ✅

Conclusion: 3 services + 1 shared auth module, medium complexity
```

## Pattern 2: Test Scenario Design

Use this 5-step CoT specifically when designing test scenarios:

1. **Requirements Analysis** — extract all acceptance criteria (AC), business rules (BR), and UI behaviors from user stories
2. **Scenario Identification** — for each AC/BR, identify: Success path, Alternative paths, Edge cases (BVA, null, special chars, temporal mismatch, semantic equivalence, rollback)
3. **Test Steps Breakdown** — for each scenario, write step-by-step: Pre-conditions → Actions → Expected Results
4. **Advanced Elicitation** — challenge your scenarios using all 5 methods:
   - Pre-mortem: "Assume this feature fails in production — what scenario did I miss?"
   - Inversion: "How would I guarantee this feature breaks?"
   - Red Team: "If I were a malicious user, what would I try?"
   - Constraint Removal: "What if there were no validation? What breaks?"
   - Stakeholder Mapping: "Does this cover admin, user, guest, API consumer perspectives?"
5. **Coverage Verification** — calculate: Total AC: {N} / Covered AC: {N} / Coverage: {%}. MUST be 100% before proceeding.
