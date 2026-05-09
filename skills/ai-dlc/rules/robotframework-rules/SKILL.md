---
name: robotframework-rules
description: >
  This skill should be used when the user asks to "check Robot Framework standards",
  "เช็ค Robot Framework standards", "review RF code", "review RF",
  "what are the RF rules", "RF rules คืออะไร",
  or needs the authoritative coding standards for Robot Framework + Appium mobile automation.
  Always activate when writing or reviewing Robot Framework code.
---

# Robot Framework Rules

The authoritative coding standards for all Robot Framework mobile automation.

- **Global Standards** — AI governance, naming, locator priority, AAA pattern, tags. (Read `references/standards.md`)
- **Android Rules** — Android-specific locators, actions, deep linking, ADB. (Read `references/android.md`)
- **iOS Rules** — iOS-specific locators, predicates, biometrics, class chain. (Read `references/ios.md`)

## Key Mandates
1. Keyword names MUST be 100% identical between Android and iOS
2. Locator priority: `accessibility_id` > `id` > platform-specific > `xpath` (avoid)
3. No `Sleep` — use `Wait Until Element Is Visible`
4. AAA Pattern: Arrange-Act-Assert in every test
5. All test data from YAML fixtures, not hardcoded
6. Labels.yaml: TH/EN UI labels in separate file — never hardcode text in keywords
