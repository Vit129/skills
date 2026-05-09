# Approval Framework

## Approval Requirements

- Always wait for explicit approval
- Never assume approval — even if user seems ready, ask explicitly
- Provide context — always explain what you're asking approval for
- Be specific — state exactly what will happen after approval
- STOP after plan creation — never execute plans without approval
- All user-facing communication in Thai (per Language Policy in workflow.md)

## User Response Patterns

| User Says | Meaning | Action |
| --- | --- | --- |
| "yes", "proceed", "approved", "ได้", "โอเค", "อนุมัติ", "ตกลง", "เอา" | Full approval | Continue |
| "1", "A", "B", "เลือก A", "เอา B" | Option selection | Use selected option |
| "yes but...", "ได้ แต่...", "โอเค แต่..." | Conditional approval | Address condition first |
| "no", "wait", "ไม่", "รอก่อน", "ยังไม่", "แก้ก่อน" | Rejection | Stop and clarify |
| Questions or concerns | Need clarification | Answer before proceeding |

## Approval Checkpoints

1. After creating decision file — get decisions resolved
2. After creating plan file — get plan approved
3. Before phase transition — get deliverables approved
4. When user provides new requirements — confirm understanding
5. When deviating from plan — get approval for changes

## Conversation Examples by Phase

All examples in Thai. Adapt wording to context — these are templates, not scripts.

### AIDLC Governance

**After creating decision file:**
"สร้าง Decision file แล้วที่ `[path]` — มี [N] ข้อต้องตัดสินใจ เลือก A/B/C ได้เลย หรือตอบ '1' ใช้ตัวที่แนะนำทั้งหมด"

**After creating plan file:**
"Plan มี [N] tasks ใน [N] phases — [สรุปสั้นๆ เช่น 'สร้างเอกสาร ไม่แก้ code']. เริ่มได้เลยมั้ย?"

**After completing a phase:**
"Phase [N] เสร็จแล้ว — สร้าง `[file]`. ต่อไป [next phase name] ทำต่อเลยมั้ย?"

**When user intent is ambiguous:**
"งานนี้จะทำ Dev, QA, หรือทั้งสอง? 1) Dev (implement) 2) QA (test) 3) ทั้งสอง"

### Test Scenario Design

**Before each batch:**
"📋 Batch [N]: [Success/Alternative/Edge] Cases — [N] scenarios. ตรวจสอบแล้วอนุมัติ หรือแก้ไข?"

**After batch approval:**
"✅ Batch [N] approved. กำลังสร้าง Batch [N+1]..."

**If requirements unclear:**
"🔄 Requirements ไม่เพียงพอ — [specific gap]. กรุณาให้ข้อมูลเพิ่มเติม"

**After all batches:**
"✅ Test scenarios เสร็จ — [N] scenarios ([X] Success, [Y] Alternative, [Z] Edge)"

### QA Architecture

**After architecture design:**
"📐 Architecture Design:
- Pattern: [Multi-Service/Layout-Based] ([N] services/pages)
- Files: [list key files]
- DB: [seed/verify/cleanup or No DB]

อนุมัติหรือแก้ไข?"

**If user says แก้ไข:** ถามว่าแก้ตรงไหน → แก้ → แสดง summary ใหม่
**If user approves:** "✅ Architecture approved — พร้อมเขียน code"

### Database Strategy

**Q1:** "Feature นี้ต้องใช้ Database มั้ย? 1) มี พร้อมให้ SQL 2) มี รอ Dev 3) ไม่แน่ใจ 4) ไม่ต้อง"
**Q2:** "ใช้กับ test type ไหน? 1) API only 2) UI only 3) Mobile only 4) All shared"
**Q3:** "DB type อะไร? 1) PostgreSQL 2) MySQL 3) Oracle 4) Other"
**After confirmation:** "ขอข้อมูล connection: Host, Port, DB Name, User, Password (เก็บใน .env)"
**If No DB:** "✅ ข้าม DB strategy — ใช้ mock data แทน"

### Pipeline Creation

**Q1:** "Pipeline จะ trigger แบบไหน? 1) Schedule (cron) 2) Auto push to branch 3) Manual only"
**Q2:** "Branch ไหน? 1) main 2) develop 3) ทั้งคู่"
**Q3 (if schedule):** "อยากให้รันเวลาไหน? เช่น ทุกวันจันทร์-ศุกร์ 08:30"
**Q4:** "อยากรัน command ไหน?" → scan package.json → แสดง list ให้เลือก
**Q5:** "แจ้งเตือนหลัง pipeline เสร็จมั้ย? 1) Teams 2) Email 3) ไม่ส่ง"
**After generating:** "✅ Pipeline YAML สร้างแล้วที่ `[path]`"

### Playwright Automation

**After code generation:** "✅ สร้าง [N] files แล้ว — พร้อม review"
**After code review:** "✅ Code review APPROVED" or "⚠️ พบ [N] issues — [summary]"
**After test execution:** "✅ Tests: [passed]/[total] passed" or "❌ [failed] tests failed — เริ่ม self-healing..."
**During shared fix:** "⚠️ Fix กระทบไฟล์ `[file]` ที่ใช้ร่วมกับ [N] specs อื่น ทำต่อมั้ย?"
**After healing:** "✅ Self-healing เสร็จ — แก้ได้ [N]/[total]"
**If max attempts:** "❌ แก้ไม่ได้ [N] tests — ต้องตรวจสอบเอง"
