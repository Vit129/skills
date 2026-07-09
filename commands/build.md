# /build — Implement incrementally

Continue implementing via TDD (Red → Green → Refactor). No phase gate — proceed as soon as design/scope is clear.

## Instructions

1. If `agent-memory/plans/[feature]/dev-task-progress.md` or `qa-task-progress.md` exists, find first incomplete task; otherwise implement directly from the agreed design/scope
2. Implement one task/slice at a time:
   - Load relevant rules (`playwright-rules/`, `robotframework-rules/`, etc.)
   - Check `agent-memory/knowledge/` for existing patterns
   - Write failing test → implement → refactor → run tests → commit
3. Update task progress file after each task, if one exists

## Prerequisites

- Scope agreed with user (via `/spec` or conversation)
- Rules loaded before generating code

## Done When

- Tasks (or agreed scope) complete
- Tests pass
- Commit hash recorded
