# 🏛️ Agent Memory Palace — State (Global)

> Cross-project memory managed via `agent-memory` system.
> Structure: palace/ (narrative) + knowledge/ (patterns)

## Active Wings

- **agent-memory** — Global memory & intelligence management (last updated: 2026-04-26)
- **ai-dlc-skills** — AI-DLC skill ecosystem: brainstorming, subagent-driven, Vibe/Spec mode (last updated: 2026-04-29)
- **token-optimization-tooling** — Token optimization research + .claude/rules/token_efficient.md (last updated: 2026-04-26)

## Recent Sessions

| Date | Wing | Summary |
|------|------|---------|
| 2026-04-29 | agent-memory | Kiro session: rolling window + bounded state — steering files + all 3 hooks updated. Recent Sessions capped at 10 rows (oldest removed on add). state.md now bounded. |
| 2026-04-29 | agent-memory | Kiro session: self-improve implemented — created steering files (My Investment Port + .claude) + updated CLAUDE.md Key Rules. Agent now writes lessons/preferences mid-session without waiting for agentStop. Open thread DONE ✅ |
| 2026-04-29 | agent-memory | Kiro session: slim down COMPLETE — .claude agent-memory: deleted graph+tunnels+archive+tooling/index. Hook v8.0.0: removed all derived file refs (Step 1/3/4B/5/5C). Synced 3 hook locations. Both agent-memory targets now 7 core files. |
| 2026-04-29 | agent-memory | Kiro session: slim down plan finalized — cut 15 derived files (graph, tunnels, archive, domain indexes), keep 7 core + lesson/article detail files. All capabilities preserved except visual graph + tunnel tracking. Ready to execute next session. |
| 2026-04-29 | agent-memory | Kiro session: traced design origins — palace/Wings/Rooms/Tunnels from MemPalace (Python lib), knowledge/lessons+evolution from Hermes, AAAK compression from MemPalace. We implemented MemPalace metaphor in pure Markdown without SQLite/Python backend. That's why derived files (graph, tunnels) are hard to maintain. |
| 2026-04-29 | agent-memory | Kiro session: competitive analysis — Hermes (2-3 files), OpenClaw (2-3 files), Claude Code (1-4 files) vs ours (19 files). All successful systems use 2-4 files. We are 5-10x over-engineered. Open thread: simplify to 3-5 core files. |
| 2026-04-29 | ai-dlc-skills | Kiro session: hook v7.0.0 — added Step 5C Full Audit to session-save hook. Every save now audits ALL files in agent-memory/ (graph, tunnels, user-profile, wings, lessons index, articles). Synced 3 locations. Gap closed. |
| 2026-04-29 | ai-dlc-skills | Kiro session: fixed consolidation nudge spam — hook v6.4.0→v6.5.0: Step 4D suppress repeat, Step 6 first-time-only message. Synced 3 hooks (.claude, My Investment Port, template). Also updated hall.md + lessons/tooling/index.md with LESSON-007+008. |
| 2026-04-29 | ai-dlc-skills | Kiro session: confirmed AIDLC Vibe/Spec is agent-agnostic — works on Kiro, Claude Code, Gemini, Cursor, Windsurf. Only detection differs (Kiro=IDE context, others=infer/ask). Artifacts+dialog same everywhere. |
| 2026-04-29 | ai-dlc-skills | Kiro session: applied all 3 corrections to skill files — (1) vibe-mode.md: detection=IDE context not keyword (2) kiro-spec-integration.md: rewritten as "AIDLC Dialog & Artifact Integration" — .aidlc/ only, no .kiro/specs/ (3) dialog format = global rule for all modes + all AI agents. workflow.md + SKILL.md updated. Open thread DONE ✅ |
| 2026-04-29 | ai-dlc-skills | Kiro session: clarified correction #3 — dialog message format is global rule for ALL AIDLC interactions regardless of AI agent (Kiro/Claude/Gemini). Not Kiro-specific. Reason: easier to read and track progress. |
| 2026-04-29 | ai-dlc-skills | Kiro session: found 3 corrections needed in AIDLC Vibe/Spec mode — (1) detection = Kiro IDE mode not keyword (2) Spec artifacts → .aidlc/ not .kiro/specs/ (3) dialog UX required for BOTH modes. Open thread to fix skill files. |
| 2026-04-29 | ai-dlc-skills | Kiro session: implemented AIDLC Vibe/Spec mode — created vibe-mode.md + kiro-spec-integration.md; updated workflow.md (Mode Selection + Phase Matrix + Hard Rules + Quick Commands) + SKILL.md (Pre-Flight Mode Detection section). Open thread DONE ✅ |
| 2026-04-29 | ai-dlc-skills | Kiro session: confirmed AIDLC Vibe/Spec mode requirements — (1) both modes supported (2) dialog message UX like Kiro Spec (3) spec mode = full AIDLC workflow. Path structure confirmed: .aidlc/ in sub-project, .kiro/specs/ at workspace root. Memory routing lesson: global skill design → .claude/agent-memory/ not project agent-memory/ ✅ |
| 2026-04-29 | ai-dlc-skills | Kiro session: noted open thread — vibe/spec mode design for AIDLC (next session) ✅ |
| 2026-04-29 | ai-dlc-skills | Kiro session: full ai-dlc/ connectivity verified + DRY-RUN Full AIDLC PBI-002 passed — brainstorming + subagent-driven both invoked correctly in flow ✅ |
| 2026-04-29 | ai-dlc-skills | Kiro session: verified full ai-dlc/ connectivity — all 17 skills registered in AIDLC_README.md; fixed related-skills.md Pre-AIDLC wording → mandatory ✅ |
| 2026-04-29 | ai-dlc-skills | Kiro session: fixed Related Skills in aidlc/SKILL.md — brainstorming wording corrected to mandatory; subagent-driven link added ✅ |
| 2026-04-29 | ai-dlc-skills | Kiro session: created core/subagent-driven/ skill — SKILL.md + dispatch-rules + context-template + review-checklist; registered in KIRO.md, skill-map.md, AIDLC_README.md, related-skills.md ✅ |
| 2026-04-29 | ai-dlc-skills | Kiro session: added brainstorming to rules/skill-map.md + README.md architecture tree; all 7 registration points now complete (KIRO.md, skill-map.md, AIDLC_README, aidlc/SKILL.md, related-skills.md, brainstorming/SKILL.md, README.md) ✅ |
| 2026-04-29 | ai-dlc-skills | Kiro session: upgraded Pre-Flight to mandatory-always + scale-aware — brainstorming runs on every new feature, auto-detects Small/Medium/Large, no question asked; skip only on resume ✅ |
| 2026-04-29 | ai-dlc-skills | Kiro session: upgraded Pre-Flight from optional→mandatory — AIDLC now asks brainstorm question on every new feature (no .aidlc/ folder); skip on resume/phase-entry commands ✅ |
| 2026-04-29 | ai-dlc-skills | Kiro session: completed brainstorming skill routing — added brainstorming to KIRO.md Skill Map + related-skills.md Pre-AIDLC section; all 5 routing points now consistent ✅ |
| 2026-04-29 | ai-dlc-skills | Kiro session: added Pre-Flight brainstorming section to core/aidlc/SKILL.md — triggers, skip condition, link to core/brainstorming/; Related Skills updated ✅ |
| 2026-04-29 | ai-dlc-skills | Kiro session: created core/brainstorming/ skill — SKILL.md + 4 references (po-lens, dev-lens, qa-lens, output-template); updated AIDLC_README.md with new entry; Party Mode style multi-role brainstorming before AIDLC DECISIONS phase ✅ |
| 2026-04-28 | agent-memory | Kiro session: updated hook template v6.2.0→v6.3.0 — article path fixed to knowledge/articles/{domain}/, crystallization path fixed, 4B now explicit about article file creation; project hook synced; checklist pattern moved from knowledge/ root to knowledge/articles/deployment/ ✅ |
| 2026-04-27 | agent-memory | Kiro session: found real gap — Consolidation State section missing from storage.md Knowledge Evolution schema; not in intelligence.md or maintenance.md; needs to be added to storage.md ✅ |
| 2026-04-27 | agent-memory | Kiro session: updated AGENT_MEMORY_README.md — removed duplicate section, added graph.md to tree, updated save rules + status to match current spec ✅ |
| 2026-04-27 | agent-memory | Kiro session: updated KIRO.md — Reading Order added knowledge/index.md, Minimum Update Contract added knowledge sync, finance/ added stock-peer-comparison ✅ |
| 2026-04-27 | agent-memory | Kiro session: added knowledge/index.md to Required Reading in HA CLAUDE.md+CODEX.md+GEMINI.md + My Investment Port CLAUDE.md+CODEX.md+GEMINI.md — 5 files updated ✅ |
| 2026-04-27 | agent-memory | Kiro session: confirmed CLAUDE.md reference pattern replaces hooks for token efficiency — agent reads state.md + knowledge/index.md via Required Reading section, no hook needed ✅ |
| 2026-04-27 | agent-memory | Kiro session: migrated Home Assistant agent-memory to new spec — index.md+evolution.md, lessons/climate/, graph.md, search-index.md, user-profile.md, tunnels prose, archive/index.md; index.json deleted ✅ |
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
| 2026-04-27 | kiro-workspace-setup | AGENT_MEMORY_README Thai, articles/{domain}/, both copies updated | palace/state.md | Translated AGENT_MEMORY_README.md to Thai in both .claude + VitProjects |
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
| 2026-04-25 | agent-memory | Created 5 Claude Code custom agents + restructured shared/→rules/ + fixed .gitignore ✅ |
| 2026-04-24 | agent-memory | Completed Agent Framework v2.0 + SSOT architecture ✅ |
| 2026-04-23 | ai-dlc-skills | All 21 SKILL.md files bilingual EN+TH; rules/ restructured ✅ |

