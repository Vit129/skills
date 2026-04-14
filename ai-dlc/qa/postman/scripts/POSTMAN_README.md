# Scripts Maintenance Guide (Postman Migration)

> **Description:** A guide for maintaining and utilizing scripts for automated Postman-to-Playwright migration.
> **Target Audience:** AI Agents & Developers
> **🔄 Last Update:** 2026-04-09 (v7.3)
> **Philosophy:** "Markdown as IR (Intermediate Representation)" — Collection→MD→Playwright, summary for audit.

---

## 📂 Overview

This folder contains the core scripts for **AI-Enhanced Postman Migration**:

1. `readPostmanCollection.ts`: Reads Collection JSON → generates analysis Markdown (`.md`). **`--output` is optional** — auto-detects `tests-api/<collection-name>/`.
2. `readPostmanEnv.ts`: Reads Environment JSON → generates Markdown analysis + `.env` snippets. **`--output` is optional** — interactive select from `tests-api/` folders.
3. `postmanMdToPlaywright.ts`: **Main code generator** — reads Markdown → generates `.spec.ts` + `Helper.ts` + `Service.ts` + `Schema.ts` + `Data.ts`. **`--input` is optional** — auto-detects from `tests-api/`.
4. `postmanToPlaywrightRunAndHeal.ts`: Runs generated Playwright tests + auto-heal fix loop + writes Reflexion Log.

### Architecture (v7.3)

```text
Collection.json ──→ readPostmanCollection.ts ──→ tests-api/<name>/collection.md
                                                       │
Environment.json ─→ readPostmanEnv.ts ─────────→ tests-api/<name>/env.md
                                                       │
                                                       ▼
                                            postmanMdToPlaywright.ts --skeleton
                                                       │
                                         (auto-split per ## 📁 Folder header)
                                                       │
                                    ┌──────────────────┼──────────────────┐
                                    ▼                  ▼                  ▼
                              folder1/             folder2/           folder3/
                              ├── .spec.ts         ├── .spec.ts       ├── .spec.ts
                              ├── Helper.ts        ├── Helper.ts      ├── Helper.ts
                              ├── *Service.ts      ├── *Service.ts    ├── *Service.ts
                              ├── Schema.ts        ├── Schema.ts      ├── Schema.ts
                              └── Data.ts          └── Data.ts        └── Data.ts
```

---

## 🚀 Usage

### Step 1: Analyze Collection → Markdown

```bash
npx ts-node --project {skills_root}/ai-dlc/qa/postman/scripts/tsconfig.json \
  {skills_root}/ai-dlc/qa/postman/scripts/readPostmanCollection.ts \
  "<collection.json>"
# --output is optional: auto-detects tests-api/<collection-kebab-name>/
```

### Step 2: Analyze Environment (optional)

```bash
npx ts-node --project {skills_root}/ai-dlc/qa/postman/scripts/tsconfig.json \
  {skills_root}/ai-dlc/qa/postman/scripts/readPostmanEnv.ts \
  "<environment.json>"
# --output is optional: interactive select from tests-api/ folders
```

### Step 3: Generate Playwright from Markdown

```bash
npx ts-node --project {skills_root}/ai-dlc/qa/postman/scripts/tsconfig.json \
  {skills_root}/ai-dlc/qa/postman/scripts/postmanMdToPlaywright.ts \
  [--input "<collection.md or directory>"] \
  [--env-input "<env.md>"] \
  [--output-dir "<project-root>"] \
  [--skeleton] \
  [--no-split]
```

**Parameters:**

| Flag            | Required | Default      | Description                                        |
| --------------- | -------- | ------------ | -------------------------------------------------- |
| `--input`       | ❌       | auto-detect  | Collection markdown file or directory              |
| `--env-input`   | ❌       | —            | Environment markdown from readPostmanEnv           |
| `--output-dir`  | ❌       | `cwd`        | Project root for output                            |
| `--skeleton`    | ❌       | off          | Generate compile-safe skeletons (TODO assertions)  |
| `--no-split`    | ❌       | off          | Disable auto-split (legacy single-file mode)       |
| `--spec-dir`    | ❌       | `tests-api`  | Spec output directory name                         |
| `--helper-dir`  | ❌       | `helpers`    | Helper output directory name                       |
| `--schema-dir`  | ❌       | `schemas`    | Schema output directory name                       |
| `--fixture-dir` | ❌       | `fixtures`   | Fixture output directory name                      |

**Example (minimal — all auto-detect):**

```bash
# Run from project root (e.g. tests/api-testing/)

# Step 1
npx ts-node --project {skills_root}/ai-dlc/qa/postman/scripts/tsconfig.json \
  {skills_root}/ai-dlc/qa/postman/scripts/readPostmanCollection.ts \
  "postman/collections/MyCollection.postman_collection.json"

# Step 2
npx ts-node --project {skills_root}/ai-dlc/qa/postman/scripts/tsconfig.json \
  {skills_root}/ai-dlc/qa/postman/scripts/readPostmanEnv.ts \
  "postman/environments/MyEnv.postman_environment.json"

# Step 3 — skeleton mode, auto-detect input
npx ts-node --project {skills_root}/ai-dlc/qa/postman/scripts/tsconfig.json \
  {skills_root}/ai-dlc/qa/postman/scripts/postmanMdToPlaywright.ts \
  --skeleton
```

