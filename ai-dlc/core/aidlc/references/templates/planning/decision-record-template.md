# Decision Record: [Phase Name] - [Unit of Work]

## Status: Pending | Decided | Rejected

## Outstanding Decisions

### Decision 1: [Decision Title]
**Context**: [What situation requires this decision]

**Options**:
- **A) [Option A]** - [Brief description]
  - *Rationale*: [Why this option makes sense]
  - *Consequences*: [Expected outcomes and trade-offs]

- **B) [Option B]** - [Brief description] (recommended)
  - *Rationale*: [Why this option makes sense]
  - *Consequences*: [Expected outcomes and trade-offs]

- **C) [Option C]** - [Brief description]
  - *Rationale*: [Why this option makes sense]
  - *Consequences*: [Expected outcomes and trade-offs]

- **D) Other** (please describe your preferred approach)

**Recommendation**: Option B because [reasoning]

**Decision**: 
**Additional Rationale** (Optional): 
**Additional Consequences** (Optional): 

---

### Decision 2: [Decision Title]
**Context**: [What situation requires this decision]

**Options**:
- **A) [Option A]**
  - *Rationale*: [Why this option makes sense]
  - *Consequences*: [Expected outcomes and trade-offs]

- **B) [Option B]** (recommended)
  - *Rationale*: [Why this option makes sense]
  - *Consequences*: [Expected outcomes and trade-offs]

- **C) [Option C]**
  - *Rationale*: [Why this option makes sense]
  - *Consequences*: [Expected outcomes and trade-offs]

**Recommendation**: Option B because [reasoning]

**Decision**: 
**Additional Rationale** (Optional): 
**Additional Consequences** (Optional): 

---

## Decision Summary

| Decision | Chosen Option | Rationale | Impact |
|----------|---------------|-----------|--------|
| [Decision 1] | [Option] | [Brief rationale] | High/Medium/Low |
| [Decision 2] | [Option] | [Brief rationale] | High/Medium/Low |

## Next Steps
Once all decisions are made:
1. Create plan file based on these decisions
2. Reference this decision record in the plan
3. Proceed with plan approval and execution

---

## Writing Guide

### Background Section (add before Outstanding Decisions)
Every decision file MUST start with a Background section that explains:
- What is this feature? (1-2 sentences a new team member can understand)
- What already exists? (code, docs, tests — be specific)
- What is missing? (the gap this decision addresses)

A reader who has never seen this project should understand the situation from Background alone.

### Context Field
- Write as if the reader has no prior knowledge of the project
- State the problem, not the solution
- Bad: "We need to decide scope given existing POM code"
- Good: "PBI-001 has working Playwright tests (6 scenarios, all passing) but no design documents. We need to decide how much documentation to create."

### Options
- Each option must be understandable without reading other options
- Rationale: why someone would pick this (not why it's bad)
- Consequences: what happens after picking this (both good and bad)
- Avoid jargon — write "test automation code" not "POM architecture"

### Language
- All content in English (consistent with codebase)
- Technical terms are fine but explain abbreviations on first use

## Template Usage Notes
1. Replace all `[placeholders]` with actual values
2. Add as many decisions as needed for the phase
3. **NEVER fill in "Decision" fields** - Leave blank for user input
4. **NEVER auto-select options** - Present options without choosing
5. Fill in "Decision", and optionally "Additional Rationale/Consequences" ONLY when user provides answers
6. Update status to Decided when all decisions are made
7. Use this record as input for creating the plan file

## CRITICAL: Decision Process Rules
- **AI Role**: Present options with recommendations
- **User Role**: Make all decisions by filling in "Decision:" fields
- **Never Auto-Fill**: Decision fields must remain blank until user input
- **Wait for User**: Don't create plan until all decisions are made
