# Skills Sync Protocol

Source inspiration: YouTube video `KHWo3QWvSuM` — "ทำ AI Skills ให้ Claude Code + Codex ใช้งานเป็นระบบ ด้วย npm run skills".

Use this protocol when creating, updating, renaming, or syncing skills across Claude, Codex, Gemini, and Kiro-style workspaces.

## Goal

Keep one canonical skills source and mirror it to each agent runtime so all agents see the same skill definitions, references, and local instructions.

## Source Of Truth

- Canonical skill source: `~/.claude/skills/`
- Canonical rules source: `~/.claude/rules/`
- Skill routing source: `~/.claude/rules/skill-map.md`
- Skill sync script: `~/.claude/scripts/sync-skills.sh`
- Skill sync config: `~/.claude/scripts/sync-skills.config.json`
- Agent instruction sync script: `~/.claude/scripts/sync-agent-instructions.sh`
- Agent instruction sync config: `~/.claude/scripts/sync-agent-instructions.config.json`

Do not manually edit mirrored files under `~/.codex/skills/` or `~/.gemini/skills/` as the primary source. Edit `~/.claude/skills/` first, then sync.

## Runtime Targets

| Runtime | Skills target | Instruction file |
|---|---|---|
| Claude | `~/.claude/skills/` | `CLAUDE.md` |
| Codex / ChatGPT coding agent | `~/.codex/skills/` | `AGENTS.md` |
| Gemini | `~/.gemini/skills/` | `GEMINI.md` |
| Kiro / company workspace | project-specific `.kiro/skills/` when configured | Kiro hook/instruction templates |

Use `AGENTS.md`, not `CODEX.md`, for Codex/ChatGPT coding-agent instructions.

## Standard Skill Layout

Preferred structure:

```text
skills/<skill-name>/
├── SKILL.md
├── CLAUDE.md
├── AGENTS.md
├── GEMINI.md
├── references/
│   └── *.md
└── personal/
    └── *.md
```

Only add `personal/` when there is real user/project-specific context. Generic protocols belong in `references/`.

## Instruction File Rule

For agent-specific instruction files inside a skill:

- `CLAUDE.md`: Claude-facing local instructions
- `AGENTS.md`: Codex / ChatGPT coding-agent local instructions
- `GEMINI.md`: Gemini-facing local instructions
- Keep the content identical unless a runtime genuinely needs different behavior
- If content is intentionally different, document why at the top of the file

For chat-safe skills, instruction files should name markdown files directly, for example `nutrition.md`, `tax-accounting.md`, or `SKILL.md (Stock Deep Analysis)`, instead of requiring the user to know folder paths.

## Sync Commands

Run skills sync after editing any skill files:

```bash
bash ~/.claude/scripts/sync-skills.sh
```

Preview without writing:

```bash
bash ~/.claude/scripts/sync-skills.sh --dry-run
```

Run agent instruction sync after editing global rules:

```bash
bash ~/.claude/scripts/sync-agent-instructions.sh
```

Optional project wrapper, if the project has `package.json`:

```json
{
  "scripts": {
    "skills": "bash ~/.claude/scripts/sync-skills.sh",
    "agent:instructions": "bash ~/.claude/scripts/sync-agent-instructions.sh"
  }
}
```

Then:

```bash
npm run skills
```

## Safe Update Workflow

1. Edit canonical files in `~/.claude/skills/<skill-name>/`.
2. Confirm `SKILL.md` describes when the skill should trigger.
3. Confirm `CLAUDE.md`, `AGENTS.md`, and `GEMINI.md` exist for chat/runtime routing when the skill needs local instructions.
4. Confirm referenced markdown files actually exist.
5. Update `~/.claude/rules/skill-map.md` if the skill is new or renamed.
6. Run `bash ~/.claude/scripts/sync-skills.sh`.
7. Verify target files exist under `~/.codex/skills/` and `~/.gemini/skills/`.
8. Run `bash ~/.claude/scripts/sync-agent-instructions.sh` only if global rules changed.

## Verification Checklist

Use these checks after a sync:

```bash
find ~/.codex/skills/<skill-name> -maxdepth 2 -type f | sort
find ~/.gemini/skills/<skill-name> -maxdepth 2 -type f | sort
```

For instruction parity:

```bash
cmp -s ~/.claude/skills/<skill-name>/CLAUDE.md ~/.claude/skills/<skill-name>/AGENTS.md
cmp -s ~/.claude/skills/<skill-name>/CLAUDE.md ~/.claude/skills/<skill-name>/GEMINI.md
```

If `cmp` exits `0`, the files match.

## What Not To Do

- Do not make `~/.codex/skills/` or `~/.gemini/skills/` the source of truth.
- Do not keep stale `CODEX.md` when `AGENTS.md` is the intended Codex instruction file.
- Do not copy generic reference content into `personal/`; personal files should contain user/project-specific overlay only.
- Do not leave instruction files pointing to markdown files that do not exist.
- Do not delete unrelated user skills during sync. Sync should mirror configured targets without removing unrelated directories unless the config explicitly owns that target.

## When To Create A Protocol

Create a protocol markdown under `rules/` or a skill `references/` folder when:

- A workflow is repeated more than once
- The same decision keeps being rediscovered in chat
- A video/article/process becomes operational guidance
- The workflow affects multiple agents or sync targets
- There are naming conventions that must stay consistent

Protocol files should be short enough to scan, explicit about source of truth, and include exact commands.
