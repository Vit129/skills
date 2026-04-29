# Knowledge Evolution

Updated: 2026-04-27

## Consolidation State

- sessions_since_consolidation: 63
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days

## Change Log

| Date | ID | Change | Signal | Before | After | Evidence |
|------|----|--------|--------|--------|-------|----------|
| 2026-04-26 | ui-standards | Unified main action buttons to BTN_SAVE ('บันทึก') across all forms; updated README to v4.3.5 | POSITIVE | scattered labels | unified 'บันทึก' | `translations.js`, `README.md`, `HoldingsPage.jsx`, `PassiveIncomePage.jsx` |
| 2026-04-26 | tooling | Captured token optimization research and hook routing lessons | VALIDATED | missing | active | `agent-memory/knowledge/lessons/tooling/index.md` |
| 2026-04-26 | agent-memory | Migrated knowledge catalog contract from JSON to Markdown | POSITIVE | `index.json` | `index.md` | `skills/system/agent-memory/SKILL.md` |
| 2026-04-26 | LESSON-TOOLING-004 | Added Knowledge Sync Gate to Kiro session-save hook | VALIDATED | knowledge optional | knowledge mandatory every dirty save | `skills/system/hook-creator/templates/kiro/agent-memory-session-save.kiro.hook` |
| 2026-04-26 | session-2026-04-26-kiro | Kiro bugfix spec session: requirements approved, palace updated, full system review (read-only); no new reusable item | NEUTRAL | — | — | `palace/search-index.md` bugfix spec row |
| 2026-04-26 | session-2026-04-26-kiro-2 | Spec-vs-reality gap analysis: 2 new gaps found (workspace legacy JSON, reference file legacy refs) | POSITIVE | — | 2 open gaps | `knowledge/index.md` Gaps table |
| 2026-04-26 | session-2026-04-26-kiro-3 | Design doc created for bugfix spec: bug condition formalized, 4 correctness properties, 3-phase implementation | POSITIVE | requirements only | requirements + design | `.kiro/specs/agent-memory-redesign/design.md` |
| 2026-04-26 | session-2026-04-26-kiro-4 | Tasks.md created: 6 tasks, 3 phases; bugfix spec complete (requirements + design + tasks) | POSITIVE | design only | full spec ready to execute | `.kiro/specs/agent-memory-redesign/tasks.md` |
| 2026-04-26 | session-2026-04-26-kiro-5 | Read CLAUDE.md: found 3 JSON refs (index.json, keyword-index.json, date-index.json) that need Markdown-first update; new gap added | POSITIVE | — | 1 new gap | `knowledge/index.md` Gaps table |
| 2026-04-26 | session-2026-04-26-kiro-6 | Fixed CLAUDE.md: index.json→index.md, keyword/date-index.json→search-index.md, added evolution.md to file list; gap closed | POSITIVE | 3 JSON refs | 0 JSON refs | `CLAUDE.md` |
| 2026-04-26 | session-2026-04-26-kiro-7 | Fixed maintenance.md + adaptation.md: removed legacy note headers, replaced all JSON refs with Markdown (Step 4, Phase B/C, Quick-Start, Global Knowledge Structure, Placeholder Mapping); 20/20 files now zero JSON | POSITIVE | JSON refs in 2 files | 0 JSON refs across all files | `references/maintenance.md` + `references/adaptation.md` |
| 2026-04-26 | crystallization | Crystallized agent-config-transparency-pattern (draft) from kiro-9+kiro-10: skill announce + CLAUDE.md all-domains | POSITIVE | 2 separate sessions | 1 draft pattern | `knowledge/agent-config-transparency-pattern.md` |
| 2026-04-26 | session-2026-04-26-kiro-10 | Expanded CLAUDE.md Skills table to all domains (qa/dev/po/ux-ui/finance/rules); title→Global Config; added skill announce note | POSITIVE | coding-only framing | general-purpose framing | `/Users/supavit.cho/.claude/CLAUDE.md` |
| 2026-04-26 | session-2026-04-26-kiro-9 | Added Skill Invocation Rule to agent-core.md: agents must announce [Skill: path] before using any skill; path from skill-map.md | POSITIVE | silent skill use | transparent skill announcement | `/Users/supavit.cho/.claude/rules/agent-core.md` |
| 2026-04-26 | session-2026-04-26-kiro-8 | Phase 2+3 implemented: search-index archival (500-row cap, 180-day archive), score-based routing in session-load, user-profile enhancements (nudge tracking/save prefs/routing prefs), skill crystallization (already in hooks); all hooks valid JSON | POSITIVE | Phase 1 only | Phase 1+2+3 partial | `skills/system/hook-creator/templates/kiro/` |
| 2026-04-26 | session-2026-04-26-kiro-9 | Phase 3 complete: session-load v3.1.0 full nudge system (5 types, max 3, suppression via user-profile.md); session-save Step 5B counter increment; consolidation/auto-dream fully wired; all hooks valid JSON | POSITIVE | partial Phase 3 | Phase 3 complete | `skills/system/hook-creator/templates/kiro/` |
| 2026-04-26 | session-2026-04-26-kiro-9 | Phase 3 complete: session-load v3.1.0 full nudge system (5 types, max 3, suppression via user-profile.md); session-save Step 5B counter increment; consolidation/auto-dream fully wired; all hooks valid JSON | POSITIVE | partial Phase 3 | Phase 3 complete | `skills/system/hook-creator/templates/kiro/` |
| 2026-04-26 | session-2026-04-26-kiro-10 | Found active hooks (.kiro/hooks/) out of sync with templates: load=v3.0.0 vs template v3.1.0, save missing Step 4D+5B; need to copy templates to active | POSITIVE | — | 1 new gap | `knowledge/index.md` Gaps table |
| 2026-04-26 | session-2026-04-26-kiro-11 | Synced active hooks to templates: load v3.1.0 (nudge+routing), save v6.0.0 (crystallization+consolidation+counter); gap closed | POSITIVE | hooks out of sync | hooks synced | `.kiro/hooks/` |
| 2026-04-26 | session-2026-04-26-kiro-12 | Identified ~30 JSON files in skills/ai-dlc/knowledge/ needing Markdown migration; new gap added; separate spec needed | POSITIVE | — | 1 new gap | `knowledge/index.md` Gaps table |
| 2026-04-26 | session-2026-04-26-kiro-13 | Added open thread for ai-dlc-knowledge-migration in both global and workspace state.md | NEUTRAL | — | — | `palace/state.md` open threads |
| 2026-04-26 | session-2026-04-26-kiro-14 | Updated AGENT_MEMORY_README.md Status (all phases done, hooks listed) + SKILL.md References (added maintenance.md + adaptation.md as proper entries) | POSITIVE | outdated status | current status | `skills/system/agent-memory/` |
| 2026-04-27 | LESSON-TOOLING-005 | Synced Claude Code hooks (.claude/hooks/) to match Kiro hooks: load v3.1.0 + save v6.0.0 with full features; lesson: always sync both hook sets when updating agent-memory | POSITIVE | simplified hooks | full-feature hooks | `.claude/hooks/memory-load.hook` + `memory-save.hook` |
| 2026-04-27 | session-2026-04-27-kiro-2 | Removed outdated Gemini hooks from .kiro/hooks/ (gemini-memory-load/save); Kiro hooks now clean: 3 hooks only | POSITIVE | 5 hooks (2 stale) | 3 hooks (clean) | `.kiro/hooks/` |
| 2026-04-27 | session-2026-04-27-kiro-3 | Added documentation-sync.kiro.hook to Kiro hooks (copied from Claude Code); cleaned Gemini hooks; synced Claude Code hooks; LESSON-TOOLING-005 captured | NEUTRAL | — | — | `.kiro/hooks/documentation-sync.kiro.hook` |
| 2026-04-27 | session-2026-04-27-kiro-9 | Deleted 34 migrated JSON files from ai-dlc/knowledge/; 5 config files stay JSON; knowledge base now 100% Markdown | POSITIVE | mixed JSON+MD | all-Markdown | `/Users/supavit.cho/.claude/skills/ai-dlc/knowledge/` |
| 2026-04-27 | session-2026-04-27-kiro-8 | ai-dlc-knowledge migration 100% complete: 34 .md files verified, business/auth/index.md path ref fixed, open thread closed | POSITIVE | migration in-progress | migration complete | `/Users/supavit.cho/.claude/skills/ai-dlc/knowledge/` |
| 2026-04-27 | session-2026-04-27-kiro-7 | Read 3 ai-dlc JSON samples; designed Markdown schema mapping (index→table, lesson→frontmatter+sections, rules→table); architecture decision for migration | POSITIVE | unknown schema | concrete schema design | `/Users/supavit.cho/.claude/skills/ai-dlc/knowledge/` |
| 2026-04-27 | session-2026-04-27-kiro-6 | Explored ai-dlc/knowledge/: 35 JSON files inventoried — ~30 migrate (indexes+lessons+rules), ~5 stay JSON (configs+uiActions); migration scope confirmed | POSITIVE | unknown scope | concrete inventory | `/Users/supavit.cho/.claude/skills/ai-dlc/knowledge/` |
| 2026-04-27 | session-2026-04-27-kiro-5 | Deduplicated ai-dlc-knowledge-migration open thread in state.md; knowledge reviewed; no new reusable item | NEUTRAL | duplicate thread | single thread | `palace/state.md` open threads |
| 2026-04-27 | session-2026-04-27-kiro-4 | Added documentation-sync.kiro.hook to templates/kiro/; all 4 templates now match active hooks | NEUTRAL | — | — | `skills/system/hook-creator/templates/kiro/` |
| 2026-04-27 | agent-memory-lite | Created agent-memory-lite skill: same features as full but merged files (state.md=palace all-in-one, index.md=knowledge+evolution, flat topics/, single-file lessons); upgrade path to full included | POSITIVE | — | new skill | `skills/system/agent-memory-lite/SKILL.md` |
| 2026-04-27 | session-2026-04-27-copyskills | copySkills.sh: FORCE default changed 0→1; script now always overwrites without --force flag | POSITIVE | FORCE=0 | FORCE=1 | `.claude/skills/scripts/copyToWork/copySkills.sh` |
| 2026-04-27 | session-2026-04-27-setup-copy | Copied 6 setup scripts to VitProjects/ai-agent/scripts/setup/ (excl. setupCodexSkills.sh); added agent-memory-lite exclusion to copySkills.sh EXCLUDE_SUBFOLDERS | POSITIVE | scripts only in .claude | scripts mirrored to VitProjects | `VitProjects/ai-agent/scripts/setup/` |
| 2026-04-27 | session-2026-04-27-readme-workflow | SCRIPT_README.md redesigned: setupAgentSkills.sh = main entry point; wrapper calls Memory+Kiro+Tests interactively; no more per-script runs | POSITIVE | scattered scripts | single entry point | `.claude/skills/scripts/setup/SCRIPT_README.md` + `VitProjects/ai-agent/scripts/setup/SCRIPT_README.md` |
| 2026-04-27 | session-2026-04-27-readme-trimmed | AGENT_MEMORY_README.md: removed "ทำไมถึงออกแบบใหม่" section, merged key point into tagline | POSITIVE | verbose README with history section | concise README | .claude/skills/system/agent-memory/AGENT_MEMORY_README.md |
| 2026-04-27 | session-2026-04-27-readme-updated | Updated AGENT_MEMORY_README.md: removed duplicate section, added graph.md to tree, updated save rules + status to match current spec | POSITIVE | outdated README with duplicate | current README | .claude/skills/system/agent-memory/AGENT_MEMORY_README.md |
| 2026-04-27 | session-2026-04-27-kiro-md-updated | Updated KIRO.md: Reading Order added knowledge/index.md (5b), Minimum Update Contract added knowledge sync gate, finance/ added stock-peer-comparison | POSITIVE | outdated KIRO.md | current KIRO.md | .claude/skills/KIRO.md |
| 2026-04-27 | session-2026-04-27-knowledge-index-added | Added knowledge/index.md to Required Reading in 5 agent config files (HA: CLAUDE+CODEX+GEMINI, My Investment Port: CLAUDE+CODEX+GEMINI) | POSITIVE | state.md only | state.md + knowledge/index.md | /Users/supavit.cho/Git/Home Assistant/ + /Users/supavit.cho/Git/My Investment Port/ |
| 2026-04-27 | LESSON-TOOLING-006 | CLAUDE.md reference pattern replaces hooks for token efficiency: add state.md + knowledge/index.md to Required Reading section; agent reads on session start without hook overhead | POSITIVE | hook-based memory load | CLAUDE.md reference pattern | My Investment Port CLAUDE.md + HA CLAUDE.md comparison |
| 2026-04-27 | session-2026-04-27-ha-migration | Migrated HA agent-memory to new spec: index.md+evolution.md, lessons/climate/, graph.md, search-index.md, user-profile.md, tunnels prose, archive/index.md; index.json deleted | POSITIVE | JSON index, flat lesson, no graph | Markdown spec-compliant structure | /Users/supavit.cho/Git/Home Assistant/HA Modified/agent-memory/ |
| 2026-04-27 | session-2026-04-27-final-review | Full session review with CoT+AoT+LATS: spec upgrade scored 7.8/10; done: SKILL.md single source of truth, global migration, graph.md, articles/{domain}/; remaining: VitProjects+HA JSON migration, bootstrap test, existing room frontmatter | POSITIVE | spec behind real usage | spec 7.8/10 match | CoT+AoT+LATS analysis across session |
| 2026-04-27 | session-2026-04-27-lite-updated | agent-memory-lite SKILL.md updated: comparison table reflects new Full structure (graph.md, room frontmatter, articles/{domain}/); References fixed (storage.md removed, explicit list) | POSITIVE | stale comparison table | current comparison table | .claude/skills/system/agent-memory-lite/SKILL.md |
| 2026-04-27 | session-2026-04-27-skill-inlined | SKILL.md rewritten: all schemas inlined (hall, room, graph, tunnels, article, lesson, closet, evolution); storage.md deleted; SKILL.md = single source of truth | POSITIVE | schemas split across SKILL.md + storage.md | all schemas in SKILL.md | .claude/skills/system/agent-memory/SKILL.md |
| 2026-04-27 | session-2026-04-27-skill-inline-decision | Compared agent-memory SKILL.md vs hook-creator/fitness/ai-techniques; decision: inline all required schemas into SKILL.md; references/ for on-demand only (maintenance, adaptation, intelligence) | POSITIVE | schemas in references/ | schemas inline in SKILL.md | .claude/skills/system/agent-memory/ comparison |
| 2026-04-27 | session-2026-04-27-readme-removed | README.md removed from spec (SKILL.md + storage.md) + AGENT_MEMORY_README.md deleted; knowledge/ has no README — no drift, no maintenance overhead | POSITIVE | README.md in spec | no README | .claude/skills/system/agent-memory/SKILL.md + references/storage.md |
| 2026-04-27 | session-2026-04-27-readme-simplified | README.md simplified: removed file tree (would go stale), kept structure pattern + how-to + score thresholds only | POSITIVE | file tree in README | static-only README | .claude/agent-memory/knowledge/README.md |
| 2026-04-27 | session-2026-04-27-migration-complete | Migrated ~/.claude/agent-memory/ to new spec: palace/graph.md created, knowledge/README.md created, 3 flat articles moved to articles/{design,tooling}/, index.md paths fixed; spec compliance 100% | POSITIVE | flat articles, no graph, no README | articles/{domain}/, graph.md, README.md | .claude/agent-memory/ full migration |
| 2026-04-27 | session-2026-04-27-graph-first-wing | graph.md changed to required from first wing — simpler than ≥3 threshold, bootstrap empty template on first wing creation | POSITIVE | required when wings ≥ 3 | required from first wing | .claude/skills/system/agent-memory/SKILL.md + references/storage.md |
| 2026-04-27 | session-2026-04-27-graph-required | graph.md changed from optional → required when wings ≥ 3; LATS Sim 3 hybrid: bootstrap empty template at wing 3, populate on demand; SKILL.md + storage.md updated | POSITIVE | optional | required when wings ≥ 3 | .claude/skills/system/agent-memory/SKILL.md + references/storage.md |
| 2026-04-27 | session-2026-04-27-frontmatter-required | Promoted room YAML frontmatter + knowledge/README.md from optional → required in storage.md + SKILL.md; graph.md + hall sections stay optional | POSITIVE | optional | required | .claude/skills/system/agent-memory/SKILL.md + references/storage.md |
| 2026-04-27 | session-2026-04-27-consolidation-state-fixed | Added Consolidation State section to storage.md Knowledge Evolution schema; gap closed; spec now matches My Investment Port 100% | POSITIVE | schema missing Consolidation State | schema complete | .claude/skills/system/agent-memory/references/storage.md |
| 2026-04-27 | session-2026-04-27-consolidation-gap | Found real gap: Consolidation State section (sessions_since_consolidation, last_consolidation) missing from storage.md Knowledge Evolution schema — not in intelligence.md or maintenance.md; needs to be added | POSITIVE | wrong claim (said it was in refs) | confirmed gap, open thread added | grep search across all agent-memory skill files |
| 2026-04-27 | crystallization-agent-memory-structure | Crystallized agent-memory-structure-pattern (draft) from spec-applied+tiered-hybrid: proven structure from 4-project analysis | POSITIVE | 2 separate sessions | 1 draft pattern | articles/tooling/agent-memory-structure-pattern.md |
| 2026-04-27 | session-2026-04-27-spec-applied | Applied 9-point spec update to SKILL.md + storage.md: articles/{domain}/, graph.md, README.md, room YAML frontmatter+links, rich hall optional sections, Palace Graph schema, Tunnels prose format, Knowledge Article path, Related Lessons section | POSITIVE | spec behind real usage | spec matches My Investment Port proven structure | .claude/skills/system/agent-memory/SKILL.md + references/storage.md |
| 2026-04-27 | session-2026-04-27-tiered-hybrid | CoT+LATS across 4 projects: Tiered hybrid spec — required: articles/{domain}/, MD-only, hall+rooms, tunnels purpose; recommended: graph.md, README.md, room frontmatter, rich halls; new gaps: VitProjects+HA still JSON | POSITIVE | 5 flat changes | Tiered hybrid (4 req + 4 rec) | 4-project comparison: My Investment Port, .claude, VitProjects, Home Assistant |
| 2026-04-27 | session-2026-04-27-articles-subfolder | Deep analysis: 5 spec changes from My Investment Port real usage — (1) articles/{domain}/, (2) graph.md, (3) README.md, (4) room YAML frontmatter+links, (5) rich hall format; SKILL.md+storage.md update pending | POSITIVE | flat articles, no graph, minimal hall | structured articles, optional graph, rich hall, room links | My Investment Port agent-memory full structure comparison |
| 2026-04-27 | session-2026-04-27-setupagent-postman | setupAgentSkills.sh: added postmanToPlaywright.sh as 4th optional step (ask [y/N]); flow now complete: Memory+Kiro+Tests+Postman | POSITIVE | 3 scripts | 4 scripts | `.claude/skills/scripts/setup/setupAgentSkills.sh` + `VitProjects/ai-agent/scripts/setup/setupAgentSkills.sh` |
| 2026-04-27 | session-2026-04-27-readme-4step | SCRIPT_README.md updated: 4-step flow (Memory+Kiro+Tests+Postman), setupAgentSkills.sh = main, standalone run docs; both .claude + VitProjects synced | POSITIVE | 3-step README | 4-step README | `.claude/skills/scripts/setup/SCRIPT_README.md` + `VitProjects/ai-agent/scripts/setup/SCRIPT_README.md` |
| 2026-04-27 | SKILL-postman-fix | Fixed postman-to-playwright SKILL.md (both .claude + VitProjects): added mandatory Generation Order (fixtures→schemas→helpers→mocks→specs), upgraded Section 3 from optional to MANDATORY with full templates | POSITIVE | optional fixtures | mandatory order enforced | `.claude/skills/postman-to-playwright/postman/SKILL.md` |
| 2026-04-27 | session-2026-04-27-readme-nohard | SCRIPT_README.md: removed hard-coded ~/.claude paths, replaced with <SCRIPTS_DIR> placeholder; both copies synced | POSITIVE | hard-coded paths | portable <SCRIPTS_DIR> | `.claude/skills/scripts/setup/SCRIPT_README.md` + `VitProjects/ai-agent/scripts/setup/SCRIPT_README.md` |
| 2026-04-27 | session-2026-04-27-setupmemory-fix | setupMemory.sh: removed JSON legacy files (date-index.json, keyword-index.json, knowledge/index.json); added knowledge/index.md + knowledge/evolution.md (Markdown-first per SKILL.md) | POSITIVE | JSON bootstrap | Markdown bootstrap | `.claude/skills/scripts/setup/setupMemory.sh` |
| 2026-04-27 | session-2026-04-27-readme | Translated AGENT_MEMORY_README.md to Thai in both .claude + VitProjects; updated Layout to include articles/{domain}/ | POSITIVE | — | — | .claude/skills/system/agent-memory/AGENT_MEMORY_README.md |
| 2026-04-27 | LESSON-TOOLING-006 | setupTests.sh + postmanToPlaywright.sh: ROOT_DIR was hardcoded as ../../.. from SCRIPT_DIR causing install in ~/.claude instead of project; fix: .git walk-up pattern (same as setupMemory.sh) | POSITIVE | wrong ROOT_DIR | .git walk-up | `.claude/skills/scripts/setup/setupTests.sh` + `postmanToPlaywright.sh` |
| 2026-04-27 | session-2026-04-27-setupmemory-graph | setupMemory.sh: added palace/graph.md bootstrap; now 100% spec-compliant with agent-memory SKILL.md (Nodes/Rooms/Edges tables) | POSITIVE | missing graph.md | graph.md added | `.claude/skills/scripts/setup/setupMemory.sh` + `VitProjects/ai-agent/scripts/setup/setupMemory.sh` |
| 2026-04-27 | session-2026-04-27-postman-dest | postmanToPlaywright.sh: added check for existing ai-agent/skills/postman-to-playwright; ask user to choose destination [1] ai-agent/skills/ or [2] tests-level (default) | POSITIVE | always copy to tests-level | smart destination choice | `.claude/skills/scripts/setup/postmanToPlaywright.sh` + `VitProjects/ai-agent/scripts/setup/postmanToPlaywright.sh` |
| 2026-04-27 | session-2026-04-27-postman-destbug | postmanToPlaywright.sh: fixed bug — DEST_DIR was hardcoded after user choice, overwriting selection; removed duplicate assignment | POSITIVE | DEST_DIR always postman-to-playwright | respects user choice | `.claude/skills/scripts/setup/postmanToPlaywright.sh` + `VitProjects/ai-agent/scripts/setup/postmanToPlaywright.sh` |
| 2026-04-27 | session-2026-04-27-postman-ux | postmanToPlaywright.sh: simplified UX — if skill exists → show path + exit; if not → copy to tests-level directly, no prompt | POSITIVE | confusing destination prompt | clean exit or auto-copy | `.claude/skills/scripts/setup/postmanToPlaywright.sh` + `VitProjects/ai-agent/scripts/setup/postmanToPlaywright.sh` |
| 2026-04-27 | session-2026-04-27-copyskills-dest | copySkills.sh: dest now flexible — if arg contains /ai-agent/skills or /skills use as-is; otherwise append /ai-agent/skills to project root | POSITIVE | hardcoded DEST | flexible dest | `.claude/skills/scripts/copyToWork/copySkills.sh` |
| 2026-04-27 | session-2026-04-27-copyskills-search | copySkills.sh: added folder-name auto-search (same pattern as setupTests.sh); supports name/relative/absolute path; dest always PROJECT/ai-agent/skills | POSITIVE | requires full path | auto-search by name | `.claude/skills/scripts/copyToWork/copySkills.sh` |
| 2026-04-27 | session-2026-04-27-scripts-overhaul | Full session: setup scripts overhaul — copySkills flexible dest+search, setupMemory Markdown+graph.md, setupTests/postman ROOT_DIR fix, postman UX simplify, README no-hardcode, architecture decision (tests/=git, rest=.gitignore) | POSITIVE | legacy scripts with bugs | production-ready scripts | `.claude/skills/scripts/` |
| 2026-04-27 | session-2026-04-27-memory-lite-chat | agent-memory-lite SKILL.md rewritten: file-based → chat-native Memory Block pattern; in-context tracking + copy-paste output; platform setup for Claude/ChatGPT/Gemini | POSITIVE | file-based (unusable in chat) | chat-native Memory Block | `.claude/skills/system/agent-memory-lite/SKILL.md` |

