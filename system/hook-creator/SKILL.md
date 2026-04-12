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

## Standard Hook Set (ใช้ได้ทั้ง Kiro + Claude Code)

Hook ทั้ง 6 ตัวนี้ควรมีในทุก project ที่ใช้ AI-DLC:

| # | Hook | Kiro Event | Claude Code Event | Purpose |
|---|------|-----------|------------------|---------|
| 1 | memory-load | `agentStart` | `SessionStart` | โหลด context ตอนเริ่ม session |
| 2 | aidlc-phase-guard | `preToolUse` (write) | `PreToolUse` (Write\|Edit) | check prerequisites ก่อน write output |
| 3 | run-tests-after-write | `postToolUse` (write) | `PostToolUse` (Write\|Edit) | รัน test หลัง AI write (ถ้ามี test files อยู่แล้ว) |
| 4 | sync-steering-on-skill-add | `fileCreated` | `FileChanged` | sync steering เมื่อเพิ่ม skill |
| 5 | sync-hook-to-templates | `fileEdited` | `FileChanged` | sync hook ไป templates |
| 6 | memory-save | `agentStop` | `Stop` | บันทึก memory ท้ายสุด (always last) |

**กฎสำคัญ:**
- Hook #3 (test) ยิงเฉพาะเมื่อมี test files อยู่แล้วใน project — ไม่ยิงตอน first-time setup
- Hook #6 (memory) ยิงท้ายสุดเสมอ เพราะ `agentStop`/`Stop` เป็น event สุดท้าย
- Hook #2 (phase-guard) skip `.kiro/`, `.claude/`, `.memory/` เพื่อป้องกัน circular
- แก้ไข hook ใน `templates/kiro/` ก่อน แล้ว copy ไป `.kiro/hooks/` เพื่อป้องกัน circular

---

## Process

1. Ask: Kiro or Claude Code?
2. Ask: What event should trigger?
3. Ask: What action is needed?
4. Pick matching template (or create custom)
5. Write to correct location

---

## KIRO Hooks

**Location:** `{project}/.kiro/hooks/[name].kiro.hook`

| Use Case | Template |
|----------|---------|
| Memory load on start | `templates/kiro/memory-load.kiro.hook` |
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

**Setup:** Copy `templates/claude-code/settings.json` → `{project}/.claude/settings.json`

| Use Case | Event | Included in template |
|----------|-------|---------------------|
| Memory load on start | `SessionStart` | ✅ |
| AIDLC phase guard | `PreToolUse` | ✅ |
| Run tests after write | `PostToolUse` | ✅ |
| Memory Palace auto-save | `Stop` | ✅ |
| Re-inject context after compact | `SessionStart` (matcher: `compact`) | custom |
| Block protected files | `PreToolUse` | custom |
| Desktop notification | `Notification` | custom |

**Hook types available:**
- `command` — shell script (most common, exit 2 = block)
- `prompt` — single LLM call → `{"ok": true/false}`
- `agent` — subagent with tool access → `{"ok": true/false}`
- `http` — POST to endpoint
