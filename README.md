# ~/.claude — AI Agent Workspace

Personal skill + memory system for Claude Code.

## Structure

```
~/.claude/
  CLAUDE.md              — entry point (always-on)
  settings.json          — hooks, skillOverrides, MCP
  rules/                 — core, routing, coding (loaded on-demand)
  agent-memory/
    USER-PROFILE.md      — identity + preferences (always-on)
    CONTEXT.md           — active task state
    MEMORY.md            — decisions + lessons (grep only)
    knowledge/           — promoted patterns (≥2 features)
    plans/               — AIDLC artifacts ([feature]/plan.md, tasks, outputs)
  hooks/                 — UserPromptSubmit, PostToolUse, Stop
  skills/{name}/
    SKILL.md             — trigger, format, routing (~60-90 lines)
    references/          — detail files (loaded per topic)
  plugins/ponytail/      — lazy senior dev mode (always-on)
```

## Memory Lifecycle

| Phase | Action |
|-------|--------|
| Task start | Read `CONTEXT.md`; grep `knowledge/` for patterns |
| During | Update `CONTEXT.md` inline |
| Task end | Rewrite `CONTEXT.md` → idle; append decisions to `MEMORY.md` |
| Promote | Pattern used ≥2 features → `knowledge/{domain}.md` |

## AIDLC Artifacts

All artifacts live in `agent-memory/` — same standard for every project:

| Artifact | Location |
|---|---|
| Decisions | `MEMORY.md` Decisions section |
| Plan | `plans/[feature]/plan.md` |
| Dev/QA tasks | `plans/[feature]/dev-tasks.md` / `qa-tasks.md` |
| Outputs | `plans/[feature]/outputs/` |
| Progress | `CONTEXT.md` Now section |
| Phase history | `CONTEXT.md` Completed section |
