# AI Agent Skills — Universal Entry Point

> This file is the single entry point for all AI agents (Claude Code, Kiro, or any future agent).
> Skills root = the folder containing this file. No hardcoded paths needed.

---

## Quick Start

| Agent | Load this file |
|-------|---------------|
| **Kiro** | Tell Kiro: `"Read AGENT.md in the skills folder and follow those instructions"` or use `#[[file:AGENT.md]]` in steering |
| **Claude Code** | `CLAUDE.md` is auto-loaded — reads this file for skill discovery |
| **Any agent** | Read `SKILL.md` for full skill index |

---

## Paths (relative to this file)

```
SKILLS_ROOT  = {folder containing this file}
CLAUDE_RULES = {SKILLS_ROOT}/../rules/        ← Claude Code rules
MEMORY_GLOBAL = ~/.memory/global/             ← cross-project memory
MEMORY_PROJECT = {project}/.memory/           ← per-project memory
```

> When moving this folder: only update `MEMORY_GLOBAL` above if needed. Everything else is relative.

---

## Agent-Specific Instructions

- **Kiro:** `KIRO.md` — tier selection, engineering standards, prompt cache rules
- **Claude Code:** `CLAUDE.md` — tier selection (Gemini/Haiku/Sonnet), workflow, token control
- **Skill index:** `SKILL.md` — full map of all available skills

---

## Core Skills (always available)

### System Skills — `system/`

| Skill | Trigger phrases | Load |
|-------|----------------|------|
| `memory-palace` | "save memory", "load context", "session start/end", "compress room" | `system/memory-palace/SKILL.md` |
| `knowledge-evolution` | "track which templates work", "score lessons", "auto-capture failures", "feedback loop", "knowledge keeps getting better" | `system/knowledge-evolution/SKILL.md` |
| `hook-creator` | "create hook", "automate on save", "สร้าง hook" | `system/hook-creator/SKILL.md` |
| `ai-techniques` | "use CoT", "step-back", "LATS", "reasoning technique" | `system/ai-techniques/SKILL.md` |
| `analysis-concept` | "analyze context", "gap analysis", "domain discovery" | `system/analysis-concept/SKILL.md` |
| `skill-creator` | "create skill", "improve skill", "skillify" | `system/skill-creator/SKILL.md` |

### Knowledge Evolution — Special Note

`knowledge-evolution` is a **meta-skill** that improves all other knowledge over time.

Without it, the agent will:
- Not update utility scores after test runs
- Not auto-capture lessons from failures
- Not route to the best-performing templates

Always activate when working with `ai-dlc/knowledge/` or after test execution.

References:
- Scoring protocol: `system/knowledge-evolution/references/utility-scoring.md`
- Smart routing: `system/knowledge-evolution/references/smart-routing.md`
- Auto-consolidation: `system/knowledge-evolution/references/auto-consolidation.md`
- Memory integration: `system/knowledge-evolution/references/memory-integration.md`

---

## AI-DLC Skills — `ai-dlc/`

Full index: `SKILL.md`

| Category | Skills |
|----------|--------|
| Core | `aidlc`, `analysis-skills`, `memory-palace`, `monitoring`, `storage` |
| Product | `architect`, `ui-designer` |
| Dev | `frontend-dev`, `backend-dev`, `devops-pipeline` |
| QA | `playwright-rules`, `playwright-testing`, `playwright-cli`, `robotframework-rules`, `robotframework-testing`, `qa-architect`, `test-scenario`, `postman`, `performance-testing` |
| Knowledge | `automation/`, `business/`, `lessons/` |

---

## Memory

```
Global (cross-project):  ~/.memory/global/
Per-project:             {project}/.memory/
```

### Global Memory Structure

```
~/.memory/global/
├── state.md                    ← global palace map (active wings across all projects)
├── tunnels.md                  ← cross-project links
└── wings/
    ├── knowledge-evolution/    ← template scores + lesson effectiveness (cross-project)
    │   ├── hall.md
    │   ├── rooms/
    │   │   ├── template-health.md
    │   │   ├── lesson-effectiveness.md
    │   │   └── gap-tracker.md
    │   └── closets/
    └── {other-global-wings}/
```

### Session Rules

On session start:
1. Load `~/.memory/global/state.md` if exists → cross-project context
2. Load project `.memory/state.md` → project-specific context
3. Treat both as **hints** (skeptical memory) — verify against actual files before acting

On session end (if decisions were made):
1. Save to project `.memory/` first
2. Sync knowledge-evolution scores to `~/.memory/global/wings/knowledge-evolution/`
3. Update `~/.memory/global/state.md` if cross-project state changed

### Relocation

If moving memory to a different path, update `MEMORY_GLOBAL` in the Paths section above.

---

## Kiro Setup for New Projects

Run once per project:

```bash
{SKILLS_ROOT}/system/hook-creator/setup-kiro-project.sh /path/to/project
```

Copies standard hooks + steering templates to `.kiro/hooks/` and `.kiro/steering/`.

---

## Relocation Guide

Moving skills folder to a new path (e.g., `~/ai-agent/`):

1. Move the folder
2. Update `MEMORY_GLOBAL` path above if different from `~/.memory/global/`
3. Re-run `setup-kiro-project.sh` for each project to update hooks/steering
4. Update `SKILLS_ROOT` in each project's `STEERING_INDEX.md`

Everything else resolves relative to this file automatically.
