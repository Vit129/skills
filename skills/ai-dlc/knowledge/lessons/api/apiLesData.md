# API Data Lessons

---
category: data
workflow: api_automation
updated: 2026-04-27
---

## LESSON-DATA-001: 404 Not Found — Resource Missing or Wrong Endpoint

**Severity:** Medium | **Tags:** 404, not-found, endpoint, resource

### Context
A 404 can mean either the resource genuinely doesn't exist (expected behavior to test) or the endpoint URL is wrong. Distinguishing between these two cases is critical.

### Problem
- Error: `404 Not Found`
- Cause: Resource not found (expected) OR incorrect endpoint URL (test setup error)
- Antipattern: Treating all 404s as failures without checking intent

```typescript
// BAD — assumes 404 is always wrong
expect(response.status()).toBe(200); // Fails when 404 is expected
```

### Solution
Assert the status code that matches the test intent.

```typescript
// GOOD — positive test: resource exists
const response = await request.get(`/users/${existingId}`);
expect(response.status()).toBe(200);

// GOOD — negative test: resource should not exist
const response = await request.get(`/users/${nonExistentId}`);
expect(response.status()).toBe(404);
```

**AI Instruction:** When generating tests for GET by ID, always generate both a positive case (existing ID → 200) and a negative case (non-existent ID → 404).

---

## LESSON-DATA-002: 400 Bad Request — Validation Error

**Severity:** Medium | **Tags:** 400, validation, bad-request, required-fields

### Context
APIs validate incoming data before processing. Missing required fields, wrong data types, or values outside allowed ranges all return 400.

### Problem
- Error: `400 Bad Request — Validation Error`
- Cause: Missing required fields, wrong data type, or value outside allowed range
- Antipattern: Only testing the happy path without validation coverage

```typescript
// BAD — only happy path, no validation test
test('create user', async () => {
  const response = await request.post('/users', { data: validUser });
  expect(response.status()).toBe(201);
});
```

### Solution

```typescript
// GOOD — validation test
test('create user — missing email returns 400', async () => {
  const response = await request.post('/users', {
    data: { name: 'John' } // missing required email
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body).toHaveProperty('errors');
});
```

**AI Instruction:** For every POST/PUT endpoint, generate at least one validation test case with a missing required field. Assert both status 400 and the error response structure.

---

## LESSON-DATA-003: JSON Parse Error — Response is Not JSON

**Severity:** Medium | **Tags:** json, parsing, response, content-type

### Context
Not all API responses are JSON. Error pages, redirects, and some legacy endpoints return HTML or plain text.

### Problem
- Error: `JSON Parse Error / SyntaxError: Unexpected token`
- Cause: `response.json()` called on a response that returns HTML, plain text, or empty body

```typescript
// BAD — blindly parsing as JSON
const body = await response.json(); // Throws if response is HTML
```

### Solution

```typescript
// GOOD — safe parsing with content-type check
const contentType = response.headers()['content-type'] ?? '';
if (contentType.includes('application/json')) {
  const body = await response.json();
} else {
  const text = await response.text();
  console.log('Non-JSON response:', text);
  throw new Error(`Expected JSON but got: ${contentType}`);
}
```

**AI Instruction:** When generating response assertions, check content-type before calling response.json(). For debugging, use response.text() to log the raw response.

---

## LESSON-DATA-004: Duplicate Data Error — Static Test Data Already Exists

**Severity:** High | **Tags:** test-data, duplicate, unique, DataGenerator, timestamp

### Context
Tests that create resources using static data fail on the second run because the resource already exists.

### Problem
- Error: `409 Conflict / Duplicate data in system`
- Cause: Using static test data that persists in the database between test runs

```typescript
// BAD — static data, fails on second run
const newUser = { email: 'test@example.com', name: 'Test User' };
```

### Solution

```typescript
// GOOD — unique data per run
const timestamp = Date.now();
const newUser = {
  email: `test.${timestamp}@example.com`,
  name: `Test User ${timestamp}`
};

// Or using DataGenerator helper
const uniqueCode = `TEST${DataGenerator.generate_number(1000, 9999)}`;
```

**AI Instruction:** When generating POST test data, always append Date.now() or a random suffix to unique fields. Never use hardcoded static values for fields that must be unique.

---

## LESSON-DATA-005: Response Structure Mismatch — Data Wrapped in payload Object

**Severity:** Medium | **Tags:** response, payload, wrapper, structure

### Context
Some APIs wrap their response data in an envelope structure like `{ payload: {...}, status: 'OK' }`.

### Problem
- Error: `Cannot read properties of undefined`
- Cause: Accessing data directly without unwrapping the envelope

```typescript
// BAD — ignores wrapper structure
const body = await response.json();
expect(body.content).toHaveLength(10); // body.content is undefined!
```

### Solution

```typescript
// GOOD — unwrap payload envelope
const body = await response.json();
// body = { payload: { content: [...], total: 10 }, status: 'OK' }
const data = body.payload.content;
expect(data).toHaveLength(10);
```

**AI Instruction:** Before generating response assertions, check if the API uses an envelope wrapper. Always access the actual data through the correct nested path.
