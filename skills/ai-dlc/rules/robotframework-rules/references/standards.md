# Robot Framework Testing - Global Coding Standards (Constitution)

> **⚠️ Important:** This file is the **"Constitution"** (Global Master Rules).
> **🎯 Purpose:** Core rules and strategies for Mobile Automation using Robot Framework + Appium, covering both iOS and Android.

---

## PART 1: AI Governance & Behavior

### 1. AI Roles & Perspectives (Core Methodology)

When assigned a task, always analyze through these 4 perspectives:

- **🏗️ Architect:** Plan file structures (Folder Structure) and design flexible Shared Keywords.
- **👨‍💻 Developer:** Write Clean Code, use clear test names, and handle errors systematically.
- **⚖️ Reviewer:** Verify compliance with CRITICAL RULES and data security.
- **⚡ Performance:** Prioritize API Setup over UI Setup (Hybrid Testing) for execution speed whenever possible.

### 2. Communication Protocol (Interaction Rules)

- **CoT (Chain-of-Thought):** Always analyze the Root Cause before fixing and propose alternatives.
- **Language Policy:** Technical documentation and code MUST be in English. Use Thai only for user-facing messages or when specifically requested.

### 3. Agentic Workflow (Execution Order)

When receiving a task, follow this sequence:

1. **Load Rules:** Read all related rules before proceeding (`android.md` or `ios.md` depending on the platform).
2. **Analyze Request:** Analyze the feature, platform, source (CSV/Azure DevOps), and environment.
3. **Plan Structure:** Design the architecture and keyword structure before writing actual files.
4. **Execute & Report:** Create the files and provide a summary to the user.

---

## PART 2: Automation Strategy (Decision Strategy)

### 1. Automation Priority Table

| Priority | Mobile UI | Strategy |
| :--- | :--- | :--- |
| **Critical** | ✅ Mandatory | Immediate Action (E2E Full Coverage) |
| **High** | ✅ Mandatory | Immediate Action (Focus on Core Flows) |
| **Medium** | ⚠️ Optional | Focus on Happy Path first |
| **Low** | 🚫 Skip | Can be skipped if time is limited |

### 2. Hybrid Execution Strategy

- **Setup/Teardown:** Use Python helpers or APIs for data preparation instead of UI interactions whenever possible. **Hybrid Testing is MANDATORY** for long or repetitive flows (e.g., Seed data via API then verify via Mobile UI).
- **♻️ Shared Fixtures (MANDATORY):** Business data used across platforms (API + Mobile + Web) MUST be stored in `tests/shared-fixtures/` to ensure consistency.
- **Single Source of Truth:** Test data MUST come from YAML fixtures only. DO NOT hardcode data in `.robot` files.

---

## PART 3: Global Restrictions (Strict Rules)

1. **✅ Use .env for Config:** Use `.env.<os>.<env>` to store URL, Credentials, and App Path, separated by OS and Environment.
   - **Sensitive data (MUST be in .env):** credentials, tokens, passwords, secrets, emails used for login, API keys, OAuth URLs (e.g., Microsoft login URL)
   - **Non-sensitive data (MUST be in YAML fixture):** business data such as companyCode, customerCode, username/role identifiers, etc.
   - **⚠️ Double Login Rule:** When a feature requires 2 login layers (e.g., Microsoft SSO + project-level auth), SSO credentials/URL go in `.env`; project-level user identifiers (username, role, companyCode) go in `fixtures/`.
2. **✅ Use YAML for Test Data:** Store test data in `fixtures/<os>/sit.yaml` — DO NOT hardcode in `.robot`.
3. **🚫 No Inline Locators:** DO NOT write locators directly in test scripts — MUST use Page Object Keywords.
4. **🚫 No Hard Waits:** DO NOT use `Sleep` — use `Wait Until Element Is Visible` instead.
5. **🏷️ Mandatory Tags:** Every Test Case MUST have 3 tags: `Feature:`, `Important:`, and `Scenario:`.
6. **🔖 Mandatory Test ID:** Every Test Case MUST start with `[TC-xxxx]`.
7. **🚀 Test Independence:** Each test MUST be independent and not rely on the state of other tests.
8. **📁 Shared Fixtures Location:** For cross-layer data, use `tests/shared-fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/`.
9. **⚠️ Cross-Platform Keyword Naming:** Keywords for the same action MUST be named **exactly the same (100% identical)** for both Android and iOS — DO NOT append `Android` or `iOS` to the keyword name.

