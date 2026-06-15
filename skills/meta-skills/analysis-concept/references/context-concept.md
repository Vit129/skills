# Context Analysis Concept

Extract the full picture before starting work. Zoom out first, then extract structured context.

Adapted from: `ai-dlc/core/analysis-skills/references/context.md`

## When to use

- Starting work on something new
- Requirements feel vague or contradictory
- Need to align on goals before choosing an approach
- Feeling pulled toward details too early

## Thinking Pattern

### Phase 1: Step-Back (Zoom Out First)

Pause — don't start solving yet.

1. Ask high-level questions appropriate to your context
2. Answer honestly — "I don't know yet" is valid
3. Use answers to frame the detailed work

**Questions to ask (adapt to your domain):**

Goal Context:
- What is the actual goal? What does success look like?
- Who benefits and how?
- What's the scope boundary? What's explicitly out?

Structure Context:
- What's the core pattern? (e.g., CRUD / workflow / integration / hierarchy)
- What constraints exist? (e.g., size limits, format rules, dependencies)
- What's the riskiest decision?

Domain Context:
- What {domain_concepts} are involved? How do they relate?
- What's reusable from existing {assets}? What's unique?
- What rules are hidden in the requirements?

Reuse Context:
- What similar {items} already exist?
- What common patterns can be extracted?
- What's the reuse ratio? (>60% = cheap, <30% = rethink)

> If you can't answer "what does success look like?" — you're not ready to start.

### Phase 2: Structured Extraction

1. Extract functional requirements — what {actors} do, what {system} does
2. Extract non-functional requirements — performance, constraints, quality
3. Identify rules — validations, calculations, workflow constraints
4. Identify dependencies — external systems, prerequisites

### Phase 3: Conflict Check

Look for contradictions before proceeding:
- Requirement contradictions: "Rule A says X, Rule B says Y"
- Logic conflicts: "Constraint A conflicts with Constraint B"
- Data conflicts: "Format mismatches"
- Temporal conflicts: "Strategy changed but old references remain"

If conflicts found → resolve before proceeding. Never silently pick one side.

## Output Pattern

```text
Goal: {primary_objective}
Value: {who_benefits, how}
Scope: In {items} / Out {items}

Functional: FR1, FR2, FR3...
Non-Functional: NFR1, NFR2...
Rules: R_001, R_002...
Dependencies: {list}
Conflicts: {none / list with resolution}
```

## Tips

- This takes 30 seconds of thinking but saves hours of rework
- Works for any domain: coding, design, writing, planning, debugging, knowledge management
- If requirements are ambiguous, ask — don't assume
- Phase 1 (Step-Back) is the most important — skip it and you'll build the wrong thing
