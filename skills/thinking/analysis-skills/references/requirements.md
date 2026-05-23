# Requirements Gathering

Transform business needs into structured user stories with BDD acceptance criteria.

## When to use
- Starting a new project or feature
- Have a requirements document or verbal description that needs structuring
- Need testable acceptance criteria

## How it works
1. **Find the source** — check for requirements.md, PRD, or ask user
2. **Clarify scope** — what's MVP vs post-MVP? Who are the users?
3. **Write user stories** — Goal, Persona, Requirement, User Flow
4. **Write BDD acceptance criteria:**
   ```
   Given [precondition]
   When [action]
   Then [expected outcome]
   ```
5. **Include negative scenarios:**
   ```
   Given [precondition]
   When [invalid action]
   Then [error outcome]
   ```
6. **Define business rules** — cross-cutting constraints
7. **Define non-functional requirements** — performance, security, reliability

## Output per story
```
## US-001: [Title]

Goal: [business goal]
Persona: [user role]
Requirement: [what user needs]
User Flow: [step-by-step]

Acceptance Criteria:
Given [precondition]
When [action]
Then [outcome]
```

## Tips
- If requirements are ambiguous, ask — don't assume
- Every AC must be testable and measurable
- MVP scope should be explicit: "In MVP: US-001, US-002. Post-MVP: US-003"
