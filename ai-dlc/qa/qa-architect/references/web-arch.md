# Web UI Automation Architecture

Design the page object structure and helper layer for Web UI test automation using Playwright.

## When to use
- Designing Web UI automation for a new feature
- After asset discovery and database strategy are done

## Process
1. Read implementation plan — extract test cases, DB strategy, existing assets, templates found
2. Read Lessons Learnt: check `ai-agent/knowledge/lessons/webUi/` for UI behaviors (casing, modals, pagination)
3. Read coding rules from `playwright-rules` skill (webUi.md + coding-standards.md) — ALL parts
4. Analyze requirements (CoT) — count screens/components, identify UI sections
5. Generate patterns (LATS) — simulate 3-4 architectures, score, select hybrid
6. Validate design — check against all coding standards + business edge cases
7. Business Logic Validation — verify architecture covers: duplicate data, empty/not found, permission/role boundary, form validation
8. Self-reflect — test isolation? over-engineering? assumed elements visible without waiting?
9. Generate architecture — page objects, file structure, locator strategy, compliance checklist

## Architecture pattern: Layout-Based
```text
[Feature]Helper (Main Controller)
├── [Feature]DbService (Database: seed/verify/cleanup)
├── NavigationPage (Static UI: menus, header)
├── [Feature]DashboardPage (Dynamic UI: content area)
└── Workflows (High-level: loginAndNavigate, fillFormAndVerify)
```

## File structure
```text
pages/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/basePage.ts              — base class
pages/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/navigationPage.ts        — layout navigation
pages/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Page.ts   — content pages
helpers/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Helper.ts — main controller
fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Data.ts  — test data
tests-web/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature].spec.ts — test specs
```
- Folders: kebab-case. Files: lowerCamelCase
- MUST use 2-level structure — never flat
  - ❌ WRONG: `pages/shopee/shopeePaymentPage.ts`
  - ✅ CORRECT: `pages/shopee/shopee-payment/shopeePaymentPage.ts`

## Locator priority
1. `getByTestId` — most stable
2. `getByRole` — semantic elements
3. `getByLabel` — form fields
4. `getByPlaceholder` — inputs
5. `getByText` — non-interactive text
6. CSS/XPath — avoid

## Key rules
- No `waitForTimeout()` — use smart waits
- No `force: true` — fix visibility issues properly
- No `nth()`/`first()` — use `filter({ hasText: '...' })`
- Auth: storageState login-once per role; re-login only when role/permission differs; fail cases use different parameters or data, not re-login
- Encapsulate all locators inside page objects

## Shared Fixtures Detection (Cross-Layer)
Same as API architecture — detect if feature has cross-layer tests:
- API + Web UI → create `shared-fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/web/`
- Web UI seeds via API in beforeEach → create `ApiSetup.ts` in shared-fixtures
- Mobile exists → create `mobile/` subfolder with YAML fixtures

## LATS Forbidden Patterns
- ❌ Single Page Object with all elements
- ❌ Hard-coded locators
- ❌ `waitForTimeout()` usage
- ❌ `force: true` on clicks
- ❌ `nth()`/`first()`/`last()` instead of `filter()`
- ❌ Missing Storage State strategy
- ❌ Missing Error Simulation patterns
- ❌ Patterns ignoring Database Strategy

## Business Edge Cases (Mandatory Check)
Before finalizing, verify architecture covers:
- [ ] Duplicate data scenario (unique constraint e.g., email, tax ID)
- [ ] Empty/Not Found scenario (empty state, no results)
- [ ] Permission/Role boundary scenario (unauthorized page, hidden button)
- [ ] Form validation scenario (required fields, invalid format)

## Hybrid Action Analysis (mandatory for Web UI)

Before designing page objects, classify each test action:

| Strategy | When to use | Example |
|---|---|---|
| UI_ONLY | Must be done via UI (verify layout, click, check toast) | Verify form validation message |
| API_SETUP | Faster via API (create data, seed state) | Create user, top-up balance |
| DB_SETUP | Handled by DB strategy (seed/cleanup) | Insert test records |

Rule: IF an action creates/modifies data AND has a corresponding API endpoint → classify as API_SETUP.

Output in architecture doc:
```
### ⚡ Hybrid Action Map
| Test Case | Action | Strategy | Reason |
|-----------|--------|----------|--------|
| TC-001 | Create user | API_SETUP | POST /api/users exists |
| TC-002 | Verify form layout | UI_ONLY | Visual verification |
```

## Approval
Show architecture summary to user and wait for explicit approval before coding.
