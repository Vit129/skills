# Mobile Automation Architecture

Design the page object structure for Android/iOS test automation using Robot Framework + Appium.

## When to use
- Designing mobile automation for a new feature
- After asset discovery and database strategy are done

## Process
1. Read implementation plan — extract test cases, platform (Android/iOS), DB strategy
2. Read coding rules from `robotframework-rules` skill (standards.md + android.md or ios.md)
3. Parse XML source (if available) — extract accessibility_id, resource-id, content-desc
4. Analyze requirements (CoT) — count screens, identify shared vs feature keywords
5. Generate patterns (LATS) — simulate 3 patterns, select hybrid
6. Validate design — AAA pattern, mandatory tags, locator priority
7. Self-reflect — test isolation? over-abstracted keywords? assumed identical locators?
8. Generate architecture — page objects, keyword mapping table, file structure

## Architecture pattern: Page Object (Hybrid API + Mobile)
```text
[Feature]HelperKeyword.robot (Main Helper)
├── [feature]_db_service.py (Database: seed/cleanup)
├── [Feature]NavigationPage.robot (Static UI: menus)
├── [Feature]HomePage.robot (Dynamic UI: content)
└── Workflows (High-level business flows)
```

## File structure
```text
pages/[platform]/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Page.robot
tests-mobile/[platform]/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature].robot
fixtures/[platform]/sit.yaml
helpers/shared-services/[systemFeature]_db_service.py
```
- `[platform]` = `android` or `ios`
- `[SYSTEM_KEBAB]` = system name in kebab-case (e.g., `hospital`)
- `[SYSTEM_FEATURE_KEBAB]` = feature name in kebab-case (e.g., `hospital-triage`)
- `[systemFeature]` = feature name in lowerCamelCase (e.g., `hospitalTriage`)
- MUST follow this structure — do not flatten or skip levels

## Locator priority
1. `accessibility_id` — most stable, same across platforms
2. `id` (Android) / `predicate` (iOS)
3. `UIAutomator` (Android) / `class chain` (iOS)
4. `xpath` — avoid

## Key rules
- Keyword names MUST be 100% identical between Android and iOS
- No `Sleep` — use `Wait Until Element Is Visible`
- No XPath as first resort
- Hybrid Setup: use API calls for data preparation, not UI navigation
- All test data from YAML fixtures, not hardcoded

## Approval
Show architecture summary to user and wait for explicit approval before coding.
