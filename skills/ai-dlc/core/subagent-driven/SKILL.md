---
name: subagent-driven
description: >
  This skill should be used when orchestrating AIDLC Phase 3.1 (Implementation) via subagents.
  Triggers: "spawn subagent", "ใช้ subagent", "parallel tasks", "dispatch agent",
  "run tasks in parallel", "subagent-driven development", "2-stage review",
  "orchestrate implementation", "ให้ agent ทำแต่ละ task".
  Use DURING Phase 3.1 — after DECISIONS + PLAN are approved.
  Requires: dev-task-progress.md with tasks listed.
---

# Subagent-Driven Development

Orchestrate Phase 3.1 Implementation by dispatching subagents per task with 2-stage review.
Inspired by Superpowers subagent-driven-development.

Supported runtimes (pick what your agent runtime provides):
- Kiro: `invokeSubAgent`
- Codex-style agent runners: `spawn_agent` + `send_input` + `wait_agent` (tool names may vary)

## When to Use

- Phase 3.1 has 3+ independent tasks that don't share context
- Tasks are large enough to benefit from fresh context (>30 min each)
- User wants parallel execution or isolated review per task

## When NOT to Use

- Tasks are small or tightly coupled (share same files/context)
- Vibe mode — single agent is faster for quick tasks
- Task count < 3 — overhead not worth it

## How It Works

```
Orchestrator (this session)
    ↓
Read dev-task-progress.md → identify independent tasks
    ↓
For each task → dispatch Subagent
    ├── Context: task spec + relevant files + skills to load
    ├── Execute: implement task
    ├── Stage 1 Review: spec compliance
    └── Stage 2 Review: code quality
    ↓
Orchestrator collects results → update dev-task-progress.md
    ↓
Next task (sequential) or parallel if tasks are independent
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

## Handoff Back

After all tasks complete:
1. Update `dev-task-progress.md` — all `[ ]` → `[x]`
2. Return to orchestrator → Phase 3.2 Automated Testing

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
