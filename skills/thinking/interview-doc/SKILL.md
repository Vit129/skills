---
name: interview-doc
description: >
  Grilling session that challenges a plan against the existing codebase and domain model,
  sharpens terminology, and updates documentation (CONTEXT.md, ADRs) inline as decisions crystallise.
  Use when user wants to stress-test a plan against their project's language and documented decisions,
  or says "interview-doc", "grill with docs", "ถามกับ code", "ตรวจสอบกับ codebase".
  Requires an existing codebase — use interview-me instead if starting from scratch.
credit: Adapted from Matt Pocock's /grill-with-docs (https://www.aihero.dev/grill-with-docs)
version: 1.0.0
last_improved: 2026-06-01
improvement_count: 0
---

# Interview-Doc

> Grilling session with codebase awareness — interview relentlessly, cross-reference code,
> sharpen language, and update CONTEXT.md + ADRs inline as decisions crystallise.
> Adapted from Matt Pocock's `/grill-with-docs` concept.

---

## When to Use

- มี codebase อยู่แล้ว และต้องการ stress-test แผนใหม่กับ code จริง
- ต้องการ sharpen domain language ให้ตรงกับ CONTEXT.md ที่มีอยู่
- ก่อนเริ่ม feature ใหม่ในโปรเจกต์ที่มี domain model แล้ว
- User พูดว่า "interview-doc", "grill with docs", "ถามกับ code", "ตรวจสอบกับ codebase"

## When NOT to Use

- ยังไม่มี codebase → ใช้ `interview-me` แทน
- ต้องการ adversarial review ของ artifact ที่มีอยู่ → ใช้ `doubt-driven` แทน
- ต้องการ verify API version กับ official docs → ใช้ `source-driven` แทน

---

## Process

```
LOAD CONTEXT ──→ INTERVIEW ──→ CROSS-REF ──→ SHARPEN ──→ UPDATE DOCS
      │               │             │             │              │
      ▼               ▼             ▼             ▼              ▼
  Read CONTEXT.md  One question  Explore      Resolve        CONTEXT.md
  + scan codebase  at a time     codebase     fuzzy terms    + ADRs inline
```

### Step 1: Load Context

ก่อนถามคำถามแรก — สำรวจ project:

```
1. หา CONTEXT.md ที่ project root (หรือ CONTEXT-MAP.md ถ้ามี multiple contexts)
2. อ่าน existing glossary + relationships + flagged ambiguities
3. สแกน codebase structure (folder names, key files, naming patterns)
4. หา docs/adr/ สำหรับ existing architectural decisions
```

รายงานสิ่งที่พบ:
```
CONTEXT LOADED:
- CONTEXT.md: found (12 terms defined)
- ADRs: 3 existing (ADR-001 to ADR-003)
- Codebase: src/ordering/, src/billing/, src/auth/
→ Ready to interview.
```

ถ้าไม่มี CONTEXT.md → สร้างเมื่อ term แรกถูก resolve (ไม่สร้างไฟล์ว่าง)

### Step 2: Interview — One Question at a Time

Rules เหมือน `interview-me`:
- **ONE question per message** — ไม่ batch
- ถามสิ่งที่สำคัญที่สุดก่อน
- **ให้ recommended answer** ทุกคำถาม — อย่าถามเฉยๆ
- รอคำตอบก่อนถามต่อ

**ลำดับคำถาม:**
1. WHAT — แผนนี้ต้องการทำอะไร?
2. SCOPE — ครอบคลุมอะไร ไม่ครอบคลุมอะไร?
3. DOMAIN — term ที่ใช้ตรงกับ CONTEXT.md มั้ย?
4. RELATIONSHIPS — ความสัมพันธ์กับ entity ที่มีอยู่เป็นยังไง?
5. EDGE CASES — scenario ที่ยากหรือ boundary cases คืออะไร?
6. DECISIONS — มี decision ที่ hard-to-reverse มั้ย?

### Step 3: Cross-Reference with Codebase

เมื่อ user พูดถึงสิ่งที่ควรมีใน code → ไปตรวจสอบจริง:

