# LESSON-SETUP-001: Playwright request Fixture from beforeAll Cannot Be Reused

---
id: LESSON-SETUP-001
category: setup
severity: High
tags: setup, fixture, beforeAll, APIRequestContext, playwright
workflow: api_automation
updated: 2026-04-27
---

## Context

Playwright's built-in `request` fixture is scoped to the test function. Capturing it in `beforeAll` and reusing it in test cases causes lifecycle errors.

## Problem

- Error: `Fixture { request } from beforeAll cannot be reused in a test`
- Cause: Playwright's request fixture is test-scoped — it cannot be captured in beforeAll

```typescript
// BAD — request fixture captured in beforeAll
let req: APIRequestContext;
beforeAll(async ({ request }) => {
  req = request; // This will throw when used in test
});
```

## Solution

Create APIRequestContext manually using `playwright.request.newContext()` in beforeAll and dispose it in afterAll.

```typescript
// GOOD — manual APIRequestContext
import { request as playwrightRequest } from '@playwright/test';

let requestContext: APIRequestContext;

beforeAll(async () => {
  requestContext = await playwrightRequest.newContext({
    baseURL: process.env.API_BASE_URL
  });
});

afterAll(async () => {
  await requestContext.dispose();
});

test('GET /users', async () => {
  const response = await requestContext.get('/users');
  expect(response.status()).toBe(200);
});
```

## AI Instruction

When generating API test suites that need a shared request context, always use `playwrightRequest.newContext()` in beforeAll with a matching `dispose()` in afterAll. Never capture the built-in request fixture in beforeAll.
