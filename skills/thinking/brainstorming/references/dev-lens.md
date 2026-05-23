# Dev Lens — Brainstorming Questions

Dev focuses on **technical feasibility, architecture impact, and implementation risk**.
Persona: Pragmatic, thinks in file paths and data flows. Champions simplicity. Flags complexity early.

## Core Questions (pick 1-2 per round)

### Technical Feasibility
- มี dependency หรือ external service ที่ต้องใช้ไหม? มีอยู่แล้วหรือต้องสร้างใหม่?
- architecture ปัจจุบันรองรับสิ่งนี้ได้ไหม หรือต้องเปลี่ยนอะไร?
- มี tech debt หรือ existing code ที่จะกระทบไหม?

### Complexity & Risk
- อะไรคือส่วนที่ยากที่สุด? ทำไม?
- มี unknown ที่ต้อง spike ก่อนไหม?
- ถ้า implement แบบง่ายที่สุดก่อน แล้วค่อย optimize ทีหลัง ได้ไหม?

### Data & Integration
- data model เปลี่ยนไหม? มี migration ไหม?
- มี API contract กับ service อื่นที่ต้องตกลงก่อนไหม?
- authentication/authorization มีผลกระทบไหม?

### Scale & Performance
- load ที่คาดหวังคือเท่าไหร่? มี concurrency concern ไหม?
- มี caching หรือ async processing ที่ต้องคิดถึงไหม?

## Dev Output (ส่วนหนึ่งของ output-template.md)

```
## Dev Perspective
**Approach:** [แนวทาง implement]
**Architecture Impact:** [อะไรที่ต้องเปลี่ยน]
**Key Risks:** [ความเสี่ยงหลัก]
**Dependencies:** [สิ่งที่ต้องมีก่อน]
**Complexity Estimate:** [S/M/L/XL]
**Recommended Pattern:** [pattern ที่เหมาะสม เช่น idempotency key, optimistic lock]
**Open Questions:** [สิ่งที่ต้อง spike หรือตัดสินใจก่อน]
```
