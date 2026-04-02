# Playwright UI Testing - Rules & Templates

> **⚠️ Important:** This file contains **Rules & Templates** for code implementation.
> **🎯 Purpose:** Standard rules and templates for Web UI Automation (Page Object Model) that AI agents must follow.

---

## PART 1: Overview

> 🚫 **ANTI-PATTERN:** Avoid putting all code/logic into a single file. For maintainability and ease of navigation, always separate into smaller sub-files.
>
> **📐 Structure Rules:**
> - 🔒 **MANDATORY — Top-level folder names** (`fixtures/`, `pages/`, `helpers/`, `tests-web/`, `db-scripts/`, etc.) **MUST be identical across all projects.**
> - 🔒 **MANDATORY — Naming conventions** (kebab-case folders, camelCase files) **MUST be followed in every project.**
> - 🔒 **MANDATORY — File suffix conventions** must be followed regardless of project complexity:
>   - `*Helper.ts` — utility/tool (pure function, no endpoint awareness)
>   - `*Service.ts` — business action (API/DB calls, endpoint-aware)
>   - `*Data.ts` — test data / fixtures
>   - `*Page.ts` — page object
>   - `*DbService.ts` — database service (feature-specific)
>   - `*DbConfig.ts` — database connection config
> - 💡 **RECOMMENDED — Shared sub-folder names** inside `fixtures/` and `helpers/` should use these standard names for cross-feature reuse:
>   - `fixtures/shared-data/` — common test data shared across features
>   - `helpers/shared-services/` — common services shared across features
>   - `helpers/shared-helpers/` — common utility tools shared across features
>   - `pages/shared-pages/` — common page objects shared across features
> - ✅ **FLEXIBLE — Internal structure within each folder** (how sub-folders are organized, how many files per feature) can be adapted to fit the project's business context.

### 📁 Project Structure: Web UI Testing

```text
tests/
├── shared-fixtures/                           # ♻️ CROSS-LAYER: Shared between API + Web UI + Mobile
│   └── [SYSTEM_KEBAB]/
│       └── [SYSTEM_FEATURE_KEBAB]/
│           ├── web/                               # Web consumer (Playwright/TypeScript)
│           │   ├── [SYSTEM_FEATURE_CAMEL]SharedData.ts
│           │   └── [SYSTEM_FEATURE_CAMEL]ApiSetup.ts
│           └── mobile/                            # Mobile consumer — create only if mobile team exists
│               ├── [SYSTEM_FEATURE_CAMEL]SharedData.yaml
│               └── [SYSTEM_FEATURE_CAMEL]ApiSetup.yaml
├── web-testing/
│   ├── fixtures/                                  # Test Data
│   │   ├── shared-data/                           # ♻️ SHARED: Common data across features (same test type)
│   │   │   └── userProfileData.ts                 # 📦 CORE: Common data (e.g., Global test accounts)
│   │   └── [SYSTEM_KEBAB]/
│   │       └── [SYSTEM_FEATURE_KEBAB]/
│   │           ├── [SYSTEM_FEATURE_CAMEL]Data.ts      # 📄 MAIN: Primary testing data
│   │           ├── [SYSTEM_FEATURE_CAMEL]Data.uat.ts  # 🌐 ENV (Optional): UAT specific data
│   │           └── [SYSTEM_FEATURE_CAMEL]Data.local.ts# 💻 ENV (Optional): Local specific data
│   ├── pages/                                     # Page Objects
│   │   ├── shared-pages/                          # ♻️ SHARED: Pages used across features (e.g., BasePage, Shared Components)
│   │   │   └── basePage.ts                        # 📦 CORE: Base class (TIMEOUTS, SELECTORS, waitForPageLoad)
│   │   │   └── [SYSTEM_FEATURE_CAMEL]NavigationPage.ts # 🔒 STATIC: Persistent layout (Menu, Header)
│   │   └── [SYSTEM_KEBAB]/
│   │       └── [SYSTEM_FEATURE_KEBAB]/
│   │           ├── [SYSTEM_FEATURE_CAMEL]DashboardPage.ts  # 🔄 DYNAMIC Content Page
│   │           ├── [SYSTEM_FEATURE_CAMEL]HomePage.ts       # 🔄 DYNAMIC Content Page
│   │           └── [SYSTEM_FEATURE_CAMEL]SettingsPage.ts   # 🔄 DYNAMIC Content Page
│   ├── helpers/                                   # Helper Utilities
│   │   ├── shared-services/                       # ♻️ SHARED: Logic used across systems
│   │   │   └── authService.ts                     # ⚙️ SERVICE: Common Auth flows
│   │   │   └── fileService.ts                     # ⚙️ SERVICE: Logic specific to file convert, upload, download
│   │   ├── shared-helpers/                        # ♻️ SHARED: Global Utilities
│   │   │   └── dateHelper.ts                      # 🛠️ HELPER: Date formatting tools
│   │   │   └── randomDataHelper.ts                # 🛠️ HELPER: Random data generators
│   │   │   └── databaseHelper.ts                  # 🛠️ HELPER: Database query tools
│   │   └── [SYSTEM_KEBAB]/
│   │       └── [SYSTEM_FEATURE_KEBAB]/
│   │           ├── [SYSTEM_FEATURE_CAMEL]Helper.ts    # 🔌 MAIN: Master feature controller
│   │           └── [domainHelper].ts                  # ⚙️ COMPONENT (Optional): Separate sub-files
│   ├── tests-web/                                 # Test Specs
│   │   └── [SYSTEM_KEBAB]/
│   │       └── [SYSTEM_FEATURE_KEBAB]/
│   │           ├── implementation[SYSTEM_FEATURE_CAMEL].md
│   │           └── [SYSTEM_FEATURE_CAMEL].spec.ts
│   ├── db-scripts/                               # Local Database Scripts
│   │                                              # ⚠️ Add db-scripts/ to tsconfig.json exclude to prevent Windows CI compile errors
│   │                                              # ⚠️ NEVER use static import from 'pg' — use dynamic import only (await import('pg'))
│   ├── pipelines/
│   │   └── web-pipeline.yaml
│   ├── playwright-report/
│   ├── test-results/
│   ├── .env
│   ├── .env.local
│   ├── .env.uat
│   ├── playwright.config.ts
│   ├── package.json
│   └── .gitignore
└── api-testing/
    └── ...
```

