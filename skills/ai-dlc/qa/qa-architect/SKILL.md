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

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "I'll design the test framework without picking a specific platform reference" | API, Web UI, and Mobile have fundamentally different architectures (service clients vs page objects vs screen objects). A generic framework fits none of them well. |
| "Test DB strategy isn't needed — we'll just use the app's database directly" | Without seed/verify/cleanup protocols, tests pollute each other's data, create flaky failures, and can't run in parallel. Test DB strategy is infrastructure, not optional. |
| "I'll use the same page object pattern for web and mobile" | Web uses layout-based POM (header, sidebar, content areas). Mobile uses screen-based POM (navigation flows, gestures). Forcing one pattern on both creates awkward abstractions. |
| "The API test framework just needs HTTP calls — no architecture needed" | Multi-service API testing needs service client abstraction, auth token management, response validation schemas, and environment switching. Raw HTTP calls don't scale past 10 tests. |
| "I'll figure out the cleanup strategy later when tests start conflicting" | By the time tests conflict, you have hundreds of tests with implicit data dependencies. Designing cleanup upfront (truncate, transaction rollback, or fixture isolation) is 10x cheaper. |

---

## Red Flags

- 🚩 Test framework has no environment switching mechanism → Tests are hardcoded to one environment; add environment config before writing more tests.
- 🚩 Page objects contain assertions → Page objects should only encapsulate interactions; assertions belong in test files. Mixing them makes page objects non-reusable.
- 🚩 No seed data strategy defined but integration tests exist → Tests depend on pre-existing data that may not exist; define explicit seed steps per test suite.
- 🚩 Multiple platform references loaded simultaneously → Each platform (API/Web/Mobile) has its own architecture; load only the one matching the current task.
- 🚩 Test DB strategy says "share production database" → Production data is unpredictable and tests will be flaky; always use isolated test databases with controlled seed data.
