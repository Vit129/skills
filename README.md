# Skills

Personal knowledge base and skill library for AI-assisted development — works with Claude Code, Kiro, and Gemini CLI.

## What's inside

```
{skills_root}/           ← e.g. ~/.claude/ or ~/ai-agent/
├── CLAUDE.md            ← Claude Code entry point: skill map, agent tier, Karpathy principles
├── .agents/
│   └── AGENTS.md        ← symlink → skills/AGENTS.md (shared rules for all agents)
├── skills/
│   ├── AGENTS.md        ← Shared agent rules: Trust Priority, AIDLC rules, Karpathy, Do Not Store
│   ├── KIRO.md          ← Kiro entry point: tier selection + skill map
│   ├── GEMINI.md        ← Gemini CLI entry point: research + scaffold tasks
│   ├── ai-dlc/          ← Dev lifecycle: analysis, design, frontend, backend, QA, testing
│   │   ├── core/        ← aidlc governance, analysis, monitoring, storage
│   │   ├── qa/          ← playwright, robotframework, test-scenario, postman, performance
│   │   ├── dev/         ← backend, frontend, devops-pipeline
│   │   ├── po/          ← architect (DDD, logical design)
│   │   └── ux-ui/       ← ui-designer
│   ├── system/          ← unified-memory, ai-techniques, analysis-concept, skill-creator, hook-creator
│   ├── finance/         ← Investment portfolio: tax, dividend, rebalance, stock analysis
│   ├── doc/             ← Documentation: aidlc flowchart, swimlane
│   └── scripts/
│       └── setup/
│           ├── setupAgentSkills.sh  ← Bootstrap .agents/ + .kiro/ + .unified-memory/ for any project
│           └── setupTests.sh        ← Bootstrap COE QA test structure (API/Web/Mobile)
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
| **Any agent** | `.agents/AGENTS.md` — shared rules, Trust Priority, AIDLC rules |

## Key concepts

**Skills** are markdown instruction files that agents load on demand. Each skill has a `SKILL.md` with triggers, routing table, and references.

**AGENTS.md** is the shared entry point for all agents — Trust Priority, AIDLC rules, Karpathy Principles, Do Not Store, Minimum Update Contract. Symlinked into `.agents/AGENTS.md` so any project can reference it.

**Unified Memory** persists context and learning across sessions without a database — plain markdown + JSON. Includes user modeling, skill crystallization, periodic nudges, evolution audit trail, and session search.

**Setup scripts** bootstrap new projects with agent context layer (`.agents/`, `.kiro/`, `.unified-memory/`) and COE QA test structure — portable, not tied to any specific agent or path.

## Quick start

```bash
# Bootstrap agent context for a new project:
bash ~/.claude/skills/scripts/setup/setupAgentSkills.sh MyProject

# Bootstrap QA test structure (prompted automatically after agent setup):
bash ~/.claude/skills/scripts/setup/setupTests.sh MyProject

# Load memory at session start:
"load context for [project]"

# Save memory at session end:
"save session + learn"

# Invoke a specific skill:
"use playwright-testing to write tests for [file]"
```
