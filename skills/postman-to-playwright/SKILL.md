---
name: postman
description: >
  Activate when user says "convert Postman to Playwright", "migrate Postman",
  "analyze Postman collection/environment", "generate Playwright from Postman",
  "fix URL placeholders", "add auth header", "postmanMigrate", or "run all steps",
  "แปลง Postman เป็น Playwright".
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# Postman → Playwright Migration

Pipeline: scripts analyze JSON → Markdown IR, then AI generates Playwright code per folder.

Always read the `playwright-rules` skill before writing or reviewing any generated Playwright code.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "generate Playwright", "convert folder", "write tests from collection.md" | `references/fix-generated-files.md` + `playwright-rules/references/api.md` + `playwright-testing/references/workflow.md` |
| "fix URL", "add auth", "stateStore", "polling", "pm.sendRequest" | `references/fix-generated-files.md` |
| "review code", "run tests", "fix failures" | `playwright-testing/references/playwright-code-review.md` + `playwright-testing/references/workflow.md` |

---

## Migration Flow

```text
Step 1+2:   USER runs script in terminal → produces collection.md + env.md
Step 2.5:   AI reads summary sections → designs structure → asks user to approve
Step 3:     AI generates Playwright files per folder
Step 3.1:   Data Completeness Check (MANDATORY before generating)
Step 3.2:   Apply standard fixes (URL, auth, stateStore, fixtures)
Step 4:     USER runs tests in terminal → AI fixes failures
```

---

## Step 1+2: Run Scripts

> ⚠️ **USER runs this in terminal** — AI prepares the exact command with correct paths, then USER copies and runs it.

### Scripts

| # | Script | Input | Output |
|---|--------|-------|--------|
| 1 | `readPostmanCollection.ts` | collection.json | `tests-api/<name>/collection.md` |
| 2 | `readPostmanEnv.ts` | environment.json | `tests-api/<name>/env.md` |

### Commands

```bash
# Step 1: Analyze Collection → Markdown
npx tsx {skills_root}/postman-to-playwright/postman/scripts/readPostmanCollection.ts \
  "postman/collections/xxx.postman_collection.json"

# Step 2: Analyze Environment → Markdown (optional, run after Step 1)
npx tsx {skills_root}/postman-to-playwright/postman/scripts/readPostmanEnv.ts \
  "postman/environments/yyy.postman_environment.json"
```

| Flag (Step 1) | Required | Description |
|------|----------|-------------|
| `<collection.json>` | ✅ | Path to `.postman_collection.json` |
| `--folder` | ❌ | Migrate one top-level folder only |
| `--output` | ❌ | Override output directory |

| Flag (Step 2) | Required | Description |
|------|----------|-------------|
| `<environment.json>` | ✅ | Path to `.postman_environment.json` |
| `--output` | ❌ | Override output directory |
| `--used-vars` | ❌ | Comma-separated list of vars to filter |

### Prerequisites

- Run from project root (e.g. `tests/api-testing/`)
- Scripts auto-detect `tests-api/` folder for output
- Step 1 must run before Step 2 (creates the folder Step 2 auto-detects)


---

## Step 2.5: AI Designs Structure (before generating)

After receiving the `.md` files, AI reads only 2 summary sections — no need to read the entire MD:

**From `collection.md`** → `## 🏗️ Structure Summary`

- Auth Strategy — type + recommendation (Basic/Bearer/OAuth2)
- Top-Level Folders — list all folders
- Shared Patterns — request names repeated across folders → should be a shared Service
- Cross-Folder State — vars set in one folder and used in another → global stateStore
- Runtime-Set Variables — all vars that require stateStore (not process.env)
- Recommended File Structure — tree overview

**From `env.md`** → `## 🏗️ Env Summary`

- Base URLs — domain vars used in requests
- Secrets — vars that must be filled manually (token, secretKey, accessToken)
- Runtime-set vars — vars set at runtime (use stateStore)
- Empty vars — vars with no value yet (ask user)

AI proposes structure for user to approve before generating code folder by folder

---

## Step 3: AI Generation Rules

Before writing any Playwright code, AI must read:

1. `playwright-rules` → `references/api.md` (structure, AAA, assertions)
2. `playwright-testing` → `references/workflow.md` (folder structure, write→run cycle)
3. This skill → `references/fix-generated-files.md` (Postman→Playwright patterns)

### Generation Order (MANDATORY — per workflow.md Step 5-9)

> ⚠️ **HARD RULE:** Generate files in this exact order. NEVER generate spec files before fixtures and schemas exist.

```text
1. fixtures/[collection]/[folder]/[folder]Data.ts     ← test data (SIT/UAT)
2. schemas/[collection]/[folder]/[folder]Schema.ts    ← AJV response schemas
3. helpers/[collection]/[folder]/[folder]Helper.ts    ← shared helpers / services
4. helpers/[collection]/mockHandlers.ts               ← mock interceptors (shared or per-folder)
5. tests-api/[collection]/[folder]Passed.spec.ts      ← spec file (imports 1-4)
```

