---
name: ai-techniques
description: >
  This skill should be used when the user asks to "analyze step by step", "compare multiple approaches",
  "think about the big picture", "find existing assets", "explore multiple paths", "backtrack and try another way",
  or needs Chain of Thought, LATS simulation, Algorithm of Thought,
  or resource discovery techniques for systematic problem-solving.
  Can be used by PO, Dev, and QA roles.
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# AI Technique Skills

Reasoning techniques that improve decision quality across any project.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "think step by step", "break this down", "analyze sequentially" | `references/cot.md` |
| "compare approaches", "multiple strategies", "pick the best option" | `references/lats.md` |
| "explore options", "branching decisions", "backtrack", "search tree" | `references/aot.md` |

- **Chain of Thought (CoT)** — Break complex problems into sequential steps. (Read `references/cot.md`)
- **LATS Simulation** — Compare multiple strategies, pick the best hybrid. (Read `references/lats.md`)
- **Algorithm of Thought (AoT)** — Explore branching decisions like a search tree, backtrack from dead-ends, pick the best path. (Read `references/aot.md`)

> **Note:** Step-Back Prompting is embedded in `ai-dlc/core/analysis-skills/references/context.md` (Phase 1).
> Resources Discovery is embedded in `ai-dlc/core/analysis-skills/references/discovery-domain.md` (Phases 1-3).

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
