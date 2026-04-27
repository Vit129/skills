# Agent Memory — ระบบความจำของ AI

ระบบนี้ทำให้ AI จำสิ่งที่เกิดขึ้นในแต่ละ session และเรียนรู้จากประสบการณ์ที่สะสมมา

```text
Memory Palace      = จำว่าเกิดอะไรขึ้น (บริบท, การตัดสินใจ, งานที่ค้างอยู่)
Knowledge Library  = จำว่าอะไรได้ผล (pattern, บทเรียน, สิ่งที่ควรทำซ้ำ)
Session Save       = อัปเดตทั้งสองพร้อมกันทุกครั้ง — ทุกอย่างเป็น Markdown
```

## โครงสร้างไฟล์

```text
agent-memory/
├── palace/                    ← จำว่าเกิดอะไรขึ้น
│   ├── state.md               ← สถานะปัจจุบัน, session ล่าสุด, งานค้าง
│   ├── tunnels.md             ← ความเชื่อมโยงระหว่าง wings (prose + Purpose+Sync)
│   ├── search-index.md        ← ค้นหา session ย้อนหลัง
│   ├── user-profile.md        ← preference และ pattern ของผู้ใช้
│   ├── graph.md               ← structured index ของ Nodes/Rooms/Edges (required)
│   ├── wings/                 ← แต่ละ topic/project แยกเป็น wing
│   │   └── {topic}/
│   │       ├── hall.md        ← summary, decisions, rooms index
│   │       ├── rooms/         ← รายละเอียดแต่ละ topic (มี YAML frontmatter)
│   │       └── closets/       ← compressed rooms (AAAK)
│   └── archive/index.md       ← wings ที่เสร็จแล้ว
└── knowledge/                 ← จำว่าอะไรได้ผล
    ├── index.md               ← catalog ของ articles และ lessons ทั้งหมด
    ├── evolution.md           ← ประวัติการเปลี่ยนแปลง score + Consolidation State
    ├── articles/{domain}/     ← pattern และ template ที่ใช้ซ้ำได้
    │   └── {article}.md
    └── lessons/{domain}/      ← บทเรียนที่เรียนรู้จากประสบการณ์
        ├── index.md
        └── {lesson-id}.md
```

## กฎการ Save

ทุกครั้งที่ save session ต้องทำครบ 6 ขั้น:

1. อัปเดต Palace — rooms, halls, state, search index, graph
2. ดึง lesson, pattern, หรือ gap ที่เรียนรู้ได้
3. อัปเดต `knowledge/index.md`
4. อัปเดต lesson index ของ domain ที่เกี่ยวข้อง
5. บันทึกการเปลี่ยนแปลง score/status ลง `knowledge/evolution.md` + increment consolidation counter
6. ตรวจสอบว่าทุกอย่างค้นหาได้จาก Markdown

## สถานะปัจจุบัน

ระบบพร้อมใช้งานครบทุกส่วน:

- `SKILL.md` — spec หลักของระบบ (Markdown-first, all schemas inlined)
- `references/session.md` — วิธี load/save session, nudges, consolidation counter
- `references/intelligence.md` — scoring, routing, crystallization
- `references/maintenance.md` — consolidation, dedup, stale detection, auto-dream
- `references/adaptation.md` — วิธีปรับระบบให้เข้ากับ domain ใหม่
- `GOTCHAS.md` — 30 failure modes พร้อม fix
- Hooks: session-load v3.1.0, session-save v6.0.0

สิ่งที่ยังค้างอยู่:
- `VitProjects/agent-memory/` ยังใช้ JSON index — ต้อง migrate เป็น Markdown
- `skills/ai-dlc/knowledge/` มีไฟล์ JSON ประมาณ 5 ไฟล์ที่ยังต้อง migrate (tracked เป็น open thread แยกต่างหาก)
