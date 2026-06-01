# Playwright API Testing - Rules & Templates

> **⚠️ Important:** This file contains **Rules & Templates** for code implementation.
> **🎯 Purpose:** Standard rules and templates for API Automation that AI agents must follow.

---

## PART 1: Overview

> 🚫 **ANTI-PATTERN:** Avoid putting all code/logic into a single file. For maintainability and ease of navigation, always separate into smaller sub-files.
>
> **📐 Structure Rules:**
> - 🔒 **MANDATORY — Top-level folder names** (`schemas/`, `fixtures/`, `helpers/`, `tests-api/`, `db-scripts/`, etc.) **MUST be identical across all projects.**
> - 🔒 **MANDATORY — Naming conventions** (kebab-case folders, camelCase files) **MUST be followed in every project.**
> - 🔒 **MANDATORY — File suffix conventions** must be followed regardless of project complexity:
>   - `*Helper.ts` — utility/tool (pure function, no endpoint awareness)
>   - `*Service.ts` — business action (API/DB calls, endpoint-aware)
>   - `*Data.ts` — test data / fixtures
>   - `*Schema.ts` — JSON schema validation
>   - `*DbService.ts` — database service (feature-specific)
>   - `*DbConfig.ts` — database connection config
> - 💡 **RECOMMENDED — Shared sub-folder names** inside `fixtures/` and `helpers/` should use these standard names for cross-feature reuse:
>   - `fixtures/shared-data/` — common test data shared across features
>   - `helpers/shared-services/` — common services shared across features
>   - `helpers/shared-helpers/` — common utility tools shared across features
> - ✅ **FLEXIBLE — Internal structure within each folder** (how sub-folders are organized, how many files per feature) can be adapted to fit the project's business context.

### 📁 Project Structure: API Testing

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
├── api-testing/
│   ├── schemas/                                   # API Validations & Specifications (AJV/JSON Schema)
│   │   ├── shared-schemas/                        # ♻️ SHARED: Common schemas across features/systems
│   │   │   └── userProfileSchema.ts               # 📦 CORE: Common definitions (e.g., User, Address, Global response)
│   │   └── [SYSTEM_KEBAB]/
│   │       └── [SYSTEM_FEATURE_KEBAB]/
│   │           └── [SYSTEM_FEATURE_CAMEL]Schema.ts    # 📦 CORE: Base Schema Definition
│   ├── fixtures/                                  # Test Data
│   │   ├── shared-data/                           # ♻️ SHARED: Common data across features (same test type)
│   │   │   └── userProfileData.ts                 # 📦 CORE: Common data (e.g., Global test accounts, constants)
│   │   └── [SYSTEM_KEBAB]/
│   │       └── [SYSTEM_FEATURE_KEBAB]/
│   │           ├── [SYSTEM_FEATURE_CAMEL]Data.ts      # 📄 MAIN: Primary test data
│   │           ├── [SYSTEM_FEATURE_CAMEL]Data.uat.ts  # 🌐 ENV (Optional): UAT specific data
│   │           └── [SYSTEM_FEATURE_CAMEL]Data.local.ts# 💻 ENV (Optional): Local specific data
│   ├── helpers/                                   # API Services & Utilities
│   │   ├── shared-services/                       # ♻️ SHARED: Services used across multiple features
│   │   │   └── authService.ts                     # ⚙️ SERVICE: Logic specific to authorization (Example)
│   │   │   └── fileService.ts                     # ⚙️ SERVICE: Logic specific to file convert, upload, download (Example)
│   │   ├── shared-helpers/                        # ♻️ SHARED: Utilities used across features/systems
│   │   │   └── dateHelper.ts                      # ⚙️ COMMON: Logic specific to date (Example)
│   │   │   └── randomDataHelper.ts                # ⚙️ COMMON: Logic specific to random data (Example)
│   │   └── [SYSTEM_KEBAB]/
│   │       └── [SYSTEM_FEATURE_KEBAB]/
│   │           ├── [SYSTEM_FEATURE_CAMEL]Helper.ts    # 🔌 MAIN: Entry point composing multiple services
│   │           └── [domainService].ts                 # ⚙️ SERVICE: Separate logic files; avoids bloated main helpers
│   ├── tests-api/                                 # Test Specs
│   │   └── [SYSTEM_KEBAB]/
│   │       └── [SYSTEM_FEATURE_KEBAB]/
│   │           ├── implementation[SYSTEM_FEATURE_CAMEL].md
│   │           └── [SYSTEM_FEATURE_CAMEL].spec.ts
│   ├── db-scripts/                                # 🗄️ Database Strategy (Domain-Driven & Isolation)
│   │   └── [SYSTEM_KEBAB]/
│   │       └── [SYSTEM_FEATURE_KEBAB]/                # ⚠️ See detailed file structure in @databaseStrategySkill.md
│   │                                              # ⚠️ Add db-scripts/ to tsconfig.json exclude to prevent Windows CI compile errors
│   │                                              # ⚠️ NEVER use static import from 'pg' — use dynamic import only (await import('pg'))
│   ├── postman/                                   # Postman Migration
│   │   ├── collections/
│   │   │   └── postmanCollection.json
│   │   └── environments/
│   │       └── postmanEnvironment.json
│   ├── pipelines/
│   │   └── apiPipeline.yaml
│   ├── playwright-report/
│   ├── test-results/
│   ├── .env
│   ├── .env.local
│   ├── .env.uat
│   ├── playwright.config.ts
│   ├── package.json
│   └── .gitignore
└── web-testing/
    └── ...
```

### 🔑 Standard Environment Variables

AI MUST use these standardized keys for API testing configuration:

```bash
# .env / .env.local / .env.uat
BASE_URL=https://api.example.com          # API base URL (SIT default)
BASE_URL_LOCAL=https://localhost:3000     # Local override
BASE_URL_UAT=[REDACTED] # UAT override

CLIENT_ID=your-client-id                 # OAuth2 client ID
CLIENT_SECRET=your-client-secret         # OAuth2 client secret (⚠️ use CI/CD secrets in pipeline)