**Why this order matters:**
- Spec files MUST import fixtures and schemas — they cannot exist without them
- AJV schema validation (fix-generated-files.md Section 6) is MANDATORY per api.md
- Mock handlers must exist before spec files reference them

### Process

- Read one `## 📁 Folder:` section at a time from collection.md
- Read env.md for variable declarations
- For each folder: generate fixtures → schemas → helpers → spec (in order above)
- If missing data detected → ask user before generating

### Key Postman→Playwright Patterns

| Postman | Playwright |
|---------|------------|
| `{{var}}` | `` `${process.env['VAR_NAME']}` `` |
| `pm.expect()` | `expect()` (30+ mappings in fix-generated-files.md) |
| `pm.sendRequest` CPS | `await request.fetch()` async |
| `pm.environment.set()` | `stateStore['key']` (not `process.env`) |
| Auth inheritance | `beforeAll` + shared headers |
| `setNextRequest` | `test.describe.serial` + `test.skip` |

### Collection Size Rules

| Size | Strategy |
|------|----------|
| ≤ 300 requests | AI generates all folders in sequence |
| > 300 requests | AI generates one top-level folder at a time |

---

## Step 3.1: Data Completeness Check (MANDATORY)

Before generating code, AI must analyze collection.md and env.md to identify values that couldn't be exported from Postman.

### Commonly Missing Data from Postman Exports

| Missing | Reason |
|---------|--------|
| **Current Values** | Postman only exports "Initial Values" — values active in the UI are NOT exported |
| **Secrets & Sensitive Data** | Passwords, API keys, client secrets are left blank for security |
| **Dynamic Variables** | Values set via `pm.environment.set()` are only exported if saved back to "Initial Values" |
| **Cookies** | Browser cookies managed by Postman are not included in environment exports |

### Look for

- Empty or placeholder auth tokens
- `{{variable}}` names that have no matching key in `env.md`
- Complex `Pre-request Script` logic (e.g., dynamic token generation, HMAC signing)
- `pm.environment.set()` calls that feed into later requests
- Missing base URLs or service endpoints

**Action:** List all missing/unclear items and **ASK THE USER** to provide them before proceeding to Step 3.2.

---

## Step 3.2: Standard Fixes

After user has confirmed missing data, AI applies these patterns when generating Playwright code.

> For exact patterns and 30+ code examples, read `references/fix-generated-files.md`.

### 1. URL Placeholders

Replace all Postman `{{var}}` syntax with template literals.

```typescript
// ❌ Generated
`{{user-service-url}}/api/v1/users`
// ✅ Fixed
`${process.env['user-service-url']}/api/v1/users`
```

### 2. Auth Header

Add `Authorization` header to every request. Missing auth is the most common cause of 401 failures.

```typescript
headers: {
  ...dynamicHeaders,
  'Authorization': `Bearer ${process.env['accessToken']}`,
}
```

### 3. Fixtures & Schemas (MANDATORY — create before spec file)

Per `workflow.md` Step 5-6 and `api.md` PART 1, fixtures and schemas MUST exist before generating spec files.

**Fixture file** (`fixtures/[collection]/[folder]/[folder]Data.ts`):

```typescript
// Minimal fixture — expand with actual test data from collection.md
export const <folder>Data = {
  sit: { /* SIT environment test data */ },
  uat: { /* UAT environment test data */ },
}

// Helper functions for request bodies
export function defaultBody(overrides = {}) {
  return { /* base request body from collection.md */ ...overrides };
}
```

**Schema file** (`schemas/[collection]/[folder]/[folder]Schema.ts`):

```typescript
import { validateSchema } from '../../helpers/schema.validator';

// AJV schema for response validation (fix-generated-files.md Section 6)
export const successResponseSchema = {
  type: 'object',
  required: ['success', 'result', 'errorMessage', 'traceId'],
  properties: {
    success:      { type: 'boolean', const: true },
    result:       { },
    errorMessage: { type: 'null' },
    traceId:      { type: 'null' },
  },
};

export const errorResponseSchema = {
  type: 'object',
  required: ['success', 'result', 'errorMessage'],
  properties: {
    success:      { type: 'boolean', const: false },
    result:       { type: 'null' },
    errorMessage: { type: 'string' },
  },
};
```

**Schema validator** (`helpers/schema.validator.ts`) — create once per project:

```typescript
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { expect } from '@playwright/test';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export function validateSchema(data: unknown, schema: object): void {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    const errors = validate.errors?.map(e => `${e.instancePath} ${e.message}`).join('; ') ?? 'unknown';
    expect(valid, `Schema validation failed: ${errors}`).toBe(true);
  }
}
```

