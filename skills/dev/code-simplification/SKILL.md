---
name: code-simplification
description: Simplifies code for clarity without changing behavior. Use when code works but is harder to read, maintain, or extend than it should be. Chesterton's Fence, Rule of 500, incremental refactoring.
---

# Code Simplification

## Overview

Reduce complexity while preserving exact behavior. The goal is not fewer lines — it's code that is easier to read, understand, modify, and debug. Test: "Would a new team member understand this faster than the original?"

## When to Use

- After a feature works and tests pass, but implementation feels heavy
- During code review when complexity is flagged
- Deeply nested logic, long functions, unclear names
- Refactoring code written under time pressure
- Consolidating duplicated logic

## When NOT to Use

- Code is already clean — don't simplify for the sake of it
- You don't understand what the code does yet — comprehend first
- Performance-critical code where "simpler" = measurably slower
- About to rewrite the module entirely

## Five Principles

### 1. Preserve Behavior Exactly

```
Before every change, ask:
→ Same output for every input?
→ Same error behavior?
→ Same side effects and ordering?
→ All existing tests pass WITHOUT modification?
```

If tests need modification → you changed behavior, not simplified.

### 2. Chesterton's Fence

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

### 3. Prefer Clarity Over Cleverness

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

### 4. Follow Project Conventions

Simplification = making code more consistent with the codebase, not imposing preferences.

- Match import ordering, naming, error handling patterns
- Simplification that breaks project consistency = churn, not improvement

### 5. Scope to What Changed

- Default to simplifying recently modified code
- Avoid drive-by refactors of unrelated code
- Unscoped simplification = noise in diffs + regression risk

## Process

### Step 1: Understand (Chesterton's Fence)

Read context, git blame, tests. Don't touch until you understand why.

### Step 2: Identify Opportunities

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
| Factory-for-a-factory | Direct approach |

### Step 3: Apply Incrementally

```
FOR EACH SIMPLIFICATION:
1. Make the change
2. Run tests
3. Pass → commit (or continue)
4. Fail → revert and reconsider
```

**Rule of 500:** If refactoring touches 500+ lines → use automation (codemod, AST transform) instead of manual edits.

### Step 4: Verify

```
COMPARE BEFORE AND AFTER:
- Is simplified version genuinely easier to understand?
- Did you introduce patterns inconsistent with codebase?
- Is the diff clean and reviewable?
- Would a teammate approve this?
```

If "simplified" version is harder to understand → revert.

## Anti-Rationalization

| Excuse | Rebuttal |
|--------|----------|
| "It's working, don't touch it" | Working code that's hard to read = hard to fix when it breaks. Simplifying saves time on every future change. |
| "Fewer lines = simpler" | 1-line nested ternary ≠ simpler than 5-line if/else. Simplicity = comprehension speed. |
| "I'll simplify this unrelated code too" | Unscoped simplification = noisy diffs + regression risk. Stay focused. |
| "This abstraction might be useful later" | Speculative abstraction = complexity without value. Remove, re-add when needed. |
| "The original author had a reason" | Maybe. Check git blame (Chesterton's Fence). But accumulated complexity often has no reason — just residue of iteration under pressure. |
| "I'll refactor while adding this feature" | Separate refactoring from feature work. Mixed changes = harder to review/revert. |

## Red Flags

- Simplification requires modifying tests (you changed behavior)
- "Simplified" code is longer and harder to follow
- Renaming to match your preferences vs project conventions
- Removing error handling for "cleanliness"
- Simplifying code you don't fully understand
- Batching many simplifications into one large commit
- Refactoring outside scope without being asked

## Verification

- [ ] All existing tests pass WITHOUT modification
- [ ] Build succeeds with no new warnings
- [ ] Each simplification is incremental and reviewable
- [ ] Simplified code follows project conventions
- [ ] No error handling removed or weakened
- [ ] No dead code left behind
- [ ] Diff is clean — no unrelated changes


---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| Git history (`git blame`, `git log`) | Version control | Understand why code exists (Chesterton's Fence) |
| Test suite (unit + integration) | Quality gate | Verify behavior preserved after each change |
| Project conventions (lint, style) | Standards | Ensure simplified code matches codebase style |
| `knowledge/lessons/` | Lessons learnt | Check before execute |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After identifying opportunities | Checkbox (confirm which to address) | After listing structural/naming/redundancy issues |
| Before each refactor step | Single select (proceed/skip/alternative) | Before applying each simplification |
| After completion | Open field | Review diff for unintended changes |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.

## Self-Learning

After user approves the output:

1. **Record good example:** Save approved output to `knowledge/lessons/refactoring/{pattern}.md`
2. **Record failures:** If output was rejected → note what went wrong for next time
3. **Progressive update:** If a new pattern proved effective → append to relevant knowledge index
4. **Confidence tracking:** `confidence: 1.0` (user-approved) vs `confidence: 0.7` (auto-generated)
