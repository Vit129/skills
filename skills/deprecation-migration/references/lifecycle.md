# Deprecation Lifecycle

## Core Principle: Code-as-Liability

Every line in the codebase must compile, be tested, be understood by new team members, be updated when dependencies change, and be considered during every refactor. Code that no longer serves a purpose = debt with daily interest. Removing it = reducing maintenance burden.

## Deprecation Types

| Type | When | Enforcement |
|------|------|-------------|
| **Compulsory** | API/feature MUST be removed by deadline | Warning → Error → Remove |
| **Advisory** | Recommend migration, don't force | `@deprecated` + docs + no deadline |

## Lifecycle: 5 Steps

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

Rules: state WHAT to use instead, WHEN it will be removed, link to migration guide, add runtime warning (log level: warn).

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

Always provide: before/after code examples, breaking changes highlighted, automated tooling when possible (codemods), timeline for removal.

### Step 3: Monitor Usage

```bash
# Find all callers
grep -r "getUser(" --include="*.ts" --include="*.tsx" | wc -l

# Track over time
# Week 1: 47 callers → Week 4: 3 callers → contact remaining teams
```

### Step 4: Set Deadline

```
Deprecation announced: 2026-01-15
Migration deadline: 2026-03-15 (2 months)
Removal date: 2026-04-01
```

Communication: email to all teams, Slack announcement in #engineering, warning in CI output, dashboard showing migration progress.

### Step 5: Remove

```bash
# Final check: any remaining callers?
grep -r "getUser(" --include="*.ts" | grep -v "test" | grep -v "deprecated"
# If zero → safe to remove
```

After removal: delete the code, delete associated tests, delete migration docs (or archive), update changelog, announce completion.

## Verification Checklist

- [ ] Deprecation announced with clear timeline
- [ ] Migration path documented with before/after examples
- [ ] Usage monitored and tracked over time
- [ ] All callers migrated (or deadline enforced)
- [ ] Code removed cleanly (no orphaned tests/imports)
- [ ] Build + tests pass after removal
- [ ] Changelog updated
