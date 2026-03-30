# Appium Testing (iOS) - Rules & Templates

> **⚠️ Important:** This file contains **Rules & Templates** for iOS automation.
> **🎯 Purpose:** Standard rules and templates for iOS Automation that AI agents must follow.

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

### 📁 Project Structure: iOS Mobile Testing

```text
tests/mobile-testing/
├── fixtures/                                  # Test Data
│   └── ios/
│       ├── shared-data/                       # ♻️ SHARED: Common data across features
│       │   └── userProfileData.yaml           # 📦 CORE: Common test data (e.g., Global test accounts)
│       ├── local.yaml                         # 💻 ENV: Local specific data
│       ├── sit.yaml                           # 🌐 ENV: SIT specific data
│       └── uat.yaml                           # 🌐 ENV: UAT specific data
├── pages/                                     # Page Objects (Separated by OS due to different Locators)
│   └── ios/
│       ├── common/
│       │   └── commonKeywords.robot           # 📦 CORE: Base wrapper for Appium (iOS)
│       │   └── [SYSTEM_FEATURE_CAMEL]NavigationPage.robot # 🔒 STATIC: Persistent layout (Bottom Nav, Side Menu)
│       └── [SYSTEM_KEBAB]/
│           └── [SYSTEM_FEATURE_KEBAB]/
│               ├── [SYSTEM_FEATURE_CAMEL]HomePage.robot        # 🔄 DYNAMIC: Specific content page
│               ├── [SYSTEM_FEATURE_CAMEL]DashboardPage.robot   # 🔄 DYNAMIC: Specific content page
│               └── [SYSTEM_FEATURE_CAMEL]SettingsPage.robot    # 🔄 DYNAMIC: Specific content page
│       └── [SYSTEM_KEBAB]/
│           └── [SYSTEM_FEATURE_KEBAB]/
│               └── [SYSTEM_FEATURE_CAMEL].robot   # e.g., login.robot
├── .env.ios.sit
└── requirements.txt
```

### 🔑 Standard Environment Variables

AI MUST use these standardized keys for iOS testing configuration:

```bash
# .env.ios.sit / .env.ios.uat
BASE_URL=https://api.example.com          # API base URL
APP_BUNDLE_ID=com.example.myapp          # iOS app bundle ID
APP_PATH=/path/to/app.ipa                # Path to .ipa / .app binary

USERNAME=test-user@example.com           # Test account username
PASSWORD=your-password                   # Test account password (⚠️ use CI/CD secrets in pipeline)
```

**⚠️ Notes:**

- Sensitive values (`PASSWORD`, tokens) must use CI/CD secrets injection — DO NOT commit to repo.
- Key names MUST always use `SCREAMING_SNAKE_CASE`.

---

**⚠️ Storage Rules:**

- **Isolation:** Never mix Android locators or objects in iOS folders. Keep platforms independent.

> **🚨 BEFORE CREATING ANY FILE:** AI MUST ask the user for these 2 values if not already provided:
> 1. **System name** (`[SYSTEM_KEBAB]`) — e.g., `shopee`, `amazon`
> 2. **Feature name** (`[SYSTEM_FEATURE_KEBAB]`) — e.g., `shopee-payment`, `customer-search`, `invoice-management`
>
> Then derive: `[SYSTEM_FEATURE_CAMEL]` = camelCase of feature name (e.g., `shopeePayment`)
>
> **Example:** If system = `shopee`, feature = `shopee-payment`:
> - Test: `tests-mobile/ios/shopee/shopee-payment/shopeePayment.robot`
> - Page: `pages/ios/shopee/shopee-payment/shopeePaymentPage.robot`
>
> **❌ WRONG:** `tests-mobile/ios/shopee/shopeePayment.robot` (missing feature folder)
> **✅ CORRECT:** `tests-mobile/ios/shopee/shopee-payment/shopeePayment.robot`

### 🔍 Terminology: Service vs Helper (Python context)

To ensure consistent understanding:

- **⚙️ Service (Business Action):** A Python class that commands the system for business operations, such as API calls for data preparation, database operations, or external authentication.
  - *Example:* `auth_service.py`, `file_service.py`.
  - *Key Concept:* Aware of system URLs/Endpoints and business workflows.
