# Dead Code Removal

## How to Identify

```bash
# Unused exports (TypeScript)
npx ts-prune

# Unused files
npx unimported

# Unreachable code → IDE/linter warnings, coverage reports (0% = likely dead)
```

## Before Removing, Verify

- [ ] No runtime references (reflection, dynamic imports, string-based lookups)
- [ ] No external callers (public API, other repos, scripts)
- [ ] Not loaded via config (plugin systems, DI containers)
- [ ] git blame shows no recent activity
- [ ] Tests don't reference it (or tests are also dead)

## Removal Checklist

- [ ] Remove the code
- [ ] Remove associated tests
- [ ] Remove imports/references
- [ ] Remove from config/DI if applicable
- [ ] Run full test suite
- [ ] Build succeeds