ACCESS_TOKEN=                            # Static token (if applicable; leave empty if runtime)
```

**⚠️ Notes:**

- `ACCESS_TOKEN` obtained from login flow should be set in `beforeAll`, not in `.env`.
- Sensitive values (`CLIENT_SECRET`, tokens) must use CI/CD secrets injection — DO NOT commit to repo.
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
> - Folder: `tests-api/shopee/shopee-payment/`
> - File: `implementationShopeePayment.md`
> - Helper: `helpers/shopee/shopee-payment/shopeePaymentHelper.ts`
>
> **❌ WRONG:** `tests-api/shopee/implementationShopeePayment.md` (missing feature folder)
> **✅ CORRECT:** `tests-api/shopee/shopee-payment/implementationShopeePayment.md`

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

- **⚙️ Service (Business Action):** Logic related to **"system operations"** or Business Flow directly (focuses on calling API/DB).
  - *Example:* `authService.ts` (Login/Logout), `userService.ts` (Create/Update User), `paymentService.ts`.
  - *Key Concept:* Aware of Endpoints and system data structure.
- **🛠️ Helper (Utility/Tool):** Logic acting as a **"helper tool"** to manage data or frequently reused tasks (focuses on Transform/Generate).
  - *Example:* `dateHelper.ts` (Date formatting), `randomDataHelper.ts` (Random phone number generator).
  - *Key Concept:* Pure Function, unaware of Endpoints, immediately reusable in other projects.

---

## 🔍 Pre-Implementation Check (MANDATORY — Before Writing Any Code)

> **🎯 Purpose:** Prevent duplicate code and missed existing assets.
> **⏱️ When:** Before writing any code — workflow or manual.

EXECUTE `resourcesDiscoverySkill.md` — **Step 1 (index scan) + Step 2 (existing code scan) + lessons scan only.**
- workflow_type = `api_automation`
- OUTPUT the Pre-Implementation Check summary before writing any code.

---

## PART 2: Coding Standards

### 1. ⏰ Async/Await Usage

```typescript
// ✅ CORRECT - Always use async/await
test('should login successfully', async ({ request }) => {
  const response = await request.post('/api/login');
  expect(response.status()).toBe(200);
});

// ❌ WRONG - Missing async/await
test('should login', ({ request }) => {
  request.post('/api/login'); // Will fail!
});
```

### 2. 🏷️ Naming Conventions

```typescript
// ✅ CORRECT - Descriptive names
const loginEndpoint = '/api/auth/login';
const userData = { name: 'John', email: 'john@test.com' };

// ✅ CORRECT - Classes
class ApiHelper { }         // PascalCase
class UserService { }       // PascalCase

// ✅ CORRECT - Constants (MANDATORY)
const BASE_URL = 'https://api.example.com';  // SCREAMING_SNAKE_CASE
const API_KEY = 'abc123';                    // SCREAMING_SNAKE_CASE
const MAX_RETRY = 3;                         // SCREAMING_SNAKE_CASE

// ❌ WRONG - Unclear names
const endpoint = '/api/auth/login';
const data = { name: 'John', email: 'john@test.com' };
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
shopeePayment.spec.ts
amazonCart.spec.ts
hotelRoomManagement.spec.ts

// ❌ WRONG - Wrong case
ShopeePayment.spec.ts     // PascalCase (First letter should be lowercase)
shopee-payment.spec.ts    // kebab-case
shopee_payment.spec.ts    // snake_case
```

### 4. 🏗️ Test Structure (AAA Pattern)

```typescript
test('[TC-XXXX] should create user successfully', async ({ request }) => {
  // 📝 Arrange - Setup test data
  const userData = { name: 'John Doe', email: 'john@example.com' };
  
  // 🎬 Act - Perform actions
  const response = await request.post('/api/users', { data: userData });
  
  // ✅ Assert - Verify results
  expect(response.status()).toBe(201);
  const responseBody = await response.json();
  expect(responseBody.name).toBe(userData.name);
});
```

### 5. 📦 Import Organization

```typescript
// ✅ CORRECT - Organized imports
import { test, expect } from '@playwright/test';
import { UserAPI } from '../../helpers/user/userHelper';
import testData from '../../fixtures/user/userData';
```

---

## PART 3: Test Naming Conventions

### 🔑 Testcase ID Requirements

**MANDATORY: Every test MUST include [testcase id] in title.**

#### Single Testcase ID

```typescript
// ✅ CORRECT - Single testcase ID
test('[TC-XXXX] should login with valid credentials', async ({ request }) => {
  // test implementation
});

test('[TC-XXXX] should display error for invalid email format', async ({ request }) => {
  // test implementation
});
```

#### Multiple Testcase IDs

```typescript
// ✅ CORRECT - Multiple testcase IDs
test('[TC-XXXX][TC-YYYY] should complete user registration flow', async ({ request }) => {
  // test implementation covering multiple test cases
});
```

#### Default Testcase ID Format

**When no specific testcase number is available, use [TC-XXXX].**

```typescript
// ✅ CORRECT - Default format when no testcase number
test('[TC-XXXX] should login with valid credentials', async ({ request }) => {
  // test implementation
});
```

### 🏷️ Test Describe Naming Conventions

**MANDATORY: Every test.describe MUST include [ID-xxxx] prefix.**

#### 📝 Describe Format Rules

```typescript
// Format: [ID-xxxx] or [ID-xxxx][ID-yyyy]... + descriptive title

// ✅ CORRECT Examples
test.describe('[ID-1234] User API Endpoints');
test.describe('[ID-1235] Authentication API');
test.describe('[ID-1236][ID-1237] Payment API Flow');

// ❌ WRONG Examples - Missing ID ID
test.describe('User API');                  // Missing ID ID
test.describe('API tests');                 // Missing ID ID
test.describe('Authentication endpoints');  // Missing ID ID
```

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

### 1. Service Layer Pattern (Atomic Services)

```typescript
// ✅ CORRECT: Service Layer for API
export class UserService {
  constructor(private readonly request: APIRequestContext) {}
  
