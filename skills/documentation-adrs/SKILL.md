---
name: documentation-adrs
description: Architecture Decision Records, API documentation, and inline documentation standards. Use when making architectural decisions, documenting APIs, or recording the "why" behind code choices.
version: 2.0.0
last_improved: 2026-06-30
improvement_count: 1
---

# Documentation and ADRs

Document the "why" — not just the "what." Code shows what happens; documentation explains why it was built that way.

---

## Load Right Reference

| Task | Load |
|------|------|
| Writing an ADR (template, rules, when to write) | `references/adr.md` |
| Documenting an API endpoint | `references/api-docs.md` |
| Inline comments + changelog format | `references/inline.md` |

---

## Anti-Rationalization

| Excuse | Rebuttal |
|--------|----------|
| "The code is self-documenting" | Code shows what. Docs explain why, constraints, and alternatives considered. |
| "We'll document later" | Later never comes. Document in the same PR as the change. |
| "ADRs are bureaucracy" | A 10-minute ADR saves hours of "why was this done this way?" conversations. |
| "Nobody reads docs" | People read docs when they're stuck. That's exactly when they need them. |
| "It'll be outdated soon" | Solve that with automation, not avoidance. |

---

## Red Flags

- Architectural decisions made without recording the reasoning
- API changes without updating documentation
- "Why?" questions that nobody can answer (the person who knew left)
- Commented-out code instead of version control
- Changelog that hasn't been updated in months
