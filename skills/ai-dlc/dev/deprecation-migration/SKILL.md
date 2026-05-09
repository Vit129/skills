---
name: deprecation-migration
description: Manages deprecation and migration of legacy code/APIs. Use when removing old systems, migrating users to new implementations, or sunsetting features. Code-as-liability mindset.
---

# Deprecation and Migration

## Overview

Every line of code is a liability — it must be maintained, tested, understood, and kept compatible. Code that no longer serves its purpose should be systematically removed, not left to rot. This skill provides patterns for safely deprecating and migrating away from legacy code.

## When to Use

- Replacing an old API/module with a new implementation
- Removing a feature that's no longer needed
- Migrating users from v1 to v2 of an interface
- Cleaning up dead code that's accumulated over time
- Sunsetting an external integration

## When NOT to Use

- Code is still actively used with no replacement planned
- You're unsure if the code is actually unused (measure first)
- The migration would break more than it fixes

## Core Principle: Code-as-Liability

```
Every line in the codebase:
├── Must compile/build
├── Must be tested (or risk silent breakage)
├── Must be understood by new team members
├── Must be updated when dependencies change
└── Must be considered during every refactor

Code that no longer serves a purpose = debt with daily interest.
Removing it = reducing maintenance burden.
```

## Deprecation Types

| Type | When | Enforcement |
|------|------|-------------|
| **Compulsory** | API/feature MUST be removed by deadline | Warning → Error → Remove |
| **Advisory** | Recommend migration, don't force | `@deprecated` + docs + no deadline |

## Deprecation Lifecycle

```
1. ANNOUNCE    → Mark deprecated (annotation + docs + runtime warning)
2. PROVIDE     → Migration path + tooling + examples
3. MONITOR     → Track usage (who still calls it? how often?)
4. DEADLINE    → Set removal date (communicate clearly)
5. REMOVE      → Delete code + clean up all references
```

### Step 1: Announce

```typescript
/**
 * @deprecated Use `fetchUserProfile()` instead. Will be removed in v3.0.
 * Migration guide: docs/migration/user-api-v3.md
 */
function getUser(id: string): Promise<User> {
  console.warn('getUser() is deprecated. Use fetchUserProfile() instead.');
  return fetchUserProfile(id);
}
```

Rules:
- State WHAT to use instead
- State WHEN it will be removed
- Link to migration guide
- Add runtime warning (log level: warn)

### Step 2: Provide Migration Path

```markdown
## Migration: getUser() → fetchUserProfile()

### Before
const user = await getUser(id);

### After
const profile = await fetchUserProfile(id);
// Note: response shape changed — `profile.name` replaces `user.fullName`

### Automated migration
npx codemod --transform ./codemods/user-api-v3.ts
```

Always provide:
- Before/after code examples
- Breaking changes highlighted
- Automated tooling when possible (codemods)
- Timeline for removal

### Step 3: Monitor Usage

```bash
# Find all callers
grep -r "getUser(" --include="*.ts" --include="*.tsx" | wc -l

# Track over time
# Week 1: 47 callers
# Week 2: 31 callers
# Week 3: 12 callers
# Week 4: 3 callers → contact remaining teams
```

### Step 4: Set Deadline

```
Deprecation announced: 2026-01-15
Migration deadline: 2026-03-15 (2 months)
Removal date: 2026-04-01

Communication:
- Email to all teams using the API
- Slack announcement in #engineering
- Warning in CI output
- Dashboard showing migration progress
```

### Step 5: Remove

```bash
# Final check: any remaining callers?
grep -r "getUser(" --include="*.ts" | grep -v "test" | grep -v "deprecated"

# If zero → safe to remove
# If non-zero → contact remaining callers, extend deadline or break
```

After removal:
- Delete the code
- Delete associated tests
- Delete migration docs (or archive)
- Update changelog
- Announce completion

## Migration Patterns

### Strangler Fig

Replace old system piece by piece — new code wraps old, gradually taking over.

```
Traffic → Router
           ├── /users (new service) ← migrated
           ├── /orders (new service) ← migrated
           └── /legacy/* (old system) ← shrinking
```

Use when: replacing a monolith with microservices, one endpoint at a time.

### Parallel Run

Run old + new simultaneously, compare outputs, switch when confident.

```typescript
async function getOrderTotal(orderId: string) {
  const [oldResult, newResult] = await Promise.all([
    legacyCalculator.getTotal(orderId),
    newCalculator.getTotal(orderId),
  ]);

  // Compare
  if (oldResult !== newResult) {
    logger.warn('Mismatch', { orderId, old: oldResult, new: newResult });
  }

  // Return old (safe) until confidence is high
  return oldResult;
}
```

Use when: correctness is critical (financial calculations, billing).

### Feature Flag Migration

```typescript
if (featureFlags.useNewCheckout(userId)) {
  return newCheckoutFlow(cart);
}
return legacyCheckoutFlow(cart);
```

```
Rollout: 5% → 25% → 50% → 100% → remove flag + old code
```

Use when: gradual user migration with easy rollback.

### Branch by Abstraction

1. Create abstraction layer over old code
2. Clients use abstraction (not old code directly)
3. Implement new version behind same abstraction
4. Switch abstraction to new implementation
5. Remove old implementation

Use when: deep dependency that many modules use.

## Dead Code Removal

### How to Identify Dead Code

```bash
# Unused exports (TypeScript)
npx ts-prune

# Unused files
npx unimported

# Unreachable code
# → IDE/linter warnings
# → Coverage reports (0% coverage = likely dead)
```

### Before Removing, Verify:

- [ ] No runtime references (reflection, dynamic imports, string-based lookups)
- [ ] No external callers (public API, other repos, scripts)
- [ ] Not loaded via config (plugin systems, DI containers)
- [ ] git blame shows no recent activity
- [ ] Tests don't reference it (or tests are also dead)

### Removal Checklist

- [ ] Remove the code
- [ ] Remove associated tests
- [ ] Remove imports/references
- [ ] Remove from config/DI if applicable
- [ ] Run full test suite
- [ ] Build succeeds

## Anti-Rationalization

| Excuse | Rebuttal |
|--------|----------|
| "Someone might need it later" | That's what version control is for. Deleted code is one `git log` away. |
| "It's not hurting anything" | It's hurting comprehension, build time, and maintenance burden. Every line has a cost. |
| "We don't have time to migrate" | You're paying maintenance cost every sprint. Migration is an investment that stops the bleeding. |
| "What if we break something?" | That's why we have tests, feature flags, and staged rollouts. Fear of breaking ≠ reason to keep dead code. |
| "The old API still works fine" | Working ≠ maintainable. Two ways to do the same thing = confusion for every new developer. |

## Red Flags

- Deprecated code with no migration path provided
- No deadline set (advisory deprecation that lasts forever)
- Removing code without checking for dynamic/runtime references
- Big-bang migration (all at once, no staged rollout)
- No monitoring of migration progress
- Deprecated code that's still being used in new features

## Verification

- [ ] Deprecation announced with clear timeline
- [ ] Migration path documented with before/after examples
- [ ] Usage monitored and tracked over time
- [ ] All callers migrated (or deadline enforced)
- [ ] Code removed cleanly (no orphaned tests/imports)
- [ ] Build + tests pass after removal
- [ ] Changelog updated