## Change Log
| Date | ID | Change | Signal | Before | After | Evidence |
|------|----|--------|--------|--------|-------|----------|
| 2026-04-28 | HOOK-001-session-save-v6.1 | Updated agent-memory-session-save hook v6.0→v6.1: strengthened minimal safe save rule (must include knowledge/index.md, never evolution.md only), increased timeout 15s→30s, added "prefer full sync" instruction | POSITIVE | Minimal safe save could skip knowledge/index.md; 15s timeout caused frequent fallback | knowledge/index.md always required; 30s timeout; full sync preferred | `.kiro/hooks/agent-memory-session-save.kiro.hook`, `~/.claude/skills/system/hook-creator/templates/kiro/agent-memory-session-save.kiro.hook` |
| 2026-04-28 | HOOK-002-session-save-v6.2 | Updated hook v6.1→v6.2: removed 30s timeout, replaced with "Complete all steps fully regardless of content size" | POSITIVE | 30s timeout implied time pressure | No timeout — always complete fully | `.kiro/hooks/`, template |
| 2026-04-29 | session-2026-04-29-brainstorming-skill | Created core/brainstorming/ skill for AIDLC: SKILL.md + po-lens.md + dev-lens.md + qa-lens.md + output-template.md; Party Mode multi-role (PO/Dev/QA) brainstorm before DECISIONS phase; AIDLC_README.md updated | POSITIVE | no brainstorming skill | core/brainstorming/ complete | `/Users/supavit.cho/.claude/skills/ai-dlc/core/brainstorming/` |
| 2026-04-29 | session-2026-04-29-aidlc-preflight | Added Pre-Flight brainstorming section to core/aidlc/SKILL.md: trigger words, skip condition, link to core/brainstorming/; Related Skills updated with direct link | POSITIVE | no brainstorming entry in AIDLC | Pre-Flight section + Related Skills link | `/Users/supavit.cho/.claude/skills/ai-dlc/core/aidlc/SKILL.md` |
| 2026-04-29 | session-2026-04-29-routing-complete | Added brainstorming to KIRO.md Skill Map (before aidlc row) + related-skills.md Pre-AIDLC section; routing now consistent across all 5 files: KIRO.md, AIDLC_README.md, aidlc/SKILL.md, related-skills.md, brainstorming/SKILL.md | POSITIVE | brainstorming missing from KIRO.md + related-skills.md | routing complete | `/Users/supavit.cho/.claude/skills/KIRO.md` + `related-skills.md` |
| 2026-04-29 | session-2026-04-29-preflight-mandatory | Upgraded Pre-Flight from optional→mandatory: AIDLC now asks brainstorm question on every new feature (no .aidlc/ folder); skip conditions: resume/ทำต่อ/phase-entry commands; user chooses 1=proceed or 2=brainstorm | POSITIVE | optional pre-flight (user must trigger manually) | mandatory check on new feature start | `/Users/supavit.cho/.claude/skills/ai-dlc/core/aidlc/SKILL.md` |
| 2026-04-29 | session-2026-04-29-preflight-mandatory-always | Upgraded Pre-Flight to mandatory-always + scale-aware: brainstorming runs on every new feature (no .aidlc/), auto-detects Small(1 round)/Medium(2)/Large(3), no question asked; skip only on resume/phase-entry | POSITIVE | mandatory-check (still asked user) | mandatory-always (runs immediately, scale-aware) | `/Users/supavit.cho/.claude/skills/ai-dlc/core/aidlc/SKILL.md` |
| 2026-04-29 | session-2026-04-29-global-registration | Added brainstorming to rules/skill-map.md (Claude Code/Codex/Gemini shared) + README.md architecture tree; all 7 registration points now complete across entire skill ecosystem | POSITIVE | brainstorming missing from skill-map.md + README.md | all 7 points registered | `/Users/supavit.cho/.claude/rules/skill-map.md` + `README.md` |
| 2026-04-29 | session-2026-04-29-subagent-skill | Created core/subagent-driven/ skill: SKILL.md + dispatch-rules.md + context-template.md + review-checklist.md; 2-stage review (Spec Compliance + Code Quality); registered in KIRO.md, skill-map.md, AIDLC_README.md, related-skills.md | POSITIVE | no subagent orchestration skill | core/subagent-driven/ complete | `/Users/supavit.cho/.claude/skills/ai-dlc/core/subagent-driven/` |
| 2026-04-29 | session-2026-04-29-aidlc-related-skills-fix | Fixed Related Skills in aidlc/SKILL.md: brainstorming wording corrected from "ใช้เมื่อ idea ยังไม่ชัด" → "mandatory ก่อน Phase 0 ทุก new feature"; subagent-driven link added | POSITIVE | inconsistent wording between Pre-Flight and Related Skills | consistent mandatory wording + subagent-driven link | `/Users/supavit.cho/.claude/skills/ai-dlc/core/aidlc/SKILL.md` |
| 2026-04-29 | session-2026-04-29-connectivity-check | Full ai-dlc/ connectivity verified: all 17 skills registered in AIDLC_README.md; fixed related-skills.md Pre-AIDLC wording → mandatory (was "เมื่อ idea ยังไม่ชัด"); all 7 routing points consistent | POSITIVE | inconsistent wording in related-skills.md | all routing points consistent | `/Users/supavit.cho/.claude/skills/ai-dlc/core/aidlc/references/related-skills.md` |
| 2026-04-29 | session-2026-04-29-dry-run-validated | DRY-RUN Full AIDLC PBI-002 Japan Travel Health & Safety: brainstorming (Large/3 rounds) invoked at Pre-Flight; subagent-driven invoked at Phase 3.1 (3 independent contexts); full flow validated end-to-end | POSITIVE | dry-run not yet done | full flow validated | DRY-RUN PBI-002 |
| 2026-04-29 | session-2026-04-29-vibe-spec-open-thread | Open thread noted: vibe/spec mode design for AIDLC — Vibe=Quick brainstorm+Lite Inception+implement, Spec=Full AIDLC+Kiro Spec dialog, Detection=Kiro mode or context inference, Escalation=Vibe→Spec when complexity grows | NEUTRAL | — | open thread for next session | palace/state.md open threads |
| 2026-04-29 | LESSON-TOOLING-007 | Memory routing rule: global skill design → .claude/agent-memory/ not project agent-memory/. AIDLC Vibe/Spec requirements confirmed: both modes, dialog UX, spec=full workflow, .aidlc/ in sub-project, .kiro/specs/ at workspace root | POSITIVE | Saved AIDLC design to wrong target (My Investment Port) | Rule documented: check what changed (global skill vs project feature) before choosing target | palace/search-index.md row 2026-04-29 |

