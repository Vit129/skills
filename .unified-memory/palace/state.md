# 🏛️ Unified Memory Palace — State (Global)

> Cross-project memory managed via `unified-memory` system.
> Structure: palace/ (narrative) + knowledge/ (patterns)

## Active Wings

- **unified-memory** — Global memory & intelligence management (last updated: 2026-04-20)
- **ai-dlc-skills** — AI-DLC skill ecosystem (last updated: 2026-04-20)

## Recent Sessions

| Date | Wing | Summary |
|------|------|---------|
| 2026-04-22 | ai-dlc-skills | Registered impeccable-design in AGENTS.md Skill Map (both .claude/skills/ and .claude/.agents/) — keywords: design quality, anti-AI-slop, typography, OKLCH, craft UI, polish UI ✅ |
| 2026-04-22 | ai-dlc-skills | Discovered impeccable-design not registered in AGENTS.md Skill Map — needs entry under ai-dlc/dev/ section |
| 2026-04-22 | ai-dlc-skills | Added impeccable-design skill to dev/ from pbakaus/impeccable — SKILL.md + 9 references (typography, color, spatial, motion, interaction, responsive, ux-writing, craft, extract) ✅ |
| 2026-04-21 | ai-dlc-skills | setupAgentSkills.sh: root/absolute path support + level-by-level search (shallowest first) + removed gitignore — all 3 copies synced ✅ |
| 2026-04-21 | unified-memory, ai-dlc-skills | Synced search index refs across all skills: UNIFIED_MEMORY_README.md, aidlc-flowchart.md, aidlc-swimlane.md updated to hybrid search ✅ |
| 2026-04-21 | unified-memory | Implemented Hybrid Search: keyword-index.json + date-index.json created; storage.md, session.md, SKILL.md updated with full algorithm ✅ |
| 2026-04-21 | unified-memory | Architecture decision: Hybrid Inverted Index + Sorted Date Array (no SQLite) → keyword-index.json + date-index.json, search-scaling-research.md updated ✅ |
| 2026-04-21 | unified-memory | README.md: replaced ~/.claude/ with {skills_root}/ placeholder, added scripts/setup/ and doc/ to structure ✅ |
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

- [x] Search scaling implementation: Hybrid Inverted Index + Sorted Date Array implemented → keyword-index.json + date-index.json created, storage.md + session.md + SKILL.md updated @2026-04-21
- [x] AGENTS.md: adopted Trust Priority, Do-not-store, Minimum Update Contract from agent-context-kit @2026-04-21
- [x] Fix BASE_DIR walk-up level in setupAgentSkills.sh — replaced hardcoded `../../..` with `.git/` detection loop, all 3 copies synced @2026-04-21
- [ ] Add to setupAgentSkills.sh: resolve {project_root} placeholder in GEMINI.md/KIRO.md to correct relative path based on install depth
- [x] Add impeccable-design to AGENTS.md Skill Map under ai-dlc/dev/ section @2026-04-22

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
