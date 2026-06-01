# Web UI Workflow & MUI Lessons

---
category: workflow
workflow: webui_automation
updated: 2026-05-21
---

## LESSON-WF-001: Multi-Outcome Click — Use Promise.race() Not isVisible()

**Severity:** High | **Tags:** MUI, dialog, overlay, Promise.race, isVisible, branching

### Problem
After clicking a button, the UI may branch into 2+ different states (e.g., success page vs error modal vs approval flow). Using `isVisible()` is unreliable when MUI Dialog overlays cover the page — the overlay intercepts pointer events and can make `isVisible()` return `false` even when the element is rendered.

```typescript
// BAD — MUI overlay makes isVisible() unreliable
await confirmBtn.click();
if (await errorModal.isVisible()) { /* may never enter here */ }
```

### Solution
Use `Promise.race()` with `waitFor()` to detect which outcome appeared first.

```typescript
// GOOD — race between possible outcomes
const result = await Promise.race([
  outcomeA.waitFor({ state: 'visible', timeout: 10000 }).then(() => 'a'),
  outcomeB.waitFor({ state: 'visible', timeout: 10000 }).then(() => 'b'),
]).catch(() => 'unknown');

if (result === 'a') { /* handle outcome A */ }
if (result === 'b') { /* handle outcome B */ }
```

**When to apply:** Any click that can lead to 2+ different UI states — success vs error, normal flow vs approval flow, modal vs page navigation.

**AI Instruction:** When implementing a click that has multiple possible outcomes (documented in test scenario or AGENTS.md), always use `Promise.race()` pattern. Never use `isVisible()` for branching logic on MUI-based UIs.

---

## LESSON-WF-002: Backend Transient Errors — Retry with Promise.race()

**Severity:** High | **Tags:** retry, transient, error-modal, backend, flaky

### Problem
Non-production environments (SIT/UAT) have intermittent backend errors that show a retry modal. Tests fail if not handled.

```typescript
// BAD — no retry handling
await searchBtn.click();
await resultElement.waitFor({ state: 'visible' }); // timeout if error modal appears
```

### Solution
Wrap actions with a retry loop that detects the error modal.

```typescript
// GOOD — retry pattern
for (let attempt = 0; attempt < 3; attempt++) {
  const result = await Promise.race([
    expectedElement.waitFor({ state: 'visible', timeout: 15000 }).then(() => 'ok'),
    retryButton.waitFor({ state: 'visible', timeout: 15000 }).then(() => 'error'),
  ]).catch(() => 'timeout');
  if (result === 'ok') return;
  if (result === 'error') { await retryButton.click(); continue; }
}
throw new Error('Failed after retries');
```

**AI Instruction:** When the project's AGENTS.md or known patterns mention transient backend errors, wrap navigation and search actions with this retry pattern. The retry button text varies per project — check the UI labels file.

---

## LESSON-WF-003: Check Default Values Before Adding Interaction Code

**Severity:** Medium | **Tags:** dropdown, default, scroll, unnecessary-code, efficiency

### Problem
Writing code to scroll to and select a dropdown value that is already the default — wastes time debugging scroll issues and adds unnecessary flakiness.

```typescript
// BAD — spent time debugging scroll when value was already correct
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await plantDropdown.click();
await page.getByRole('option', { name: '0200 - Head Office' }).click();
```

### Solution
Before writing selection code:
1. Use chrome-devtools MCP `take_snapshot` or run headed to check the current default
2. If default matches test requirement → skip the interaction
3. Only add select logic when the value must change from default

```typescript
// GOOD — only interact when value needs to change
// Default is already '0200 - Head Office' → no action needed
// If test requires different plant:
// await selectPlant('0300 - Other Plant');
```

**AI Instruction:** Before implementing dropdown/select interactions, verify what the default value is. If the test data matches the default, skip the interaction entirely. Ask the user or use devtools to confirm defaults.

---

## LESSON-WF-004: Debugging Workflow — Use DevTools MCP First

**Severity:** High | **Tags:** debugging, chrome-devtools, workflow, efficiency, snapshot

### Problem
Inefficient debug loop: run test → fail → read error → guess fix → run again → repeat 10+ times. Each cycle takes 1-3 minutes.

### Solution
When encountering a new page or failing locator:
1. **First**: Use `take_snapshot` (chrome-devtools MCP) to see the live DOM/a11y tree
2. **Identify** the correct locator from the snapshot
3. **Write** code with the verified locator
4. **Run** test → should pass in 1-2 attempts

**When to use chrome-devtools MCP:**
- New page/modal you haven't automated before
- Locator not working and error message is unclear
- Need to verify what's actually rendered vs what you expect
- Checking if an element is behind an overlay

**AI Instruction:** When a test fails with locator/visibility errors and the cause is not immediately obvious, use chrome-devtools MCP to inspect the live page state before attempting code fixes. Do not iterate blindly.

---

## LESSON-WF-005: MUI Dropdown Locator Pattern

**Severity:** Medium | **Tags:** MUI, dropdown, select, button, listbox, locator

### Problem
MUI dropdowns render as `button` elements with `aria-haspopup="listbox"`, not as native `<select>`. Standard `selectOption()` does not work.

```typescript
// BAD — MUI dropdown is not a native select
await page.getByLabel('Plant').selectOption('0200');
```

### Solution
Click the button to open the listbox, then select the option by role.

```typescript
// GOOD — MUI dropdown pattern
// Option A: by adjacent text label
await page.getByText('โรงงาน').locator('..').getByRole('button').click();
await page.getByRole('option', { name: '0200 - Head Office' }).click();

// Option B: by nth index (when no unique label)
await page.locator('[aria-haspopup="listbox"]').nth(0).click();
await page.getByRole('option', { name: value, exact: true }).first().click();
```

**AI Instruction:** When the UI uses MUI (Material-UI), dropdowns are `button` elements. Use `getByRole('button')` to open and `getByRole('option')` to select. Never use `selectOption()` on MUI components.

---

## LESSON-WF-006: Test Data Minimalism

**Severity:** Low | **Tags:** test-data, performance, flakiness, efficiency

### Problem
Using more test data than needed (e.g., 5 products when 1 suffices) makes tests slower and more prone to transient failures.

### Solution
Use the minimum data needed to trigger the scenario:
- Credit over limit → 1 product with sufficient amount
- Cart validation → only add multiple products when testing count/bulk behavior
- Search → 1 unique code that returns exactly 1 result

**AI Instruction:** When creating test data, use the minimum items needed to trigger the target scenario. More items = more API calls = more chances for transient failures. Only use multiple items when the test specifically validates quantity-related behavior.
