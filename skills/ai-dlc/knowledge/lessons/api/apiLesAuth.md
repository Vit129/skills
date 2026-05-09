# LESSON-AUTH-001: 401 Unauthorized — Token Expired or Incorrect

---
id: LESSON-AUTH-001
category: auth
severity: High
tags: auth, 401, token, bearer, beforeEach
workflow: api_automation
updated: 2026-04-27
---

## Context

API tests that require authentication must obtain a valid token before each request. Tokens expire and cannot be reused across test sessions. Hardcoding tokens or reusing them from a previous run causes 401 failures that are hard to distinguish from real auth bugs.

## Problem

- Error: `401 Unauthorized`
- Pattern: `401|Unauthorized|Invalid token`
- Cause: Token expired, incorrect credentials, or token not refreshed before test

### Antipattern

Hardcoding or reusing token across tests — tokens expire, making tests non-deterministic.

```typescript
// BAD — hardcoded token
const headers = { Authorization: 'Bearer eyJhbGc...' };
```

## Solution

Always obtain a fresh token in beforeEach or beforeAll using a dedicated auth helper.

```typescript
// GOOD — fresh token per test suite
let authToken: string;
beforeAll(async () => {
  authToken = await api.getAuthToken(username, password);
});

test('GET /users', async () => {
  const response = await request.get('/users', {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  expect(response.status()).toBe(200);
});
```

## AI Instruction

Always generate a beforeAll/beforeEach block that calls getAuthToken() and stores the result. Never hardcode tokens in test files.
