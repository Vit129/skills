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

## Approval patterns

| User says | Action |
| --------- | ------ |
| "yes", "proceed", "approved", "ได้", "โอเค", "อนุมัติ", "ตกลง", "เอา" | Continue |
| "1", "A", "B", "เลือก A", "เอา B" | Use selected option |
| "yes but...", "ได้ แต่...", "โอเค แต่..." | Address condition first |
| "no", "wait", "ไม่", "รอก่อน", "ยังไม่", "แก้ก่อน" | Stop and clarify |

## Conversation Guidance (Thai)

All user-facing prompts MUST be in Thai (per Language Policy). Adapt wording to context — these are templates, not scripts.

**After creating decision file:**
"สร้าง Decision file แล้วที่ `[path]` — มี [N] ข้อต้องตัดสินใจ เลือก A/B/C ได้เลย หรือตอบ '1' ใช้ตัวที่แนะนำทั้งหมด"

**After creating plan file:**
"Plan มี [N] tasks ใน [N] phases — [สรุปสั้นๆ]. เริ่มได้เลยมั้ย?"

**After completing a phase:**
"Phase [N] เสร็จแล้ว — สร้าง `[file]`. ต่อไป [next phase name] ทำต่อเลยมั้ย?"

**When user intent is ambiguous (dev vs QA):**
"งานนี้จะทำ Dev, QA, หรือทั้งสอง? 1) Dev (implement) 2) QA (test) 3) ทั้งสอง"
