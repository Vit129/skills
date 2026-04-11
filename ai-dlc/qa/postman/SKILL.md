---
name: postman
description: >
  This skill should be used when the user asks to "convert Postman to Playwright",
  "migrate Postman collection", "analyze Postman environment", "generate Playwright from Postman",
  "fix generated files", "add mock env", "fix URL placeholders", "add auth header",
  or needs to transform existing Postman test suites into Playwright API automation.
---

# Postman → Playwright Migration

Full migration pipeline: analyze → generate → fix → run.

Always read the `playwright-rules` skill before writing or reviewing any generated Playwright code.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "how to migrate", "how to start", "full migration steps", "missing data from export", "step 3.1", "step 3.2" | `references/migration-steps.md` |
| "what scripts to run", "run script 1", "run script 2", "analyze collection", "script commands" | `scripts/POSTMAN_README.md` |
| "fix generated files", "URL placeholder", "add auth", "fix {{var}}", "stateStore", "assertions", "polling" | `references/fix-generated-files.md` |
| "generate playwright", "run script 3", "postmanMdToPlaywright" | `scripts/POSTMAN_README.md` + `references/fix-generated-files.md` |
| "run and heal", "run tests", "fix test errors", "auto-heal", "code review", "step 3.3", "reflexion log" | `references/run-and-heal.md` |

- **Migration Steps** — How to start, missing data checklist, Step 3.1 data check, Step 3.2 standard fixes. (Read `references/migration-steps.md`)
- **Fix Generated Files** — URL vars, auth header, stateStore, assertion gems, polling, schema. (Read `references/fix-generated-files.md`)
- **Run & Heal** — Code review (Step 3.3), execution, impact analysis, error triage, reflexion log. (Read `references/run-and-heal.md`)
- **Scripts Guide** — CLI commands for all 4 scripts, flags, auto-detect behavior, output structure. (Read `scripts/POSTMAN_README.md`)

## Migration Flow

```
collection.json + environment.json
        ↓
  Script 1: readPostmanCollection.ts  →  collection.md
  Script 2: readPostmanEnv.ts         →  environment.md + .env snippet
  Script 3: postmanMdToPlaywright.ts --skeleton  →  spec + helper + service + schema + fixture
        ↓
  Step 3.1: Data Completeness Check — list missing data, ASK USER
        ↓
  Step 3.2: Standard Fixes — URL vars, auth header, stateStore
        ↓
  Step 3.3: Code Review (static) — APPROVED or NEEDS_FIX
        ↓
  Fill // TODO: assertions per spec (folder by folder) - Ref: playwright-rules
        ↓
  Run tests → Impact Analysis → Error Triage → Heal (max 3 attempts)
        ↓
  Reflexion Log → audit.md
```

## Decision Rules

**Use scripts (not AI) for generation when:**
- Collection has > 50 requests
- Multiple folders with cross-folder state dependencies
- Need consistent, repeatable output

**Use AI directly when:**
- Collection has ≤ 50 requests
- Single folder, no cross-folder state
- Quick one-off migration

**For very large collections (> 300 requests):** migrate one top-level folder at a time, run heal loop per folder — never attempt full-collection migration in a single session.
