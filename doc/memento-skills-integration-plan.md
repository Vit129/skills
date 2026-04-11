# Memento-Skills × AI-DLC Integration Plan

วันที่: 2026-04-10
สถานะ: Draft — รอ review

---

## 1. สรุปสถานการณ์ปัจจุบัน

### AI-DLC Skills (ของเรา)
- **30+ skills** จัดเป็น 4 categories: core, dev, qa, finance
- **Knowledge folder** (`ai-dlc/knowledge/`) = domain-specific knowledge base
  - `automation/` — code templates (Playwright, Robot Framework) + index files
  - `business/` — business rules per domain (auth, finance, document, common)
  - `lessons/` — lessons learned จากปัญหาจริง (api, webUi, mobile)
- **Memory Palace** (`system/memory-palace/`) = cross-session memory (markdown-only)
- **Storage skill** (`dev/storage/`) = write-back protocol สำหรับ knowledge
- **AIDLC workflow** = DECISIONS → PLAN → EXECUTE with 15+ phases

### Memento-Skills (GitHub)
- **Self-evolving Python agent framework** — Read → Execute → Reflect → Write loop
- **Skill routing** — BM25 + vector hybrid search
- **Skill Market** — cloud catalogue สำหรับ download/share skills
- **Skill Builder** — สร้าง skill ใหม่ programmatically
- **Utility scoring** — skill ที่ใช้แล้วดีได้คะแนนสูง, ที่พังถูก rewrite
- **Error recovery + loop detection** — self-repair เมื่อ skill ล้มเหลว
- **Storage backends** — db_storage, file_storage, vector_storage

---

## 2. Concept Mapping — ของเรา vs Memento-Skills

ทั้งสองระบบแก้ปัญหาเดียวกัน ต่างที่ **ใครทำ** และ **เก็บยังไง**

### หลักการเดียวกัน: Closed Loop
- ก่อนทำ → ค้นหาของเดิม (Read)
- ทำงาน → ใช้ knowledge ที่มี (Execute)
- หลังทำ → เรียนรู้จากผลลัพธ์ (Reflect)
- บันทึก → เก็บสิ่งที่เรียนรู้ (Write)

### Mapping ตรงๆ ทีละไฟล์

```
AI-DLC (ของเรา)                         Memento-Skills
────────────────────────────────────    ──────────────────────────
discovery-domain.md (7-phase scan)      = Read phase (Skill Router)
  "scan index → match domain"              "BM25 + vector → retrieve skill"
  keyword + abstraction matching            automatic semantic routing

context.md (Step-Back + extraction)     = Intent phase (4-stage ReAct)
  "zoom out → extract goals/scope"          "intent → planning"
  structured context extraction             stateful prompt construction

gap.md (required vs available)          = Planning phase
  "compare → prioritize gaps"               "plan execution strategy"
  reusability score calculation             skill selection + fallback

knowledge-buffer.md (capture)           = Write phase (Reflect → Write)
  "capture after each phase"                "reflect on outcome → write back"
  เก็บใน audit.md                           เก็บใน skill library

qa-task-design.md (task breakdown)      = Planning phase (task decomposition)
  "read lessons → break into tasks"         "intent → plan → select skills"
  อ่าน lessons/ ก่อนสร้าง task               อ่าน skill library ก่อน execute

dev-task-design.md (task breakdown)     = Execution phase (skill execution)
  "read lessons → sequence tasks"           "execute skill → sandbox run"
  อ่าน lessons/ ก่อนสร้าง task               ใช้ skill ที่ route มาได้

shared-task-progress-guide.md           = Finalize phase (result summarisation)
  "track progress → resume → report"        "structured result summarisation"
  PROGRESS.md master index                  persistent state

automation-save.md (save patterns)      = Write phase (Skill Builder)
  "save template/lesson to json"            "create/update skill file"
  คนต้อง trigger                             auto after reflect

buffer-update.md (sync findings)        = Write phase (Skill Store)
  "sync findings → knowledge buffer"        "write improved skill → store"
  append to audit.md                        update skill + utility score

knowledge/ folder (templates+rules)     = builtin/skills/ (10 built-in skills)
  human-curated domain knowledge            agent-managed skill library
  structured json + index files             markdown + SQLite + vector

Memory Palace (.memory/)                = persistent state (SQLite)
  cross-session memory in markdown          cross-session state in database
  Wings/Rooms/Closets hierarchy             flat skill files + metadata
```

### ความต่างหลัก

