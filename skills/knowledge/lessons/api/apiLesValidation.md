# API Validation Lessons

---
category: validation
workflow: api_automation
updated: 2026-04-27
---

## LESSON-VAL-001: Mock Database for Demo/POC Environments

**Severity:** Medium | **Tags:** mock, database, demo, poc, environment, infrastructure

### Context
In demo or POC environments, a real database is often not available. Tests that depend on actual DB connections fail with connection timeouts.

### Problem
- Error: `Database connection timeout in demo environment`
- Cause: Tests require real database connection that doesn't exist in demo/POC environment
- Antipattern: Skipping all tests when database is unavailable

### Solution
Implement mock database operations that return success values.

```typescript
// GOOD — mock DB operations for demo environment
class MockDatabaseHelper {
  async seedUser(data: UserData): Promise<string> {
    return `mock-user-${Date.now()}`; // No real DB call
  }
  async cleanup(id: string): Promise<void> {
    // No-op in demo environment
  }
}
```

**AI Instruction:** When generating tests for demo/POC environments, create a MockDatabaseHelper that mirrors the real helper's interface but returns mock data.

---

## LESSON-VAL-002: Environment vs Code Logic Error — Know When NOT to Heal

**Severity:** High | **Tags:** healing, environment, 404, 500, infrastructure, self-healing

### Context
Self-healing should only attempt to fix code logic errors. Infrastructure errors (404, 500, connection refused) cannot be fixed by changing test code.

### Problem
- Error: All tests fail with 404 or 500
- Cause: API endpoints don't exist yet, server is down, or environment is misconfigured
- Antipattern: Attempting to heal test code when the failure is an infrastructure issue

### Solution
Classify failures before healing:

**Environment errors — DO NOT HEAL, report to team:**
- 404: API endpoint doesn't exist
- 500: Server crashed
- ECONNREFUSED: Server not running
- All tests fail simultaneously

**Code logic errors — HEAL these:**
- Element not found (wrong selector)
- Assertion failed (wrong expected value)
- Timeout (missing wait)
- Type error (wrong data structure)

**AI Instruction:** Before attempting self-healing, classify the error. If 404/500/connection refused or ALL tests fail simultaneously → stop healing, report as infrastructure issue. Only heal individual test failures caused by code logic.
