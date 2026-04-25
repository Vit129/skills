# Skills + SSOT Architecture

Personal knowledge base and skill library for AI-assisted development — works with Claude Code, Kiro, Gemini CLI, and Codex.
Uses a Single Source of Truth (SSOT) pattern: shared rules in `.claude/shared/` with auto-generated agent configs.

## Architecture Overview

```
.claude/                    ← Agent configuration (SSOT)
├── shared/                 ← Universal rules (committed to GitHub)
│   ├── agent-core.md       ← Reading order, Karpathy principles, state management
│   ├── skill-map.md        ← Complete skill ecosystem reference
│   ├── project-rules.md    ← Project-specific rules and phase gates
│   └── citation-format.md  ← Citation conventions
├── scripts/
│   └── sync-agent-instructions.sh  ← Reads .claude/shared/ → generates ~/.codex/CODEX.md, ~/.gemini/GEMINI.md
└── README.md               ← This architecture

CLAUDE.md                   ← Project-level config (thin adapter)
├── References .claude/shared/ for skill map + rules
└── Can add project-specific overrides

{skills_root}/              ← Skill library (e.g. ~/.claude/skills/ or ai-agent/skills/)
├── postman-to-playwright/  ← Postman→Playwright migration (standalone, not AI-DLC)
├── ai-dlc/                 ← Dev lifecycle: analysis, design, frontend, backend, QA, testing
│   ├── core/               ← aidlc governance, analysis, monitoring, storage
│   ├── rules/              ← coding standards: playwright, robotframework, test-scenario, industry
│   ├── qa/                 ← playwright-testing, robotframework-testing, performance
│   ├── dev/                ← backend, frontend, devops-pipeline, impeccable-design
│   ├── po/                 ← architect (DDD, logical design)
│   └── ux-ui/              ← ui-designer
├── system/                 ← unified-memory, ai-techniques, skill-creator, hook-creator
├── finance/                ← Investment research (local only)
├── doc/                    ← Documentation: aidlc flowchart, swimlane
└── scripts/
    ├── setup/
    │   ├── setupAgentSkills.sh     ← Bootstrap .kiro/ + .unified-memory/ for any project
    │   ├── setupKiro.sh            ← Setup Kiro IDE config (steering, hooks)
    │   ├── setupMemory.sh          ← Init .unified-memory/ (Memory Palace)
    │   ├── setupTests.sh           ← Bootstrap COE QA test structure (API/Web/Mobile)
    │   └── postmanToPlaywright.sh  ← Copy postman migration skill to project
    └── copyToWork/
        └── copySkills.sh           ← Copy shared skills to project (excludes personal)

.unified-memory/            ← Session memory (auto-managed)
├── palace/                 ← Memory Palace: wings, rooms, state tracking
└── knowledge/              ← Knowledge Evolution: utility scores, lessons
```

## How Agents Load Configuration

| Agent | Entry Point | Source |
|-------|-------------|--------|
| **Claude Code** | `CLAUDE.md` (auto-loaded) | Thin adapter + `.claude/shared/skill-map.md` |
| **Codex** | `~/.codex/CODEX.md` (generated) | `./.claude/scripts/sync-agent-instructions.sh` |
| **Gemini CLI** | `~/.gemini/GEMINI.md` (generated) | `./.claude/scripts/sync-agent-instructions.sh` |
| **Any agent** | `.claude/shared/agent-core.md` | Universal rules (in generated configs) |

## Key Concepts

**SSOT Pattern:** Shared rules live in `.claude/shared/`, sync script generates agent-specific configs at `~/.codex/CODEX.md` and `~/.gemini/GEMINI.md`. Edit shared files once → all agents updated automatically.

**Agent-Core (v2.0)** contains universal rules shared by all agents:
- **10 Mandatory Rules:** Plan Mode, Design & Craftsmanship, Error Recovery, Escalation & Handoff, Quality Gates, Performance Awareness, Security Checklist, Testing Strategy, Backwards Compatibility, Documentation Standard
- **Foundation:** Karpathy principles (Think, Simplicity, Surgical, Goal-Driven)
- **State Management:** Mandatory checklists (turn start/end)
- **Do Not Store:** Secrets, transcripts, speculation

**Skills** are markdown instruction files agents load on demand. Each skill has a `SKILL.md` with triggers, routing table, and references.

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