### 🔑 Standard Environment Variables

AI MUST use these standardized keys for Web UI testing configuration:

```bash
# .env / .env.local / .env.uat
BASE_URL=https://app.example.com          # Web app base URL (SIT default)
BASE_URL_LOCAL=https://localhost:4200     # Local override
BASE_URL_UAT=https://uat.example.com     # UAT override

USERNAME=test-user@example.com           # Test account username
PASSWORD=your-password                   # Test account password (⚠️ use CI/CD secrets in pipeline)
```

**⚠️ Notes:**

- Sensitive values (`PASSWORD`, tokens) must use CI/CD secrets injection — DO NOT commit to repo.
- Key names MUST always use `SCREAMING_SNAKE_CASE`.

---

**⚠️ Storage Rules:**

- **Folder Naming:** MUST use `[SYSTEM_FEATURE_KEBAB]` (all lowercase with hyphens) e.g., `shopee-payment`.
- **System Grouping:** MUST nest feature folders under a `[SYSTEM_KEBAB]` parent folder e.g., `shopee/shopee-payment/`.
- **Flat Structure:** DO NOT create nested ID folders. All files must reside directly under the Feature folder.
- **Namespace:** `[SYSTEM_KEBAB]` represents the system, `[SYSTEM_FEATURE_KEBAB]` represents the feature within that system.

> **🚨 BEFORE CREATING ANY FILE:** AI MUST ask the user for these 2 values if not already provided:
> 1. **System name** (`[SYSTEM_KEBAB]`) — e.g., `shopee`, `amazon`
> 2. **Feature name** (`[SYSTEM_FEATURE_KEBAB]`) — e.g., `shopee-payment`, `customer-search`, `invoice-management`
>
> Then derive: `[SYSTEM_FEATURE_CAMEL]` = camelCase of feature name (e.g., `shopeePayment`)
>
> **Example:** If system = `shopee`, feature = `shopee-payment`:
> - Folder: `tests-web/shopee/shopee-payment/`
> - Page: `pages/shopee/shopee-payment/shopeePaymentPage.ts`
> - Helper: `helpers/shopee/shopee-payment/shopeePaymentHelper.ts`
>
> **❌ WRONG:** `tests-web/shopee/implementationShopeePayment.md` (missing feature folder)
> **✅ CORRECT:** `tests-web/shopee/shopee-payment/implementationShopeePayment.md`

### 🔗 Cross-Layer Shared Fixtures (API + Web UI)

**When to use:** The same data set is used in both API tests and Web UI tests — e.g., `companyCode`, `customerCode`, `searchKeyword` tested on both frontend and backend.

**Location:** `tests/shared-fixtures/` — see Project Structure above.

**Example: Customer Search feature (frontend + backend share the same data)**

```typescript
// tests/shared-fixtures/amazon/customer-search/customerSearchSharedData.ts
export const customerSearchSharedData = {
  companyCode: '1002',
  customer: {
    validCode: '0002125576',
    invalidCode: 'INVALID-999',
    displayName: 'ABC Company Ltd.',
  },
  searchKeyword: 'ABC',
};
```

```typescript
// tests/api-testing/fixtures/amazon/customer-search/customerSearchData.ts
import { customerSearchSharedData } from '../../../shared-fixtures/amazon/customer-search/customerSearchSharedData';

export const testData = {
  ...customerSearchSharedData,
  // API-specific
  auth: { token: process.env.ACCESS_TOKEN ?? '' },
  expectedStatus: 200,
};
```

```typescript
// tests/web-testing/fixtures/amazon/customer-search/customerSearchData.ts
import { customerSearchSharedData } from '../../../shared-fixtures/amazon/customer-search/customerSearchSharedData';

export const testData = {
  ...customerSearchSharedData,
  // UI-specific
  expectedResultText: `Search result: ${customerSearchSharedData.customer.displayName}`,
  emptyStateText: 'No data found',
};
```

**Decision Rules:**

| Scenario | Location |
|---|---|
| Data used only in API tests | `api-testing/fixtures/` |
| Data used only in Web UI tests | `web-testing/fixtures/` |
| Data used in both API + Web UI (e.g., search keyword, customer code) | `shared-fixtures/[feature]/web/[SYSTEM_FEATURE_CAMEL]SharedData.ts` |
| API seed/reset payload used by Web UI test in beforeEach | `shared-fixtures/[feature]/web/[SYSTEM_FEATURE_CAMEL]ApiSetup.ts` |
| Data used in both API + Mobile | `shared-fixtures/[feature]/mobile/[SYSTEM_FEATURE_CAMEL]SharedData.yaml` |
| API seed/reset payload used by Mobile test in Suite Setup | `shared-fixtures/[feature]/mobile/[SYSTEM_FEATURE_CAMEL]ApiSetup.yaml` |
| Data shared across multiple features within the same test type | `fixtures/shared-data/` |

