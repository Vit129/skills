# Knowledge Buffer Update

Aggregate findings from any workflow phase into the Knowledge Buffer section of the implementation plan.

## When to use
- After completing any workflow phase (analysis, architecture, coding, testing)
- Need to capture decisions, patterns, and constraints for downstream use

## What to capture (depends on current phase)
- **Analysis phase:** business rules, reusable logic candidates, missing patterns, domain concepts
- **Architecture phase:** DB helper patterns, asset discovery results, architecture decisions
- **Coding phase:** implementation details, refactoring decisions, coding patterns
- **Testing phase:** bug patterns, healing strategies, flaky test insights
- **Migration phase:** auth patterns, header strategies, base URL configs

## Where to write
`implementation[FEATURE].md` → Knowledge Buffer section:
- Common/General Logic (reusable across domains)
- Specific Business Logic (domain-specific)

## Rules
- Append new findings — never overwrite existing valid data
- Replace "(Pending ...)" placeholders with actual content
- Avoid duplicates — check before appending
- If implementation file doesn't exist, create the Knowledge Buffer section
