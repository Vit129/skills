---
name: postman
description: >
  Activate when user says "convert Postman to Playwright", "migrate Postman",
  "analyze Postman collection/environment", "generate Playwright from Postman",
  "fix URL placeholders", "add auth header", "postmanMigrate", or "run all steps".
---

# Postman → Playwright Migration

Pipeline: scripts analyze JSON → Markdown IR, then AI generates Playwright code per folder.

Always read the `ai-dlc/rules/playwright-rules/` skill before writing or reviewing any generated Playwright code.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "generate Playwright", "convert folder", "write tests from collection.md" | `references/fix-generated-files.md` + `ai-dlc/rules/playwright-rules/references/api.md` + `ai-dlc/qa/playwright-testing/references/workflow.md` |
| "fix URL", "add auth", "stateStore", "polling", "pm.sendRequest" | `references/fix-generated-files.md` |
| "review code", "run tests", "fix failures" | `ai-dlc/qa/playwright-testing/references/playwright-code-review.md` + `ai-dlc/qa/playwright-testing/references/workflow.md` |

---

## Migration Flow

```text
Step 1+2:   USER runs script in terminal → produces collection.md + env.md
Step 2.5:   AI reads summary sections → ออกแบบ structure → ถาม user approve
Step 3:     AI generates Playwright files per folder
Step 3.1:   Data Completeness Check (MANDATORY before generating)
Step 3.2:   Apply standard fixes (URL, auth, stateStore, fixtures)
Step 4:     USER runs tests in terminal → AI fixes failures
```

---

## Step 1+2: Run Scripts

> ⚠️ **USER runs this in terminal** — AI prepares the exact command with correct paths, then USER copies and runs it.

### Scripts

| # | Script | Input | Output |
|---|--------|-------|--------|
| 0 | `postmanMigrate.ts` | collection.json + env.json | Runs 1+2 in sequence |
| 1 | `readPostmanCollection.ts` | collection.json | `tests-api/<name>/collection.md` |
| 2 | `readPostmanEnv.ts` | environment.json | `tests-api/<name>/env.md` |

### One-Shot (recommended)

```bash
npx tsx {skills_root}/ai-dlc/qa/postman/scripts/postmanMigrate.ts \
  --collection "postman/collections/xxx.postman_collection.json" \
  --env "postman/environments/yyy.postman_environment.json"
```

| Flag | Required | Description |
|------|----------|-------------|
| `--collection` | ✅ | Path to `.postman_collection.json` |
| `--env` | ❌ | Path to `.postman_environment.json` |
| `--folder` | ❌ | Migrate one top-level folder only |
| `--output-dir` | ❌ | Override project root (default: cwd) |

### Run Separately

```bash
# Step 1: Analyze Collection
npx tsx {skills_root}/ai-dlc/qa/postman/scripts/readPostmanCollection.ts \
  "postman/collections/xxx.postman_collection.json"

# Step 2: Analyze Environment
npx tsx {skills_root}/ai-dlc/qa/postman/scripts/readPostmanEnv.ts \
  "postman/environments/yyy.postman_environment.json"
```

### Prerequisites

- Run from project root (e.g. `tests/api-testing/`)
- Scripts auto-detect `tests-api/` folder for output
- Step 1 must run before Step 2 (creates the folder Step 2 auto-detects)
- `@inquirer/prompts` must be installed (`npm install @inquirer/prompts`)


---

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

---

## Step 3: AI Generation Rules

Before writing any Playwright code, AI must read:

1. `ai-dlc/rules/playwright-rules/` → `references/api.md` (structure, AAA, assertions)
2. `playwright-testing` → `references/workflow.md` (folder structure, write→run cycle)
3. This skill → `references/fix-generated-files.md` (Postman→Playwright patterns)

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

### Collection Size Rules

| Size | Strategy |
|------|----------|
| ≤ 300 requests | AI generates all folders in sequence |
| > 300 requests | AI generates one top-level folder at a time |

---

## Step 3.1: Data Completeness Check (MANDATORY)

Before generating code, AI must analyze collection.md and env.md to identify values that couldn't be exported from Postman.

### Commonly Missing Data from Postman Exports

| Missing | Reason |
|---------|--------|
| **Current Values** | Postman only exports "Initial Values" — values active in the UI are NOT exported |
| **Secrets & Sensitive Data** | Passwords, API keys, client secrets are left blank for security |
| **Dynamic Variables** | Values set via `pm.environment.set()` are only exported if saved back to "Initial Values" |
| **Cookies** | Browser cookies managed by Postman are not included in environment exports |

### Look for

- Empty or placeholder auth tokens
- `{{variable}}` names that have no matching key in `env.md`
- Complex `Pre-request Script` logic (e.g., dynamic token generation, HMAC signing)
- `pm.environment.set()` calls that feed into later requests
- Missing base URLs or service endpoints

**Action:** List all missing/unclear items and **ASK THE USER** to provide them before proceeding to Step 3.2.

---

## Step 3.2: Standard Fixes

After user has confirmed missing data, AI applies these patterns when generating Playwright code.

> For exact patterns and 30+ code examples, read `references/fix-generated-files.md`.

### 1. URL Placeholders

Replace all Postman `{{var}}` syntax with template literals.

```typescript
// ❌ Generated
`{{user-service-url}}/api/v1/users`
// ✅ Fixed
`${process.env['user-service-url']}/api/v1/users`
```

### 2. Auth Header

Add `Authorization` header to every request. Missing auth is the most common cause of 401 failures.

```typescript
headers: {
  ...dynamicHeaders,
  'Authorization': `Bearer ${process.env['accessToken']}`,
}
```

### 3. Missing Fixtures

If `fixtures/` folder is empty, create a minimal fixture file:

```typescript
export const <folder>Data = {
  sit: { /* SIT environment test data */ },
  uat: { /* UAT environment test data */ },
}
```

### 4. Runtime State (stateStore)

Any `pm.environment.set('key', value)` must use `stateStore`, not `process.env`.

```typescript
// ❌ Wrong — process.env is read-only at runtime
process.env['ORDER_ID'] = responseJson.id
// ✅ Correct — stateStore for runtime-set values
const stateStore = (global as any).__stateStore ??= {}
stateStore['orderId'] = responseJson.id
```

> ⚠️ Never use `process.env` for values shared between requests at runtime — use `stateStore` only.

---

## ⚠️ Gotchas

- **Postman exports lack Current Values** — only "Initial Values" are exported. Secrets and runtime-set values will be empty. Always check with user.
- **`pm.environment.set()` chains** — requests that set variables used by later requests need `stateStore` + `test.describe.serial`, not `process.env`.
- **Auth inheritance missed** — Postman folder-level auth is invisible in request JSON. AI must check `resolveAuth` chain in collection.md.
- **`pm.sendRequest` in pre-request** — CPS callback pattern must be converted to async/await. Complex patterns need manual review.
- **Script hangs on interactive select** — if multiple folders exist in `tests-api/`, script prompts for selection. Use `--folder` flag to skip.
- **Spaces in file paths** — wrap paths in quotes: `--collection "path with spaces/file.json"`