  async createUser(token: string, userData: User): Promise<APIResponse> {
    return await this.request.post('/api/users', {
      headers: { 'Authorization': `Bearer ${token}` },
      data: userData
    });
  }
}
```

### 2. Advanced API Mocking & Interception

**Goal:** Isolate tests and simulate edge cases/errors effectively.

#### 2.1 Conditional Mocking (Fallback)

```typescript
await page.route('**/api/v1/data', async route => {
  const response = await route.fetch();
  if (response.status() === 500) {
    // Fallback to mock data if SIT/UAT fails
    await route.fulfill({ json: { mock: 'data' } });
  } else {
    await route.continue();
  }
});
```

#### 2.2 GraphQL Interception (By Operation Name)

```typescript
await page.route('**/graphql', async route => {
  const payload = route.request().postDataJSON();
  if (payload.operationName === 'GetUserInfo') {
    await route.fulfill({ json: { data: { user: { name: 'Mock User' } } } });
  } else {
    await route.continue();
  }
});
```

### 3. API Service Architecture (Multi-Service Pattern)

**🎯 Principle:** Use **Multi-Service Architecture** for API by separating Services according to Business Domain.

#### 🏗️ Standard Structure

```typescript
// Individual Services
export class AuthService {
  private request: APIRequestContext;
  
  constructor(request: APIRequestContext) {
    this.request = request;
  }
  
  // 🔐 AUTH ENDPOINTS
  private readonly loginEndpoint = '/api/auth/login';
  private readonly refreshEndpoint = '/api/auth/refresh';
  private readonly logoutEndpoint = '/api/auth/logout';
  
  // 🔐 AUTH ACTIONS
  async login(credentials: LoginData): Promise<APIResponse> {
    return await this.request.post(this.loginEndpoint, { data: credentials });
  }
  
  async refreshToken(token: string): Promise<APIResponse> {
    return await this.request.post(this.refreshEndpoint, { data: { token } });
  }
  