- **🛠️ Helper (Utility/Tool):** Functions or tools for general data management, such as random name generation, date calculations, or configuration extraction.
  - *Example:* `date_helper.py`, `random_data_helper.py`, `database_helper.py`.
  - *Key Concept:* Pure logic, independent of UI business flows, highly reusable across the project.

---

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
| Data used only in iOS tests | `fixtures/ios/` |
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
- workflow_type = `ios_automation`
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
${IOS_PLATFORM_VERSION}     17.2

# ✅ CORRECT - Keyword Naming (Title Case with Spaces)
Input Username And Password
Verify Dashboard Is Displayed
```

### 2. 🏗️ Test Structure (AAA Pattern)

```robot
*** Test Cases ***
[TC-XXXX] User Should Create Order Successfully
    [Documentation]    Verify order creation flow on iOS
    [Tags]    Feature:Order    Important:Critical    Scenario:Success
    
    # 📝 Arrange - Setup test data
    ${item_name}=    Set Variable    Pizza
    ${qty}=          Set Variable    2
    
    # 🎬 Act - Perform actions (via keywords bound to iOS Page Object)
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

### iOS App Lifecycle & Configurations

iOS Automation is controlled through the **XCUITest** driver.

- Always specify **`bundleId`** (equivalent to `appPackage`) when connecting to a real device or simulator.
- Use **`app`** to provide the path to the .app or .ipa binary.

```robot
*** Variables ***
${IOS_PLATFORM_NAME}        iOS
${IOS_PLATFORM_VERSION}     17.2    # DO NOT hardcode; fetch from .yaml
${IOS_DEVICE_NAME}          iPhone 15 Pro
${IOS_BUNDLE_ID}            com.example.myapp
${IOS_AUTOMATION}           XCUITest
```

---

## PART 5: Locator Strategy / Action

### 1. 🎯 Locator Strategy (iOS DOM Lookup Strategy)

iOS element discovery via XCUITest follows this Priority Order:

| Priority | Locator Type | Syntax in Robot | Stability |
| :------- | :----------- | :-------------- | :--------- |
| 🥇 #1 | **Accessibility ID** | `accessibility_id=login-btn` | Most stable (Maps to `accessibilityIdentifier`) |
| 🥈 #2 | **Predicate** | `ios=type == 'XCUIElementTypeButton' AND name == 'Login'` | Fast and precise (using `-ios predicate string`) |
| 🥉 #3 | **Class Chain** | `chain=**/XCUIElementTypeButton[-1]` | Efficient lookup (using `-ios class chain`), faster than XPath |
| 🚫 #4 | **XPath** | `xpath=//XCUIElementTypeButton[@name='Login']`| Slowest and most fragile in XCUITest (Avoid 100%) |

### 🛠️ Example Correct iOS Locator Usage

```robot
*** Keywords ***
Tap Login Button
    # ✅ BEST: Use accessibilityIdentifier
    Tap Element Safely    accessibility_id=submit-btn

Input Username
    # ✅ GOOD: Use Predicate (iOS native lookup) if accessibility_id is missing
    Input Text Into Field    ios=type == 'XCUIElementTypeTextField' AND name == 'email_input'    ${username}
```

### 2. 🤖 iOS-Specific Actions

iOS-specific mechanisms supported by Appium:

**A. Keyboard Interaction (iOS):**
(Different from Android; usually requires tapping a specific button or background)

```robot
*** Keywords ***
Submit Form
    # Method 1: Tapping the "Done" button on the soft keyboard
    Click Element    accessibility_id=Done
    
    # Method 2: Tapping an empty area (requires a helper)
    Tap Element Safely    xpath=//XCUIElementTypeApplication
```

**B. Scrolling on iOS (Native Search):**

```robot
*** Keywords ***
Scroll To Settings Menu
    # Fast scrolling using iOS native predicate
    Execute Script    mobile: scroll    {'direction': 'down', 'predicateString': 'name == "Settings"'}
```

**C. Handling System Alerts:**
OS-level pop-ups (e.g., location or notification permissions) require special handling:

```robot
*** Keywords ***
Accept System Alert
    # Can also set Capabilities: autoAcceptAlerts=true
    Execute Script    mobile: alert    {'action': 'accept'}
```

