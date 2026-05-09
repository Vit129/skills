# Dispatch Rules

## When to Dispatch a Subagent

Dispatch when ALL of these are true:
- Task is in `dev-task-progress.md` or `qa-task-progress.md` with `[ ]` status
- Task does NOT share files with another in-progress task
- Task estimated effort > 30 minutes
- Task has clear acceptance criteria (from Phase 2.2 test scenarios or Phase 2.5 dev task design)

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

**Rule:** Dependent tasks must run sequentially. Independent tasks can run in parallel (if runtime supports it) or sequentially.

## Toolset Scoping (Per Subagent)

Restrict each subagent to only the tools it needs — prevents accidental side effects:

| Task Type | Toolsets | Why |
|-----------|----------|-----|
| QA test script writing | `["file", "terminal"]` | Read specs, write tests, run test commands |
| Dev implementation | `["file", "terminal"]` | Read specs, write code, run build/tests |
| Research/analysis | `["file"]` | Read-only, no shell access |
| Full-stack (rare) | `["file", "terminal", "web"]` | Only when task needs external API docs |

**Rule:** Never give a subagent more tools than it needs. Default is `["file", "terminal"]`.

## Concurrency Configuration

| Setting | Default | Range | Effect |
|---------|---------|-------|--------|
| max_concurrent | 3 | 1-5 | How many subagents run in parallel |
| max_iterations | 50 | 10-100 | Max turns per subagent before timeout |

**Runtime behavior:**
- Kiro (`invokeSubAgent`): supports true parallel (multiple calls)
- Claude Code / Gemini: sequential only — dispatch one at a time
- If runtime doesn't support parallel → fall back to sequential with same rules

## Phase-Specific Dispatch

### Phase 2.4 — QA Test Script Design

| Criteria | Value |
|----------|-------|
| Progress file | `qa-task-progress.md` |
| Minimum tasks | 3+ unchecked |
| Toolsets | `["file", "terminal"]` |
| Skills to load | `qa/playwright-testing` or `qa/robotframework-testing` + `rules/{platform}-rules` |
| Write scope | Test spec files only (e.g., `tests/**/*.spec.ts`, `tests/**/*.robot`) |
| Review focus | Stage 1: AC coverage + scenario match. Stage 2: coding standards compliance |

### Phase 3.1 — Dev Implementation

| Criteria | Value |
|----------|-------|
| Progress file | `dev-task-progress.md` |
| Minimum tasks | 3+ unchecked |
| Toolsets | `["file", "terminal"]` |
| Skills to load | `dev/frontend-dev` or `dev/backend-dev` + relevant `rules/` |
| Write scope | Source files only (e.g., `src/**/*`) |
| Review focus | Stage 1: AC match + logical design compliance. Stage 2: code quality |

## Parallel vs Sequential

| Scenario | Strategy |
|---|---|
| 3+ independent tasks | Dispatch in parallel if supported; otherwise sequentially |
| Task A → Task B dependency | Wait for A to complete before dispatching B |
| Task fails Stage 1 review | Fix in same subagent session, re-review before closing |
| Task fails Stage 2 review | Orchestrator decides: fix inline or re-dispatch |
| Mixed QA + Dev tasks | Dispatch QA batch first (Phase 2.4), then Dev batch (Phase 3.1) |

## Context Size Limits

Keep subagent prompt under ~4000 tokens:
- Task spec: full text from progress file
- Relevant files: list paths only (subagent reads them)
- Skills to load: list skill paths
- AIDLC context: system name, feature name, mode (Full/QA/Dev)
- Toolsets: explicit list

Do NOT include:
- Full file contents (subagent reads them directly)
- Previous task outputs (unless this task depends on them)
- Brainstorming history
- Conversation history (subagents start fresh — this is by design)