### 🔗 API Setup Pattern (Seed via API before UI test)

**When to use:** Web UI test needs to seed or reset state via API before interacting with the UI — faster and more reliable than navigating through UI to set up preconditions.

**File:** `tests/shared-fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/web/[SYSTEM_FEATURE_CAMEL]ApiSetup.ts`

```typescript
// tests/shared-fixtures/amazon/invoice/web/invoiceApiSetup.ts
export const invoiceApiSetup = {
  seed: {
    endpoint: '/api/invoices/reset',
    payload: { status: 'PENDING', companyCode: '1002' },
  },
  cleanup: {
    endpoint: '/api/invoices/cleanup',
    payload: { companyCode: '1002' },
  },
};
```

**Usage in Web UI spec:**

```typescript
import { invoiceApiSetup } from '../../../shared-fixtures/amazon/invoice/web/invoiceApiSetup';

test.beforeEach(async ({ request }) => {
  await request.post(invoiceApiSetup.seed.endpoint, { data: invoiceApiSetup.seed.payload });
});

test.afterEach(async ({ request }) => {
  await request.post(invoiceApiSetup.cleanup.endpoint, { data: invoiceApiSetup.cleanup.payload });
});
```

### 🔍 Terminology: Service vs Helper

To ensure consistent understanding within the team:

- **⚙️ Service (Business Action):** Logic related to **"system operations"** or Business Flow directly (focuses on calling API/DB or Complex UI Workflows).
  - *Example:* `authService.ts` (Login/Logout), `fileService.ts` (Upload/Download logic).
  - *Key Concept:* Aware of Endpoints/URLs and system data structure.
- **🛠️ Helper (Utility/Tool):** Logic acting as a **"helper tool"** to manage data or frequently reused tasks (focuses on Transform/Generate).
  - *Example:* `dateHelper.ts` (Date formatting), `randomDataHelper.ts` (Random phone number generator), `databaseHelper.ts` (Query data).
  - *Key Concept:* Pure Function, not tied to specific business logic, immediately reusable in other projects.

---

## 🔍 Pre-Implementation Check (MANDATORY — Before Writing Any Code)

> **🎯 Purpose:** Prevent duplicate code and missed existing assets.
> **⏱️ When:** Before writing any code — workflow or manual.

EXECUTE `resourcesDiscoverySkill.md` — **Step 1 (index scan) + Step 2 (existing code scan) + lessons scan only.**
- workflow_type = `webui_automation`
- OUTPUT the Pre-Implementation Check summary before writing any code.

---

## PART 2: Coding Standards

### 1. ⏰ Async/Await Usage

```typescript
// ✅ CORRECT - Always use async/await
test('should login successfully', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', 'user@test.com');
  await page.click('#submit');
});

// ❌ WRONG - Missing async/await
test('should login', ({ page }) => {
  page.goto('/login'); // Will fail!
});
```

### 2. 🏷️ Naming Conventions

```typescript
// ✅ CORRECT - Descriptive names
const loginButton = page.locator('#login-btn');
const userEmail = 'test@example.com';
const welcomeMessage = page.locator('.welcome-text');

// ✅ CORRECT - Classes
class LoginPage { }         // PascalCase
class UserService { }       // PascalCase

// ✅ CORRECT - Constants (MANDATORY)
const BASE_URL = 'https://api.example.com';  // SCREAMING_SNAKE_CASE
const API_KEY = 'abc123';                    // SCREAMING_SNAKE_CASE
const MAX_RETRY = 3;                         // SCREAMING_SNAKE_CASE

// ❌ WRONG - Unclear names
const btn = page.locator('#login-btn');
const email = 'test@example.com';
const msg = page.locator('.welcome-text');
const baseUrl = 'https://...';  // lowerCamelCase (Wrong)
const ApiKey = 'abc123';        // PascalCase (Wrong)
```

### 3. 📁 File and Folder Naming Standards

**MANDATORY RULES:**

1. **Folder:** `[SYSTEM_FEATURE_KEBAB]` (all lowercase with hyphens) e.g., `shopee-payment`.
2. **File:** `[SYSTEM_FEATURE_CAMEL]` (starts with lowercase, no hyphens) e.g., `shopeePayment.spec.ts`.

**MANDATORY: Test files MUST follow the [SYSTEM_FEATURE_CAMEL] pattern.**

```typescript
// ✅ CORRECT - [SYSTEM_FEATURE_CAMEL].spec.ts
shopeeLogin.spec.ts
amazonProductSearch.spec.ts
hotelRoomBooking.spec.ts

// ❌ WRONG - Wrong case
AmazonProductSearch.spec.ts // PascalCase (First letter should be lowercase)
amazon-product-search.spec.ts // kebab-case
amazon_product_search.spec.ts // snake_case
```

### 4. 🏗️ Test Structure (AAA Pattern)

```typescript
test('should display error for invalid login', async ({ page }) => {
  // 📝 Arrange - Setup test data
  const invalidEmail = 'invalid@test.com';
  
  // 🎬 Act - Perform actions
  await page.goto('/login');
  await page.fill('#email', invalidEmail);
  await page.click('#submit');
  
  // ✅ Assert - Verify results
  await expect(page.locator('.error')).toBeVisible();
});
```

