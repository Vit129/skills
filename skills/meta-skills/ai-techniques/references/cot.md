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

## Pattern 1: Architecture Decomposition

Use this when designing API/Web UI/Mobile architecture:

```text
Step 1: Count endpoints/screens — [N] total
Step 2: Group by domain — [domains with counts]
Step 3: Identify shared logic — [shared services/components]
Step 4: Check DB integration — Seed/Verify/Cleanup from Phase 2
Step 5: Determine complexity — [Simple/Medium/High] → LATS [3/4] simulations
Step 6: Verify rules — Multi-Service ✅, Async/Await ✅, No inline logic ✅

Conclusion: [N] services + [N] shared modules, [complexity] complexity
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

## Rules

- CoT analysis is internal reasoning — do NOT display to user in chat
- Write CoT output to implementation plan Appendix silently
- Use compact format (3-5 lines max) for architecture decomposition
- Show only: "✅ CoT Analysis recorded to file"