| | AI-DLC (ของเรา) | Memento-Skills |
|---|---|---|
| **ใครทำ** | AI ทำตาม protocol ที่**คนออกแบบ** | **Agent ทำเอง**ทั้งหมด |
| **เก็บยังไง** | Structured json/md ที่คน curate | Agent จัดการเอง |
| **Routing** | Index-based keyword + abstraction | BM25 + vector semantic search |
| **Evolution** | Manual — คนเพิ่ม/แก้ผ่าน storage skill | Auto — agent เขียน/ลบ skill เอง |
| **Quality** | Human-curated → ถูกต้องแน่นอน | Score-based → อาจ evolve ผิดทาง |
| **Scale** | ช้า (ต้องมีคน) แต่แม่นยำ | เร็ว (auto) แต่ต้อง verify |

---

## 3. Gap Analysis — อะไรที่เรามี vs ไม่มี

| Capability | AI-DLC มีแล้ว | Memento-Skills มี | Gap |
|---|---|---|---|
| Skill routing | ✅ description matching + index.json | ✅ BM25 + vector hybrid | เราใช้ keyword matching, ไม่มี semantic search |
| Knowledge store | ✅ json/ts/robot templates | ✅ SQLite + vector store | เราเป็น flat files, ไม่มี vector search |
| Self-evolving | ❌ คนต้องเพิ่ม/แก้เอง | ✅ auto-rewrite skills | **ช่องว่างใหญ่ที่สุด** |
| Utility scoring | ❌ ไม่มี | ✅ score per skill | ไม่รู้ว่า template/lesson ไหนดี/ไม่ดี |
| Lessons capture | ✅ manual (storage skill) | ✅ auto (Reflect phase) | เราต้อง trigger เอง |
| Cross-session memory | ✅ Memory Palace | ✅ persistent state | คนละ format แต่ concept เดียวกัน |
| Reuse analysis | ✅ discovery-domain.md (7 phases) | ✅ Read phase (skill retrieval) | เราละเอียดกว่า แต่ manual |
| Knowledge buffer | ✅ buffer-update.md | ✅ Write phase | เราเขียนลง audit.md, เขาเขียนลง skill library |
| Error recovery | ❌ ไม่มี auto-recovery | ✅ error_recovery.py + loop_detector.py | เราไม่มี self-heal สำหรับ knowledge |
| Context extraction | ✅ context.md (Step-Back) | ✅ Intent phase (stateful prompts) | เราละเอียดกว่า (structured extraction) |
| Gap prioritization | ✅ gap.md (Critical→Low) | ❌ ไม่มี explicit gap analysis | **เราดีกว่า** |
| Task decomposition | ✅ dev/qa-task-design.md | ✅ Planning phase | เราละเอียดกว่า (platform-specific) |
| Progress tracking | ✅ shared-task-progress-guide.md | ✅ Finalize phase | เราละเอียดกว่า (resume protocol) |

---

## 4. Integration Strategy — 3 Layers

### Layer 1: Evolving Knowledge (ปรับ knowledge ให้ evolve ได้)

**ปัญหา:** knowledge folder เป็น static — ต้องมีคนเพิ่ม template/lesson/rule เอง

**แก้ไข:** เพิ่ม **utility scoring + auto-capture** แบบ Memento-Skills

#### 1.1 Utility Scoring สำหรับ Templates
เพิ่ม `utility_score` ใน index files:

```json
// apiIndex.json
{
  "templates": {
    "auth": [{
      "id": "apiauth",
      "path": "apiAuth.template.ts",
      "utility_score": 8.5,        // ← NEW: 0-10, เพิ่มเมื่อใช้สำเร็จ
      "usage_count": 12,            // ← NEW
      "last_used": "2026-04-10",   // ← NEW
      "last_failure": null          // ← NEW: บันทึกเมื่อ template ทำให้ test fail
    }]
  }
}
```

**Update protocol:**
- หลัง Phase 3.2 (Automated Testing) PASS → `utility_score += 0.5`, `usage_count += 1`
- หลัง Phase 3.2 FAIL เพราะ template → `utility_score -= 1.0`, บันทึก `last_failure`
- `utility_score < 3.0` → flag ว่า template ต้อง review/rewrite

#### 1.2 Utility Scoring สำหรับ Lessons
เพิ่ม `effectiveness` ใน lesson entries:

```json
{
  "id": "LESSON-API-EMR-001",
  "effectiveness": {
    "applied_count": 5,
    "prevented_failures": 3,
    "still_relevant": true
  }
}
```

