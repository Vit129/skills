---
name: subagent-driven
description: >
  Multi-agent orchestrator for AIDLC Phase 3.1 Implementation.
  Supports auto-dispatch (agent decides) and manual dispatch (user triggers).
  Triggers: "spawn subagent", "ใช้ subagent", "parallel tasks", "dispatch agent",
  "run tasks in parallel", "subagent-driven development", "2-stage review",
  "orchestrate implementation", "ให้ agent ทำแต่ละ task", "auto-dispatch".
  Use DURING Phase 3.1 — after DECISIONS + PLAN are approved.
  Requires: dev-task-progress.md with tasks listed.
---

# Subagent-Driven Development

Multi-agent orchestrator for Phase 3.1 Implementation. Dispatches subagents per task
with 2-stage review. Supports auto-dispatch (agent decides when to parallelize)
and manual dispatch (user explicitly triggers).

## Runtime Detection (Auto)

The orchestrator detects which runtime is available and adapts:

| Runtime | Tool | Parallel Support | Detection |
|---------|------|-----------------|-----------|
| Kiro | `invokeSubAgent` | Yes (multiple calls) | Check if `invokeSubAgent` tool exists |
| Claude Code | `Task` tool or `spawn_agent` | Sequential only | Check available tools |
| Gemini CLI | subprocess dispatch | Sequential only | Detect from env |

**Rule:** If runtime doesn't support parallel → fall back to sequential dispatch with same rules.

## Dispatch Modes

### Auto-Dispatch (Default for 3+ independent tasks)

The orchestrator automatically dispatches when ALL conditions met:
1. `dev-task-progress.md` or `qa-task-progress.md` has 3+ unchecked tasks
2. Tasks pass independence check (no shared files)
3. Each task estimated > 30 min effort

No user confirmation needed — agent decides based on task graph.

### Supported Phases

| Phase | Progress File | Toolsets for Subagent |
|-------|--------------|----------------------|
| 2.4 QA Test Script Design | `qa-task-progress.md` | `["file", "terminal"]` — read specs, write test scripts, run tests |
| 3.1 Dev Implementation | `dev-task-progress.md` | `["file", "terminal"]` — read specs, write code, run tests |

**Mode coverage:**
- **Full**: auto-dispatch at Phase 2.4 (QA) + Phase 3.1 (Dev)
- **QA Only / QA Automation**: auto-dispatch at Phase 2.4
- **Dev Only**: auto-dispatch at Phase 3.1

### Manual Dispatch

User explicitly says "spawn subagent" or "ใช้ subagent" → dispatch immediately.

### Inline Execution (Fallback)

When tasks are small, coupled, or < 3 → execute in current session without subagent.

## When to Use

- Phase 3.1 has 3+ independent tasks that don't share context
- Tasks are large enough to benefit from fresh context (>30 min each)
- Auto-dispatch: agent detects conditions are met
- Manual: user explicitly requests parallel execution

## When NOT to Use

- Tasks are small or tightly coupled (share same files/context)
- Vibe mode — single agent is faster for quick tasks
- Task count < 3 — overhead not worth it
- Runtime has no subagent capability — execute inline

## How It Works

```
Orchestrator (this session)
    ↓
Read dev-task-progress.md → identify independent tasks
    ↓
Auto-dispatch check: 3+ independent? → YES → dispatch subagents
                                       → NO  → execute inline
    ↓
For each task → dispatch Subagent
    ├── Context: task spec + relevant files + skills to load
    ├── Execute: implement task
    ├── Stage 1 Review: spec compliance (self-review)
    └── Stage 2 Review: code quality (self-review)
    ↓
Orchestrator collects results → aggregate in dispatch-log.md
    ↓
Update dev-task-progress.md → all `[ ]` → `[x]`
    ↓
Conflict check → resolve if any file touched by 2+ subagents
    ↓
Phase 3.2 Automated Testing
```

## Auto-Dispatch Decision Flow

```
1. Count unchecked tasks in dev-task-progress.md
2. If < 3 → execute inline (no subagent)
3. Build dependency graph:
   - For each pair of tasks, check file overlap
   - Mark dependent pairs
4. Group independent tasks → dispatch batch
5. Queue dependent tasks → sequential after dependencies complete
6. Log decision in dispatch-log.md
```

## Ownership Rules (Non-Negotiable)

- One subagent owns exactly one task.
- Two subagents must not edit the same file at the same time.
- Each dispatched task must list an explicit write-scope (file paths / module boundaries).
- Dependent tasks run sequentially; independent tasks may run in parallel if the runtime supports it.

## Dispatch Rules

Read `references/dispatch-rules.md` for:
- When to dispatch vs execute inline
- Task independence criteria
- Context size limits

## Context Template

Read `references/context-template.md` for:
- What to include in subagent prompt
- Which skills to tell subagent to load
- How to pass AIDLC phase context

## 2-Stage Review

Read `references/review-checklist.md` for:
- Stage 1: Spec Compliance checklist
- Stage 2: Code Quality checklist
- Pass/fail criteria and retry rules

## Result Aggregation

After subagents complete, orchestrator:

1. Collect all reports (from subagent output or dispatch-log.md)
2. Check for conflicts:
   - Same file modified by 2+ subagents → manual merge needed
   - Import/dependency conflicts → resolve in order
3. Update `dev-task-progress.md` — mark completed tasks `[x]`
4. Write summary to `dispatch-log.md`

### dispatch-log.md Format

```markdown
# Dispatch Log — {feature-name}

## Run {date}

| Task | Subagent | Status | Stage 1 | Stage 2 | Files Changed | Duration |
|------|----------|--------|---------|---------|---------------|----------|
| T1 | agent-1 | ✅ done | PASS | PASS | src/auth.ts | ~15 min |
| T2 | agent-2 | ✅ done | PASS | PASS | src/api.ts | ~20 min |
| T3 | inline | ✅ done | PASS | PASS | src/utils.ts | ~5 min |

## Conflicts
None (or list conflicts + resolution)

## Next
→ Phase 3.2 Automated Testing
```

## Handoff Back

After all tasks complete:
1. Update `dev-task-progress.md` — all `[ ]` → `[x]`
2. Write dispatch-log.md summary
3. Return to orchestrator → Phase 3.2 Automated Testing

## Minimal Spawn Flow (Tool-Agnostic)

1. Orchestrator selects 3+ independent tasks from `dev-task-progress.md`.
2. For each task:
   - Build a prompt using `references/context-template.md`.
   - Include task write-scope (exact files) and required skills/rules.
3. Dispatch subagent.
4. Subagent must:
   - Implement only within scope
   - Run tests (where applicable)
   - Self-review Stage 1 + Stage 2
   - Report back with files changed + status
5. Orchestrator integrates results, resolves conflicts, updates progress file.

## ⚠️ Gotchas

- **Context drift** — subagent must re-read task spec, not rely on orchestrator's memory
- **File conflicts** — two subagents must NOT edit the same file simultaneously
- **Review skip** — never mark task done without passing both review stages
- **Token cost** — each subagent = fresh context load; use only for tasks that justify it
- **One agent per task** — never spawn 2 subagents on the same task
