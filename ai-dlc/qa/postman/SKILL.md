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
|-----------|------|
| "how to migrate", "what scripts to run", "full migration steps" | `scripts/POSTMAN_README.md` |
| "run the tests", "heal failures", "fix loop", "reflexion log" | `scripts/POSTMAN_README.md` → Script 4 section |

- **Scripts README** — Full usage guide: commands, parameters, output glossary, do's & don'ts. (Read `scripts/POSTMAN_README.md`)

## How It Works

AI does NOT read or convert Postman collections directly. Instead:

1. User provides `collection.json` and/or `environment.json` path
2. AI outputs the script commands from `POSTMAN_README.md`
3. User runs commands in terminal
4. Scripts generate markdown + Playwright files automatically

## Script Overview

| Script | Purpose |
|--------|---------|
| `readPostmanCollection.ts` | Analyze collection → generate `.md` with snippets |
| `readPostmanEnv.ts` | Analyze environment → generate `.env` snippet + `.md` |
| `postmanMdToPlaywright.ts` | Convert `.md` → `.spec.ts` + `Helper` + `Service` + `Schema` + `Data` |
| `postmanToPlaywrightRunAndHeal.ts` | Run tests + auto-heal fix loop + write Reflexion Log |

## Large Collection Protocol

If collection has 5+ folders or 50+ requests:

1. Run `readPostmanCollection.ts` first to get markdown index
2. User picks which folder to migrate first
3. Migrate one folder at a time

## Next Step: Validation Workflow

After generating the files, **ALWAYS** hand off to the **`playwright-testing`** skill:

1. **Review:** Validate generated code against `playwright-rules`
2. **Execute:** Run the migrated tests to verify correctness
3. **Heal:** Fix migration artifacts or complex Postman logic the script couldn't auto-convert
