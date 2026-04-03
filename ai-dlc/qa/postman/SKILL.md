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

- **Conversion Guide** — (Read `references/conversion.md`)
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
npx ts-node --project ai-agent/scripts/postman-migration/tsconfig.json \
  ai-agent/scripts/postman-migration/readPostmanCollection.ts "<collection.json>" --output "<output-dir>"

# 2. Analyze environment → generates .env snippet
npx ts-node --project ai-agent/scripts/postman-migration/tsconfig.json \
  ai-agent/scripts/postman-migration/readPostmanEnv.ts "<environment.json>"

# 3. Generate Playwright files → spec + helper + fixture
npx ts-node --project ai-agent/scripts/postman-migration/tsconfig.json \
  ai-agent/scripts/postman-migration/postmanMdToPlaywright.ts --input "<md-dir>" --output-dir "<project-root>"
```

## Large Collection Protocol

If collection has 5+ folders or 50+ requests:
1. Run step 1 first to get markdown index
2. User picks which folder to migrate first
3. Migrate one folder at a time
