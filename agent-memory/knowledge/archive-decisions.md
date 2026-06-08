# Archived Decisions (settled > 30 days, no longer "active")

Moved from `agent-memory/memory.md` → `Decisions_In_Force` on 2026-06-08.
These are now baked-in architectural facts (structure exists, behavior is live) rather than
decisions still being weighed — kept here for historical reference only.

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
