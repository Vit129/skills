---
name: handoff
description: >
  This skill should be used when the user asks to "handoff", "hand off",
  "ส่งต่องาน", "pass this to codex/gemini/kiro", "switch agent",
  "continue in another session", or wants to prepare the current task
  for another AI agent, tool, or a fresh session to pick up.
argument-hint: "What should the next agent/session focus on?"
disable-model-invocation: true
version: 3.0.0
last_improved: 2026-07-02
improvement_count: 2
---

# Handoff

Write a handoff so another agent or tool (Codex, Gemini, Kiro, or a fresh
Claude session) can continue this task without re-deriving context from
scratch — into `agent-memory/CONTEXT.md`, the single hot-state file this repo
already rewrites every session. No separate file.

Name-only invocation — never auto-triggered by keyword match, only runs when
asked for explicitly (frontmatter `disable-model-invocation: true`, mirrored
in `settings.json` → `skillOverrides.handoff` for this repo's own convention).
If the user passed arguments, treat them as what the next session should
focus on and tailor the doc accordingly.

## When to Use

- **Sequential** — you're stopping (context limit, end of session, or handing off) and a different agent/session/tool continues later.
- **Parallel** — you're delegating a sub-task to another agent while you keep working elsewhere. Claim it too (step 5).

## Instructions

1. **Summarize, don't dump transcript.** A few sentences: what's done, what's left, what's blocking. `CONTEXT.md` has a ~2,500-byte budget — this is a pointer for a cold agent to resume from, not a full log.
2. **Reference, don't duplicate.** If the work is already documented (a plan in `agent-memory/plans/`, a diff, a PR, an ADR, an issue), point to the path or URL instead of re-explaining it.
3. **Suggested skills.** Name the skill(s) the next agent should invoke first (e.g. `qa-architect`, `dev-architect`) so it doesn't have to re-derive routing.
4. **Redact.** Strip API keys, tokens, passwords, and PII before writing anything.
5. **Write to `agent-memory/CONTEXT.md`** — fill the `## Handoff` block so `session-start.sh` surfaces it automatically next session:
   - `From:` — this agent/session (e.g. `claude-code`, `codex`, `gemini`)
   - `To:` — target agent, or `(open)` if unspecified
   - `Suggested skills:` — from step 3
   - `Note:` — from step 1, with path references from step 2
6. **Parallel only** — also add a line to `CONTEXT.md`'s `## Claims` section so nobody duplicates the sub-task (`- <agent> claimed: <task>`); the agent that picks it up deletes that line when done.

## Output

Confirm to the user in 1-2 lines: what was written to `## Handoff`, and whether a claim line was added.
