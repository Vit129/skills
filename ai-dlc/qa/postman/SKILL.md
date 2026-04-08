---
name: postman
description: >
  This skill should be used when the user asks to "convert Postman to Playwright",
  "migrate Postman collection", "analyze Postman environment", "generate Playwright from Postman",
  or needs to transform existing Postman test suites into Playwright API automation.
  AI does NOT do the migration — provide the script commands for user to run.
---

# Postman Migration (Script-Based)

Migrate Postman collections to Playwright automation using ts-node scripts.
AI provides the commands — user runs them in terminal.

- **Scripts README** — (Read `scripts/POSTMAN_README.md`)

## How It Works

AI does NOT read or convert Postman collections directly. Instead:

1. User provides collection.json and/or environment.json path
2. AI outputs the script commands below
3. User runs commands in terminal
4. Scripts generate markdown + Playwright files automatically

## Commands to Provide

```bash
# 1. Analyze collection → generates markdown
npx ts-node --project ~/.claude/skills/ai-dlc/qa/postman/scripts/tsconfig.json \
  ~/.claude/skills/ai-dlc/qa/postman/scripts/readPostmanCollection.ts "<collection.json>" --output "<output-dir>"

# 2. Analyze environment → generates .env snippet
npx ts-node --project ~/.claude/skills/ai-dlc/qa/postman/scripts/tsconfig.json \
  ~/.claude/skills/ai-dlc/qa/postman/scripts/readPostmanEnv.ts "<environment.json>"

# 3. Generate Playwright files → spec + helper + fixture
npx ts-node --project ~/.claude/skills/ai-dlc/qa/postman/scripts/tsconfig.json \
  ~/.claude/skills/ai-dlc/qa/postman/scripts/postmanMdToPlaywright.ts --input "<md-dir>" --output-dir "<project-root>"
```

## Large Collection Protocol

If collection has 5+ folders or 50+ requests:
1. Run step 1 first to get markdown index
2. User picks which folder to migrate first
3. Migrate one folder at a time

## Run + Auto-Heal (Optional — after step 3)

```bash
# 4. Run tests + auto-heal fix loop (max 3 attempts)
npx ts-node --project ~/.claude/skills/ai-dlc/qa/postman/scripts/tsconfig.json \
  ~/.claude/skills/ai-dlc/qa/postman/scripts/runAndHeal.ts \
  --spec "<tests-api/folder-or-spec.ts>" \
  --config "<playwright.config.ts>" \
  --max-attempts 3 \
  --audit "<.aidlc/system/feature/audit.md>"
```

## Next Step: Validation Workflow

After generating the files, **ALWAYS** hand off to the **`playwright-testing`** skill:

1. **Review:** Validate generated code against `playwright-rules`.
2. **Execute:** Run the migrated tests to verify correctness.
3. **Heal:** Fix any migration artifacts or complex Postman logic that the script couldnt auto-convert (e.g., complex `pm.sendRequest` or custom `pm.test` patterns).