  async logout(token: string): Promise<APIResponse> {
    return await this.request.post(this.logoutEndpoint, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
}

export class UserService {
  private request: APIRequestContext;
  
  constructor(request: APIRequestContext) {
    this.request = request;
  }
  
  // 👤 USER ENDPOINTS
  private readonly usersEndpoint = '/api/users';
  private readonly profileEndpoint = '/api/users/profile';
  private readonly settingsEndpoint = '/api/users/settings';
  
  // 👤 USER ACTIONS
  async createUser(token: string, userData: UserData): Promise<APIResponse> {
    return await this.request.post(this.usersEndpoint, {
      headers: { 'Authorization': `Bearer ${token}` },
      data: userData
    });
  }
  
  async getProfile(token: string, userId: string): Promise<APIResponse> {
    return await this.request.get(`${this.profileEndpoint}/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
  
  async updateSettings(token: string, settings: UserSettings): Promise<APIResponse> {
    return await this.request.put(this.settingsEndpoint, {
      headers: { 'Authorization': `Bearer ${token}` },
      data: settings
    });
  }
}

export class OrderService {
  private request: APIRequestContext;
  
  constructor(request: APIRequestContext) {
    this.request = request;
  }
  
  // 📝 ORDER ENDPOINTS
  private readonly ordersEndpoint = '/api/orders';
  private readonly orderStatusEndpoint = '/api/orders/status';
  
  // 📝 ORDER ACTIONS
  async createOrder(token: string, orderData: OrderData): Promise<APIResponse> {
    return await this.request.post(this.ordersEndpoint, {
      headers: { 'Authorization': `Bearer ${token}` },
      data: orderData
    });
  }
  
  async getOrderStatus(token: string, orderId: string): Promise<APIResponse> {
    return await this.request.get(`${this.orderStatusEndpoint}/${orderId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
}

// Main API Client
export class Helper {
  public auth: AuthService;
  public user: UserService;
  public order: OrderService;
  
  constructor(request: APIRequestContext) {
    this.auth = new AuthService(request);
    this.user = new UserService(request);
    this.order = new OrderService(request);
  }
  
  // High-level workflows
  async loginAndCreateOrder(credentials: LoginData, orderData: OrderData): Promise<void> {
    const authResponse = await this.auth.login(credentials);
    const { token } = await authResponse.json();
    await this.order.createOrder(token, orderData);
  }
  
  async getUserProfileWithOrders(credentials: LoginData, userId: string): Promise<any> {
    const authResponse = await this.auth.login(credentials);
    const { token } = await authResponse.json();
    
    const profile = await this.user.getProfile(token, userId);
    const orders = await this.order.getOrderStatus(token, userId);
    
    return {
      profile: await profile.json(),
      orders: await orders.json()
    };
  }
}
```

#### 🎯 Usage in Test

```typescript
// Test file
import { test, expect } from '@playwright/test';
import { Helper } from '../../helpers/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[SYSTEM_FEATURE_CAMEL]Helper';

test.describe('API Tests', () => {
  test('should create order after successful login', async ({ request }) => {
    const helper = new Helper(request);
    
    // Use individual services
    const authResponse = await helper.auth.login(credentials);
    const userResponse = await helper.user.getProfile(token, userId);
    const orderResponse = await helper.order.createOrder(token, orderData);
    
    // Or use high-level workflow
    await helper.loginAndCreateOrder(credentials, orderData);
    
    expect(authResponse.status()).toBe(200);
    expect(orderResponse.status()).toBe(201);
  });
});
```

### 4. Advanced Fixtures & Patterns 🏗️

**🎯 Principle:** Extend the `test` object to include API helpers, database connections, and authenticated API clients ready for use.

#### 4.1 Multi-Role API Auth Fixture 👥

**Problem:** Repeated Login required in every API test for different User Roles.

**Solution:** Create a Fixture that is pre-logged in for each Role.

> **⚠️ Token vs Data:** Re-login is only required when **role/permission differs**.
> For fail cases, change the **parameters sent to the API** instead — no re-login needed.
>
> ```typescript
> // ✅ Same token, different data → different result (no re-login needed)
> helper.invoice.getInvoices(token, companyCode, customer.validCode)    // → 200 with data
> helper.invoice.getInvoices(token, companyCode, customer.invalidCode)  // → 200 empty
>
> // ✅ Different token only when role/permission differs
> helper.customer.getCustomers(mainToken, companyCode)      // → has customers
> helper.customer.getCustomers(noCustomerToken, companyCode) // → empty (different user)
> ```

**globalSetup Pattern (Login Once per Role):**

```typescript
// globalSetup.ts — login once, store all tokens
export default async function globalSetup() {
  const ctx = await request.newContext();

  // Main user token
  const mainRes = await ctx.post(process.env.LOGIN_URL!, { form: {
    ...oauthParams,
    username: process.env.TEST_USER_EMAIL!,
    password: process.env.TEST_USER_PASSWORD!,
  }});
  process.env.ACCESS_TOKEN = (await mainRes.json()).access_token;

  // Secondary user token (different role/permission)
  const user5Res = await ctx.post(process.env.LOGIN_URL!, { form: {
    ...oauthParams,
    username: process.env.TEST_USER5_EMAIL!,
    password: process.env.TEST_USER5_PASSWORD!,
  }});
  process.env.ACCESS_TOKEN_USER5 = (await user5Res.json()).access_token;

  await ctx.dispose();
}
```

**Usage in spec (read from process.env, no re-login):**

```typescript
test.beforeAll(async () => {
  token = process.env.ACCESS_TOKEN!;
  noCustomerToken = process.env.ACCESS_TOKEN_USER5!;
});
```

#### 4.2 Database Fixture (API Integration) 🗄️

> **📚 Full pattern & DbService implementation:** See `databaseStrategySkill.md` → "Example: Database Service Pattern"

#### 4.3 API Response Cache Fixture 📦

**Problem:** Slow APIs or Rate Limits impacting test speed.

**Solution:** Cache API Responses for tests that don't require real-time data.

```typescript
// fixtures/apiCache.fixture.ts
import { test as base } from '@playwright/test';
import fs from 'fs';
import path from 'path';

type ApiCacheFixtures = {
  cachedAPI: {
    get: (endpoint: string) => Promise<any>;
    post: (endpoint: string, data: any) => Promise<any>;
  };
};

export const test = base.extend<ApiCacheFixtures>({
  cachedAPI: async ({ request }, use) => {
    const cacheDir = path.join(__dirname, '../cache');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const cachedAPI = {
      async get(endpoint: string) {
        const cacheKey = endpoint.replace(/[^a-zA-Z0-9]/g, '_');
        const cacheFile = path.join(cacheDir, `${cacheKey}.json`);
        
        // Check cache first
        if (fs.existsSync(cacheFile)) {
          const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
          console.log(`📦 Using cached response for ${endpoint}`);
          return cached;
        }
        
        // Make real API call and cache
        const response = await request.get(endpoint);
        const data = await response.json();
        fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2));
        console.log(`🌐 Cached new response for ${endpoint}`);
        return data;
      },
      
      async post(endpoint: string, postData: any) {
        // POST requests are not cached (as they modify data)
        const response = await request.post(endpoint, { data: postData });
        return await response.json();
      }
    };
    
    await use(cachedAPI);
  },
});
```

**Usage:**

```typescript
// Use cached API for reference data
import { test } from '../fixtures/apiCache.fixture';

test('[TC-004] should validate user data format', async ({ cachedAPI }) => {
  // Use cached data for reference
  const userData = await cachedAPI.get('/api/users/reference');
  
  // Validate format
  expect(userData).toHaveProperty('id');
  expect(userData).toHaveProperty('email');
  expect(userData.email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
});
```

#### 4.4 API Mock Fixture (Test Isolation) 🎭

**Problem:** Need tests independent of external APIs or to simulate error conditions.

**Solution:** Create Mock API responses for various test scenarios.

```typescript
// fixtures/apiMock.fixture.ts
import { test as base, Page } from '@playwright/test';

type ApiMockFixtures = {
  mockAPI: {
    mockSuccess: (endpoint: string, data: any) => Promise<void>;
    mockError: (endpoint: string, status: number, error: any) => Promise<void>;
    mockDelay: (endpoint: string, data: any, delay: number) => Promise<void>;
  };
  page: Page;
};

export const test = base.extend<ApiMockFixtures>({
  mockAPI: async ({ page }, use) => {
    const mockAPI = {
      async mockSuccess(endpoint: string, data: any) {
        await page.route(`**${endpoint}`, async route => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(data)
          });
        });
      },
      
      async mockError(endpoint: string, status: number, error: any) {
        await page.route(`**${endpoint}`, async route => {
          await route.fulfill({
            status: status,
            contentType: 'application/json',
            body: JSON.stringify(error)
          });
        });
      },
      
      async mockDelay(endpoint: string, data: any, delay: number) {
        await page.route(`**${endpoint}`, async route => {
          await new Promise(resolve => setTimeout(resolve, delay));
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(data)
          });
        });
      }
    };
    
    await use(mockAPI);
  },
});
```

**Usage:**

```typescript
// Use mock API for error scenarios
import { test } from '../fixtures/apiMock.fixture';

test('[TC-005] should handle API timeout gracefully', async ({ page, mockAPI }) => {
  // Mock slow API response (5 seconds)
  await mockAPI.mockDelay('/api/users', { users: [] }, 5000);
  
  await page.goto('/users');
  
  // Should show loading state
  await expect(page.locator('.loading-spinner')).toBeVisible();
  
  // Should eventually show timeout message
  await expect(page.locator('.timeout-error')).toBeVisible({ timeout: 10000 });
});

