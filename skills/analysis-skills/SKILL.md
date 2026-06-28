---
name: analysis-skills
description: >
  This skill should be used when the user asks to "analyze the codebase", "วิเคราะห์ codebase",
  "extract requirements", "ดึง requirements", "do gap analysis", "ทำ gap analysis",
  "map business domains", "map domain", "find existing assets", "หา asset ที่มีอยู่",
  "discover before building", "ค้นหาก่อนสร้าง", "zoom out", "มองภาพรวม", "big picture first",
  "reverse engineer this system", "reverse engineer ระบบนี้",
  or needs to understand what exists, what's needed, and what's missing before implementation.
  Used by PO, Dev, and QA roles across all phases.
version: 2.0.0
last_improved: 2026-06-25
improvement_count: 0
---

# Analysis Skills — Router

## Auto-Detection (do NOT ask — detect from context)

Read the situation, then load exactly ONE reference:

| Situation | Load |
|-----------|------|
| Has PBI/AC + codebase exists → what's missing? | `references/gap.md` |
| Has requirements/PBI but no code yet → write stories/BDD | `references/requirements.md` |
| "What exists already?" / find reusable patterns / map domains | `references/discovery-domain.md` |
| "How does this system work?" / understand architecture | `references/reverse-eng.md` |
| "What are the goals?" / extract conflicts / big picture first | `references/context.md` |

→ Check per-project `agent-memory/knowledge/` first — fall back to `skills/knowledge/` only if not found
→ Write output to `agent-memory/plans/[feature]/` — never chat-only dump
→ Ground every finding in actual files/lines — no assumptions
