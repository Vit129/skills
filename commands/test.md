# /test — Prove it works

Route to `~/.claude/skills/playwright-testing/` + `~/.claude/skills/debug-mantra/`.

## Instructions

1. Determine what to test:
   - If user specifies a file/feature → test that
   - If a task progress file exists (`dev-tasks.md`/`qa-tasks.md`) → test current task from it
2. Write tests following:
   - Load `~/.claude/skills/playwright-rules/` (or `~/.claude/skills/robotframework-rules/` for mobile)
   - AAA pattern (Arrange-Act-Assert)
   - `getByTestId` > `getByRole` for locators
   - No `waitForTimeout()`
3. Run tests:
   - `npx playwright test --grep "test name"`
   - If tests fail → switch to `~/.claude/skills/debug-mantra/` triage
4. If debugging:
   - Stop-the-line → Reproduce → Localize → Fix → Guard
   - Write regression test before fixing

## Prerequisites

- Code to test must exist
- Test framework configured (playwright.config.ts or robot.yaml)

## Done When

- Tests pass
- No flaky tests introduced
- Coverage for the feature/fix is adequate
