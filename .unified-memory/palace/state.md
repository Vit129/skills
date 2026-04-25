# 🏛️ Unified Memory Palace — State (Global)

> Cross-project memory managed via `unified-memory` system.
> Structure: palace/ (narrative) + knowledge/ (patterns)

## Active Wings

- **unified-memory** — Global memory & intelligence management (last updated: 2026-04-20)
- **ai-dlc-skills** — AI-DLC skill ecosystem (last updated: 2026-04-20)

## Recent Sessions

| Date | Wing | Summary |
|------|------|---------|
| 2026-04-24 | unified-memory | Completed Agent Framework v2.0: added final 5 rules (Performance Awareness, Security Checklist, Testing Strategy, Backwards Compatibility, Documentation Standard); agent-core.md now 10 mandatory rules; all agents synced; README updated; framework 100% complete ✅ |
| 2026-04-24 | unified-memory | Added 5 mandatory agent rules: Plan Mode (⚠️ before non-trivial work), Design & Craftsmanship (tokens, components, hierarchy, anti-slop), Escalation & Handoff (when to STOP), Quality Gates (pre-done checklist), Error Recovery (diagnose→adjust→verify→escalate); created communication-style.md guide; synced all agent configs ✅ |
| 2026-04-24 | unified-memory | Final SSOT polish: removed non-existent AGENTS.md from reading order in agent-core.md; trust priority now references .claude/shared/ files (skill-map, project-rules, citation-format) ✅ |
| 2026-04-24 | unified-memory | Finalized SSOT: extracted skill-map.md, project-rules.md, citation-format.md → .claude/shared/; updated sync script to read from files (not markers); removed markers from project CLAUDE.md ✅ |
| 2026-04-24 | unified-memory | Implemented SSOT architecture: `.claude/shared/agent-core.md` + sync script → generated ~/.codex/CODEX.md, ~/.gemini/GEMINI.md; project CLAUDE.md now thin adapter ✅ |
| 2026-04-24 | unified-memory | Removed all hooks from settings.json → state.md as CLAUDE.md instruction (turn start: read, turn end: update) ✅ |
| 2026-04-23 | ai-dlc-skills | Added EN triggers to stock-deep-analysis/SKILL.md (was TH-only); all 21 SKILL.md files now bilingual EN+TH ✅ |
| 2026-04-23 | ai-dlc-skills | Added TH translations to description field of all 19 SKILL.md files (EN-only → bilingual EN+TH fuzzy triggers) ✅ |
| 2026-04-23 | ai-dlc-skills | Fixed last 2 citation refs in KIRO.md/CLAUDE.md: skill:playwright-rules → skill:ai-dlc/rules/playwright-rules — grep now clean ✅ |
| 2026-04-23 | ai-dlc-skills | Final: all Skill Map paths + doc diagrams now use ai-dlc/rules/ full prefix consistently ✅ |
| 2026-04-23 | ai-dlc-skills | Final sweep: updated ALL bare skill name references across 15 files (rules/, core/, qa/, doc/) to use full ai-dlc/rules/ paths ✅ |
| 2026-04-23 | ai-dlc-skills | Updated all qa/ SKILL.md files (playwright-testing, robotframework-testing, test-scenario, postman) to use full ai-dlc/rules/ paths instead of bare skill names ✅ |
| 2026-04-23 | ai-dlc-skills | Switched all cross-skill references from relative paths (../../) to {skills_root} paths (ai-dlc/rules/...) for portability ✅ |
| 2026-04-23 | ai-dlc-skills | Updated README.md structure tree: added rules/ folder between core/ and qa/ ✅ |
| 2026-04-23 | ai-dlc-skills | Completed all rules/ path updates: README.md, postman/SKILL.md, ui-designer/SKILL.md, Skill Maps (3 agents); old qa/*-rules/ folders pending user rm ✅ |
| 2026-04-23 | ai-dlc-skills | Fixed postman/SKILL.md: relative paths updated to ../../rules/playwright-rules/ and ../playwright-testing/ ✅ |
| 2026-04-23 | ai-dlc-skills | Added ai-dlc/rules/ section to Skill Map in GEMINI.md/KIRO.md/CLAUDE.md — rules/ now separate section from qa/ ✅ |
| 2026-04-23 | ai-dlc-skills | Updated Skill Map in GEMINI.md/KIRO.md/CLAUDE.md: qa/playwright-rules→rules/, qa/robotframework-rules→rules/, qa/test-scenario-rules→rules/ ✅ |
| 2026-04-23 | ai-dlc-skills | Completed rules/ restructure: ui-designer/SKILL.md updated with new industry-rules paths; all 4 rules skills in ai-dlc/rules/ ✅ |
| 2026-04-23 | ai-dlc-skills | Restructured ai-dlc/rules/: created rules/ folder, moved playwright-rules/robotframework-rules/test-scenario-rules/industry-rules from qa/ and ux-ui/ ✅ |
| 2026-04-23 | ai-dlc-skills | setupKiro.sh: removed interactive copy/reference prompt, default to #[[file:]] reference only ✅ |
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

- focus: "Agent Framework v2.0 complete: 10 mandatory rules, SSOT architecture, full coverage ✅✅✅"
- blockers: ""
- next_action: "Merged to main. Ready for use."

## Open Threads

- [x] SSOT finalization: extracted skill-map.md, project-rules.md, citation-format.md → .claude/shared/ (separate files vs markers); updated sync script to read files; committed @2026-04-24
- [x] SSOT architecture for Claude/Gemini/Codex: created .claude/shared/agent-core.md + sync script, thin adapters for CODEX.md/GEMINI.md @2026-04-24
- [x] Removed hooks from settings.json → state.md as manual instruction (turn start/end checklist) @2026-04-24
- [x] Push to GitHub: branch `claude/wonderful-herschel-fb954a` pushed ✅ @2026-04-24
- [x] Search scaling implementation: Hybrid Inverted Index + Sorted Date Array implemented → keyword-index.json + date-index.json created, storage.md + session.md + SKILL.md updated @2026-04-21
- [x] AGENTS.md: adopted Trust Priority, Do-not-store, Minimum Update Contract from agent-context-kit @2026-04-21
- [x] Fix BASE_DIR walk-up level in setupAgentSkills.sh — replaced hardcoded `../../..` with `.git/` detection loop, all 3 copies synced @2026-04-21
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