```
User: "เราจะ cancel order ได้"
→ ค้นหา: grep "cancel" src/ordering/
→ พบ: cancelOrder() ใน orderService.ts line 45
→ ตรวจสอบ: logic ตรงกับที่ user อธิบายมั้ย?
```

**เมื่อพบ conflict:**
```
CONFLICT DETECTED:
User พูดว่า "partial cancellation" แต่ code ใน orderService.ts:45
ทำ full cancellation เท่านั้น

Options:
A) แผนใหม่ต้องการ partial cancellation → ต้องเพิ่ม logic ใหม่
B) User หมายถึง full cancellation → ปรับ terminology ให้ตรง
→ อันไหนถูกต้อง?
```

Surface conflict ทันที — ไม่เลือกเอง

### Step 4: Sharpen Language

เมื่อ user ใช้ term ที่ fuzzy หรือ conflict กับ CONTEXT.md:

**Challenge against glossary:**
```
CONTEXT.md defines "Order" as "a confirmed purchase request"
แต่คุณพูดว่า "draft order" — ใน CONTEXT.md นี้คือ "Cart" ไม่ใช่ "Order"
→ ต้องการใช้ term ไหน?
```

**Sharpen fuzzy language:**
```
คุณพูดว่า "account" — หมายถึง Customer (ผู้ซื้อ) หรือ User (ผู้ใช้ระบบ)?
ใน CONTEXT.md ปัจจุบัน Customer และ User เป็นคนละ entity
→ อันไหนที่ตรงกับสิ่งที่ต้องการ?
```

**Discuss concrete scenarios:**
```
ถ้า Customer มี 2 accounts แล้ว merge กัน — Order ที่ผูกกับ account เก่าจะเกิดอะไรขึ้น?
```

### Step 5: Update Docs Inline

เมื่อ term ถูก resolve → update ทันที ไม่ batch:

**Update CONTEXT.md:**
- เพิ่ม/แก้ term ตาม format ใน `governance/aidlc/references/CONTEXT-FORMAT.md`
- เพิ่ม Flagged Ambiguities ถ้ามี naming conflict ที่ resolve แล้ว
- ห้ามใส่ implementation details — glossary เท่านั้น

**ADR — delegate ไปหา `dev/documentation-adrs/`:**

เมื่อ decision ครบ 3 เงื่อนไข → บอก user แล้ว load `dev/documentation-adrs/SKILL.md`:
1. **Hard to reverse** — cost of changing later is meaningful
2. **Surprising without context** — future reader จะงงว่าทำไมถึงทำแบบนี้
3. **Real trade-off** — มี alternatives จริงๆ และเลือกด้วยเหตุผล

```
ADR NEEDED:
Decision: [ชื่อ decision]
เหตุผล: ครบ 3 เงื่อนไข (hard-to-reverse + surprising + real trade-off)
→ Loading dev/documentation-adrs/ เพื่อสร้าง ADR
```

ถ้าขาดข้อใดข้อหนึ่ง → skip ADR ไม่ต้อง load `documentation-adrs`

---

## Output Format

เมื่อ session จบ:

```markdown
## 📋 Interview-Doc Summary

**Plan:** [1-2 sentences]

**Key decisions:**
- [Decision 1 + rationale]
- [Decision 2 + rationale]

**CONTEXT.md updates:**
- Added: [term] — [definition]
- Updated: [term] — [what changed]
- Flagged: [ambiguity resolved]

**ADRs created:**
- ADR-XXX: [title] — [one-line reason]

**Conflicts found & resolved:**
- [conflict] → [resolution]

**Open questions (unresolved):**
- [question] — flagged for later

→ Ready to proceed to AIDLC Phase 0 / Phase 1
```

---

## Difference from interview-me