## Consolidation State

- sessions_since_consolidation: 64
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | LESSON-TOOLING-008 | Found 3 corrections in AIDLC Vibe/Spec mode: (1) detection=Kiro IDE mode not keyword (2) artifacts→.aidlc/ not .kiro/specs/ (3) dialog UX for both modes. Skill files need update. | POSITIVE | Initial implementation had wrong detection source, wrong artifact path, incomplete dialog UX scope | All 3 corrected in lesson; skill files fix pending | palace/search-index.md row 2026-04-29 |

## Consolidation State

- sessions_since_consolidation: 65
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | LESSON-TOOLING-008-update | Clarified correction #3: dialog format = global rule for ALL AIDLC regardless of AI agent (not Kiro-specific). Reason: easier to read + track progress. Updated lesson detail file. | POSITIVE | Thought dialog UX was Kiro-specific | Dialog format is an AIDLC-level rule, applies to Claude/Gemini/Kiro equally | palace/search-index.md row 2026-04-29 |

## Consolidation State

- sessions_since_consolidation: 66
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | LESSON-TOOLING-008-applied | Applied all 3 corrections from LESSON-TOOLING-008: (1) vibe-mode.md detection=IDE context (2) kiro-spec-integration.md rewritten — .aidlc/ only, dialog templates (3) dialog=global rule. workflow.md + SKILL.md updated. | VALIDATED | Skill files had wrong detection, wrong path, incomplete dialog scope | All 4 files corrected and verified | vibe-mode.md, kiro-spec-integration.md, workflow.md, SKILL.md |

