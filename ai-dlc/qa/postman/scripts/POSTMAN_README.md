# Scripts Maintenance Guide (Postman Migration)

> **Description:** A guide for maintaining and utilizing scripts for automated Postman-to-Playwright migration.
> **Target Audience:** AI Agents & Developers
> **🔄 Last Update:** 2026-06-10 (v6.2)
> **Philosophy:** "Zero Data Loss & Path Consistency" — Ensuring every bit of logic is preserved and correctly structured.

---

## 📂 Overview

This folder contains the core scripts for **AI-Enhanced Postman Migration**:

1. `readPostmanCollection.ts`: Reads Collections → Arrow key folder selection → Generates Markdown + Playwright snippets + Nested describe tree.
2. `readPostmanEnv.ts`: Reads Environments → Arrow key collection folder selection → Generates Markdown analysis + `.env` snippets.
3. `postmanMdToPlaywright.ts`: Reads Markdown output from steps 1+2 → Generates ready-to-run `.spec.ts` + `Helper.ts` + `Data.ts` fixture files.
4. `postmanDebtAnalyzer.ts`: Analyzes generated output for technical debt → Reports HIGH/MEDIUM/LOW issues mapped to skill principles → Outputs DbService stub + Spec lifecycle stub.

---

## 🏗️ Core Features (v6.0)

- **Arrow Key Selection:** Interactive folder/environment selection using `@inquirer/prompts` (↑↓ arrow keys).
- **PASS 1 — Execution Graph:** `buildExecutionGraph()` analyzes `setNextRequest` flow across the entire collection before generating snippets.
- **PASS 1 — State Dependency Analysis:** `analyzeStateDependencies()` detects race condition risks in parallel execution and maps affected vars to `stateStore`.
- **PASS 1 — Auth Inheritance:** `resolveAuth()` walks up the folder chain to inherit auth from parent folders or collection level.
- **PASS 2 — VarRegistry:** Normalizes variable names and detects collisions (e.g. `my-var` and `my.var` both → `my_var`).
- **PASS 3 — CPS → Async/Await:** `transformSendRequest()` converts `pm.sendRequest(config, callback)` to `await request.fetch()`.
- **PASS 4 — Response Type Detection:** `detectResponseType()` avoids hardcoding `.json()` — detects JSON/text/none/unknown per request.
- **Collection Variables Section:** Lists all collection variables with type classification and extracts function vars to `CollectionHelpers` blueprint.
- **Env Variables Section:** Lists all required env vars with `.env` snippet + `process.env` declarations + machine-readable `used-vars` block.
- **Nested Describe Tree:** Generates a full `describe()` tree mirroring the Postman folder structure at the end of the MD file.
- **9-Type Env Detection:** `readPostmanEnv` detects URL / TOKEN / OBJECT / ARRAY / NUMBER / BOOLEAN / DYNAMIC / EMPTY / TEXT.
- **`--used-vars` Filter:** Pass vars from collection's machine-readable block to filter only relevant env vars.
- **Safe urlencoded parse:** `transformSendRequest()` uses `JSON.parse()` (not `eval()`) to parse urlencoded arrays from Postman scripts.
- **Correct btoa/atob:** `btoa(x)` → `Buffer.from(x).toString('base64')`, `atob(x)` → `Buffer.from(x, 'base64').toString()`.
- **Env error guidance:** `readPostmanEnv` shows expected path + usage hint when `tests-api/` folder is missing.

---

## 🏗️ Core Features (v6.2)

- **Technical Debt Analyzer:** `postmanDebtAnalyzer.ts` runs automatically after `postmanMdToPlaywright.ts` generates files — reports issues before the `y/v/n` prompt.
- **Skill-Mapped Checks:** Every issue is tagged with its source skill and rule reference (e.g., `architect-skills / api.md PART 6`, `architect-skills/db-strategy — Step 2.5`).
- **22 MEDIUM + 6 HIGH checks** covering: testId lifecycle, seedAll orchestration, AJV Schema, Multi-Service Architecture, SLA assertions, self-healing evidence (`test.info().attach`), serial mode, DbConfig.ts, Schema Consistency API↔DB, and more.
- **Auto Stubs:** Analyzer outputs ready-to-use `DbService` stub and `Spec lifecycle` stub (beforeEach/afterEach) when DB issues are detected.
- **CWE-117 Safe:** All `console.log` outputs in the analyzer pass through `sanitize()` to prevent log injection.

---

## ⚙️ Prerequisites

All scripts require the `--project` flag pointing to the `tsconfig.json` in this folder:

```bash
# tsconfig.json location: skills/postman/scripts/tsconfig.json
# Uses module: CommonJS so ts-node can run without the --esm flag
```

> ⚠️ Without `--project`, you will get: `ReferenceError: __dirname is not defined in ES module scope`

---

## 🚀 Usage

### 1. Migrating a Collection

```bash
npx ts-node --project skills/postman/scripts/tsconfig.json \
  skills/postman/scripts/readPostmanCollection.ts "<collection.json>" --output "<output-dir>"
```

- Arrow key prompt to select a folder (or convert all)
- Optional: `--folder <folder_name>` to skip the prompt

**Example:**
```bash
npx ts-node --project skills/postman/scripts/tsconfig.json \
  skills/postman/scripts/readPostmanCollection.ts \
  "tests/api-testing/postman/collections/MyCollection.postman_collection.json" \
  --output tests/api-testing/tests-api
```

*Output:* `<output-dir>/<collection-name-kebab>/<folder-name-camel>.md`

---

### 2. Migrating an Environment

```bash
npx ts-node --project skills/postman/scripts/tsconfig.json \
  skills/postman/scripts/readPostmanEnv.ts "<environment.json>"
```

