# ~/.claude — AI Agent Workspace

Personal skill + memory system for Claude Code.

## Structure

```
~/.claude/
  CLAUDE.md              — entry point (always-on)
  settings.json          — hooks, skillOverrides, MCP
  rules/                 — core, routing, coding (loaded on-demand)
  agent-memory/
    PLAYBOOK.md          — problem-resolution cases, scored (Applied/Prevented)
    INDEX.md             — catalog of knowledge/ and plans/
    SKILL-LOG.md         — skill improvement proposals (append-only)
    knowledge/           — promoted patterns (Applied >= 3, or 3+ same-domain cases)
    plans/               — feature planning artifacts ([feature]/design.md,
                            [feature]/GLOSSARY.md, dev-task-progress.md, outputs)
  hooks/                 — UserPromptSubmit, PostToolUse, Stop
  skills/{name}/
    SKILL.md             — trigger, format, routing (~60-90 lines)
    references/          — detail files (loaded per topic)
  plugins/ponytail/      — lazy senior dev mode (always-on)
```

## Setup on a New Machine

`settings.json` is gitignored (machine-local permissions/MCP/env) so it doesn't clone with the repo. After cloning, add to `settings.json` → `skillOverrides`:

```json
"handoff": "name-only"
```

This keeps `Skill(handoff)` on-demand only (see `skills/handoff/SKILL.md`) — without it the skill can still be invoked by name, it just also becomes eligible for auto-trigger by description match.

## Memory Lifecycle

| Phase | Action |
|-------|--------|
| Task start | Search `PLAYBOOK.md` (trigger keywords); read the active feature's `dev-task-progress.md`/`qa-task-progress.md` on continuation |
| Problem resolved | Draft a case (trigger, fix, domain, outcome), append to `PLAYBOOK.md` |
| During a new feature/interview | Resolve domain terms inline into `plans/[feature]/GLOSSARY.md` — never batch (see `skills/interview/references/domain-modeling.md`) |
| Case reused | Applied++/Prevented++ on the `PLAYBOOK.md` row |
| Promote | `PLAYBOOK.md` row reaches Applied >= 3, or 3+ cases share a domain → `knowledge/{domain}.md` |

## Feature Planning Artifacts

All artifacts live in `agent-memory/` — same standard for every project:

| Artifact | Location |
|---|---|
| Problem-resolution cases | `PLAYBOOK.md` |
| Domain glossary | `plans/[feature]/GLOSSARY.md` (per-feature) or project-root `GLOSSARY.md` (whole-project terms) |
| Dev/QA tasks | `plans/[feature]/dev-task-progress.md` / `qa-task-progress.md` |
| Design | `plans/[feature]/design.md` |
| Outputs | `plans/[feature]/outputs/` |
| Durable patterns | `knowledge/{domain}.md`, cataloged in `INDEX.md` |
