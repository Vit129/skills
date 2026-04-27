# 🏛️ Agent Memory Palace — State (Global)

> Cross-project memory managed via `agent-memory` system.
> Structure: palace/ (narrative) + knowledge/ (patterns)

## Active Wings

- **agent-memory** — Global memory & intelligence management (last updated: 2026-04-26)
- **ai-dlc-skills** — AI-DLC skill ecosystem (last updated: 2026-04-23)
- **token-optimization-tooling** — Token optimization research + .claude/rules/token_efficient.md (last updated: 2026-04-26)

## Recent Sessions

| Date | Wing | Summary |
|------|------|---------|
| 2026-04-27 | agent-memory | Kiro session: found real gap — Consolidation State section missing from storage.md Knowledge Evolution schema; not in intelligence.md or maintenance.md; needs to be added to storage.md ✅ |
| 2026-04-27 | agent-memory | Kiro session: full session review — CoT+AoT+LATS analysis scored 7.8/10; spec+migration done; remaining: VitProjects+HA JSON, bootstrap test, existing room frontmatter ✅ |
| 2026-04-27 | agent-memory | Kiro session: agent-memory-lite SKILL.md updated — comparison table reflects new Full structure (graph.md, room frontmatter, articles/{domain}/); References fixed (storage.md removed, explicit list) ✅ |
| 2026-04-27 | agent-memory | Kiro session: SKILL.md rewritten — all schemas inlined (hook-creator pattern); storage.md deleted; SKILL.md now single source of truth for spec + implementation ✅ |
| 2026-04-27 | agent-memory | Kiro session: compared agent-memory SKILL.md vs hook-creator/fitness/ai-techniques — decision: inline all required schemas into SKILL.md; references/ for on-demand only ✅ |
| 2026-04-27 | agent-memory | Kiro session: README.md removed from spec (SKILL.md + storage.md) + deleted AGENT_MEMORY_README.md — no drift, no maintenance overhead ✅ |
| 2026-04-27 | agent-memory | Kiro session: README.md simplified — removed file tree (stale-prone), kept static structure pattern + how-to + score thresholds only ✅ |
| 2026-04-27 | agent-memory | Kiro session: migrated ~/.claude/agent-memory/ to new spec — created palace/graph.md, knowledge/README.md, moved 3 flat articles to articles/{design,tooling}/, fixed index.md paths; spec compliance 100% ✅ |
| 2026-04-27 | agent-memory | Kiro session: graph.md changed to required from first wing (simpler than ≥3 threshold); SKILL.md + storage.md updated ✅ |
| 2026-04-27 | agent-memory | Kiro session: graph.md changed from optional → required when wings ≥ 3 (LATS analysis: Sim 3 hybrid); room frontmatter + README.md already required; spec finalized ✅ |
| 2026-04-27 | agent-memory | Kiro session: promoted room YAML frontmatter + knowledge/README.md from optional → required in storage.md + SKILL.md; graph.md + hall sections stay optional ✅ |
| 2026-04-27 | agent-memory | Kiro session: added Consolidation State section to storage.md Knowledge Evolution schema — gap closed, spec matches My Investment Port 100% ✅ |
| 2026-04-27 | agent-memory | Kiro session: found real gap — Consolidation State section missing from storage.md; confirmed not in intelligence.md or maintenance.md either ✅ |
| 2026-04-27 | agent-memory | Kiro session: CoT+LATS analysis across 4 projects (My Investment Port, .claude, VitProjects, HA); decision: Tiered hybrid spec — 4 required changes + 4 recommended (optional for >3 wings); VitProjects+HA need JSON→MD migration ✅ |
| 2026-04-27 | agent-memory | Kiro session: deep analysis My Investment Port agent-memory vs SKILL.md spec — 5 changes: (1) articles/{domain}/ subfolder, (2) graph.md optional, (3) knowledge/README.md, (4) room YAML frontmatter+links, (5) rich hall format; update SKILL.md+storage.md pending ✅ |
| 2026-04-27 | ai-dlc-skills | Kiro session: fixed postman-to-playwright SKILL.md — added mandatory Generation Order (fixtures→schemas→helpers→mocks→specs); upgraded Section 3 from optional to MANDATORY; synced both .claude + VitProjects copies ✅ |
| 2026-04-27 | ai-dlc-skills | Kiro session: ai-dlc-knowledge migration 100% complete — verified all 34 .md files exist; fixed business/auth/index.md path ref (businessAuthRules.json→.md); all lesson indexes + business indexes confirmed complete; 5 config files stay JSON ✅ |
| 2026-04-27 | ai-dlc-skills | Kiro session: read 3 sample JSON files (index.json, apiLesAuth.json, businessAuthRules.json); designed Markdown schema mapping for migration — index→table, lesson→YAML frontmatter+sections+code blocks, rules→table; ready to execute ✅ |
| 2026-04-27 | agent-memory | Kiro session: explored ai-dlc/knowledge/ — 35 JSON files inventoried; ~30 to migrate to Markdown, ~5 configs stay JSON; categories: indexes, lesson indexes, lessons, rules, configs ✅ |
| 2026-04-27 | agent-memory | Kiro session: deduplicated ai-dlc-knowledge-migration open thread in state.md (was listed twice); no other changes ✅ |
| 2026-04-26 | agent-memory | Expanded CLAUDE.md Skills table to cover all domains (qa/dev/po/ux-ui/finance/rules); added skill announce rule; updated title to Global Config ✅ |
| 2026-04-26 | agent-memory | Kiro session: added Skill Invocation Rule to agent-core.md — agents must announce [Skill: {path}] before using any skill; path from skill-map.md ✅ |
| 2026-04-26 | agent-memory | Kiro session: executed Phase 2+3 tasks — search-index archival (500-row cap, 180-day archive), score-based routing in session-load hook, user-profile enhancements (nudge tracking, save prefs, routing prefs), skill crystallization (already in hooks), all hooks valid JSON ✅ |
| 2026-04-26 | agent-memory | Kiro session: created tasks.md for bugfix spec — 6 top-level tasks (bug exploration, preservation baseline, Phase 1 core fix with 6 sub-tasks, Phase 2 search+routing, Phase 3 crystallization+consolidation+nudges, final checkpoint); spec complete: bugfix.md + design.md + tasks.md all done |
| 2026-04-26 | agent-memory | Kiro session: created design.md for bugfix spec — formalized bug condition (knowledge drift + JSON split), 4 correctness properties, 3-phase implementation plan aligned with skill spec; Phase 1 hooks already correct (v6/v3); workspace migration + JSON cleanup as first task |
| 2026-04-26 | agent-memory | Kiro session: spec-vs-reality gap analysis — Phase 1 done at global ~/.claude/agent-memory/ but workspace still has legacy JSON (index.json, date-index.json, keyword-index.json, toolingLessonsIndex.json); no knowledge/index.md or evolution.md in workspace yet; maintenance.md + adaptation.md still have legacy JSON refs; gap: workspace migration needed |
| 2026-04-26 | agent-memory | Updated Kiro agent-memory session hooks to v6.0.0/v3.0.0: load hook now reads Markdown knowledge; save hook adds mandatory Knowledge Sync Gate, minimal safe save, no JSON writes, and no state-only fallback. |
| 2026-04-26 | agent-memory | Implemented Markdown-first Phase 1 contract: rewrote agent-memory SKILL.md + session/storage/intelligence references, created knowledge/index.md + evolution.md + tooling lesson markdown files; JSON memory files now legacy/read-only. |
| 2026-04-26 | agent-memory | Kiro session: created bugfix spec for agent-memory-redesign (.kiro/specs/); read all SKILL.md + 5 references + GOTCHAS; bugfix.md has 11 defects, 11 expected, 8 unchanged; decision: keep palace/ + knowledge/ separate dirs with enforced sync (not merged); all-markdown, zero JSON for storage; user approved requirements → ready for design phase ✅ |
| 2026-04-26 | agent-memory | Full session: researched 10 token optimization repos → token_efficient.md 12 sections; fixed hook routing v5.0.0 (absolute paths); migrated wing + lessons to correct workspace; analyzed agent-memory spec vs reality (hook does 40% of spec); decided: redesign to all-markdown, 5 core steps, cut unused features ✅ |
| 2026-04-26 | token-optimization-tooling | Migrated lessons TOOLING-001/002 to correct location + added TOOLING-003 (hook routing bug); fixed empty lessons/ folder in ~/.claude/agent-memory/knowledge/ ✅ |
| 2026-04-26 | agent-memory | Upgraded session-save hooks to v5.0.0: replaced ~/ with absolute path /Users/supavit.cho/.claude/, changed routing logic from 'find .kiro/hooks' to 'inspect actual file paths written this session' — fixes ~/.claude/agent-memory never updating ✅ |
| 2026-04-26 | token-optimization-tooling | Moved wing from VitProjects → ~/.claude/agent-memory/ (correct location — files were in .claude/rules/); cleaned VitProjects state.md ✅ |
| 2026-04-26 | agent-memory | Upgraded session-save hooks to v4.0.0 in both workspaces: Step 0 workspace-aware routing (files in ~/.claude/ → ~/.claude/agent-memory/, project files → project/agent-memory/), relaxed content filter (tooling/hooks/rules now always captured), both workspaces synced ✅ |
| 2026-04-25 | agent-memory | Updated sync-agent-instructions.sh: all references changed from .claude/shared/ → rules/; shared/ can now be deleted; open thread updated ✅ |
| 2026-04-25 | agent-memory | Restructuring shared/ → rules/: copied files to rules/ at root level, communication-style.md included; decided to keep rules/ at root (not strict Anatomy spec) ✅ |
| 2026-04-25 | agent-memory | Fixed .gitignore: added .claude/, scripts/, rules/ to whitelist; re-ignore worktrees/ + settings.local.json; agents + shared now tracked by git ✅ |
| 2026-04-25 | agent-memory | Created 5 Claude Code custom agents (po, uxui, qa, dev, architect) in .claude/.claude/agents/ + copied to ~/.claude/agents/ (global scope, available in all projects); agents use skill preloading + project memory + tool restrictions ✅ |
| 2026-04-25 | agent-memory | Fixed README.md: corrected architecture tree to show .claude/.claude/shared/, added all scripts, added analysis-concept + hook-creator to system/, added Kiro to agent table ✅ |
| 2026-04-25 | agent-memory | Updated CLAUDE.md: corrected shared/ path, added communication-style.md ref, fixed knowledge resolution, updated References to skills/KIRO.md ✅ |
| 2026-04-24 | agent-memory | Completed Agent Framework v2.0: 10 mandatory rules; all agents synced; framework 100% complete ✅ |
| 2026-04-24 | agent-memory | Added 5 mandatory agent rules + communication-style.md; synced all agent configs ✅ |
| 2026-04-24 | agent-memory | Finalized SSOT: extracted shared files → .claude/shared/; sync script reads files; CLAUDE.md thin adapter ✅ |
| 2026-04-24 | agent-memory | Implemented SSOT architecture: .claude/shared/agent-core.md + sync script → generated agent configs ✅ |
| 2026-04-23 | ai-dlc-skills | All 21 SKILL.md files bilingual EN+TH; citation refs fixed; rules/ paths consistent ✅ |
| 2026-04-23 | ai-dlc-skills | Restructured ai-dlc/rules/: moved 4 rules skills from qa/ and ux-ui/; all Skill Maps updated ✅ |
| 2026-04-22 | ai-dlc-skills | Added impeccable-design skill to dev/ + registered in Skill Map ✅ |

