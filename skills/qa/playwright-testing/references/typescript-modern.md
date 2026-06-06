# Playwright TypeScript Reference

Use this reference for Playwright Test code written in TypeScript, including
locators, fixtures, page objects, config, traces, and CI verification.

Official docs:

- Best practices: https://playwright.dev/docs/best-practices
- TypeScript: https://playwright.dev/docs/test-typescript
- Locators: https://playwright.dev/docs/locators
- Fixtures: https://playwright.dev/docs/test-fixtures
- Configuration: https://playwright.dev/docs/test-configuration
- Network: https://playwright.dev/docs/network
- Page object models: https://playwright.dev/docs/pom
- Auto-waiting: https://playwright.dev/docs/actionability
- Assertions: https://playwright.dev/docs/test-assertions

## TypeScript Rules

- Write specs and page objects in `.ts`.
- Run `tsc --noEmit` separately; Playwright can transform TypeScript without
  performing full type checking.
- Enable lint rules that catch missing awaits, especially
  `@typescript-eslint/no-floating-promises`.
- Type custom fixtures and page objects explicitly.

## Locator Strategy

- Prefer user-facing locators: `getByRole`, `getByLabel`, `getByText`,
  `getByPlaceholder`, `getByAltText`, and `getByTitle`.
- Use `getByTestId` for explicit app contracts, dynamic rows, or elements whose
  accessible name is intentionally user-dependent.
- Avoid CSS and XPath selectors for user flows unless no better contract exists.
- Chain and filter locators to stay row-scoped.

## Assertion Strategy

- Use web-first assertions such as `await expect(locator).toBeVisible()`.
- Do not use manual immediate checks like
  `expect(await locator.isVisible()).toBe(true)`.
- Avoid `waitForTimeout()`. Wait for visible UI, responses, URLs, or state.

## Fixtures and POM

- Keep tests isolated; every test gets its own page/context fixture.
- Instantiate page objects fresh per test.
- Use worker-scoped fixtures only for safe shared setup, never mutable test
  state.
- Keep page objects focused on user actions and observable state, not assertions
  that hide business expectations.

## Debugging and CI

- Use traces for CI failures; avoid collecting full traces for every run unless
  the project intentionally accepts the cost.
- Configure `forbidOnly`, CI retries, reporters, projects, and browser devices
  in `playwright.config.ts`.
- Install only required browsers on CI when runtime cost matters.
