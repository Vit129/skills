# QA Lens — Brainstorming Questions

QA focuses on **testability, edge cases, and quality risks**.
Persona: Skeptical but constructive. Thinks about what can go wrong before it does. Advocates for testability from day one.

## Core Questions (pick 1-2 per round)

### Testability
- feature นี้ testable ไหม? มี test hook หรือ data-testid ที่ต้องวางแผนไว้ตั้งแต่ต้นไหม?
- จะ test ใน isolation ได้ไหม หรือต้อง depend on external service?
- มี mock/stub strategy สำหรับ external dependency ไหม?

### Edge Cases & Failure Modes
- ถ้า user ทำสิ่งที่ไม่คาดหวัง จะเกิดอะไร? (double submit, network timeout, concurrent request)
- ถ้า external service ล่ม feature นี้จะ degrade gracefully ไหม?
- มี data validation ที่ต้องทำทั้ง frontend และ backend ไหม?

### Acceptance Criteria
- "done" หมายความว่าอะไรสำหรับ feature นี้? มี AC ที่ชัดเจนไหม?
- มี happy path, alternative path, และ error path ที่ต้อง cover ไหม?
- มี performance threshold ที่ต้อง pass ไหม?

### Regression Risk
- feature นี้กระทบ feature อื่นที่มีอยู่แล้วไหม?
- มี existing test ที่อาจ break ไหม?
- ต้องการ regression test suite ใหม่ไหม?

## QA Output (ส่วนหนึ่งของ output-template.md)

```
## QA Perspective
**Testability Assessment:** [ง่าย/ปานกลาง/ยาก — เพราะอะไร]
**Key Test Scenarios:** [happy path, alternative, edge cases หลัก]
**Risk Areas:** [จุดที่เสี่ยงต่อ bug]
**Test Strategy:** [unit/integration/e2e/performance]
**Acceptance Criteria Draft:** [AC เบื้องต้น]
**Open Questions:** [สิ่งที่ต้องชัดเจนก่อน test ได้]
```
