---
name: qa-architect
description: >
  This skill should be used when the user asks to "design test automation architecture",
  "ออกแบบ test automation architecture", "create API test framework", "สร้าง API test framework",
  "design page object structure", "ออกแบบ page object structure",
  "plan test DB strategy", "วางแผน test DB strategy",
  or needs platform-specific blueprints for API, Web UI, or Mobile test automation
  and database seed/verify/cleanup strategy.
---

# QA Architect

Design test automation frameworks and test data infrastructure.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "API test framework", "multi-service API blueprint" | `references/api-arch.md` |
| "web UI framework", "page object structure", "layout-based POM" | `references/web-arch.md` |
| "mobile test framework", "Android/iOS page object" | `references/mobile-arch.md` |
| "test DB strategy", "seed data", "verify data", "cleanup data" | `references/test-db-strategy.md` |

- **API Architecture** — Multi-service blueprints for API test automation. (Read `references/api-arch.md`)
- **Web UI Architecture** — Layout-based page object blueprints for UI automation. (Read `references/web-arch.md`)
- **Mobile Architecture** — Page object blueprints for Android/iOS automation. (Read `references/mobile-arch.md`)
- **Test DB Strategy** — Seed, verify, and cleanup protocols for test data. (Read `references/test-db-strategy.md`)
