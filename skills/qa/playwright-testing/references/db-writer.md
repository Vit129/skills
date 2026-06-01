# Playwright Database Writer

Generate database config and service classes for Playwright test data management.

## When to use
- Tests need database connection for seed/verify/cleanup
- Need to generate DbConfig and DbService files

## Steps
1. Read DB Strategy from implementation plan (Phase 1 + Phase 2)
2. Generate `[Feature]DbConfig.ts` — reads from `.env` (DB_HOST, DB_PORT, etc.)
3. Generate `[Feature]DbService.ts` with methods:
   - `connect()` — initialize connection
   - `checkConnection()` — health check for fallback logic
   - `seed[Feature](params, testId)` — insert test data tagged with testId
   - `verify[Feature](params)` — select and verify data state
   - `cleanup(testId)` — delete by testId (safety net)
   - `seedAll(params, testId)` — if FK dependencies exist, orchestrate in order within single transaction, return typed result object (e.g., `{ roleId, userId, orderId }`)
   - `disconnect()` — close connection

## Rules
- All credentials from `.env` — never hardcode
- All queries parameterized — no string formatting
- Dynamic import for `pg`: `await import('pg')` — never static import (Windows CI breaks)
- Every write method must receive `testId`
- Add `db-scripts/` to `tsconfig.json` exclude
- Test data must use prefix (`TEST_`, `AUTO_`)
- Never `TRUNCATE` shared tables — only `DELETE WHERE test_id = $1`
- Use `INSERT IGNORE` / `WHERE NOT EXISTS` for idempotency
- Explicit transactions (`BEGIN`/`COMMIT`) for multi-statement operations
- Never log sensitive data (passwords, full connection strings)

## Forbidden Patterns
- ❌ Hard-coded credentials
- ❌ Missing error handling for DB connection
- ❌ Missing connection close/cleanup
- ❌ Inline SQL string formatting
- ❌ Destructive queries without `testId` isolation
- ❌ Static import from `pg`
- ❌ Missing `testId` parameter in write methods
- ❌ Logging sensitive data

## Brownfield DB Strategy

เมื่อ project มี existing DB ที่มี production data อยู่แล้ว:

### ปัญหา
- seed data ใหม่อาจ conflict กับ existing records (duplicate key, FK violation)
- cleanup ผิดพลาดอาจลบ production data

### กฎ Brownfield

1. **Prefix ทุก test record** — ใช้ `TEST_` หรือ `AUTO_` นำหน้า identifier
   ```sql
   INSERT INTO users (email) VALUES ('TEST_john@example.com')
   ```

2. **Cleanup by testId เท่านั้น** — ห้าม cleanup by feature name หรือ date
   ```sql
   DELETE FROM users WHERE test_id = $1  -- ✅
   DELETE FROM users WHERE created_at > $1  -- ❌ อันตราย
   ```

3. **Check before insert** — ใช้ `WHERE NOT EXISTS` ป้องกัน duplicate
   ```sql
   INSERT INTO users (email, test_id)
   SELECT $1, $2
   WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = $1)
   ```

4. **Seed ใน transaction** — rollback ทั้งหมดถ้า seed ล้มเหลว
   ```typescript
   await db.transaction(async (trx) => {
     await trx('users').insert({ email: 'TEST_user@test.com', test_id: testId })
     await trx('profiles').insert({ user_id: userId, test_id: testId })
   })
   ```

5. **Verify ก่อน cleanup** — ตรวจว่า record มี test_id ก่อนลบ
   ```typescript
   const record = await db('users').where({ id, test_id: testId }).first()
   if (!record) throw new Error(`Record ${id} not owned by test ${testId}`)
   await db('users').where({ id, test_id: testId }).delete()
   ```
