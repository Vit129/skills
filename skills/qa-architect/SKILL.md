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

0. **Entry (mandatory)** — `Skill(interview)` must have already run (its Step 0 scope-check or full gather). If it hasn't, stop and call it first — don't design on top of an unconfirmed scope. Then: run `mcp__graphify__query_graph` on the feature/module under test if `graphify-out/` exists in the project root — know the existing structure before proposing page objects/service layers.
1. **Identify the platform** — Determine: API, Web UI, or Mobile. Load exactly ONE corresponding reference. If not stated, ask.
2. **Read existing test scenarios** — Load `testScenarioPbi{ID}-{platform}.md` → extract: endpoints called, DB tables verified, request fields, response fields, test data used per TS.
3. **Analyze requirements** — Count endpoints/screens, group by domain, check DB integration needs, determine complexity.
4. **Generate architecture** — API: Multi-Service pattern (Helper → DbService + AuthService + ApiService + Workflows). Web UI: Layout-based POM (header/sidebar/content). Mobile: Screen-based POM (navigation flows, gestures).
5. **Map TS → Service methods** — For each TS: which ApiService method, which DbService verify method, which test data set (TD_XXX).
6. **Schema Consistency Check** — Extract request/response fields from TS steps → compare with DB columns → report mismatches.
7. **Design test data infrastructure** — Map TD_XXX from test scenarios → fixture file fields. Define seed/verify/cleanup per TS. Define .env sensitive fields.
8. **Validate design** — Page objects contain only interactions (no assertions), environment switching defined, no forbidden patterns.
9. **Get approval** — Present architecture summary to user. Wait for explicit approval before coding.

## Output

Save the architecture file under the project's `tests/` tree, by platform — never `agent-memory/`:
- API → `tests/api-testing/tests-api/[system]/[feature]/`
- Web UI → `tests/web-testing/tests-web/[system]/[feature]/`
- Mobile → `tests/mobile-testing/tests-mobile/[platform]/[system]/[feature]/`
- Combined platforms → one file per platform test root, plus shared fixtures under `tests/shared-fixtures/[system]/[feature]/`

## Next Step

Architecture approved → continue with `../../dev-architect/references/task-design.md` (QA section) to break the design into implementation tasks, then implement.

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

## Verification

Before declaring test architecture design complete, confirm:

- [ ] Platform identified (API / Web UI / Mobile) and correct reference loaded
- [ ] Environment switching mechanism defined
- [ ] Page objects contain only interactions (no assertions)
- [ ] Test DB strategy defined (seed/verify/cleanup)
- [ ] Auth token management pattern specified
- [ ] Folder structure documented with naming conventions

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After architecture proposal | Single select (present 2-3 framework options) | After analyzing requirements and complexity |
| After tool selection | Checkbox (confirm stack) | Before generating folder structure and patterns |
| After DB strategy design | Open field | Before implementing seed/verify/cleanup |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.
