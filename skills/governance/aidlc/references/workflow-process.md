# Decision-Plan-Execute Process

> Load this file when starting a decision dialog or creating decision/plan files.

Structured decision-making with mandatory user approval at every phase.

## ⛔ HARD STOP — Read Before Anything Else

**NEVER present multiple decisions in one message. Ask ONE at a time. Wait for answer. Then ask next.**
**NEVER create a decision file BEFORE asking user interactively — dialog FIRST, file AFTER.**
**Ask ONE question per message as a numbered list. STOP and WAIT for user's answer before asking the next question.**

Violation = broken workflow. If you catch yourself writing D1 + D2 + D3 in one response → DELETE and start over with D1 only.

## When to use

- Before any AIDLC phase that requires user decisions
- When creating structured deliverables
- When governance and traceability are required

## Process

1. **Interactive Dialog** — ask decisions ONE at a time (see "Interactive Decision Dialog" below)
2. **Summarize** — after all Ds answered, confirm with user
3. **Create Decision File** — write file with all answers filled in
4. **Create Plan File** — task breakdown based on resolved decisions
5. **Wait for approval** — user must explicitly approve ("yes", "proceed", "approved")
6. **Execute Plan** — implement tasks, update checkboxes every 3-5 tasks
7. **Update Audit Trail** — record phase completion, deliverables, decisions

## Rules

- INTERACTIVE DIALOG FIRST — ask per-question BEFORE creating any file
- NEVER fill decision answers without asking user first
- NEVER create decision file with blank answers — file is created AFTER dialog completes
- STOP after plan — never auto-execute without approval
- Update plan checkboxes incrementally during execution
- Update audit.md at every phase completion

## Interactive Decision Dialog (MANDATORY)

**HARD RULE: Ask ONE decision at a time. Do NOT dump all decisions in a single message.**

### Flow

1. **Ask D1** — present options as numbered list with recommendation → STOP, wait for answer
2. **Record D1 answer** → if D1 answer unlocks conditional decisions (e.g., QA Automation → ask Platform), ask that next
3. **Ask D2** → STOP, wait for answer
4. **Repeat** until all decisions resolved
5. **Summarize** all answers in one confirmation message → ask "ถูกต้องมั้ย? ถ้าใช่จะสร้าง Plan"
6. **Create Decision File** with all answers filled → then create Plan File

### Format per question

```text
**D{N}: {Question Title}**

1. {Option A} — {brief description} ← Recommended (if applicable)
2. {Option B} — {brief description}
3. {Option C} — {brief description}

> Recommended: {N} ({reason})
```

### Conditional branching

- If D1 = QA Automation → ask Platform (API/Web/Android/iOS) as next question
- If D1 = QA Scenario Only → skip Platform question
- If D1 = Dev Only → skip Platform question
- If D1 = Full → ask Platform later when reaching QA phases
- Skip questions that become irrelevant based on previous answers

### Anti-patterns (Do NOT)

- ❌ Present all D1-D4 in one message
- ❌ Create decision file before asking user interactively
- ❌ Ask next question before user answers current one
- ❌ Assume default if user hasn't responded

### Handling non-answer responses (MANDATORY)

**Scope: applies to D1, D2, D3, D4, and ANY decision question throughout the entire AIDLC workflow.**

When user responds but does NOT give a clear answer (asks follow-up, "อันไหนดีกว่า?", "ต่างกันยังไง?"):

1. **Answer the user's question** — explain, compare, give pros/cons
2. **Re-ask the SAME decision** — repeat the D{N} question at the end
3. **Do NOT advance** — stay on same D{N} until user gives clear answer
4. **Do NOT answer for the user** — never pick a default

**Clear answer patterns:**
- "1", "2", "A", "B" → accepted
- "เอา 1", "เลือก A", "แบบแรก" → accepted
- "ตามที่แนะนำ", "เอาตามนั้น" → use recommended option
- "อันไหนดี?", "ต่างกันยังไง?" → NOT an answer, explain then re-ask

## Approval Patterns

| User says | Action |
|-----------|--------|
| "yes", "proceed", "approved", "ได้", "โอเค", "อนุมัติ", "ตกลง", "เอา" | Continue |
| "1", "A", "B", "เลือก A", "เอา B" | Use selected option |
| "yes but...", "ได้ แต่...", "โอเค แต่..." | Address condition first |
| "no", "wait", "ไม่", "รอก่อน", "ยังไม่", "แก้ก่อน" | Stop and clarify |

## Conversation Guidance (Thai)

All user-facing prompts MUST be in Thai. These are templates, not scripts.

- **Starting:** "เริ่ม AIDLC สำหรับ [feature] — มี [N] ข้อต้องตัดสินใจ ถามทีละข้อนะ"
- **Per question:** "**D{N}: {Question}**\n1. ... 2. ... 3. ...\n> แนะนำ: ..."
- **Summary:** "สรุปคำตอบ:\n- D1: ...\n- D2: ...\nถูกต้องมั้ย? ถ้าใช่จะสร้าง Decision file + Plan"
- **After decision file:** "สร้าง Decision file แล้วที่ `[path]` — กำลังสร้าง Plan..."
- **After plan:** "Plan มี [N] tasks — [สรุปสั้นๆ]. เริ่มได้เลยมั้ย?"
- **After phase:** "Phase [N] เสร็จแล้ว — สร้าง `[file]`. ต่อไป [next phase] ทำต่อเลยมั้ย?"
- **Ambiguous intent:** "งานนี้จะทำ Dev, QA, หรือทั้งสอง? 1) Dev 2) QA 3) ทั้งสอง"
