---
name: postman
description: >
  This skill should be used when the user asks to "convert Postman to Playwright",
  "migrate Postman collection", "analyze Postman environment", "generate Playwright from Postman",
  "run migrated tests", "heal Postman migration failures",
  or needs to transform existing Postman test suites into Playwright API automation.
  AI does NOT do the migration — provide the script commands for user to run.
---

# Postman Migration (Script-Based)

Migrate Postman collections to Playwright automation using ts-node scripts.
AI provides the commands — user runs them in terminal.

## When to Load Each Reference

| User says | Load |
| --------- | ---- |
| "how to migrate", "what scripts to run", "full migration steps" | `scripts/POSTMAN_README.md` |
| "run the tests", "heal failures", "fix loop", "reflexion log" | `scripts/POSTMAN_README.md` → Step 4 section |

## How It Works

AI does NOT read or convert Postman collections directly. Instead:

1. User provides `collection.json` and/or `environment.json` path
2. AI outputs the script commands from `POSTMAN_README.md`
3. User runs commands in terminal (Step 1→2→3→4 pipeline)
4. Scripts generate markdown analysis + Playwright files automatically

**All path flags are optional** — scripts auto-detect `tests-api/` folder structure.

## Script Overview

| Script | Purpose |
| ------ | ------- |
| `readPostmanCollection.ts` | Analyze collection → generate `.md` with snippets. `--output` optional. |
| `readPostmanEnv.ts` | Analyze environment → generate `.env` snippet + `.md`. `--output` optional. |
| `postmanMdToPlaywright.ts` | Convert `.md` → spec + Helper + Service + Schema + Data. `--input` optional. Use `--skeleton` for large collections. |
| `postmanToPlaywrightRunAndHeal.ts` | Run tests + auto-heal fix loop + write Reflexion Log. v2.2: 2-pass run fixes always-pass bug. |

## Minimal Pipeline (all auto-detect)

```bash
# Run from project root (e.g. tests/api-testing/)

# Step 1 — creates tests-api/<collection-name>/
npx ts-node --project ~/.claude/skills/ai-dlc/qa/postman/scripts/tsconfig.json \
  ~/.claude/skills/ai-dlc/qa/postman/scripts/readPostmanCollection.ts \
  "postman/collections/MyCollection.postman_collection.json"

# Step 2 — interactive select from tests-api/ folders
npx ts-node --project ~/.claude/skills/ai-dlc/qa/postman/scripts/tsconfig.json \
  ~/.claude/skills/ai-dlc/qa/postman/scripts/readPostmanEnv.ts \
  "postman/environments/MyEnv.postman_environment.json"

# Step 3 — auto-detect input, skeleton mode
npx ts-node --project ~/.claude/skills/ai-dlc/qa/postman/scripts/tsconfig.json \
  ~/.claude/skills/ai-dlc/qa/postman/scripts/postmanMdToPlaywright.ts \
  --skeleton

# Step 4 — heal loop
npx ts-node --project ~/.claude/skills/ai-dlc/qa/postman/scripts/tsconfig.json \
  ~/.claude/skills/ai-dlc/qa/postman/scripts/postmanToPlaywrightRunAndHeal.ts \
  --spec tests-api/<collection-name> \
  --max-attempts 3
```

## Large Collection Protocol

If collection has 5+ folders or 50+ requests:

1. Run Step 1 first to get markdown index
2. `--skeleton` mode generates compile-safe output for all folders at once
3. Auto-split creates 1 spec per top-level `## 📁 Folder:` header
4. Dev fills `// TODO:` assertions folder by folder

## Next Step: Validation Workflow

After generating the files, **ALWAYS** hand off to the **`playwright-testing`** skill:

1. **Review:** Validate generated code against `playwright-rules`
2. **Execute:** Run the migrated tests to verify correctness
3. **Heal:** Fix migration artifacts or complex Postman logic the script couldn't auto-convert
