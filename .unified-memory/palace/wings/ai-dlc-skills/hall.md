# 🏛️ Hall — ai-dlc-skills

> Wing for the AI-DLC skill ecosystem development and maintenance.

## Facts
- Skill structure: `.claude/skills/ai-dlc/{core,dev,qa}/` + `.claude/skills/system/` (domain-agnostic)
- Each skill has `SKILL.md` + optional `references/`, `scripts/`, `assets/`
- Hooks live in `.claude/.kiro/hooks/*.kiro.hook`
- Progressive disclosure: metadata → SKILL.md body → bundled resources

## Decisions
- [2025-04-09] Created Memory Palace Light version as markdown-based system
- [2025-04-09] Chose agentStop hook for auto-save (not promptSubmit) to avoid noise
- [2025-04-09] Established 2-tier architecture: user-level (ตัวกลาง) + workspace adapter
- [2025-04-09] Updated hook to 10-step flow with AAAK, temporal triples, contradiction detection
- [2026-04-11] Created knowledge-evolution skill in system/ (domain-agnostic, 3-layer design)
- [2026-04-11] Deferred BM25/vector search — intent_patterns cover gap without dependencies
- [2026-04-12] Demo simulation complete: 4 systems, 10 feedback items → all fixed in 8 skill files ✅
- [2026-04-12] Claude Code leak analysis: 32 insights → 29 upgrade tasks (Phase 0-D)
- [2026-04-12] Sprint plan: 4 sprints — Sprint 1 (today), Sprint 2 (this week), Sprint 3-4 (later)


## Patterns
- SKILL.md uses YAML frontmatter with `name` + `description`
- Hook JSON follows Kiro schema with `when.type` + `then.type`
- User-level skills = cross-workspace shared, workspace-level = project-specific adapter

## Rooms Index
- `memory-palace-setup.md` — Creation & evolution of the Memory Palace skill (2-tier)
- `standards-update-2026-04-09.md` — Cross-platform standards, locator strategy, workflow fixes
- `skill-testing-progress.md` — japan-travel skill-testing project phase status
- `knowledge-evolution-skill.md` — knowledge-evolution system skill (3-layer design, Phase A-D roadmap)
- `skill-structure-upgrade-2026-04-12.md` — Sub-folder restructure + new references + v1 checkpoint borrow
- `v1-v2-full-comparison.md` — Complete v1 (_backup) vs v2 (ai-dlc) system comparison: 30/30 covered + 15 v2-only
- `setup-script-root-support.md` — setupAgentSkills.sh: added "." and "--self" support for workspace root install
- `impeccable-design-skill.md` — Added impeccable-design skill to dev/ from pbakaus/impeccable repo
- `rules-folder-restructure.md` — Centralized 4 -rules skills into ai-dlc/rules/ folder
