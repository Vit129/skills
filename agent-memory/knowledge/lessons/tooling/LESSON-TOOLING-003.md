---
id: LESSON-TOOLING-003
domain: tooling
type: bug
status: active
confidence: 0.95
created: 2026-04-26
updated: 2026-04-26
---

# Hook Routing Needs Absolute User Paths

## Summary

Session-save hooks that use `~/` or project-root discovery can route user-level memory updates to the wrong workspace. Use `/Users/supavit.cho/.claude/` explicitly for user-level memory.

## Detail

The hook prompt previously let the agent resolve workspace root through project discovery. That caused lessons intended for the user-level memory store to land in a project-level `agent-memory/` folder.

## Apply Next Time

- For global/user memory edits, use `/Users/supavit.cho/.claude/agent-memory/`.
- For project memory edits, route to the project that owns the changed files.
- After hook changes, verify by checking where new lessons and state rows were written.

## Evidence

- 2026-04-26 session: lessons were found in the wrong location and migrated.
