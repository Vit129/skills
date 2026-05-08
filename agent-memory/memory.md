# Agent Memory — Hot State

<!-- Max 2,500 bytes. Usage updated at session end. See user-profile.md for user preferences. -->
<!-- Usage: ~2,450/2,500 bytes (98%) -->

## Task_Ledger

<!-- Max 5 entries. Coding: system/feature/phase/status | Non-Coding: domain/goal/status -->
<!-- Mark stale after 3 sessions without update. Remove oldest stale when full. -->
<!-- If all 5 active and new task needed → prompt user to archive one. -->

| # | Type | Entry | Last Updated |
|---|------|-------|--------------|
| 1 | coding | ai-dlc/multi-agent-upgrade/done — curator + self-review-rubric + subagent auto-dispatch (Phase 2.4+3.1) + scheduler (daily dev/QA, nightly regression, weekly curator) | 2026-05-05 |
| 2 | documentation | global-config/GRAPH_REPORT.md created + README.md + KIRO.md (relative ref) + copySkills.sh (bug fix: GRAPH_REPORT.md from ~/.claude/ not skills/) | 2026-05-04 |
| 3 | open-thread | graph-report-workflow: 1) สร้าง KIRO.md ใหม่ 2) copy to ai-agent via copySkills.sh (GRAPH_REPORT.md included) 3) update GRAPH_REPORT.md เมื่อมีข้อมูลสำคัญ / scripts ready | 2026-05-04 |

## Recent_Lessons

<!-- Last 5 lesson IDs only. Detail lives in playbook.md or knowledge/. -->

- CASE-001 — memory target routing: global skill changes → `.claude/agent-memory/`, project changes → `{project}/agent-memory/`
- CASE-002 — AIDLC Vibe/Spec: detection=Kiro IDE mode (not keyword), artifacts→`.aidlc/` only, dialog=global rule all agents
- CASE-004 — project_specs.md at repo root is ignored by `.gitignore` (`*` rule) — put templates in `rules/` instead
- MEM-UPGRADE-001 — Hermes-inspired: user-profile.md separates stable prefs from hot state; capacity indicator in memory.md header; zero-score playbook cases → archive after 30 days

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
- **2026-05-03**: Finance skills merged: `etf-analysis` + `portfolio-analysis` → `portfolio-etf-analysis` (mode detection: Portfolio/ETF/Combined); `mock-orchestration-prompts.md` → `orchestration-prompts.md`
- **2026-05-03**: agent-memory structure: `user-profile.md` separates stable user prefs from `memory.md` hot state; capacity indicator in memory.md header; zero-score playbook cases archived to `knowledge/archive-playbook.md` after 30 days; session-load hook v3.1.0 loads user-profile.md
- **2026-05-03**: agent-memory self-evolve: skill-evolve hook (postTaskExecution) proposes skill improvements; knowledge-curate hook (agentStop) handles promotion/crystallization/archive via subagent when threshold met; session-save v4.0 delegates heavy curation to knowledge-curate
- **2026-05-05**: ai-dlc multi-agent: `core/curator/` (grade/consolidate/prune, markdown-only, never delete); `system/agent-memory/references/self-review-rubric.md` (rubric-based review fork); `core/subagent-driven/` upgraded (auto-dispatch + runtime detection + dispatch-log.md aggregation)
