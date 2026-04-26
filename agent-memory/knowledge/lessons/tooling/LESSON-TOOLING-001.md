---
id: LESSON-TOOLING-001
domain: tooling
type: architecture
status: active
confidence: 0.90
created: 2026-04-26
updated: 2026-04-26
---

# Agent Memory Has User And Project Stores

## Summary

Agent Memory can exist at the user level (`/Users/supavit.cho/.claude/agent-memory/`) and at the project level (`{project_root}/agent-memory/`). Hooks must route saves by inspecting the actual files written during the session.

## Detail

Using workspace discovery alone can route memory to the wrong project. A session that edits files under `/Users/supavit.cho/.claude/` should update `/Users/supavit.cho/.claude/agent-memory/`, while project work should update that project's `agent-memory/`.

## Apply Next Time

- Inspect actual changed file paths before choosing the memory root.
- Use absolute paths for user-level memory rules.
- Treat `{project_root}` as the active project root, not always the shell cwd.

## Evidence

- 2026-04-26 session: hook routing fix v5.0.0 and lesson migration.
