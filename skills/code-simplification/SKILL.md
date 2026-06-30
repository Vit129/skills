---
name: code-simplification
description: Simplifies code for clarity without changing behavior. Use when code works but is harder to read, maintain, or extend than it should be. Chesterton's Fence, Rule of 500, incremental refactoring.
version: 2.0.0
last_improved: 2026-06-30
improvement_count: 1
---

# Code Simplification

Reduce complexity while preserving exact behavior. Goal: code easier to read, understand, modify, and debug.

---

## When to Use

- After a feature works and tests pass, but implementation feels heavy
- Deeply nested logic, long functions, unclear names
- Consolidating duplicated logic

## When NOT to Use

- Code is already clean
- You don't understand what the code does yet — comprehend first
- Performance-critical code where "simpler" = measurably slower
- About to rewrite the module entirely

---

## Load Right Reference

| Task | Load |
|------|------|
| Preserve behavior, Chesterton's Fence, clarity, conventions, scope | `references/principles.md` |
| Step-by-step process + opportunity identification tables | `references/process.md` |

---

## Anti-Rationalization

| Excuse | Rebuttal |
|--------|----------|
| "It's working, don't touch it" | Working code that's hard to read = hard to fix when it breaks. |
| "Fewer lines = simpler" | 1-line nested ternary ≠ simpler than 5-line if/else. Simplicity = comprehension speed. |
| "I'll simplify this unrelated code too" | Unscoped simplification = noisy diffs + regression risk. Stay focused. |
| "This abstraction might be useful later" | Speculative abstraction = complexity without value. Remove, re-add when needed. |
| "I'll refactor while adding this feature" | Separate refactoring from feature work. Mixed changes = harder to review/revert. |
| "The original author had a reason" | Maybe. Check git blame (Chesterton's Fence). But accumulated complexity often has no reason. |

---

## Red Flags

- Simplification requires modifying tests (you changed behavior)
- "Simplified" code is longer and harder to follow
- Removing error handling for "cleanliness"
- Simplifying code you don't fully understand
- Refactoring outside scope without being asked
