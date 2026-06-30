# Simplification Process

## Step 1: Understand (Chesterton's Fence)

Read context, git blame, tests. Don't touch until you understand why.

## Step 2: Identify Opportunities

**Structural complexity:**

| Signal | Problem | Fix |
|--------|---------|-----|
| Nesting 3+ levels | Hard to follow | Guard clauses / early return |
| Function 50+ lines | Multiple responsibilities | Split into focused functions |
| Nested ternaries | Mental stack required | if/else or lookup object |
| Boolean params `fn(true, false, true)` | Unclear intent | Options object or separate functions |
| Repeated conditionals | Same check everywhere | Extract to named predicate |

**Naming:**

| Signal | Fix |
|--------|-----|
| Generic: `data`, `result`, `temp` | Rename to describe content: `userProfile`, `validationErrors` |
| Abbreviated: `usr`, `cfg`, `btn` | Full words (unless universal: `id`, `url`, `api`) |
| Misleading: `get` that mutates | Rename to reflect actual behavior |
| Comment explaining "what" | Delete — code is clear enough |
| Comment explaining "why" | Keep — carries intent code can't express |

**Redundancy:**

| Signal | Fix |
|--------|-----|
| Same 5+ lines in multiple places | Extract to shared function |
| Dead code, unreachable branches | Remove (after confirming dead) |
| Wrapper that adds no value | Inline it |

## Step 3: Apply Incrementally

```
FOR EACH SIMPLIFICATION:
1. Make the change
2. Run tests
3. Pass → commit (or continue)
4. Fail → revert and reconsider
```

**Rule of 500:** If refactoring touches 500+ lines → use automation (codemod, AST transform).

## Step 4: Verify

```
COMPARE BEFORE AND AFTER:
- Is simplified version genuinely easier to understand?
- Did you introduce patterns inconsistent with codebase?
- Is the diff clean and reviewable?
- Would a teammate approve this?
```

If "simplified" version is harder to understand → revert.
