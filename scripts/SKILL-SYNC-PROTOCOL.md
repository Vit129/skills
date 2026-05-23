# Agent Sync Protocol

Use this protocol when creating, updating, renaming, or syncing skills across Claude, Codex, Gemini, and Kiro.

---

## Source of Truth Hierarchy

```
~/.kiro/skills/          ← UPSTREAM (redesigned flat structure)
      │
      ▼ sync-skills-to-claude.sh
~/.claude/skills/        ← CANONICAL (Claude source of truth)
      │
      ├── sync-skills.sh → ~/.codex/skills/
      └── sync-skills.sh → ~/.gemini/skills/
```

**Rule:** Edit `~/.kiro/skills/` first (company/shared skills), then sync down. Edit `~/.claude/skills/` directly only for personal skills (finance, fitness, thai-accountant, etc.).

---

## Skill Structure (New Flat Layout)

```
skills/
├── governance/          # AIDLC process control
├── thinking/            # Ideation & analysis
├── dev/                 # Implementation & architecture
├── qa/                  # Quality & testing
├── debugging/           # Bug lifecycle
├── review/              # Code review & communication
├── tooling/             # Integrations & utilities
├── ux-ui/               # Design
├── rules/               # Coding standards
├── knowledge/           # Reference data
├── templates/           # Reusable templates
├── meta-skills/         # Generic reusable skills
├── drafts/              # Staging area
│
│ ── Personal (Claude-only) ──
├── finance/
├── fitness/
├── thai-accountant/
├── claude-code-tips/
└── playwright-cli/
```

Each skill folder contains `SKILL.md` (required). No per-skill `CLAUDE.md`/`AGENTS.md`/`GEMINI.md` needed — routing is handled by `rules/skill-map.md`.

---

## Runtime Targets

| Runtime | Skills | Rules | Instruction file |
|---------|--------|-------|-----------------|
| Claude | `~/.claude/skills/` | `~/.claude/rules/` | `CLAUDE.md` |
| Codex | `~/.codex/skills/` | `~/.codex/rules/` | `AGENTS.md` |
| Gemini | `~/.gemini/skills/` | `~/.gemini/rules/` | `GEMINI.md` |
| Kiro | `~/.kiro/skills/` | `~/.kiro/rules/` | `~/.kiro/AGENTS.md` |

---

## Sync Commands

### Sync from Kiro → Claude (upstream → canonical)

```bash
# Preview
bash ~/.kiro/scripts/sync-skills-to-claude.sh --dry-run

# Apply (replaces company skills, preserves personal)
bash ~/.kiro/scripts/sync-skills-to-claude.sh
```

### Sync from Claude → Codex + Gemini

```bash
# Skills
bash ~/.claude/scripts/sync-skills.sh

# Rules
bash ~/.claude/scripts/sync-rules.sh

# Agent instruction files (AGENTS.md, GEMINI.md)
bash ~/.claude/scripts/sync-agent-instructions.sh

# Commands
bash ~/.claude/scripts/sync-commands.sh

# Agent personas
bash ~/.claude/scripts/sync-agents.sh
```

Preview any script: append `--dry-run`

### Full sync (all at once)

```bash
bash ~/.kiro/scripts/sync-skills-to-claude.sh && \
bash ~/.claude/scripts/sync-skills.sh && \
bash ~/.claude/scripts/sync-rules.sh && \
bash ~/.claude/scripts/sync-agent-instructions.sh
```

---

## Safe Update Workflow

### Adding/updating a shared skill

1. Edit in `~/.kiro/skills/<folder>/<skill-name>/SKILL.md`
2. Update `~/.kiro/AGENTS.md` skill map if new or renamed
3. Run `bash ~/.kiro/scripts/sync-skills-to-claude.sh`
4. Run `bash ~/.claude/scripts/sync-skills.sh`
5. Verify: `ls ~/.codex/skills/<folder>/<skill-name>/`

### Adding/updating a personal skill (Claude-only)

1. Edit directly in `~/.claude/skills/<skill-name>/SKILL.md`
2. Update `~/.claude/rules/skill-map.md` if new or renamed
3. Run `bash ~/.claude/scripts/sync-skills.sh` (mirrors to Codex/Gemini if desired)

### Updating rules

1. Edit in `~/.claude/rules/`
2. Run `bash ~/.claude/scripts/sync-rules.sh`
3. Run `bash ~/.claude/scripts/sync-agent-instructions.sh`

---

## Verification

```bash
# Check skill synced to Codex
ls ~/.codex/skills/<folder>/<skill-name>/

# Check skill synced to Gemini
ls ~/.gemini/skills/<folder>/<skill-name>/

# Check rules synced
diff ~/.claude/rules/skill-map.md ~/.codex/rules/skill-map.md
```

---

## What NOT To Do

- Do NOT edit `~/.codex/skills/` or `~/.gemini/skills/` directly — they are mirrors
- Do NOT add per-skill `CLAUDE.md`/`AGENTS.md`/`GEMINI.md` — routing is in `skill-map.md`
- Do NOT put personal skills in `~/.kiro/skills/` — they belong in `~/.claude/skills/` only
- Do NOT skip `sync-skills-to-claude.sh` when editing Kiro skills — Claude won't see the changes