**Output (auto-split per top-level folder):**

```
tests-api/<collection-name>/<folder-kebab>/
  ├── <folderCamel>.spec.ts
helpers/<collection-name>/<folder-kebab>/
  ├── <folderCamel>Helper.ts
  └── <subFolder>Service.ts   (1 per sub-folder)
fixtures/<collection-name>/<folder-kebab>/
  └── <folderCamel>Data.ts
schemas/<collection-name>/<folder-kebab>/
  └── <folderCamel>Schema.ts
helpers/core/CollectionHelpers.ts  (shared, written once)
```

### Step 4: Run + Auto-Heal

```bash
npx ts-node --project {skills_root}/ai-dlc/qa/postman/scripts/tsconfig.json \
  {skills_root}/ai-dlc/qa/postman/scripts/postmanToPlaywrightRunAndHeal.ts \
  --spec "<path/to/spec.ts or tests-api/folder>" \
  [--config "<playwright.config.ts>"] \
  [--max-attempts 3] \
  [--audit "<audit.md>"]
```

---

## 🏗️ Core Features (v7.3)

- **Markdown IR Pipeline:** Collection JSON → Markdown analysis → Playwright code (2-step, auditable).
- **Auto-Split:** Detects `## 📁 Folder:` headers → generates 1 spec + services per top-level folder.
- **Skeleton Mode (`--skeleton`):** Generates compile-safe output with TODO assertions — dev fills later.
- **Auto-Detect Paths:** All 3 scripts detect `tests-api/` automatically — no path flags required.
- **Multi-Service Architecture:** One `*Service.ts` per sub-folder label, `*Helper.ts` as entry point composer.
- **CPS→Async/Await:** `pm.sendRequest(config, callback)` → `await request.fetch()` (brace-safe parser).
- **Chai→Playwright:** 40+ assertion transforms (`pm.expect` → `expect`, `.to.be.eql` → `.toEqual`).
- **Compile-Safe Output:** Per-service dedup counters, single-quote escape in test titles, auto-declare undeclared vars.
- **Heal Loop (v2.2):** 2-pass run (line reporter for terminal + json reporter for parse) — fixes always-pass bug.

### v7.x Fixes

- **[v7.1]** Service grouping: `subFolder.split(' > ')[0]` — first level only as service key.
- **[v7.2]** Spec dedup: per-service `Map<servicePropName, Map<methodName, count>>` — matches service file exactly.
- **[v7.2]** Quote safety: `.replace(/'/g, "\\'")` on all test titles before template literal.
- **[v7.3]** `--input` optional: auto-detect from `tests-api/` (1 folder = auto, multiple = interactive select).
- **[v7.3]** `--output` optional in `readPostmanCollection`: auto-derive from collection name.
- **[v7.3]** No-nest fix: skip `collectionFolderName` subfolder if `baseDir` already ends with it.
- **[v7.3]** Filter `env.md` directories from mdFiles scan.
- **[heal-v2.2]** 2-pass run: line reporter (terminal) + json reporter (file) — fixes always-pass bug.

---

## 📊 Output Report

After running, the console shows:

```text
🔀 AUTO-SPLIT: Detected 7 top-level folders
   📁 AMFW01000: 85 requests, sub-folders: [SearchData, CreateData, ...]
   ...
=========================================
✅ AUTO-SPLIT COMPLETE: iuser-convert
=========================================
   Total requests : 473
   Folders split  : 7
   Mode           : SKELETON
=========================================
```

### Inline Warnings in Generated Files

| Comment                 | Meaning                                   |
| ----------------------- | ----------------------------------------- |
| `// ⚡ [CPS→ASYNC]`    | `pm.sendRequest` auto-converted           |
| `// ⚠️ [MANUAL]`       | Too complex for auto-conversion           |
| `// ⚠️ [CONTROL_FLOW]` | `setNextRequest` detected                 |
| `// ⚠️ PARALLEL RISK`  | Shared state — use `test.describe.serial` |
| `// TODO:`              | Skeleton assertion — fill manually        |

---

## ⚙️ Prerequisites

```bash
# tsconfig.json location: {skills_root}/ai-dlc/qa/postman/scripts/tsconfig.json
# Uses module: CommonJS so ts-node can run without the --esm flag
# Run all commands from project root (e.g. tests/api-testing/)
```

---

## 🚨 Do's & Don'ts

✅ **Do's:**

- Run Step 1 first — it creates `tests-api/<folder>/` that Steps 2+3 auto-detect.
- Use `--skeleton` for large collections — generates compile-safe output immediately.
- Review generated code for `// ⚠️` and `// TODO:` markers — these need manual attention.

❌ **Don'ts:**

- Do not skip Step 1 — Steps 2+3 need the folder to exist for auto-detect.
- Do not ignore `pm.sendRequest` warnings — these require manual refactoring.
- Do not use `process.env` for runtime-set variables shared across requests — use `stateStore`.
