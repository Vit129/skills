# Claude Code Hook Schema

ไฟล์: `{project}/.claude/settings.json` (project) หรือ `~/.claude/settings.json` (global)

## Event Types

| Event | When | Blockable? |
|-------|------|-----------|
| `SessionStart` | Session begins/resumes | No |
| `UserPromptSubmit` | User submits prompt | Yes |
| `PreToolUse` | Before tool executes | Yes |
| `PermissionRequest` | Permission dialog appears | Yes |
| `PermissionDenied` | Tool denied by auto mode | No |
| `PostToolUse` | After tool succeeds | No (feedback only) |
| `PostToolUseFailure` | After tool fails | No (feedback only) |
| `Notification` | Claude sends notification | No |
| `Stop` | Claude finishes responding | Yes |
| `StopFailure` | Turn ends due to API error | No |
| `SubagentStart` | Subagent spawned | No |
| `SubagentStop` | Subagent finishes | Yes |
| `TaskCreated` | Task being created | Yes |
| `TaskCompleted` | Task being marked complete | Yes |
| `TeammateIdle` | Teammate about to go idle | Yes |
| `ConfigChange` | Config file changes | Yes |
| `CwdChanged` | Working directory changes | No |
| `FileChanged` | Watched file changes on disk | No |
| `PreCompact` | Before context compaction | No |
| `PostCompact` | After context compaction | No |
| `SessionEnd` | Session terminates | No |
| `InstructionsLoaded` | CLAUDE.md file loaded | No |
| `WorktreeCreate` | Worktree being created | Yes |
| `WorktreeRemove` | Worktree being removed | No |
| `Elicitation` | MCP server requests input | Yes |
| `ElicitationResult` | User responds to MCP elicitation | Yes |

## Hook Types

| Type | Description |
|------|-------------|
| `command` | Run shell command (stdin=JSON, stdout/exit code=result) |
| `http` | POST JSON to HTTP endpoint |
| `prompt` | Single-turn LLM evaluation → `{"ok": true/false}` |
| `agent` | Multi-turn subagent with tool access → `{"ok": true/false}` |

## Schema

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "regex — tool name, session source, etc. (omit = match all)",
        "hooks": [
          {
            "type": "command | http | prompt | agent",
            "command": "shell command — required for command type",
            "url": "https://... — required for http type",
            "prompt": "LLM prompt — required for prompt/agent type",
            "if": "Bash(git *) — optional, filter by tool+args (tool events only)",
            "timeout": 60,
            "async": false
          }
        ]
      }
    ]
  }
}
```

## Exit Codes (command type)

| Exit Code | Meaning |
|-----------|---------|
| `0` | Allow — stdout parsed as JSON or added as context |
| `2` | Block — stderr fed back to Claude as error |
| other | Non-blocking error — execution continues |

## Decision Output (JSON via stdout)

**PreToolUse:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow | deny | ask | defer",
    "permissionDecisionReason": "reason shown to user or Claude",
    "updatedInput": { "field": "new value" }
  }
}
```

**Stop / PostToolUse / UserPromptSubmit:**
```json
{
  "decision": "block",
  "reason": "reason shown to Claude"
}
```

**Stop entirely:**
```json
{ "continue": false, "stopReason": "message shown to user" }
```

**Prompt/Agent hooks response:**
```json
{ "ok": true }
{ "ok": false, "reason": "what Claude should do next" }
```

## Matcher Values by Event

| Event | Matches on | Examples |
|-------|-----------|---------|
| `PreToolUse`, `PostToolUse` | tool name | `Bash`, `Edit\|Write`, `mcp__.*` |
| `SessionStart` | session source | `startup`, `resume`, `clear`, `compact` |
| `SessionEnd` | exit reason | `clear`, `resume`, `logout`, `other` |
| `Notification` | notification type | `permission_prompt`, `idle_prompt` |
| `ConfigChange` | config source | `user_settings`, `project_settings`, `skills` |
| `StopFailure` | error type | `rate_limit`, `authentication_failed` |
| `FileChanged` | filename (basename) | `.envrc\|.env` |
| `SubagentStart/Stop` | agent type | `Bash`, `Explore`, `Plan` |

## Example

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "[ -f .memory/state.md ] && cat .memory/state.md || echo 'No memory found'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Should this session be saved to memory? Check if any decisions or code changes were made. $ARGUMENTS"
          }
        ]
      }
    ]
  }
}
```
