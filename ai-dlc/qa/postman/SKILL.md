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

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "how to migrate", "what scripts to run", "full migration steps", "run script" | `scripts/readPostmanCollection.ts` + `scripts/readPostmanEnv.ts` |
| "fix generated files", "URL placeholder", "add auth", "fix {{var}}" | `scripts/readPostmanCollection.ts` → env var section |

## Migration Flow

```
collection.json + environment.json
        ↓
  Script 1: readPostmanCollection.ts  →  collection.md
  Script 2: readPostmanEnv.ts         →  environment.md + .env snippet
  Script 3: postmanMdToPlaywright.ts --skeleton  →  spec + helper + service + schema + fixture
        ↓
  AI: Fix generated files (URL vars, auth header, fixture)
        ↓
  AI: Fill // TODO: assertions per spec (folder by folder)
        ↓
  Script 4: postmanToPlaywrightRunAndHeal.ts  →  run + heal loop
```

## Decision Rules

**Use scripts (not AI) for generation when:**
- Collection has > 50 requests
- Multiple folders with cross-folder state dependencies (parallel risks)
- Need consistent, repeatable output

**Use AI directly when:**
- Collection has ≤ 50 requests
- Single folder, no cross-folder state
- Quick one-off migration

## After Script 3 — What AI Must Fix

Before tests can run, AI must fix 3 things in generated `*Service.ts` files:

1. **URL placeholders** — `{{user-service-url}}` → `` `${process.env['user-service-url']}` ``
2. **Auth header** — add `'Authorization': \`Bearer ${process.env['accessToken']}\`` to every request
3. **Missing fixtures** — create minimal fixture if `fixtures/` folder is empty

> Read `references/fix-generated-files.md` for exact patterns and examples.

## Next Step After Migration

Hand off to **`playwright-testing`** skill:
1. Review generated code against `playwright-rules`
2. Fill `// TODO:` assertions using test scenario
3. Run and heal failures
