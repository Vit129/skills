# Playwright Workflow

Write → Review → Execute → Heal. The full test automation cycle.

## 1. Code Writer

Generate Playwright test files from architecture design.

**Input:** Architecture Design + Test Structure Blueprint from implementation plan.

**Steps:**
1. Read coding rules from `ai-dlc/rules/playwright-rules/` skill (api.md or webUi.md + pw-coding-standards.md) — ALL parts
2. Read architecture and test structure blueprint from implementation plan
3. Check discovery results — if Resources Discovery found reusable templates, import them instead of creating from scratch
4. Create directory structure (mkdir -p) — folders kebab-case
5. Generate fixtures — `[feature]Data.ts` with environment-specific data and `[feature]Labels.ts` with TH/EN UI labels
6. Generate schemas — `[feature]Schema.ts` (API mode, AJV)
7. Generate helpers/pages — implement EXACTLY as designed in architecture
8. **Generate mock interceptors (MANDATORY)** — see Mock Layer rule below
9. Generate spec files — AAA pattern, mandatory tags, test.step()
10. Update package.json — 4 scripts per feature (SIT/UAT × CLI/GUI):
    - `api:sit:[feature]:cliMode` / `api:sit:[feature]:guiMode`
    - `api:uat:[feature]:cliMode` / `api:uat:[feature]:guiMode`
    - (or `ui:` prefix for Web UI)

## Mock Layer (MANDATORY — TDD Red Phase)

Tests MUST be runnable before backend exists. Always create mock interceptors alongside test scripts.

### Rule

Every spec file MUST have a corresponding mock handler. Tests run against mocks by default, switch to real service when available.

### Pattern: health check + auto-fallback