### 5. 📦 Import Organization

```typescript
// ✅ CORRECT - Organized imports
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[SYSTEM_FEATURE_CAMEL]LoginPage';
import userData from '../../fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[SYSTEM_FEATURE_CAMEL].json';
```

---

## PART 3: Test Naming Conventions

### 🔑 Testcase ID Requirements

**MANDATORY: Every test MUST include [testcase id] in title.**

#### Single Testcase ID

```typescript
// ✅ CORRECT - Single testcase ID
test('[TC-XXXX] should login with valid credentials', async ({ page }) => {
  // test implementation
});

test('[123456] should display error for invalid email format', async ({ page }) => {
  // test implementation
});
```

#### Multiple Testcase IDs

```typescript
// ✅ CORRECT - Multiple testcase IDs
test('[TC-XXXX][TC-YYYY] should complete user registration flow', async ({ page }) => {
  // test implementation covering multiple test cases
});
```

#### Default Testcase ID Format

**When no specific testcase number is available, use [TC-XXXX].**

```typescript
// ✅ CORRECT - Default format when no testcase number
test('[TC-XXXX] should login with valid credentials', async ({ page }) => {
  // test implementation
});
```

### 🏷️ Test Describe Naming Conventions

**MANDATORY: Every test.describe MUST include [ID-xxxx] prefix.**

#### Single ID ID

```typescript
// ✅ CORRECT - Single ID ID
test.describe('[ID-1234] User Login Feature', () => {
  // test implementations
});
```

#### Multiple ID IDs

```typescript
// ✅ CORRECT - Multiple ID IDs
test.describe('[ID-1234][ID-1235] User Registration Flow', () => {
  // test implementations covering multiple IDs
});
```

---

## PART 4: Structure & Design

### 1. Centralized Shared Resources (Mandatory)
>
> **Principles:**
>
> 1. **Centralized:** Shared components **MUST reside in a single location** in `pages/shared/` or `utils/`.
> 2. **Flexible:** Editing/improving shared components is **ALLOWED**.
> 3. **Forbidden:** DO NOT create duplicate utility files inside ID folders.
>

#### Login System (Per-Feature)
>
> **📦 Source:** `ai-agent/knowledge/automation/webUi/webUiAuth.template.ts`
> **📌 Location:** `pages/common/loginPage.ts` (if shared) or `pages/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/login/[SYSTEM_FEATURE_CAMEL]LoginPage.ts` (if specific).
> **⭐️ Flexibility:** Create per-feature to support unique URLs and logic.
> **⚠️ Note:** DO NOT create ID sub-folders inside the Login module.
> **Feature Login Structure:**
>
> - `pages/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/login/[SYSTEM_FEATURE_CAMEL]LoginPage.ts`
> - `pages/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/login/loginTranslation.ts`
> - `fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/login/loginData.ts` (Optional)

### 2. Thinking Process (CoT) - Page Object Design

> **🧠 SOTA Analysis:**
>
> 1. **💭 CoT:** Analyze the page -> Extract Components -> Identify Shared parts.
> 2. **🌳 LATS:** Choose Design -> Single Page vs. Multiple Pages.
> 3. **⚖️ Constitutional AI:** Follow DRY and KISS principles.
> **✅ User Approval Required:** Present analysis + design decisions for user approval before implementation.

**Decision Criteria:**

- **Single vs. Multiple Pages?** If Interactions > 10 elements -> Break down into multiple files.
- **Reusable Component?** Header, Sidebar, DatePicker -> Use Shared components.
- **New Pattern?** If it's a Standard Pattern -> Extract into a Shared Helper immediately.

### 3. Page Object Model Pattern (Layout-Based Architecture)

**🎯 Principle:** Use **Layout-Based Architecture** for all UIs by separating Navigation and Content Pages.

**⚠️ File Structure:** New flexible structure.

#### 📜 Layout-Based Pattern (MANDATORY)

**Structuring Rules:**

1. **BasePage:** Base class for the feature.
2. **Component Classes:** Separate reused UI parts (Sidebar, Navigation, Modal).
3. **NavigationPage:** Manages Navigation + Layout (Header, Sidebar).
4. **Content Pages:** Specific content area pages.
5. **Shared Components:** Globally shared components.

```typescript
// ✅ Pattern: Component-Based Architecture (Advanced)

// 1. Component Class - For Reusable UI Parts
export class NavigationComponent {
  private readonly nav = this.page.locator('nav');
  public readonly homeLink = this.nav.getByRole('link', { name: 'Home' });
  public readonly profileLink = this.nav.getByRole('link', { name: 'Profile' });
  public readonly searchInput = this.nav.getByPlaceholder('Search...');

  constructor(private page: Page) {}

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }
}

// 2. Page Class - Composing Components
export class DashboardPage extends BasePage {
  public readonly nav: NavigationComponent;
  
  constructor(page: Page) {
    super(page);
    this.nav = new NavigationComponent(page);
  }

  async getTitle() {
    return await this.page.title();
  }
}
```

#### 🎯 Usage in Test

