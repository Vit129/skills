# Context Analysis

Extract the business context, requirements, and potential conflicts from a feature before designing anything.

## When to use
- Starting work on a new feature
- Requirements feel vague or contradictory
- Need to separate functional from non-functional requirements

## How it works
1. **Step-Back first** — ask: What's the goal? What's the value? What's in/out of scope?
2. **Extract Functional Requirements** — user actions, system behaviors
3. **Extract Non-Functional Requirements** — performance, security, usability
4. **Identify Business Rules** — validations, calculations, workflow constraints
5. **Identify Dependencies** — APIs, databases, external services
6. **Conflict Check** — look for contradictions:
   - AC contradictions: "AC1 says X, AC2 says Y"
   - Logic conflicts: "Rule A conflicts with Rule B"
   - Data conflicts: "Field type mismatches"

## Output
```
Goal: [primary objective]
Value: [who benefits, how]
Scope: In [items] / Out [items]

Functional: FR1, FR2, FR3...
Non-Functional: NFR1, NFR2...
Business Rules: BL_001, BL_002...
Dependencies: [APIs, DB, external]
Conflicts: [none / list]
```
