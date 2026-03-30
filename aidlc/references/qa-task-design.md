# QA Task Design

Break test scenarios and architecture into small, sequential QA automation tasks.

## When to use

- After test case design and QA architecture are done
- Before writing test scripts
- Need to plan QA automation work in manageable chunks

## Process

1. Read test scenarios, QA architecture, and test DB strategy.
2. **Read Lessons Learnt**: Check `knowledge/lessons/` for technical patterns, past mistakes, and UI behaviors.
3. For each feature/test suite, decompose into:
   - Test Infrastructure: DB scripts, fixtures, environment config
   - Shared Services: auth helpers, API services, DB services
   - Page Objects / Keywords: per screen or endpoint group
   - Test Scripts: per test scenario (spec files / .robot files)
   - Pipeline: test commands, CI/CD integration
4. Sequence: Infrastructure → Shared Services → Page Objects → Scripts → Pipeline
5. Estimate complexity per task

## Task categories

| Category | Examples |
| --- | --- |
| Infrastructure | DB config, seed/cleanup scripts, .env setup, fixture files |
| Shared Services | AuthService, API helpers, DB service classes |
| Page Objects | NavigationPage, FeaturePage, FeatureHelper (Playwright) |
| Keywords | FeaturePage.robot, HelperKeyword.robot (Robot Framework) |
| Test Scripts | feature.spec.ts, feature.robot — per scenario |
| Pipeline | package.json scripts, pipeline YAML, PR template |

## Rules

- Tasks MUST be completable in 1-2 hours
- Every test scenario MUST have a corresponding script task
- Infrastructure and shared services FIRST, then scripts
- Group related scenarios into the same spec file where logical
- Include review task after each major component
- MUST create an executable test script (run file) and verify until all scenarios pass.
- **Architectural Integrity**: Files MUST follow `[system]/[feature]` structure even for single-feature projects to ensure scalability.
- **Checklist Location**: ALWAYS create the progress checklist in the project root's `.aidlc/iterations/` folder.
- **Pre-emptive Healing**: Use patterns from `webLesHealing.json` (or similar) to write robust code from the first attempt.

## Progress Checklist

When generating QA tasks, ALWAYS create a checklist file at `.aidlc/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/qa-task-progress.md` using this format:

```markdown
# QA Task Progress — {Feature Name}

Last updated: {YYYY-MM-DD HH:mm}
Status: In Progress | Completed

## Context
- System: {SYSTEM_KEBAB}
- Feature: {SYSTEM_FEATURE_KEBAB}
- Iteration: {iteration name}
- Workflow: QA Automation | AIDLC Full
- Platform: API | Web UI | Android | iOS
- Complexity: Lightweight | Standard | Full

## Artifacts
- Test Scenarios: {path to testScenario*.md or .csv}
- Architecture: {path to implementation plan}
- Data Storage Strategy: {path to db-strategy section or file}
- Coding Rules: playwright-rules or robotframework-rules
- Test Root: {detected test root path}

## Summary
- Total tasks: {N}
- Completed: {N}
- Remaining: {N}

## Infrastructure
- [ ] DB config — {database/connection}
- [ ] Seed/cleanup scripts
- [ ] Fixture files — {fixture description}
- [ ] Environment config (.env)

## Shared Services
- [ ] AuthService / login helper
- [ ] API service — {ServiceName}
- [ ] DB service — {ServiceName}

## Page Objects / Keywords — {Feature}
- [ ] {PageName}Page — {screen/endpoint}
- [ ] {HelperName}Helper — {utility}

## Test Scripts — {Feature}
- [ ] {scenario}.spec.ts — {scenario title}
- [ ] {scenario}.spec.ts — {scenario title}
- [ ] ✅ Run all tests (verify PASS)

## Pipeline
- [ ] package.json scripts / run commands
- [ ] Pipeline YAML
- [ ] PR template

## Final Review
- [ ] Code review — standards compliance
- [ ] ✅ Full test suite run (all scenarios PASS)
```

### Checklist Rules

- Mark `[x]` when a task is done, keep `[ ]` for pending
- Update "Last updated" timestamp after every change
- Update Summary counts after every change
- When resuming work, read this file FIRST to know where you left off

### File Behavior

- **1 iteration = 1 progress file** — reuse within the same iteration (update `[x]` in place)
- **Rerun same iteration** — archive existing file as `qa-task-progress.v{N}.md` before creating new one
- **Master index** — after every status change, update `.aidlc/PROGRESS.md` (see below)

### Master Index

ALWAYS maintain `.aidlc/[SYSTEM_KEBAB]/PROGRESS.md` as a single-file overview of all features in this system:

```markdown
# AIDLC Progress — {System Name}

| # | Feature | Dev | QA | Status | Date |
|---|---------|-----|-----|--------|------|
| 1 | payment | 0/0 | 8/8 | ✅ | 2026-01 |
| 2 | refund | 0/0 | 3/10 | 🔄 | 2026-02 |
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

1. Run the verification step (✅ Run all tests) for that category
2. If tests PASS → move to next category
3. If tests FAIL → fix and re-run (max 3 attempts, then escalate to user)
4. Update Summary counts

### When ALL Tasks Complete

When every checkbox is `[x]` and Status = Completed:

1. Update Status to `Completed`
2. Run full test suite one final time — record pass/fail counts
3. Proceed to next AIDLC phase:
   - If QA Task Design → go to `references/phases/inception/azure-devops-sync.md`
   - If standalone QA workflow → go to pipeline creation or librarian (save knowledge)
4. Report to user:

   ```
   ✅ QA Task Design — Complete
   Tasks: {N}/{N} done
   Tests: {pass}/{total} passed
   Next: {next phase name}
   ```
