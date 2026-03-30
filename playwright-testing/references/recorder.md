# Playwright Recorder Analyzer

Transform Playwright Codegen recordings (test-*.spec.ts) into proper Page Object Model code.

## When to use
- Have a Playwright recording that needs to be converted to POM
- Need to extract locators, actions, and flows from recorded tests

## Process
1. Read recording file (test-*.spec.ts)
2. Extract: locators, actions, navigation flow, waits, form data
3. Validate locator priority — flag violations (XPath, CSS-only, getByTestId as first choice)
4. Identify patterns — forms → `fillForm(data)`, tables → `clickRowAction()`, wizards → `completeWizard()`
5. Transform to Page Object — methods from actions, improved locators, test data as JSON
6. Replace hard waits with smart waits

## Locator priority
1. `getByRole` — semantic elements
2. `getByLabel` — form fields with labels
3. `getByPlaceholder` — inputs
4. `getByText` — non-interactive text
5. `getByTestId` — last resort
6. XPath/CSS — avoid

## Rules
- Never copy recordings directly into spec files
- Every recording must be analyzed and transformed to POM first
- Replace all `waitForTimeout()` with smart waits
- Extract repeated sequences into reusable methods
