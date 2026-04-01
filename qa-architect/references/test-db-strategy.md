# Test Database Strategy

Design DB seed/verify/cleanup strategy for test automation. Two phases: Phase 1 (user interaction) and Phase 2 (autonomous design).

## Phase 1: Requirements Discovery (ask user once)

**Q1:** "Feature นี้ต้องใช้ Database มั้ย?
1) มี — พร้อมให้ SQL แล้ว
2) มี — แต่รอ Dev สร้างก่อน
3) ไม่แน่ใจ — ช่วยวิเคราะห์ให้
4) ไม่ต้อง — ข้ามไปเลย"

**Q2 (if 1/2/3):** "ใช้กับ test type ไหน? 1) API only 2) UI only 3) Mobile only 4) All shared"

**Q3 (if 1/2/3):** "DB type อะไร? 1) PostgreSQL (5432) 2) MySQL (3306) 3) Oracle (1521) 4) Other"

**If user provides SQL:** Validate syntax, extract tables/operations, show summary, ask to confirm.
**If user provides context only:** Generate SQL from context + requirements, show for review.
**If not sure:** Analyze requirements, recommend, generate SQL, show for review.
**If No:** "✅ ข้าม DB strategy — ใช้ mock data แทน"

After confirmation: "ขอข้อมูล connection: Host, Port, DB Name, User, Password (จะเก็บใน .env)"

Write to: `implementation[FEATURE].md` → Database Strategy section

## Phase 2: Architecture Design (autonomous, no user questions)

Read Phase 1 output, then design:

**Service Methods (domain-specific names):**
- Seed: `seed[Feature](params, testId)` — INSERT, tagged with testId
- Verify: `verify[Feature](params)` — SELECT
- Cleanup: `cleanup(testId)` — DELETE by testId (safety net)
- SeedAll: orchestrate all seeds in dependency order (if FK dependencies exist)

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
  await dbService.cleanup(testId); // always runs, even on crash
});
```

## File Structure

**Shared (default):** `tests/db-scripts/[system]/[feature]/`
**Isolated:** `tests/[api|web|mobile]-testing/db-scripts/[system]/[feature]/`

Files per feature:
- `[Feature]DbConfig.ts` — connection details (reads from .env)
- `[Feature]DbService.ts` — seed/verify/cleanup methods
- `[Feature]Setup.sit.sql`, `[Feature]Cleanup.sql`

## Standards
- All credentials from `.env` — never hardcode
- All queries parameterized — no string formatting
- All seed operations tagged with `testId`
- Use `INSERT IGNORE` / `WHERE NOT EXISTS` for idempotency
- Never `TRUNCATE` shared tables — only `DELETE WHERE test_id = $1`
- Dynamic import for `pg`: `await import('pg')` — never static import
- Add `db-scripts/` to `tsconfig.json` exclude

## Environment Variables
`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

## Schema Consistency Check

MUST run after logical design and before test script design:

1. **Extract API schema** — from logical-design.md, list all request/response fields per endpoint with types
2. **Extract DB schema** — from SQL scripts or data storage design, list all columns per table with types
3. **Compare:**

| API Field | API Type | DB Column | DB Type | Match? |
|-----------|----------|-----------|---------|--------|
| userId | string | user_id | UUID | ✅ |
| amount | number | amount | DECIMAL(10,2) | ✅ |
| status | string | status | ENUM | ⚠️ Check enum values |
| createdAt | string | created_at | TIMESTAMP | ✅ |
| tags | string[] | — | — | ❌ Missing in DB |

4. **Report mismatches:**
   - Missing fields (API has but DB doesn't, or vice versa)
   - Type mismatches (string vs number, nullable vs required)
   - Constraint mismatches (max length, enum values, foreign keys)
5. **Action:** Fix mismatches before proceeding to test script design

## Mocking Fallback

When DB is unavailable during test execution:
- API tests: use hardcoded fixture data, tag result as `[PARTIAL_MOCK]`
- Web UI tests: use `page.route()` to mock API responses
- Mobile tests: use YAML fixture with mock flag
- Always log: "⚠️ DB unavailable — using mock data, results may not reflect real behavior"
