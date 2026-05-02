# Playwright TypeScript Standards

> **⚠️ Important:** This file defines the TypeScript coding standards for Playwright projects.
> **🎯 Purpose:** Keep automation code predictable, readable, and type-safe across API and Web UI tests.

---

## Variable Declarations

- Do not use `var`.
- Prefer `const` by default.
- Use `let` only when reassignment is required.
- Keep variable names descriptive and consistent with the existing naming conventions.

### Examples

```typescript
const loginButton = page.getByRole('button', { name: L.login });
const expectedStatus = 200;

let response;
for (let attempt = 0; attempt < 3; attempt++) {
  response = await request.get('/api/status');
  if (response.ok()) break;
}
```

```typescript
var loginButton = page.locator('#login-btn');
```

## Type Safety

- Do not use `any` unless there is a documented exception that cannot be avoided.
- Prefer explicit `type` or `interface` definitions for fixtures, API payloads, API responses, helper inputs, and helper outputs.
- Use `unknown` for external or unvalidated data, then narrow the type before use.
- Add return types for exported functions and class methods when the intent is not obvious from the implementation.

### Type Narrowing Patterns

Use these patterns to narrow `unknown` before accessing properties:

```typescript
// typeof — for primitives
function formatValue(value: unknown): string {
  if (typeof value === 'string') return value.toUpperCase();
  if (typeof value === 'number') return value.toFixed(2);
  throw new Error('Unsupported value type');
}

// instanceof — for class instances
if (error instanceof Error) {
  console.error(error.message);
}

// in — for object shape check
function isLoginResponse(value: unknown): value is LoginResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'token' in value &&
    'expiresAt' in value
  );
}

// nullish check — most common
function getLabel(sector: string | undefined): string {
  if (!sector) return 'Unknown';
  return sector.toUpperCase(); // TS knows sector is string here
}
```

### Examples

```typescript
// ✅ unknown + type guard
type LoginResponse = {
  token: string;
  expiresAt: string;
};

const body: unknown = await response.json();

if (!isLoginResponse(body)) {
  throw new Error('Unexpected login response shape');
}

function isLoginResponse(value: unknown): value is LoginResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'token' in value &&
    'expiresAt' in value
  );
}
```

```typescript
// ❌ any — skips type checking entirely
const body: any = await response.json();
```

## Optional Values and `undefined`

- Do not assign `undefined` explicitly unless required by an external API contract.
- Prefer optional properties (`field?: Type`) when a value may be absent.
- Prefer `Type | null` only when `null` is a meaningful business value.
- Use explicit nullish checks before accessing optional values.
- Avoid wide unions that hide the real data shape.

### Examples

```typescript
type SearchFilters = {
  companyCode?: string;
  customerCode?: string;
};

if (filters.companyCode === undefined) {
  throw new Error('companyCode is required for this scenario');
}
```

```typescript
type SearchFilters = {
  companyCode: string | undefined;
};

const filters = {
  companyCode: undefined,
};
```

## Error Handling

- In `catch` blocks, the error variable is typed as `unknown` by default (TypeScript strict mode). Always narrow before accessing properties.
- Wrap `async` functions that call external APIs or perform I/O in `try/catch`.
- Prefer `instanceof Error` as the first narrowing check. Fall back to `typeof` or a custom type guard for non-Error throws.

### Examples

```typescript
// ✅ catch narrowing
try {
  await page.goto('/dashboard');
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error('Navigation failed:', error.message);
  } else {
    console.error('Unknown error:', String(error));
  }
}

// ✅ async function with try/catch
async function fetchPortfolio(): Promise<PortfolioResponse> {
  try {
    const response = await request.get('/api/portfolio');
    const body: unknown = await response.json();
    if (!isPortfolioResponse(body)) throw new Error('Unexpected response shape');
    return body;
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error('fetchPortfolio failed with unknown error');
  }
}
```

```typescript
// ❌ accessing error.message without narrowing
try {
  await page.goto('/dashboard');
} catch (error) {
  console.error(error.message); // error is unknown — may crash
}
```

---

## Import Type

