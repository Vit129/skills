# Playwright Workflow

Write → Review → Execute → Heal. The full test automation cycle.

## 1. Code Writer

Generate Playwright test files from architecture design.

**Input:** Architecture Design + Test Structure Blueprint from implementation plan.

**Steps:**

1. Read coding rules from `playwright-rules` skill (api.md or webUi.md + coding-standards.md)
2. Read architecture and test structure blueprint from implementation plan
3. **Check discovery results** — if Resources Discovery found reusable templates, import them instead of creating from scratch
4. Generate fixtures — `[feature]Data.ts` with environment-specific data
4. Generate schemas — `[feature]Schema.ts` (API mode)
5. Generate helpers/pages — implement exactly as designed in architecture
6. Generate spec files — AAA pattern, mandatory tags, test.step()
7. Update package.json — 4 scripts per feature (SIT/UAT × CLI/GUI)

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
- `[SYSTEM_KEBAB]` = system name in kebab-case (e.g., `shopee`)
- `[SYSTEM_FEATURE_KEBAB]` = feature name in kebab-case (e.g., `shopee-payment`)
- `[systemFeature]` = feature name in lowerCamelCase (e.g., `shopeePayment`)
- MUST follow this structure — do not flatten or skip levels

**Forbidden:**

- `waitForTimeout()` — use smart waits
- Hardcoded credentials — use `.env`
- CSS/XPath in UI mode — use `getByRole` priority
- `nth()`/`first()` — use `filter({ hasText: '...' })`
- Hardcoded test data in spec — use fixtures

## 2. Code Review

Static quality audit before execution — no running tests.

**Check against:**

- `playwright-rules` skill compliance (all parts)
- Architecture matches blueprint
- DB methods follow strategy (seed/verify/cleanup)
- No forbidden patterns
- JSDoc comments present
- Package.json scripts complete

**Output:** APPROVED or NEEDS_FIX with issue list (severity, file, line, suggestion).

## 3. Test Execution

Run tests and capture results.

**Steps:**

1. Verify test file exists and Playwright is installed
2. Run with `--reporter=line` (minimal output)
3. Parse JSON report — total, passed, failed, error messages
4. If failures → trigger healer (max 3 attempts, extend to 5 if >80% pass)
5. Record lessons to Reflexion Log — only technical patterns, ignore env issues

## 4. Self-Healing (Reflexion Pattern)

Analyze failures and auto-fix code.

**Impact Analysis (MANDATORY before any fix):**

Before fixing, classify the blast radius:

| Classification | Scope | Action |
|---|---|---|
| Isolated | Fix affects only 1 spec file | Fix directly |
| Shared | Fix affects helper/page used by multiple specs | Check all dependent specs before fixing, ensure backward compatibility |
| Cross-layer | Fix affects shared-fixtures or auth used by API+Web+Mobile | Warn user, get approval before fixing |

Steps:
1. Identify which file needs the fix
2. Search for all files that import/use the affected function
3. Classify as Isolated/Shared/Cross-layer
4. If Shared or Cross-layer → list all affected files and warn user

**Visual-First Debugging:**

Before changing code, check visually:
- Screenshot: is the element actually visible? (opacity, z-index, overlay)
- Layout: is the page broken? (blank screen, missing content)
- Text: does the text match exactly? (case-sensitivity, whitespace, Thai characters)
- Modal: is there an unexpected popup blocking the element?
- Loading: is the page still loading? (spinner, skeleton)

**Process:** Reflect → Impact Analysis → Visual Debug → Hypothesize → Correct → Verify

**Error triage:**

- Environment (skip): 500 errors, VPN, connection refused
- Code (heal): element not found, assertion failed, timeout (selector)

**Fix by error type:**

| Error | Fix |
|-------|-----|
| Element not found | Check locator priority, use Browser Subagent Screenshot to verify case-sensitivity and nested modal layers. |
| Timeout | Add waitForResponse, increase timeout |
| Click intercepted | Close modal first, scroll into view |
| Assertion failed | Verify test data, add waitFor assertion |
| Flaky | Use fixed seed, mock external APIs |

**Review classification (for each issue found):**

| Type | Description | Priority |
|------|-------------|----------|
| logic_bug | Test logic doesn't match requirement | Fix immediately |
| arch_mismatch | Code doesn't follow architecture design | Fix before next phase |
| code_quality | Style/naming/pattern violation | Fix during review |
| forbidden_pattern | Uses forbidden API (waitForTimeout, nth, hardcoded) | Fix immediately |

**Rules:**

- Max 3 attempts per test
- Never delete functions or change architecture
- MUST run impact analysis before fixing shared code
- Log every fix attempt (healed or failed)