```typescript
// Test file
import { test, expect } from '@playwright/test';
import { FeaturePage } from '../pages/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/FeaturePage';

test.describe('[ID-1234] Document Management System', () => {
  test('[TC-001] should update personal information', async ({ page }) => {
    const featurePage = new FeaturePage(page);
    
    // Login and navigate
    const personalInfo = await featurePage.loginAndNavigateToPersonalInfo({
      username: 'test@example.com',
      password: 'password123'
    });
    
    // Update personal info
    await personalInfo.updatePersonalInfo({
      firstNameEN: 'John',
      lastNameEN: 'Doe',
      phoneNumber: '0812345678'
    });
    
    await personalInfo.saveChanges();
    
    // Verify changes
    await personalInfo.verifyPersonalInfo({
      firstNameEN: 'John',
      phoneNumber: '0812345678'
    });
  });
  
  test('[TC-002] should search and download documents', async ({ page }) => {
    const featurePage = new FeaturePage(page);
    
    // Navigate and search
    const documentList = await featurePage.navigateAndSearchDocuments('Time Sheet');
    
    // Verify and download
    await documentList.verifyDocumentExists('Time Sheet January 2026');
    await documentList.downloadDocument('Time Sheet January 2026');
  });
  
  test('[TC-003] should verify empty pending approval state', async ({ page }) => {
    const featurePage = new FeaturePage(page);
    
    // Navigate to pending approval
    const pendingApproval = await featurePage.navigation.navigateToPendingApproval();
    
    // Verify empty state
    await pendingApproval.verifyEmptyState();
    await pendingApproval.verifyPendingCount(0);
  });
});
```

### 4. Shared UI Helpers (Use Templates)

**🎯 Principle:** Utilize Templates from `@automation/webUi/` instead of writing custom helpers.

**📦 Source:** `ai-agent/knowledge/automation/webUi/`

#### Available Templates

| Template | Class | Features |
| :--- | :--- | :--- |
| `webUiAuth.template.ts` | LoginPage | Azure AD, 2FA, Stay signed in |
| `webUiDialog.template.ts` | ToastHelper | Success/Error/Warning/Info toasts |
| `webUiFile.template.ts` | FileUploadHelper | Upload/Download, Drag & Drop |
| `webUiForm.template.ts` | DropdownHelper | Dropdown, Multi-select, Search |
| `webUiNavigation.template.ts` | BreadcrumbHelper | Breadcrumb navigation |
| `webUiTable.template.ts` | PaginationHelper | Pagination controls |

**⚠️ Notes:**

- Templates are located in `ai-agent/knowledge/automation/webUi/`.
- Copy to `helpers/shared/` in the project.
- See examples in Section 3 (Full Example).

---

### 5. Categorizing Page Objects by Feature (Feature-Based)

**Problem:** Putting everything into a single file leads to:

- ❌ Massive Page Object (50+ methods).
- ❌ Massive Translation (100+ keys).
- ❌ Hard navigation.
- ❌ Hard maintenance.

#### Solution: Separate Files by Feature/Flow

```text
pages/userManagement/
├── loginPage.ts                      # Login flow
├── listPage.ts                       # List/Export/Import
├── formPage.ts                       # Create/Edit/Validation
```

**Requirements:**

- ✅ Separate files by Feature (Login, List, Form).
- ✅ Use descriptive names.
- ✅ Target 5-10 methods per file.
- ❌ DO NOT combine everything into one file (`all_in_one.ts`).

### 6. Additional UI Patterns

**📦 Source:** `ai-agent/knowledge/automation/webUi/`

| Template | Class | Use Case |
| :--- | :--- | :--- |
| `webUiCard.template.ts` | CardListHelper | Card/Kanban layout (sort, filter, empty state) |
| `webUiDrawer.template.ts` | DrawerHelper | Drawer/Sub-panel (open, close, overlay) |
| `webUiAppLauncher.template.ts` | AppLauncherHelper | 9Dot App Launcher, navigate across apps |

**⚠️ Note:** Copy to `helpers/shared/` in the project.

### 6. Advanced Fixtures & Patterns 🏗️

**🎯 Principle:** Extend the `test` object to include helpers, database connections, and authenticated pages ready for use.

#### 6.1 Multi-Role Auth (Login Once per Role) 👥

**Problem:** Repeated login in every test for different User Roles.

**Solution:** Use `globalSetup` to login once per role, store `storageState` files, reuse in all tests.

> **⚠️ Token vs Data:** Re-login is only required when **role/permission differs**.
> For fail cases, change the **action/data on the UI** instead — no re-login needed.
>
> ```typescript
> // ✅ Same user, different action → different result (no re-login needed)
> await adminPage.goto('/users/123');
> await adminPage.click('[data-testid="delete-btn"]');   // → success
>
> await userPage.goto('/users/123');
> await userPage.click('[data-testid="delete-btn"]');    // → access denied (different role)
> ```

**globalSetup Pattern (Login Once per Role):**

```typescript
// auth.setup.ts — login once per role, save storageState
import { test as setup, expect } from '@playwright/test';

setup('authenticate as admin', async ({ page }) => {
  await page.goto(process.env.BASE_URL + '/login');
  await page.fill('#username', process.env.ADMIN_EMAIL!);
  await page.fill('#password', process.env.ADMIN_PASSWORD!);
  await page.click('#submit');
  await expect(page).toHaveURL('/dashboard');
  await page.context().storageState({ path: 'playwright/.auth/admin.json' });
});

setup('authenticate as user', async ({ page }) => {
  await page.goto(process.env.BASE_URL + '/login');
  await page.fill('#username', process.env.USER_EMAIL!);
  await page.fill('#password', process.env.USER_PASSWORD!);
  await page.click('#submit');
  await expect(page).toHaveURL('/dashboard');
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
```

**playwright.config.ts — wire up storageState per project:**

