# Skills

Personal knowledge base and skill library for AI-assisted development — works with Claude Code, Kiro, and Gemini CLI.

## What's inside

```
{project-root}/
├── skills/
│   ├── ai-dlc/          ← Dev lifecycle: analysis, design, frontend, backend, QA, testing
│   ├── system/          ← Meta-skills: unified-memory, skill-creator, hook-creator, ai-techniques
│   └── finance/         ← Investment portfolio: algorithms, tax, dividend tracking
│
├── .unified-memory/     ← Session memory (auto-managed, per-project)
│   ├── palace/          ← Memory Palace: wings, rooms, closets, archive
│   └── knowledge/       ← Knowledge Evolution: utility scores, lessons
│
└── CLAUDE.md            ← Workspace hooks + active integrations
```

## How agents use this

| Agent | Entry point |
|-------|-------------|
| **Claude Code** | `CLAUDE.md` auto-loaded → reads `skills/CLAUDE.md` for skill strategy |
| **Kiro** | Point to `skills/AGENT.md` in steering |
| **Gemini CLI** | `skills/GEMINI.md` — research + scaffold tasks |
| **Any agent** | `skills/SKILL.md` — full index of all skills |

## Key concepts

**Skills** are markdown instruction files that agents load on demand. Each skill has a `SKILL.md` with triggers, commands, and step-by-step workflows.

**Unified Memory** persists context and learning across sessions without a database — plain markdown + JSON. Trigger with `"save session + learn"` / `"load context"`.

**Agent tier strategy** (`skills/CLAUDE.md`): Gemini for research, Haiku for simple edits, Sonnet for logic-heavy work. Keeps costs low without sacrificing quality.

## Quick start

```bash
# Claude Code — skills auto-activate via CLAUDE.md hooks
# Load memory at session start:
"load context for [project]"

# Save memory at session end:
"save session + learn"

# Invoke a specific skill:
"use playwright-testing to write tests for [file]"
```
