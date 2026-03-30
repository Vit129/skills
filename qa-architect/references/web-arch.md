# Web UI Automation Architecture

Design the page object structure and helper layer for Web UI test automation using Playwright.

## When to use

- Designing Web UI automation for a new feature
- After asset discovery and database strategy are done

## Process

1. Read implementation plan — extract test cases, DB strategy, existing assets.
2. **Read Lessons Learnt**: Check `knowledge/lessons/` for UI behaviors (e.g., casing, modals, pagination rules).
3. Read coding rules from `playwright-rules` skill (webUi.md + coding-standards.md)
4. Analyze requirements (CoT) — count screens/components, identify UI sections
5. Generate patterns (LATS) — simulate 3-4 architectures, select hybrid
6. Validate design — check against all coding standards + business edge cases
7. Self-reflect — test isolation? over-engineering? assumed elements visible without waiting?
8. Generate architecture — page objects, file structure, locator strategy, compliance checklist

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
- `[SYSTEM_KEBAB]` = system name in kebab-case (e.g., `shopee`)
- `[SYSTEM_FEATURE_KEBAB]` = feature name in kebab-case (e.g., `shopee-payment`)
- `[systemFeature]` = feature name in lowerCamelCase (e.g., `shopeePayment`)
- MUST follow this structure — do not flatten or skip levels

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
- Auth: storageState login-once per role
- Encapsulate all locators inside page objects

## Approval

Show architecture summary to user and wait for explicit approval before coding.
