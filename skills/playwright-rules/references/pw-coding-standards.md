# Playwright Testing - Global Coding Standards (Constitution)

> **⚠️ CRITICAL:** This file is the **"Constitution"** (Global Master Rules).
> **🎯 Purpose:** Core rules and strategies that AI Agents must use for decision-making and quality control across all dimensions.

---

## PART 1: AI Governance & Behavior

### 1. AI Roles & Perspectives (Core Methodology)

When assigned a task, always analyze through these 4 perspectives:

- **🏗️ Architect:** Plan file structures (Folder Structure) and design flexible Shared Helpers.
- **👨‍💻 Developer:** Write Clean Code, use English for Test names (or as instructed), and handle errors systematically.
- **⚖️ Reviewer:** Verify compliance with CRITICAL RULES and data security.
- **⚡ Performance:** Prioritize API Setup over UI Setup (Hybrid Testing) for execution speed.

### 2. Communication Protocol (Interaction Rules)

- **CoT (Chain-of-Thought):** Always analyze the Root Cause before fixing and propose alternatives (LATS).
- **Ask Before Write:** **MUST** request confirmation before creating or modifying files, specifying the file path and rationale.
- **Language Policy:** Technical documentation and code MUST be in English. Use Thai only for user-facing messages or when specifically requested.

---

## PART 2: Automation Strategy (Decision Strategy)

### 1. Automation Priority Table

Agents must verify priority and create automation according to this order (referenced from @testScenario2026.md):

| Priority | API Automation | Web UI Automation | Strategy |
| :--- | :--- | :--- | :--- |
| **Critical** | ✅ Mandatory | ✅ Mandatory | Immediate Action (E2E Full Coverage) |
| **High** | ✅ Mandatory | ✅ Mandatory | Immediate Action (Focus on Core Flows) |
| **Medium** | ✅ Mandatory | ⚠️ Optional | Complete API coverage first; UI is secondary |
| **Low** | ✅ Mandatory | 🚫 Skip | API only to define scope |

### 2. Hybrid Execution Strategy

- **Setup/Teardown:** Use API for data preparation (Set up data) even for UI testing.
- **⚡ High-Speed Auth (MANDATORY):** Avoid UI-based login in every test case. Use API `POST /login` to obtain a Token and generate `storageState` to reduce test execution time (except for tests specifically designed to validate the Login page).
- **♻️ Shared Fixtures (MANDATORY):** Business data used in both API and Web UI tests (e.g., search keywords, codes) MUST be stored in `tests/shared-fixtures/` to ensure a single source of truth.
- **Single Source of Truth:** Test data must come from JSON or `.ts` data files only. Never hardcode data in Spec files.

---

## PART 3: Global Restrictions (Strict Rules)

1. **✅ Use .env for Config:** Use `.env` to store Configuration (URL, Credentials) **separated by environment (.env, .env.local, .env.sit, .env.uat)**.
   - **Sensitive data (MUST be in .env):** credentials, tokens, passwords, secrets, emails used for login, API keys, OAuth URLs (e.g., Microsoft login URL)
   - **Non-sensitive data (MUST be in .ts fixture):** business data such as companyCode, customerCode, invoiceNumber, productCode, project-level username/role identifiers, etc.
   - **⚠️ Rule:** `process.env.X` in fixture files is allowed ONLY for sensitive data. Business data must be hardcoded in fixture, not read from `.env`.
   - **⚠️ Double Login Rule:** When a feature requires 2 login layers (e.g., Microsoft SSO + project-level auth), SSO credentials/URL go in `.env`; project-level user identifiers (username, role, companyCode) go in `fixtures/`.
2. **✅ Use .ts for Test Data:** Use `.ts` files for Test Data **separated by environment**.
   - **Folder:** kebab-case (all lowercase with hyphens) e.g., `fixtures/shopee-payment/`.
   - **File Naming:** lowerCamelCase (starts with lowercase, no hyphens) e.g., `shopeePaymentData.ts`.