## Consolidation State

- sessions_since_consolidation: 67
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | session-2026-04-29-agnostic | Confirmed AIDLC Vibe/Spec is agent-agnostic: Kiro/Claude/Gemini/Cursor all supported. Detection differs per IDE; artifacts+dialog identical. | NEUTRAL | — | — | palace/search-index.md row 2026-04-29 |

## Consolidation State

- sessions_since_consolidation: 68
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | session-2026-04-29-final-cleanup | Final session cleanup: state.md trimmed (sessions ~60→~20, threads cleaned), wing date updated. No new reusable item — housekeeping only. | NEUTRAL | — | — | palace/search-index.md cleanup row |

## Consolidation State

- sessions_since_consolidation: 69
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | session-2026-04-29-deep-sync | Deep sync: hall.md updated (brainstorming+subagent decisions, Vibe/Spec v2 decision, 2 room entries). lessons/tooling/index.md synced with LESSON-007+008. All memory layers now consistent. | NEUTRAL | — | — | palace/wings/ai-dlc-skills/hall.md, knowledge/lessons/tooling/index.md |

## Consolidation State

- sessions_since_consolidation: 70
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | HOOK-003-consolidation-nudge-suppress | Fixed: consolidation nudge repeated every save. Root cause: Step 4D always checks + Step 6 always shows. Fix: suppress repeat after first nudge in conversation. Hook v6.4.0→v6.5.0. Synced 3 locations. | POSITIVE | Nudge shown every save (annoying) | First-time-only nudge; subsequent saves show 'already flagged' | .claude/.kiro/hooks/agent-memory-session-save.kiro.hook |

