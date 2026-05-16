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

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "I'll write the RF test code without loading robotframework-rules first" | The rules skill defines naming conventions, locator strategy, AAA pattern, and YAML fixture format. Without it, your code will fail code review on structural issues, not logic. |
| "I'll skip the code review step — the test passes so it's fine" | Passing tests can still have brittle locators, missing AAA structure, or hardcoded data. The rf-code-review checklist catches maintainability issues that passing tests don't reveal. |
| "I'll use XPath locators since they're more flexible" | RF rules mandate accessibility-based locators (id, name, accessibility_id). XPath breaks on any UI restructure and makes tests unmaintainable. |
| "I'll hardcode test data in the test file — it's just one value" | YAML fixtures are required for ALL test data. Hardcoded values create hidden dependencies and make tests impossible to run in different environments. |
| "RF 7 features like TRY/EXCEPT aren't needed — I'll use Run Keyword And Ignore Error" | RF 7.x syntax (TRY/EXCEPT, WHILE, VAR) is cleaner and more maintainable. Using deprecated patterns when modern alternatives exist creates technical debt. |

---

## Red Flags

- 🚩 Test keywords don't follow identical naming convention across Android/iOS → RF rules not loaded; read `robotframework-rules` before writing any code.
- 🚩 Test file has no YAML fixture imports → Test data is hardcoded somewhere; extract all data to YAML fixtures.
- 🚩 `workflow.md` not loaded but agent is writing + running + fixing tests → The full cycle (write → review → run → heal) requires the workflow reference; load it.
- 🚩 Agent fixed a failing test by adding `Sleep` or arbitrary timeout → Masking the real failure; find the actual root cause instead of adding waits.
- 🚩 Browser Library features used without loading `browser-library.md` reference → Web RF tests need the Browser Library reference for correct auto-wait and network mocking patterns.
