# Resources Discovery

Find what already exists before building anything new.

## When to use
- Starting work on a new feature in an existing codebase
- About to create a new utility, component, or helper
- Want to avoid duplicating work that's already been done

## How it works
1. **Check what exists** — scan the codebase for related files, classes, methods
2. **Classify each asset:**
   - `reuse` — already does what you need, use as-is
   - `extend` — close enough, add a method or parameter
   - `create` — nothing exists, build from scratch
3. **Find similar work** — search for features with similar patterns, learn from their structure
4. **Gap analysis** — list what's missing and estimate effort
5. **Decide strategy** — mostly reuse? mostly create? adapt existing?

## Tips
- Always search before creating — the #1 source of tech debt is duplicate code nobody knew existed
- Search by abstract concept, not exact name — "auth flow" might be called `loginService`, `authHelper`, or `tokenManager`
- If >60% can be reused, the feature is cheaper than it looks
- If <30% can be reused, consider whether the existing architecture fits at all

## Classification decision tree
```
Does existing code do exactly what I need?
  → Yes: reuse
  → Partially: extend
  → No match at all: create
```
