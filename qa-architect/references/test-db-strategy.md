# Test Database Strategy

Design DB seed/verify/cleanup strategy for test automation. Two phases: Phase 1 (user interaction) and Phase 2 (autonomous design).

## Phase 1: Requirements Discovery (ask user once)

Ask user:
1. Does this feature need DB? (Yes with SQL / Yes wait for Dev / Not sure / No)
2. If Yes → Which test type? (API only / UI only / Mobile only / All shared)
3. DB type? (PostgreSQL 5432 / MySQL 3306 / Oracle 1521 / Other)

**If user provides SQL:** Validate syntax, extract tables/operations, show summary, ask to confirm.
**If user provides context only:** Generate SQL from context + requirements, show for review.
**If not sure:** Analyze requirements, recommend, generate SQL, show for review.
**If No:** Skip DB strategy.

After confirmation: Ask connection details (Host, Port, DB Name, User, Password).

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