```typescript
projects: [
  { name: 'setup', testMatch: '**/auth.setup.ts' },
  {
    name: 'admin',
    dependencies: ['setup'],
    use: { storageState: 'playwright/.auth/admin.json' }
  },
  {
    name: 'user',
    dependencies: ['setup'],
    use: { storageState: 'playwright/.auth/user.json' }
  }
]
```

**Usage in spec (no re-login needed):**

```typescript
// Test runs under 'admin' project — already logged in
test('[TC-001] admin can delete user', async ({ page }) => {
  await page.goto('/users');
  await page.click('[data-testid="delete-user-btn"]');
  await expect(page.locator('.success-toast')).toBeVisible();
});

// Test runs under 'user' project — already logged in as user
test('[TC-002] user cannot access admin panel', async ({ page }) => {
  await page.goto('/admin');
  await expect(page.locator('.access-denied')).toBeVisible();
});
```

#### 6.2 Database Fixture 🗄️

> **📚 Full pattern & DbService implementation:** See `databaseStrategySkill.md` → "Example: Database Service Pattern"

**⚠️ Notes:**

- Auth setup requires `auth.setup.ts` to create storage state first.
- DB pattern follows `databaseStrategySkill.md` — seed/verify/cleanup with `testId` isolation.
- Use only when project complexity justifies it.

---

## PART 5: Locator Strategy

> **See details at:** `ai-agent/rules/playwright/playwrightCodingStandards.md`

### Priority Order (Stability First)

| Priority | Locator | Use Case | Stability |
|----------|---------|----------|----------|
| 🥇 #1 | `getByTestId` | All elements (requires dev setup) | ⭐⭐⭐⭐⭐ |
| 🥈 #2 | `getByRole` | Semantic elements (button, link, textbox) | ⭐⭐⭐⭐ |
| 🥉 #3 | `getByLabel` | Form fields with labels | ⭐⭐⭐⭐ |
| 🏅 #4 | `getByPlaceholder` | Input with placeholder | ⭐⭐⭐ |
| 🏅 #5 | `getByText` | Non-interactive text | ⭐⭐⭐ |
| 🚫 #6 | CSS/XPath | Avoid unless absolutely necessary | ⭐ |

### 🛑 Anti-Patterns (Zero Tolerance)

| ❌ Anti-Pattern | ✅ Correct Approach |
|:---|:---|
| `page.waitForTimeout(5000)` | `expect(locator).toBeVisible()` |
| `locator.nth(0)`, `.first()` | `locator.filter({ hasText: '...' })` |
| `button.click({ force: true })` | Fix visibility issues (scroll/wait) |
| `waitForLoadState('networkidle')` | `page.waitForResponse('**/api/endpoint')` |
| XPath (`//div/span`) | `getByTestId`, `getByRole` |

---

## PART 6: Interactions & Assertions

### 1. UI Interaction Patterns

```typescript
// Form Interactions
await page.fill('#input-field', 'value'); // Enter data
await page.selectOption('#dropdown', 'option-value'); // Select option
await page.check('#checkbox'); // Check checkbox
await page.click('#button'); // Click button

// Wait for Elements
await page.waitForSelector('.loading-spinner', { state: 'hidden' }); // Wait for hide
await page.waitForLoadState('networkidle'); // Wait for network idle

// Hover and Focus
await page.hover('.menu-item'); // Mouse hover
await page.focus('#search-input'); // Focus on input

// File Upload (Drag & Drop)
await page.setInputFiles('#file-input', 'path/to/file.pdf');

// File Download
const downloadPromise = page.waitForEvent('download');
await page.click('#download-btn');
const download = await downloadPromise;
await download.saveAs('path/to/save/file.pdf');
```

### 2. Best Practices for UI Verification (Assertions)

```typescript
// ✅ CORRECT - Specific UI assertions
await expect(page.locator('.success-message')).toBeVisible();
await expect(page).toHaveURL('/dashboard');
await expect(page.locator('#username')).toHaveText('John Doe');
await expect(page.locator('.modal')).toBeHidden();

// ❌ WRONG - Generic assertions
await expect(page.locator('.message')).toBeTruthy();
```

### 3. 🚨 Common Timeout Issues (Root Cause)

#### Issue 1: Loading Overlay/Dialog Overlapping Element

**Problem:** Element exists but cannot be clicked because it's covered by an overlay.

**Root Cause:**

- Dialog/Modal is visible.
- Loading spinner is active.
- Backdrop overlay is blocking.

**✅ Solution:**

```typescript
// Wait for loading to hide
await page.waitForSelector('.loading-spinner', { state: 'hidden' });
await page.waitForSelector('.modal-backdrop', { state: 'detached' });
// Ready to click
await page.click('#submit-btn');
```

#### Issue 2: Data Loading (API Response Pending)

**Problem:** Element exists but data hasn't loaded yet.

**Root Cause:**

- API has not responded yet.
- Table/List is still empty.

**✅ Solution:**

```typescript
// Wait for API response
await page.waitForResponse(res => res.url().includes('/api/data'));
// Or wait for an element indicating data is ready
await page.waitForSelector('.data-loaded');
```

#### Issue 3: Element is Disabled

**Problem:** Element exists but is in a disabled state.

**Root Cause:**

- Required fields are missing.
- Validation is pending.

**✅ Solution:**

```typescript
// Fill required data first
await page.fill('#required-field', 'data');
// Button is now enabled
await page.click('#submit-btn');
```

#### 🔄 Timeout Error Workflow (CoT)

