# 🧠 Knowledge Evolution — คู่มือภาษาไทย

ระบบทำให้ knowledge base ปรับปรุงตัวเองได้จาก execution feedback
ไม่ต้องติดตั้ง dependency เพิ่ม ใช้ได้กับทุก storage format ปรับใช้ได้ทุก domain

---

## ทำไมต้องมี Knowledge Evolution?

ปัญหาหลักของ knowledge base แบบ static คือ **ทุก template ดูเหมือนกันหมด** — ไม่รู้ว่าอันไหนใช้แล้วผ่าน อันไหนทำให้ test พัง หรือ lesson ไหนยังใช้ได้อยู่

Knowledge Evolution แก้ปัญหานี้โดยให้ทุก execution **ส่ง signal กลับมา** — template ที่ดีได้คะแนนสูงขึ้น template ที่พังถูก flag และ lesson ใหม่ถูก capture อัตโนมัติ

---

## สถาปัตยกรรมภาพรวม

```
Read → Execute → Reflect → Write
  ↑                           ↓
  └─────── knowledge ─────────┘
```

ทุก execution ผลิต signal — ระบบเรียนรู้ว่า knowledge ไหนเชื่อถือได้โดยไม่ต้องมีคนมาบอก

---

## โครงสร้าง Knowledge (สองชั้น)

```
KNOWLEDGE_GLOBAL  = ~/.claude/skills/ai-dlc/knowledge/   ← cross-project templates + lessons
KNOWLEDGE_PROJECT = {project}/.knowledge/                 ← per-project overrides
```

**Resolution order:** `{project}/.knowledge/` ก่อน → fallback ไป `KNOWLEDGE_GLOBAL`

### Global Knowledge (`ai-dlc/knowledge/`)

```
ai-dlc/knowledge/
├── index.json                    ← master catalog, utility_score ต่อ domain
├── automation/
│   ├── automationIndex.json
│   ├── api/        apiIndex.json + templates
│   ├── webUi/      webUiIndex.json + templates
│   ├── mobile/     mobileIndex.json + templates
│   └── common/     commonIndex.json + templates
├── business/
│   ├── businessIndex.json
│   ├── auth/       businessAuthIndex.json + rules
│   ├── finance/    businessFinIndex.json + rules
│   └── document/   businessDocIndex.json + rules
└── lessons/
    ├── api/        apiLessonsIndex.json + lesson files
    ├── webUi/      webUiLessonsIndex.json + lesson files
    └── mobile/     mobileLessonsIndex.json + lesson files
```

### Per-Project Knowledge (`{project}/.knowledge/`)

```
{project}/.knowledge/
├── index.json                    ← project domain catalog, utility_score ต่อ domain
├── README.md                     ← usage guide + resolution order note
└── lessons/
    └── {domain}/                 *LessonsIndex.json + lesson files
```

Project knowledge **override** global สำหรับ domain เดียวกัน ถ้า domain มีแค่ใน global → fallback อัตโนมัติ

---

## สามชั้นของระบบ

### ชั้น 1 — Utility Scoring

เพิ่ม quality signal ให้ทุก knowledge item:

```json
// Template fields
{
  "utility_score": 5.0,
  "usage_count": 0,
  "last_used": null,
  "last_failure": null,
  "auto_captured": false
}

// Lesson fields
{
  "effectiveness": {
    "applied_count": 0,
    "prevented_failures": 0,
    "still_relevant": true,
    "confidence": 1.0
  },
  "auto_captured": false
}
```

| Score | สถานะ | Action |
|-------|-------|--------|
| ≥ 7.0 | ✅ Proven | ใช้ก่อนใน routing |
| 3.0–6.9 | 🟡 Active | ใช้ปกติ |
| < 3.0 | ⚠️ Flagged | เตือนก่อนใช้ |
| 0.0 | 🔴 Deprecated | ข้ามไปเว้นแต่ระบุชัด |

### ชั้น 2 — Smart Routing

```
1. ดึง intent: "Input → Process → Output"
2. match intent_patterns (semantic level)
3. ถ้า match → load domain
4. ถ้าไม่ match → keyword fallback
5. ถ้า match หลายอัน → sort by utility_score DESC → เลือกอันบน
6. ถ้า score ต่ำกว่า threshold → เตือน user
```

### ชั้น 3 — Memory Integration

```
Session Start:
  → โหลด knowledge-evolution wing (ถ้ามี)
  → สรุป: top scores, top lessons, flags, gaps

Session End:
  → อัพเดท tracking rooms ด้วย score changes
  → sync กลับไป knowledge index files
  → compress เป็น AAAK ถ้า rooms > 80 บรรทัด
```

---

## Auto-Capture Protocol

เมื่อ test พังและ root cause เป็น pattern ใหม่:

```
Test FAIL
  → วิเคราะห์ root cause
  → Pattern มีใน lessons อยู่แล้วมั้ย?
    ├── เนื้อหาเหมือนกัน  → increment applied_count, ข้ามการ save
    ├── เนื้อหาต่างกัน    → สร้าง -v2 entry, เก็บทั้งคู่
    ├── ขัดแย้งกัน        → flag ให้ human review, ห้าม auto-save
    └── Pattern ใหม่      → auto-capture (confidence: 0.75) → flag ใน memory layer
```