3. **🚫 No Inline Logic:** Do not write logic to find elements or call APIs directly in `.spec.ts` files. **Must always go through POM/Helper.**
4. **🚫 No Hard Wait:** Never use `waitForTimeout()`. Use Smart Wait or Web-First Assertions instead.
5. **🎯 Selector Priority (Locator Strategy):**
   - **1st:** `getByTestId('x')` — scope/container
   - **2nd:** `getByRole('button', { name: L.key })` — buttons, links, headings (Labels.ts)
   - **3rd:** `getByPlaceholder(L.key)` or `getByPlaceholder(/th|en/i)` — input fields without visible label (use Labels.ts, support regex for TH/EN)
   - **Last resort:** `locator('css')` — only when no semantic locator is possible
5. **🏷️ Mandatory Tags:** Every Test file and Test Case must have 2 levels of Tags (`@Important`, `@Scenario`).
6. **📁 Shared Fixtures Location:** For cross-layer data (API + UI), use `tests/shared-fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/`.
7. **🌐 English Naming:** `test.describe()` and `test()` names must be in clear, easy-to-understand English.
8. **🚀 Test Independence:** Test Scenarios must be designed to be Independent, not sharing state or relying on results from other tests, to support Playwright's Parallel execution.

---

## PART 4: Shared Standard Utilities

### 1. File & Data Handling

Use `.env` for Configuration and `.ts` for Test Data:

```typescript
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load Environment Config
dotenv.config({ path: `.env.${process.env.ENV || 'sit'}` });

// Load Test Data from .ts
import testData from '../fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[SYSTEM_FEATURE_CAMEL]Data';
```

### 2. Standard Helper Patterns

- **Random Data:** Use `Date.now()` or `Math.random()` for Dynamic Input (like reference numbers).
- **Status/Response Validation:** Every API call must include standard Status Code and Schema checks.
- **🏗️ Component-Based Pattern:** For common UI parts (Sidebar, TopNav, Modal), separate into a `Component` class and call it within the Page Object instead of duplicating code.
- **🚀 Worker-Scoped Fixtures:** For Data creation or resource-intensive tasks (e.g., Connect DB, Create Master Data), use `scope: 'worker'` to run once per Worker, significantly reducing total test time.

---

## PART 5: Reference Links

For in-depth practical implementation (Technical Details), follow the Domain Rules:

- 🌐 **UI Standards:** `@ai-agent/rules/playwright/webUi.md`
- 🔌 **API Standards:** `@ai-agent/rules/playwright/api.md`

---

## PART 6: Test Structure Patterns (by Design Technique)

> These patterns define HOW to structure test code when implementing scenarios designed with specific techniques.
> EP and BVA need no special pattern — use standard AAA with inline values.

### 1. Base-Choice (BC) Pattern

**When:** Scenario set has 1 base E2E + N variations (1 param changed per variation).

**Structure:**

```typescript
test.describe('@Critical @CreateOrder Base-Choice Coverage', () => {
  const baseData = { amount: 100, paymentMethod: 'cash', deliveryType: 'standard' };

  test('create order with all default values [Base]', async ({ api }) => {
    const res = await api.createOrder(baseData);
    expect(res.status).toBe(201);
  });

  const variations = [
    { name: 'credit card payment', override: { paymentMethod: 'credit' } },
    { name: 'express delivery', override: { deliveryType: 'express' } },
    { name: 'zero amount (boundary)', override: { amount: 0 }, expectFail: true },
  ];

  for (const v of variations) {
    test(`create order with ${v.name} [Variation]`, async ({ api }) => {
      const data = { ...baseData, ...v.override };
      const res = await api.createOrder(data);
      if (v.expectFail) {
        expect(res.status).toBe(400);
      } else {
        expect(res.status).toBe(201);
      }
    });
  }
});
```

**Rules:**
- Base test is always first and explicitly named `[Base]`
- Variations use spread override pattern: `{ ...baseData, ...v.override }`
- Use `for...of` loop, NOT `test.describe.each` (better readability in reports)

### 2. Multiple-Choice (MC) Pattern — Data-Driven from Fixture

**When:** Pairwise/combinatorial matrix generated externally (PICT tool).

**Structure:**

```typescript
import combos from '../fixtures/order/pairwiseCombinations.json';

test.describe('@High @CreateOrder Pairwise Coverage', () => {
  for (const combo of combos) {
    test(`create order: ${combo.label} [Combo]`, async ({ api }) => {
      const res = await api.createOrder(combo.data);
      expect(res.status).toBe(combo.expectedStatus);
    });
  }
});
```

