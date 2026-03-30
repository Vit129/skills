---
name: playwright-rules
description: >
  This skill should be used when the user asks to "check Playwright coding standards",
  "review Playwright code", "what are the Playwright rules", or needs the authoritative
  coding standards for API and Web UI Playwright automation. Always activate when writing
  or reviewing Playwright code.
---

# Playwright Standards

The authoritative coding standards for all Playwright automation.

- **Global Coding Standards** — AI governance, strategy, restrictions. (Read `references/coding-standards.md`)
- **API Testing Rules** — Project structure, naming, assertions, schemas, fixtures. (Read `references/api.md`)
- **Web UI Testing Rules** — Page Object Model, locators, interactions, fixtures. (Read `references/web-ui.md`)

## Key Mandates
1. No `waitForTimeout()` — use smart waits
2. Selector priority: `getByTestId` > `getByRole` > `getByLabel`
3. AAA Pattern: Arrange-Act-Assert in every test
4. Hybrid Testing: API setup over UI navigation
5. No inline logic: all interactions through Page Objects or Helpers
