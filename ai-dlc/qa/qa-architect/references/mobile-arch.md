# Mobile Automation Architecture

Design the page object structure for Android/iOS test automation using Robot Framework + Appium.

## When to use
- Designing mobile automation for a new feature
- After asset discovery and database strategy are done

## Process
1. Read implementation plan — extract test cases, platform (Android/iOS), DB strategy, templates found
2. Read coding rules from `robotframework-rules` skill (standards.md + android.md or ios.md)
3. Parse XML source (if available) — extract accessibility_id, resource-id, content-desc, text
4. Analyze requirements (CoT) — count screens, identify shared vs feature keywords
5. Generate patterns (LATS) — simulate 3 patterns (Simple vs Hybrid vs Expert), select hybrid
6. Validate design — AAA pattern, mandatory tags, locator priority
7. Self-reflect — test isolation? over-abstracted keywords? assumed identical locators?
8. Generate architecture — page objects, unified keyword mapping table, file structure

## Architecture pattern: Page Object (Hybrid API + Mobile)
```text
[Feature]HelperKeyword.robot (Main Helper)
├── [feature]_db_service.py (Database: seed/cleanup via Python)
├── [Feature]NavigationPage.robot (Static UI: menus)
├── [Feature]HomePage.robot (Dynamic UI: content)
└── Workflows (High-level business flows)
```

## File structure
```text
pages/[platform]/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Page.robot
tests-mobile/[platform]/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature].robot
fixtures/[platform]/sit.yaml
helpers/shared-services/[system_feature_snake]_db_service.py
helpers/shared-helpers/[system_feature_snake]_helper.py
```
- `[platform]` = `android` or `ios`
- Folders: kebab-case. Files: lowerCamelCase (.robot) or snake_case (.py)
- MUST use 2-level structure — never flat
  - ❌ WRONG: `tests-mobile/android/shopee/shopeePayment.robot`
  - ✅ CORRECT: `tests-mobile/android/shopee/shopee-payment/shopeePayment.robot`

## Locator priority
1. `accessibility_id` — most stable, same across platforms (maps to `data-testid` / `accessibilityIdentifier` from dev)
2. `id` (Android) / `predicate` (iOS)
3. `UIAutomator` (Android) / `class chain` (iOS)
4. `xpath` — avoid

## Key rules
- Keyword names MUST be 100% identical between Android and iOS
- No `Sleep` — use `Wait Until Element Is Visible`
- No XPath as first resort
- Hybrid Setup: use API calls for data preparation, not UI navigation
- All test data from YAML fixtures, not hardcoded
- All UI labels (button text, heading) in `[systemFeature]Labels.yaml` — never hardcode text in keywords

## Labels File Pattern (Bi-language TH/EN)

Mobile uses YAML labels — same concept as web `Labels.ts`:

```yaml
# fixtures/[platform]/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Labels.yaml
th:
  btn_select_flight: "เลือก"
  btn_search_flights: "ค้นหาเที่ยวบิน"
  btn_confirm_booking: "ยืนยันการจอง"
en:
  btn_select_flight: "Select"
  btn_search_flights: "Search Flights"
  btn_confirm_booking: "Confirm Booking"
```

```robot
# Usage in Page Object
${LANG}=    Get Environment Variable    LANG    th
${L}=       Load Yaml    fixtures/android/japan/flight-booking/flightBookingLabels.yaml
${LABELS}=  Set Variable    ${L}[${LANG}]

# ✅ scope ด้วย accessibility_id, verify text จาก Labels
Wait Until Element Is Visible    accessibility_id=flight-result-item-FL001
Element Text Should Be    accessibility_id=btn-select-flight    ${LABELS}[btn_select_flight]
```

## Unified Keyword Mapping Table (Mandatory)
Must populate before finishing design:

| Keyword Name | Android Locator | iOS Locator |
|---|---|---|
| 'ค้นหาข้อมูล' | accessibility_id=search | accessibility_id=search |

## XML Source Parsing (Step 1.5)
If app XML source is available:
- Extract all elements with `accessibility_id`, `resource-id`, `content-desc`, `text`
- Build element map: `{ element_name: { accessibility_id, resource_id, text } }`
- Use this map for locator strategy in architecture

## LATS Forbidden Patterns
- ❌ Divergent Keyword Naming (Android vs iOS must be identical)
- ❌ XPath Reliance
- ❌ Hardcoded Sleep
- ❌ Missing API Hybrid Setup

## Approval
Show architecture summary to user and wait for explicit approval before coding.
