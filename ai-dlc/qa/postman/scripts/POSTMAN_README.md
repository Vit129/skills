# Postman Migration Scripts

> **v8.0** | Scripts analyze Postman JSON → Markdown IR. AI generates Playwright from Markdown.

## Scripts

| # | Script | Input | Output |
|---|--------|-------|--------|
| 0 | `postmanMigrate.ts` | collection.json + env.json | Runs 1+2 in sequence |
| 1 | `readPostmanCollection.ts` | collection.json | `tests-api/<name>/collection.md` |
| 2 | `readPostmanEnv.ts` | environment.json | `tests-api/<name>/env.md` |

## One-Shot (recommended)

```bash
npx ts-node --project {skills_root}/ai-dlc/qa/postman/scripts/tsconfig.json \
  {skills_root}/ai-dlc/qa/postman/scripts/postmanMigrate.ts \
  --collection "postman/collections/xxx.postman_collection.json" \
  --env "postman/environments/yyy.postman_environment.json"
```

| Flag | Required | Description |
|------|----------|-------------|
| `--collection` | ✅ | Path to `.postman_collection.json` |
| `--env` | ❌ | Path to `.postman_environment.json` |
| `--folder` | ❌ | Migrate one top-level folder only |
| `--output-dir` | ❌ | Override project root (default: cwd) |

## Run Separately

```bash
# Step 1: Analyze Collection
npx ts-node --project {skills_root}/ai-dlc/qa/postman/scripts/tsconfig.json \
  {skills_root}/ai-dlc/qa/postman/scripts/readPostmanCollection.ts \
  "postman/collections/xxx.postman_collection.json"

# Step 2: Analyze Environment
npx ts-node --project {skills_root}/ai-dlc/qa/postman/scripts/tsconfig.json \
  {skills_root}/ai-dlc/qa/postman/scripts/readPostmanEnv.ts \
  "postman/environments/yyy.postman_environment.json"
```

## What Happens Next

After scripts produce `.md` files, follow `SKILL.md` for the remaining steps:

1. **Step 2.5** — AI reads `## 🏗️ Structure Summary` (collection.md) + `## 🏗️ Env Summary` (env.md) → ออกแบบ structure → ถาม user approve
2. **Step 3** — AI reads `collection.md` per `## 📁 Folder:` header → generates Playwright files per folder
3. **Step 4** — AI runs tests + fixes failures

Full instructions → read `SKILL.md` in this skill's root folder.

## Prerequisites

- Run from project root (e.g. `tests/api-testing/`)
- `tsconfig.json` uses CommonJS — no `--esm` flag needed
- Scripts auto-detect `tests-api/` folder for output
- Step 1 must run before Step 2 (creates the folder Step 2 auto-detects)

## ⚠️ Gotchas

- **Script hangs on interactive select** — if multiple folders exist in `tests-api/`, script prompts for selection. Use `--folder` flag to skip.
- **Spaces in file paths** — wrap paths in quotes: `--collection "path with spaces/file.json"`
- **`@inquirer/prompts` not installed** — run `npm install @inquirer/prompts` in the project root first.
