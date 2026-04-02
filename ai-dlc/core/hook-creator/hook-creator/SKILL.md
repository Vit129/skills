---
name: hook-creator
description: >
  Create and manage Kiro agent hooks for any project.
  Trigger when user says "สร้าง hook", "เพิ่ม hook", "create hook",
  "automate on save", "run test on change", "hook เมื่อ", or needs
  event-driven automation in .kiro/hooks/.
---

# Hook Creator

Create Kiro agent hooks from templates. Hooks automate agent actions based on IDE events.

- **Schema & Events** — Event types, action types, JSON schema. (Read `references/hook-schema.md`)

## Process

1. Ask user: what event should trigger the hook?
2. Ask user: what action should happen?
3. Pick matching template (or create custom)
4. Customize for project context
5. Write to `[project]/.kiro/hooks/[name].kiro.hook`

## Templates

| Use Case | Template |
|----------|----------|
| Run tests after source file change | `templates/regression-on-write.json` |
| Auto-fix failed Playwright tests | `templates/playwright-autofix.json` |
| Remind to backup after data change | `templates/backup-reminder.json` |
| Run tests after spec task completes | `templates/post-task-test.json` |

## Rules

- One hook = one responsibility
- `askAgent` for complex logic, `runCommand` for simple commands
- File must end with `.kiro.hook`, lives in `[project]/.kiro/hooks/`