## Consolidation State

- sessions_since_consolidation: 71
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | session-2026-04-29-full-audit | Full audit all 19 files in .claude/agent-memory/. Updated graph.md, user-profile.md, agent-memory/hall.md. User preference: repeated nudges = annoying → suppressed consolidation 30 days. | POSITIVE | Some files stale (graph missing rooms, user-profile missing nudge pref) | All files verified current | palace/ + knowledge/ full tree |

## Consolidation State

- sessions_since_consolidation: 72
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | GAP-full-audit-hook | Identified gap: session-save hook is incremental-only — misses graph.md, user-profile.md, tunnels.md, wings/hall.md, lessons domain indexes. Decision: create userTriggered full-audit hook (Option C). | POSITIVE | No mechanism to verify all files are current | Open thread: create full-audit hook | palace/state.md open threads |

## Consolidation State

- sessions_since_consolidation: 73
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | HOOK-004-full-audit-step | Added Step 5C Full Audit to session-save hook v7.0.0. Every save now audits ALL files in agent-memory/ (palace + knowledge). No separate hook needed — user decided A+B+C in existing hook. Gap closed. | POSITIVE | Hook only did incremental save, missed graph/tunnels/user-profile/wings/lessons-index | Full audit every save; stale files caught automatically | .claude/.kiro/hooks/agent-memory-session-save.kiro.hook v7.0.0 |

