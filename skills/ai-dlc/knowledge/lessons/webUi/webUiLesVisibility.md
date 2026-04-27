# Web UI Visibility Lessons

---
category: visibility
workflow: webui_automation
updated: 2026-04-27
---

## LESSON-VIS-001: Element Not Visible — Hidden by CSS or Not Yet Loaded

**Severity:** Medium | **Tags:** visibility, hidden, css, display-none, toBeVisible

### Problem
Elements can be hidden via `display:none`, `visibility:hidden`, `opacity:0`, or not yet added to the DOM.

```typescript
// BAD — element is hidden because form wasn't submitted
await expect(page.locator('#success-message')).toBeVisible();
```

### Solution
Identify why the element is hidden and take the appropriate action first.

```typescript
// GOOD — trigger the action that makes element visible
await page.getByRole('button', { name: 'Submit' }).click();
await expect(page.getByText('Success! Your order has been placed.')).toBeVisible();

// GOOD — wait for async element to appear
await expect(page.locator('[data-testid="result-panel"]')).toBeVisible({ timeout: 10000 });
```

**AI Instruction:** When asserting element visibility, first identify what triggers the element to appear. Generate the trigger action before the visibility assertion.

---

## LESSON-VIS-002: Element Is Disabled — Fill Required Fields Before Clicking

**Severity:** Medium | **Tags:** disabled, enabled, required-fields, form-validation, toBeEnabled

### Problem
Submit buttons are often disabled until all required form fields are filled. Clicking a disabled button has no effect — it doesn't throw an error, it just does nothing.

```typescript
// BAD — button is disabled, click has no effect
await page.getByRole('button', { name: 'Submit Order' }).click();
// Nothing happened — next assertion fails
```

### Solution
Fill all required fields and verify the button is enabled before clicking.

```typescript
// GOOD — fill required fields, verify enabled, then click
await page.getByLabel('Full Name').fill('John Doe');
await page.getByLabel('Email').fill('john@example.com');

await expect(page.getByRole('button', { name: 'Submit Order' })).toBeEnabled();
await page.getByRole('button', { name: 'Submit Order' }).click();
```

**AI Instruction:** Before generating a button click step, check if the button has enable conditions. Generate all prerequisite fill steps first, then add `toBeEnabled()` assertion before the click.
