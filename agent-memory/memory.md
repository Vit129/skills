# Agent Memory — Hot State

<!-- Max file size: 2,500 bytes. Consolidate when exceeded. -->

## Task_Ledger

<!-- Max 5 entries. Coding: system/feature/phase/status | Non-Coding: domain/goal/status -->
<!-- Mark stale after 3 sessions without update. Remove oldest stale when full. -->
<!-- If all 5 active and new task needed → prompt user to archive one. -->

| # | Type | Entry | Last Updated |
|---|------|-------|--------------|
| 1 | coding | agent-memory-system/slim-structure/done | 2026-04-30 |
| 2 | coding | ai-dlc-skills/vibe-spec-mode-v2/done | 2026-04-29 |
| 3 | coding | claude-code-tips/27-tip-framework/done | 2026-05-01 |

## Recent_Lessons

<!-- Last 5 lesson IDs only. Detail lives in playbook.md or knowledge/. -->

- CASE-001 — memory target routing: global skill changes → `.claude/agent-memory/`, project changes → `{project}/agent-memory/`
- CASE-002 — AIDLC Vibe/Spec: detection=Kiro IDE mode (not keyword), artifacts→`.aidlc/` only, dialog=global rule all agents
- CASE-004 — project_specs.md at repo root is ignored by `.gitignore` (`*` rule) — put templates in `rules/` instead

## Skill_Flags

<!-- Max 5 entries. Auto-clear when 3 consecutive successes. -->
<!-- When full, replace entry with most successes since flagging. -->

| Skill | Domain | Failure | Flagged | Successes |
|-------|--------|---------|---------|-----------|

## Decisions_In_Force

<!-- Active decisions that persist across sessions. Remove when superseded. -->

- **2026-04-29**: Agent memory uses `agent-memory/` at project root (not `skills/system/` or `.memory/`)
- **2026-04-29**: Memory file naming: `memory.md` (hot state), `playbook.md` (fixes), `skill-log.md` (evolution)
- **2026-04-29**: Save/Discard Gate: 3 criteria (novel/recur/non-trivial), 2/3 = save, evidence-gated per domain
- **2026-04-29**: Skill templates live in `skills/system/agent-memory/references/templates/` — separate from live data in `agent-memory/`
- **2026-04-29**: Memory target routing — global skill/hook/rule edits → `.claude/agent-memory/`; project edits → `{project}/agent-memory/`; both → both
- **2026-04-29**: AIDLC dialog format is a global rule for ALL phases, ALL agents (Kiro, Claude Code, Gemini, etc.)
- **2026-04-29**: Derived files (graph.md, tunnels.md, archive/, domain indexes) cut — Markdown-native core files only
- **2026-05-01**: 27-tip framework merged to main — rules/response-format.md, rules/workflow.md, rules/project_specs.template.md, .claude/settings.json (bypass), skills/claude-code-tips/SKILL.md all live
- **2026-05-03**: Finance research subagents are bounded evidence lanes only; the main agent owns the final investment call; major claims need source/date labels and unknowns use `N/A`