## Consolidation State

- sessions_since_consolidation: 74
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | GAP-agent-memory-complexity | Root cause: hook prompt ~3000 words + 19 files = agent skips tail steps. Proposed: simplify to 7 core files (cut graph, tunnels, archive, domain indexes). Pending user decision. | POSITIVE | 19 files, hook can't update all reliably | 7 core files proposed; hook prompt can be halved | session analysis |

## Consolidation State

- sessions_since_consolidation: 75
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | LESSON-TOOLING-009-over-engineering | Competitive analysis: Hermes (2-3 files), OpenClaw (2-3 files), Claude Code (1-4 files) all work well. Our 19-file system is 5-10x over-engineered. Root cause of hook failures = too many files to sync. Simplify to 3-5 core files. | POSITIVE | Assumed more files = better organization | Industry standard is 2-4 files; derived data (graph, tunnels, domain indexes) should be eliminated | web research: vectorize.io, zenvanriel.nl, nousresearch.com |

## Consolidation State

- sessions_since_consolidation: 76
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | LESSON-TOOLING-009-verified | Verified Hermes memory from official source (github.com/nousresearch/hermes-agent + docs). Key design: bounded memory (2200+1375 chars), frozen snapshot (prefix cache), agent-curated (add/replace/remove tool), SQLite FTS5 for episodic recall, skills separate from memory. Confirms: simple bounded files > complex multi-file indexing. | VALIDATED | Previous analysis from blog posts only | Now verified from official repo + docs | hermes-agent.nousresearch.com/docs/user-guide/features/memory |

