# Kiro Hook Schema

ไฟล์: `{project_root}/.kiro/hooks/[name].kiro.hook`

## Event Types

| Event | When |
|-------|------|
| `fileEdited` | User saves a file |
| `fileCreated` | New file created |
| `fileDeleted` | File deleted |
| `preToolUse` | Before a tool executes |
| `postToolUse` | After a tool executes |
| `promptSubmit` | When user sends a message |
| `agentStop` | When agent finishes |
| `userTriggered` | Manual button click |
| `preTaskExecution` | Before spec task starts |
| `postTaskExecution` | After spec task completes |

## Action Types

- `askAgent` — send prompt to agent (analysis, fix, review)
- `runCommand` — execute shell command directly

## Schema

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

## Example

```json
{
  "name": "Run Tests on Save",
  "version": "1.0.0",
  "description": "Run tests after any TypeScript file is saved",
  "when": {
    "type": "fileEdited",
    "patterns": ["**/*.ts", "**/*.tsx"]
  },
  "then": {
    "type": "runCommand",
    "command": "npm test -- --run"
  }
}
```

## Gotchas

- **askAgent for simple logic** — use `runCommand` + shell for simple checks (file exists, pattern match) — 10-100x cheaper
- **Circular hook loops** — PreToolUse hook that calls a tool triggers itself. Fix: edit templates first, copy to `.kiro/hooks/`
- **Hook fires during first-time setup** — guard test hooks with `ls tests/**/*.spec.ts 2>/dev/null | head -1`
- **Time budget** — askAgent hooks must complete within 15 seconds. Add "Complete within 15 seconds." to all askAgent prompts
