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

Hook ทั้ง 8 ตัวนี้ควรมีในทุก project ที่ใช้ AI-DLC:

| # | Hook | Kiro Event | Claude Code Event | Purpose |
|---|------|-----------|------------------|---------|
| 1 | memory-load | `agentStart` | `SessionStart` | โหลด context ตอนเริ่ม session |
| 2 | aidlc-phase-guard | `preToolUse` (write) | `PreToolUse` (Write\|Edit) | check prerequisites ก่อน write output |
| 3 | run-tests-after-write | `postToolUse` (write) | `PostToolUse` (Write\|Edit) | รัน test หลัง AI write (ถ้ามี test files อยู่แล้ว) |
| 4 | sync-steering-on-skill-add | `fileCreated` | `FileChanged` | sync steering เมื่อเพิ่ม skill |
| 5 | sync-hook-to-templates | `fileEdited` | `FileChanged` | sync hook ไป templates |
| 6 | knowledge-score-update | `postToolUse` (shell) | `PostToolUse` (Bash) | update utility scores หลัง test run |
| 7 | agent-memory-auto-consolidation | `agentStop` | `Stop` | auto-consolidate เมื่อถึง threshold |
| 8 | memory-save | `agentStop` | `Stop` | บันทึก memory + knowledge ท้ายสุด (always last) |

**กฎสำคัญ:**
- Hook #3 (test) ยิงเฉพาะเมื่อมี test files อยู่แล้วใน project — ไม่ยิงตอน first-time setup
- Hook #7 ยิงก่อน #8 — consolidation ก่อน save เสมอ (ลำดับ agentStop hooks = ลำดับ file creation)
- Hook #8 (memory) ยิงท้ายสุดเสมอ เพราะ `agentStop`/`Stop` เป็น event สุดท้าย
- Hook #2 (phase-guard) skip `.kiro/`, `.claude/`, `agent-memory/` เพื่อป้องกัน circular
- แก้ไข hook ใน `templates/kiro/` ก่อน แล้ว copy ไป `.kiro/hooks/` เพื่อป้องกัน circular

**Kiro Spec Hooks (optional — เพิ่มเมื่อ project ใช้ Kiro Specs):**

สร้าง custom hook ด้วย `preTaskExecution` / `postTaskExecution` events ตาม schema ใน `references/kiro-hook-schema.md`

---

## Process

1. Ask: Kiro or Claude Code?
2. Ask: What event should trigger?
3. Ask: What action is needed?
4. Pick matching template (or create custom)
5. Write to correct location

---

## KIRO Hooks

**Location:** `{project_root}/.kiro/hooks/[name].kiro.hook`

| Use Case | Template |
|----------|---------|
| Memory load on start | `templates/kiro/memory-load.kiro.hook` |
| Memory save on end | `templates/kiro/memory-save.kiro.hook` |
| Agent Memory auto-consolidation | `templates/kiro/agent-memory-auto-consolidation.kiro.hook` |
| AIDLC phase guard | `templates/kiro/aidlc-phase-guard.kiro.hook` |
| Run tests after AI write | `templates/kiro/run-tests-after-write.kiro.hook` |
| Knowledge score update | `templates/kiro/knowledge-score-update.kiro.hook` |
| Sync steering on skill add | `templates/kiro/sync-steering-on-skill-add.kiro.hook` |
| Sync hook to templates on save | `templates/kiro/sync-hook-to-templates.kiro.hook` |
| Auto-capture Gotchas from failures | `templates/kiro/gotcha-capture.kiro.hook` *(optional)* |
| Review auto-captured lessons | `templates/kiro/lesson-review.kiro.hook` *(optional)* |

**Rules:**
- One hook = one responsibility
- `askAgent` for complex logic, `runCommand` for simple commands — prefer `runCommand` + regex for simple checks (file exists, pattern match) to save tokens
- File must end with `.kiro.hook`
- **Time budget:** askAgent hooks must complete within 15 seconds — add "Complete within 15 seconds. If analysis takes longer, skip and report 'skipped — too complex for inline check'" to all askAgent prompts
- **Regex-first:** use `runCommand` + shell regex for simple checks instead of `askAgent` — 10-100x cheaper

---

## Kiro Steering Files

**Location:** `{project_root}/.kiro/steering/*.md`

Steering files inject context into every Kiro session automatically — no manual loading needed.

| Inclusion | When loaded | Use for |
|-----------|------------|---------|
| `auto` | ทุก session | standards, rules ที่ต้องการเสมอ |
| `fileMatch: pattern` | เมื่อ file ที่ match pattern ถูก read เข้า context | conditional rules (เช่น playwright rules เฉพาะเมื่อมี .spec.ts) |
| `manual` | เมื่อ user reference ด้วย `#` ใน chat | reference docs, routing guides |

**Templates:**

| Template | Inclusion | Purpose |
|----------|-----------|---------|
| `templates/kiro/steering/ai-dlc-standards.md` | `auto` | AI-DLC engineering standards ทุก session |
| `templates/kiro/steering/knowledge-routing.md` | `manual` | Knowledge routing context on demand |

**Front-matter format:**
```markdown
---
inclusion: auto
---
```
or
```markdown
---
inclusion: fileMatch
fileMatchPattern: "**/*.spec.ts"
---
```

**กฎ:** steering files ควรสั้น (<200 lines) — ยาวเกินไป = inject ทุก session = เปลือง tokens

## ⚠️ Gotchas

- **Fork bomb from SessionStart/agentStart hooks** — hooks that spawn processes (e.g., start a background watcher) can cause exponential growth if the hook fires again on the spawned process. Fix: always add a guard variable check at the start: `[ -n "$HOOK_RUNNING" ] && exit 0; export HOOK_RUNNING=1`
- **Circular hook loops** — PreToolUse hook that calls a tool → triggers the same PreToolUse hook again → infinite loop. Fix: edit hooks in `templates/kiro/` first, then copy to `.kiro/hooks/`. Skip nested invocations when circular pattern detected.
- **askAgent for simple logic** — using askAgent to check "does file X exist?" wastes tokens. Fix: use `runCommand`: `test -f path/to/file && echo 'exists' || echo 'missing'`
- **Hook fires during first-time setup** — test-runner hooks fire before any test files exist, causing confusing errors. Fix: always guard with `ls tests/**/*.spec.ts 2>/dev/null | head -1` before running tests.
- **Permission wildcards not used** — hooks that need broad file access prompt for permission on every file. Fix: use permission wildcards in Claude Code settings: `Bash(git *)`, `FileEdit(/src/*)`.
- **Steering files ซ้ำกับ skills** — สร้าง steering file ที่ duplicate content จาก skill ที่มีอยู่แล้ว = inject ทุก session โดยไม่จำเป็น เปลือง tokens. Fix: สร้าง steering เฉพาะเมื่อไม่มี skill ครอบคลุม หรือต้องการ inject ทุก session โดยไม่ต้อง trigger.
- **Hook bloat จาก plan** — สร้าง hooks ตาม plan โดยไม่ถามว่า "project นี้ใช้จริงไหม" ทำให้ templates เต็มไปด้วย hooks ที่ไม่มีใครใช้. Fix: ถามก่อนสร้างว่า hook นี้ solve ปัญหาอะไรใน project จริง — ถ้าตอบไม่ได้ = ไม่ต้องสร้าง.
---

## CLAUDE CODE Hooks

**Location:** `{project_root}/.claude/settings.json` (project) หรือ `~/.claude/settings.json` (global)

**Setup:** Copy `templates/claude-code/settings.json` → `{project_root}/.claude/settings.json`

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
