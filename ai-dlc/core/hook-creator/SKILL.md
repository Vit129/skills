---
name: hook-creator
description: >
  Create and manage agent hooks for Kiro and Claude Code.
  Trigger when user says "สร้าง hook", "เพิ่ม hook", "create hook",
  "automate on save", "run test on change", "hook เมื่อ", or needs
  event-driven automation.
---

# Hook Creator

Create hooks from templates for either **Kiro** or **Claude Code**.
Schema references:
- Kiro: `references/kiro-hook-schema.md`
- Claude Code: `references/claude-code-hook-schema.md`

---

## Process

1. Ask: Kiro หรือ Claude Code?
2. Ask: event อะไร trigger?
3. Ask: action อะไรที่ต้องการ?
4. Pick matching template (or create custom)
5. Write to correct location

---

## KIRO Hooks

**Location:** `{project}/.kiro/hooks/[name].kiro.hook`

| Use Case | Template |
|----------|---------|
| Memory Palace auto-save | `templates/kiro/memory-palace-save.kiro.hook` |
| AIDLC phase guard | `templates/kiro/aidlc-phase-guard.kiro.hook` |
| Run tests after AI write | `templates/kiro/run-tests-after-write.kiro.hook` |
| Run tests on file save | `templates/kiro/run-tests-on-save.kiro.hook` |
| Sync steering on skill add | `templates/kiro/sync-steering-on-skill-add.kiro.hook` |
| Sync hook to templates on save | `templates/kiro/sync-hook-to-templates.kiro.hook` |

**Rules:**
- One hook = one responsibility
- `askAgent` for complex logic, `runCommand` for simple commands
- File must end with `.kiro.hook`

---

## CLAUDE CODE Hooks

**Location:** `{project}/.claude/settings.json` (project) หรือ `~/.claude/settings.json` (global)

| Use Case | Event | Template |
|----------|-------|---------|
| Auto-load memory on start | `SessionStart` | `templates/claude-code/settings.json` |
| Memory Palace auto-save | `Stop` | `templates/claude-code/settings.json` |
| AIDLC phase guard | `PreToolUse` | `templates/claude-code/settings.json` |
| Re-inject context after compact | `SessionStart` (matcher: `compact`) | custom |
| Auto-format after edit | `PostToolUse` (matcher: `Edit\|Write`) | custom |
| Block protected files | `PreToolUse` | custom |
| Desktop notification | `Notification` | custom |
| Auto-approve permission | `PermissionRequest` | custom |

**Hook types available:**
- `command` — shell script (most common)
- `prompt` — single LLM call → `{"ok": true/false}`
- `agent` — subagent with tool access → `{"ok": true/false}`
- `http` — POST to endpoint

**Setup:** Copy `templates/claude-code/settings.json` → `{project}/.claude/settings.json`
