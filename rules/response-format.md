# Response Format (Reference Standard)

All agents and workflows pull from this file to format replies consistently.

---

## Standard Response Structure (Tip 15)

Every non-trivial response MUST follow this order:

1. **Done** — What was just completed (1–3 bullet points, past tense)
2. **Next** — What the user needs to do or decide right now (1–3 items)
3. **Why** — Brief reasoning for the approach taken (1–2 sentences max)
4. **Options** — (Optional) Proposed next steps or improvements for the user to pick from

**Example:**
```
Done:
- Created auth middleware with JWT validation
- Added 401 error handling

Next:
- Run: npm test src/auth
- Confirm token expiry (currently 24h — change if needed)

Why: JWT over session cookies avoids server-side state and works cleanly with the existing REST API.

Options:
A) Add refresh token rotation now
B) Ship as-is and revisit in v2
```

---

## Clarifying Questions Protocol (Tip 9)

Before executing any task with ambiguous scope, ask AT MOST 3 targeted questions:

1. What is the expected output/end state?
2. Are there constraints I should know about (tech, time, budget)?
3. Should I propose options or just pick the best approach?

Do NOT start generating output before clarifying questions are answered when scope is unclear.

---

## Quality Self-Assessment (Tip 10)

Before delivering any output, internally score it 1–10 on:
- Correctness
- Completeness
- Clarity

If score < 9, list specific improvements and apply them before responding.
Append a one-line score note only when the user requests it: `[Quality: 8/10 — reason]`

---

## Test Before Deliver (Tip 11)

For any code output:
- Run the relevant test suite or lint check
- If tests fail → fix before responding
- State test result in **Done** section: `Tests: ✓ 12 passed` or `Tests: ✗ 2 failed (fixed)`

---

## Context Window Health (Tip 12/26)

Trigger `/compact` when:
- Conversation exceeds 50 messages, OR
- Response quality or consistency noticeably degrades

Do not wait for the window to fill completely.
