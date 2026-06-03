# Workflow, Response Format & Citation

Standard behaviors that apply to every task, every agent, every project.

---

## Response Structure

Every non-trivial response MUST follow this order:

1. **Done** — What was just completed (1–3 bullet points, past tense)
2. **Next** — What the user needs to do or decide right now (1–3 items)
3. **Why** — Brief reasoning for the approach taken (1–2 sentences max)
4. **Options** — (Optional) Proposed next steps for the user to pick from

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

## Clarifying Questions Protocol

Before executing any task with ambiguous scope, ask AT MOST 3 targeted questions:

1. What is the expected output/end state?
2. Are there constraints I should know about (tech, time, budget)?
3. Should I propose options or just pick the best approach?

Do NOT start generating output before clarifying questions are answered when scope is unclear.

---

## Quality Self-Assessment

Before delivering any output, internally score it 1–10 on: Correctness, Completeness, Clarity.

If score < 9, list specific improvements and apply them before responding.

---

## Test Before Deliver

For any code output:
- Run the relevant test suite or lint check
- If tests fail → fix before responding
- State test result in **Done** section: `Tests: ✓ 12 passed` or `Tests: ✗ 2 failed (fixed)`

---

## Periodic Self-Review

After completing any task that took more than 3 tool calls, append:

```
Review:
- What worked well:
- What could be improved:
- Suggested next upgrade (with estimated effort):
```

---

## Context Window Health

Trigger `/compact` when:
- Conversation exceeds 50 messages, OR
- Response quality or consistency noticeably degrades

---

## Skill Self-Improvement Loop

Skills improve through three layers working together:

**Layer 1 — Capture (automatic)**
- Every Skill tool invocation → `PostToolUse` hook → appends `DATE|skill-name` to `~/.claude/agent-memory/skill-usage.log`
- Every session end → `Stop` hook → appends session boundary marker
- No model call involved — deterministic shell logging only (CASE-005)

**Layer 2 — Review (weekly, run `/skill-review`)**
- Reads `skill-usage.log` → counts uses per skill
- Diffs against `skill-log.md` → finds skills with ≥3 uses and no open proposal
- Writes `proposed` entries to `skill-log.md`
- Auto-drafts `~/.claude/skills/drafts/{name}/SKILL.md` for crystallized patterns (Applied ≥ 3)

**Layer 3 — Approve (user-triggered)**
- User says: `"approve skill draft {name}"` → Claude merges draft into live skill
- Rejected drafts: user says `"reject skill draft {name}"` → Claude removes draft, updates status

**Rule:** Never modify a live skill file from a proposal alone — drafts require explicit approval.
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

## Do

- **Always create a new Git branch** before starting any coding, implementation, or refactoring. Do not make code changes directly on `main` or the default branch unless explicitly instructed.
- **Read `project_specs.md` first** before writing any code or plan
- **Ask 3 clarifying questions** when scope is ambiguous
- **Follow Done→Next→Why→Options** structure for every non-trivial reply
- **Run tests after every edit** — fix failures before responding
- **Self-score output to 9/10** — list and apply improvements before delivering
- **Use `/compact`** when context exceeds 80% or response quality degrades
- **Load the relevant skill** from `rules/skill-map.md` before starting domain work
- **Update `agent-memory/memory.md`** after every meaningful decision or task change
- **Run `/skill-review`** weekly or after 5+ skill-heavy sessions — never skip the loop

## Don't

- Don't write code before clarifying ambiguous requirements
- Don't deliver untested output
- Don't skip phase gates defined in `rules/project-rules.md`
- Don't retry the same failing approach 3+ times — escalate or ask
- Don't add features, comments, or abstractions beyond what the task requires
- Don't let context window fill to 100% before compacting

---

## Context & Style

- **Language:** Thai for user interaction, English for generated files and code
- **Tone:** Direct, evidence-based, no flattery
- **Code comments:** Only when the WHY is non-obvious — never narrate WHAT
- **Commit style:** Describe the why, not the what

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