test('[TC-006] should handle 500 server error', async ({ page, mockAPI }) => {
  // Mock server error
  await mockAPI.mockError('/api/users', 500, {
    error: 'Internal Server Error',
    message: 'Database connection failed'
  });
  
  await page.goto('/users');
  
  // Should show error message
  await expect(page.locator('.error-message')).toContainText('Server Error');
});
```

**⚠️ Notes:**

- API Auth Fixture must have valid credentials for each environment.
- Database Fixture requires Prisma installation and connection configuration.
- Cache Fixture is ideal for infrequently changing reference data.
- Mock Fixture is suitable for error scenarios and edge cases.
- Use only when project complexity justifies it.

---

## PART 5: Assertions & Error Handling

### 1. API Response Assertions

#### 1.1 Assertions Best Practices

```typescript
// ✅ CORRECT - Specific API assertions
expect(response.status()).toBe(201);
expect(response.headers()['content-type']).toContain('application/json');

// ❌ WRONG - Generic assertions
expect(response.ok()).toBeTruthy();
```

#### 1.2 API Response Validation

```typescript
// ✅ Assert - Status Code
expect(response.status()).toBe(201);

// ✅ Assert - Response Headers
expect(response.headers()['content-type']).toContain('application/json');
expect(response.headers()['x-api-version']).toBe('v1');