- Arrow key prompt to select which collection folder to place the env file in
- Optional: `--output <dir>` to skip auto-detection
- Optional: `--collection <folder-name>` to skip the folder prompt
- Optional: `--used-vars <comma-separated>` to filter only vars used by the collection

**Example:**
```bash
npx ts-node --project skills/postman/scripts/tsconfig.json \
  skills/postman/scripts/readPostmanEnv.ts \
  "tests/api-testing/postman/environments/MyEnv.postman_environment.json"
```

*Output:* `tests-api/<collection-folder>/<envName-camelCase>.md` + `.env.example`

---

### 4. Analyzing Technical Debt

`postmanDebtAnalyzer.ts` runs **automatically** inside `postmanMdToPlaywright.ts` — no separate command needed.

The report appears after file generation, before the `y/v/n` confirmation prompt:

```
═══════════════════════════════════════════════════════
⚠️  Technical Debt Report: <systemName>
═══════════════════════════════════════════════════════
   🔴 HIGH: X  🟡 MEDIUM: X  🟢 LOW: X
───────────────────────────────────────────────────────
🔴 [databaseStrategySkill — Safety Net / Rollback]
   ไม่มี testId lifecycle — ถ้า test crash ข้อมูลจะค้างใน DB
   → เพิ่ม DbService stub + beforeEach/afterEach (ดู stubs ด้านล่าง)
...
📋 DbService Stub:
📋 Spec Lifecycle Stub:
═══════════════════════════════════════════════════════
```

Review issues → fix before writing files → press `y` to confirm.

---

```bash
npx ts-node --project skills/postman/scripts/tsconfig.json \
  skills/postman/scripts/postmanMdToPlaywright.ts \
  --input "<tests-api/collection-folder>" \
  --env-input "<tests-api/collection-folder/env.md>" \
  --output-dir "<project-root>"
```

- `--input`: path to collection `.md` file or folder containing it
- `--env-input`: path to env `.md` from `readPostmanEnv` (optional but recommended)
- `--output-dir`: project root where `tests-api/`, `helpers/`, `fixtures/` will be written

*Output:*
- `tests-api/<folder>/<name>.spec.ts`
- `helpers/<folder>/<name>Helper.ts`
- `fixtures/<folder>/<name>Data.ts`
- `helpers/core/CollectionHelpers.ts` (if collection has function vars)

---

## 🔗 Connecting Collection → Environment

After running `readPostmanCollection.ts`, the output MD contains a machine-readable block:

```
## 🔗 Used Variables (Machine-Readable)
\`\`\`used-vars
cmm_domain,token,currentDate,...
\`\`\`
```

Pass this to `readPostmanEnv.ts` to filter only relevant vars:

```bash
npx ts-node readPostmanEnv.ts "<env.json>" --used-vars "cmm_domain,token,currentDate"
```

---

## 📊 Output Report Glossary

After `postmanMdToPlaywright.ts` runs, it prints a summary before generating files:

```
=========================================
🤖 <systemName>
=========================================
   Test blocks   : 5
   Data-driven   : 2
   Serial        : 1
   Iteration keys: userId, token
```

| Field | Description |
|---|---|
| **Test blocks** | Number of `test('...', async () => {...})` blocks parsed from the collection MD — each block maps to 1 Postman request |
| **Data-driven** | Number of test blocks where `pm.iterationData.get()` or a `data.` pattern was detected — these are generated as `for...of` loops iterating over the `iterationData` array in the fixture |
| **Serial** | Number of test blocks containing `stateStore` or `setNextRequest` — these are wrapped with `test.describe.serial` to enforce sequential execution instead of parallel |
| **Iteration keys** | Key names extracted from `pm.iterationData.get('key')` — used to generate the `interface IterationRow` and the `iterationData` array in the fixture for you to fill in later |

### Inline Warnings in Generated Files

Beyond console output, the script embeds warning comments directly in the generated files for developers to review during code review:

| Comment | Meaning |
|---|---|
| `// ⚡ [CPS→ASYNC] pm.sendRequest converted` | `pm.sendRequest` was automatically converted to `await request.fetch()` — verify the logic is complete |
| `// ⚠️ [MANUAL] pm.sendRequest — complex pattern` | Pattern is too complex to auto-convert — requires manual migration |
| `// ⚠️ [CONTROL_FLOW] setNextRequest(...)` | `setNextRequest` detected — verify the `test.step` order manually |
| `// ⚠️ [DANGER] eval() detected` | `eval()` found in CollectionHelpers — must be refactored before use |
| `// 🚨 ACTION REQUIRED: Logic refactor needed` | Contains loops/mutations the AI could not convert — requires manual fix |
| `// 💡 [KB] Auth/File/Validation hint` | Knowledge Base recommends a helper to use instead |
| `// ⚠️ MISSING: varName — run readPostmanEnv` | Collection uses this variable but no env declaration was found — run `readPostmanEnv` |
| `// 📊 [DATA_DRIVEN] for...of loop` | This test iterates over the `iterationData` array in the fixture |
| `// ⚠️ PARALLEL RISK: use stateStore` | Contains shared state — must not run in parallel, use `test.describe.serial` |

---

## 🚨 Do's & Don'ts

✅ **Do's:**

- Use `--folder <name>` to skip the arrow key prompt in CI/CD pipelines.
- Review the **🚨 Validation Issues** section before writing test code.
- Use the generated `CollectionHelpers` blueprint for `eval()` and inline function logic.
- Use `stateStore` (not `process.env`) for vars flagged as **PARALLEL RISK**.

❌ **Don'ts:**

- Do not provide a `.md` filename in `--output`; the script handles naming automatically.
- Do not ignore `pm.sendRequest` warnings — these require manual refactoring.
- Do not use `process.env` for runtime-set variables shared across requests.
