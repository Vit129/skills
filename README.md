# Skills + SSOT Architecture

Personal knowledge base and skill library for AI-assisted development — works with Claude Code, Kiro, Gemini CLI, and Codex.
Uses a Single Source of Truth (SSOT) pattern: shared rules in `rules/` with auto-generated agent configs.

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
│   └── token_efficient.md      ← Token management standards
├── output-styles/              ← How agents communicate
│   └── communication-style.md  ← Tone and interaction guidelines
├── scripts/                    ← Agent sync scripts
│   └── sync-agent-instructions.sh  ← Reads rules/ → generates ~/.codex/CODEX.md, ~/.gemini/GEMINI.md
├── skills/                     ← Skill library (see below)
├── agent-memory/               ← Cross-domain persistent memory (hooks automate)
│   ├── memory.md               ← Hot state (2.5KB max, loaded first)
│   ├── playbook.md             ← Flat problem resolution table
│   ├── skill-log.md            ← Append-only skill improvement log
│   ├── drafts/                 ← Temporary resolution drafts (ephemeral)
│   └── knowledge/              ← Optional detail files (on-demand)
├── CLAUDE.md                   ← Claude Code global config
└── README.md                   ← This file

skills/                         ← Skill library
├── KIRO.md                     ← Kiro agent config: tier routing, skill map, Karpathy principles
├── postman-to-playwright/      ← Postman→Playwright migration (standalone, bypasses AI-DLC)
├── ai-dlc/                     ← Dev lifecycle: analysis, design, frontend, backend, QA, testing
│   ├── core/                   ← brainstorming (party mode), aidlc governance, analysis, monitoring, storage
│   ├── rules/                  ← coding standards: playwright, robotframework, test-scenario, industry
│   ├── qa/                     ← playwright-testing, robotframework-testing, performance, test-scenario
│   ├── dev/                    ← backend, frontend, devops-pipeline, impeccable-design
│   ├── po/                     ← architect (DDD, logical design)
│   └── ux-ui/                  ← ui-designer
├── system/                     ← Meta skills
│   ├── ai-techniques/          ← CoT, LATS, AoT, reasoning techniques
│   ├── analysis-concept/       ← Concept analysis patterns
│   ├── multi-agent-router/     ← Route tasks to Gemini/Codex/Claude by token cost
│   ├── skill-creator/          ← Create new skills
│   └── agent-memory/           ← Cross-domain agent memory (templates + session flow)
├── finance/                    ← Investment research (local only, not copied to projects)
├── fitness/                    ← Fitness coaching, nutrition, workout planning
├── doc/                        ← Documentation: aidlc flowchart, swimlane
└── scripts/                    ← Scripts: setup system
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

**Setup scripts** bootstrap new projects with agent context layer and COE QA test structure — portable, not tied to any specific agent or path.