# scripts/setup — Setup Scripts

Scripts สำหรับ bootstrap project ใหม่ให้พร้อมใช้งานกับ AI

## Scripts

| Script | ใช้เมื่อ | Command |
|--------|---------|---------|
| `setupAgentSkills.sh` | Bootstrap agent context layer ให้ project ใหม่ | `bash setupAgentSkills.sh <PROJECT_FOLDER>` |
| `setupKiro.sh` | Setup Kiro IDE config (.kiro/, steering, hooks) | `bash setupKiro.sh <PROJECT_FOLDER>` |
| `setupMemory.sh` | Init .unified-memory/ สำหรับ Memory Palace | `bash setupMemory.sh <PROJECT_FOLDER>` |
| `setupTests.sh` | Bootstrap COE QA test structure (API/Web/Mobile) | `bash setupTests.sh <PROJECT_FOLDER>` |
| `postmanToPlaywright.sh` | Copy postman migration skill ไปยัง project | `bash postmanToPlaywright.sh <PROJECT_FOLDER>` |
| `_resolveTarget.sh` | Helper: resolve target folder (ใช้ภายใน) | — |

## วิธีใช้ทั่วไป

```bash
# รันจาก ~/.claude/skills/scripts/setup/
bash setupAgentSkills.sh MyProject

# หรือระบุ full path
bash ~/.claude/skills/scripts/setup/setupTests.sh MyProject
```

> ⚠️ Scripts ทุกตัวรับ `<PROJECT_FOLDER>` เป็น argument — ค้นหา folder อัตโนมัติถ้าไม่ระบุ full path

## ลำดับการ setup project ใหม่

```
1. setupAgentSkills.sh   ← agent context (.kiro/, .unified-memory/, KIRO.md)
2. setupTests.sh         ← QA test structure (API/Web/Mobile)
3. postmanToPlaywright.sh ← (optional) ถ้าต้องการ migrate Postman
```
