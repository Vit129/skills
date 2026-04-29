# Brainstorming Output Template

Use this template when the discussion concludes.
This output becomes the input for `core/aidlc/` DECISIONS phase.

---

## Brainstorming Summary

**Feature/Idea:** [ชื่อ feature หรือ idea]
**Date:** [วันที่]
**Rounds:** [จำนวน round ที่คุย]
**Scale:** [Small / Medium / Large]

---

## PO Perspective

**Problem Statement:** [ปัญหาที่แก้ — ระบุให้ชัด ไม่ใช่ solution]
**Target User:** [ใคร — role หรือ persona]
**User Value:** [ได้อะไร — outcome ไม่ใช่ feature]
**Success Metric:** [วัดยังไง — quantifiable ถ้าเป็นไปได้]
**MVP Scope:** [เล็กที่สุดที่ validate assumption ได้]
**Out of Scope:** [อะไรที่ตัดออกจาก MVP นี้]
**Open Questions (PO):** [สิ่งที่ยังไม่รู้ ต้องหาคำตอบก่อน]

---

## Dev Perspective

**Approach:** [แนวทาง implement — high level]
**Architecture Impact:** [อะไรที่ต้องเปลี่ยนหรือเพิ่ม]
**Key Risks:** [ความเสี่ยงหลัก 1-3 ข้อ]
**Dependencies:** [สิ่งที่ต้องมีก่อน implement ได้]
**Complexity Estimate:** [S / M / L / XL]
**Recommended Pattern:** [pattern ที่เหมาะสม ถ้ามี]
**Open Questions (Dev):** [สิ่งที่ต้อง spike หรือตัดสินใจก่อน]

---

## QA Perspective

**Testability Assessment:** [ง่าย / ปานกลาง / ยาก — เพราะอะไร]
**Key Test Scenarios:**
  - Happy path: [...]
  - Alternative path: [...]
  - Edge cases: [...]
**Risk Areas:** [จุดที่เสี่ยงต่อ bug]
**Test Strategy:** [unit / integration / e2e / performance]
**Acceptance Criteria Draft:**
  - AC-01: [...]
  - AC-02: [...]
**Open Questions (QA):** [สิ่งที่ต้องชัดเจนก่อน test ได้]

---

## Tensions & Tradeoffs

[บันทึก disagreement ระหว่าง roles ที่ยังไม่ได้ resolve — สำคัญมาก อย่าลบทิ้ง]

| Tension | PO View | Dev View | QA View | Resolution |
|---------|---------|---------|---------|------------|
| [ตัวอย่าง: scope] | ต้องการ X | X ซับซ้อนเกิน | X test ยาก | ทำ X แบบ simplified ก่อน |

---

## Recommended Next Step

- [ ] Resolve open questions ก่อน proceed: [list]
- [ ] Handoff to AIDLC DECISIONS phase
- [ ] Spike needed: [topic] — ก่อน commit to approach

---

## AIDLC Handoff Context

> Copy section นี้ไปใส่ใน DECISIONS file เป็น context

```
Feature: [ชื่อ]
Problem: [problem statement จาก PO]
Approach: [approach จาก Dev]
Complexity: [S/M/L/XL]
Key Risks: [risks จาก Dev]
AC Draft: [AC จาก QA]
Open Items: [รวม open questions ทุก role]
```
