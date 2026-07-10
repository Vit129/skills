---
name: analysis-skills
description: >
  This skill should be used when the user asks to "analyze the codebase", "วิเคราะห์ codebase",
  "extract requirements", "ดึง requirements", "do gap analysis", "ทำ gap analysis",
  "map business domains", "map domain", "find existing assets", "หา asset ที่มีอยู่",
  "discover before building", "ค้นหาก่อนสร้าง", "zoom out", "มองภาพรวม", "big picture first",
  "reverse engineer this system", "reverse engineer ระบบนี้",
  "analyze step by step", "compare multiple approaches", "explore multiple paths", "backtrack and try another way",
  or needs to understand what exists, what's needed, and what's missing before implementation,
  or needs Chain of Thought, LATS simulation, or Algorithm of Thought for systematic problem-solving.
  Used by PO, Dev, and QA roles across all phases.
version: 2.1.0
last_improved: 2026-07-10
improvement_count: 1
---

# Analysis Skills — Router

`ai-techniques` was merged into this skill — reasoning techniques (CoT/LATS/AoT) and discovery/gap analysis are the same "understand before acting" family, both were pure routers with no content of their own.

## Auto-Detection (do NOT ask — detect from context)

Read the situation, then load exactly ONE reference:

| Situation | Load |
|-----------|------|
| Has PBI/AC + codebase exists → what's missing? | `references/gap.md` |
| Has requirements/PBI but no code yet → write stories/BDD | `references/requirements.md` |
| "What exists already?" / find reusable patterns / map domains | `references/discovery-domain.md` |
| "How does this system work?" / understand architecture | `references/reverse-eng.md` |
| "What are the goals?" / extract conflicts / big picture first | `references/context.md` |
| "think step by step", "break this down", "analyze sequentially" | `references/cot.md` |
| "compare approaches", "multiple strategies", "pick the best option" | `references/lats.md` |
| "explore options", "branching decisions", "backtrack", "search tree" | `references/aot.md` |

- **Chain of Thought (CoT)** — Break complex problems into sequential steps. (Read `references/cot.md`)
- **LATS Simulation** — Compare multiple strategies, pick the best hybrid. (Read `references/lats.md`)
- **Algorithm of Thought (AoT)** — Explore branching decisions like a search tree, backtrack from dead-ends, pick the best path. (Read `references/aot.md`)

> **Note:** Step-Back Prompting is embedded in `references/context.md` (Phase 1). Resources Discovery is embedded in `references/discovery-domain.md` (Phases 1-3).

→ Check per-project `agent-memory/knowledge/` first — fall back to `skills/knowledge/` only if not found
→ Write output to `agent-memory/plans/[feature]/` — never chat-only dump
→ Ground every finding in actual files/lines — no assumptions
