# setup-script-root-support

> setupAgentSkills.sh — added workspace root install support

## Context
- Script: `ai-agent/skills/scripts/setup/setupAgentSkills.sh`
- Problem: script only supported subfolder names via `find`, no way to install at BASE_DIR (workspace root) itself
- User wanted `bash setupAgentSkills.sh .` to setup at root

## Changes (2026-04-21)
- Added `.` and `--self` as special-case TARGET_DIR values → skip `find`, use `BASE_DIR` directly
- Updated usage/help text to document new options
- 3 edit points: folder detection block, header comment, help text (both error + --help)

## Usage After Fix
```bash
bash setupAgentSkills.sh .          # install at workspace root
bash setupAgentSkills.sh . --force  # install at root + overwrite
bash setupAgentSkills.sh MyProject  # subfolder (unchanged behavior)
```

## Additional Changes (2026-04-21)
- Removed `.unified-memory/` from gitignore logic — unified-memory is now tracked in git (part of project context)
- Deleted gitignore append block from script, replaced with comment
- Cleared `ai-agent/.gitignore` which only had `.unified-memory/`
- Added absolute path support (`/Users/xxx/MyProject`) to folder detection — all 3 copies synced (.claude, VitProjects, .gemini)
- Replaced `find -maxdepth 4` with level-by-level search (depth 1→2→3→4) so results are always sorted shallowest-first (root priority) — all 3 copies synced

## Open Limitation (2026-04-21)
- Cross-project search: running from `.claude/` copy can't find `VitProjects/` by name (different .git roots)
- Workaround: use absolute path
- Potential fix: fallback search to `$HOME` or parent of `BASE_DIR` if not found in `BASE_DIR`
- Status: OPEN — awaiting user decision
- `BASE_DIR` used `../../..` (3 levels up) but actual path needs 4+ levels
- Fixed: replaced hardcoded walk-up with `.git/` detection loop (walk up until `.git/` found, fallback to `pwd`)
- All 3 copies synced (.claude, VitProjects, .gemini)

## Portable Links Fix (2026-04-21)
- GEMINI.md + KIRO.md: replaced `../.agents/AGENTS.md` relative path with `{project_root}/.agents/AGENTS.md` placeholder — then reverted to correct relative paths per copy location
- VitProjects/ai-agent/skills/: `../../.agents/AGENTS.md` (2 levels up)
- .claude/skills/: `../.agents/AGENTS.md` (1 level up)
- Root problem: relative paths break when files are copied to different depth locations — no universal fix without symlinks or setup-time resolution
