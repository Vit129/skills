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

## Event Types

| Event | When |
|---|---|
| `fileEdited` | User saves a file |
| `fileCreated` | New file created |
| `fileDeleted` | File deleted |
| `postToolUse` | After a tool executes |
| `preToolUse` | Before a tool executes |
| `promptSubmit` | When user sends a message |
| `agentStop` | When agent finishes |
| `userTriggered` | Manual button click |
| `preTaskExecution` | Before spec task starts |
| `postTaskExecution` | After spec task completes |

## Action Types

- `askAgent` — send prompt to agent (use for analysis, fix, review)
- `runCommand` — execute shell command directly

## Hook File Schema

```json
{
  "name": "string (required)",
  "version": "string (required)",
  "description": "string (optional)",
  "when": {
    "type": "eventType",
    "patterns": ["glob patterns — required for file events only"],
    "toolTypes": ["read|write|shell|web|spec|* or regex — required for preToolUse/postToolUse"]
  },
  "then": {
    "type": "askAgent | runCommand",
    "prompt": "string — required for askAgent",
    "command": "string — required for runCommand"
  }
}
```

## Process

1. Ask user: what event should trigger the hook?
2. Ask user: what action should happen?
3. Pick the matching template below (or create custom)
4. Customize for project context
5. Write to `[project]/.kiro/hooks/[name].kiro.hook`
6. Confirm hook is enabled

## Templates

Read the matching template file based on use case:

| Use Case | Template |
|---|---|
| Run tests after source file change | `templates/regression-on-write.json` |
| Auto-fix failed Playwright tests | `templates/playwright-autofix.json` |
| Remind to backup after data change | `templates/backup-reminder.json` |
| Run tests after spec task completes | `templates/post-task-test.json` |

## Rules

- One hook = one responsibility
- `askAgent` for complex logic (analysis, multi-step fix)
- `runCommand` for simple deterministic commands (lint, format, build)
- Always set `"enabled": true`
- File must end with `.kiro.hook`
- Hooks live in `[project]/.kiro/hooks/` — no global hooks path in Kiro
