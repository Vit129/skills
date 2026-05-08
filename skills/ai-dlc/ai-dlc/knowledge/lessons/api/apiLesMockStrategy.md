# API Mock Strategy Lessons

---
category: mock_strategy
workflow: api_automation
updated: 2026-04-27
---

## LESSON-MOCK-001: APIRequestContext Does Not Support route() Interception

**Severity:** High | **Tags:** mock, route, interception, APIRequestContext, method-override

### Context
Playwright's `page.route()` intercepts browser-initiated requests. `APIRequestContext` makes direct HTTP calls that bypass the browser entirely.

### Problem
- Error: `page.route()` mock has no effect on APIRequestContext calls
- Cause: APIRequestContext bypasses the browser network stack

```typescript
// BAD — route() has no effect on APIRequestContext
await page.route('**/api/users', route => {
  route.fulfill({ json: { users: [] } });
});
// This mock is never triggered when using apiContext.get('/api/users')
```

### Solution
Override the service method directly in the Arrange step.

```typescript
// GOOD — override service method in Arrange step
const mockResponse = { users: [{ id: 1, name: 'Mock User' }] };
apiClient.userService.getUsers = async () => mockResponse;

const result = await apiClient.userService.getUsers();
expect(result.users).toHaveLength(1);
```

**AI Instruction:** When mocking API responses in API-layer tests using APIRequestContext, use method override instead of `page.route()`.

---

## LESSON-MOCK-002: Module-Level Store Causes Parallel Test Data Leakage

**Severity:** Medium | **Tags:** parallel, isolation, state, module-level, DatabaseHelper, leak

### Context
When tests run in parallel, shared module-level state causes data from one test to bleed into another.

### Problem
- Error: Tests interfere with each other when running in parallel
- Cause: Module-level store is shared across all parallel test workers

```typescript
// BAD — module-level store shared across parallel tests
const store: Record<string, User> = {}; // Shared by all workers!
export class DatabaseHelper {
  async seedUser(data: UserData) { store[data.id] = data; }
}
```

### Solution
Move store into class instance (private maps).

```typescript
// GOOD — instance-level store, isolated per test
export class DatabaseHelper {
  private userStore = new Map<string, User>();

  async seedUser(data: UserData): Promise<string> {
    const id = `user-${Date.now()}`;
    this.userStore.set(id, { ...data, id });
    return id;
  }

  async cleanup(id: string): Promise<void> {
    this.userStore.delete(id);
  }
}
```

**AI Instruction:** When generating DatabaseHelper classes, always use private instance Maps instead of module-level variables.

---

## LESSON-MOCK-003: In-Memory Mock DB Pattern for Tests Without Real Database

**Severity:** Low | **Tags:** mock-db, in-memory, Map, seed, cleanup, testId, isolation

### Context
When no real database is available (demo, CI without DB, POC), an in-memory Map-based DatabaseHelper can fully replace real DB operations.

### Problem
- Error: Tests cannot run without a real database connection
- Cause: Hard dependency on real database

```typescript
// BAD — hard dependency on real database
const db = new PostgresClient(process.env.DATABASE_URL);
```

### Solution
Use in-memory Map with testId prefix to prevent data collision.

```typescript
// GOOD — in-memory mock DB
export class EMRDatabaseHelper {
  private patients = new Map<string, Patient>();

  async seedPatient(testId: string, data: PatientData): Promise<string> {
    const id = `${testId}-patient-${Date.now()}`;
    this.patients.set(id, { ...data, id });
    return id;
  }

  async cleanup(testId: string): Promise<void> {
    for (const [key] of this.patients) {
      if (key.startsWith(testId)) this.patients.delete(key);
    }
  }
}
```

**AI Instruction:** When generating DatabaseHelper for environments without real DB, use in-memory Map with testId-prefixed keys. Always implement `seed()`, `get()`, and `cleanup(testId)` methods.
