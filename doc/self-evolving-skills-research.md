# Self-Evolving Skills Research

วันที่: 2026-04-11
วัตถุประสงค์: Research frameworks ที่มีหลักการคล้าย Memento-Skills เพื่อเลือก concepts มาเสริม AI-DLC skill system

---

## สรุปภาพรวม

ทั้ง 5 frameworks แก้ปัญหาเดียวกัน: **ทำให้ agent เรียนรู้และปรับปรุงตัวเองได้จาก execution experience** โดยไม่ต้อง fine-tune model

---

## 1. EvoSkill (arXiv:2603.02766)

**หลักการ:** Self-evolving framework ที่ analyze execution failures → propose/edit skills → materialize เป็น skill folders

**กลไก:**
- วิเคราะห์ failures → สร้าง/แก้ skills อัตโนมัติ
- Pareto frontier selection — เก็บเฉพาะ skills ที่ improve validation performance
- Model frozen — ไม่ต้อง fine-tune

**ผลลัพธ์:**
- OfficeQA: +7.3% (60.6% → 67.9%)
- SealQA: +12.1% (26.6% → 38.7%)
- Zero-shot transfer: skills จาก SealQA → BrowseComp +5.3% โดยไม่แก้ไข

**Concept ที่น่าเอามาใช้:**
- Failure analysis → auto-propose skill edits (= auto-capture lessons ใน memento plan)
- Pareto frontier = เก็บเฉพาะ skills ที่ดีขึ้นจริง (= utility scoring)

---

## 2. Trace2Skill (arXiv:2603.25158)

**หลักการ:** Parallel fleet of sub-agents วิเคราะห์ execution traces → distill เป็น transferable skills

**กลไก:**
- ไม่ sequential — parallel analysis ของ diverse executions
- Hierarchical consolidation → unified, conflict-free skill directory
- รองรับทั้ง deepening existing skills และ creating new ones

**ผลลัพธ์:**
- Skills evolved by Qwen3.5-35B → improved Qwen3.5-122B by +57.65pp on WikiTableQuestions
- Transfer across LLM scales + OOD settings

**Concept ที่น่าเอามาใช้:**
- Parallel analysis (ไม่ sequential) = เร็วกว่า
- Conflict-free consolidation = ไม่มี duplicate/contradicting skills
- Cross-model transfer = skills ที่ดีพอจะ transfer ข้าม context ได้

---

## 3. ACE — Agentic Context Engineering (Stanford/SambaNova, arXiv:2510.04618)

**หลักการ:** Contexts as "evolving playbooks" — accumulate, refine, organize strategies ผ่าน generation → reflection → curation loop

**กลไก:**
- **Agent** — ใช้ strategies จาก Skillbook
- **Reflector** — วิเคราะห์ execution traces (มี sandboxed REPL สำหรับ recursive analysis)
- **SkillManager** — curate Skillbook: add/refine/remove strategies

**ผลลัพธ์:**
- +10.6% on agent benchmarks, +8.6% on finance
- 49% token reduction ใน browser automation
- AppWorld leaderboard: matches top production agent ด้วย smaller open-source model
- Adaptation latency ลด 91.5%, token cost ลด 83.6%

**Open-source:** `pip install ace-framework` (~1.9K GitHub stars)

**Concept ที่น่าเอามาใช้:**
- Skillbook = living document ที่ inject เข้า context (= knowledge buffer ของเรา)
- Reflector + SkillManager separation = ชัดเจนว่าใครทำอะไร
- Structured incremental updates (ป้องกัน context collapse) = admission control ของเรา
- ทำงานได้โดยไม่ต้อง labeled supervision — ใช้ natural execution feedback

---

## 4. ASG-SI — Audited Skill-Graph Self-Improvement (arXiv:2512.23760)

**หลักการ:** Self-improvement เป็น iterative compilation เข้า growing, auditable skill graph

**กลไก:**
- Extract improvements จาก successful trajectories
- Normalize เป็น skill ที่มี explicit interface
- Promote เฉพาะหลังผ่าน verifier-backed replay + contract checks
- Rewards decomposed เป็น reconstructible components (audit trail)
- Experience synthesis สำหรับ stress testing

