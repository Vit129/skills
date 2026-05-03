# Dispatch Rules

## When to Dispatch a Subagent

Dispatch when ALL of these are true:
- Task is in `dev-task-progress.md` with `[ ]` status
- Task does NOT share files with another in-progress task
- Task estimated effort > 30 minutes
- Task has clear acceptance criteria (from Phase 2.2 test scenarios)

## When to Execute Inline (no subagent)

Execute inline when ANY of these is true:
- Task is small (< 30 min)
- Task modifies files already open in orchestrator context
- Task is a hotfix or patch to previous task's output
- Total remaining tasks < 3

## Task Independence Criteria

Two tasks are INDEPENDENT if:
- They write to different files/modules
- Neither depends on the other's output
- They can be reviewed separately

Two tasks are DEPENDENT if:
- Task B imports/uses output from Task A
- They modify the same file
- Task B's test requires Task A's code to exist

**Rule:** Dependent tasks must run sequentially. Independent tasks can run in parallel (if Kiro supports it) or sequentially.

## Context Size Limits

Keep subagent prompt under ~4000 tokens:
- Task spec: full text from dev-task-progress.md
- Relevant files: list paths only (subagent reads them)
- Skills to load: list skill paths
- AIDLC context: system name, feature name, mode (Full/QA/Dev)

Do NOT include:
- Full file contents (subagent reads them directly)
- Previous task outputs (unless this task depends on them)
- Brainstorming history

## Parallel vs Sequential

| Scenario | Strategy |
|---|---|
| 3 independent tasks | Dispatch in parallel if supported; otherwise sequentially (keep write-scopes disjoint either way) |
| Task A → Task B dependency | Wait for A to complete before dispatching B |
| Task fails Stage 1 review | Fix in same subagent session, re-review before closing |
| Task fails Stage 2 review | Orchestrator decides: fix inline or re-dispatch |
