# AI Agent Skills — Portability & Discovery Plan

วันที่: 2026-04-14
Goal: ระบบ skills ที่ทำงานได้ทั้ง Claude Code + Kiro และย้าย folder ได้โดยไม่ต้องแก้อะไร

---

## ปัญหาที่ต้องแก้

| # | ปัญหา | ผลกระทบ |
|---|-------|---------|
| 1 | **Skill Discovery** — Kiro ไม่รู้ว่ามี skills อยู่ที่ไหนถ้าไม่บอก | ต้องพิมพ์ "Read KIRO.md" ทุก session |
| 2 | **Steering per-project** — `.kiro/steering/` อยู่ใน project ไม่มี global | เปิด project ใหม่ต้อง copy ทุกครั้ง |
| 3 | **Hooks per-project** — `.kiro/hooks/` อยู่ใน project | ต้อง deploy เอง ไม่มี global hooks |
| 4 | **Hardcoded paths** — `~/.claude/skills/` ตายตัวใน steering + KIRO.md | ย้าย folder = broken ทันที |
| 5 | **Memory Palace path** — cross-project memory ไม่มี default | ถ้าไม่ตั้งค่า = ไม่ทำงาน |

---

## Core Principle: Self-Describing Skills Folder

แทนที่จะ hardcode path ไว้ทุกที่ — ให้ skills folder บอกตัวเองว่าอยู่ที่ไหนและมีอะไร

```
{skills_root}/
├── AGENT.md          ← entry point สำหรับทุก agent (Claude + Kiro)
├── SKILL.md          ← skill index (Claude Code reads this)
├── KIRO.md           ← Kiro-specific instructions
├── CLAUDE.md         ← Claude Code-specific instructions
└── ...
```

Agent ไม่ว่าจะเป็น Claude หรือ Kiro — ถ้าเจอ `AGENT.md` ในโฟลเดอร์ไหนก็รู้ว่านั่นคือ skills root

---

## แผนแก้ปัญหา

### P1 — AGENT.md: Universal Entry Point

สร้าง `{skills_root}/AGENT.md` — ไฟล์เดียวที่ทุก agent อ่านได้ ไม่ว่าจะอยู่ path ไหน

```markdown
# AI Agent Skills

Skills root: อยู่ที่ folder เดียวกับไฟล์นี้

## Quick Start
- Claude Code: CLAUDE.md
- Kiro: KIRO.md
- Skill index: SKILL.md

## Available Skills
[link to SKILL.md]
```

**ผล:** agent ที่ได้รับ path ของ AGENT.md จะรู้ทุกอย่างทันที ไม่ต้อง hardcode path

---

### P2 — Steering: ใช้ Relative Path แทน Absolute

**ปัจจุบัน (broken เมื่อย้าย):**
```markdown
→ Full rules: ~/.claude/skills/ai-dlc/qa/playwright-rules/SKILL.md
```

**แนวทางใหม่ (portable):**
```markdown
→ Full rules: #[[file:ai-dlc/qa/playwright-rules/SKILL.md]]
```

Kiro รองรับ `#[[file:relative/path]]` relative to steering file location — ถ้า steering อยู่ใน `.kiro/steering/` และ skills อยู่ที่ `~/.claude/skills/` ต้องใช้ absolute path อยู่ดี

**วิธีแก้จริง:** steering files ที่ reference skills ต้องอยู่ใน skills folder เดียวกัน ไม่ใช่ใน project

```
{skills_root}/
└── system/hook-creator/templates/kiro/steering/
    ├── ai-dlc-standards.md   ← อยู่ใน skills folder
    └── knowledge-routing.md  ← อยู่ใน skills folder
```

เวลา deploy ไป project → copy ไป `.kiro/steering/` แต่ content ใช้ `#[[file:~/.claude/skills/...]]` หรือ absolute path ที่ resolve จาก AGENT.md

---

### P3 — Kiro Steering: STEERING_INDEX.md เป็น Discovery Layer

VitProjects มี `STEERING_INDEX.md` อยู่แล้ว — นี่คือ pattern ที่ถูกต้อง

**ปัญหาที่เหลือ:** STEERING_INDEX.md hardcode path `.claude/skills/ai-dlc/`

**แก้:** เพิ่ม `SKILLS_ROOT` declaration ที่บนสุดของ STEERING_INDEX.md

```markdown
---
inclusion: auto
---
# Kiro Steering — Skills Index

SKILLS_ROOT: ~/.claude/skills
<!-- เปลี่ยนบรรทัดนี้บรรทัดเดียวเมื่อย้าย skills folder -->

All steering files reference {SKILLS_ROOT} as single source of truth.
```

Agent อ่าน SKILLS_ROOT แล้วใช้ resolve path ทั้งหมดใน session นั้น

---

### P4 — Hooks: Setup Script แทน Manual Copy

ไม่มีทาง bypass per-project limitation ของ Kiro ได้ — แต่ลด friction ด้วย setup script

สร้าง `{skills_root}/system/hook-creator/setup-kiro-project.sh`:

```bash
#!/bin/bash
# Usage: ./setup-kiro-project.sh /path/to/project
PROJECT=$1
SKILLS_ROOT=$(dirname $(realpath $0))/../../..

mkdir -p "$PROJECT/.kiro/hooks"
mkdir -p "$PROJECT/.kiro/steering"

# Copy standard hooks
cp "$SKILLS_ROOT/system/hook-creator/templates/kiro/"*.kiro.hook "$PROJECT/.kiro/hooks/"

# Copy steering templates
cp "$SKILLS_ROOT/system/hook-creator/templates/kiro/steering/"*.md "$PROJECT/.kiro/steering/"

echo "✅ Kiro project setup complete: $PROJECT"
echo "   Hooks: $(ls $PROJECT/.kiro/hooks/*.kiro.hook | wc -l) files"
echo "   Steering: $(ls $PROJECT/.kiro/steering/*.md | wc -l) files"
```

**ผล:** setup project ใหม่ใน 1 คำสั่ง — hooks + steering ครบ

---

### P5 — Memory Palace: Declare Global Path ใน AGENT.md

```markdown
## Memory

Global memory: ~/.memory/global/
Project memory: {project}/.memory/

Cross-project memory ใช้ global wing ใน ~/.memory/global/
```

Agent อ่าน AGENT.md แล้วรู้ memory path ทันที ไม่ต้องตั้งค่าแยก

---

## สรุป: Zero-Config Relocation

เมื่อย้าย skills folder จาก `~/.claude/skills/` ไป `~/ai-agent/` หรือที่อื่น:

1. **AGENT.md** — อยู่ใน folder ใหม่ → agent เจอ = รู้ว่านี่คือ skills root ✅
2. **STEERING_INDEX.md** — แก้ `SKILLS_ROOT:` บรรทัดเดียว ✅
3. **Hooks** — รัน `setup-kiro-project.sh` ใหม่ ✅
4. **KIRO.md / CLAUDE.md** — ชี้ไปที่ AGENT.md แทน hardcode path ✅
5. **Memory** — path อยู่ใน AGENT.md แก้ที่เดียว ✅

---

## Tasks

### Phase 1 — Foundation (ทำก่อน)

- [x] **P1.1** สร้าง `AGENT.md` ใน skills root — universal entry point ✅
- [x] **P1.2** เพิ่ม `SKILLS_ROOT` declaration ใน `STEERING_INDEX.md` ✅
- [x] **P1.3** แก้ KIRO.md §5-6 — เปลี่ยน `~/.claude/rules/` → path จริงใน skills ✅

### Phase 2 — Portability

- [x] **P2.1** แก้ steering templates ทุกตัว — ลบ hardcoded `~/.claude/rules/` ออก ใช้ relative reference แทน ✅
- [x] **P2.2** สร้าง `setup-kiro-project.sh` — 1 command setup hooks + steering ✅
- [x] **P2.3** เพิ่ม Memory Palace global path + structure ใน AGENT.md ✅

### Phase 3 — Hooks Redesign (มี TODO อยู่แล้ว)

ดู `VitProjects/.kiro/hooks/TODO-hooks-redesign.md` — แก้ปัญหาที่พบจากการใช้งานจริง:

- [x] **P3.1** แก้ `aidlc-prerequisites` hook — เพิ่ม path filter + pattern matching ✅ (v3.0.0 ทำไปแล้วก่อนหน้า)
- [x] **P3.2** รวม test hooks — `run-tests-after-ai-write` (postToolUse, AI write) + `run-tests-on-save` (fileEdited, user save) ทำงานคู่กัน ✅
- [x] **P3.3** ลบ `run-tests-after-write` v1 (disabled, ซ้ำซ้อน) ออกจาก VitProjects ✅

---

## Skills ที่ต้องถูก Discover ครบ

AGENT.md และ STEERING_INDEX.md ต้องครอบคลุม skills ทุกตัวต่อไปนี้ — ไม่มีตัวไหนหลุด:

### system/ — Cross-project tools

| Skill | Path | ต้องรู้เพราะ |
|-------|------|------------|
| `memory-palace` | `system/memory-palace/` | cross-session memory ทุก project |
| `hook-creator` | `system/hook-creator/` | สร้าง/จัดการ hooks |
| `knowledge-evolution` | `system/knowledge-evolution/` | feedback loop สำหรับ knowledge base — **ต้องถูก discover เพื่อให้ agent รู้ว่ามี scoring + routing + auto-consolidation** |
| `ai-techniques` | `system/ai-techniques/` | CoT, LATS, AoT |
| `analysis-concept` | `system/analysis-concept/` | reusable analysis patterns |
| `skill-creator` | `system/skill-creator/` | สร้าง/ปรับปรุง skills |

### knowledge-evolution — ต้องการ special mention

`knowledge-evolution` ไม่ใช่แค่ skill ธรรมดา — มันเป็น **meta-skill** ที่ทำให้ knowledge base ทั้งหมดดีขึ้นเรื่อยๆ

ถ้า agent ไม่รู้ว่ามี skill นี้:
- ไม่ update utility scores หลัง test run
- ไม่ auto-capture lessons จาก failures
- ไม่ route ไปหา templates ที่ดีที่สุด

ดังนั้น AGENT.md ต้องระบุ knowledge-evolution แยกชัดเจน ไม่ใช่แค่รวมใน system/ table

---

## ไม่ทำ (Out of Scope)

- Global hooks สำหรับ Kiro — Kiro architecture ไม่รองรับ per-user global hooks
- Auto-sync steering เมื่อ skills เปลี่ยน — ซับซ้อนเกินไป ใช้ setup script แทน
- Dynamic path resolution ใน steering — Kiro ไม่รองรับ variable substitution ใน front-matter