// ✅ Assert - Response Body
const responseBody = await response.json();
expect(responseBody.id).toBeDefined();
expect(responseBody.name).toBe(userData.name);
expect(responseBody.email).toBe(userData.email);
expect(responseBody.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

// ✅ Assert - Array Response
expect(Array.isArray(responseBody.items)).toBe(true);
expect(responseBody.items.length).toBeGreaterThan(0);
expect(responseBody.total).toBeGreaterThanOrEqual(responseBody.items.length);
```

### 2. 🚨 Common API Issues (Root Cause)

#### Issue 1: Network Timeout

**Problem:** API is slow or timeouts.

**Root Cause:**

- API Server is slow or unresponsive.
- High network latency.
- Slow database query.

**✅ Solution:**

```typescript
// Increase timeout for slow APIs
const response = await request.post('/api/heavy-operation', {
  data: largeData,
  timeout: 60000 // 60 seconds
});
```

#### Issue 2: Eventual Consistency (Data not ready)

**Problem:** API saves data asynchronously, so GET immediate after POST returns outdated data.

**✅ Solution (Advanced Gem: Predicate Waiting):**
```typescript
// 💎 Gem: Wait until JSON data contains expected value
await expect.poll(async () => {
  const res = await request.get('/api/status/123');
  const body = await res.json();
  return body.status;
}, {
  message: 'Wait for status to be COMPLETED',
  timeout: 10000,
}).toBe('COMPLETED');
```

#### Issue 3: Concurrent Request Testing (Race Conditions)

**Problem:** ต้องการ test ว่าระบบจัดการ concurrent requests ได้ถูกต้อง เช่น 2 users จอง seat เดียวกันพร้อมกัน

**✅ Solution: Promise.all() Pattern**

```typescript
test('[TC-007] Race condition — จองที่นั่งเดียวกัน 2 requests พร้อมกัน', async ({ request }) => {
  // Arrange
  await dbService.seed({ seatId: 'SEAT-001', status: 'Available' }, 'TC-007')

  // Act — fire 2 requests simultaneously
  const [res1, res2] = await Promise.all([
    apiService.book(request, { seatId: 'SEAT-001' }),
    apiService.book(request, { seatId: 'SEAT-001' }),
  ])

  // Assert — exactly 1 success, 1 conflict
  const statuses = [res1.status(), res2.status()].sort()
  expect(statuses).toEqual([200, 409])

  // Cleanup
  await dbService.cleanup('TC-007')
})
```

**กฎ Concurrent Testing:**
- ใช้ `Promise.all()` เสมอ — ไม่ใช่ sequential calls
- Sort statuses ก่อน assert — เพราะไม่รู้ว่า request ไหนจะ win
- ต้องมี DB isolation level ที่ถูกต้อง (SERIALIZABLE) ไม่งั้น test ผ่านแต่ production พัง
- Seed data ใน beforeEach ไม่ใช่ beforeAll — เพื่อให้แต่ละ test เริ่มจาก clean state

**N concurrent requests:**
```typescript
// Test N requests simultaneously
const N = 5
const requests = Array.from({ length: N }, () =>
  apiService.deduct(request, { productId: 'P001', quantity: 1 })
)
const responses = await Promise.all(requests)
const statuses = responses.map(r => r.status()).sort()

// Only 1 should succeed (stock = 1)
expect(statuses.filter(s => s === 200)).toHaveLength(1)
expect(statuses.filter(s => s === 409)).toHaveLength(N - 1)
```

---

## PART 6: Advanced Contract Testing (Gems)

### 1. AJV Schema Validation (Full Body Contract)

Instead of checking field by field, validate the entire block using JSON Schema for 100% accuracy following COE standards.

```typescript
import { validateSchema } from '../../helpers/schema.validator';
import { userSchema } from '../../schemas/user/userSchema';

test('should match contract schema', async ({ request }) => {
  const response = await request.get('/api/user/me');
  const body = await response.json();
  
  // 💎 Gem: Validate entire body in one go using AJV
  validateSchema(body, userSchema);
});
```

### 2. Time Manipulation (Clock Mocking)

Used for testing time-dependent APIs like OTP expiry or Token expiration.

```typescript
test('should handle expired OTP', async ({ page, request }) => {
  // 💎 Gem: Freeze time
  await page.clock.install({ time: new Date('2024-01-01T10:00:00Z') });
  
  await request.post('/api/otp/send');
  
  // 💎 Gem: Fast forward 15 minutes
  await page.clock.fastForward('15:00');
  
  const res = await request.post('/api/otp/verify', { data: { code: '1234' } });
  expect(res.status()).toBe(400); // Should be expired
});
```

### 3. API Performance Assertions (Efficiency Gem)

Not just passing, but "fast enough" to prevent Performance Regression in CI/CD.

```typescript
test('should meet Response Time criteria @Performance', async ({ request }) => {
  const startTime = Date.now();
  const response = await request.get('/api/resource');
  const duration = Date.now() - startTime;
  
  expect(response.status()).toBe(200);
  // 💎 Gem: Enforce speed (Response must be < 500ms)
  expect(duration, `API is too slow! Took ${duration}ms`).toBeLessThan(500);
});
```

```typescript
// Or use retry mechanism
let response;
for (let i = 0; i < 3; i++) {
  try {
    response = await request.get('/api/data');
    if (response.ok()) break;
  } catch (error) {
    if (i === 2) throw error; // Last attempt
    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
  }
}
```

#### Issue 2: Rate Limiting

**Problem:** API is rate limited (429 Too Many Requests).

**Root Cause:**

- Calling API too frequently.
- No delay between requests.

**✅ Solution:**

```typescript
// Wait and retry upon encountering rate limit
async function apiCallWithRateLimit(request: APIRequestContext, endpoint: string) {
  const response = await request.get(endpoint);
  
  if (response.status() === 429) {
    const retryAfter = response.headers()['retry-after'];
    const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
    
    console.log(`Rate limited. Waiting ${waitTime}ms before retry...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    return await request.get(endpoint); // Retry once
  }
  
  return response;
}
```

#### Issue 3: Authentication Expired

**Problem:** Token expired (401 Unauthorized).

**Root Cause:**

- JWT Token expired.
- Session timeout.
- Invalid credentials.

**✅ Solution:**

```typescript
// Auto refresh token
async function apiCallWithAuth(helper: Helper, endpoint: string) {
  let response = await helper.request.get(endpoint);
  
  if (response.status() === 401) {
    console.log('Token expired. Refreshing...');
    
    // Refresh token
    const refreshResponse = await helper.auth.refreshToken();
    const { token } = await refreshResponse.json();
    helper.setAuthToken(token);
    
    // Retry with new token
    response = await helper.request.get(endpoint);
  }
  
  return response;
}
```

#### Issue 4: Data Validation Errors

**Problem:** API returns validation error (400 Bad Request).

**Root Cause:**

- Request body format incorrect.
- Missing required field.
- Data type incorrect.

**✅ Solution:**

```typescript
// Validate request data before sending
function validateUserData(userData: any): string[] {
  const errors: string[] = [];
  
  if (!userData.email || !userData.email.includes('@')) {
    errors.push('Invalid email format');
  }
  
  if (!userData.name || userData.name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  return errors;
}

test('should validate data before API call', async ({ request }) => {
  const userData = { email: 'invalid-email', name: 'A' };
  const validationErrors = validateUserData(userData);
  
  if (validationErrors.length > 0) {
    console.log('Validation errors:', validationErrors);
    // Fix data or skip test
    return;
  }
  
  const response = await request.post('/api/users', { data: userData });
  expect(response.status()).toBe(201);
});
```

#### 🔄 API Error Workflow (CoT)

```text
❌ Error: "API call failed with status 500"

💭 Analyze Root Cause (REASON):
1. 🔍 Check Status Code: 4xx (client) or 5xx (server)?
2. 🔍 Check Request Data: valid format and required fields?
3. 🔍 Check Authentication: token valid and not expired?
4. 🔍 Check Network: timeout or rate limit?

✅ Correct Solution (ACT):
// Log full request/response for debugging
console.log('Request:', { method, url, headers, body });
console.log('Response:', { status, headers, body });

// Implement appropriate retry/fallback strategy
```

### 3. Schema Validation

```typescript
// ✅ Validate response against schema
import Ajv from 'ajv';
import { userResponseSchema } from '../schemas/user/userSchema';

const ajv = new Ajv();
const validate = ajv.compile(userResponseSchema);

test('should return valid user schema', async ({ request }) => {
  const response = await request.get('/api/users/123');
  const responseBody = await response.json();
  
  const isValid = validate(responseBody);
  if (!isValid) {
    console.log('Schema validation errors:', validate.errors);
  }
  
  expect(isValid).toBe(true);
});
```

<a id="jsdoc-template"></a>

### 3. JSDoc Template

```typescript
/**
 * [Method description]
 * @param authToken - Token for authentication
 * @param userData - User data to be created
 * @returns API Response
 */
async createUser(authToken: string, userData: any): Promise<APIResponse> {
  // ...
}
```

<a id="logging-template"></a>

### 4. Logging Template

```typescript
console.log('=== API REQUEST ===');
console.log('Method: POST');
console.log(`URL: ${this.baseURL}/api/users`);
console.log('Body:', JSON.stringify(data, null, 2));
console.log('===================');

// ... API call ...

console.log('=== API RESPONSE ===');
console.log(`Status: ${response.status()}`);
console.log('Body:', await response.text());
console.log('====================');
```

---

## PART 7: HELPERS

### Helper Creation Guidelines

#### Naming Conventions

```typescript
// ✅ CORRECT - Files & Functions
helpers/hotel-management/hotelManagementHelper.ts
function getUserData() { }  // lowerCamelCase

// ✅ CORRECT - Classes
class ApiHelper { }         // PascalCase
class UserService { }       // PascalCase

// ✅ CORRECT - Constants (MANDATORY)
const BASE_URL = 'https://api.example.com';  // SCREAMING_SNAKE_CASE
const API_KEY = 'abc123';                    // SCREAMING_SNAKE_CASE
const MAX_RETRY = 3;                         // SCREAMING_SNAKE_CASE

// ❌ WRONG
helpers/hotel/helper.ts           // Unclear
const baseUrl = 'https://...';   // lowerCamelCase (Wrong)
const ApiKey = 'abc123';         // PascalCase (Wrong)
```

#### File Structure

**Rules:**

- `[SYSTEM_FEATURE_CAMEL]Helper.ts` — **Always Mandatory** as main entry point (Helper).
- Sub-files — Create when domain logic exceeds 10 methods or is reused across tests.
- File names must clearly represent the domain.

Refer to structure in **[PART 1: Overview](#📁-project-structure-api-testing)** which covers Simple, Medium, and Complex cases for consistency and easier maintenance.

### API-Specific Helper Patterns

#### 1. Response Validation Helper

```typescript
// helpers/shared/responseValidator.ts
export class ResponseValidator {
  static async validateStatus(response: APIResponse, expectedStatus: number): Promise<void> {
    expect(response.status()).toBe(expectedStatus);
  }
  
  static async validateHeaders(response: APIResponse, expectedHeaders: Record<string, string>): Promise<void> {
    const headers = response.headers();
    for (const [key, value] of Object.entries(expectedHeaders)) {
      expect(headers[key]).toContain(value);
    }
  }
  
  static async validateJsonSchema(response: APIResponse, schema: any): Promise<void> {
    const responseBody = await response.json();
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const isValid = validate(responseBody);
    
    if (!isValid) {
      console.log('Schema validation errors:', validate.errors);
    }
    
    expect(isValid).toBe(true);
  }
}
```

#### 2. Mock Data Generator

```typescript
// helpers/shared/mockDataGenerator.ts
export class MockDataGenerator {
  static generateUser(overrides: Partial<User> = {}): User {
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      createdAt: new Date().toISOString(),
      ...overrides
    };
  }
  
  static generateOrder(overrides: Partial<Order> = {}): Order {
    return {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'user123',
      amount: 100.00,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...overrides
    };
  }
  
  static generateBulkUsers(count: number): User[] {
    return Array.from({ length: count }, (_, index) => 
      this.generateUser({ name: `Test User ${index + 1}` })
    );
  }
}
```

#### 3. API Test Helper

```typescript
// helpers/shared/apiTestHelper.ts
export class APITestHelper {
  static async waitForAsyncOperation(helper: Helper, operationId: string, maxWaitTime = 30000): Promise<any> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      const response = await helper.operations.getStatus(operationId);
      const { status, result } = await response.json();
      
      if (status === 'completed') {
        return result;
      } else if (status === 'failed') {
        throw new Error(`Operation ${operationId} failed`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    }
    
    throw new Error(`Operation ${operationId} timed out after ${maxWaitTime}ms`);
  }
  
  static async retryApiCall<T>(apiCall: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await apiCall();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        
        console.log(`API call failed, retrying in ${delay}ms... (${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1))); // Exponential backoff
      }
    }
    
    throw new Error('Max retries exceeded');
  }
  
  static logApiCall(method: string, url: string, requestData?: any, responseData?: any): void {
    console.log('=== API CALL LOG ===');
    console.log(`${method.toUpperCase()} ${url}`);
    if (requestData) console.log('Request:', JSON.stringify(requestData, null, 2));
    if (responseData) console.log('Response:', JSON.stringify(responseData, null, 2));
    console.log('====================');
  }
}
```

<a id="jsdoc-template-2"></a>

### JSDoc Template

```typescript
/**
 * [Method description]
 * @param authToken - Token for authentication
 * @param userData - User data to be created
 * @returns API Response
 */
