# LESSON-LOC-001: Multiple Elements Match — Locator Not Specific Enough

---
id: LESSON-LOC-001
category: locator
severity: High
tags: locator, strict-mode, multiple-elements, getByTestId, filter
workflow: webui_automation
updated: 2026-04-27
---

## Context

Playwright runs in strict mode by default — if a locator matches more than one element, it throws a 'strict mode violation' error.

## Problem

- Error: `strict mode violation: locator resolved to N elements`
- Cause: Locator matches multiple elements on the page

```typescript
// BAD — matches all buttons with text 'Submit'
await page.getByText('Submit').click(); // Fails if multiple 'Submit' buttons exist
```

## Solution

Use `getByTestId` for unique identification, or add `filter()` to narrow down.

```typescript
// GOOD — unique test ID
await page.getByTestId('submit-order-btn').click();

// GOOD — filter by parent context
await page.getByRole('form', { name: 'Order Form' })
  .getByRole('button', { name: 'Submit' })
  .click();

// GOOD — filter by visible text in a list
await page.getByRole('listitem')
  .filter({ hasText: 'Order #12345' })
  .getByRole('button', { name: 'Submit' })
  .click();
```

## AI Instruction

When a locator might match multiple elements, use `getByTestId()` for unique elements, or chain `.filter({ hasText })` or parent context locators to narrow the match to exactly one element.
