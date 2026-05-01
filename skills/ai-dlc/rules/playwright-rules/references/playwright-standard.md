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

### Examples

```typescript
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