---

## PART 4: Shared Standard Utilities

### 1. File & Folder Naming

```robot
# ✅ CORRECT - lowerCamelCase for files
userLogin.robot
hospitalTriage.robot

# ✅ CORRECT - kebab-case for folders
auth/
payment/
user-management/

# ❌ WRONG
UserLogin.robot       # PascalCase
user_login.robot      # snake_case
```

### 2. Element Locator Strategy (Priority Order)

| Priority | Locator | Stability |
| :--- | :--- | :--- |
| 🥇 #1 | `accessibility_id=` | ⭐⭐⭐⭐⭐ Most stable |
| 🥈 #2 | `id=` | ⭐⭐⭐⭐ |
| 🥉 #3 | `class=` | ⭐⭐⭐ |
| 🚫 #4 | `xpath=` | ⭐ Last resort only |

### 3. Test Case Structure (AAA Pattern)

```robot
*** Test Cases ***
[TC-001] User Should Login Successfully With Valid Credentials
    [Documentation]    Verify successful login with valid credentials
    [Tags]    Feature:Login    Important:Critical    Scenario:Success

    # 📝 Arrange - Setup test data
    ${username}=    Set Variable    test@example.com
    ${password}=    Set Variable    password123

    # 🎬 Act - Perform actions
    Open Mobile Application
    Input Username    ${username}
    Input Password    ${password}
    Tap Login Button

    # ✅ Assert - Verify results
    Wait Until Element Is Visible    accessibility_id=dashboard    timeout=10s
    Element Should Be Visible    accessibility_id=welcome-message
```

### 4. Mandatory Tag Format

```robot
# ✅ CORRECT — All 3 tags required
[Tags]    Feature:Login    Important:Critical    Scenario:Success

# Important Levels: Critical | High | Medium | Low
# Scenario Types:   Success  | Alternative | Error

# ❌ WRONG — Missing tags or wrong format
[Tags]    Login
[Tags]    Feature:Login    Important:VeryImportant    Scenario:Success
```

### 5. Test Suite Naming Conventions

```robot
*** Settings ***
Documentation    [ID-1234] User Authentication Feature
Library          AppiumLibrary
Resource         ../../pages/android/auth/loginPage.robot
Resource         ../../pages/android/common/commonKeywords.robot
```

### 6. Obsoleted Test Case Handling

```robot
*** Test Cases ***
[TC-001] User Should See Validation Error For Empty Fields
    [Documentation]    Skip — expected result changed. See TC-999
    [Tags]    Feature:Login    Important:High    Scenario:Alternative    Skip

    Tap Login Button
    Element Should Be Visible    id=error-message
```

### 7. Variable Casing by Scope

Variable casing communicates scope at a glance. Follow this rule consistently.

