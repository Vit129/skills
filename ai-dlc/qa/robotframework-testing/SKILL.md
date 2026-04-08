---
name: robotframework-testing
description: >
  This skill should be used when the user asks to "write Robot Framework tests", "review mobile test code",
  "run mobile tests", "fix failing mobile tests", "heal mobile test failures", or needs the full
  Robot Framework + Appium automation cycle: write code, review quality, execute tests, and auto-heal failures.
---

# Robot Framework Testing

Full automation cycle for Robot Framework + Appium: write → review → run → heal.

Always read the `robotframework-rules` skill before writing or reviewing any Robot Framework code.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "write RF tests", "review mobile test", "run mobile tests", "fix failing tests", "heal failures" | `references/workflow.md` |
| "generate DB config", "create Python DB service", "seed mobile test data" | `references/python-db.md` |

- **Workflow** — Write, review, execute, and self-heal Robot Framework tests. (Read `references/workflow.md`)
- **Python DB Writer** — Generate Python database config and service classes for mobile test data. (Read `references/python-db.md`)
