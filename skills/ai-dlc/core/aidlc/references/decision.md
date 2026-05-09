# Decision-Plan-Execute

Structured decision-making with mandatory user approval at every phase.

## When to use
- Before any AIDLC phase that requires user decisions
- When creating structured deliverables
- When governance and traceability are required

## Process

1. **Create Decision File** — present options with recommendations, NEVER fill answers
2. **Wait for user** — user fills in decision answers
3. **Create Plan File** — task breakdown based on resolved decisions
4. **Wait for approval** — user must explicitly approve ("yes", "proceed", "approved")
5. **Execute Plan** — implement tasks, update checkboxes every 3-5 tasks
6. **Update Audit Trail** — record phase completion, deliverables, decisions

## Rules
- DECISIONS FIRST — always create decision file before planning
- NEVER fill decision answers — leave blank for user
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

```
**D{N}: {Question Title}**

1. {Option A} — {brief description} ← แนะนำ (if applicable)
2. {Option B} — {brief description}
3. {Option C} — {brief description}

> แนะนำ: {N} ({reason})
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

### Handling non-answer responses (MANDATORY — applies to EVERY D, EVERY question)

**Scope: This rule applies to D1, D2, D3, D4, and ANY decision question throughout the entire AIDLC workflow — not just the initial mode selection.**

When user responds to a decision question but does NOT give a clear answer (e.g., asks a follow-up, requests comparison, says "อันไหนดีกว่า?", "ต่างกันยังไง?"):

1. **Answer the user's question** — explain, compare, give pros/cons as requested
2. **Re-ask the SAME decision** — repeat the D{N} question at the end of your response
3. **Do NOT advance** — stay on the same D{N} until user gives a clear answer (number, letter, or explicit choice)
4. **Do NOT answer for the user** — never say "I'll go with A since..." or pick a default because user seems unsure

**Example:**
```
User: "ต่างกันยังไง ระหว่าง 1 กับ 2?"
Agent: [อธิบายความแตกต่าง...]
       "กลับมาที่ D2 — เลือก 1 หรือ 2?"
```

**Clear answer patterns:**
- "1", "2", "A", "B" → accepted
- "เอา 1", "เลือก A", "แบบแรก" → accepted
- "ตามที่แนะนำ", "เอาตามนั้น" → use recommended option
- "อันไหนดี?", "ต่างกันยังไง?", "ถ้าเลือก A จะเป็นยังไง?" → NOT an answer, explain then re-ask

## Approval patterns

| User says | Action |
| --------- | ------ |
| "yes", "proceed", "approved", "ได้", "โอเค", "อนุมัติ", "ตกลง", "เอา" | Continue |
| "1", "A", "B", "เลือก A", "เอา B" | Use selected option |
| "yes but...", "ได้ แต่...", "โอเค แต่..." | Address condition first |
| "no", "wait", "ไม่", "รอก่อน", "ยังไม่", "แก้ก่อน" | Stop and clarify |

## Conversation Guidance (Thai)

All user-facing prompts MUST be in Thai (per Language Policy). Adapt wording to context — these are templates, not scripts.

**Starting decisions (interactive dialog):**
"เริ่ม AIDLC สำหรับ [feature] — มี [N] ข้อต้องตัดสินใจ ถามทีละข้อนะ"

**Per decision question:**
"**D{N}: {Question}**\n1. ... 2. ... 3. ...\n> แนะนำ: ..."

**After all decisions answered (summary):**
"สรุปคำตอบ:\n- D1: ...\n- D2: ...\nถูกต้องมั้ย? ถ้าใช่จะสร้าง Decision file + Plan"

**After creating decision file:**
"สร้าง Decision file แล้วที่ `[path]` — คำตอบครบแล้ว กำลังสร้าง Plan..."

**After creating plan file:**
"Plan มี [N] tasks ใน [N] phases — [สรุปสั้นๆ]. เริ่มได้เลยมั้ย?"

**After completing a phase:**
"Phase [N] เสร็จแล้ว — สร้าง `[file]`. ต่อไป [next phase name] ทำต่อเลยมั้ย?"

**When user intent is ambiguous (dev vs QA):**
"งานนี้จะทำ Dev, QA, หรือทั้งสอง? 1) Dev (implement) 2) QA (test) 3) ทั้งสอง"