```text
❌ Error: "Timeout 30000ms exceeded waiting for selector #submit-btn"

💭 Root Cause Analysis (REASON):
1. 🔍 Check Selector: Is it correct?
2. 🔍 Check Timing: Need to wait for API or Loading?
3. 🔍 Check State: Is it disabled or hidden?

✅ Correct Action (ACT):
await page.waitForSelector('.loading-spinner', { state: 'hidden' });
await page.click('#submit-btn');
```

---

## PART 7: HELPERS

### Helper Creation Guidelines

#### File Structure

**Rules:**

- `[SYSTEM_FEATURE_CAMEL]Helper.ts` — **MANDATORY** as the main entry point (FeaturePage).
- Sub-files — Create if domain logic > 10 methods or reused across tests.
- File names must clearly represent the domain.

Refer to the structure in **[PART 1: Overview](#📁-project-structure-web-ui-testing)** for consistency and maintainability.

---

## PART 8: Infrastructure & Scripts Standard (package.json)

### 📦 Package.json Scripts Generation

### 🎯 Script Format Standard

**MANDATORY: All generated scripts MUST follow this exact format:**

```text
ui:[environment]:[SYSTEM_FEATURE_KEBAB]:[mode]
```

#### 📝 Format Components

1. **environment**: `sit` | `uat`
2. **feature**: `[SYSTEM_FEATURE_KEBAB]` (kebab-case, e.g., `user-management`)
3. **mode**: `cliMode` | `guiMode`

### ✅ Correct Script Examples

```json
{
  "scripts": {
    "ui:sit": "cross-env LANG=th ENV=sit playwright test --config=playwright.config.ts --reporter=list",
    "ui:uat": "cross-env LANG=th ENV=uat playwright test --config=playwright.config.ts --reporter=list",
    "ui:sit:user-management:cliMode": "cross-env LANG=th ENV=sit playwright test --config=playwright.config.ts --reporter=list tests-web/user-management/",
    "ui:sit:user-management:guiMode": "cross-env LANG=th ENV=sit playwright test --config=playwright.config.ts --ui tests-web/user-management/",
    "ui:uat:user-management:cliMode": "cross-env LANG=th ENV=uat playwright test --config=playwright.config.ts --reporter=list tests-web/user-management/",
    "ui:uat:user-management:guiMode": "cross-env LANG=th ENV=uat playwright test --config=playwright.config.ts --ui tests-web/user-management/",
    "record:ui": "npx playwright codegen --target typescript"
  }
}
```

### 🏗️ Script Generation Rules

#### **1. Environment Variables**

```bash
# SIT Environment
cross-env LANG=th ENV=sit

# UAT Environment
cross-env LANG=th ENV=uat
```

> **⚠️ cross-env:** Required for cross-platform compatibility (Windows/macOS/Linux). Install via `npm install -D cross-env`.

#### **2. Configuration File**

```bash
# UI Tests use:
--config=playwright.config.ts
```

#### **3. Test Directory**

```bash
# UI Tests
tests-web/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/
```

#### **4. Mode Options**

```bash
# CLI Mode (Default)
playwright test [options] --reporter=list

# GUI Mode (Interactive)
playwright test [options] --ui
```

### 🚨 Generation Requirements

#### **MANDATORY Requirements:**

1. **Always generate BOTH environments** (sit + uat) for every feature.
2. **Always generate BOTH modes** (cliMode + guiMode) for every feature.
3. **Follow exact naming format** - `ui:[env]:[SYSTEM_FEATURE_KEBAB]:[mode]`.
4. **Use correct config file** (`playwright.config.ts`).
5. **Include LANG=th and ENV variable** in every script.
6. **Always prefix with `cross-env`** for cross-platform compatibility.

---

## PART 9: Performance & Reliability

### 1. Global Setup (Authentication State)

- **DO:** Implement `auth.setup.ts` to perform login once.
- **DO:** Save to `playwright/.auth/user.json` and reuse in tests via `storageState`.

### 2. Parallel Execution Strategy

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests-web',
  fullyParallel: true,
  workers: process.env.CI ? 4 : 2,
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'setup', testMatch: '**/auth.setup.ts' },
    {
      name: 'web',
      dependencies: ['setup'],
      use: { storageState: 'playwright/.auth/user.json' }
    }
  ]
});
```

**Parallel Rules:**

- Each test must be independent and not share state.
- Avoid duplicate `page.goto()` calls in `beforeEach`.
- Use `test.describe.configure({ mode: 'serial' })` ONLY if sequential execution is required.

---

### 4. Advanced Fixtures (Technical Templates)

#### 4.1 Worker-Scoped Fixtures (Fast Setup)

Used for "expensive" operations such as database connections or heavy master data creation.

```typescript
// fixtures/worker.fixture.ts
import { test as base } from '@playwright/test';

type WorkerFixtures = {
  masterData: { id: string; code: string };
};

