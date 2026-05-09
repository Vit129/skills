# scripts/setup — Setup Scripts

Scripts สำหรับ bootstrap project ใหม่ให้พร้อมใช้งานกับ AI

## 🚀 เริ่มต้นที่นี่ — Main Entry Point

```bash
bash <SCRIPTS_DIR>/setupAgentSkills.sh <PROJECT_FOLDER>
```

> `<SCRIPTS_DIR>` = path ไปที่ folder นี้ เช่น `~/.claude/skills/scripts/setup` หรือ `ai-agent/scripts/setup`

**`setupAgentSkills.sh` คือ main script** — รันตัวเดียว แล้วมันจะถามทีละขั้น:

1. ✅ `setupMemory.sh` — สร้าง `agent-memory/` (รันอัตโนมัติ ไม่ถาม)
2. ❓ `setupKiro.sh` — setup `.kiro/` hooks + steering (ถามก่อน)
3. ❓ `setupTests.sh` — bootstrap `tests/` API/Web/Mobile (ถามก่อน)
4. ❓ `postmanToPlaywright.sh` — copy postman migration skill (ถามก่อน)

> ไม่ต้องรัน script แยกทีละตัว ใช้ `setupAgentSkills.sh` ตัวเดียวพอ
> แต่ถ้าอยากรันแค่บางตัว ก็รันแยกได้เสมอ

## Scripts ทั้งหมด

| Script | บทบาท |
|--------|--------|
| `setupAgentSkills.sh` | **⭐ Main** — wrapper ถามทีละขั้น เรียกทุก script |
| `setupMemory.sh` | สร้าง `agent-memory/` (memory.md, playbook.md, skill-log.md) |
| `setupKiro.sh` | setup `.kiro/` hooks, steering, MCP config |
| `setupTests.sh` | bootstrap `tests/` COE structure (API/Web/Mobile) |
| `postmanToPlaywright.sh` | copy postman migration skill ไปยัง project |
| `setupCodexSkills.sh` | expose skills ให้ Codex (รันแยก ไม่อยู่ใน flow) |
| `_resolveTarget.sh` | helper: resolve target folder (ใช้ภายใน) |

## วิธีใช้

```bash
# แนะนำ: รัน main script ตัวเดียว แล้วตอบ y/N ตามต้องการ
bash <SCRIPTS_DIR>/setupAgentSkills.sh MyProject

# หรือรันแยกเฉพาะตัวที่ต้องการ
bash <SCRIPTS_DIR>/setupMemory.sh MyProject
bash <SCRIPTS_DIR>/setupKiro.sh MyProject
bash <SCRIPTS_DIR>/setupTests.sh MyProject
bash <SCRIPTS_DIR>/postmanToPlaywright.sh MyProject
```

## ใช้กับ Codex (แยกต่างหาก ไม่อยู่ใน flow)

```bash
bash <SCRIPTS_DIR>/setupCodexSkills.sh
```

> ⚠️ `setupCodexSkills.sh` ไม่ได้ copy ไปกับ project — รันจาก source โดยตรง
