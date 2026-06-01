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

4 hooks สำหรับ agent-memory system — copy จาก templates ไป `.kiro/hooks/`:

| Hook | Event | Template |
|------|-------|----------|
| session-load | `promptSubmit` | `templates/kiro/agent-memory-session-load.kiro.hook` |
| session-save | `agentStop` | `templates/kiro/agent-memory-session-save.kiro.hook` |
| checkpoint | `postTaskExecution` | `templates/kiro/agent-memory-checkpoint.kiro.hook` |
| skill-check | `postToolUse` (write) | `templates/kiro/agent-memory-skill-check.kiro.hook` |

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

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
