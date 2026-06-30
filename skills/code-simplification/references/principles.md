# Five Principles of Code Simplification

## 1. Preserve Behavior Exactly

```
Before every change, ask:
→ Same output for every input?
→ Same error behavior?
→ Same side effects and ordering?
→ All existing tests pass WITHOUT modification?
```

If tests need modification → you changed behavior, not simplified.

## 2. Chesterton's Fence

> Before removing/changing code that looks unnecessary → understand WHY it exists first.

```
BEFORE SIMPLIFYING:
- What is this code's responsibility?
- What calls it? What does it call?
- What are the edge cases?
- Check git blame: what was the original context?
- Why might it have been written this way? (Performance? Bug fix? Platform constraint?)
```

If you can't answer these → you're not ready to simplify.

## 3. Prefer Clarity Over Cleverness

```typescript
// UNCLEAR: Dense ternary chain
const label = isNew ? 'New' : isUpdated ? 'Updated' : isArchived ? 'Archived' : 'Active';

// CLEAR: Readable
function getStatusLabel(item: Item): string {
  if (item.isNew) return 'New';
  if (item.isUpdated) return 'Updated';
  if (item.isArchived) return 'Archived';
  return 'Active';
}
```

```typescript
// UNCLEAR: Chained reduce with inline logic
const result = items.reduce((acc, item) => ({
  ...acc, [item.id]: { ...acc[item.id], count: (acc[item.id]?.count ?? 0) + 1 }
}), {});

// CLEAR: Named intermediate step
const countById = new Map<string, number>();
for (const item of items) {
  countById.set(item.id, (countById.get(item.id) ?? 0) + 1);
}
```

## 4. Follow Project Conventions

Simplification = making code more consistent with the codebase, not imposing preferences.
- Match import ordering, naming, error handling patterns
- Simplification that breaks project consistency = churn, not improvement

## 5. Scope to What Changed

- Default to simplifying recently modified code
- Avoid drive-by refactors of unrelated code
- Unscoped simplification = noise in diffs + regression risk