- Use `import type` when importing only types, interfaces, or type aliases — not runtime values.
- This ensures the import is fully erased at compile time, preventing accidental side effects and improving build performance.

### Examples

```typescript
// ✅ import type for type-only imports
import type { Locator, Page } from '@playwright/test';
import type { HoldingData } from '../fixtures/port/holdings/holdingsData';

// ✅ mixed import — runtime value + type in one line
import { expect, type Page } from '@playwright/test';
```

```typescript
// ❌ regular import when only the type is used
import { Page } from '@playwright/test'; // Page is never instantiated — use import type
```

---

## Assertion Messages

Add a custom `message` to `expect()` when the assertion context is not obvious from the locator alone — especially in multi-step flows or when the same locator is asserted multiple times.

This makes CI failure logs immediately readable without opening a trace.

### Examples

```typescript
// ✅ message on non-obvious assertions
await expect(this.formPanel).toBeVisible({
  message: 'Form panel should appear after clicking Add',
});

await expect(this.tableContainer).toContainText(ticker, {
  message: `Holding ${ticker} should appear in table after save`,
});

// ✅ simple, obvious assertion — message not required
await expect(this.metricsSection).toBeVisible();
```

```typescript
// ❌ no message on complex flow — hard to debug in CI
await expect(this.formPanel).not.toBeVisible();
// Which step caused this? After save? After cancel? After delete?
```

> **Rule:** Add `message` when the same locator appears in multiple assertions, or when the assertion is inside a helper method that is called from many tests.

---

## Await All Playwright Actions

Always `await` every Playwright API call. Missing `await` causes the action to be skipped silently — the test may pass while the action never executed.

Use ESLint rule [`@typescript-eslint/no-floating-promises`](https://typescript-eslint.io/rules/no-floating-promises/) to catch missing awaits automatically.

> Source: [playwright.dev/docs/best-practices — Lint your tests](https://playwright.dev/docs/best-practices#lint-your-tests)

### Examples

```typescript
// ✅ awaited
await page.getByRole('button', { name: 'Submit' }).click();
await expect(this.formPanel).toBeVisible();

// ❌ missing await — action is skipped, test may still pass
page.getByRole('button', { name: 'Submit' }).click();
expect(this.formPanel).toBeVisible();
```

---

## Readonly Locators in Page Objects

Declare all locator properties as `readonly` in Page Object classes. Locators are initialized once in the constructor and should never be reassigned.

> Source: [playwright.dev/docs/pom](https://playwright.dev/docs/pom) — official POM example uses `readonly` on every locator.
> TypeScript: `readonly` prevents reassignment after initialization.

### Examples

```typescript
// ✅ readonly locators
export class HoldingsPage extends BasePage {
  readonly metricsSection: Locator;
  readonly tableContainer: Locator;
  readonly btnAddHolding: Locator;

  constructor(page: Page) {
    super(page);
    this.metricsSection = page.getByTestId('holdings-metrics-section');
    this.tableContainer = page.getByTestId('holdings-table-container');
    this.btnAddHolding  = page.getByTestId('btn-add-holding');
  }
}

// ❌ no readonly — locator can be accidentally reassigned
export class HoldingsPage extends BasePage {
  metricsSection: Locator;
}
```

---

## Playwright-Specific Guidance

- Type fixture extensions, helper factories, and shared data explicitly.
- Type parsed API responses before asserting on nested fields.
- Use narrowed values before passing data into Page Objects or helper methods.
- When a temporary escape hatch is unavoidable, keep the unsafe cast as local and as small as possible.

## Review Checklist

- Is every variable declared with `const` unless reassignment is required?
- Is `let` used only where the value changes?
- Is `var` fully absent?
- Is `any` avoided or explicitly justified?
- Are external values typed as `unknown` until validated?
- Are optional values modeled without unnecessary explicit `undefined` assignment?
- Are `catch` blocks narrowing the error type before accessing properties?
- Are `async` functions that call external APIs wrapped in `try/catch`?
- Are type-only imports using `import type`?
- Do complex or reused assertions include a `message` for CI readability?
- Are all Playwright API calls awaited?
- Are all locator properties in Page Objects declared as `readonly`?
