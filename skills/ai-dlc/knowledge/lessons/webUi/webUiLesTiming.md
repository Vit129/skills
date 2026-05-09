# Web UI Timing Lessons

---
category: timing
workflow: webui_automation
updated: 2026-04-27
---

## LESSON-TIME-001: Timeout Waiting for Selector

**Severity:** High | **Tags:** timeout, selector, loading, overlay, waitForSelector

### Problem
Elements appear after API responses complete or loading spinners disappear.

```typescript
// BAD — fixed sleep
await page.waitForTimeout(3000);
await page.click('#submit-btn');
```

### Solution

```typescript
// GOOD — wait for loading to disappear
await page.waitForSelector('.loading', { state: 'hidden' });
await page.getByRole('button', { name: 'Submit' }).click();
```

**AI Instruction:** Never use `waitForTimeout()`. Always wait for a specific condition.

---

## LESSON-TIME-002: Element Covered by Loading Overlay

**Severity:** High | **Tags:** overlay, loading-spinner, modal, covered, intercept

### Problem
Loading spinners sit on top of page content and intercept pointer events.

```typescript
// BAD — overlay may still be visible
await page.getByRole('button', { name: 'Save' }).click();
```

### Solution

```typescript
// GOOD — wait for spinner to disappear first
await page.waitForSelector('.loading-spinner', { state: 'hidden' });
await page.getByRole('button', { name: 'Save' }).click();
```

**AI Instruction:** Before clicking any element that appears after a loading state, always add `waitForSelector('.loading-spinner', { state: 'hidden' })` first.

---

## LESSON-TIME-003: Data Not Loaded — Wait for API Response

**Severity:** Medium | **Tags:** api-response, waitForResponse, data-load, empty-state, async

### Problem
Tables and dashboards populate data from API calls made after page load.

```typescript
// BAD — asserts before API responds
await page.goto('/dashboard');
await expect(page.getByRole('row')).toHaveCount(10); // May see 0 rows
```

### Solution

```typescript
// GOOD — wait for API response first
await page.goto('/dashboard');
await page.waitForResponse(
  res => res.url().includes('/api/dashboard/data') && res.status() === 200
);
await expect(page.getByRole('row')).toHaveCount(10);
```

**AI Instruction:** After navigating to a page that loads data from an API, always add `waitForResponse()` for the relevant endpoint before asserting.

---

## LESSON-TIME-004: Navigation Timeout — Page Loads Slowly

**Severity:** Medium | **Tags:** navigation, timeout, goto, networkidle, slow-page

### Problem
`page.goto()` default timeout may be too short for slow pages. The default 'load' event fires before async resources finish.

```typescript
// BAD — may timeout on slow pages
await page.goto('/heavy-dashboard');
```

### Solution

```typescript
// GOOD — wait for network to settle
await page.goto('/heavy-dashboard', { waitUntil: 'networkidle' });

// GOOD — increase timeout for known slow page
await page.goto('/reports', {
  waitUntil: 'networkidle',
  timeout: 30000
});
```

**AI Instruction:** For pages with many async resources, use `goto()` with `waitUntil: 'networkidle'`. For known slow pages, also increase the timeout.
