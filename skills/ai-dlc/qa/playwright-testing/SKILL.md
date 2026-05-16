---
name: playwright-testing
description: >
  This skill should be used when the user asks to "write Playwright tests", "เขียน Playwright tests",
  "review test code", "review test", "run the tests", "รัน tests", "fix failing tests", "แก้ test ที่ fail",
  "heal test failures", "heal failures", "visual regression test", "screenshot comparison",
  "accessibility test", "axe-core", "WCAG", "component test",
  "test React component in browser", "ทดสอบ React component",
  or needs the full Playwright automation cycle: write code, review quality, execute tests, and auto-heal failures.
---

# Playwright Testing

Full automation cycle for Playwright: write → review → run → heal.

Always read the `ai-dlc/rules/playwright-rules/` skill before writing or reviewing any Playwright code.

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
| "HAR mock", "routeFromHAR", "offline test", "record HAR", "network mock" | `references/har-mocking.md` |
| "explore API", "discover endpoints", "Chrome DevTools", "explore-to-test", "capture API" | `references/explore-to-test.md` |

- **Playwright Code Review** — Static audit checklist: locators, AAA pattern, Labels.ts, DB patterns, reliability. (Read `references/playwright-code-review.md`)
- **Workflow** — Write, review, execute, and self-heal Playwright tests. (Read `references/workflow.md`)
- **Quick Automation** — Add/modify tests without full workflow. (Read `references/quick-automation.md`)
- **DB Writer** — Generate database config and service classes for test data. (Read `references/db-writer.md`)
- **Recorder** — Transform Playwright Codegen recordings into Page Object Model. (Read `references/recorder.md`)
- **Visual Regression** — Screenshot comparison, baseline management, multi-viewport testing. (Read `references/visual-regression.md`)
- **Accessibility** — axe-core integration, WCAG scanning, keyboard navigation testing. (Read `references/accessibility.md`)
- **Component Testing** — Test React/Vue/Svelte components in isolation in a real browser. (Read `references/component-testing.md`)
- **HAR Mocking** — Use HAR files to mock network traffic for offline/CI testing. (Read `references/har-mocking.md`)
- **Explore-to-Test** — Combined workflow: Chrome DevTools + HAR + Extension + AI → complete test suite. (Read `references/explore-to-test.md`)

## ⚠️ Gotchas

- **`waitForTimeout()` creep** — easy to add as a quick fix for flaky tests. Always replace with `waitForSelector`, `waitForResponse`, or `expect(locator).toBeVisible()` with a timeout option.
- **Selector breaks after UI refactor** — hardcoded CSS selectors or text-based selectors break silently. Fix: use `getByTestId` as primary, add `data-testid` to components during dev.
- **Healing loop overwrites correct assertions** — auto-heal can change `toEqual` to `toContain` to make tests pass without fixing the real bug. Always review healed assertions before committing.
- **Page Object state leak between tests** — shared PO instances carry state across tests. Fix: instantiate fresh PO in each test's Arrange block.
- **Screenshot baseline mismatch on CI** — screenshots taken on macOS differ from Linux CI (font rendering, pixel density). Fix: always generate baselines on CI, not locally.
- **DB seed not cleaned up** — test data written via db-writer persists and pollutes subsequent tests. Fix: always run teardown in `afterEach` or use transaction rollback.

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "I'll add tests later" | "Later" = never. Write tests WITH the code. Untested code is unverified code. |
| "The test is flaky, I'll just skip it" | Flaky tests hide real bugs. Fix the flakiness (use proper waits), don't skip. |
| "waitForTimeout is fine for now" | It's NEVER fine. It makes tests slow AND flaky. Use `waitForSelector` or `expect().toBeVisible()`. |
| "I know the selector works, no need for getByTestId" | CSS selectors break on refactor. `getByTestId` survives UI changes. Always prefer stable locators. |
| "Auto-heal fixed it, ship it" | Auto-heal can mask real bugs by weakening assertions. ALWAYS review healed code before committing. |
| "It works on my machine" | CI uses Linux with different fonts/rendering. Generate baselines on CI, test locally for logic only. |

---

## Red Flags

- 🚩 `waitForTimeout()` anywhere in new code → replace immediately
- 🚩 Test passes locally but fails on CI → environment-specific issue, don't ignore
- 🚩 No `data-testid` on interactive elements → will break on next UI refactor
- 🚩 POM instance shared across tests → state leak, instantiate fresh per test
- 🚩 Test file has no AAA comments (Arrange/Act/Assert) → structure unclear, add them
- 🚩 More than 3 assertions in one test → likely testing multiple things, split it
