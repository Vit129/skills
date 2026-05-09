---
name: robotframework-testing
description: >
  This skill should be used when the user asks to "write Robot Framework tests", "เขียน Robot Framework tests",
  "review mobile test code", "review mobile test", "run mobile tests", "รัน mobile tests",
  "fix failing mobile tests", "แก้ mobile test ที่ fail", "heal mobile test failures",
  "use Browser Library", "use Playwright with Robot Framework", "RF 7 features",
  "secret variables", "typed keywords",
  or needs the full Robot Framework + Appium automation cycle: write code, review quality, execute tests, and auto-heal failures.
---

# Robot Framework Testing

Full automation cycle for Robot Framework + Appium: write → review → run → heal.

Always read the `ai-dlc/rules/robotframework-rules/` skill before writing or reviewing any Robot Framework code.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "review mobile test", "code review RF", "audit robot code" | `references/rf-code-review.md` |
| "write RF tests", "run mobile tests", "fix failing tests", "heal failures" | `references/workflow.md` |
| "generate DB config", "create Python DB service", "seed mobile test data" | `references/python-db.md` |
| "Browser Library", "Playwright RF", "web test with RF", "rfbrowser" | `references/browser-library.md` |
| "RF 7 features", "secret variables", "typed keywords", "WHILE loop", "TRY EXCEPT", "VAR syntax" | `references/rf7-features.md` |

- **RF Code Review** — Static audit checklist: locators, AAA, identical naming, YAML fixtures, Expert Gems. (Read `references/rf-code-review.md`)
- **Workflow** — Write, review, execute, and self-heal Robot Framework tests. (Read `references/workflow.md`)
- **Python DB Writer** — Generate Python database config and service classes for mobile test data. (Read `references/python-db.md`)
- **Browser Library** — Playwright-powered web testing with RF: auto-wait, network mocking, modern locators. (Read `references/browser-library.md`)
- **RF 7.x Features** — Secret variables, typed keywords, TRY/EXCEPT, WHILE, VAR syntax, Listener API v3. (Read `references/rf7-features.md`)