#### 1.3 Auto-Capture Lessons (จาก Reflect concept)
เพิ่ม protocol หลัง test execution:
- Test FAIL → AI วิเคราะห์ root cause → ถ้าเป็น pattern ใหม่ → auto-save เป็น lesson
- Test PASS หลังจาก heal → บันทึก healing strategy เป็น lesson
- Auto-captured lessons มี `"auto_captured": true, "confidence": 0.8` → ยังไม่ verified โดยคน

#### 1.4 Knowledge Buffer Auto-Evolve
ปรับ knowledge-buffer.md เพิ่ม:
- หลัง Phase 3.2 → auto-extract patterns จาก Reflexion Log
- เปรียบเทียบกับ lessons ที่มี → ถ้าใหม่ → auto-save
- ถ้าซ้ำ → เพิ่ม effectiveness.applied_count

**ไฟล์ที่ต้องแก้:**
- `dev/storage/references/automation-save.md` — เพิ่ม auto-capture protocol
- `ai-dlc/knowledge/automation/*/Index.json` — เพิ่ม utility fields
- `ai-dlc/knowledge/lessons/*/Index.json` — เพิ่ม effectiveness fields
- `core/aidlc/references/knowledge-buffer.md` — เพิ่ม auto-evolve protocol

---

### Layer 2: Smart Routing (ปรับ discovery ให้ฉลาดขึ้น)

**ปัญหา:** discovery-domain.md ใช้ keyword matching — miss ได้ถ้าชื่อไม่ตรง

**แก้ไข:** เพิ่ม **abstract intent matching** แบบ Memento-Skills skill router

#### 2.1 Intent-Based Index
เพิ่ม `intent_patterns` ใน businessIndex.json:

```json
{
  "domains": {
    "auth": {
      "keywords": ["login", "logout", "sso"],
      "intent_patterns": [
        "verify identity → grant access",
        "input credentials → validate → create session",
        "revoke access → destroy session"
      ]
    },
    "finance": {
      "keywords": ["payment", "invoice"],
      "intent_patterns": [
        "calculate amount → validate → process transaction",
        "generate document → apply rules → produce output"
      ]
    }
  }
}
```

#### 2.2 ปรับ discovery-domain.md Phase 4
เพิ่มขั้นตอน Intent Matching ก่อน keyword matching:

```
Phase 4 (ปรับปรุง):
1. Extract intent: "What is the Input → Process → Output?"
2. Match intent_patterns ก่อน (semantic level)
3. ถ้า match → load domain
4. ถ้าไม่ match → fallback เป็น keyword matching (เดิม)
5. ถ้ายังไม่ match → Deep Abstraction Protocol (เดิม)
```

#### 2.3 Utility-Weighted Routing
เมื่อมี template หลายตัว match → เลือกตัวที่ `utility_score` สูงสุด:

```
Phase 5 (ปรับปรุง):
- Match templates for "create" items
- Sort by utility_score DESC
- Pick top match (highest score = most proven)
- If utility_score < 3.0 → warn: "template นี้มีปัญหาบ่อย"
```

#### 2.4 Lesson-Aware Task Design
ปรับ qa-task-design.md และ dev-task-design.md:
- Step 2 "Read Lessons Learnt" → เพิ่ม: sort by effectiveness.prevented_failures DESC
- แสดง top 3 most effective lessons ก่อน
- ถ้า lesson มี `still_relevant: false` → skip

**ไฟล์ที่ต้องแก้:**
- `ai-dlc/knowledge/business/businessIndex.json` — เพิ่ม intent_patterns
- `core/analysis-skills/references/discovery-domain.md` — เพิ่ม intent matching + utility routing
- `core/aidlc/references/qa-task-design.md` — เพิ่ม lesson effectiveness sorting
- `core/aidlc/references/dev-task-design.md` — เพิ่ม lesson effectiveness sorting

---

### Layer 3: Memory Palace as Skill Memory (เชื่อม Memory Palace)

**ปัญหา:** Memory Palace เก็บ session context, knowledge folder เก็บ domain knowledge — แยกกัน

**แก้ไข:** ให้ Memory Palace ทำหน้าที่เป็น **skill memory** แบบ Memento-Skills

#### 3.1 Knowledge Wing ใน Memory Palace
สร้าง wing เฉพาะสำหรับ knowledge evolution:

```
.memory/wings/knowledge-evolution/
├── hall.md                    ← index: template scores, lesson stats
├── rooms/
│   ├── template-health.md     ← utility scores + trends
│   ├── lesson-effectiveness.md ← which lessons ช่วยจริง
│   └── gap-tracker.md         ← domains ที่ยังไม่มี rules
└── closets/
    └── knowledge-state.md     ← AAAK summary ของ knowledge ทั้งหมด
```