## Consolidation State

- sessions_since_consolidation: 77
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | session-2026-04-29-redesign-decision | Decision: incremental fix over full redesign. System works, problem is hook prompt too long. Cut derived files (graph, tunnels, archive, domain indexes) → hook can update all 7 core files reliably. | POSITIVE | Considered full redesign | Incremental fix: lower risk, no data loss, faster | palace/state.md open thread |

## Consolidation State

- sessions_since_consolidation: 78
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | LESSON-TOOLING-010-design-origins | Traced agent-memory design origins: palace/Wings/Rooms/Tunnels/graph from MemPalace (Python+SQLite+MCP), knowledge/lessons+evolution from Hermes, AAAK compression from MemPalace. Key insight: MemPalace uses SQLite+Python for derived data (graph, tunnels, search). We implemented in pure Markdown → derived files become maintenance burden. Fix: cut derived files, keep core Markdown. | POSITIVE | Didn't know why graph/tunnels were hard to maintain | Now clear: they're SQLite-backed in original, not Markdown-native | MemPalace GitHub + Hermes docs |

## Consolidation State

- sessions_since_consolidation: 79
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | session-2026-04-29-slim-down-final | Slim down plan confirmed: cut 15 derived files, keep 7 core + detail files. Not a redesign — preserves all lessons/articles/wings. Hook prompt will be ~40% shorter. Execute next session. | POSITIVE | 19 files, hook unreliable | 7 core files, hook reliable | competitive analysis + design origins research |

