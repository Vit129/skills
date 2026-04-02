# Playwright Recorder Analyzer

Transform Playwright Codegen recordings (test-*.spec.ts) into proper Page Object Model code.

## When to use
- Have a Playwright recording that needs to be converted to POM
- Need to extract locators, actions, and flows from recorded tests

## Extraction Checklist

| Category | Extract | Pattern |
|----------|---------|---------|
| Locators | getByRole, getByLabel, getByPlaceholder, getByText, getByTestId | `page.getBy*()` |
| Actions | click, fill, selectOption, check | `await page.*()` |
| Flow | Navigation order | `goto()`, `click()` chain |
| Waits | waitForURL, waitForSelector, waitForLoadState | `waitFor*()` |
| Data | Input values | `fill()`, `selectOption()` values |

## Process
1. Read recording file (test-*.spec.ts)
2. Extract: locators, actions, navigation flow, waits, form data
3. Validate locator priority — flag violations:
   - XPath, CSS-only → flag as violation
   - getByTestId as first choice → suggest getByRole/getByLabel if available
4. Identify patterns:
   - Forms → `fillForm(data)`
   - Tables → `clickRowAction(row, action)`
   - Wizards → `completeWizard(steps)`
5. Transform to Page Object — methods from actions, improved locators, test data as JSON
6. Replace hard waits with smart waits

## Locator priority
1. `getByRole` — semantic elements
2. `getByLabel` — form fields with labels
3. `getByPlaceholder` — inputs
4. `getByText` — non-interactive text
5. `getByTestId` — last resort
6. XPath/CSS — avoid

## Pattern Transformations

### Form Filling
```typescript
// ❌ Recording: getByTestId('username').fill('admin')
// ✅ POM: getByLabel('Username').fill(username)  // if <label> exists
```

### Table Interaction
```typescript
// ❌ Recording: locator('button[title="Edit"]').click()
// ✅ POM: row.getByRole('button', { name: 'Edit' }).click()
```

### Hard Waits
```typescript
// ❌ Recording: waitForTimeout(3000)
// ✅ POM: waitForSelector('.data-loaded') or waitForResponse()
```

## Rules
- Never copy recordings directly into spec files
- Every recording must be analyzed and transformed to POM first
- Replace all `waitForTimeout()` with smart waits
- Extract repeated sequences into reusable methods
- Flag all locator violations with suggestions
