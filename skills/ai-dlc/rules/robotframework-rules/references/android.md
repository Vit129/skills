# Appium Testing (Android) - Rules & Templates

> **⚠️ Important:** This file contains **Rules & Templates** for Android automation.
> **🎯 Purpose:** Standard rules and templates for Android Automation that AI agents must follow.

---

## PART 1: Overview

> 🚫 **ANTI-PATTERN:** Avoid putting all code/logic into a single file. For maintainability and ease of navigation, always separate into smaller sub-files.
>
> **📐 Structure Rules:**
> - 🔒 **MANDATORY — Top-level folder names** (`fixtures/`, `pages/`, `helpers/`, `tests-mobile/`, etc.) **MUST be identical across all projects.**
> - 🔒 **MANDATORY — Naming conventions** (snake_case Python files, camelCase Robot files) **MUST be followed in every project.**
> - 🔒 **MANDATORY — File suffix conventions** must be followed regardless of project complexity:
>   - `*_helper.py` — utility/tool (pure function, no endpoint awareness)
>   - `*_service.py` — business action (API/DB calls, endpoint-aware)
>   - `*Page.robot` — page object keywords
>   - `*_db_service.py` — database service (feature-specific)
>   - `*_db_config.py` — database connection config
> - 💡 **RECOMMENDED — Shared sub-folder names** inside `fixtures/` and `helpers/` should use these standard names for cross-feature reuse:
>   - `fixtures/shared-data/` — common test data shared across features
>   - `helpers/shared-services/` — common services shared across features
>   - `helpers/shared-helpers/` — common utility tools shared across features
> - ✅ **FLEXIBLE — Internal structure within each folder** (how sub-folders are organized, how many files per feature) can be adapted to fit the project's business context.

### 📁 Project Structure: Android Mobile Testing

```text
tests/mobile-testing/
├── fixtures/                                  # Test Data
│   └── android/
│       ├── shared-data/                       # ♻️ SHARED: Common data across features
│       │   └── userProfileData.yaml           # 📦 CORE: Common test data (e.g., Global test accounts)
│       ├── local.yaml                         # 💻 ENV: Local specific data
│       ├── sit.yaml                           # 🌐 ENV: SIT specific data
│       └── uat.yaml                           # 🌐 ENV: UAT specific data
├── pages/                                     # Page Objects (Separated by OS due to different Locators)
│   └── android/
│       ├── common/
│       │   └── commonKeywords.robot           # 📦 CORE: Base wrapper for Appium (Android)
│       │   └── [SYSTEM_FEATURE_CAMEL]NavigationPage.robot # 🔒 STATIC: Persistent layout (Bottom Nav, Side Menu)
│       └── [SYSTEM_KEBAB]/
│           └── [SYSTEM_FEATURE_KEBAB]/
│               ├── [SYSTEM_FEATURE_CAMEL]HomePage.robot        # 🔄 DYNAMIC: Specific content page
│               ├── [SYSTEM_FEATURE_CAMEL]DashboardPage.robot   # 🔄 DYNAMIC: Specific content page
│               └── [SYSTEM_FEATURE_CAMEL]SettingsPage.robot    # 🔄 DYNAMIC: Specific content page
│       └── [SYSTEM_KEBAB]/
│           └── [SYSTEM_FEATURE_KEBAB]/
│               └── [SYSTEM_FEATURE_CAMEL].robot   # e.g., login.robot
├── .env.android.sit
└── requirements.txt
```

### 🔑 Standard Environment Variables

AI MUST use these standardized keys for Android testing configuration:

```bash
# .env.android.sit / .env.android.uat
BASE_URL=https://api.example.com          # API base URL
APP_PACKAGE=com.example.myapp            # Android app package name
APP_ACTIVITY=com.example.myapp.MainActivity # Android main activity

USERNAME=test-user@example.com           # Test account username
PASSWORD=your-password                   # Test account password (⚠️ use CI/CD secrets in pipeline)
```

**⚠️ Notes:**

- Sensitive values (`PASSWORD`, tokens) must use CI/CD secrets injection — DO NOT commit to repo.
- Key names MUST always use `SCREAMING_SNAKE_CASE`.

---

**⚠️ Storage Rules:**

- **Isolation:** Never mix iOS locators or objects in Android folders. Keep platforms independent.

