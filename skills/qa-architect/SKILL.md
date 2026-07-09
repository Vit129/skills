---
name: qa-architect
description: >
  This skill should be used when the user asks to "design test automation architecture",
  "ออกแบบ test automation architecture", "create API test framework", "สร้าง API test framework",
  "design page object structure", "ออกแบบ page object structure",
  "plan test DB strategy", "วางแผน test DB strategy",
  or needs platform-specific blueprints for API, Web UI, or Mobile test automation
  and database seed/verify/cleanup strategy.
version: 1.1.0
last_improved: 2026-06-01
improvement_count: 1
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

## Inline Process

1. **Identify the platform** — Determine: API, Web UI, or Mobile. Load exactly ONE corresponding reference. If not stated, ask.
2. **Read test scenarios from Phase 2.2** — Load `testScenarioPbi{ID}-{platform}.md` → extract: endpoints called, DB tables verified, request fields, response fields, test data used per TS.
3. **Analyze requirements** — Count endpoints/screens, group by domain, check DB integration needs, determine complexity.
4. **Generate architecture** — API: Multi-Service pattern (Helper → DbService + AuthService + ApiService + Workflows). Web UI: Layout-based POM (header/sidebar/content). Mobile: Screen-based POM (navigation flows, gestures).
5. **Map TS → Service methods** — For each TS: which ApiService method, which DbService verify method, which test data set (TD_XXX).
6. **Schema Consistency Check** — Extract request/response fields from TS steps → compare with DB columns → report mismatches.
7. **Design test data infrastructure** — Map TD_XXX from test scenarios → fixture file fields. Define seed/verify/cleanup per TS. Define .env sensitive fields.
8. **Validate design** — Page objects contain only interactions (no assertions), environment switching defined, no forbidden patterns.
9. **Get approval** — Present architecture summary to user. Wait for explicit approval before coding.

## 📋 Quick Review Summary (MANDATORY — add to every architecture file)

Every architecture file MUST have a Quick Review (TL;DR) section at the top.

**Why:** Architecture files are long (service tree + file structure + schema + test blueprint). Reviewer needs to see the shape in 10 seconds, not scroll 200 lines.

### Required format for API architecture:

```markdown
## 📋 Quick Review (TL;DR)

**Pattern:** Multi-Service (1 Helper → N ApiServices + 1 DbService + 1 AuthService)

| Service | Endpoints | TS Coverage |
|---------|-----------|-------------|
| [Domain]ApiService | endpoint1, endpoint2 | TS-001, TS-002 |
...

**Key decisions:**
- [Decision 1 — why this pattern was chosen]
- [Decision 2 — non-obvious technical choice]
- [Decision 3 — constraint or tradeoff]

**Folder:** `helpers/[system]/[feature]/` (2-level, N files)
```

### Required format for Web UI architecture:

```markdown
## 📋 Quick Review (TL;DR)

**Pattern:** Layout-Based POM (1 Helper → N Page Objects + 1 DbService)

| Page Object | หน้าจอ | TS Coverage |
|-------------|--------|-------------|
| [Name]Page | [screen name] | TS-001, TS-002 |
...

**Key decisions:**
- [Decision 1]
- [Decision 2]
- [Decision 3]

**Folder:** `pages/[system]/[feature]/` (2-level, N files)
```

### Divider (MANDATORY — same as test scenario files):

```markdown
---
---
---

# ═══════════════════════════════════════════════════════════
# 📄 FULL DETAIL (ด้านล่างนี้คือเนื้อหาจริงสำหรับ implementation)
# ═══════════════════════════════════════════════════════════

---
```

### Key decisions section rules:
- Always 3 bullets — no more, no less
- Each bullet answers "why" not "what"
- Focus on non-obvious choices (obvious things don't need explanation)
- Examples: "Eventual Consistency → polling/retry", "2FA → separate header", "seed via API not UI (faster)"

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

---


## Consistency Contract

> These steps MUST execute in the same order every time this skill runs.
> Output may vary, but the workflow is fixed.
> If any step is skipped without a documented skip condition, the session-save hook will flag this skill.

## Verification

Before declaring test architecture design complete, confirm:

- [ ] Platform identified (API / Web UI / Mobile) and correct reference loaded
- [ ] Environment switching mechanism defined
- [ ] Page objects contain only interactions (no assertions)
- [ ] Test DB strategy defined (seed/verify/cleanup)
- [ ] Auth token management pattern specified
- [ ] Folder structure documented with naming conventions


---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| Test framework options (Playwright, RF, k6) | Tool landscape | Inform architecture decisions |
| Existing test patterns in project | Source code | Match conventions, avoid duplication |
| Project structure (folder layout, naming) | Codebase | Design consistent folder hierarchy |
| `references/*.md` (one per platform) | Architecture blueprint | API, Web UI, or Mobile patterns |
| `knowledge/lessons/` | Lessons learnt | Check before execute |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After architecture proposal | Single select (present 2-3 framework options) | After analyzing requirements and complexity |
| After tool selection | Checkbox (confirm stack) | Before generating folder structure and patterns |
| After DB strategy design | Open field | Before implementing seed/verify/cleanup |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.

## Self-Learning

After user approves the output:

1. **Record good example:** Save approved output to `knowledge/lessons/qa-architecture/{pattern}.md`
2. **Record failures:** If output was rejected → note what went wrong for next time
3. **Progressive update:** If a new pattern proved effective → append to relevant knowledge index
4. **Confidence tracking:** `confidence: 1.0` (user-approved) vs `confidence: 0.7` (auto-generated)

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