async createUser(authToken: string, userData: any): Promise<APIResponse> {
  // ...
}
```

<a id="logging-template-2"></a>

### Logging Template

```typescript
console.log('=== API REQUEST ===');
console.log('Method: POST');
console.log(`URL: ${this.baseURL}/api/users`);
console.log('Headers:', JSON.stringify(headers, null, 2));
console.log('Body:', JSON.stringify(data, null, 2));
console.log('===================');

// ... API call ...

console.log('=== API RESPONSE ===');
console.log(`Status: ${response.status()}`);
console.log('Headers:', JSON.stringify(response.headers(), null, 2));
console.log('Body:', await response.text());
console.log('====================');
```

---

## PART 8: API Schema Definition

### 🎯 Purpose

Define API Request/Response structure using JSON Schema.

**⚠️ Advanced Validation:** See `@automationIndex.json` → `validation` → `apiResponseValidator`.

---

### 1️⃣ Basic Schema Structure

**📁 File: schemas/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[SYSTEM_FEATURE_CAMEL]Schema.ts**

```typescript
// Request Schema
export const createDocumentRequestSchema = {
  type: 'object',
  required: ['title', 'type', 'status'],
  properties: {
    title: { type: 'string' },
    type: { type: 'string' },
    status: { type: 'string' },
    description: { type: 'string' },
    attachments: { type: 'array', items: { type: 'string' } }
  }
};

// Response Schema
export const createDocumentResponseSchema = {
  type: 'object',
  required: ['documentId', 'title', 'type', 'status', 'createdAt'],
  properties: {
    documentId: { type: 'string' },
    title: { type: 'string' },
    type: { type: 'string' },
    status: { type: 'string' },
    createdAt: { type: 'string' },
    createdBy: { type: 'string' }
  }
};

// List Response Schema
export const getDocumentsResponseSchema = {
  type: 'object',
  required: ['items', 'total', 'page', 'limit'],
  properties: {
    items: { type: 'array', items: createDocumentResponseSchema },
    total: { type: 'number' },
    page: { type: 'number' },
    limit: { type: 'number' }
  }
};

// Error Response Schema
export const errorResponseSchema = {
  type: 'object',
  required: ['error', 'message', 'statusCode'],
  properties: {
    error: { type: 'string' },
    message: { type: 'string' },
    statusCode: { type: 'number' },
    details: { type: 'array', items: { type: 'string' } }
  }
};
```

---

### 2️⃣ Optional: Advanced Validation

**If additional Validation Rules are needed:**

```typescript
// Advanced Schema (Optional)
export const createDocumentRequestSchema = {
  type: 'object',
  required: ['title', 'type', 'status'],
  properties: {
    title: { 
      type: 'string', 
      minLength: 1,        // Optional
      maxLength: 255       // Optional
    },
    type: { 
      type: 'string',
      enum: ['timesheet', 'approval', 'report']  // Optional
    },
    status: { 
      type: 'string',
      enum: ['draft', 'pending', 'approved']     // Optional
    },
    createdAt: { 
      type: 'string',
      format: 'date-time'  // Optional: email, date-time, uri, uuid
    }
  }
};
```

**📚 Validation Reference:** `@apiIndex.json` → `validation` → `apiResponseValidator.template.ts`.

---

### 3️⃣ Common Patterns

```typescript
// Pagination
export const paginationSchema = {
  type: 'object',
  required: ['items', 'total', 'page', 'limit'],
  properties: {
    items: { type: 'array' },
    total: { type: 'number' },
    page: { type: 'number' },
    limit: { type: 'number' }
  }
};

