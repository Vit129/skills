---
name: ai-dlc
description: >
  Root skill for the AI Development Lifecycle (AI-DLC) ecosystem.
  Defines shared variables and paths used across all ai-dlc sub-skills.
---

# AI-DLC Root

## Path Variables

AI agent MUST read this file first and resolve these variables before reading any knowledge files.

```
{skills_root}     = parent folder containing ai-dlc/ (e.g., ~/.claude/skills or /path/to/skills)
{knowledge_root}  = {skills_root}/ai-dlc/knowledge
```

**Resolved paths:**
- Business rules index: `{knowledge_root}/business/businessIndex.json`
- Automation templates: `{knowledge_root}/automation/`
- Lessons learnt: `{knowledge_root}/lessons/`

## Portability

This skill bundle is portable — it can be placed anywhere:
- `~/.claude/skills/ai-dlc/` (default for Claude Code / Kiro)
- `/path/to/any/project/skills/ai-dlc/`
- Zipped and shared across teams

To use in a new location: place the entire `ai-dlc/` folder under any `skills/` directory.
Update `{skills_root}` to point to that `skills/` folder.

## Sub-Skills

- `core/` — AIDLC governance, analysis-skills (foundational), memory palace, monitoring, storage
- `product/` — architect (technical design), ui-designer (UX/UI + Figma)
- `dev/` — frontend-dev, backend-dev, devops-pipeline
- `qa/` — playwright-rules, playwright-testing, qa-architect, test-scenario (+ scenario-reader), robotframework
- `knowledge/` — business rules, automation templates, lessons learnt
