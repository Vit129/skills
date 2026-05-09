# AIDLC Dialog & Artifact Integration

How AIDLC interacts with users and stores artifacts — applies to ALL AI agents and ALL modes.

## Core Rules

1. **ALL artifacts → `.aidlc/`** — both Vibe and Spec modes write everything to `.aidlc/[system]/[feature]/`
2. **Dialog message format** — ALL AIDLC interactions use structured dialog, not plain chat
3. **Agent-agnostic** — these rules apply to Kiro, Claude Code, Gemini, and any other AI agent

## Artifact Path (Single Target)

```text
ALL modes → .aidlc/[system]/[feature]/
             ├── planning/decisions/
             ├── planning/plans/
             ├── outputs/inception/
             ├── outputs/construction/
             ├── dev-task-progress.md
             ├── qa-task-progress.md
             └── audit.md
```

There is no secondary target. AIDLC does NOT write to `.kiro/specs/` or any other location.

## Dialog Message Format

Every AIDLC phase interaction MUST use structured dialog format:

### Phase Announcement

```text
📋 Phase {N}: {Phase Name}
Mode: {Vibe/Spec/Full/QA Only/Dev Only}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Phase description — what will happen}

📎 Prerequisites: {list or "✅ all met"}
📂 Output: {expected file path}
```

### Decision Dialog

```text
🔷 Decision Required — {topic}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Context}

Options:
1. {Option A} — {rationale}
2. {Option B} — {rationale}
3. {Option C} — {rationale}

💡 Recommendation: {N} — {why}
```

### Progress Update

```text
✅ {Task/Phase} Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 Output: {file path}
📊 Progress: {N}/{Total} tasks done
⏭️ Next: {next phase or task}
```

### Escalation Dialog

```text
⚠️ Escalation: Vibe → Spec
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

เหตุผล: {trigger}

ต้องการ:
1. Escalate → Spec (สร้าง full design artifacts)
2. ทำต่อใน Vibe (รับ risk)
```

## Dialog Enforcement Rules (MANDATORY)

These rules ensure AIDLC interactions are step-by-step, not wall-of-text dumps.

### Rule 1: One Question at a Time

**NEVER ask multiple decisions in one message.** Ask ONE, wait for answer, then ask next.

❌ Bad:
```
1. เลือก architecture pattern ไหน?
2. ใช้ database อะไร?
3. Frontend framework อะไร?
```

✅ Good:
```
🔷 Decision Required — Architecture Pattern
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options:
1. Monolith — simple, fast to start
2. Microservices — scalable, complex
3. Modular Monolith — balanced

💡 Recommendation: 3 — ดีสำหรับ team size นี้

→ เลือกข้อไหน?
```

Then WAIT. Only after user answers → ask next question.

### Rule 2: No Auto-Execute After Plan

After creating a plan → STOP. Show preview. Wait for explicit approval.

```
📋 Plan Ready — Phase 1.4 Domain Design
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Preview:
- 3 entities: User, Order, Payment
- 2 aggregates: OrderAggregate, PaymentAggregate
- 1 domain event: OrderPlaced

📂 Will write to: outputs/inception/domain-design.md

→ Approve? (yes / แก้ไข / ยกเลิก)
```

### Rule 3: Structured Options with Recommendation

Every decision MUST have:
- Numbered options (1, 2, 3...)
- Brief rationale per option
- 💡 Recommendation with reason
- Clear call-to-action ("→ เลือกข้อไหน?")

### Rule 4: Progress Breadcrumb

After each step, show where we are:

```
✅ Phase 1.3 Complete → Domain Decomposition
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Progress: Phase 1.3 ✅ | Phase 1.4 ⏳ | Phase 1.5 ⬜ | Phase 1.6 ⬜
⏭️ Next: Phase 1.4 — Domain Design

→ พร้อมไปต่อ? (yes / ข้ามไป phase อื่น / หยุดก่อน)
```

### Rule 5: Runtime-Aware Dialog

| Runtime | Dialog Method |
|---------|--------------|
| Kiro | Use `userInput` tool with structured options when available |
| Claude Code | Use numbered text options in chat |
| Gemini CLI | Use numbered text options in chat |

When `userInput` tool is available (Kiro), prefer it over text-based options for:
- Mode selection
- Decision choices
- Approval prompts

### Rule 6: Batch Limit

If a phase produces many items (e.g., 10 user stories), present in batches:
- Show first 3-5 items
- Ask: "ดูต่อ? หรือ approve ทั้งหมด?"
- Never dump 10+ items without pause

### Rule 7: Escape Hatch

Always provide a way out:
- "หยุดก่อน" — pause workflow, save state
- "ข้าม" — skip current question (use default/recommendation)
- "ย้อนกลับ" — go back to previous decision

## Dialog Anti-Patterns (NEVER DO)

| Anti-Pattern | Why Bad | Fix |
|---|---|---|
| Dump 5 decisions at once | User overwhelmed, skips reading | One at a time |
| Auto-execute after plan | User didn't approve | STOP + wait |
| No recommendation | User doesn't know which to pick | Always recommend |
| Wall of text without structure | Hard to scan | Use emoji markers + sections |
| Ask "anything else?" after every step | Annoying, slows flow | Only ask at phase boundaries |
| Skip progress breadcrumb | User lost in workflow | Always show position |

## Kiro-Specific Notes

When running in Kiro IDE:
- Kiro has built-in Vibe mode and Spec mode — agent reads mode from IDE context
- User selects mode in Kiro UI, never types it in chat
- Kiro Spec dialog system is separate from AIDLC — AIDLC uses its own `.aidlc/` artifacts
- If user wants to use Kiro's native Spec feature alongside AIDLC, they can — but AIDLC does not write to `.kiro/specs/`
