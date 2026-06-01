# Web UI Locator Strategy Lessons

---
category: locators
workflow: webui_automation
updated: 2026-04-27
---

## LESSON-UI-001: Replace CSS ID Selectors with getByRole for Button Locators

**Severity:** Medium | **Tags:** locator, getByRole, css-selector, accessibility, stability

### Problem
CSS id selectors like `#btn-search` are fragile — they break when developers rename IDs during refactoring.

```typescript
// BAD — fragile CSS id selector
await page.locator('#btn-search').click();
```

### Solution

```typescript
// GOOD — semantic role locator
await page.getByRole('button', { name: 'Search Flights' }).click();
```

**AI Instruction:** Always prefer `getByRole('button', { name: '...' })` over CSS id selectors. Only use `getByTestId()` when the button has no meaningful accessible name.

---

## LESSON-UI-002: Use filter({ hasText }) Instead of nth()/first()

**Severity:** Medium | **Tags:** locator, filter, hasText, list, nth, index-based

### Problem
Selecting list items by index (`nth(0)`, `first()`) is brittle — the order can change.

```typescript
// BAD — index-based, breaks when order changes
await page.getByRole('listitem').first().click();
```

### Solution

```typescript
// GOOD — content-based, resilient to order changes
await page.getByRole('listitem')
  .filter({ hasText: 'TG-001 Bangkok → Tokyo' })
  .getByRole('button', { name: 'Select' })
  .click();
```

**AI Instruction:** Always use `.filter({ hasText: '...' })` to target by content. Never use `.nth()` or `.first()` unless position is semantically meaningful.

---

## LESSON-UI-003: Inline HTML Mock via page.setContent()

**Severity:** Low | **Tags:** mock, setContent, page-object, isolation, html-mock

### Problem
Tests require a running backend server. Duplicating inline HTML mock in every test case is hard to maintain.

```typescript
// BAD — HTML mock duplicated in every test
test('test 1', async ({ page }) => {
  await page.setContent('<html>...(100 lines)...</html>');
});
```

### Solution
Centralize the HTML mock in the Page Object's `setupMockPage()` method.

```typescript
// GOOD — centralized in Page Object
export class FlightBookingPage {
  async setupMockPage(): Promise<void> {
    await this.page.setContent(`<html><body><!-- mock --></body></html>`);
  }
}

test('test 1', async ({ page }) => {
  const flightPage = new FlightBookingPage(page);
  await flightPage.setupMockPage(); // Reusable
});
```

**AI Instruction:** When generating tests that use inline HTML mocks, always centralize the HTML in a `setupMockPage()` method in the Page Object.
