# postman-to-playwright

Skill สำหรับ migrate Postman collection → Playwright API tests

## วิธีใช้

1. Copy skill ไปยัง project ก่อน:
   ```bash
   bash ~/.claude/skills/scripts/setup/postmanToPlaywright.sh <PROJECT_FOLDER>
   ```

2. ทำตาม workflow ใน `postman/SKILL.md`:
   - Step 1+2: รัน scripts → ได้ `collection.md` + `env.md`
   - Step 2.5: AI ออกแบบ structure → user approve
   - Step 3: AI generate Playwright files ทีละ folder
   - Step 4: User รัน tests → AI fix failures

> ดูรายละเอียดทั้งหมดใน `postman/SKILL.md`

## Structure

```
postman-to-playwright/
└── postman/
    ├── SKILL.md              ← AI workflow guide (4 steps)
    ├── references/
    │   ├── fix-generated-files.md   ← 32 Postman→Playwright patterns
    │   ├── progress-template.md     ← Migration progress tracker
    └── scripts/
        ├── readPostmanCollection.ts ← Step 1: JSON → Markdown IR
        ├── readPostmanEnv.ts        ← Step 2: env JSON → Markdown
        └── tsconfig.json
```

## Prerequisites

- Node.js v18+
- `npm install @inquirer/prompts` (ใน project ที่จะ migrate)