**Rules:**
- Combination matrix generated OUTSIDE test code (PICT output → committed JSON file)
- JSON fixture location: `fixtures/[system-kebab]/[feature]Combinations.json`
- Each combo object must have: `label`, `data`, `expectedStatus`
- NEVER generate combinations inside test code

### 3. State Transition (ST) Pattern

**When:** Feature has explicit states with transitions.

**Structure:**

```typescript
test.describe('@Critical @OrderLifecycle State Transitions', () => {
  test('transition: pending → confirmed [State]', async ({ api, orderHelper }) => {
    // Arrange — use API helper to reach starting state
    const order = await orderHelper.setupInState('pending');

    // Act — trigger transition
    const res = await api.confirmOrder(order.id);

    // Assert — verify new state AND side effects
    expect(res.status).toBe(200);
    expect(res.body.state).toBe('confirmed');
    expect(res.body.confirmedAt).toBeTruthy();
  });

  test('invalid transition: cancelled → confirmed [State]', async ({ api, orderHelper }) => {
    const order = await orderHelper.setupInState('cancelled');
    const res = await api.confirmOrder(order.id);
    expect(res.status).toBe(422);
    expect(res.body.error).toContain('invalid transition');
  });
});
```

**Rules:**
- NEVER navigate through UI to reach a state — use `setupInState(targetState)` API helper
- `setupInState` helper lives in `helpers/[feature]Helper.ts`
- Each test asserts BOTH: new state value + side effects (timestamps, notifications, etc.)
- Invalid transition tests assert rejection (422/400) with clear error message

### 4. Transition Tree / W-method Pattern

**When:** Complex state machine requiring systematic full-path coverage.

**Structure:**

```typescript
import paths from '../fixtures/payment/transitionTreePaths.json';

test.describe('@Critical @PaymentFSM W-method Coverage', () => {
  for (const path of paths) {
    test(`path: ${path.label} [W-method]`, async ({ api, paymentHelper }) => {
      let current = await paymentHelper.setupInState(path.steps[0].fromState);

      for (const step of path.steps) {
        const res = await paymentHelper.triggerEvent(current.id, step.event);
        expect(res.body.state).toBe(step.toState);
        current = res.body;
      }

      // Final state verification
      expect(current.state).toBe(path.finalState);
      for (const check of path.verify) {
        expect(current[check.field]).toBe(check.expected);
      }
    });
  }
});
```

**Rules:**
- Paths stored as committed JSON fixture (generated from FSM diagram)
- Fixture location: `fixtures/[system-kebab]/transitionTreePaths.json`
- Each path object: `{ label, steps: [{ fromState, event, toState }], finalState, verify: [{ field, expected }] }`
- State model diagram MUST exist in `agent-memory/plans/[feature]/outputs/inception/planning/` BEFORE writing path fixtures
- Use generic walker loop — don't hardcode state sequences in test code

### 5. Helper Requirements for State-Based Tests

Every stateful feature requires a helper class:

```typescript
// helpers/orderHelper.ts
export class OrderHelper {
  constructor(private api: ApiClient) {}

  async setupInState(targetState: string): Promise<Order> {
    // Use API shortcuts to reach target state directly
    // e.g., pending → create; confirmed → create + confirm; shipped → create + confirm + ship
  }

  async triggerEvent(orderId: string, event: string): Promise<ApiResponse> {
    // Map event names to API calls
  }
}
```

**Rules:**
- One helper per stateful feature
- `setupInState` uses fastest API path (no UI)
- `triggerEvent` maps event name → API call (used by W-method walker)
- Helper registered as Playwright fixture for DI

### 6. Security Testing Patterns

> **Full rules in dedicated skill:** `rules/security/SKILL.md`
> Covers: unauthorized access, permission matrix, IDOR, injection, rate limit, file upload, mobile.
> Load when Pre-flight Q5 = Yes or feature has auth/permission/user input.

**Quick reference:**
- Tag: `@Security` on every security test
- Fixtures: `fixtures/security/` (permissionMatrix, injectionPayloads, expiredTokens)
- Pipeline: `continueOnError: false` — security failures BLOCK pipeline
