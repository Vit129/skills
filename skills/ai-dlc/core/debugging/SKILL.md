---
name: debugging
description: Systematic root-cause debugging with structured triage. Use when tests fail, builds break, or behavior doesn't match expectations. Stop-the-line, reproduce, localize, fix, guard.
---

# Debugging and Error Recovery

## Overview

When something breaks: stop, preserve evidence, follow structured triage. Guessing wastes time. This works for test failures, build errors, runtime bugs, and flaky tests.

## When to Use

- Tests fail after a code change
- Build breaks
- Runtime behavior doesn't match expectations
- Something worked before and stopped working
- Flaky test needs investigation

## The Stop-the-Line Rule

```
1. STOP adding features or making changes
2. PRESERVE evidence (error output, logs, repro steps)
3. DIAGNOSE using triage checklist
4. FIX root cause
5. GUARD against recurrence (regression test)
6. RESUME only after verification passes
```

Don't push past a failing test to work on the next feature. Errors compound.

## Triage Checklist

Work through in order. Do not skip steps.

### Step 1: Reproduce

Make the failure happen reliably.

```
Can you reproduce?
├── YES → Step 2
└── NO
    ├── Timing-dependent? → Add timestamps, try with delays, run under load
    ├── Environment-dependent? → Compare versions, env vars, data state
    ├── State-dependent? → Check leaked state, globals, shared caches
    └── Truly random? → Add defensive logging, document conditions, monitor
```

For test failures:
```bash
# Run specific failing test
npx playwright test --grep "test name"

# Run in isolation (rules out test pollution)
npx playwright test specific-file.spec.ts

# Run with trace
npx playwright test --trace on
```

### Step 2: Localize

Narrow down WHERE:

```
Which layer?
├── UI/Frontend     → Console, DOM, network tab
├── API/Backend     → Server logs, request/response
├── Database        → Queries, schema, data integrity
├── Build tooling   → Config, dependencies, environment
├── External service → Connectivity, API changes, rate limits
└── Test itself     → Is the test correct? (false negative)
```

For regression bugs — use bisection:
```bash
git bisect start
git bisect bad
git bisect good <known-good-sha>
git bisect run npx playwright test --grep "failing test"
```

### Step 3: Reduce

Create minimal failing case:
- Remove unrelated code until only the bug remains
- Simplify input to smallest example that triggers failure
- Strip test to bare minimum that reproduces

Minimal reproduction makes root cause obvious.

### Step 4: Fix Root Cause

Fix the underlying issue, not the symptom:

```
Symptom: "API returns duplicate records"

Symptom fix (BAD): → Deduplicate in frontend
Root cause fix (GOOD): → Fix the JOIN query that produces duplicates
```

Ask "Why does this happen?" until you reach the actual cause.

### Step 5: Guard Against Recurrence

Write a regression test:

```typescript
test('should not return duplicates when user has multiple roles', async () => {
  // Setup: user with 2 roles
  // Act: call the endpoint
  // Assert: no duplicate records
});
```

This test must FAIL without the fix and PASS with it.

### Step 6: Verify End-to-End

```bash
# Run the specific test
npx playwright test --grep "specific test"

# Run full suite (check for regressions)
npx playwright test

# Build (check for type/compilation errors)
npm run build
```

## Error-Specific Patterns

### Test Failure Triage

```
Test fails after code change:
├── Changed code the test covers?
│   ├── Test outdated → Update test
│   └── Code has bug → Fix code
├── Changed unrelated code?
│   └── Side effect → Check shared state, imports, globals
└── Test was already flaky?
    └── Timing issues, order dependence, external deps
```

### Playwright-Specific Triage

```
Playwright test fails:
├── Timeout → Element not found? Page not loaded? Network slow?
├── Locator error → Element changed? Use more stable locator
├── Assertion error → Expected value wrong? Timing issue?
├── Navigation error → URL changed? Redirect? Auth expired?
└── Flaky (passes sometimes)
    ├── Race condition → Add proper waitFor, not waitForTimeout
    ├── Test isolation → Shared state between tests?
    └── External dependency → Mock it or add retry logic
```

### Build Failure Triage

```
Build fails:
├── Type error → Read error, check types at cited location
├── Import error → Module exists? Exports match? Paths correct?
├── Config error → Check build config syntax/schema
├── Dependency error → Run npm install, check versions
└── Environment error → Node version, OS compatibility
```

## Anti-Rationalization

| Excuse | Rebuttal |
|--------|----------|
| "I know what the bug is, I'll just fix it" | You're right 70% of the time. The other 30% costs hours. Reproduce first. |
| "The failing test is probably wrong" | Verify that assumption. If test is wrong, fix it. Don't skip it. |
| "It works on my machine" | Environments differ. Check CI, config, dependencies. |
| "I'll fix it in the next commit" | Fix it now. Next commit introduces new bugs on top. |
| "This is a flaky test, ignore it" | Flaky tests mask real bugs. Fix the flakiness. |
| "Let me try one more thing" | If you've tried 2 approaches and failed → stop, diagnose root cause, try fundamentally different approach. |

## Red Flags

- Skipping a failing test to work on new features
- Guessing at fixes without reproducing
- Fixing symptoms instead of root causes
- "It works now" without understanding what changed
- No regression test after a bug fix
- Multiple unrelated changes while debugging (contaminating the fix)
- Retrying the same approach 3+ times

## Verification

After fixing a bug:

- [ ] Root cause identified and documented
- [ ] Fix addresses root cause, not just symptoms
- [ ] Regression test exists that fails without the fix
- [ ] All existing tests pass
- [ ] Build succeeds
- [ ] Original bug scenario verified end-to-end