| | interview-me | interview-doc |
|---|---|---|
| **ใช้เมื่อ** | ยังไม่มี code | มี codebase แล้ว |
| **Cross-ref code** | ❌ | ✅ |
| **CONTEXT.md** | Update ถ้ามี | Update inline เสมอ |
| **ADRs** | ❌ | ✅ sparingly |
| **Confidence target** | 95% | Shared understanding |
| **Max questions** | 10 | ไม่จำกัด (จนถึง shared understanding) |

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "ฉันรู้ codebase ดีพออยู่แล้ว" | ความจำ ≠ code จริง ไปตรวจสอบก่อน |
| "CONTEXT.md ไม่จำเป็น" | ถ้าไม่มี shared language → AI จะ generate code ที่ใช้ term ผิดทุกครั้ง |
| "ADR ใช้เวลาเขียนนาน" | ADR ที่ดีใช้เวลา 10 นาที ประหยัดเวลา "ทำไมถึงทำแบบนี้?" ได้หลายชั่วโมง |
| "ถามทีละข้อช้าเกินไป" | Batch questions = user ตอบแบบผิวเผิน ถามทีละข้อได้คำตอบที่ลึกกว่า |
| "Code อธิบายตัวเองอยู่แล้ว" | Code บอก "what" ไม่บอก "why" — CONTEXT.md บอก "why" |

---

## Red Flags

- 🚩 ถามโดยไม่ได้อ่าน CONTEXT.md ก่อน → อาจถามซ้ำ term ที่ define ไปแล้ว
- 🚩 User ใช้ term ที่ conflict กับ CONTEXT.md แต่ไม่ challenge → language drift
- 🚩 พบ conflict ระหว่าง plan กับ code แต่ไม่ surface → hidden assumption
- 🚩 Update CONTEXT.md ด้วย implementation details → ผิด format
- 🚩 สร้าง ADR สำหรับ decision ที่ reversible → ADR inflation

---

## Integration with AIDLC

```text
มี codebase + ต้องการทำ feature ใหม่
      │
      ▼
interview-doc (this skill)
      │ — cross-reference code
      │ — update CONTEXT.md inline
      │ — create ADRs for hard decisions
      ▼
AIDLC Phase 0 (Inception) — now with aligned language + documented decisions
      │
      ▼
Phase 1 → Phase 2 → Phase 3
```

**vs interview-me:** interview-doc ใช้เมื่อมี codebase แล้ว, interview-me ใช้ก่อนมี code

---

## Verification

Before declaring session complete, confirm:

- [ ] CONTEXT.md อ่านก่อนถามคำถามแรก
- [ ] Codebase สำรวจสำหรับ terms ที่ถูกพูดถึง
- [ ] Conflicts ระหว่าง plan กับ code ถูก surface ทั้งหมด
- [ ] Fuzzy language ถูก sharpen และ resolve
- [ ] CONTEXT.md updated inline (ไม่ batch)
- [ ] ADRs created เฉพาะเมื่อครบ 3 เงื่อนไข
- [ ] Summary presented ก่อน proceed

---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| `CONTEXT.md` (project root) | Domain glossary | Challenge language against existing terms |
| Codebase (src/) | Read access | Cross-reference plan against actual code |
| `docs/adr/` | Decision history | Avoid contradicting previous decisions |
| `governance/aidlc/references/CONTEXT-FORMAT.md` | Format standard | Update CONTEXT.md correctly |
| `dev/documentation-adrs/SKILL.md` | ADR workflow (delegate) | Load เมื่อ decision ครบ 3 เงื่อนไข — ไม่ implement ADR เอง |
| `knowledge/lessons/` | Lessons learnt | Check before execute |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After each question | Open field (answer) | Every message — one question at a time |
| Conflict detected | Single select (A/B/C) | When plan conflicts with code |
| Term resolution | Checkbox (confirm definition) | Before updating CONTEXT.md |
| ADR proposal | Checkbox (confirm 3 criteria met) | Before creating ADR |
| Session summary | Checkbox (confirm/refine) | When shared understanding reached |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.

## Self-Learning

After user approves the output:

1. **Record good example:** Save approved output to `knowledge/lessons/thinking/interview-doc-{feature}.md`
2. **Record failures:** If output was rejected → note what went wrong for next time
3. **Progressive update:** If a new pattern proved effective → append to relevant knowledge index
4. **Confidence tracking:** `confidence: 1.0` (user-approved) vs `confidence: 0.7` (auto-generated)

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
