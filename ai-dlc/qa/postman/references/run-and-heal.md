# Run & Heal Reference (Postman Migration)

Covers Step 3.3 (Code Review) → Run → Heal → Reflexion Log.

---

## Step 3.3: Code Review (Static — before running any test)

Static quality audit after Step 3.2 fixes. No test execution yet.

**Check against:**
- `playwright-rules` skill compliance (api.md + coding-standards.md)
- All `{{var}}` placeholders resolved — none remaining in URLs, headers, or body
- Auth header present on every request method in every `*Service.ts`
- `stateStore` used for all runtime-set variables (no `process.env` for dynamic values)
- No forbidden patterns: `waitForTimeout`, hardcoded credentials, hardcoded test data in spec

**Review classification:**

| Type | Description | Action |
|------|-------------|--------|
| `logic_bug` | Test logic doesn't match Postman intent | Fix immediately |
| `forbidden_pattern` | Uses forbidden API or pattern | Fix immediately |
| `arch_mismatch` | File structure deviates from standard | Fix before running |
| `code_quality` | Naming/style violation | Fix during review |

**Output:** `APPROVED` → proceed to fill `// TODO:` assertions and run. `NEEDS_FIX` → fix issues, re-review.

---

## Execution

1. Run with `--reporter=line` (minimal output for AI context)
2. Parse results — total, passed, failed, error messages
3. If failures → trigger healer
   - Max **3 attempts** per failure
   - Extend to **5 attempts** if >80% of tests are passing

---

## Impact Analysis (MANDATORY before any fix)

Run impact analysis before touching any file. Classify the scope of the fix first.

| Classification | Scope | Action |
|---|---|---|
| **Isolated** | Fix affects only 1 spec file | Fix directly |
| **Shared** | Fix affects a Helper/Service used by multiple specs | Check all dependent specs, ensure backward compatibility |
| **Cross-layer** | Fix affects shared fixtures or auth used across multiple collections | **Warn user, get approval before fixing** |

---

## Error Triage

Classify every failure before attempting a fix.

| Category | Examples | Action |
|---|---|---|
| **Environment (skip)** | 500 server error, connection refused, VPN down, auth token expired | Log as environment issue and skip — do NOT attempt to fix code |
| **Code (heal)** | Assertion failed, wrong URL, missing header, `{{var}}` still present, TS type error, timeout on response wait | Fix code |

> ⚠️ Never attempt to heal environment errors — they will not be fixed by code changes and waste heal attempts.

---

## Fix by Error Type

| Error | Fix |
|-------|-----|
| `{{var}}` still present in URL/header/body | Replace with `` `${process.env['VAR_NAME']}` `` (SCREAMING_SNAKE_CASE) |
| Assertion failed | Verify actual response shape vs schema, fix `expect()` to match |
| 401 Unauthorized | Confirm `Authorization` header exists in request and `ACCESS_TOKEN` env var is set |
| Timeout on response | Add `timeout` option to request call, verify endpoint connectivity |
| Type error (TS) | Fix type annotation, verify `responseJson` parse block handles non-JSON content-type |
| `stateStore` value undefined | Check that the setter test ran before the getter test (use `test.describe.serial`) |

---

## Reflexion Log (MANDATORY — every heal attempt)

Log every attempt (success or fail) — append to `tests-api/<collection-name>/audit.md` under `## Reflexion Log`.

```
## [Timestamp] | Type: [ErrorCategory]
- ❌ Symptom: [brief error description]
- 🔍 Root Cause: [root cause]
- 💊 Applied Fix: [code snippet summary]
- 🏁 Outcome: HEALED / FAILED
- 📊 Impact: Isolated / Shared / Cross-layer
```

**Example:**
```
## 2026-04-11T09:00:00 | Type: Code
- ❌ Symptom: 401 Unauthorized on POST /api/v1/orders
- 🔍 Root Cause: Authorization header missing from OrderService.createOrder()
- 💊 Applied Fix: Added `'Authorization': \`Bearer ${process.env['ACCESS_TOKEN']}\`` to headers
- 🏁 Outcome: HEALED
- 📊 Impact: Isolated
```

**Purpose:** Prevent repeating the same failed fix. Successful heals become reusable patterns for future collections.
