---
name: playwright-testing
description: >
  This skill should be used when the user asks to "write Playwright tests", "review test code",
  "run the tests", "fix failing tests", "heal test failures", "visual regression test",
  "screenshot comparison", "accessibility test", "axe-core", "WCAG", "component test",
  "test React component in browser", or needs the full Playwright
  automation cycle: write code, review quality, execute tests, and auto-heal failures.
---

# Playwright Testing

Full automation cycle for Playwright: write → review → run → heal.

Always read the `playwright-rules` skill before writing or reviewing any Playwright code.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "review test code", "code review", "check quality", "audit test" | `references/playwright-code-review.md` |
| "write tests", "run tests", "fix failing tests", "heal failures" | `references/workflow.md` |
| "add a test", "modify this test", "quick fix", "patch test" | `references/quick-automation.md` |
| "generate DB config", "create test data service", "seed database" | `references/db-writer.md` |
| "convert recording", "I recorded with Codegen", "transform this script" | `references/recorder.md` |
| "visual regression", "screenshot test", "screenshot comparison", "UI looks wrong" | `references/visual-regression.md` |
| "accessibility test", "axe-core", "WCAG", "a11y", "screen reader" | `references/accessibility.md` |
| "component test", "test component in isolation", "mount component", "ct test" | `references/component-testing.md` |

- **Playwright Code Review** — Static audit checklist: locators, AAA pattern, Labels.ts, DB patterns, reliability. (Read `references/playwright-code-review.md`)
- **Workflow** — Write, review, execute, and self-heal Playwright tests. (Read `references/workflow.md`)
- **Quick Automation** — Add/modify tests without full workflow. (Read `references/quick-automation.md`)
- **DB Writer** — Generate database config and service classes for test data. (Read `references/db-writer.md`)
- **Recorder** — Transform Playwright Codegen recordings into Page Object Model. (Read `references/recorder.md`)
- **Visual Regression** — Screenshot comparison, baseline management, multi-viewport testing. (Read `references/visual-regression.md`)
- **Accessibility** — axe-core integration, WCAG scanning, keyboard navigation testing. (Read `references/accessibility.md`)
- **Component Testing** — Test React/Vue/Svelte components in isolation in a real browser. (Read `references/component-testing.md`)
