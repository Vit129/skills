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
Inspired by Superpowers subagent-driven-development. Works with Kiro `invokeSubAgent` tool.

## When to Use

- Phase 3.1 has 3+ independent tasks that don't share context
- Tasks are large enough to benefit from fresh context (>30 min each)
- User wants parallel execution or isolated review per task

## When NOT to Use

- Tasks are small or tightly coupled (share same files/context)
- Vibe mode — single agent is faster for quick tasks
- Task count < 3 — overhead not worth it

## How It Works

```text
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

## Kiro IDE — Tool Mapping

In Kiro, use the built-in `invokeSubAgent` tool directly:

```text
invokeSubAgent(
  name: "general-task-execution",
  prompt: "<task spec + instructions + skills to load>",
  explanation: "Dispatching task {N} for isolated execution with 2-stage review",
  contextFiles: [
    { path: ".aidlc/{system}/{feature}/dev-task-progress.md" },
    { path: "<relevant source files>" }
  ]
)
```

**Rules for Kiro:**
- Use `name: "general-task-execution"` for all implementation tasks
- Include relevant `.aidlc/` artifacts + source files in `contextFiles`
- In the `prompt`, tell the subagent which skills to load (e.g., "Load ai-dlc/rules/playwright-rules")
- After subagent returns, run both review stages before marking task done
- Use `userInput` tool to ask user for approval between tasks if needed

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

## ⚠️ Gotchas

- **Context drift** — subagent must re-read task spec, not rely on orchestrator's memory
- **File conflicts** — two subagents must NOT edit the same file simultaneously
- **Review skip** — never mark task done without passing both review stages
- **Token cost** — each subagent = fresh context load; use only for tasks that justify it
- **One agent per task** — never spawn 2 subagents on the same task
