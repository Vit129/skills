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

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "The tasks are small — I'll just do them all inline instead of dispatching subagents" | If there are 3+ independent tasks, subagent isolation prevents context pollution. Inline execution for many tasks causes context drift and missed details in later tasks. |
| "I'll skip Stage 2 (Code Quality) review since Stage 1 (Spec Compliance) passed" | Stage 1 checks IF the right thing was built. Stage 2 checks if it was built WELL. Passing spec compliance with spaghetti code creates tech debt that blocks future tasks. |
| "Two tasks touch the same file but I'll dispatch them in parallel anyway" | File conflicts between parallel subagents cause silent overwrites. Tasks sharing files MUST run sequentially — this is a hard rule, not a suggestion. |
| "The subagent can rely on what I told it verbally — no need to pass contextFiles" | Context drift is the #1 subagent failure mode. Each subagent must re-read the task spec and relevant files from disk, not depend on orchestrator memory. |
| "I'll mark the task done now and review it later" | Never mark a task `[x]` without both review stages passing. A "done" task that fails review pollutes `dev-task-progress.md` and misleads the orchestrator about actual progress. |

---

## Red Flags

- 🚩 `dev-task-progress.md` shows all tasks marked `[x]` but no review comments recorded → Reviews were skipped; re-run both stages on each completed task.
- 🚩 Two subagents were dispatched on tasks that edit the same source file → File conflict risk; stop the second agent and serialize those tasks.
- 🚩 Subagent prompt doesn't include which skills to load → Subagent will code without standards (e.g., missing playwright-rules); always specify skills in the dispatch prompt.
- 🚩 Task count is 1-2 but subagent-driven mode was activated → Overhead exceeds benefit; switch to inline execution for small task sets.
- 🚩 Orchestrator moved to Phase 3.2 but `dev-task-progress.md` still has unchecked items → Premature handoff; all tasks must be `[x]` before advancing phases.

---

## Verification

Before advancing from Phase 3.1 to 3.2, confirm:

- [ ] All tasks in `dev-task-progress.md` marked `[x]`
- [ ] Each task passed Stage 1 (Spec Compliance) review
- [ ] Each task passed Stage 2 (Code Quality) review
- [ ] No file conflicts between parallel subagents
- [ ] Commit hash recorded for each completed task
- [ ] No subagent prompt was sent without specifying skills to load