**Confidence levels:**
- `1.0` — human-curated, เชื่อถือได้เสมอ
- `0.8` — healed (test ผ่านหลัง fix), เชื่อถือได้
- `0.75` — inferred จาก failure, ต้อง review
- `< 0.6` — ข้ามใน routing จนกว่าจะ review

Human override ชนะเสมอ — auto-captured knowledge เป็นแค่คำแนะนำ ไม่ใช่ authority

---

## Reference Files — ใช้อะไรตอนไหน

| เมื่อไหร่ | โหลดไฟล์ไหน |
|-----------|------------|
| เพิ่ม `utility_score` ให้ templates, เพิ่ม `effectiveness` ให้ lessons, auto-capture หลัง test fail/pass | `references/utility-scoring.md` |
| เพิ่ม `intent_patterns` ใน businessIndex, อัพเดท routing ให้ sort by score, sort lessons by prevented_failures | `references/smart-routing.md` |
| Knowledge base > 50 templates / > 100 lessons → upgrade เป็น BM25 หรือ vector embeddings | `references/semantic-routing.md` |
| สร้าง knowledge-evolution wing ใน `.memory/`, session start/end protocol, write-back sync | `references/memory-integration.md` |
| Deduplicate lessons, stale detection, date normalization, conflict resolution, score normalization | `references/auto-consolidation.md` |
| วิเคราะห์ failure > 5 อันพร้อมกัน, batch lesson capture, conflict-free consolidation | `references/parallel-analysis.md` |
| Phase A→D roadmap, folder structure สองชั้น, setup `.knowledge/`, placeholder mapping | `references/implementation-guide.md` |

---

## Implementation Phases

- **Phase A** — เพิ่ม fields อย่างเดียว ไม่เปลี่ยน behavior ทำได้ทันที
- **Phase B** — เปิดใช้ scoring ใน workflow ต้องทำ Phase A ก่อน
- **Phase C** — เชื่อม memory layer สำหรับ cross-session tracking
- **Phase D** — automate ด้วย hooks ไม่ต้อง trigger เอง

---

## Advanced Capabilities

### Auto-Consolidation (แรงบันดาลใจจาก Anthropic Auto-Dream)
- Deduplicate lessons ที่มี root cause เดียวกัน
- Soft-delete entries ที่ไม่ได้ใช้นาน
- Normalize relative dates เป็น absolute
- Flag entries ที่ขัดแย้งกันให้ human review

### Semantic Routing (BM25 + Embeddings)
- Level 0: intent_patterns (manual, ปัจจุบัน)
- Level 1: BM25 text ranking (ไม่ต้องใช้ model)
- Level 2: BM25 + vector embeddings (semantic)
- Upgrade เมื่อ: > 50 templates หรือ > 100 lessons

### Parallel Trace Analysis (แรงบันดาลใจจาก Trace2Skill)
- อ่าน traces ทั้งหมดก่อน แล้วค่อยเขียน
- หา cross-trace patterns ก่อน write lesson
- เขียน consolidated, conflict-free lessons ในครั้งเดียว

---

## Design Principles

- **No new dependencies** — ใช้ storage format ที่มีอยู่แล้ว
- **Additive only** — fields ใหม่ไม่ทำลาย consumers เดิม
- **Graceful degradation** — ถ้าไม่มี score ให้ treat เป็น neutral (5.0)
- **Human override always wins** — auto-captured knowledge เป็นแค่คำแนะนำ
- **Source of truth stays in files** — memory layers เป็น cache ไม่ใช่ replacement

---

## Research Foundation

| Concept | Source |
|---------|--------|
| Closed loop Read→Execute→Reflect→Write | Memento-Skills (arXiv:2603.18743) |
| Utility scoring + Pareto selection | EvoSkill (arXiv:2603.02766), OpenSpace |
| Failure analysis → auto-capture | EvoSkill, ACE (arXiv:2510.04618) |
| Conflict-free consolidation | Trace2Skill (arXiv:2603.25158) |
| Parallel trace analysis | Trace2Skill (arXiv:2603.25158) |
| Verifier-backed promotion | ASG-SI (arXiv:2512.23760) |
| Living Skillbook → context injection | ACE (Agentic Context Engineering) |
| Auto-consolidation / Auto-Dream | Anthropic Claude Code (2026) |
| BM25 + semantic routing | Memento-Skills, Retrieval-First Era (2026) |

---

## อ้างอิง

- [Memento-Skills GitHub](https://github.com/Memento-Teams/Memento-Skills) — source ของ concepts ที่นำมาประยุกต์
- [arXiv:2603.18743](https://arxiv.org/abs/2603.18743) — "Memento-Skills: Let Agents Design Agents" — GAIA +26.2%, HLE +116.2%
- [EvoSkill](https://arxiv.org/abs/2603.02766) — Automated Skill Discovery for Multi-Agent Systems
- [Trace2Skill](https://arxiv.org/abs/2603.25158) — Distill Trajectory-Local Lessons into Transferable Agent Skills
- [ACE Paper](https://arxiv.org/abs/2510.04618) — Agentic Context Engineering (Stanford/SambaNova)
- [ASG-SI](https://arxiv.org/abs/2512.23760) — Audited Skill-Graph Self-Improvement
- [OpenSpace](https://www.scriptbyai.com/self-evolving-engine-openspace/) — Self-Evolving Engine for AI Agents
