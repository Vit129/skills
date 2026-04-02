# Hook Schema & Events

## Event Types

| Event | When |
|-------|------|
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