---

## PART 6: iOS Expert (Performance & Bypass)

### 1. iOS Deep Linking (Fast Navigation Gem)

Jump directly to a specific screen to save time and reduce test fragility.

```robot
*** Keywords ***
Jump To Profile Screen
    # 💎 Gem: Use mobile: deepLink to navigate directly
    Execute Script    mobile: deepLink    url=myapp://profile    bundleId=${IOS_BUNDLE_ID}
```

### 2. Biometric Simulation (FaceID/TouchID Gem)

Test apps requiring biometric auth without manual intervention.

```robot
*** Keywords ***
Simulate FaceID Success
    # 💎 Gem: Instruct simulator to mock a successful FaceID scan
    Execute Script    mobile: enrollBiometric    isEnabled=true
    Execute Script    mobile: sendBiometricMatch    type=faceid    match=true
```

### 3. Advanced Predicate String (Performance Gem)

Perform complex lookups at maximum speed (10-20x faster than XPath).

```robot
*** Keywords ***
Verify Status Is Completed
    # 💎 Gem: Multi-attribute lookup using native iOS syntax
    ${locator}    Set Variable    ios=type == 'XCUIElementTypeStaticText' AND label CONTAINS 'Completed' AND visible == 1
    Element Should Be Visible    ${locator}
```

---

## PART 7: Global Restrictions (Strict Rules for iOS)

1. ❌ **DO NOT** use `xpath` with iOS unless absolutely necessary; it causes significant performance overhead and timeouts.
2. ❌ **DO NOT** name files/objects interchangeably with Android. Keep objects in `pages/ios/`.
3. ⚠️ **MANDATORY:** Keyword names for identical actions **MUST be 100% identical to Android (Unified Naming).** DO NOT append `iOS` to keyword names; this ensures one script can run on both platforms.

---

## PART 8: App Management (Download Binaries)

**Naming Convention:**

- `app-v{version}.ipa` / `.app`
- `app-latest.ipa` / `.app`

**Download from CI/CD:**

```bash
# Azure DevOps
az pipelines runs artifact download --artifact-name ios-sit --path apps/ios/sit/

# AWS S3
aws s3 cp s3://builds/ios/sit/app-latest.ipa apps/ios/sit/
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
pabot --processes 2 tests-mobile/ios/
```

### 🛠️ Appium Stability

- Use `includeSafariInWebviews=true` for apps with web content.
- Use `shouldTerminateApp=true` to reset the app state before each file execution if needed.

---

## PART 11: CLI Commands & Execution (Quick Commands)

```bash
# === 🚀 Start Appium Server ===
appium

# === 🍏 iOS Test Execution (Robot Framework) ===

# Run all tests in the default environment
robot tests-mobile/ios/

# Specify Environment (SIT / UAT)
robot --variable ENV:sit tests-mobile/ios/
robot --variable ENV:uat tests-mobile/ios/

# Run by Tag (e.g., smoke, regression)
robot --include smoke tests-mobile/ios/
robot --include regression tests-mobile/ios/

# Run specific folder
robot tests-mobile/ios/[system-kebab]/[feature-kebab]/

# === 📊 Reports ===
robot --outputdir results tests-mobile/ios/
# View report
open results/report.html

# === 🛠️ Device & Debugging ===
xcrun simctl list devices
xcrun simctl boot "iPhone 15 Pro"
robot --loglevel DEBUG tests-mobile/ios/auth/login.robot
```

---

## PART 12: Quick Reference

### ✅ DO's

- **MANDATORY:** Keep keyword names identical to Android (Unified Naming).
- Prioritize `accessibility_id` locators.
- Include `[TC-xxxx]` in Test Case names.
- Keep Page Objects in `pages/ios/`.
- Ensure `bundleId` is correct for the target device.
- Always use `Wait Until Element Is Visible` before clicking.

### ❌ DON'Ts

- **FORBIDDEN:** Mixing Android and iOS file/object names.
- **FORBIDDEN:** Using `xpath` for elements with only generic classes.
- **FORBIDDEN:** Appending `iOS` to keyword names.
- Avoid `Sleep` (hardcoded wait).