## Consolidation State

- sessions_since_consolidation: 80
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | session-2026-04-29-slim-down-complete | Slim down COMPLETE: .claude agent-memory deleted graph+tunnels+archive+tooling/index. Hook v8.0.0 removes all derived file refs from Step 1/3/4B/5/5C. Both targets now 7 core files. No data lost. | POSITIVE | 19 files with derived data | 7 core files, hook reliable | deleteFile + hook updates |

## Consolidation State

- sessions_since_consolidation: 81
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | session-2026-04-29-self-improve-request | User wants Hermes-style self-improve: agent writes memory mid-session not just at agentStop. Options: CLAUDE.md rule + Kiro steering file (A+C). Open thread created. | POSITIVE | Hook-driven only (agentStop) | Agent-driven mid-session writes | Hermes memory tool comparison |

## Consolidation State

- sessions_since_consolidation: 82
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | session-2026-04-29-self-improve-done | Self-improve implemented: steering files (My Investment Port + .claude) + CLAUDE.md Key Rules. Agent now writes lessons/preferences mid-session without waiting for agentStop. Hermes-style agent-driven memory achieved. | POSITIVE | Hook-driven only (agentStop) | Agent-driven mid-session writes via steering file | .kiro/steering/agent-memory-self-improve.md |

## Consolidation State

- sessions_since_consolidation: 83
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | session-2026-04-29-rolling-window | Rolling window added to Recent Sessions (max 10 rows, oldest removed on add). Steering files + all 3 hooks synced. state.md now bounded like Hermes MEMORY.md. | POSITIVE | state.md grew unbounded | Capped at 10 sessions, auto-trim | steering + hook updates |

## Consolidation State

- sessions_since_consolidation: 84
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | session-2026-04-29-load-hook-sync | Load hook v3.1→v3.2: removed tunnels.md+archive/ from Bootstrap. 3 locations synced. Load+save hooks now consistent. | POSITIVE | Load hook still referenced removed files | Both hooks consistent with slim structure | .kiro/hooks/agent-memory-session-load.kiro.hook |

## Consolidation State

- sessions_since_consolidation: 85
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | session-2026-04-29-vitprojects-hooks | VitProjects hooks updated: save v6.4→v8.0 (slim structure, rolling window, suppress repeat), load v2.0→v3.2 (knowledge routing, slim bootstrap). All 3 projects now on latest hooks. | POSITIVE | VitProjects had very old hooks (v6.4/v2.0) | All projects consistent at v8.0/v3.2 | VitProjects/.kiro/hooks/ |

## Consolidation State

- sessions_since_consolidation: 86
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
| 2026-04-29 | session-2026-04-29-rolling-window-applied | Rolling window applied to state.md: trimmed from 35→10 rows. Load hook description synced to v3.2 (2 files). | POSITIVE | state.md had 35 rows (unbounded) | 10 rows, rolling window working | palace/state.md |

## Consolidation State

- sessions_since_consolidation: 87
- last_consolidation: 2026-04-26
- next_due: after 5 sessions or 7 days
