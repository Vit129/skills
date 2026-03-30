# Dev Task Design

Break logical design into small, sequential, manageable development tasks.

## When to use

- After test script design
- Before implementation or DevOps sync

## Process

1. Read logical design, test scenarios, test scripts
2. For each user story, decompose into:
   - Database & Infrastructure: schema migrations, setup
   - Backend: DTOs, Repository, Service, Controller (per endpoint)
   - Frontend: Component, Page, API integration, State management
   - Integration: end-to-end wiring, run test scripts (verify GREEN)
3. Sequence: DB → Backend → Frontend → Integration
4. Estimate complexity per task

## Rules

- Tasks MUST be completable in 1-2 hours
- Every component from logical design MUST have a corresponding task
- Include tasks to run test scripts after each component

## Progress Checklist

When generating dev tasks, ALWAYS create a checklist file at `.aidlc/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/dev-task-progress.md` using this format:

```markdown
# Dev Task Progress — {Feature Name}

Last updated: {YYYY-MM-DD HH:mm}
Status: In Progress | Completed

## Context
- System: {SYSTEM_KEBAB}
- Feature: {SYSTEM_FEATURE_KEBAB}
- Iteration: {iteration name}
- Workflow: AIDLC Full | AIDLC Inception Only
- Complexity: Lightweight | Standard | Full

## Artifacts
- User Stories: {path to user-stories.md}
- Logical Design: {path to logical-design.md}
- Test Scripts: {path to test-script-summary.md}
- Implementation Plan: {path to implementation-plan.md}
- Test Root: {detected test root path}

## Summary
- Total tasks: {N}
- Completed: {N}
- Remaining: {N}

## Database & Infrastructure
- [ ] Data storage setup — {SQL migration / Spreadsheet structure / LocalStorage schema}
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

### Checklist Rules

- Mark `[x]` when a task is done, keep `[ ]` for pending
- Update "Last updated" timestamp after every change
- Update Summary counts after every change
- When resuming work, read this file FIRST to know where you left off

### File Behavior

- **1 iteration = 1 progress file** — reuse within the same iteration (update `[x]` in place)
- **Rerun same iteration** — archive existing file as `dev-task-progress.v{N}.md` before creating new one
- **Master index** — after every status change, update `.aidlc/PROGRESS.md` (see below)

### Master Index

ALWAYS maintain `.aidlc/[SYSTEM_KEBAB]/PROGRESS.md` as a single-file overview of all features in this system:

```markdown
# AIDLC Progress — {System Name}

| # | Feature | Dev | QA | Status | Date |
|---|---------|-----|-----|--------|------|
| 1 | payment | 12/12 | 8/8 | ✅ | 2026-01 |
| 2 | refund | 3/10 | 0/6 | 🔄 | 2026-02 |
```

Update this file when:
- A new feature starts (add row with 0/N counts)
- Tasks complete (update counts)
- Feature completes (mark ✅ + date)

### Resume Protocol

When user says "ทำต่อ", "resume", or "continue":
1. Read `.aidlc/[SYSTEM_KEBAB]/PROGRESS.md` — find the 🔄 In Progress feature
2. Read that feature's `dev-task-progress.md` or `qa-task-progress.md`
3. Find the first `[ ]` task — that's where to resume
4. Continue from there

### After Each Category Completes

When all tasks in a category are `[x]`:

1. Run the verification step (✅ Run test scripts) for that category
2. If tests PASS → move to next category
3. If tests FAIL → fix and re-run (max 3 attempts, then escalate to user)
4. Update Summary counts

### When ALL Tasks Complete

When every checkbox is `[x]` and Status = Completed:

1. Update Status to `Completed`
2. Run full test suite one final time — record pass/fail counts
3. Proceed to next AIDLC phase:
   - If DevOps Sync is next → go to `references/phases/inception/azure-devops-sync.md`
   - If Construction is next → go to `references/phases/construction/implementation.md`
4. Report to user:
   ```
   ✅ Dev Task Design — Complete
   Tasks: {N}/{N} done
   Tests: {pass}/{total} passed
   Next: {next phase name}
   ```
