# Test Case Design

Generate BDD test cases from logical design specifications.

## When to use
- After logical design is complete
- Before writing test scripts

## Process
1. Read user stories and logical design
2. For each API endpoint: create test cases covering Happy Path, Input validation, 404, 409, 401/403, Boundary values
3. For each UI story: create test cases covering Happy Path, Validation errors, Navigation
4. Format: `[Platform][Module][Function] {scenario}` — English only
5. BDD: Given [precondition] / When [action] / Then [outcome]
6. Assign: Priority (Severity × Urgency), Automation Status, Effort (0.5 increments)

## Automation status defaults
- API → "Automatable"
- UI → "Automatable" if Critical/High, else "Cannot automate"