```typescript
// shared/mocks/[feature]Mock.ts
import { Page, APIRequestContext } from '@playwright/test'

export async function setupMock(page: Page, baseUrl: string, mockData: Record<string, unknown>) {
  await page.route(`${baseUrl}/**`, async route => {
    const url = route.request().url()
    const method = route.request().method()
    const key = `${method}:${new URL(url).pathname}`
    if (mockData[key]) {
      const { status, body } = mockData[key] as { status: number; body: unknown }
      await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
    } else {
      await route.continue()
    }
  })
}

export async function isServiceUp(request: APIRequestContext, url: string): Promise<boolean> {
  try {
    const res = await request.get(`${url}/health`, { timeout: 3000 })
    return res.ok()
  } catch {
    return false
  }
}
```

```typescript
// In spec beforeAll — auto-switch mock ↔ real
test.beforeAll(async ({ request, page }) => {
  const up = await isServiceUp(request, BASE_URL)
  if (!up) {
    console.log('⚠️ Service unavailable — using mock data [PARTIAL_MOCK]')
    await setupMock(page, BASE_URL, mockResponses)
  }
})
```

### Mock data location

```
tests/shared/mocks/
└── [system]/
    └── [feature]/
        └── [feature]Mock.ts    ← mock responses + setupMock + isServiceUp
```

### Rules

- NEVER skip tests when service is down — always run with mock
- Tag console output with `[PARTIAL_MOCK]` when using mock
- Mock responses MUST match logical design response shapes exactly
- When service comes up → remove `setupMock` call only, keep mock file for edge case testing
- Error scenarios (4xx, 5xx) MUST always use mock — never depend on real service to produce errors

**Naming:** Folders kebab-case, files lowerCamelCase.

**Folder Structure (MANDATORY):**
```
tests/api-testing/
├── tests-api/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature].spec.ts
├── helpers/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Helper.ts
├── schemas/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Schema.ts
└── fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Data.ts

tests/web-testing/
├── tests-web/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature].spec.ts
├── pages/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[SystemFeature]Page.ts
├── helpers/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Helper.ts
├── fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Data.ts
└── fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Labels.ts  ← TH/EN UI labels
```

**Forbidden:**
- `waitForTimeout()` — use smart waits
- Hardcoded credentials — use `.env`
- CSS/XPath in UI mode — use hybrid: `getByTestId` to scope + `getByRole({ name: L.keyName })` to target
- `nth()`/`first()` — use `filter({ hasText: '...' })`
- Hardcoded test data in spec — use fixtures
- Static import from `pg` — use `await import('pg')` (Windows CI breaks)
- Missing JSDoc comments in Thai on all public methods
- Hardcoded Thai/English text in `getByRole({ name })` — use `L.keyName` from `Labels.ts`

**Labels pattern (MANDATORY for Web UI):**
```typescript
// fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Labels.ts
export const flightBookingLabels = {
  th: {
    btnSelectFlight:  'เลือก',
    btnSearchFlights: 'ค้นหาเที่ยวบิน',
    btnConfirmBooking:'ยืนยันการจอง',
  },
  en: {
    btnSelectFlight:  'Select',
    btnSearchFlights: 'Search Flights',
    btnConfirmBooking:'Confirm Booking',
  },
}

// In page object or spec
import { flightBookingLabels } from '../../fixtures/japan/flight-booking/flightBookingLabels'
const L = flightBookingLabels[process.env.LANG ?? 'th']

await page.getByTestId('flight-result-item-FL001')
         .getByRole('button', { name: L.btnSelectFlight }).click()
```

## 2. Code Review

Static quality audit before execution — no running tests.

**Check against:**
- `ai-dlc/rules/playwright-rules/` skill compliance (all parts)
- Architecture matches blueprint
- DB methods follow strategy (seed/verify/cleanup)
- No forbidden patterns
- JSDoc comments present (Thai)
- Package.json scripts complete (SIT+UAT, CLI+GUI)
- Lessons Applied from implementation plan
- Self-Healing Ready: descriptive actions + proper logging

**Review classification:**

| Type | Description | Priority |
|------|-------------|----------|
| logic_bug | Test logic doesn't match requirement | Fix immediately |
| arch_mismatch | Code doesn't follow architecture design | Fix before next phase |
| code_quality | Style/naming/pattern violation | Fix during review |
| forbidden_pattern | Uses forbidden API | Fix immediately |

**Output:** APPROVED or NEEDS_FIX with issue list (severity, file, line, suggestion).

## 3. Test Execution

Run tests and capture results.

**Steps:**
1. Verify test file exists and Playwright is installed
2. Run with `--reporter=line` (minimal output for AI context)
3. Parse JSON report — total, passed, failed, error messages
4. If failures → trigger healer (max 3 attempts, extend to 5 if >80% pass)
5. Record lessons to Reflexion Log — only technical patterns, ignore env issues
6. Cleanup recordings: if all tests pass and webui_automation, offer to delete test-*.spec.ts recorder files

## 4. Self-Healing (Reflexion Pattern)

Analyze failures and auto-fix code.

**Impact Analysis (MANDATORY before any fix):**

| Classification | Scope | Action |
|---|---|---|
| Isolated | Fix affects only 1 spec file | Fix directly |
| Shared | Fix affects helper/page used by multiple specs | Check all dependent specs, ensure backward compatibility |
| Cross-layer | Fix affects shared-fixtures or auth used by API+Web+Mobile | Warn user, get approval before fixing |

**Visual-First Debugging (before changing code):**

Use `playwright-cli` to inspect the live app before modifying any code:

```bash
# เปิด browser และ snapshot ดู elements จริง
playwright-cli -s=debug open http://localhost:5173
playwright-cli -s=debug snapshot

# screenshot ดูหน้าตา
playwright-cli -s=debug screenshot --filename=debug.png

# ดู element เฉพาะจุด
playwright-cli -s=debug screenshot e5
```

Checklist:
- Screenshot: is the element actually visible?
- Layout: is the page broken?
- Text: does the text match exactly? (case-sensitivity, whitespace, Thai characters)
- Modal: is there an unexpected popup blocking the element?
- Loading: is the page still loading?

**Error triage:**
- Environment (skip): 500 errors, VPN, connection refused
- Code (heal): element not found, assertion failed, timeout (selector)

**Fix by error type:**

| Error | Fix |
|-------|-----|
| Element not found | Check locator priority, verify case-sensitivity and nested modal layers |
| Timeout | Add waitForResponse, increase timeout |
| Click intercepted | Close modal first, scroll into view |
| Assertion failed | Verify test data, add waitFor assertion |
| Flaky | Use fixed seed, mock external APIs |

**Rules:**
- Max 3 attempts per test (extend to 5 if >80% pass)
- Never delete functions or change architecture
- MUST run impact analysis before fixing shared code
- Log every fix attempt (healed or failed) to Reflexion Log

## Test Results — Write to Audit Trail (MANDATORY)

After test execution, append results to audit trail:

**Location:** `.aidlc/[system]/[feature]/audit.md` under `### Test Results` section.

**Format:**
```
### Test Results — [Timestamp]
- Total: [N] | Passed: [N] | Failed: [N]
- ENV: [SIT/UAT] | Mode: [CLI/GUI]
- Failed tests: [list or "none"]
```

**OUTPUT TO USER (chat summary only):**
```
✅ Tests recorded to audit.md
Passed: [N]/[N] | Failed: [N]
```

## Reflexion Log

Every heal attempt (success or fail) MUST be logged to the implementation plan or audit file.

**Format:**
```
## [Timestamp] | Type: [ErrorCategory]
- ❌ Symptom: [brief error description]
- 🔍 Root Cause: [root cause]
- 💊 Applied Fix: [code snippet summary]
- 🏁 Outcome: HEALED / FAILED
- 📊 Impact: Isolated / Shared / Cross-layer
```

**Location:** Append to `.aidlc/[system]/[feature]/audit.md` under `## Reflexion Log` section.

**Purpose:** Prevent repeating the same failed fix. Successful heals become reusable patterns for future features.

## Bug Report Template (When QA cannot self-heal)

When max attempts are reached and tests still fail, or the bug is a logic issue that needs to be fixed by Dev:

```markdown
## 🐛 Bug Report — [TS-XXX] [Test Name]

**Date:** YYYY-MM-DD
**Reporter:** QA
**Severity:** Critical | High | Medium | Low

### Symptom
[Explain what is observed — error message, wrong behavior]

### Steps to Reproduce
1. [step 1]
2. [step 2]
3. [step 3]

### Expected vs Actual
- Expected: [What should have happened]
- Actual: [What actually happened]

### Environment
- ENV: SIT | UAT
- Test data: [testId or seed data used]
- Browser/Platform: [If relevant]

### Reflexion Log Reference
[Link หรือ paste entry จาก Reflexion Log]

### Hypothesis
[What QA thinks the root cause might be — optional but very helpful for Dev]
```

**Location:** สร้างใน `.aidlc/[system]/[feature]/audit.md` ใต้ `## Bug Reports` section
**Notify:** Dev ที่รับผิดชอบ feature นั้น
