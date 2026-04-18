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
{project}/
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
│   │   ├── graph.json                   (machine-readable Obsidian graph)
│   │   └── graph.md                     (Mermaid diagram)
│   │
│   └── knowledge/                       ← Knowledge Evolution
│       ├── index.json                   (source of truth: scores)
│       └── lessons/{domain}/
│           ├── *LessonsIndex.json
│           └── *.md
│
└── ~/.claude/skills/ai-dlc/knowledge/   ← Global fallback knowledge
```

---

## Obsidian Integration (新)

All Memory Palace rooms are Obsidian-compatible:

**Frontmatter (YAML):**
```yaml
---
wing: code
status: active
tags: [patterns, components]
created: 2026-04-18
updated: 2026-04-18
links: [[code/architecture], [code/testing]]
---
```

**Cross-References:**
- Wikilinks: `[[wing/room]]` for navigation
- Backlinks: Auto-built by Obsidian from wikilinks
- Graph layers:
  1. **Obsidian graph** — interactive visual (wikilinks)
  2. **Mermaid diagram** — static, shareable (graph.md)
  3. **JSON metadata** — machine-readable (graph.json)

Session end auto-generates:
- `.unified-memory/palace/graph.json` — node/edge schema
- `.unified-memory/palace/graph.md` — Mermaid visualization

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
│  2g. Write frontmatter + backlinks to rooms│
│  2h. Auto-generate graph.json + graph.md   │
│  6. Confirm: "✅ X rooms, Y scores, graph" │
└────────────────────────────────────────────┘
```

---

## Design Principles

```
No dependencies   = markdown + JSON only, no database
Manual triggers   = "save session + learn" (no hooks = no token waste)
Source of truth   = knowledge/index.json (memory = session buffer only)
Admission control = score ≥0.6 gates writes (prevents noise)
Obsidian native   = frontmatter + wikilinks + graph layers
Compound growth   = each session makes templates + lessons more reliable
```

---

## File Structure (Skill Repo)

```
~/.claude/skills/system/unified-memory/
├── SKILL.md                     ← Entry point (triggers + commands)
├── SYSTEM_README.md             ← Architecture (you are here)
├── GOTCHAS.md                   ← 18 edge cases + Obsidian fixes
└── references/
    ├── session.md               ← Session start/end, admission
    ├── storage.md               ← Wings, rooms, closets, archive
    ├── intelligence.md          ← Scoring, routing, consolidation
    ├── maintenance.md           ← Write-back, sync, conflict handling
    └── adaptation.md            ← Domain examples + custom routing
```

---

## 🎨 Obsidian Conventions (Writing Guide)

ใช้แนวคิดของ Obsidian เพื่อช่วยให้ "สมองของ AI" อ่านง่ายขึ้นสำหรับมนุษย์ โดยไม่กระทบโครงสร้างหลัก:

### 1. Properties UI (YAML Frontmatter)
ในทุก Room ให้รักษาส่วน YAML ไว้ด้านบนสุด เพื่อให้ Obsidian แสดงผลเป็น **Properties UI** ช่วยให้คุณ Filter ตาม `tags`, `status` หรือ `wing` ได้ทันทีจากแถบเครื่องมือ

### 2. Visual Blocks (Obsidian Callouts)
ใช้ Callouts เพื่อ "หุ้ม" ข้อมูลที่เป็น Shorthand หรือ AI-only logic เพื่อให้พับเก็บได้ (Foldable) และแยกสีให้ชัดเจน:
- `> [!ABSTRACT] AAAK Closet` — สำหรับสรุปที่บีบอัดแล้ว
- `> [!INFO] Temporal Triples` — สำหรับประวัติการเปลี่ยนแปลงข้อมูล
- `> [!QUOTE] Raw Reference` — สำหรับข้อความ verbatim จากแหล่งอ้างอิง

### 3. Bidirectional Links (Wikilinks)
ใช้ `[[wing/room]]` แทนการเขียน File Path ปกติ เพื่อให้ Obsidian สร้าง **Live Graph** เชื่อมโยงความสัมพันธ์ของความจำให้คุณเห็นเป็นเส้นใยแมงมุม

### 4. Semantic Tagging
ใช้ Tags (สูงสุด 5 อัน) เพื่อเชื่อมโยง Room ที่อยู่คนละ Wing เข้าด้วยกัน เช่น `#security` หรือ `#performance` เพื่อให้เห็นภาพรวมของหัวข้อนั้นๆ ทั้งโปรเจกต์

---

## Reference Quick Guide

| เมื่อต้องการ | Load |
|-----------|------|
| เริ่ม session หรือ จบ session | `references/session.md` |
| สร้าง wing, room, closet, archive | `references/storage.md` |
| ดู scores, routing, consolidation | `references/intelligence.md` |
| Sync ระหว่าง memory ↔ knowledge | `references/maintenance.md` |
| ตัวอย่างสำหรับ domain คุณ | `references/adaptation.md` |
| Edge case / Obsidian gotcha | `GOTCHAS.md` |