### 4. Runtime State (stateStore)

Any `pm.environment.set('key', value)` must use `stateStore`, not `process.env`.

```typescript
// ❌ Wrong — process.env is read-only at runtime
process.env['ORDER_ID'] = responseJson.id
// ✅ Correct — stateStore for runtime-set values
const stateStore = (global as any).__stateStore ??= {}
stateStore['orderId'] = responseJson.id
```

> ⚠️ Never use `process.env` for values shared between requests at runtime — use `stateStore` only.

---

## ⚠️ Gotchas

- **Progress tracking:** At migration start, AI creates `progress.md` from `references/progress-template.md` in the target project's `tests-api/<collection>/` folder. Update status (⬜→✅/❌) after each step completes. Link to `agent-memory/palace/state.md` Open Threads for cross-session continuity.

---

## Step 4: Run Tests → Fix Failures

> ⚠️ **USER runs tests in terminal** — AI reads output and fixes failures.

### Run Command

```bash
# Run all tests for a folder
npx cross-env ENV=sit npx playwright test --config=playwright.config.ts tests-api/<folder>/

# Run a specific spec file
npx cross-env ENV=sit npx playwright test --config=playwright.config.ts tests-api/<folder>/<name>.spec.ts
```

### AI Fix Workflow

1. User pastes test output (or AI reads from terminal)
2. AI reads the error message + stack trace
3. AI checks `references/fix-generated-files.md` for matching pattern
4. AI checks `agent-memory/knowledge/lessons/` for known fix
5. AI applies fix → user re-runs → repeat until pass

### Common Failure Patterns

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| 401 Unauthorized | Missing/wrong auth header | Add `Authorization` header (Section 2 in fix-generated-files.md) |
| `{{variable}}` in URL | Unresolved Postman variable | Replace with `process.env['VAR']` template literal |
| `stateStore is not defined` | Missing stateStore declaration | Add `const stateStore = (global as any).__stateStore ??= {};` |
| `Cannot read property of undefined` | Response not parsed | Add response type check (Section 3) |
| `expect(...).toHaveStatus is not a function` | Wrong assertion API | Use `expect(response.status()).toBe(200)` |
| Timeout | Slow API or polling needed | Add `timeout` option or use `expect.poll` (Section 5) |

### After All Tests Pass

- Update `progress.md` → Step 4 status ✅
- Capture any new patterns as lessons in `agent-memory/knowledge/lessons/`

---

## ⚠️ More Gotchas

- **Postman exports lack Current Values** — only "Initial Values" are exported. Secrets and runtime-set values will be empty. Always check with user.
- **`pm.environment.set()` chains** — requests that set variables used by later requests need `stateStore` + `test.describe.serial`, not `process.env`.
- **Auth inheritance missed** — Postman folder-level auth is invisible in request JSON. AI must check `resolveAuth` chain in collection.md.
- **`pm.sendRequest` in pre-request** — CPS callback pattern must be converted to async/await. Complex patterns need manual review.
- **Script hangs on interactive select** — if multiple folders exist in `tests-api/`, script prompts for selection. Use `--folder` flag to skip.
- **Spaces in file paths** — wrap paths in quotes: `--collection "path with spaces/file.json"`


---

## Verification

Before declaring migration step complete, confirm:

- [ ] `playwright-rules/` loaded before writing any Playwright code
- [ ] Files generated in correct order: fixtures → schemas → helpers → spec
- [ ] All `{{var}}` replaced with `process.env['VAR']` template literals
- [ ] Auth header present on all requests
- [ ] `stateStore` used for runtime-set values (not `process.env`)
- [ ] AJV schema validation present for response assertions
- [ ] Data completeness check done (missing values asked from user)
- [ ] Tests pass after generation (Step 4 complete)

---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| Postman collection JSON | Migration input | Source of API requests and test logic |
| Playwright project structure (`tests-api/`) | Target | Where generated files are written |
| `playwright-rules` | Coding standards | API test patterns, AAA, assertions |
| `references/fix-generated-files.md` | Migration patterns | 30+ Postman→Playwright conversion rules |
| `knowledge/lessons/` | Lessons learnt | Check before execute |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After migration plan (Step 2.5 structure) | Checkbox (approve folder structure) | Before generating any code |
| After first converted file | Open field (review quality) | After first folder's spec file generated |
| Data completeness gaps | Open field (provide missing values) | When missing secrets/tokens detected |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.

## Self-Learning

After user approves the output:

1. **Record good example:** Save approved output to `knowledge/lessons/tooling/{pattern}.md`
2. **Record failures:** If output was rejected → note what went wrong for next time
3. **Progressive update:** If a new pattern proved effective → append to relevant knowledge index
4. **Confidence tracking:** `confidence: 1.0` (user-approved) vs `confidence: 0.7` (auto-generated)

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
