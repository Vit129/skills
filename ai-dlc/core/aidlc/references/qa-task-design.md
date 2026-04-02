# QA Task Design

Break test scenarios and architecture into small, sequential QA automation tasks.

For progress tracking rules, file behavior, master index, and resume protocol → Read `shared-task-progress-guide.md`

## Entry Point Requirements

Can start this phase if:
- [ ] Test case design is complete (test scenarios exist)
- [ ] QA architecture is complete (implementation plan exists)
- [ ] Data storage strategy is defined
- [ ] Coding rules reviewed (playwright-rules or robotframework-rules)

## Required Context from Previous Phases

- From Test Case Design: test scenarios (MD/CSV) with priority and automation status
- From QA Architecture: implementation plan with file structure, service mapping
- From Data Storage Strategy: seed/verify/cleanup approach
- From Coding Rules: platform-specific standards

## Critical Success Criteria

- ✅ Every test scenario has a corresponding script task
- ✅ Tasks are atomic (completable in 1-2 hours)
- ✅ Infrastructure and shared services come FIRST, then scripts
- ✅ Includes "Run All Tests" verification task per component
- ✅ Includes Final Review task (code review + full test suite)
- ✅ Lessons Learnt reviewed before task creation

## When to use

- After test case design and QA architecture are done
- Before writing test scripts
- Need to plan QA automation work in manageable chunks

## Process

1. Read test scenarios, QA architecture, and data storage strategy
2. Read Lessons Learnt: Check `ai-agent/knowledge/lessons/` for technical patterns, past mistakes, and UI behaviors
3. For each feature/test suite, decompose into categories below
4. Sequence by dependency order
5. Estimate complexity per task

## Task Categories

Adapt to platform:

| Category | Playwright (API) | Playwright (Web UI) | Robot Framework (Mobile) |
|----------|-----------------|--------------------|-----------------------|
| Infrastructure | DB config, .env, fixtures | Same + storageState | Appium config, .env, YAML fixtures |
| Shared Services | AuthService, API helpers, DB service | Same + storageState login | Python DB helpers, API helpers |
| Page Objects | N/A (use helpers) | NavigationPage, FeaturePage, FeatureHelper | FeaturePage.robot, HelperKeyword.robot |
| Test Scripts | feature.spec.ts (per scenario) | Same | feature.robot (per scenario) |
| Pipeline | package.json scripts, pipeline YAML | Same | robot commands, pipeline YAML |

Sequence: Infrastructure → Shared Services → Page Objects → Test Scripts → Pipeline

## Rules

- Tasks MUST be completable in 1-2 hours
- Every test scenario MUST have a corresponding script task
- Infrastructure and shared services FIRST, then scripts
- Group related scenarios into the same spec file where logical
- Include review task after each major component
- MUST create an executable test script (run file) and verify until all scenarios pass
- Architectural Integrity: Files MUST follow `[system]/[feature]` structure
- Pre-emptive Healing: Use patterns from lessons learnt to write robust code from the first attempt

## Progress Checklist Template

Create at `.aidlc/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/qa-task-progress.md`:

```markdown
# QA Task Progress — {Feature Name}

Last updated: {YYYY-MM-DD HH:mm}
Status: In Progress | Completed

## Context
(see shared-task-progress-guide.md for required fields)

## Artifacts
- Test Scenarios: {path}
- Architecture: {path}
- Data Storage Strategy: {path}
- Coding Rules: {playwright-rules or robotframework-rules}

## Summary
- Total tasks: {N}
- Completed: {N}
- Remaining: {N}

## Infrastructure
- [ ] Data storage config — {database/spreadsheet/connection}
- [ ] Seed/cleanup scripts
- [ ] Fixture files — {fixture description}
- [ ] Environment config (.env)

## Shared Services
- [ ] AuthService / login helper
- [ ] API service — {ServiceName}
- [ ] Data storage service — {ServiceName}

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

## Output

File naming: `qa-task-progress.md`
Location: `.aidlc/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/qa-task-progress.md`

## Phase Transition Validation

Before proceeding to next phase, validate:
- [ ] Every test scenario has a corresponding script task
- [ ] All tasks have complexity estimates
- [ ] Infrastructure tasks come before script tasks
- [ ] Final Review task is included
- [ ] Progress file created with Context + Artifacts filled in
- [ ] PROGRESS.md updated with new row

## Next Phase

When all tasks complete:
- If AIDLC workflow → go to `references/phases/inception/azure-devops-sync.md`
- If standalone QA workflow → go to pipeline creation or librarian (save knowledge)