**Concept ที่น่าเอามาใช้:**
- Verifier-backed promotion = ไม่ promote skill ที่ยังไม่ verified (= admission control ≥0.6)
- Audit logging = รู้ว่า skill ถูก promote เพราะอะไร
- Explicit interface per skill = structured skill format

---

## 5. OpenSpace (open-source)

**หลักการ:** Self-evolving engine ที่ plug เข้า AI agents — reuse optimized workflows

**ผลลัพธ์:** Token cost -46%, output/hour +4.2x

**Concept ที่น่าเอามาใช้:**
- Workflow reuse = utility scoring (ใช้ workflow ที่ proven แล้ว)
- Plug-in architecture = ไม่ต้องเปลี่ยน agent หลัก

---

## Concept Mapping กับ AI-DLC ของเรา

| Concept | Framework | ของเรา (ปัจจุบัน) | Gap |
|---|---|---|---|
| Failure analysis → auto-capture lessons | EvoSkill, ACE | Manual (storage skill) | ต้อง trigger เอง |
| Parallel trace analysis | Trace2Skill | Sequential | ช้ากว่า |
| Conflict-free skill consolidation | Trace2Skill, ASG-SI | ไม่มี | อาจมี duplicate lessons |
| Verifier-backed promotion | ASG-SI | Admission control (score ≥0.6) | ✅ มีแล้ว (concept เดียวกัน) |
| Living Skillbook (inject to context) | ACE | Memory Palace | ✅ มีแล้ว (concept เดียวกัน) |
| Structured incremental updates | ACE | AAAK compression | ✅ มีแล้ว |
| Utility scoring / Pareto selection | EvoSkill, OpenSpace | ไม่มี | ต้องเพิ่ม |
| Cross-task skill transfer | Trace2Skill | ไม่มี | อาจ overkill สำหรับตอนนี้ |
| Audit trail | ASG-SI | ไม่มี | nice-to-have |

---

## สรุป: Concepts ที่ควรเอามาใช้ (เรียงตาม priority)

### Priority 1: ทำได้เลย (ไม่ซับซ้อน)
1. **Utility scoring** (EvoSkill + OpenSpace) — เพิ่ม `utility_score` ใน index files
2. **Failure analysis → auto-capture** (EvoSkill + ACE) — หลัง test fail → auto-save lesson

### Priority 2: ทำได้ แต่ต้องออกแบบ
3. **Conflict-free consolidation** (Trace2Skill) — ก่อน save lesson ตรวจว่า duplicate ไหม
4. **Verifier-backed promotion** (ASG-SI) — ใช้ admission control ที่มีอยู่แล้ว + เพิ่ม replay check

### Priority 3: Future consideration
5. **Parallel trace analysis** (Trace2Skill) — ต้องมี multi-agent setup
6. **Cross-task skill transfer** — overkill สำหรับตอนนี้
7. **Audit trail** — nice-to-have

---

## ความสัมพันธ์กับ Memento-Skills Integration Plan

Memento plan ที่มีอยู่ครอบคลุม Priority 1-2 แล้ว แต่ ACE เพิ่ม insight สำคัญ:

> **"Structured incremental updates ป้องกัน context collapse"**

ซึ่งตรงกับ AAAK compression + admission control ของเรา — ยืนยันว่า design ที่มีอยู่ถูกทิศทาง

**แนะนำ:** ทำ Memento plan Phase A-B ก่อน โดยเพิ่ม conflict-free check จาก Trace2Skill เข้าไปด้วย

---

## อ้างอิง

- [EvoSkill](https://arxiv.org/abs/2603.02766) — Automated Skill Discovery for Multi-Agent Systems
- [Trace2Skill](https://arxiv.org/abs/2603.25158) — Distill Trajectory-Local Lessons into Transferable Agent Skills
- [ACE Paper](https://arxiv.org/abs/2510.04618) — Agentic Context Engineering (Stanford/SambaNova)
- [ACE Open-source](https://github.com/kayba-ai/agentic-context-engine) — pip install ace-framework
- [ASG-SI](https://arxiv.org/abs/2512.23760) — Audited Skill-Graph Self-Improvement
- [OpenSpace](https://www.scriptbyai.com/self-evolving-engine-openspace/) — Self-Evolving Engine for AI Agents
