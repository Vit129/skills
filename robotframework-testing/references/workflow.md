# Robot Framework Workflow

Write → Review → Execute → Heal. The full mobile test automation cycle.

## 1. Code Writer

Generate Robot Framework + Appium test files from architecture design.

**Steps:**
1. Read architecture and platform standards (robotFrameworkCodingStandards.md + android.md/ios.md)
2. Create directory structure (kebab-case folders)
3. Generate YAML fixtures — `[feature]Data.yaml` with environment-specific data
4. Generate page objects — `.robot` files with Keywords, locators (accessibility_id > id)
5. Generate test files — AAA pattern, mandatory tags, [TS-xxxx] prefix, Setup/Teardown

**Folder Structure (MANDATORY):**
```
tests/mobile-testing/
├── tests-mobile/[platform]/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature].robot
├── pages/[platform]/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[SystemFeature]Page.robot
├── keywords/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Keywords.robot
└── fixtures/[platform]/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Data.yaml
```
- `[platform]` = `android` or `ios`
- `[SYSTEM_KEBAB]` = system name in kebab-case (e.g., `hospital`)
- `[SYSTEM_FEATURE_KEBAB]` = feature name in kebab-case (e.g., `hospital-triage`)
- `[systemFeature]` = feature name in lowerCamelCase (e.g., `hospitalTriage`)
- MUST follow this structure — do not flatten or skip levels

**Forbidden:**
- Hardcoded test data — use `fixtures/*.yaml`
- `Sleep` — use `Wait Until Element Is Visible`
- `xpath` as first resort — use `accessibility_id` or `id`
- Hardcoded credentials — use `.env`
- Different keyword names between Android and iOS

## 2. Code Review

Static quality audit — no running tests.

**Check:** Global standards compliance, platform-specific rules, identical keyword naming across platforms, locator priority, AAA pattern, mandatory tags.

## 3. Test Execution

Run Robot Framework tests and capture results.

**Steps:**
1. Verify .robot file exists, Robot Framework installed, Appium reachable
2. Run with `--console dotted` (minimal output)
3. Parse `output.xml` — total, passed, failed, error messages, screenshots
4. If failures → trigger healer (max 3 attempts)
5. Record lessons — only technical patterns (custom keyboards, locator quirks)

## 4. Self-Healing

Analyze failures and auto-fix mobile test code.

**Error triage:**
- Environment (skip): Appium not reachable, device not found
- Code (heal): element not found, keyword not found, assertion failed

**Rules:**
- Max 3 attempts per test
- Never delete keywords or test cases
- Preserve identical naming across platforms after fix
- Check impact on shared keywords before fixing