#### 3.2 Cross-Session Knowledge Tracking
Memory Palace บันทึก:
- template ไหนถูกใช้ใน session นี้ + ผลลัพธ์
- lesson ไหนถูก apply + ช่วยหรือไม่
- business rule ไหนถูก discover ใหม่
- task progress จาก shared-task-progress-guide.md

เมื่อเริ่ม session ใหม่ → Memory Palace brief:
> "📚 Template apiAuth มี utility 8.5 (ใช้ 12 ครั้ง), lesson LESSON-API-EMR-001 ช่วยป้องกัน failure 3 ครั้ง"

#### 3.3 Tunnel เชื่อม Knowledge ↔ Project Wings
```
tunnels.md:
(knowledge-evolution, template-health) → (project-x, api-testing): template reuse tracking
(knowledge-evolution, lesson-effectiveness) → (project-x, debugging): lesson application tracking
```

#### 3.4 Write-back Sync
Memory Palace track ไว้ แต่ต้อง sync กลับไปที่ index files:
- Session End → Memory Palace update knowledge-evolution wing
- buffer-update.md → sync scores จาก Memory Palace กลับ index files
- ทำให้ knowledge files เป็น source of truth, Memory Palace เป็น tracking layer

**ไฟล์ที่ต้องแก้:**
- `system/memory-palace/SKILL.md` — เพิ่ม knowledge-evolution wing concept
- `system/memory-palace/references/scaling-protocol.md` — เพิ่ม knowledge wing schema + Session Start/End protocol
- `ai-dlc/core/memory-palace/SKILL.md` — เพิ่ม knowledge tracking ใน workspace adapter
- `dev/storage/references/buffer-update.md` — เพิ่ม knowledge score sync step

---

## 5. Implementation Roadmap

### Phase A: Foundation (ทำก่อน)
1. เพิ่ม utility_score fields ใน index files ทั้งหมด
2. เพิ่ม effectiveness fields ใน lesson files ทั้งหมด
3. เพิ่ม intent_patterns ใน businessIndex.json
4. ปรับ discovery-domain.md เพิ่ม intent matching + utility routing
5. ปรับ automation-save.md เพิ่ม auto-capture protocol

### Phase B: AIDLC Workflow Integration
6. ปรับ knowledge-buffer.md เพิ่ม auto-evolve protocol
7. ปรับ qa-task-design.md เพิ่ม lesson effectiveness sorting
8. ปรับ dev-task-design.md เพิ่ม lesson effectiveness sorting
9. ปรับ buffer-update.md เพิ่ม utility score update + sync step

### Phase C: Memory Palace Integration
10. สร้าง knowledge-evolution wing template สำหรับ Memory Palace
11. ปรับ scaling-protocol.md เพิ่ม knowledge wing schema + Session Start/End
12. ปรับ workspace adapter เพิ่ม knowledge tracking
13. เพิ่ม tunnel patterns สำหรับ knowledge ↔ project

### Phase D: Feedback Loop Hooks
14. สร้าง hook: หลัง test execution → update utility scores
15. สร้าง hook: หลัง lesson apply → update effectiveness

---

## 6. ไฟล์ที่ต้องแก้ (สรุป)

| ไฟล์ | การแก้ไข | Phase |
|---|---|---|
| `knowledge/automation/api/apiIndex.json` | เพิ่ม utility_score, usage_count, last_used, last_failure | A |
| `knowledge/automation/webUi/webUiIndex.json` | เพิ่ม utility_score, usage_count, last_used, last_failure | A |
| `knowledge/automation/mobile/mobileIndex.json` | เพิ่ม utility_score, usage_count, last_used, last_failure | A |
| `knowledge/lessons/api/apiLessonsIndex.json` | เพิ่ม effectiveness fields | A |
| `knowledge/lessons/webUi/webUiLessonsIndex.json` | เพิ่ม effectiveness fields | A |
| `knowledge/lessons/mobile/mobileLessonsIndex.json` | เพิ่ม effectiveness fields | A |
| `knowledge/business/businessIndex.json` | เพิ่ม intent_patterns per domain | A |
| `core/analysis-skills/references/discovery-domain.md` | เพิ่ม intent matching (Phase 4) + utility routing (Phase 5) | A |
| `dev/storage/references/automation-save.md` | เพิ่ม auto-capture + utility update protocol | A |
| `core/aidlc/references/knowledge-buffer.md` | เพิ่ม auto-evolve protocol + Reflect integration | B |
| `core/aidlc/references/qa-task-design.md` | เพิ่ม lesson effectiveness sorting ใน Step 2 | B |
| `core/aidlc/references/dev-task-design.md` | เพิ่ม lesson effectiveness sorting ใน Step 2 | B |
| `dev/storage/references/buffer-update.md` | เพิ่ม utility score update + Memory Palace sync step | B |
| `system/memory-palace/SKILL.md` | เพิ่ม knowledge-evolution wing concept | C |
| `system/memory-palace/references/scaling-protocol.md` | เพิ่ม knowledge wing schema + Session Start/End | C |
| `ai-dlc/core/memory-palace/SKILL.md` | เพิ่ม knowledge tracking ใน workspace adapter | C |

