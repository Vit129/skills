---
name: playwright-testing
description: >
  This skill should be used when the user asks to "write Playwright tests", "review test code",
  "run the tests", "fix failing tests", "heal test failures", or needs the full Playwright
  automation cycle: write code, review quality, execute tests, and auto-heal failures.
---

# Playwright Testing

Full automation cycle for Playwright: write → review → run → heal.

Always read the `playwright-rules` skill before writing or reviewing any Playwright code.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "write tests", "review test code", "run tests", "fix failing tests", "heal failures" | `references/workflow.md` |
| "add a test", "modify this test", "quick fix", "patch test" | `references/quick-automation.md` |
| "generate DB config", "create test data service", "seed database" | `references/db-writer.md` |
| "convert recording", "I recorded with Codegen", "transform this script" | `references/recorder.md` |

- **Workflow** — Write, review, execute, and self-heal Playwright tests. (Read `references/workflow.md`)
- **Quick Automation** — Add/modify tests without full workflow. (Read `references/quick-automation.md`)
- **DB Writer** — Generate database config and service classes for test data. (Read `references/db-writer.md`)
- **Recorder** — Transform Playwright Codegen recordings into Page Object Model. (Read `references/recorder.md`)
