---
name: postman
description: >
  Activate when user says "convert Postman to Playwright", "migrate Postman",
  "analyze Postman collection/environment", "generate Playwright from Postman",
  "fix URL placeholders", "add auth header", "postmanMigrate", or "run all steps".
---

# Postman → Playwright Migration

Pipeline: scripts analyze JSON → Markdown IR, then AI generates Playwright code per folder.

Always read the `playwright-rules` skill before writing or reviewing any generated Playwright code.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "migrate Postman", "run scripts", "analyze collection", "postmanMigrate" | `scripts/POSTMAN_README.md` |
| "generate Playwright", "convert folder", "write tests from collection.md" | `references/fix-generated-files.md` + `playwright-rules/references/api.md` + `playwright-testing/references/workflow.md` |
| "missing data", "data check", "what's missing from export" | `references/migration-steps.md` |
| "fix URL", "add auth", "stateStore", "polling", "pm.sendRequest" | `references/fix-generated-files.md` |
| "review code", "run tests", "fix failures" | `playwright-testing/references/playwright-code-review.md` + `playwright-testing/references/workflow.md` |

## Migration Flow

```text
Step 1+2:   USER runs script in terminal → produces collection.md + env.md
            AI prepares the exact command with correct paths — USER copies and runs it
            (Read scripts/POSTMAN_README.md for command format)
Step 2.5:   AI reads summary sections → ออกแบบ structure → ถาม user approve
            (Auth, shared services, stateStore, file tree)
Step 3:     AI generates Playwright files per folder
            (Read references below)
Step 4:     USER runs tests in terminal → AI fixes failures
```

## Step 2.5: AI ออกแบบ Structure (ก่อน generate)

หลังได้ `.md` แล้ว AI อ่านแค่ 2 summary sections — ไม่ต้องอ่าน MD ทั้งหมด:

**จาก `collection.md`** → `## 🏗️ Structure Summary`
- Auth Strategy — type + recommendation (Basic/Bearer/OAuth2)
- Top-Level Folders — list ทุก folder
- Shared Patterns — request names ที่ซ้ำกันข้าม folders → ควรเป็น shared Service
- Cross-Folder State — vars ที่ set ใน folder หนึ่ง ใช้ใน folder อื่น → global stateStore
- Runtime-Set Variables — vars ทั้งหมดที่ต้องใช้ stateStore (ไม่ใช่ process.env)
- Recommended File Structure — tree overview

**จาก `env.md`** → `## 🏗️ Env Summary`
- Base URLs — domain vars ที่ใช้ใน requests
- Secrets — vars ที่ต้อง fill manually (token, secretKey, accessToken)
- Runtime-set vars — vars ที่ set ตอน runtime (ใช้ stateStore)
- Empty vars — vars ที่ยังไม่มีค่า (ต้องถาม user)

AI เสนอ structure ให้ user approve ก่อน generate code ทีละ folder

## Step 3: AI Generation Rules

Before writing any Playwright code, AI must read:

1. `playwright-rules` → `references/api.md` (structure, AAA, assertions)
2. `playwright-testing` → `references/workflow.md` (folder structure, write→run cycle)
3. This skill → `references/fix-generated-files.md` (Postman→Playwright patterns)
4. This skill → `references/migration-steps.md` (data completeness check)

### Process

- Read one `## 📁 Folder:` section at a time from collection.md
- Read env.md for variable declarations
- Generate: `.spec.ts` + `Helper.ts` + `*Service.ts` + `Schema.ts` + `Data.ts`
- If missing data detected → ask user before generating

### Key Postman→Playwright Patterns

| Postman | Playwright |
|---------|------------|
| `{{var}}` | `` `${process.env['VAR_NAME']}` `` |
| `pm.expect()` | `expect()` (30+ mappings in fix-generated-files.md) |
| `pm.sendRequest` CPS | `await request.fetch()` async |
| `pm.environment.set()` | `stateStore['key']` (not `process.env`) |
| Auth inheritance | `beforeAll` + shared headers |
| `setNextRequest` | `test.describe.serial` + `test.skip` |

## Collection Size Rules

| Size | Strategy |
|------|----------|
| ≤ 300 requests | AI generates all folders in sequence |
| > 300 requests | AI generates one top-level folder at a time |

## ⚠️ Gotchas

- **Postman exports lack Current Values** — only "Initial Values" are exported. Secrets and runtime-set values will be empty. Always check with user.
- **`pm.environment.set()` chains** — requests that set variables used by later requests need `stateStore` + `test.describe.serial`, not `process.env`.
- **Auth inheritance missed** — Postman folder-level auth is invisible in request JSON. AI must check `resolveAuth` chain in collection.md.
- **`pm.sendRequest` in pre-request** — CPS callback pattern must be converted to async/await. Complex patterns need manual review.