> Source: [docs.robotframework.org/docs/style_guide#variable-scope-and-casing](https://docs.robotframework.org/docs/style_guide#variable-scope-and-casing)

| Scope | Casing | Example |
|---|---|---|
| GLOBAL / SUITE / TEST | UPPER_CASE | `${BASE_URL}`, `${SESSION_TOKEN}` |
| LOCAL (inside keyword) | lower_case | `${response}`, `${element}` |
| Keyword arguments | lower_case | `${username}`, `${timeout}` |

```robot
# ✅ CORRECT
*** Keywords ***
Login With Credentials
    [Arguments]    ${username}    ${password}
    ${response}=    Call Login API    ${username}    ${password}
    Set Test Variable    ${SESSION_TOKEN}    ${response}[token]

# ❌ WRONG — local variable using UPPER_CASE
*** Keywords ***
Login With Credentials
    [Arguments]    ${USERNAME}    ${PASSWORD}
    ${RESPONSE}=    Call Login API    ${USERNAME}    ${PASSWORD}
```

### 8. Error Handling — Use TRY/EXCEPT

Use native `TRY/EXCEPT` (RF 5+) instead of `Run Keyword And Ignore Error` for error handling. It is more readable and explicit.

> Source: [robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#try-except-syntax](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#try-except-syntax)

```robot
# ✅ CORRECT — TRY/EXCEPT
*** Keywords ***
Tap Element With Fallback
    [Arguments]    ${primary}    ${fallback}
    TRY
        Wait Until Element Is Visible    ${primary}    timeout=5s
        Click Element    ${primary}
    EXCEPT
        Wait Until Element Is Visible    ${fallback}    timeout=5s
        Click Element    ${fallback}
    END

# ❌ AVOID — Run Keyword And Ignore Error (harder to read)
*** Keywords ***
Tap Element With Fallback
    [Arguments]    ${primary}    ${fallback}
    ${status}    ${error}=    Run Keyword And Ignore Error
    ...    Wait Until Element Is Visible    ${primary}    timeout=5s
    IF    '${status}' == 'FAIL'
        Click Element    ${fallback}
    ELSE
        Click Element    ${primary}
    END
```

### 9. Nesting Depth ≤ 4

Keyword nesting must not exceed 4 levels deep. Deep nesting makes keywords hard to read and debug.

> Source: [docs.robotframework.org/docs/style_guide#indentation](https://docs.robotframework.org/docs/style_guide#indentation)

```robot
# ✅ CORRECT — max 4 levels
*** Keywords ***
Process Items
    FOR    ${item}    IN    @{ITEMS}
        IF    ${item}[active]
            IF    ${item}[valid]
                Process Single Item    ${item}
            END
        END
    END

# ❌ WRONG — 5+ levels, extract inner logic to a separate keyword instead
```

### 10. Use `[Documentation]` Instead of Comments

Prefer `[Documentation]` over inline comments. Comments are for TODOs only.

> Source: [docs.robotframework.org/docs/style_guide#comments](https://docs.robotframework.org/docs/style_guide#comments)

```robot
# ✅ CORRECT — [Documentation] explains the keyword
*** Keywords ***
Verify Dashboard Is Loaded
    [Documentation]    Waits for the dashboard screen to be fully visible after login.
    Wait Until Element Is Visible    accessibility_id=dashboard    timeout=15s
    Element Should Be Visible    accessibility_id=welcome-message

# ❌ AVOID — inline comment instead of [Documentation]
*** Keywords ***
Verify Dashboard Is Loaded
    # Wait for dashboard after login
    Wait Until Element Is Visible    accessibility_id=dashboard    timeout=15s
```

---

## PART 5: Advanced Robot (Expert Tier)

### 1. Hybrid Setup (API + Mobile)

Reduce setup time by bypassing irrelevant screens in a test case.

```robot
*** Keywords ***
Setup User Session Via API
    [Arguments]    ${username}    ${password}
    # 💎 Gem: Use RequestLibrary to fetch Token
    ${token}=    Get Auth Token Via API    ${username}    ${password}
    # 💎 Gem: Inject Token into App (if supported) or store for headers
    Set Test Variable    ${SESSION_TOKEN}    ${token}
```

### 2. Expert Locators Fallback

Technique to attempt finding a button using multiple locator formats before failing.

```robot
*** Keywords ***
Wait And Click Element Safely
    [Arguments]    ${primary_locator}    ${secondary_locator}=${NONE}
    # 💎 Gem: Try primary first; if not found in 5s, fallback to secondary
    ${status}    ${error}=    Run Keyword And Ignore Error    Wait Until Element Is Visible    ${primary_locator}    timeout=5s
    IF    '${status}' == 'FAIL' and '${secondary_locator}' != '${NONE}'
        Wait Until Element Is Visible    ${secondary_locator}    timeout=5s
        Click Element    ${secondary_locator}
    ELSE
        Click Element    ${primary_locator}
    END
```

### 3. Screen Record on Failure

Record video only when a test fails for CI/CD analysis.

```robot
*** Keywords ***
Capture Video On Failure
    Run Keyword If Test Failed    Capture Page Screenshot    filename=fail-{index}.png
    # 💎 Gem: Appium Library supports Start/Stop Screen Recording
```

### 4. Advanced Data Orchestration (Python Integration)

Use Python to generate dynamic, secure, and realistic test data.

```robot
*** Keywords ***
Generate Dynamic User Data
    # 💎 Gem: Call Python helper (Faker/Custom Logic)
    ${user}=    Generate Random User Profile
    Set Test Variable    ${DYNAMIC_USER}    ${user}
```

### 5. Mobile Visual Testing Strategy

Combining image comparison with locators for maximum precision.

```robot
*** Keywords ***
Verify Screen Content With Masking
    [Arguments]    ${template_image}
    # 💎 Gem: Mask volatile parts (time, battery) before comparison
    ${masks}=    Create List    accessibility_id=status-bar    accessibility_id=clock
    Check Screen    ${template_image}    mask_elements=${masks}
```

### 6. Reliability & Resilience (Self-Healing)

Expertly handle mobile environment uncertainties (Network, Pop-ups).

```robot
*** Keywords ***
Tap Element With Self-Healing
    [Arguments]    ${locator}
    # 💎 Gem: If blocked by a pop-up, close it and retry
    ${status}=    Run Keyword And Return Status    Click Element    ${locator}
    IF    '${status}' == '${FALSE}'
        Close Unexpected Popups
        Click Element    ${locator}
    END
```

---

## PART 6: Reference Links

For platform-specific details, refer to **PART 7** below.

---

## PART 7: Mobile Platform Differences (Android vs iOS)

> **🎯 Purpose:** Captures differences between Android and iOS.
> **⚠️ Unified Naming Rule:** Keyword names MUST be 100% identical across both platforms — DO NOT append `Android` or `iOS`.

### DIFF 1: Capabilities

| Config | Android | iOS |
|--------|---------|-----|
| Platform var | `${ANDROID_PACKAGE}` `${ANDROID_ACTIVITY}` | `${IOS_BUNDLE_ID}` |
| Automation | UiAutomator2 | XCUITest |
| Env file | `.env.android.sit` | `.env.ios.sit` |
| App binary | `.apk` | `.ipa` / `.app` |

### DIFF 2: Locator Priority

| Priority | Android | iOS |
|----------|---------|-----|
| 🥇 #1 | `accessibility_id=x` | `accessibility_id=x` (Same) |
| 🥈 #2 | `id=com.app:id/btn` | `ios=type == 'XCUIElementTypeButton' AND name == 'x'` |
| 🥉 #3 | `android=new UiSelector().text("x")` | `chain=**/XCUIElementTypeButton[-1]` |
| 🚫 #4 | `xpath=...` (Avoid) | `xpath=...` (Avoid 100%) |

**Platform-Specific Actions:**

| Action | Android | iOS |
|--------|---------|-----|
| Back | `Press Keycode    4` | No hardware back button |
| Hide Keyboard | `Hide Keyboard` + `Press Keycode    66` | `Click Element    accessibility_id=Done` |
| Scroll | `android=new UiScrollable(...).scrollIntoView(...)` | `Execute Script    mobile: scroll    {'direction': 'down', 'predicateString': '...'}` |
| System Alert | N/A | `Execute Script    mobile: alert    {'action': 'accept'}` |

### DIFF 3: Expert Gems

| Gem | Android | iOS |
|-----|---------|-----|
| Deep Link | `Execute Script    mobile: deepLink    url=x    package=${ANDROID_PACKAGE}` | `Execute Script    mobile: deepLink    url=x    bundleId=${IOS_BUNDLE_ID}` |
| Platform Gem | ADB: `Execute Adb Shell    pm grant ...` | Biometric: `Execute Script    mobile: sendBiometricMatch    type=faceid    match=true` |
| Performance flags | `ignoreUnimportantViews=true`, `disableWindowAnimation=true` | `includeSafariInWebviews=true`, `shouldTerminateApp=true` |

### DIFF 4: Unified Keyword Naming Examples

```robot
# ✅ CORRECT — Same name for both platforms (only locators inside vary)
Tap Login Button          # Android: accessibility_id=submit-btn
                          # iOS:     accessibility_id=submit-btn

Input Username            # Android: id=com.example.app:id/email_input
                          # iOS:     ios=type == 'XCUIElementTypeTextField' AND name == 'email_input'

# ❌ WRONG
Tap Login Button Android  # DO NOT append platform suffix
Tap Login Button iOS
```
