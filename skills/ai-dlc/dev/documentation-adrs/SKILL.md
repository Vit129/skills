---
name: documentation-adrs
description: Architecture Decision Records, API documentation, and inline documentation standards. Use when making architectural decisions, documenting APIs, or recording the "why" behind code choices.
---

# Documentation and ADRs

## Overview

Document the "why" — not just the "what." Code shows what happens; documentation explains why it was built that way, what alternatives were considered, and what constraints drove the decision. ADRs (Architecture Decision Records) capture decisions that are expensive to reverse.

## When to Use

- Making an architectural decision (database choice, framework, pattern)
- Changing a public API
- Shipping a feature that future developers need context for
- Recording why a non-obvious approach was chosen
- Creating/updating API documentation
- Writing a changelog entry

## Architecture Decision Records (ADR)

### What is an ADR?

A short document (1 page) that captures ONE architectural decision — the context, the decision, and the consequences.

### ADR Template

```markdown
# ADR-{number}: {Title}

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-{number}

## Date
{YYYY-MM-DD}

## Context
What is the issue? What forces are at play? What constraints exist?
(2-5 sentences — enough for someone unfamiliar to understand the problem)

## Decision
What did we decide? Be specific.
(1-3 sentences — the actual choice made)

## Alternatives Considered
| Option | Pros | Cons | Why rejected |
|--------|------|------|-------------|
| {A} | ... | ... | ... |
| {B} | ... | ... | ... |

## Consequences
### Positive
- {benefit 1}
- {benefit 2}

### Negative
- {tradeoff 1}
- {tradeoff 2}

### Risks
- {risk + mitigation}
```

### ADR Rules

- **One decision per ADR** — don't bundle multiple decisions
- **Immutable once accepted** — if decision changes, create new ADR that supersedes
- **Short** — if it's more than 1 page, you're over-explaining
- **Numbered sequentially** — ADR-001, ADR-002, etc.
- **Store in repo** — `docs/adr/` or `.aidlc/[system]/[feature]/decisions/`

### When to Write an ADR

Write an ADR when the decision is:
- Expensive to reverse (database, framework, architecture pattern)
- Non-obvious (future developers will ask "why?")
- Contentious (team disagreed, need to record reasoning)
- Cross-cutting (affects multiple modules/teams)

Don't write an ADR for:
- Obvious choices (use TypeScript in a TypeScript project)
- Easily reversible decisions (variable naming, file organization)
- Implementation details (which loop construct to use)

## Relation to AIDLC DECISIONS File

AIDLC's `.aidlc/[system]/[feature]/DECISIONS.md` serves a similar purpose but is **feature-scoped**. ADRs are **system-wide**.

| | AIDLC DECISIONS | ADR |
|---|---|---|
| Scope | Single feature | System/architecture |
| Lifetime | Feature development | Permanent record |
| Location | `.aidlc/[system]/[feature]/` | `docs/adr/` |
| When | During AIDLC Phase 0-1 | Any time an arch decision is made |

**Use both:** DECISIONS for feature-level choices during AIDLC, ADRs for cross-cutting architectural decisions that outlive the feature.

## API Documentation

### What to Document

```markdown
## POST /api/users

Create a new user account.

### Request
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | yes | Must be unique |
| name | string | yes | 1-200 chars |
| role | enum | no | "user" (default) or "admin" |

### Response (201)
{ "id": "uuid", "email": "...", "name": "...", "createdAt": "ISO8601" }

### Errors
| Code | When |
|------|------|
| 409 | Email already exists |
| 422 | Validation failed |

### Example
curl -X POST /api/users -d '{"email":"a@b.com","name":"Test"}'
```

### API Doc Rules
- Document every public endpoint
- Include request/response examples
- List all error codes and when they occur
- Keep in sync with code (automate if possible)

## Inline Documentation

### What to Comment

| Comment type | When | Example |
|---|---|---|
| **Why** | Non-obvious decision | `// Retry 3x because payment API is flaky under load` |
| **Constraint** | External limitation | `// Max 100 items — API pagination limit` |
| **Warning** | Gotcha for future devs | `// WARNING: Order matters — auth must run before rate limit` |
| **TODO** | Known incomplete work | `// TODO(#123): Add retry logic for timeout` |

### What NOT to Comment

| Don't | Why |
|-------|-----|
| `// increment counter` above `count++` | Code is self-explanatory |
| `// constructor` above `constructor()` | Obvious from syntax |
| `// returns the user` above `return user` | Adds no information |
| Commented-out code | Use version control instead |

## Changelog

### Format (Keep a Changelog)

```markdown
## [1.2.0] - 2026-05-09

### Added
- User profile photo upload (#234)
- Rate limiting on auth endpoints (#241)

### Changed
- Upgraded Playwright to 1.48 (#238)

### Fixed
- Duplicate records in user search (#235)

### Removed
- Legacy getUser() API (deprecated since 1.0) (#240)
```

### Rules
- Group by: Added, Changed, Fixed, Removed, Security
- Link to PR/issue numbers
- Write for humans (not machines)
- Update changelog in the same PR as the change

## Anti-Rationalization

| Excuse | Rebuttal |
|--------|----------|
| "The code is self-documenting" | Code shows what. Docs explain why, constraints, and alternatives considered. |
| "We'll document later" | Later never comes. Document in the same PR as the change. |
| "ADRs are bureaucracy" | A 10-minute ADR saves hours of "why was this done this way?" conversations. |
| "Nobody reads docs" | People read docs when they're stuck. That's exactly when they need them. |
| "It'll be outdated soon" | Outdated docs are a maintenance problem. Solve it with automation, not avoidance. |

## Red Flags

- Architectural decisions made without recording the reasoning
- API changes without updating documentation
- "Why?" questions that nobody can answer (the person who knew left)
- Commented-out code instead of version control
- Changelog that hasn't been updated in months

## Verification

- [ ] Architectural decisions have ADRs (or AIDLC DECISIONS for feature-scope)
- [ ] Public APIs are documented with request/response/errors
- [ ] Non-obvious code has "why" comments
- [ ] Changelog updated in same PR as change
- [ ] No commented-out code (use git instead)
- [ ] ADRs are numbered and stored in repo