> **🚨 BEFORE CREATING ANY FILE:** AI MUST ask the user for these 2 values if not already provided:
> 1. **System name** (`[SYSTEM_KEBAB]`) — e.g., `shopee`, `amazon`
> 2. **Feature name** (`[SYSTEM_FEATURE_KEBAB]`) — e.g., `shopee-payment`, `customer-search`, `invoice-management`
>
> Then derive: `[SYSTEM_FEATURE_CAMEL]` = camelCase of feature name (e.g., `shopeePayment`)
>
> **Example:** If system = `shopee`, feature = `shopee-payment`:
> - Test: `tests-mobile/android/shopee/shopee-payment/shopeePayment.robot`
> - Page: `pages/android/shopee/shopee-payment/shopeePaymentPage.robot`
>
> **❌ WRONG:** `tests-mobile/android/shopee/shopeePayment.robot` (missing feature folder)
> **✅ CORRECT:** `tests-mobile/android/shopee/shopee-payment/shopeePayment.robot`

### 🔍 Terminology: Service vs Helper (Python context)

To ensure consistent understanding:

- **⚙️ Service (Business Action):** A Python class that commands the system for business operations, such as API calls for data preparation, database operations, or external authentication.
  - *Example:* `auth_service.py`, `file_service.py`.
  - *Key Concept:* Aware of system URLs/Endpoints and business workflows.
- **🛠️ Helper (Utility/Tool):** Functions or tools for general data management, such as random name generation, date calculations, or configuration extraction.
  - *Example:* `date_helper.py`, `random_data_helper.py`, `database_helper.py`.
  - *Key Concept:* Pure logic, independent of UI business flows, highly reusable across the project.

### 🔗 Cross-Layer Shared Fixtures (API + Mobile)

**When to use:** The same data set is used in both API tests and Mobile UI tests — e.g., `companyCode`, `customerCode`, `searchKeyword` tested on both frontend and mobile.

**Location:** `tests/shared-fixtures/` — see Project Structure below.

**Example: Customer Search feature (Mobile + API share the same data)**

```yaml
# tests/shared-fixtures/amazon/customer-search/customerSearchSharedData.yaml
companyCode: '1002'
customer:
  validCode: '0002125576'
  invalidCode: 'INVALID-999'
  displayName: 'ABC Company Ltd.'
searchKeyword: 'ABC'
```

**Decision Rules:**

| Scenario | Location |
|---|---|
| Data used only in Android tests | `fixtures/android/` |
| Data used across platforms (API + Mobile) | `shared-fixtures/[feature]/mobile/` |
| API seed/reset payload used by Mobile test in Setup | `shared-fixtures/[feature]/mobile/[SYSTEM_FEATURE_CAMEL]ApiSetup.yaml` |

### 🔗 API Setup Pattern (Seed via API before Mobile test)

**When to use:** Mobile UI test needs to seed or reset state via API before interacting with the app — much faster than navigating through mobile UI.

**File:** `tests/shared-fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/mobile/[SYSTEM_FEATURE_CAMEL]ApiSetup.yaml`

```yaml
# tests/shared-fixtures/amazon/invoice/mobile/invoiceApiSetup.yaml
seed:
  endpoint: '/api/invoices/reset'
  payload: { status: 'PENDING', companyCode: '1002' }
cleanup:
  endpoint: '/api/invoices/cleanup'
  payload: { companyCode: '1002' }
```

**Usage in Python Service:**

```python
# helpers/shared-services/invoice_service.py
class InvoiceService:
    def seed_invoice(self, setup_data):
        # Use RequestLibrary or requests to POST to setup_data['seed']['endpoint']
        pass
```

---

## 🔍 Pre-Implementation Check (MANDATORY — Before Writing Any Code)

> **🎯 Purpose:** Prevent duplicate code and missed existing assets.
> **⏱️ When:** Before writing any code — workflow or manual.

EXECUTE `resourcesDiscoverySkill.md` — **Step 1 (index scan) + Step 2 (existing code scan) + lessons scan only.**
- workflow_type = `android_automation`
- OUTPUT the Pre-Implementation Check summary before writing any code.

---

## PART 2: Coding Standards

### 1. 🏷️ Naming Conventions

**Robot Framework uses lowerCamelCase, similar to UI standards.**

```robot
# ✅ CORRECT - lowerCamelCase for files
userLogin.robot
hospitalTriage.robot

# ✅ CORRECT - Variables (SCREAMING_SNAKE_CASE for globals)
${ANDROID_PLATFORM_VERSION}     14

# ✅ CORRECT - Keyword Naming (Title Case with Spaces)
Input Username And Password
Verify Dashboard Is Displayed
```