// Success Response
export const successResponseSchema = {
  type: 'object',
  required: ['success', 'message'],
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: { type: 'object' }
  }
};
```

---

## PART 9: Infrastructure & Scripts Standard (package.json)

### 📦 Package.json Scripts Generation

### 🎯 Script Format Standard

**MANDATORY: All generated scripts MUST follow this exact format:**

```text
api:[environment]:[SYSTEM_FEATURE_KEBAB]:[mode]
```

#### 📝 Format Components

1. **environment**: `sit` | `uat`
2. **feature**: `[SYSTEM_FEATURE_KEBAB]` (kebab-case, matches folder name e.g., `user-management`)
3. **mode**: `cliMode` | `guiMode`

### ✅ Correct Script Examples

```json
{
  "scripts": {
    "api:sit": "cross-env LANG=th ENV=sit playwright test --config=playwright.config.api.ts --reporter=list",
    "api:uat": "cross-env LANG=th ENV=uat playwright test --config=playwright.config.api.ts --reporter=list",
    "api:sit:user-management:cliMode": "cross-env LANG=th ENV=sit playwright test --config=playwright.config.api.ts --reporter=list tests-api/user-management/",
    "api:sit:user-management:guiMode": "cross-env LANG=th ENV=sit playwright test --config=playwright.config.api.ts --ui tests-api/user-management/",
    "api:uat:user-management:cliMode": "cross-env LANG=th ENV=uat playwright test --config=playwright.config.api.ts --reporter=list tests-api/user-management/",
    "api:uat:user-management:guiMode": "cross-env LANG=th ENV=uat playwright test --config=playwright.config.api.ts --ui tests-api/user-management/"
  }
}
```

### 🏗️ Script Generation Rules

#### 1. Environment Variables

```bash
# SIT Environment
cross-env LANG=th ENV=sit

# UAT Environment
cross-env LANG=th ENV=uat
```

> **⚠️ cross-env:** Required for cross-platform compatibility (Windows/macOS/Linux). Install via `npm install -D cross-env`.

#### 2. Configuration File

```bash
# API Tests ALWAYS use:
--config=playwright.config.api.ts
```

#### 3. Test Directory

```bash
# API Tests
tests-api/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/
```

#### 4. Mode Options

```bash
# CLI Mode (Default)
playwright test [options] --reporter=list

# GUI Mode (Interactive)
playwright test [options] --ui
```

### 🚨 Generation Requirements

#### MANDATORY Requirements

1. **Always generate BOTH environments** (sit + uat) for every feature.
2. **Always generate BOTH modes** (cliMode + guiMode) for every feature.
3. **Follow exact naming format** - `api:[env]:[SYSTEM_FEATURE_KEBAB]:[mode]`.
4. **Use correct config file** (`playwright.config.api.ts`).
5. **Include LANG=th and ENV variable** in every script.
6. **Always prefix with `cross-env`** for cross-platform compatibility.

---

## PART 10: Performance & Reliability

### 1. Global Authentication (Storage State)

**DO:** Use `playwright.setup.ts` to login once and reuse `storageState.json` to avoid repeating login in every test case.

### 2. Parallel Execution Strategy

```typescript
// playwright.config.api.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests-api',
  fullyParallel: true,          // Run all tests in parallel
  workers: process.env.CI ? 4 : 2,
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: { 'Accept': 'application/json' }
  },
  projects: [
    { name: 'setup', testMatch: '**/api.setup.ts' },
    {
      name: 'api',
      dependencies: ['setup'],
      use: { storageState: 'playwright/.auth/api-token.json' }
    }
  ]
});
```

**Parallel Rules:**

- Each test must create/delete its own data (do not share state).
- Use unique identifiers like `Date.now()` or `uuid` in test data.
- Database cleanup must be done in `afterEach`, not `afterAll`.

### 3. CI/CD Optimization

- Parallelism: Ensure tests are independent to run in parallel efficiently.

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
npm run api:sit:feature1:cliMode    # Run Feature 1 on SIT in CLI mode
npm run api:uat:feature1:cliMode    # Run Feature 1 on UAT in CLI mode
```

**Playwright Specific Commands:**

```bash
npx playwright test tests-api/[system-kebab]/[feature-kebab]/  # Run specific folder
npm run report                                         # Open HTML Report
```

## PART 12: Quick Reference

### ✅ DO's

- Always use async/await.
- Include [ID-xxxx] in `test.describe`.
- Include [TC-xxxx] or [TCXXXXX] in test names.
- **MANDATORY: Add @Feature, @Important, and @Scenario tags to EVERY test.**

```typescript
// ✅ CORRECT - Tags format
test('[TC-XXXX] should create user @Feature @Important @Scenario', async ({ request }) => {});

// Or use test.info().annotations
test('[TC-XXXX] should create user', async ({ request }) => {
  test.info().annotations.push(
    { type: 'Feature', description: 'User Management' },
    { type: 'Important', description: 'Critical' },
    { type: 'Scenario', description: 'Happy Path' }
  );
});
```

- Log API requests/responses (`console.log`).
- Follow AAA pattern (Arrange, Act, Assert).
- Use specific assertions (`toBeVisible`, `toHaveURL`).
- Organize imports properly.

### ❌ DON'Ts

- Skip testcase IDs in test names.
- Skip ID IDs in `test.describe`.
- **NEVER skip @Feature, @Important, and @Scenario tags.**
- Use generic assertions (`toBeTruthy`).
- Skip request/response logging.
- Use unclear variable names.
- Mix different naming conventions.

---

## Auth / Token Rules

- Token acquisition must be straightforward — call login endpoint, extract token, store in `process.env`
- Never over-engineer token management (no complex refresh logic, no interceptors, no middleware)
- If pipeline fails on auth → compare with working project's config before changing auth code
- Pipeline: credentials from `.env` only (no pipeline variables)
