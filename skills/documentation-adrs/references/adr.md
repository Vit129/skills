# Architecture Decision Records (ADR)

## Template

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

### Negative
- {tradeoff 1}

### Risks
- {risk + mitigation}
```

## Rules

- **One decision per ADR** — don't bundle multiple decisions
- **Immutable once accepted** — if decision changes, create new ADR that supersedes
- **Short** — if it's more than 1 page, you're over-explaining
- **Numbered sequentially** — ADR-001, ADR-002, etc.
- **Store in repo** — `docs/adr/` or `agent-memory/MEMORY.md` Decisions section

## When to Write

Write an ADR when the decision is:
- Expensive to reverse (database, framework, architecture pattern)
- Non-obvious (future developers will ask "why?")
- Contentious (team disagreed, need to record reasoning)
- Cross-cutting (affects multiple modules/teams)

Don't write an ADR for: obvious choices, easily reversible decisions, implementation details.

## Relation to AIDLC DECISIONS File

| | AIDLC DECISIONS | ADR |
|---|---|---|
| Scope | Single feature | System/architecture |
| Lifetime | Feature development | Permanent record |
| Location | `agent-memory/plans/[feature]/` | `docs/adr/` |
| When | During AIDLC Phase 0-1 | Any time an arch decision is made |

Use both: DECISIONS for feature-level choices, ADRs for cross-cutting architectural decisions that outlive the feature.
