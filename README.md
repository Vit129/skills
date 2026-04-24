# Skills

Personal knowledge base and skill library for AI-assisted development — works with Claude Code, Kiro, and Gemini CLI.
Can also be exposed to Codex while keeping `~/.claude/skills` as the single source of truth.

## What's inside

```
{skills_root}/           ← e.g. ~/.claude/ or ~/ai-agent/
├── CLAUDE.md            ← Claude Code entry point: skill map, agent tier, Karpathy principles
├── skills/
│   ├── AGENTS.md        ← Shared agent rules: Trust Priority, AIDLC rules, Karpathy, Do Not Store
│   ├── KIRO.md          ← Kiro entry point: tier selection + skill map
│   ├── GEMINI.md        ← Gemini CLI entry point: research + scaffold tasks
│   ├── postman-to-playwright/ ← Postman→Playwright migration (standalone, not AI-DLC)
│   ├── ai-dlc/          ← Dev lifecycle: analysis, design, frontend, backend, QA, testing
│   │   ├── core/        ← aidlc governance, analysis, monitoring, storage
│   │   ├── rules/       ← coding standards: playwright, robotframework, test-scenario, industry
│   │   ├── qa/          ← playwright-testing, robotframework-testing, performance
│   │   ├── dev/         ← backend, frontend, devops-pipeline
│   │   ├── po/          ← architect (DDD, logical design)
│   │   └── ux-ui/       ← ui-designer
│   ├── system/          ← unified-memory, ai-techniques, skill-creator, hook-creator
│   ├── finance/         ← Investment research (local only)
│   ├── doc/             ← Documentation: aidlc flowchart, swimlane
│   └── scripts/
│       ├── setup/
│       │   ├── setupAgentSkills.sh     ← Bootstrap .kiro/ + .unified-memory/ for any project
│       │   ├── setupKiro.sh            ← Setup Kiro IDE config (steering, hooks)
│       │   ├── setupMemory.sh          ← Init .unified-memory/ (Memory Palace)
│       │   ├── setupTests.sh           ← Bootstrap COE QA test structure (API/Web/Mobile)
│       │   └── postmanToPlaywright.sh  ← Copy postman migration skill to project
│       └── copyToWork/
│           └── copySkills.sh           ← Copy shared skills to project (excludes personal)
│
└── .unified-memory/     ← Session memory (auto-managed)
    ├── palace/          ← Memory Palace: wings, rooms, closets, archive
    └── knowledge/       ← Knowledge Evolution: utility scores, lessons
```

## How agents use this

| Agent | Entry point |
|-------|-------------|
| **Claude Code** | `CLAUDE.md` auto-loaded — skill map + routing built in |
| **Kiro** | `skills/KIRO.md` — tier selection + skill map |
| **Gemini CLI** | `skills/GEMINI.md` — research + scaffold tasks |
| **Codex** | Symlink or copy `skills/` into `~/.codex/skills/claude-ssot` via `skills/scripts/setup/setupCodexSkills.sh` |
| **Any agent** | `skills/AGENTS.md` — shared rules, Trust Priority, AIDLC rules |

## Key concepts

**Skills** are markdown instruction files that agents load on demand. Each skill has a `SKILL.md` with triggers, routing table, and references.

**AGENTS.md** is the shared entry point for all agents — Trust Priority, AIDLC rules, Karpathy Principles, Do Not Store, Minimum Update Contract.

**Unified Memory** persists context and learning across sessions without a database — plain markdown + JSON. Includes user modeling, skill crystallization, periodic nudges, evolution audit trail, and session search.

**Setup scripts** bootstrap new projects with agent context layer (`.kiro/`, `.unified-memory/`) and COE QA test structure — portable, not tied to any specific agent or path.

## Quick start

```bash
# Bootstrap agent context for a new project:
bash ~/.claude/skills/scripts/setup/setupAgentSkills.sh MyProject

# Bootstrap QA test structure (prompted automatically after agent setup):
bash ~/.claude/skills/scripts/setup/setupTests.sh MyProject

# Copy postman migration skill to project (optional):
bash ~/.claude/skills/scripts/setup/postmanToPlaywright.sh MyProject

# Expose Claude skills to Codex while keeping Claude as SSOT:
bash ~/.claude/skills/scripts/setup/setupCodexSkills.sh

# Load memory at session start:
"load context for [project]"

# Save memory at session end:
"save session + learn"

# Invoke a specific skill:
"use playwright-testing to write tests for [file]"
```