---

## 7. สิ่งที่ไม่ทำ (Out of Scope)

- ❌ ไม่ติดตั้ง Memento-Skills เป็น standalone app
- ❌ ไม่ใช้ ChromaDB / vector storage (ยังคงใช้ markdown + json)
- ❌ ไม่เปลี่ยน skill format — ยังคงเป็น SKILL.md + references/

**เหตุผล:** เราเอา **concept** มาใช้ ไม่ใช่เอา **code** มาใช้
Memento-Skills เป็น Python framework สำหรับ general agent
ของเราเป็น Claude/Kiro skill system สำหรับ domain-specific work

---

## 8. พิจารณาในอนาคต (Future Consideration)

### 🔍 BM25 Search (เก็บไว้พิจารณา)

**Memento-Skills ใช้:** BM25 + vector hybrid search สำหรับ skill routing
- BM25 = text-based ranking algorithm ที่ให้คะแนนตาม term frequency + document length
- Vector = semantic embedding ที่เข้าใจความหมาย ไม่ใช่แค่ keyword

**ของเราตอนนี้:** index.json keyword matching → ต้อง match คำตรงๆ

**ทำไมน่าสนใจ:**
- ถ้า knowledge/ โตเกิน 50+ templates + 100+ lessons → keyword matching จะ miss มากขึ้น
- BM25 ช่วยหา "apiAuth" เมื่อ user พิมพ์ "login token" โดยไม่ต้องมี keyword "login" ใน index
- ไม่ต้องติดตั้ง database — BM25 ทำได้ด้วย pure JavaScript/Python library (เช่น `lunr.js`, `rank-bm25`)

**วิธี implement ถ้าทำ:**
1. สร้าง search index จาก template descriptions + lesson summaries + business rule names
2. เมื่อ discovery-domain.md Phase 2/4 → query BM25 index แทน keyword matching
3. ยังคง fallback เป็น index.json ถ้า BM25 ไม่ match

**เงื่อนไขที่ควรทำ:** เมื่อ knowledge/ มี >50 templates หรือ >100 lessons

---

### 🏪 Skill Market / Knowledge Sharing (เก็บไว้พิจารณา)

**Memento-Skills ใช้:** cloud catalogue สำหรับ search, download, auto-install skills

**ของเราตอนนี้:** skills อยู่ใน `~/.claude/skills/` — ใช้ได้แค่เครื่องเดียว

**ทำไมน่าสนใจ:**
- ถ้าทำงานเป็นทีม → แต่ละคนมี lessons/templates ต่างกัน → ไม่ได้ share
- Knowledge ที่ดีที่สุดอาจอยู่ในเครื่องคนอื่น
- Memento-Skills ใช้ Git repo เป็น catalogue → เราก็ใช้ Git อยู่แล้ว

**วิธี implement ถ้าทำ:**
1. `~/.claude/skills/` เป็น Git repo อยู่แล้ว (มี `.git/`)
2. เพิ่ม `knowledge/` ใน Git → push/pull = share knowledge
3. สร้าง `knowledge/CHANGELOG.md` → track ว่าใครเพิ่มอะไร
4. Utility scores ช่วย filter → team เห็นว่า template ไหน proven (score >7)
5. Auto-captured lessons มี `confidence` field → team review ก่อน merge

**เงื่อนไขที่ควรทำ:** เมื่อมี >1 คนใช้ skill system นี้ หรือต้องการ share knowledge ข้าม project

**ข้อควรระวัง:**
- Business rules อาจเป็น confidential → ต้องแยก public/private knowledge
- Auto-captured lessons อาจไม่ถูกต้อง → ต้อง review ก่อน share
- Merge conflicts ใน json index files → ต้องมี merge strategy

---

## 9. อ้างอิง

- [Memento-Skills GitHub](https://github.com/Memento-Teams/Memento-Skills) — source ของ concepts ที่นำมาประยุกต์
- [arXiv:2603.18743](https://arxiv.org/abs/2603.18743) — paper: "Memento-Skills: Let Agents Design Agents"
- Benchmark results: GAIA +26.2%, HLE +116.2% relative improvement
