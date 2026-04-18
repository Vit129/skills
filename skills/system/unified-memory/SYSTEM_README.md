# Unified Memory System — System Architecture

ระบบความจำ + การเรียนรู้ สำหรับ AI ใน Session ข้ามกัน  
Memory (จำ) + Knowledge (เรียนรู้) = ทำงานเป็น "สมอง" เดียวกัน

---

## ทำไมต้องรวม?

```
Memory Palace alone:
  ✅ จำได้ว่าเกิดอะไรขึ้น
  ❌ ไม่รู้ว่าวิธีไหนดีกว่ากัน

Knowledge Evolution alone:
  ✅ รู้ว่า template A ดีกว่า template B
  ❌ ลืมทุก session ว่าเคยใช้อะไรไปแล้ว

Together = Compound Growth:
  Session 1: Template A used → success → score 5.5
  Session 2: Load memory → see A is better → prefer A
  Session 3: A now 7.0 → ระบบฉลาดขึ้นทุก session
```

---

## สองชั้น: Storage + Intelligence

```
┌──────────────────────────────────────────────────────┐
│         Unified Memory System                        │
│                                                      │
│ ┌───────────────┐        ┌─────────────────────────┐ │
│ │Memory Palace  │        │ Knowledge Evolution     │ │
│ │  (STORAGE)    │◄──────►│   (INTELLIGENCE)        │ │
│ │               │  sync  │                         │ │
│ │.unified-mem...│        │ .unified-mem.../        │ │
│ │└─palace/      │        │ knowledge/              │ │
│ │  ├── state.md │        │ ├── index.json          │ │
│ │  ├── wings/   │        │ └── lessons/ (scored)   │ │
│ │  └── archive/ │        │                         │ │
│ └───────────────┘        └─────────────────────────┘ │
│                                                      │
│ Single SKILL.md — One Command Interface              │
└──────────────────────────────────────────────────────┘
```

### Memory Palace (จำ)
- เก็บ context, decisions, reasoning ข้ามทุก session
- Hierarchical: Wing → Room → Closet → Raw
- AAAK compression: dense, token-efficient
- Admission control: score ≥0.6 gating

### Knowledge Evolution (เรียนรู้)
- Track utility_score ต่อ template
- Capture lessons จาก outcome (success/failure)
- Improve routing: prefer templates ที่ proven แล้ว
- Domain-agnostic: code, design, writing, decision, learning

---

## On-Disk Layout (Project)

```
{project_root}/
├── .unified-memory/                     ← New root
│   ├── palace/                          ← Memory Palace
│   │   ├── state.md                     (palace map ≤100 lines)
│   │   ├── tunnels.md                   (cross-wing links)
│   │   ├── wings/
│   │   │   ├── {topic}/
│   │   │   │   ├── hall.md
│   │   │   │   ├── rooms/{room}.md
│   │   │   │   ├── closets/{room}.md
│   │   │   │   └── raw/YYYY-MM-DD-*.md
│   │   │   └── knowledge-evolution/
│   │   │       ├── hall.md
│   │   │       ├── rooms/
│   │   │       └── closets/
│   │
│   └── knowledge/                       ← Knowledge Evolution
│       ├── index.json                   (source of truth: scores)
│       └── lessons/{domain}/
│           ├── *LessonsIndex.json
│           └── *.md
│
└── {project_root}/skills/knowledge/   ← Global fallback knowledge
```

---

## Session Life Cycle (ชัดเจน 3 ขั้น)

```
┌─── START ──────────────────────────────────┐
│  1. Read palace/state.md                   │
│  2. Read knowledge-evolution/hall.md        │
│  3. Classify wings Hot/Cold                │
│  4. Load Hot wings + top lessons           │
│  5. Brief: context + learning state        │
└────────────────────────────────────────────┘
           │
           ▼
┌─── EXECUTE ────────────────────────────────┐
│  - Use templates from knowledge/index.json │
│  - Track outcome: SUCCESS or FAILURE       │
│  - Note reasoning in-session               │
└────────────────────────────────────────────┘
           │
           ▼  (User: "save session + learn")
┌─── END ────────────────────────────────────┐
│  1. Admission Control (score ≥0.6?)        │
│  2. Write to palace/wings/{topic}/         │
│  3. Update knowledge-evolution wing        │
│  4. Sync to knowledge/index.json           │
│  5. Update state.md + tunnels.md           │
│  6. Confirm: "✅ X rooms, Y scores synced" │
└────────────────────────────────────────────┘
```

---

## Design Principles

```
No dependencies   = markdown + JSON only, no database
Manual triggers   = "save session + learn" (no hooks = no token waste)
Source of truth   = knowledge/index.json (memory = session buffer only)
Admission control = score ≥0.6 gates writes (prevents noise)
Compound growth   = each session makes templates + lessons more reliable
```

---

## File Structure (Skill Repo)

```
~/.claude/skills/system/unified-memory/
├── SKILL.md                     ← Entry point (triggers + commands)
├── SYSTEM_README.md             ← Architecture (you are here)
├── GOTCHAS.md                   ← 15 edge cases + fixes
└── references/
    ├── session.md               ← Session start/end, admission
    ├── storage.md               ← Wings, rooms, closets, archive
    ├── intelligence.md          ← Scoring, routing, consolidation
    ├── maintenance.md           ← Write-back, sync, conflict handling
    └── adaptation.md            ← Domain examples + custom routing
```

---

## Reference Quick Guide

| เมื่อต้องการ | Load |
|-----------|------|
| เริ่ม session หรือ จบ session | `references/session.md` |
| สร้าง wing, room, closet, archive | `references/storage.md` |
| ดู scores, routing, consolidation | `references/intelligence.md` |
| Sync ระหว่าง memory ↔ knowledge | `references/maintenance.md` |
| ตัวอย่างสำหรับ domain คุณ | `references/adaptation.md` |
| Edge cases | `GOTCHAS.md` |
