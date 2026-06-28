# ~/.claude — AI Agent Workspace

Personal skill + memory system for Claude Code. One place to define how every session behaves.

---

## Structure

```
~/.claude/
  CLAUDE.md              — entry point (always-on)
  settings.json          — Claude Code settings (hooks, skillOverrides, MCP)
  rules/
    core.md              — trust priority, response format, do/don't
    routing.md           — AIDLC gates, skill routing table
    coding.md            — coding principles (loaded on-demand before code tasks)
  agent-memory/
    USER-PROFILE.md      — identity, preferences (always-on)
    CONTEXT.md           — active task state (on-demand)
    MEMORY.md            — past decisions + lessons (grep, never read full)
    skill-usage.log      — PostToolUse hook auto-log (DATE|skill-name)
    knowledge/           — promoted domain patterns
    plans/               — AIDLC feature artifacts ([feature]/plan.md, tasks, outputs)
  hooks/
    skill-trigger.py     — UserPromptSubmit: keyword → Skill() injection
    skill-keywords.json  — keyword → skill mapping (finance, language, cross-domain)
  skills/
    {name}/
      SKILL.md           — trigger, format, examples (~60-90 lines)
      references/        — on-demand reference files (loaded per topic)
  plugins/
    marketplaces/ponytail/AGENTS.md  — lazy senior dev mode (always-on)
```

---

## Skills System

### 3-Tier Ladder

Every skill follows: **step (SKILL.md) → reference (in-skill) → external file (references/)**

- `SKILL.md` — trigger, format, 1-2 examples, routing table (~60-90 lines)
- `references/*.md` — detailed content loaded only when needed (API docs, exercise types, grammar patterns, etc.)

**Laddered skills:** `macos-swiftui`, `japanese-practice`, `english-practice`, `review-personas`, `find-mismatch`, `postman-to-playwright`, `portfolio`, `stock-deep-analysis`

### name-only Skills (user-invoked only)

Skills with no auto-trigger get `"name-only"` in `settings.json → skillOverrides`. Description hidden from context; invoke via `/skill-name`.

Finance cluster: `portfolio`, `stock-deep-analysis`, `stock-peer-comparison`, `tradingagents-orchestrator`, `earnings-preview`, `idea-generation`

Language: `english-practice`, `japanese-practice`

Others: `shipping-launch`, `skill-creator`, `fitness`, `thai-accountant`, `ui-to-text`

---

## Hooks

### UserPromptSubmit

1. **Context check** — injects `CONTEXT.md` if task is active; sets memory-pending flag check
2. **Skill trigger** — `hooks/skill-trigger.py` matches keywords against `skill-keywords.json` → injects `invoke Skill(X)` instruction

### PostToolUse (Skill)

Logs every skill invocation to `agent-memory/skill-usage.log` for `/skill-review` weekly analysis.

### Stop

Sets `.memory-pending` flag if `CONTEXT.md` is not idle → next session shows memory reminder.

---

## Memory Lifecycle

| Phase | Action |
|-------|--------|
| Task start | Read `CONTEXT.md` on-demand; grep `knowledge/` for relevant patterns |
| During | Update `CONTEXT.md` inline as state changes |
| Task end | Rewrite `CONTEXT.md` (status→idle); append decisions to `MEMORY.md` |
| Pattern promotion | Fix/pattern → `knowledge/cases/`; domain → `knowledge/{domain}.md` |

---

## AIDLC Artifacts

All AIDLC artifacts live in `agent-memory/` — consistent across every project:

| AIDLC artifact | Location |
|---|---|
| Decisions | `MEMORY.md` Decisions section |
| Plan | `agent-memory/plans/[feature]/plan.md` |
| Dev/QA tasks | `agent-memory/plans/[feature]/dev-tasks.md` / `qa-tasks.md` |
| Outputs | `agent-memory/plans/[feature]/outputs/` |
| Progress | `CONTEXT.md` Now section |
| Phase history | `CONTEXT.md` Completed section |


---

## Agent Routing

Claude Code handles all phases — architect, plan, implement, review.

Browser: Harness MCP first (`harnessBrowserOpen`). Fall back only when Harness lacks the capability.
