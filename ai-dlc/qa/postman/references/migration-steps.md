# Migration Steps Reference (Postman → Playwright)

Covers: how to start, commonly missing data, Step 3.1 (data check), Step 3.2 (standard fixes).

---

## How to Start

Provide the following to the AI:
1. **Postman Collection JSON** (e.g., `my_collection.json`)
2. **Postman Environment JSON** (optional, e.g., `my_env.json`)
3. **Target Directory** for the generated Playwright files (e.g., `./tests/api-testing`)

**Example:**
> "Migrate Postman from `/path/to/collection.json` and `/path/to/env.json` to Playwright in `./tests/api-testing`"

The AI will run scripts for analysis (Step 1+2) and then generate Playwright code directly from the produced `.md` files (Step 3).

---

## Commonly Missing Data from Postman Exports

AI and Users must be aware that Postman JSON exports often lack critical data:

| Missing | Reason |
|---------|--------|
| **Current Values** | Postman only exports "Initial Values" — values active in the UI are NOT exported |
| **Secrets & Sensitive Data** | Passwords, API keys, client secrets are left blank as "Initial Values" for security |
| **Dynamic Variables** | Values set via `pm.environment.set()` are only exported if saved back to "Initial Values" |
| **Cookies** | Browser cookies managed by Postman are not included in environment exports |

**Action:** Always check for these gaps during Step 3.1.

---

## Step 3.1: Data Completeness Check (MANDATORY)

Before fixing anything, AI must analyze the collection.md and env.md and identify values that couldn't be exported from Postman.

**Look for:**
- Empty or placeholder auth tokens
- `{{variable}}` names that have no matching key in `env.md`
- Complex `Pre-request Script` logic (e.g., dynamic token generation, HMAC signing)
- `pm.environment.set()` calls that feed into later requests
- Missing base URLs or service endpoints

**Action:** List all missing/unclear items and **ASK THE USER** to provide them before proceeding to Step 3.2.

---

## Step 3.2: Standard Fixes

After user has confirmed missing data, AI applies these patterns when generating Playwright code from collection.md.

> For exact patterns and code examples, read `references/fix-generated-files.md`.

### 1. URL Placeholders
Replace all Postman `{{var}}` syntax with template literals. Variable names must be SCREAMING_SNAKE_CASE.

```typescript
// ❌ Generated
`{{user-service-url}}/api/v1/users`

// ✅ Fixed
`${process.env['USER_SERVICE_URL']}/api/v1/users`
```

### 2. Auth Header
Add `Authorization` header to every request method in every `*Service.ts`. Missing auth is the most common cause of 401 failures.

```typescript
// ✅ Standard Bearer Token
headers: {
  ...dynamicHeaders,
  'Authorization': `Bearer ${process.env['ACCESS_TOKEN']}`,
}
```

### 3. Missing Fixtures
If `fixtures/` folder is empty after Script 3, create a minimal fixture file:

```typescript
// fixtures/<collection>/<folder>/<folder>Data.ts
export const <folder>Data = {
  sit: { /* SIT environment test data */ },
  uat: { /* UAT environment test data */ },
}
```

### 4. Runtime State (stateStore)
Any `pm.environment.set('key', value)` in Pre/Post-request scripts must use `stateStore`, not `process.env`.

```typescript
// ❌ Wrong — process.env is read-only at runtime
process.env['ORDER_ID'] = responseJson.id

// ✅ Correct — stateStore for runtime-set values
const stateStore = (global as any).__stateStore ??= {}
stateStore['orderId'] = responseJson.id

// Use in next test
const id = stateStore['orderId']
```

> ⚠️ Never use `process.env` for values shared between requests at runtime — use `stateStore` only.

---

## Verify Analysis Complete

AI generation (Step 3) requires `tests-api/<name>/collection.md` to exist.

**Always verify Script 1+2 have completed and the `.md` files exist before generating Playwright code.**

For very large collections (> 300 requests): migrate one top-level folder at a time — do not attempt full-collection migration in a single session.
