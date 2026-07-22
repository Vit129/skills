# Test Database Strategy

Design DB seed/verify/cleanup strategy for test automation. Two phases: Phase 1 (user interaction) and Phase 2 (autonomous design).

## Phase 0: Reuse Check (before Phase 1)

Check `knowledge/arch/{feature}-db-schema.md` first — if this feature already went through DB strategy design before, read the schema/service methods straight from there and skip Phase 1 entirely.

## Phase 1: Requirements Discovery (ask user once, skip if Phase 0 found an existing file)

**Q1:** "Feature นี้ต้องใช้ Database มั้ย?
1) มี — พร้อมให้ SQL แล้ว
2) มี — แต่รอ Dev สร้างก่อน
3) ไม่แน่ใจ — ช่วยวิเคราะห์ให้
4) ไม่ต้อง — ข้ามไปเลย"

**Q2 (if 1/2/3):** "ใช้กับ test type ไหน? 1) API only 2) UI only 3) Mobile only 4) All shared"

**Q3 (if 1/2/3):** "DB type อะไร? 1) PostgreSQL (5432) 2) MySQL (3306) 3) Oracle (1521) 4) Other"

- If user provides SQL: validate syntax, extract tables/operations, show summary, confirm
- If user provides context only: generate SQL from context + requirements, show for review
- If not sure: analyze requirements, recommend, generate SQL, show for review
- If No: "✅ ข้าม DB strategy — ใช้ mock data แทน"

After confirmation: ask for connection info (Host, Port, DB Name, User, Password → stored in .env)

## Phase 2: Architecture Design (autonomous, no user questions)

Read Phase 1 output, then design:

**Service Methods (domain-specific names):**
- `connect()` — initialize connection
- `checkConnection()` — health check for fallback logic
- `seed[Feature](params, testId)` — INSERT, tagged with testId
- `verify[Feature](params)` — SELECT and verify data state
- `cleanup(testId)` — DELETE by testId (safety net)
- `seedAll(params, testId)` — if FK dependencies exist, orchestrate in order

**Dependency Order (if FK exists):**
- Level 1 (no deps): Role, Category
- Level 2 (needs L1): User (needs role_id)
- Level 3 (needs L2): Order (needs user_id)

`seedAll()` wraps all levels in single transaction, returns `{ roleId, userId, orderId }`.

**Test Lifecycle Pattern:**
```typescript
test.beforeEach(async () => {
  testId = `[Feature]_${Date.now()}`;
  await dbService.seedAll(params, testId);
});
test.afterEach(async () => {
  await dbService.cleanup(testId);
});
```

## File Structure
- Shared (default): `tests/db-scripts/[system]/[feature]/`
- Isolated: `tests/[api|web|mobile]-testing/db-scripts/[system]/[feature]/`
- Files: `[Feature]DbConfig.ts`, `[Feature]DbService.ts`, `[Feature]Setup.sit.sql`, `[Feature]Cleanup.sql`

## Standards
- All credentials from `.env` (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)
- All queries parameterized — no string formatting
- All seed operations tagged with `testId`
- Use `INSERT IGNORE` / `WHERE NOT EXISTS` for idempotency
- Never `TRUNCATE` shared tables — only `DELETE WHERE test_id = $1`
- Dynamic import for `pg`: `await import('pg')` — never static import (Windows CI breaks)
- Add `db-scripts/` to `tsconfig.json` exclude

## Schema Consistency Check
MUST run after logical design and before test script design (skip if Phase 0 found an existing `knowledge/arch/{feature}-db-schema.md` — schema already captured):
1. Extract API schema — fields per endpoint with types
2. Extract DB schema — columns per table with types
3. Compare and report mismatches
4. Fix mismatches before proceeding
5. Write result to `knowledge/arch/{feature}-db-schema.md` — sections: `## Tables` (columns + types), `## Service Methods` (seed/verify/cleanup signatures), `## Dependency Order` (FK levels)

## Mocking Fallback
When DB is unavailable during test execution:
- API tests: use hardcoded fixture data, tag result as `[PARTIAL_MOCK]`
- Web UI tests: use `page.route()` to mock API responses
- Mobile tests: use YAML fixture with mock flag
- Always log: "⚠️ DB unavailable — using mock data"
