# 🏛️ Memory Palace — คู่มือภาษาไทย

ระบบความจำถาวรสำหรับ AI ข้ามหลาย chat session โดยใช้แนวคิด "Memory Palace" (วิธีจำของนักปราชญ์กรีกโบราณ)

---

## ทำไมต้องมี Memory Palace?

ปัญหาหลักของ AI คือ **ทุก chat session เริ่มใหม่จากศูนย์** — ไม่รู้ว่าครั้งที่แล้วทำอะไรไป ตัดสินใจอะไร หรือโค้ดอยู่ที่ไหน

Memory Palace แก้ปัญหานี้โดยให้ AI **เขียนบันทึกลงไฟล์** ก่อนจบ session และ **อ่านบันทึกนั้น** ตอนเริ่ม session ใหม่

---

## โครงสร้าง 2 ชั้น

```
~/.claude/skills/memory-palace/          ← ตัวกลาง (ใช้ได้กับทุก workspace)
  SKILL.md                               ← concept หลัก: AAAK, Temporal KG, Contradiction Detection
  references/mempalace-logic.md          ← technical reference

.claude/skills/ai-dlc/core/memory-palace/ ← workspace adapter (ไฟล์นี้อยู่ที่นี่)
  SKILL.md                               ← กำหนด storage path + Light implementation
  references/full-version-plan.md        ← roadmap สำหรับ Full version (ChromaDB)
```

**ตัวกลาง** = source of truth สำหรับทุก concept  
**Workspace adapter** = บอกว่า project นี้เก็บ memory ไว้ที่ไหน และใช้แบบ Light (markdown)

---

## โครงสร้าง Palace (ที่เก็บข้อมูลจริง)

```
.claude/memory/
├── state.md              ← แผนที่ palace: มี wing อะไรบ้าง, session ล่าสุด, งานค้าง
├── tunnels.md            ← cross-reference ระหว่าง wing
└── wings/
    └── {ชื่อ project}/
        ├── hall.md       ← index ของ wing นี้ (มี room อะไรบ้าง)
        ├── rooms/
        │   └── {topic}.md    ← รายละเอียดเต็มของแต่ละ topic
        └── closets/
            └── {summary}.md  ← สรุปแบบ AAAK (กระชับ) เมื่อ room ยาวเกิน 80 บรรทัด
```

---

## ลำดับชั้น Palace

| ชั้น | ชื่อ | คืออะไร | เปรียบเหมือน |
|------|------|---------|--------------|
| L0 | **Wing** | project หรือ domain | ปีกของอาคาร |
| L1 | **Room** | topic เฉพาะเจาะจง พร้อมรายละเอียดเต็ม | ห้องในปีก |
| L2 | **Closet** | สรุปแบบ AAAK ของ room | ตู้เสื้อผ้าในห้อง |
| L3 | **Drawer** | key-value ย่อยใน closet | ลิ้นชักในตู้ |
| L4 | **Hall / Tunnel** | เชื่อม room ภายใน wing / ข้าม wing | ทางเดินเชื่อม |

---

## AAAK Compression คืออะไร?

แทนที่จะเขียนภาษาอังกฤษยาวๆ ใช้ shorthand ที่ AI อ่านออกแต่กิน token น้อยกว่า

**แบบปกติ (verbose):**
```
The script currently processes 473 requests from the iuser-convert collection,
splitting them by top-level folder into separate spec files.
```

**แบบ AAAK:**
```
@Script:postmanMdToPlaywright | v:7 | Input:iuser-convert(473req)
Mode: auto-split by topFolder → separate spec/helper/service per folder
```

ประหยัด token ได้ ~60-70% เหมาะสำหรับ closet files

---

## Temporal Triples คืออะไร?

แทนที่จะ overwrite ข้อมูลเก่า ให้บันทึกว่า "ข้อมูลนี้ถูกต้องในช่วงเวลาไหน"

```
(MemPalace, architecture, single-skill) [2025-04-09 — 2025-04-09]
(MemPalace, architecture, 2-tier)       [2025-04-09 — Present]
```

ทำให้ย้อนดูได้ว่า "ตอนนั้นตัดสินใจอะไร และเปลี่ยนเมื่อไหร่"

---

## Contradiction Detection

ก่อนเขียนทับข้อมูลเก่า AI จะ check ว่า:
1. มี active triple (valid_to = null) สำหรับ subject/predicate นี้อยู่มั้ย?
2. ข้อมูลใหม่ขัดแย้งกับ strategy ที่กำหนดไว้มั้ย?
3. ถ้าขัดแย้ง → แจ้ง user ก่อน ไม่ overwrite เงียบๆ

---

## การทำงานอัตโนมัติ

**Hook `agentStop`** (`.claude/.kiro/hooks/memory-palace-save.kiro.hook`)  
ทุกครั้งที่ AI หยุดทำงาน hook จะ remind ให้ AI บันทึก memory ตาม 10 ขั้นตอน:
- อ่าน state.md → สร้าง/อัพเดท wing → เขียน rooms → compress closets → อัพเดท state.md

---

## เริ่ม session ใหม่ยังไง?

บอก AI ว่า:
> "อ่าน memory palace แล้วทำต่อจากครั้งที่แล้ว"

AI จะ:
1. อ่าน `.claude/memory/state.md`
2. เลือก wing ที่เกี่ยวข้อง
3. อ่าน hall.md + rooms ที่จำเป็น
4. สรุปให้ฟังว่าครั้งที่แล้วทำอะไรไปแล้ว

---

## Full Version (อนาคต)

Light version นี้ใช้ markdown ล้วน ไม่มี dependency  
Full version จะเพิ่ม ChromaDB + MCP server + semantic search  
→ ดูรายละเอียดที่ `references/full-version-plan.md`

---

## อ้างอิง

- [MemPalace GitHub](https://github.com/milla-jovovich/mempalace) — ต้นแบบ concept ทั้งหมด
- 96.6% R@5 on LongMemEval benchmark (raw mode, zero API calls)