### 2. 🏗️ Test Structure (AAA Pattern)

```robot
*** Test Cases ***
[TC-XXXX] User Should Create Order Successfully
    [Documentation]    Verify order creation flow on Android
    [Tags]    Feature:Order    Important:Critical    Scenario:Success
    
    # 📝 Arrange - Setup test data
    ${item_name}=    Set Variable    Pizza
    ${qty}=          Set Variable    2
    
    # 🎬 Act - Perform actions (via keywords bound to Android Page Object)
    Launch Application
    Navigate To Order Page
    Fill Order Details    ${item_name}    ${qty}
    Submit Order
    
    # ✅ Assert - Verify results
    Wait Until Element Is Visible    accessibility_id=success-badge
    Verify Order Confirmation Contains    ${item_name}
```

---

## PART 3: Test Naming Conventions

### 1. 🔑 Testcase ID Requirements

**MANDATORY: Every Test Case MUST include [TC-xxxx] or [ID-xxxx] in its name.**

```robot
*** Test Cases ***
[TC-12345] User Should Login With Valid Credentials
    # ...
```

### 2. 🏷️ Required Tags

**MANDATORY: Every Test Case MUST have these 3 tags:**

1. `Feature:[Name]` - System category.
2. `Important:[Level]` - Critical, High, Medium, Low.
3. `Scenario:[Type]` - Success, Alternative, Error.

---

## PART 4: Structure & Design

### Android App Lifecycle & Configurations

Configure Capabilities correctly to prevent unnecessary data clearing and to speed up execution.

- **`appPackage`** and **`appActivity`** are the core variables for starting Android apps.
- Set `noReset` to `${TRUE}` to avoid reinstalling the app if a clean state is not required.

```robot
*** Variables ***
${ANDROID_PLATFORM_NAME}    Android
${ANDROID_PACKAGE}          com.example.myapp
${ANDROID_ACTIVITY}         com.example.myapp.MainActivity
${ANDROID_AUTOMATION}       UiAutomator2
```

---

## PART 5: Locator Strategy / Action

### 1. 🎯 Locator Strategy (Android DOM Lookup Strategy)

Android element discovery follows this Priority Order:

| Priority | Locator Type | Syntax in Robot | Stability |
| :------- | :----------- | :-------------- | :--------- |
| 🥇 #1 | **Accessibility ID** | `accessibility_id=login-btn` | Most stable (Maps to `content-desc` in UiAutomator) |
| 🥈 #2 | **ID** | `id=com.app.package:id/btn_login` | Highly reliable (Resource ID) |
| 🥉 #3 | **UIAutomator** | `android=new UiSelector().text("Login")` | Flexible (but complex syntax) |
| 🚫 #4 | **XPath** | `xpath=//android.widget.TextView[@text='Login']`| Slow and fragile (Avoid) |

### 🛠️ Example Correct Android Locator Usage

```robot
*** Keywords ***
Tap Login Button
    # ✅ BEST: Use content-desc from UiAutomator
    Tap Element Safely    accessibility_id=submit-btn

Input Username
    # ✅ GOOD: Use Resource-ID if accessibility_id is missing
    Input Text Into Field    id=com.example.app:id/email_input    ${username}
```

### 2. 🤖 Android-Specific Actions

Appium actions specific to the Android platform:

**A. Back Button (Hardware):**

```robot
*** Keywords ***
Go Back To Previous Screen
    # Call directly via Appium Library
    Press Keycode    4
```

**B. Keyboard Interaction:**

```robot
*** Keywords ***
Submit Form
    Hide Keyboard    # Close the soft keyboard
    # Press Enter on the virtual keyboard
    Press Keycode    66    
```

**C. Scrolling with UIAutomator (Native Scrolling):**
(Used when normal swipe is inaccurate or for long pages)

```robot
*** Keywords ***
Scroll To Settings Menu
    # Use UIAutomator to scroll element into view
    ${scroll_to_element}    Set Variable    android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().textContains("Settings"))
    Wait Until Element Is Visible    ${scroll_to_element}    timeout=10s
    Click Element    ${scroll_to_element}
```

---

## PART 6: Android Expert (Shortcut & Power User)

### 1. Deep Linking (Fast Navigation Gem)