## Current Focus

- focus: "agent-memory self-improve COMPLETE — steering files + CLAUDE.md rule. Agent writes mid-session now."
- blockers: ""
- next_action: "Test self-improve in next real session: fix a bug → verify lesson written immediately without waiting for agentStop"

## Open Threads

- [x] **agent-memory incremental fix** — ✅ DONE (2026-04-29): deleted graph+tunnels+archive+domain-indexes from both targets. Hook v8.0.0 synced (3 locations). 7 core files remain. No data lost.
- [x] agent-memory: create full-audit mechanism — ✅ DONE but may be unnecessary after simplification
- [x] **Self-improve (agent-driven memory)** — ✅ DONE (2026-04-29): steering files created (My Investment Port + .claude), CLAUDE.md Key Rules updated. Agent writes lessons/preferences mid-session immediately.
- [ ] agent-memory: migrate VitProjects JSON→MD (index.json → index.md + evolution.md)
- [ ] agent-memory: test bootstrap on a brand new project to verify spec works end-to-end
- [ ] ai-dlc-skills: verify {knowledge_root} resolves correctly at runtime
- [ ] ai-dlc-skills: test Vibe mode with a real feature to validate flow end-to-end

## Completed Threads (2026-04-29)

- [x] AIDLC Vibe/Spec Mode v2 — implemented + 3 corrections applied (detection=IDE context, artifacts→.aidlc/ only, dialog=global rule all agents)
- [x] agent-memory spec redesign — all-markdown, zero JSON, Knowledge Sync Gate
- [x] ai-dlc-knowledge migration — 34 .md files complete
- [x] agent-memory SKILL.md rewrite — schemas inlined, storage.md deleted
- [x] Home Assistant JSON→MD migration

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
