# Playwright Workflow

Write → Review → Execute → Heal. The full test automation cycle.

## 1. Code Writer

Generate Playwright test files from architecture design.

**Input:** Architecture Design + Test Structure Blueprint from implementation plan.

**Steps:**
1. Read coding rules from `playwright-rules` skill (api.md or webUi.md + coding-standards.md) — ALL parts
2. Read architecture and test structure blueprint from implementation plan
3. Check discovery results — if Resources Discovery found reusable templates, import them instead of creating from scratch
4. Create directory structure (mkdir -p) — folders kebab-case
5. Generate fixtures — `[feature]Data.ts` with environment-specific data
6. Generate schemas — `[feature]Schema.ts` (API mode, AJV)
7. Generate helpers/pages — implement EXACTLY as designed in architecture
8. Generate spec files — AAA pattern, mandatory tags, test.step()
9. Update package.json — 4 scripts per feature (SIT/UAT × CLI/GUI):
   - `api:sit:[feature]:cliMode` / `api:sit:[feature]:guiMode`
   - `api:uat:[feature]:cliMode` / `api:uat:[feature]:guiMode`
   - (or `ui:` prefix for Web UI)

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
└── fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Data.ts
```

**Forbidden:**
- `waitForTimeout()` — use smart waits
- Hardcoded credentials — use `.env`
- CSS/XPath in UI mode — use `getByRole` priority
- `nth()`/`first()` — use `filter({ hasText: '...' })`
- Hardcoded test data in spec — use fixtures
- Static import from `pg` — use `await import('pg')` (Windows CI breaks)
- Missing JSDoc comments in Thai on all public methods

## 2. Code Review

Static quality audit before execution — no running tests.

**Check against:**
- `playwright-rules` skill compliance (all parts)
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
