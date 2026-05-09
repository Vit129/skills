# /test — Prove it works

Route to `ai-dlc/qa/playwright-testing/` + `ai-dlc/core/debugging/`.

## Instructions

1. Determine what to test:
   - If user specifies a file/feature → test that
   - If in AIDLC context → test current task from progress file
2. Write tests following:
   - Load `ai-dlc/rules/playwright-rules/` (or `robotframework-rules/` for mobile)
   - AAA pattern (Arrange-Act-Assert)
   - `getByTestId` > `getByRole` for locators
   - No `waitForTimeout()`
3. Run tests:
   - `npx playwright test --grep "test name"`
   - If tests fail → switch to `core/debugging/` triage
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
