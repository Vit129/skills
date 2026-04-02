# Dev Task Design

Break logical design into small, sequential, manageable development tasks.

For progress tracking rules, file behavior, master index, and resume protocol → Read `shared-task-progress-guide.md`

## Entry Point Requirements

Can start this phase if:
- [ ] `logical-design.md` exists and is validated
- [ ] `test-cases` populated (test-case-design phase complete)
- [ ] `test-scripts` populated (test-script-design phase complete)
- [ ] Technical specifications are complete

## Required Context from Previous Phases

- From Logical Design: API specs / service contracts, data storage schema, client application components
- From Test Case Design: scenarios to be supported
- From Test Script Design: automation scripts to be built first (TDD: RED)

## Critical Success Criteria

- ✅ All logical design components have corresponding tasks
- ✅ Tasks are atomic (completable in 1-2 hours)
- ✅ Dependencies are clearly identified
- ✅ Sequencing is logical (Data Storage first, Server Logic second, Client Application third)
- ✅ Includes "Run Test Scripts" tasks after each component
- ✅ Lessons Learnt reviewed before task creation

## When to use

- After test script design
- Before implementation or DevOps sync

## Process

1. Read logical design, test scenarios, test scripts
2. Read Lessons Learnt: Check `ai-agent/knowledge/lessons/` for technical patterns, past mistakes, and implementation pitfalls
3. For each user story, decompose into categories below
4. Sequence by dependency order
5. Estimate complexity per task

## Task Categories

Adapt to project type — use only categories that apply:

| Category | Traditional (REST + SQL) | Serverless | Spreadsheet-backed | Frontend-only |
|----------|------------------------|------------|-------------------|---------------|
| Data Storage | DB schema migrations | NoSQL collections | Spreadsheet tab structure | LocalStorage schema |
| Server Logic | DTOs, Repository, Service, Controller | Function triggers, handlers | GAS doGet/doPost | N/A (skip) |
| Client Application | Components, Pages, State, API integration | Same | Same + LocalStorage sync | Components, Pages, State |
| Integration | E2E wiring, run test scripts | Same | Same | Same |

Sequence: Data Storage → Server Logic → Client Application → Integration

## Rules

- Tasks MUST be completable in 1-2 hours
- Every component from logical design MUST have a corresponding task
- Include tasks to run test scripts after each component
- Skip categories that don't apply (e.g., no Server Logic for frontend-only)

## Progress Checklist Template

Create at `.aidlc/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/dev-task-progress.md`:

```markdown
# Dev Task Progress — {Feature Name}

Last updated: {YYYY-MM-DD HH:mm}
Status: In Progress | Completed

## Context
(see shared-task-progress-guide.md for required fields)

## Artifacts
- User Stories: {path}
- Logical Design: {path}
- Test Scripts: {path}
- Implementation Plan: {path}

## Summary
- Total tasks: {N}
- Completed: {N}
- Remaining: {N}

## Data Storage
- [ ] Storage setup — {SQL migration / Spreadsheet structure / LocalStorage schema}
- [ ] Seed data / fixtures
- [ ] Environment config (.env)

## Server Logic — {User Story / Endpoint}
- [ ] Data models / DTOs
- [ ] Service layer — {REST API / Serverless Function / GAS endpoint}
- [ ] Business logic
- [ ] ✅ Run test scripts (verify GREEN)

## Client Application — {User Story / Screen}
- [ ] Component — {ComponentName}
- [ ] Page — {PageName}
- [ ] API/Service integration
- [ ] State management
- [ ] ✅ Run test scripts (verify GREEN)

## Integration
- [ ] End-to-end wiring
- [ ] ✅ Run all test scripts (verify GREEN)
- [ ] Code review
```

## Output

File naming: `dev-task-progress.md`
Location: `.aidlc/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/dev-task-progress.md`

## Phase Transition Validation

Before proceeding to next phase, validate:
- [ ] All logical design components have corresponding tasks
- [ ] All tasks have complexity estimates
- [ ] Dependencies are sequenced correctly
- [ ] Test script tasks are included after each component
- [ ] Progress file created with Context + Artifacts filled in
- [ ] PROGRESS.md updated with new row

## Next Phase

When all tasks complete:
- If DevOps Sync is next → go to `references/phases/inception/azure-devops-sync.md`
- If Construction is next → go to `references/phases/construction/implementation.md`