## Current Focus

- focus: "agent-memory spec upgrade COMPLETE — 7.8/10; remaining: VitProjects+HA JSON migration, bootstrap test, existing room frontmatter"
- blockers: ""
- next_action: "Migrate VitProjects + HA JSON→MD; add room YAML frontmatter to existing rooms; test bootstrap on new project"

## Open Threads

- [x] agent-memory: update SKILL.md + storage.md with 9 changes (articles subfolder, graph.md, README.md, room frontmatter, rich hall, Palace Graph schema, Tunnels prose, article path, Related Lessons) ✅ 2026-04-27
- [x] agent-memory: add Consolidation State section to storage.md Knowledge Evolution schema ✅ 2026-04-27
- [x] agent-memory: migrate global flat articles (~/.claude/agent-memory/knowledge/) to articles/{domain}/ structure ✅ 2026-04-27
- [x] agent-memory: inline all required schemas into SKILL.md (hall, room, graph, tunnels, article, lesson, closet) — follow hook-creator pattern; references/ kept for on-demand only ✅ 2026-04-27
- [ ] agent-memory: add YAML frontmatter to existing rooms in ~/.claude/agent-memory/palace/wings/
- [ ] agent-memory: test bootstrap on a brand new project to verify spec works end-to-end
- [ ] agent-memory: migrate VitProjects + HA JSON→MD (index.json → index.md + evolution.md)
- [ ] ai-dlc-skills: verify {knowledge_root} resolves correctly at runtime
- [X] Cleanup: delete .claude/shared/ (sync script now reads from rules/)
- [x] Rename .agent-memory/ → agent-memory/ across 38 files + folder rename; sed replace all references; update .gitignore
- [X] agent-memory-redesign: bugfix spec in Kiro (.kiro/specs/agent-memory-redesign/). Requirements approved (11 defects, 11 expected, 8 unchanged). Decision: palace/ + knowledge/ stay separate with enforced sync, all-markdown zero JSON. Phase 1 contract implemented; legacy memory JSON removed; Kiro hooks now enforce Markdown Knowledge Sync Gate. Next: real-session verification, consolidation, skill crystallization.
- [x] ai-dlc-knowledge-migration: skills/ai-dlc/knowledge/ has ~30 JSON files (14 indexes + 16 lessons + 4 rules) needing Markdown migration. Config files (~5) can stay JSON. Separate spec needed — large scope.

## Placeholder Convention

```text
{project_root}   = root directory of the active project (walk up from cwd)
{knowledge_root} = {project_root}/agent-memory/knowledge/   ← per-project only (single source of truth)
{skills_root}    = {project_root}/skills/                      ← execution engine only (not data)
{cwd}            = current working directory
```

> Note: `{project}` without `_root` is reserved for project **name** display only (e.g. "load memory for {project}").
> All path placeholders must use `{project_root}`.
> Knowledge lives in `agent-memory/knowledge/` only. New projects bootstrap from `skills/system/agent-memory/SKILL.md`.