Bypass complex navigation by jumping directly to a screen via URL Scheme.

```robot
*** Keywords ***
Jump To Payment Screen
    # 💎 Gem: Open app URL Scheme using Execute Script
    Execute Script    mobile: deepLink    url=myapp://payment    package=${ANDROID_PACKAGE}
```

### 2. ADB Command Integration (Power User Gem)

Leverage Android Debug Bridge (ADB) through Appium to handle system-level tasks.

```robot
*** Keywords ***
Grant App Permissions Via ADB
    # 💎 Gem: Grant permissions without waiting for OS pop-ups
    Execute Adb Shell    pm grant ${ANDROID_PACKAGE} android.permission.CAMERA
    Execute Adb Shell    pm grant ${ANDROID_PACKAGE} android.permission.ACCESS_FINE_LOCATION
```

### 3. Network Speed Simulation

Simulate slow network conditions to test loading and error handling.

```robot
*** Keywords ***
Simulate Slow Network
    [Arguments]    ${speed}=gsm
    # 💎 Gem: Adjust connection speed (gsm, edge, hscsd, gprs, umts, hsdpa, lte, evdo, full)
    Set Network Connection Status    ${4}    # Example: Data only
```

---

## PART 7: Global Restrictions (Strict Rules for Android)

1. ❌ **DO NOT** name files/objects interchangeably with iOS. Keep paths independent (e.g., `pages/android/`).
2. ❌ **DO NOT** use `xpath` for widgets with only repetitive classes (e.g., generic `android.widget.TextView`). Use Index or native UIAutomator instead if ID is missing.
3. ⚠️ **MANDATORY:** Keyword names for identical actions **MUST be 100% identical to iOS (Unified Naming).** DO NOT append `Android` to keyword names; this ensures one script can run on both platforms.

---

## PART 8: App Management (Download Binaries)

**Naming Convention:**

- `app-v{version}.apk` (e.g., `app-v1.0.0.apk`)
- `app-latest.apk` (latest version)

**Download from CI/CD:**

```bash
# Azure DevOps
az pipelines runs artifact download --artifact-name android-sit --path apps/android/sit/

# AWS S3
aws s3 cp s3://builds/android/sit/app-latest.apk apps/android/sit/
```

---

## PART 9: Infrastructure Standard (Robot Framework)

### 📦 Dependencies & Environment

- **Python:** 3.10+
- **Requirements:** `requirements.txt`
- **Libraries:** `robotframework-appiumlibrary`, `robotframework-pabot` (Parallel execution)

---

## PART 10: Performance & Reliability

### ⚡ Parallel Execution

Use `pabot` to distribute tests across multiple devices:

```bash
pabot --processes 2 tests-mobile/android/
```

### 🛠️ Appium Stability

- Use `ignoreUnimportantViews=true` to simplify the DOM.
- Use `disableWindowAnimation=true` to reduce flakiness from animations.

---

## PART 11: CLI Commands & Execution (Quick Commands)

```bash
# === 🚀 Start Appium Server ===
appium

# === 📱 Android Test Execution (Robot Framework) ===

# Run all tests in the default environment
robot tests-mobile/android/

# Specify Environment (SIT / UAT)
robot --variable ENV:sit tests-mobile/android/
robot --variable ENV:uat tests-mobile/android/

# Run by Tag (e.g., smoke, regression)
robot --include smoke tests-mobile/android/
robot --include regression tests-mobile/android/

# Run specific folder
robot tests-mobile/android/[system-kebab]/[feature-kebab]/

# === 📊 Reports ===
robot --outputdir results tests-mobile/android/
# View report
open results/report.html

# === 🛠️ Device & Debugging ===
adb devices
adb kill-server && adb start-server
robot --loglevel DEBUG tests-mobile/android/auth/login.robot
```

---

## PART 12: Quick Reference

### ✅ DO's

- **MANDATORY:** Keep keyword names identical to iOS (Unified Naming).
- Prioritize `accessibility_id` locators.
- Include `[TC-xxxx]` in Test Case names.
- Keep Page Objects in `pages/android/`.
- Always use `Wait Until Element Is Visible` before clicking.

### ❌ DON'Ts

- **FORBIDDEN:** Mixing Android and iOS file/object names.
- **FORBIDDEN:** Using `xpath` for elements with only generic classes.
- **FORBIDDEN:** Appending `Android` to keyword names.
- Avoid `Sleep` (hardcoded wait).
