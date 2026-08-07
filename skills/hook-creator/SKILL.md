---
name: hook-creator
description: >
  Create and manage Kiro hooks.
  Trigger when user says "สร้าง hook", "เพิ่ม hook", "create hook",
  "automate on save", "run test on change", "hook เมื่อ",
  or needs event-driven automation in Kiro.
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# Hook Creator (Kiro)

Create hooks for Kiro. Schema: `references/kiro-hook-schema.md`

## Agent Memory Hook Set

2 hooks สำหรับ agent-memory system exist today — copy จาก templates ไป `.kiro/hooks/`:

| Hook | Event | Template |
|------|-------|----------|
| session-load (bootstrap agent-memory/) | `promptSubmit` | `templates/kiro/setup-agent-memory.kiro.hook` |
| session-save (skill-log reflection) | `agentStop` | `templates/kiro/session-save.kiro.hook` |

No `checkpoint` (`postTaskExecution`) or `skill-check` (`postToolUse` write) template exists yet — create one from `references/kiro-hook-schema.md` if needed.

## Process

1. ถามว่า event อะไร trigger
2. ถามว่า action ต้องการอะไร
3. เลือก template ที่ใกล้เคียง หรือสร้างใหม่จาก schema
4. เขียนไปที่ `{project_root}/.kiro/hooks/[name].kiro.hook`

## Rules

- One hook = one responsibility
- `askAgent` สำหรับ logic ซับซ้อน, `runCommand` สำหรับ shell commands ง่ายๆ
- ไฟล์ต้องลงท้ายด้วย `.kiro.hook`
- askAgent prompts ต้องมี "Complete within 15 seconds."
- แก้ใน `templates/kiro/` ก่อน แล้ว copy ไป `.kiro/hooks/` เพื่อป้องกัน circular
