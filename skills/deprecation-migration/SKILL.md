---
name: deprecation-migration
description: Manages deprecation and migration of legacy code/APIs. Use when removing old systems, migrating users to new implementations, or sunsetting features. Code-as-liability mindset.
version: 2.0.0
last_improved: 2026-06-30
improvement_count: 1
---

# Deprecation and Migration

Every line of code is a liability. Systematically remove what no longer serves a purpose.

---

## Load Right Reference

| Task | Load |
|------|------|
| Announce → monitor → deadline → remove a deprecated API | `references/lifecycle.md` |
| Choose a migration strategy (strangler fig, parallel run, etc.) | `references/patterns.md` |
| Identify and remove dead code | `references/dead-code.md` |

---

## Anti-Rationalization

| Excuse | Rebuttal |
|--------|----------|
| "Someone might need it later" | That's what version control is for. One `git log` away. |
| "It's not hurting anything" | It's hurting comprehension, build time, and maintenance burden. Every line has a cost. |
| "We don't have time to migrate" | You're paying maintenance cost every sprint. Migration stops the bleeding. |
| "What if we break something?" | That's why we have tests, feature flags, and staged rollouts. |
| "The old API still works fine" | Working ≠ maintainable. Two ways to do the same thing = confusion for every new developer. |

---

## Red Flags

- Deprecated code with no migration path provided
- No deadline set (advisory deprecation that lasts forever)
- Removing code without checking for dynamic/runtime references
- Big-bang migration (all at once, no staged rollout)
- No monitoring of migration progress
- Deprecated code still being used in new features
