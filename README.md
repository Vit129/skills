# Skills

Personal knowledge base and skill library for AI-assisted development — works with Claude Code, Kiro, and Gemini CLI.

## What's inside

```
~/.claude/
├── CLAUDE.md            ← Single entry point: skill map, agent tier, Karpathy principles
├── skills/
│   ├── ai-dlc/          ← Dev lifecycle: analysis, design, frontend, backend, QA, testing
│   │   ├── core/        ← aidlc governance, analysis, monitoring, storage
│   │   ├── qa/          ← playwright, robotframework, test-scenario, postman, performance
│   │   ├── dev/         ← backend, frontend, devops-pipeline
│   │   ├── po/          ← architect (DDD, logical design)
│   │   └── ux-ui/       ← ui-designer
│   ├── system/          ← unified-memory, ai-techniques, analysis-concept, skill-creator, hook-creator
│   └── finance/         ← Investment portfolio: tax, dividend, rebalance, stock analysis
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

## Key concepts

**Skills** are markdown instruction files that agents load on demand. Each skill has a `SKILL.md` with triggers, routing table, and references.

**CLAUDE.md** is the single entry point — agents read this once and know exactly which skill to load, no extra hops needed.

**Unified Memory** persists context and learning across sessions without a database — plain markdown + JSON. Includes user modeling, skill crystallization, periodic nudges, evolution audit trail, and session search.

## Quick start

```bash
# Load memory at session start:
"load context for [project]"

# Save memory at session end:
"save session + learn"

# Invoke a specific skill:
"use playwright-testing to write tests for [file]"
```
