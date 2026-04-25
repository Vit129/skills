# Skills + SSOT Architecture

Personal knowledge base and skill library for AI-assisted development — works with Claude Code, Kiro, Gemini CLI, and Codex.
Uses a Single Source of Truth (SSOT) pattern: shared rules in `.claude/shared/` with auto-generated agent configs.

## Architecture Overview

```text
.claude/                        ← This repo (agent configuration SSOT)
├── .claude/                    ← Claude Code internal config (worktrees only)
├── .kiro/                      ← Kiro IDE config (hooks, steering, settings)
├── rules/                      ← Universal rules (SSOT for all agents)
│   ├── agent-core.md           ← Reading order, Karpathy principles, state management
│   ├── skill-map.md            ← Complete skill ecosystem reference
│   ├── project-rules.md        ← Project-specific rules and phase gates
│   ├── citation-format.md      ← Citation conventions
│   └── optimization.md         ← Token management standards
├── output-styles/              ← How agents communicate
│   └── communication-style.md  ← Tone and interaction guidelines
├── scripts/                    ← Agent sync scripts
│   └── sync-agent-instructions.sh  ← Reads rules/ → generates ~/.codex/CODEX.md, ~/.gemini/GEMINI.md
├── skills/                     ← Skill library (see below)
├── agent-memory/               ← Session memory (auto-managed, Memory Palace)
├── CLAUDE.md                   ← Claude Code global config
└── README.md                   ← This file

skills/                         ← Skill library
├── KIRO.md                     ← Kiro agent config: tier routing, skill map, Karpathy principles
├── postman-to-playwright/      ← Postman→Playwright migration (standalone, bypasses AI-DLC)
├── ai-dlc/                     ← Dev lifecycle: analysis, design, frontend, backend, QA, testing
│   ├── core/                   ← aidlc governance, analysis, monitoring, storage
│   ├── rules/                  ← coding standards: playwright, robotframework, test-scenario, industry
│   ├── qa/                     ← playwright-testing, robotframework-testing, performance, test-scenario
│   ├── dev/                    ← backend, frontend, devops-pipeline, impeccable-design
│   ├── po/                     ← architect (DDD, logical design)
│   └── ux-ui/                  ← ui-designer
├── system/                     ← Meta skills
│   ├── agent-memory/         ← Memory Palace + Knowledge Evolution
│   ├── ai-techniques/          ← CoT, LATS, AoT, reasoning techniques
│   ├── analysis-concept/       ← Concept analysis patterns
│   ├── skill-creator/          ← Create new skills
│   └── hook-creator/           ← Create agent hooks
├── finance/                    ← Investment research (local only, not copied to projects)
├── doc/                        ← Documentation: aidlc flowchart, swimlane
└── scripts/
    ├── setup/
    │   ├── setupAgentSkills.sh     ← Bootstrap .kiro/ + agent-memory/ for any project
    │   ├── setupKiro.sh            ← Setup Kiro IDE config (steering, hooks)
    │   ├── setupMemory.sh          ← Init agent-memory/ (Memory Palace)
    │   ├── setupTests.sh           ← Bootstrap COE QA test structure (API/Web/Mobile)
    │   ├── setupCodexSkills.sh     ← Expose Claude skills to Codex
    │   ├── postmanToPlaywright.sh  ← Copy postman migration skill to project
    │   └── _resolveTarget.sh       ← Internal: resolve target project path
    └── copyToWork/
        └── copySkills.sh           ← Copy shared skills to project (excludes personal/finance)

agent-memory/                ← Session memory (auto-managed)
├── palace/                     ← Memory Palace: state.md, wings, keyword/date indexes, tunnels
└── knowledge/                  ← Knowledge: lessons, design tokens, error strategies, index.json
```

## How Agents Load Configuration

| Agent | Entry Point | Source |
|-------|-------------|--------|
| **Claude Code** | `CLAUDE.md` (auto-loaded) | Global config + `rules/` + `skills/` |
| **Kiro** | `skills/KIRO.md` (via steering) | Skill map + Karpathy principles |
| **Codex** | `~/.codex/CODEX.md` (generated) | `scripts/sync-agent-instructions.sh` ← `rules/` |
| **Gemini CLI** | `~/.gemini/GEMINI.md` (generated) | `scripts/sync-agent-instructions.sh` ← `rules/` |
| **Any agent** | `rules/agent-core.md` | Universal rules (inlined in generated configs) |

## Key Concepts

**SSOT Pattern:** Shared rules live in `rules/`, sync script generates agent-specific configs. Edit shared files once → all agents updated automatically.

**Agent-Core (v2.0)** contains universal rules shared by all agents:

- **10 Mandatory Rules:** Plan Mode, Design & Craftsmanship, Error Recovery, Escalation & Handoff, Quality Gates, Performance Awareness, Security Checklist, Testing Strategy, Backwards Compatibility, Documentation Standard
- **Foundation:** Karpathy principles (Think, Simplicity, Surgical, Goal-Driven)
- **State Management:** Mandatory checklists (turn start/end)
- **Do Not Store:** Secrets, transcripts, speculation

**Agents** are Claude Code subagent personas in `agents/`. Each agent has a frontmatter with `skills:` references to load relevant skill files automatically.

**Skills** are markdown instruction files agents load on demand. Each skill has a `SKILL.md` with triggers, routing table, and references.

**Agent Memory** persists context and learning across sessions without a database — plain markdown + JSON. Includes user modeling, skill crystallization, periodic nudges, evolution audit trail, and session search.

**Setup scripts** bootstrap new projects with agent context layer (`.kiro/`, `agent-memory/`) and COE QA test structure — portable, not tied to any specific agent or path.