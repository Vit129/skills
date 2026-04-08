# Scripts Maintenance Guide (Postman Migration)

> **Description:** A guide for maintaining and utilizing scripts for automated Postman-to-Playwright migration.
> **Target Audience:** AI Agents & Developers
> **🔄 Last Update:** 2026-04-08 (v6.2)
> **Philosophy:** "Zero Data Loss & Path Consistency" — Ensuring every bit of logic is preserved and correctly structured.

---

## 📂 Overview

This folder contains the core scripts for **AI-Enhanced Postman Migration**:

1. `readPostmanCollection.ts`: Reads Collections → Arrow key folder selection → Generates Markdown + Playwright snippets + Nested describe tree.
2. `readPostmanEnv.ts`: Reads Environments → Arrow key collection folder selection → Generates Markdown analysis + `.env` snippets.
3. `postmanMdToPlaywright.ts`: Reads Markdown output from steps 1+2 → Generates `.spec.ts` + `Helper.ts` + `Service.ts` + `Schema.ts` + `Data.ts`. Reads folder structure from `workflow.md` automatically.
4. `postmanToPlaywrightRunAndHeal.ts`: Runs generated Playwright tests + auto-heal fix loop (max 3–5 attempts) + writes Reflexion Log to `audit.md`.

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

## 🔄 Script 4: postmanToPlaywrightRunAndHeal.ts — Run + Auto-Heal Fix Loop

Runs Playwright tests and automatically attempts to fix code failures in a loop (max 3–5 attempts). Appends a Reflexion Log to `audit.md` after each run.

### Usage

```bash
npx ts-node --project ~/.claude/skills/ai-dlc/qa/postman/scripts/tsconfig.json \
  ~/.claude/skills/ai-dlc/qa/postman/scripts/postmanToPlaywrightRunAndHeal.ts \
  --spec "<path/to/spec.ts or tests-api/folder>" \
  [--config "<playwright.config.ts>"] \
  [--max-attempts 3] \
  [--audit "<path/to/audit.md>"] \
  [--reporter line|json|dot]
```

### Parameters

| Flag | Required | Default | Description |
|------|----------|---------|-------------|
| `--spec` | ✅ | — | Path to spec file or folder |
| `--config` | ❌ | auto-detect | Playwright config file |
| `--max-attempts` | ❌ | `3` | Max heal attempts (capped at 5) |
| `--audit` | ❌ | `<spec-dir>/audit.md` | Reflexion Log output path |
| `--reporter` | ❌ | `line` | Console reporter style |

### Auto-Heal Patterns

| Fix Type | Trigger | Action |
|----------|---------|--------|
| `timeout_selector` | `Timeout waiting for` | Adds `test.setTimeout(60_000)` |
| `null_response` | `Cannot read prop of undefined` | Wraps `response.json()` with null guard |
| `http_error` | `status 4xx/5xx` | Adds hint comment to check env/mock |
| `missing_import` | `Cannot find module` | Adds install hint comment at top |
| `assertion_failed` | `Expected ... received` | Adds `await response.finished()` before assertion |

### Failure Classification

- **ENV failures** (ECONNREFUSED, 502/503/504, VPN) → skipped, not retried
- **CODE failures** → auto-fix attempted, re-run triggered
- If >80% pass rate → extends to 5 attempts automatically

### Reflexion Log Format

Appended to `audit.md` after each run:

```
## <timestamp> | Spec: <spec-name>
### Attempt 1 — PARTIAL
- 📊 Total: 5 | ✅ Passed: 4 | ❌ Failed: 1
#### 🔧 CODE FIX: [TC-0001] Login API
- ❌ Symptom: Timeout waiting for selector
- 💊 Applied Fix: `timeout_selector`
- 📊 Impact: Isolated
```

---

## ⚙️ Prerequisites

All scripts require the `--project` flag pointing to the `tsconfig.json` in this folder:

```bash
# tsconfig.json location: ~/.claude/skills/ai-dlc/qa/postman/scripts/tsconfig.json
# Uses module: CommonJS so ts-node can run without the --esm flag
```

> ⚠️ Without `--project`, you will get: `ReferenceError: __dirname is not defined in ES module scope`

---

## 🚀 Usage

> All commands use `~/.claude/skills/ai-dlc/qa/postman/scripts/` as the script root.

### 1. Migrating a Collection

```bash
npx ts-node --project ~/.claude/skills/ai-dlc/qa/postman/scripts/tsconfig.json \
  ~/.claude/skills/ai-dlc/qa/postman/scripts/readPostmanCollection.ts "<collection.json>" --output "<output-dir>"
```

- Arrow key prompt to select a folder (or convert all)
- Optional: `--folder <folder_name>` to skip the prompt

**Example:**

```bash
npx ts-node --project ~/.claude/skills/ai-dlc/qa/postman/scripts/tsconfig.json \
  ~/.claude/skills/ai-dlc/qa/postman/scripts/readPostmanCollection.ts \
  "Automation/tests/api-testing/postman/collections/Credit Management TS.postman_collection.json" \
  --output Automation/tests/api-testing/tests-api
```

*Output:* `<output-dir>/<collection-name-kebab>/<folder-name-camel>.md`

---

### 2. Migrating an Environment

```bash
npx ts-node --project ~/.claude/skills/ai-dlc/qa/postman/scripts/tsconfig.json \
  ~/.claude/skills/ai-dlc/qa/postman/scripts/readPostmanEnv.ts "<environment.json>"
```

- Arrow key prompt to select which collection folder to place the env file in
- Optional: `--output <dir>` to skip auto-detection
- Optional: `--collection <folder-name>` to skip the folder prompt
- Optional: `--used-vars <comma-separated>` to filter only vars used by the collection

**Example:**

```bash
npx ts-node --project ~/.claude/skills/ai-dlc/qa/postman/scripts/tsconfig.json \
  ~/.claude/skills/ai-dlc/qa/postman/scripts/readPostmanEnv.ts \
  "Automation/tests/api-testing/postman/environments/CMM_dev.postman_environment 5.json"
```

*Output:* `tests-api/<collection-folder>/<envName-camelCase>.md` + `.env.example`

---

### 3. Generate Playwright Files

```bash
npx ts-node --project ~/.claude/skills/ai-dlc/qa/postman/scripts/tsconfig.json \
  ~/.claude/skills/ai-dlc/qa/postman/scripts/postmanMdToPlaywright.ts \
  --input "<tests-api/collection-folder>" \
  --env-input "<tests-api/collection-folder/env.md>" \
  --output-dir "<project-root>"
```

- `--input`: path to collection `.md` file or folder containing it
- `--env-input`: path to env `.md` from `readPostmanEnv` (optional but recommended)
- `--output-dir`: project root where output folders will be written

*Output:*

- `tests-api/<folder>/<name>.spec.ts`
- `helpers/<folder>/<name>Helper.ts`
- `helpers/<folder>/<name>Service.ts` (1 per label group)
- `schemas/<folder>/<name>Schema.ts` ← AJV skeleton
- `fixtures/<folder>/<name>Data.ts`
- `helpers/core/CollectionHelpers.ts` (if collection has function vars)

> Folder names (`tests-api/`, `helpers/`, etc.) are auto-detected from `workflow.md` if available.

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
