# API Network Lessons

---
category: network
workflow: api_automation
updated: 2026-04-27
---

## LESSON-NET-001: 500 Internal Server Error — System Failure

**Severity:** High | **Tags:** 500, server-error, skip, infrastructure

### Context
A 500 error means the server crashed or encountered an unhandled exception. This is almost always a backend bug — not a test code problem.

### Problem
- Error: `500 Internal Server Error`
- Cause: Backend system failure — unhandled exception, database error, or infrastructure issue
- Antipattern: Trying to fix test code when the server returns 500

### Solution
Skip the test and report the 500 to the dev team.

```typescript
// GOOD — skip and report
test.skip('[TC001] create user', async () => {
  // Skipped: POST /users returns 500 — backend issue, reported to dev team
});
```

**AI Instruction:** When a test fails with 500, do NOT attempt to heal the test code. Mark the test as skipped with a comment explaining it is a server-side issue.

---

## LESSON-NET-002: Request Timeout — Progressive Debugging Strategy

**Severity:** High | **Tags:** timeout, ETIMEDOUT, ECONNREFUSED, slow-api, progressive-debug

### Context
Timeouts can have many root causes: slow database queries, network issues, server overload, or a too-short timeout setting.

### Problem
- Error: `Request Timeout / ETIMEDOUT / ECONNREFUSED`
- Antipattern: Permanently increasing timeout without investigating root cause

```typescript
// BAD — permanent timeout increase without investigation
test.setTimeout(120000); // Just made it longer, didn't fix anything
```

### Solution — Progressive Debugging

**Round 1 — Quick Fix (Unblock):**
```typescript
await page.waitForResponse(
  res => res.url().includes('/api/data'),
  { timeout: 60000 } // Temporary increase
);
```

**Round 2 — Root Cause Analysis:**
1. Check Network Log: Does request reach server?
2. Check API Endpoint: Is URL correct?
3. Check Server Status: Is API server running normally?
4. Check Request Payload: Is sent data complete?
5. Check Database: Is query slow or deadlocked?

**Round 3 — Permanent Fix:**
- API slow → Optimize query, add index, or cache
- Network slow → Check VPN, proxy, firewall
- Payload large → Reduce size or use pagination
- Server overload → Scale resources or load balance

**AI Instruction:** When a test fails with timeout, apply Round 1 to unblock, then add a TODO comment to investigate root cause.

---

## LESSON-NET-003: CORS Error — Use APIRequestContext Instead of page.request

**Severity:** Medium | **Tags:** cors, cross-origin, APIRequestContext, browser-context

### Context
CORS is enforced by browsers, not servers. APIRequestContext bypasses the browser entirely and is not subject to CORS restrictions.

### Problem
- Error: `CORS Error / Access-Control-Allow-Origin missing`
- Cause: API call made through browser page context

```typescript
// BAD — uses browser context, subject to CORS
const response = await page.request.get('https://api.other-domain.com/data');
```

### Solution

```typescript
// GOOD — direct HTTP, no CORS
import { request } from '@playwright/test';

const apiContext = await request.newContext({
  baseURL: 'https://api.other-domain.com'
});
const response = await apiContext.get('/data');
expect(response.status()).toBe(200);
```

**AI Instruction:** For API tests, always use `playwright.request.newContext()` instead of `page.request`.
