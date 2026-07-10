# Task Progress Guide

Shared rules for tracking dev and QA task progress. `task-design.md` (Dev and QA sections) references this file.

## Progress File Location

Artifact location:
`agent-memory/plans/[FEATURE]/dev-task-progress.md` or `qa-task-progress.md`

## Required Sections

Every progress file MUST have these sections:

### Context (MANDATORY)

```markdown
## Context
- System: {SYSTEM_KEBAB}
- Feature: {SYSTEM_FEATURE_KEBAB}
- Workflow: {Dev | QA | Dev+QA}
- Platform: {API | Web UI | Android | iOS | API+Web UI | API+Web UI+Mobile | API+Mobile}  ← QA only
- Complexity: {Lightweight | Standard | Full}
- Test Root: {detected test root path}
- Test Scenario Root: {path to test-scenario/ folder — e.g. tests/test-scenario}  ← QA only
- Shared Fixtures: {path to shared-fixtures/ — required for combined platforms}
```

> **Combined Platform Note:** When platform is combined (e.g., API+Web UI), list ALL test root paths:
> ```markdown
> - Test Root (API): tests/api-testing/[system]/[feature]/
> - Test Root (Web): tests/web-testing/[system]/[feature]/
> - Test Root (Mobile): tests/mobile-testing/[platform]/[system]/[feature]/
> - Shared Fixtures: tests/shared-fixtures/[system]/[feature]/
> ```

### Artifacts (MANDATORY)

List all input/output file paths so resume doesn't require searching. Path convention (see `task-design.md` → Artifact Output Locations for the full breakdown):
- **Dev** artifacts → `agent-memory/plans/[FEATURE]/{name}.md`
- **QA** artifacts → `tests/{api-testing,web-testing,mobile-testing,test-scenario}/[system]/[feature]/` (never `agent-memory/`)

```markdown
## Artifacts
- Design: {path}          ← Dev only (agent-memory/plans/[FEATURE]/design.md)
- Test Scenarios: {path}  ← QA only
- Architecture: {path}    ← QA only
- Data Storage Strategy: {path}  ← QA only (test data seed/verify/cleanup, not Dev's DB schema — that's inside Design)
- Coding Rules: {skill name}     ← QA only
```

Include only artifacts relevant to the task type (dev or QA). Leave empty fields as `N/A`.

### Summary (MANDATORY)

```markdown
## Summary
- Total tasks: {N}
- Completed: {N}
- Remaining: {N}
```

Update counts after every `[x]` change.

## File Behavior

- **1 feature = 1 progress file** — reuse within the same feature (update `[x]` in place)
- **Rerun same feature** — archive existing file as `{name}.v{N}.md` before creating new one
- **Master index** — after every status change, update progress tracker per mode (see below)

## Master Index

ALWAYS update `PROGRESS.md` (project root):

```markdown
# Feature Progress — {System Name}

| # | Feature | Dev | QA | Status | Date |
|---|---------|-----|-----|--------|------|
| 1 | payment | 12/12 | 8/8 | ✅ | 2026-01 |
| 2 | refund | 3/10 | 0/6 | 🔄 | 2026-02 |
```

Update when:
- New feature starts (add row with 0/N counts)
- Tasks complete (update counts)
- Feature completes (mark ✅ + date)

## Resume Protocol

When user says "ทำต่อ", "resume", or "continue":

1. Read `PROGRESS.md` → find the 🔄 In Progress feature
2. Read that feature's progress file (dev or QA)
3. **Verify artifacts from completed phases still exist:**
   - Check each path listed in the `## Artifacts` section
   - If a required file is missing → warn user before resuming:
     ```
     ⚠️ ไฟล์จาก phase ก่อนหน้าหาย: {file path}
     ต้องทำ {phase name} ใหม่ก่อนทำต่อ
     ```
   - If all present → confirm:
     ```
     ✅ ตรวจสอบไฟล์ครบ — ทำต่อจาก: {first [ ] task}
     ```
4. Find the first `[ ]` task — that's where to resume
5. Continue from there

## Checklist Rules

- Mark `[x]` when a task is done, keep `[ ]` for pending
- Update "Last updated" timestamp after every change
- Update Summary counts after every change
- When resuming work, read this file FIRST to know where you left off

## Incremental Update Rule (MANDATORY)

**Update progress files in real-time — never batch at the end.**

After EVERY completed task:
1. Mark `[x]` on the completed task in `qa-task-progress.md` or `dev-task-progress.md`
2. Update `Summary` counts (Completed +1, Remaining -1)
3. Update `Last updated` timestamp
4. Update `PROGRESS.md` — QA or Dev count (e.g. `6/14` → `7/14`)

**Trigger points (must update after each):**
- Each `[x]` checkbox completed
- Each batch approved
- Each file created (spec file, helper, fixture)
- Upload gate completed (TS uploaded to Azure)

**Why:** Stale progress files cause resume failures — agent reads old state and re-does completed work.

## After Each Category Completes

When all tasks in a category are `[x]`:

1. Run the verification step (✅ Run tests) for that category
2. If tests PASS → move to next category
3. If tests FAIL → fix and re-run (max 3 attempts, then escalate to user)
4. Update Summary counts

## When ALL Tasks Complete

When every checkbox is `[x]`:

1. Update Status to `Completed`
2. Run full test suite one final time — record pass/fail counts
3. Update PROGRESS.md (mark ✅ + date)
4. Proceed to next stage (defined in `task-design.md`'s Next Step section)
5. Report to user:

```text
✅ {Task Type} — Complete
Tasks: {N}/{N} done
Tests: {pass}/{total} passed
Next: {next phase name}
```

## Lessons Learnt

ALWAYS read `{knowledge_root}/lessons/` before starting tasks:
- Dev: check for implementation pitfalls, architecture patterns, past mistakes
- QA: check for UI behaviors, flaky test patterns, locator issues
