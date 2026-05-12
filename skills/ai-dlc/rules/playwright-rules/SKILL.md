---
name: playwright-rules
description: >
  This skill should be used when the user asks to "check Playwright coding standards",
  "เช็ค Playwright standards", "review Playwright code", "review Playwright",
  "what are the Playwright rules", "Playwright rules คืออะไร",
  or needs the authoritative coding standards for API and Web UI Playwright automation.
  Always activate when writing or reviewing Playwright code.
---

# Playwright Standards

The authoritative coding standards for all Playwright automation.

- **Global Coding Standards** — AI governance, strategy, restrictions. (Read `references/pw-coding-standards.md`)
- **API Testing Rules** — Project structure, naming, assertions, schemas, fixtures. (Read `references/api.md`)
- **Web UI Testing Rules** — Page Object Model, locators, interactions, fixtures. (Read `references/web-ui.md`)

## Key Mandates
1. No `waitForTimeout()` — use smart waits
2. Selector priority: `getByTestId` (scope) + `getByRole({ name: L.keyName })` (target) — hybrid pattern
3. AAA Pattern: Arrange-Act-Assert in every test
4. Hybrid Testing: API setup over UI navigation
5. No inline logic: all interactions through Page Objects or Helpers
6. Labels.ts: TH/EN UI labels in separate file — never hardcode text in `getByRole({ name })`

## ⚠️ Gotchas

- **Gemini ignores rules on long prompts** — when Gemini prompt is long, it skips reading pw-coding-standards.md. Fix: put the rule block at the TOP of the Gemini prompt, not the bottom.
- **`waitForTimeout()` re-introduced after heal** — auto-heal often adds `waitForTimeout(500)` as a quick fix. Always grep for `waitForTimeout` after any heal cycle.
- **Labels.ts not updated for new UI text** — new UI strings added without updating Labels.ts cause `getByRole({ name })` to fail silently with wrong label. Fix: update Labels.ts before writing any test that uses new UI text.
- **Hybrid test skips API setup** — agent writes full UI navigation instead of API setup for Arrange phase. Fix: explicitly instruct "use API to set up test data, not UI navigation" in every test-writing prompt.
