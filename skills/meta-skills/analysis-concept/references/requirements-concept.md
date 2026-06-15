# Requirements Gathering Concept

Transform needs into structured stories with testable acceptance criteria.

Adapted from: `ai-dlc/core/analysis-skills/references/requirements.md`

## When to use

- Starting a new project or feature
- Have a description that needs structuring
- Need testable acceptance criteria

## Thinking Pattern

### Step 1: Find the Source

- Check for existing requirements documents, descriptions, or specs
- If none → ask the stakeholder/user for input

### Step 2: Clarify Scope

- What's MVP vs post-MVP?
- Who are the {actors}? (users, systems, roles)
- What's explicitly out of scope?

### Step 3: Write {Stories}

For each requirement:

```text
## {STORY_ID}: {Title}

Goal: {what_this_achieves}
Actor: {who_does_this}
Requirement: {what_they_need}
Flow: {step-by-step_sequence}
```

### Step 4: Write Acceptance Criteria

For each story, define testable criteria:

**Happy path:**
```text
Given {precondition}
When {action}
Then {expected_outcome}
```

**Negative/edge cases:**
```text
Given {precondition}
When {invalid_action}
Then {error_outcome}
```

### Step 5: Define Rules

Cross-cutting constraints that apply across multiple stories:
- Validation rules
- Permission rules
- Calculation rules
- Workflow constraints

### Step 6: Define Non-Functional Requirements

- Performance: response time, throughput
- Security: authentication, authorization
- Reliability: uptime, error handling
- Usability: accessibility, responsiveness

## Output Pattern (per story)

```text
## {ID}: {Title}

Goal: {goal}
Actor: {actor}
Requirement: {requirement}
Flow: {steps}

Acceptance Criteria:
Given {precondition}
When {action}
Then {outcome}
```

## Tips

- If requirements are ambiguous, ask — don't assume
- Every acceptance criterion must be testable and measurable
- MVP scope should be explicit: "In MVP: {list}. Post-MVP: {list}"
- Negative scenarios are as important as happy paths
