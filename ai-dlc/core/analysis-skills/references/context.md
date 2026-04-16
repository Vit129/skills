# Context Analysis

Extract the full picture — goals, scope, conflicts, dependencies — before designing or building anything.
Combines Step-Back Prompting (zoom out first) with structured context extraction.

## When to use

- Starting work on a new feature or task
- Requirements feel vague or contradictory
- Need to align on goals before choosing an approach
- About to start a complex task and feeling pulled toward details too early
- Need to separate functional from non-functional requirements

## How it works

### Phase 1: Step-Back (Zoom Out First)

Pause — don't start solving yet.

1. Pause — don't start solving yet
2. Ask high-level questions appropriate to the context
3. Answer them honestly — even if the answer is "I don't know yet"
4. Use the answers to frame the detailed work that follows

Ask these questions and answer them:

**Business Context:**
- What is the actual goal? What does success look like?
- Who benefits and how? What's the business value?
- What's the scope boundary? What's explicitly out?

**Technical Context:**
- What's the core pattern? (CRUD / workflow / integration / analysis)
- What architecture constraints exist? (performance, security, compliance)
- What's the riskiest technical decision?

**Domain Context:**
- What domain concepts are involved? How do they relate?
- What's reusable from other domains? What's unique?
- What business rules are hidden in the requirements?

**Asset Reuse Context:**
- What similar features exist in the codebase?
- What common patterns can be extracted? (auth, CRUD, validation)
- What's the reuse ratio? (>60% = cheap feature, <30% = rethink architecture)

> If you can't answer "what does success look like?" — you're not ready to start.

### Phase 2: Structured Extraction

1. **Extract Functional Requirements** — user actions, system behaviors
2. **Extract Non-Functional Requirements** — performance, security, usability
3. **Identify Business Rules** — validations, calculations, workflow constraints
4. **Identify Dependencies** — APIs, databases, external services

### Phase 3: Conflict Check

Look for contradictions before proceeding:
- **AC contradictions:** "AC1 says X, AC2 says Y"
- **Logic conflicts:** "Rule A conflicts with Rule B"
- **Data conflicts:** "Field type mismatches"
- **Temporal conflicts:** "Strategy changed but old references remain"

If conflicts found → resolve with user before proceeding. Never silently pick one side.

## Output

```text
Goal: [primary objective]
Value: [who benefits, how]
Scope: In [items] / Out [items]

Functional: FR1, FR2, FR3...
Non-Functional: NFR1, NFR2...
Business Rules: BL_001, BL_002...
Dependencies: [APIs, DB, external]
Conflicts: [none / list with resolution]
```

## Phase 4: Write to File (MANDATORY — DO NOT SKIP)

Write the full analysis output to the appropriate file:
- If inside AIDLC workflow → write to audit trail: `### Step-Back Analysis` and `### Context Analysis` sections in `audit.md`
- If implementation plan exists → append to `implementationPlan[FEATURE].md` Appendix
- If neither exists → write to `.aidlc/[system]/[feature]/outputs/inception/context-analysis.md`

**OUTPUT TO USER (chat summary only):**
```
✅ Context Analysis recorded to [file]
Goal: [one line]
Scope: In [N items] / Out [N items]
Conflicts: [none / N found]
```
Full details in file — do NOT dump full analysis in chat.

## Tips

- This takes 30 seconds of thinking but saves hours of rework
- Works for any domain: coding, design, writing, planning, debugging
- If requirements are ambiguous, ask — don't assume
- Phase 1 (Step-Back) is the most important — skip it and you'll build the wrong thing
