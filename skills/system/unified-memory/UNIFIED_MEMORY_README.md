# Unified Memory System — System Architecture

> **Quick alias:** Wing = domain folder | Hall = index | Room = detail | Closet = summary | Tunnel = cross-link

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
│   │   ├── search-index.md              (grep-searchable session index)
│   │   ├── user-profile.md              (persistent user model ≤80 lines)
│   │   ├── wings/
│   │   │   ├── {topic}/
│   │   │   │   ├── hall.md
│   │   │   │   ├── rooms/{room}.md
│   │   │   │   ├── closets/{room}.md
│   │   │   │   ├── skills/{name}.md     (crystallized execution paths)
│   │   │   │   └── raw/YYYY-MM-DD-*.md
│   │   │   └── knowledge-evolution/
│   │   │       ├── hall.md
│   │   │       ├── rooms/
│   │   │       └── closets/
│   │
│   └── knowledge/                       ← Knowledge Evolution
│       ├── index.json                   (source of truth: scores + evolution_log[])
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
│  2. Read palace/user-profile.md            │
│  3. Read knowledge-evolution/hall.md        │
│  4. Classify wings Hot/Cold                │
│  5. Load Hot wings + top lessons           │
│  6. Brief: context + learning state        │
│  7. Nudge check: 6 rules, max 3 shown     │
│  8. Skill suggestions: ACTIVE skills only  │
└────────────────────────────────────────────┘
           │
           ▼
┌─── EXECUTE ────────────────────────────────┐
│  - Use templates from knowledge/index.json │
│  - Use skills from wings/{topic}/skills/   │
│  - Track outcome: SUCCESS or FAILURE       │
│  - Record actual execution steps per skill │
│  - Note reasoning in-session               │
└────────────────────────────────────────────┘
           │
           ▼  (User: "save session + learn")
┌─── END ────────────────────────────────────┐
│  1. Admission Control (score ≥0.6?)        │
│  2. Write to palace/wings/{topic}/         │
│  3. Update search-index.md (keywords)      │
│  4. Skill auto-crystallize (≥2x → DRAFT)  │
│  5. Skill self-improve (refine on +outcome)│
│  6. Update user-profile.md                 │
│  7. Update knowledge-evolution wing        │
│  8. Sync to knowledge/index.json + evo_log │
│  9. Update state.md + tunnels.md           │
│ 10. Confirm: "✅ X rooms, Y scores synced" │
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
├── GOTCHAS.md                   ← 30 edge cases + fixes
└── references/
    ├── session.md               ← Session start/end, admission, nudges, skill suggestions
    ├── storage.md               ← Wings, rooms, closets, archive, skills, search index
    ├── intelligence.md          ← Scoring, routing, nudge rules, audit trail, consolidation
    ├── maintenance.md           ← Write-back, sync, conflict handling
    └── adaptation.md            ← Domain examples + custom routing
```

---

## Reference Quick Guide

| เมื่อต้องการ | Load |
|-----------|------|
| เริ่ม session, จบ session, nudges, skill suggestions | `references/session.md` |
| สร้าง wing, room, closet, archive, skill, search index | `references/storage.md` |
| ดู scores, routing, nudge rules, audit trail | `references/intelligence.md` |
| Sync ระหว่าง memory ↔ knowledge | `references/maintenance.md` |
| ตัวอย่างสำหรับ domain คุณ | `references/adaptation.md` |
| Edge cases (28 items) | `GOTCHAS.md` |