export const test = base.extend<{}, WorkerFixtures>({
  masterData: [async ({}, use) => {
    // 🚀 Runs once per Worker
    const data = await createLargeMasterDataViaAPI();
    await use(data);
    // Cleanup after all tests in the worker complete
    await deleteMasterData(data.id);
  }, { scope: 'worker' }],
});
```

#### 4.2 Automatic Fixtures (Global Diagnostic)

Automatically capture console logs for every test to assist in AI self-healing.

```typescript
// fixtures/auto.fixture.ts
export const test = base.extend<{ autoDiagnostic: void }>({
  autoDiagnostic: [async ({ page }, use) => {
    // 🤖 Capture console logs automatically
    page.on('console', msg => console.log(`[Browser] ${msg.type()}: ${msg.text()}`));
    await use();
  }, { auto: true }],
});
```

#### 4.3 API-First Authentication (High-Speed Auth)

Bypass UI login by using API to save execution time.

```typescript
// auth.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate@API', async ({ request }) => {
  const response = await request.post('/api/login', {
    data: { username: 'test', password: 'password' }
  });
  await request.storageState({ path: 'playwright/.auth/user.json' });
});
```

### 3. CI/CD Insight

- **Trace Viewer:** Ensure `trace: 'on-first-retry'` is set in `playwright.config.ts`.
- **Action Log:** Use `console.log` for critical UI interaction steps.

---

## PART 10: Advanced UI (Expert Tier)

### 1. Bot Detection Bypass (Security Evasion)

If tests are blocked by bot protection, use automation footprint removal techniques.

```typescript
// 💎 Gem: Clear Chrome properties often used for detection
test.use({
  launchOptions: {
    args: ['--disable-blink-features=AutomationControlled']
  }
});

test('should evade bot detection', async ({ page }) => {
  // Remove navigator.webdriver from runtime
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });
  await page.goto('https://nowsecure.nl');
});
```

### 2. Time Manipulation (UI Time Travel)

Test time-dependent UI behaviors (e.g., countdowns) without waiting in real-time.

```typescript
test('should verify countdown without actual wait', async ({ page }) => {
  // 💎 Gem: Install fake clock
  await page.clock.install();
  await page.goto('/promo');
  
  // 💎 Gem: Fast forward 1 hour immediately
  await page.clock.fastForward('01:00:00');
  
  await expect(page.getByText('Promotion Expired')).toBeVisible();
});
```

### 3. Atomic Web UI+API Integration (Seed Data Gem)

Seeding data via API directly within UI Spec files to ensure tests are "Atomic" (always starting from a clean state).

```typescript
test('should edit profile successfully @Feature @Scenario', async ({ page, request }) => {
  // 💎 Gem: Seed data via API before UI test
  await request.put('/api/user/reset', { data: { status: 'NORMAL' } });
  
  await page.goto('/profile');
  await page.getByRole('button', { name: 'Edit' }).click();
  // ...Continue UI test execution
});
```

### 4. Network Fuzzing & Mutation (Chaos Gem)

Mutating API responses mid-flight to test UI error handling.

```typescript
test('should display Error Message when API returns corrupted data', async ({ page }) => {
  // 💎 Gem: Intercept and mutate response
  await page.route('**/api/v1/user/assets', async route => {
    const response = await route.fetch();
    const json = await response.json();
    json.balance = "NOT_A_NUMBER"; // Inject fault
    await route.fulfill({ response, json });
  });
  
  await page.goto('/wallet');
  await expect(page.getByText('Error loading balance')).toBeVisible();
});
```

---

## PART 11: CLI Commands & Execution (Quick Commands)

**Run All Tests:**

```bash
npm test                    # Run all tests on SIT (default)
npm run test:sit            # Run all tests on SIT
npm run test:uat            # Run all tests on UAT
```

**Run Tests by Feature (CLI Mode):**

```bash
npm run ui:sit:feature1:cliMode    # Run Feature 1 on SIT via CLI
npm run ui:uat:feature1:cliMode    # Run Feature 1 on UAT via CLI
```

**Run Tests in UI Mode (Interactive/Debug):**

```bash
npm run ui:sit:feature1:guiMode    # Run Feature 1 on SIT in UI Mode
```

**Playwright Specific Commands:**

```bash
npx playwright test tests-web/[system-kebab]/[feature-kebab]/  # Run specific folder
npx playwright test --project=chromium                 # Run on specific browser
npm run report                                         # View HTML Report
```

---

## PART 12: Quick Reference

### ✅ DO's

- Always use async/await for UI actions.
- Include [ID-xxxx] in `test.describe`.
- Include [TC-xxxx] or [TCXXXXX] in test names.
- **MANDATORY: Add @Feature, @Important, and @Scenario tags to EVERY test.**

```typescript
// ✅ CORRECT - Tags format
test('[TC-XXXX] should login @Feature @Important @Scenario', async ({ page }) => {});

// Or use test.info().annotations
test('[TC-XXXX] should login', async ({ page }) => {
  test.info().annotations.push(
    { type: 'Feature', description: 'Authentication' },
    { type: 'Important', description: 'Critical' },
    { type: 'Scenario', description: 'Happy Path' }
  );
});
```

- Follow Playwright's locator priority (getByTestId > getByRole > getByLabel > getByPlaceholder > getByText).
- Use AAA pattern (Arrange, Act, Assert).
- Use Web-First Assertions (auto-retry).
- Wait for loading/overlays before interactions.
- Capture screenshots for critical steps.
- Implement Page Object Model pattern.
- Encapsulate locators (private/readonly).

### ❌ DON'Ts

- Skip testcase IDs in test names.
- Skip ID IDs in `test.describe`.
- **NEVER skip @Feature, @Important, and @Scenario tags.**
- Use `waitForTimeout()` (hardcoded waits).
- Use `.nth(0)` or `.first()` (brittle index locators).
- Use `{ force: true }` on clicks.
- Use `waitForLoadState('networkidle')`.
- Use XPath unless absolutely necessary.
- Use generic assertions (`toBeTruthy`).
- Expose raw locators from Page Objects.
- Use unclear variable names.
