# 🏛️ Agent Memory Palace — State (Global)

> Cross-project memory managed via `agent-memory` system.
> Structure: palace/ (narrative) + knowledge/ (patterns)

## Active Wings

- **agent-memory** — Global memory & intelligence management (last updated: 2026-04-25)
- **ai-dlc-skills** — AI-DLC skill ecosystem (last updated: 2026-04-23)

## Recent Sessions

| Date | Wing | Summary |
|------|------|---------|
| 2026-04-25 | agent-memory | Updated sync-agent-instructions.sh: all references changed from .claude/shared/ → rules/; shared/ can now be deleted; open thread updated ✅ |
| 2026-04-25 | agent-memory | Restructuring shared/ → rules/: copied files to rules/ at root level, communication-style.md included; decided to keep rules/ at root (not strict Anatomy spec) ✅ |
| 2026-04-25 | agent-memory | Fixed .gitignore: added .claude/, scripts/, rules/ to whitelist; re-ignore worktrees/ + settings.local.json; agents + shared now tracked by git ✅ |
| 2026-04-25 | agent-memory | Created 5 Claude Code custom agents (po, uxui, qa, dev, architect) in .claude/.claude/agents/ + copied to ~/.claude/agents/ (global scope, available in all projects); agents use skill preloading + project memory + tool restrictions ✅ |
| 2026-04-25 | agent-memory | Removed dual-mode/global fallback from knowledge resolution: agent-memory/knowledge/ is now single source of truth (per-project only); skills/ = engine not data; added bootstrap flow for new projects; updated intelligence.md, SKILL.md, adaptation.md, CLAUDE.md ✅ |
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

- focus: "Knowledge resolution simplified: per-project only, no global fallback; all docs synced ✅"
- blockers: ""
- next_action: "Verify {knowledge_root} resolves correctly at runtime; commit changes"

## Open Threads

- [ ] ai-dlc-skills: verify {knowledge_root} resolves correctly at runtime
- [ ] Cleanup: delete .claude/shared/ (sync script now reads from rules/)
- [ ] Rename agent-memory/ → agent-memory/ across 38 files + folder rename; sed replace all references; update .gitignore

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
