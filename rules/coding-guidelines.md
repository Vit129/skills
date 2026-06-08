# Coding Guidelines, Citation Format & Example Prompts

Read when: writing or editing code, citing a source/lesson/skill, or composing prompts for routing/skill-review (split out of `workflow.md` to keep the always-loaded core lean).

---

## Karpathy-Inspired Coding Guidelines

Behavioral guidelines to reduce common LLM coding mistakes.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding
**Don't assume. Don't hide confusion. Surface tradeoffs.**
Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First
**Minimum code that solves the problem. Nothing speculative.**
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.
Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes
**Touch only what you must. Clean up only your own mess.**
When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

*The test:* Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution
**Define success criteria. Loop until verified.**
Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```
Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## Citation Format

```
[from: LESSON-AUTH-001]                      ← lesson
[from: skill:qa/playwright-testing]          ← skill (new paths)
[from: memory:{wing}/{room}]                 ← memory palace
```

---

## Example Prompts

| Goal | Prompt Pattern |
|------|---------------|
| Start a feature | "I want to build X. Ask me 3 clarifying questions first." |
| Run tests in a loop | "Run tests, auto-fix failures, repeat until all pass, then report." |
| Parallel work | "Spawn subagents: A builds X, B builds Y, C writes tests for both." |
| Create a skill | "I keep doing X — turn this into a reusable skill." |
| Review quality | "Score this output 1–10 and list specific improvements to reach 9/10." |
| Improve skills | `/skill-review` — reads usage log, proposes improvements, auto-drafts for ≥3-use patterns |
| Approve a draft | "approve skill draft {name}" — merges `skills/drafts/{name}/SKILL.md` into live skill |
