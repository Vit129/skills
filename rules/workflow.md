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

## Skill Invocation Rule

**Before calling the Skill tool, always output a declaration line in the conversation:**

```
[Skill: {skill-name}]
```

This makes it visible to the user that a skill is actually being invoked, not just mentioned.

Example: before `Skill(skill="ha-dev")` → write `[Skill: ha-dev]` in text first.

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

## Coding Guidelines & Citation Format

Karpathy-inspired coding guidelines, citation format, and example-prompt patterns moved to `rules/coding-guidelines.md` (read on-demand when writing/editing code or citing sources).
