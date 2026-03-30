---
name: postman
description: >
  This skill should be used when the user asks to "convert Postman to Playwright",
  "migrate Postman collection", "analyze Postman environment", "generate Playwright from Postman",
  or needs to transform existing Postman test suites into Playwright API automation.
---

# Postman Skills

Migrate Postman collections to Playwright automation using ts-node scripts.

- **Conversion Guide** — Process overview and script usage. (Read `references/conversion.md`)
- **Scripts README** — Detailed script documentation, flags, and output format. (Read `scripts/POSTMAN_README.md`)

## Quick Start

```bash
# 1. Analyze collection → generates markdown
npx ts-node --project skills/postman/scripts/tsconfig.json \
  skills/postman/scripts/readPostmanCollection.ts "<collection.json>" --output "<output-dir>"

# 2. Analyze environment → generates .env snippet
npx ts-node --project skills/postman/scripts/tsconfig.json \
  skills/postman/scripts/readPostmanEnv.ts "<environment.json>"

# 3. Generate Playwright files → spec + helper + fixture
npx ts-node --project skills/postman/scripts/tsconfig.json \
  skills/postman/scripts/postmanMdToPlaywright.ts --input "<md-dir>" --output-dir "<project-root>"
```
