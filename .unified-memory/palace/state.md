# 🏛️ Unified Memory Palace — State (Global)

> Cross-project memory managed via `unified-memory` system.
> Structure: palace/ (narrative) + knowledge/ (patterns)

## Active Wings

- **unified-memory** — Global memory & intelligence management (consolidated 2026-04-18)
- **ai-dlc-skills** — AI-DLC skill ecosystem (last updated: 2026-04-18)
- **knowledge-ingest** — Wiki-Graph ingest infrastructure + rooms (last updated: 2026-04-16)

## Recent Sessions

| Date | Wing | Summary |
|------|------|---------|
| 2026-04-19 | ai-dlc-skills | Rewrote CLAUDE.md skill map to mirror ai-dlc/ category structure ✅ |
| 2026-04-18 | ai-dlc-skills | Standardized all path placeholders → `{project_root}` across 15+ skill files ✅ |
| 2026-04-18 | ai-dlc-skills | `{knowledge_root}` convention added to all 5 core SKILL.md files ✅ |
| 2026-04-18 | unified-memory | Unified Memory system audit → structure & patterns aligned with system skill ✅ |
| 2026-04-16 | knowledge-ingest | Wiki-Graph pattern ingested → room created, backlinks added, KIRO.md updated ✅ |
| 2026-04-16 | ai-dlc-skills | Backlinks added to all lesson files, Citation + Ingest workflow added to AGENT.md ✅ |
| 2026-04-14 | ai-dlc-skills | Phase A complete: enriched lesson schema, effectiveness→index only, business usage tracking ✅ |
| 2026-04-14 | ai-dlc-skills | Phase B complete: 6 workflow files updated (score-aware, intent matching, lesson sorting) ✅ |

## Open Threads

- [x] memory-palace: update SKILL.md to load both project + user level (Unified Memory System)
- [x] unified-memory: Audit system structure vs system skill (completed 2026-04-18)
- [x] ai-dlc/core/aidlc: add {knowledge_root} convention to core/aidlc/SKILL.md (Global & Per-Project support)
- [x] ai-dlc/core/analysis-skills: add {knowledge_root} convention (Global & Per-Project support)
- [x] ai-dlc/core/storage: add {knowledge_root} convention (Global & Per-Project support)
- [x] ai-dlc/core/memory-palace (unified-memory): add {knowledge_root} convention (Global & Per-Project support)
- [x] system/analysis-concept: add {knowledge_root} convention (Global & Per-Project support)
- [x] skills-wide: standardize all path placeholders to `{project_root}` — replaced {project}/, {PROJECT_ROOT}, ~/.claude/skills/ai-dlc/knowledge/ across 15+ files
- [ ] ai-dlc-skills: verify {knowledge_root} resolves correctly at runtime

## Placeholder Convention

```
{project_root}   = root directory of the active project (walk up from cwd)
{knowledge_root} resolves in order:
  1. {project_root}/.unified-memory/knowledge/   ← per-project (checked first)
  2. {project_root}/skills/knowledge/            ← global fallback (cross-project)

{skills_root}    = {project_root}/skills/
{cwd}            = current working directory
```

> Note: `{project}` without `_root` is reserved for project **name** display only (e.g. "load memory for {project}").
> All path placeholders must use `{project_root}`.
