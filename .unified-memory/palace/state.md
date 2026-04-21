# 🏛️ Unified Memory Palace — State (Global)

> Cross-project memory managed via `unified-memory` system.
> Structure: palace/ (narrative) + knowledge/ (patterns)

## Active Wings

- **unified-memory** — Global memory & intelligence management (last updated: 2026-04-20)
- **ai-dlc-skills** — AI-DLC skill ecosystem (last updated: 2026-04-20)

## Recent Sessions

| Date | Wing | Summary |
|------|------|---------|
| 2026-04-21 | unified-memory | Architecture decision: Hybrid Inverted Index + Sorted Date Array (no SQLite) → keyword-index.json + date-index.json, search-scaling-research.md updated ✅ |
| 2026-04-21 | unified-memory | AGENTS.md: merged 5 AIDLC rules from KIRO_STEERING.md (AIDLC first, phase gates, no shortcuts, knowledge check, language) — KIRO_STEERING.md now redundant ✅ |
| 2026-04-20 | unified-memory | GOTCHAS #29-30 added: AAAK over-compression + dirty missed in long sessions, count→30 ✅ |
| 2026-04-20 | unified-memory | AAAK taxonomy added: Keep/Compress/Drop priority order for compression decisions ✅ |
| 2026-04-20 | unified-memory | Search scaling research: DS&A analysis, inverted index JSON design, tiered strategy confirmed, Big O compared ✅ |
| 2026-04-20 | ai-dlc-skills | Updated CLAUDE.md, KIRO.md, GEMINI.md, README.md: added analysis-concept skill, user-profile keywords, hooks, unified-memory features ✅ |
| 2026-04-20 | ai-dlc-skills | Updated doc/aidlc flowchart + swimlane: memory-palace→unified-memory, added bootstrap/nudges/skills/search/evolution_log ✅ |
| 2026-04-20 | unified-memory | Merged knowledge-ingest wing → unified-memory (wiki-graph-pattern room), deleted wing, 2 wings remaining ✅ |
| 2026-04-20 | unified-memory | Bootstrap flow added (Step 0 init), GOTCHA #28, gap audit complete → spec-data 100% aligned ✅ |
| 2026-04-20 | unified-memory | Gap audit: deduped ai-dlc-skills hall.md, created skills/ folders, raw/ folder, archive/index.md → data 100% aligned with spec ✅ |
| 2026-04-20 | unified-memory | Phase 2 implemented: user modeling, auto-crystallize (DRAFT/ACTIVE/STALE), skill self-improve (auto-refine + rollback) + naming decision ✅ |
| 2026-04-20 | unified-memory | P1+P2 implemented: skill crystallization, search index, nudges, audit trail → 7 skill files + GOTCHAS #23-27 ✅ |

_Older sessions archived_

## Current Focus

- focus: ""
- blockers: ""
- next_action: ""

## Open Threads

- [ ] Search scaling implementation: Hybrid Inverted Index + Sorted Date Array decided → implement keyword-index.json + date-index.json (see wings/unified-memory/rooms/search-scaling-research.md)
- [x] AGENTS.md: adopted Trust Priority, Do-not-store, Minimum Update Contract from agent-context-kit @2026-04-21

## Placeholder Convention

```
{project_root}   = root directory of the active project (walk up from cwd)
{knowledge_root} resolves in order:
  1. {project_root}/.unified-memory/knowledge/          ← per-project (checked first)
  2. {project_root}/ai-agent/skills/ai-dlc/knowledge/   ← skills in project repo (use in company)
  3. ~/.claude/skills/ai-dlc/knowledge/                  ← user-level global fallback

{skills_root}    = {project_root}/skills/
{cwd}            = current working directory
```

> Note: `{project}` without `_root` is reserved for project **name** display only (e.g. "load memory for {project}").
> All path placeholders must use `{project_root}`.
