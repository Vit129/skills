# Playwright Testing - Global Coding Standards (Constitution)

> **⚠️ CRITICAL:** This file is the **"Constitution"** (Global Master Rules).
> **🎯 Purpose:** Core rules and strategies that AI Agents must use for decision-making and quality control across all dimensions.

---

## PART 1: AI Governance & Behavior

### 1. AI Roles & Perspectives (Core Methodology)

When assigned a task, always analyze through these 4 perspectives:

- **🏗️ Architect:** Plan file structures (Folder Structure) and design flexible Shared Helpers.
- **👨‍💻 Developer:** Write Clean Code, use English for Test names (or as instructed), and handle errors systematically.
- **⚖️ Reviewer:** Verify compliance with CRITICAL RULES and data security.
- **⚡ Performance:** Prioritize API Setup over UI Setup (Hybrid Testing) for execution speed.

### 2. Communication Protocol (Interaction Rules)

- **CoT (Chain-of-Thought):** Always analyze the Root Cause before fixing and propose alternatives (LATS).
- **Ask Before Write:** **MUST** request confirmation before creating or modifying files, specifying the file path and rationale.
- **Language Policy:** Technical documentation and code MUST be in English. Use Thai only for user-facing messages or when specifically requested.

---

## PART 2: Automation Strategy (Decision Strategy)

### 1. Automation Priority Table

Agents must verify priority and create automation according to this order (referenced from @testScenario2026.md):

| Priority | API Automation | Web UI Automation | Strategy |
| :--- | :--- | :--- | :--- |
| **Critical** | ✅ Mandatory | ✅ Mandatory | Immediate Action (E2E Full Coverage) |
| **High** | ✅ Mandatory | ✅ Mandatory | Immediate Action (Focus on Core Flows) |
| **Medium** | ✅ Mandatory | ⚠️ Optional | Complete API coverage first; UI is secondary |
| **Low** | ✅ Mandatory | 🚫 Skip | API only to define scope |

### 2. Hybrid Execution Strategy

- **Setup/Teardown:** Use API for data preparation (Set up data) even for UI testing.
- **⚡ High-Speed Auth (MANDATORY):** Avoid UI-based login in every test case. Use API `POST /login` to obtain a Token and generate `storageState` to reduce test execution time (except for tests specifically designed to validate the Login page).
- **♻️ Shared Fixtures (MANDATORY):** Business data used in both API and Web UI tests (e.g., search keywords, codes) MUST be stored in `tests/shared-fixtures/` to ensure a single source of truth.
- **Single Source of Truth:** Test data must come from JSON or `.ts` data files only. Never hardcode data in Spec files.

---

## PART 3: Global Restrictions (Strict Rules)

1. **✅ Use .env for Config:** Use `.env` to store Configuration (URL, Credentials) **separated by environment (.env, .env.local, .env.sit, .env.uat)**.
   - **Sensitive data (MUST be in .env):** credentials, tokens, passwords, secrets, emails used for login, API keys, OAuth URLs (e.g., Microsoft login URL)
   - **Non-sensitive data (MUST be in .ts fixture):** business data such as companyCode, customerCode, invoiceNumber, productCode, project-level username/role identifiers, etc.
   - **⚠️ Rule:** `process.env.X` in fixture files is allowed ONLY for sensitive data. Business data must be hardcoded in fixture, not read from `.env`.
   - **⚠️ Double Login Rule:** When a feature requires 2 login layers (e.g., Microsoft SSO + project-level auth), SSO credentials/URL go in `.env`; project-level user identifiers (username, role, companyCode) go in `fixtures/`.
2. **✅ Use .ts for Test Data:** Use `.ts` files for Test Data **separated by environment**.
   - **Folder:** kebab-case (all lowercase with hyphens) e.g., `fixtures/shopee-payment/`.
   - **File Naming:** lowerCamelCase (starts with lowercase, no hyphens) e.g., `shopeePaymentData.ts`.
3. **🚫 No Inline Logic:** Do not write logic to find elements or call APIs directly in `.spec.ts` files. **Must always go through POM/Helper.**
4. **🚫 No Hard Wait:** Never use `waitForTimeout()`. Use Smart Wait or Web-First Assertions instead.
5. **🏷️ Mandatory Tags:** Every Test file and Test Case must have 2 levels of Tags (`@Important`, `@Scenario`).
6. **📁 Shared Fixtures Location:** For cross-layer data (API + UI), use `tests/shared-fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/`.
7. **🌐 English Naming:** `test.describe()` and `test()` names must be in clear, easy-to-understand English.
8. **🚀 Test Independence:** Test Scenarios must be designed to be Independent, not sharing state or relying on results from other tests, to support Playwright's Parallel execution.

---

## PART 4: Shared Standard Utilities

### 1. File & Data Handling

Use `.env` for Configuration and `.ts` for Test Data:

```typescript
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load Environment Config
dotenv.config({ path: `.env.${process.env.ENV || 'sit'}` });

// Load Test Data from .ts
import testData from '../fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[SYSTEM_FEATURE_CAMEL]Data';
```

### 2. Standard Helper Patterns

- **Random Data:** Use `Date.now()` or `Math.random()` for Dynamic Input (like reference numbers).
- **Status/Response Validation:** Every API call must include standard Status Code and Schema checks.
- **🏗️ Component-Based Pattern:** For common UI parts (Sidebar, TopNav, Modal), separate into a `Component` class and call it within the Page Object instead of duplicating code.
- **🚀 Worker-Scoped Fixtures:** For Data creation or resource-intensive tasks (e.g., Connect DB, Create Master Data), use `scope: 'worker'` to run once per Worker, significantly reducing total test time.

---

## PART 5: Reference Links

For in-depth practical implementation (Technical Details), follow the Domain Rules:

- 🌐 **UI Standards:** `@ai-agent/rules/playwright/webUi.md`
- 🔌 **API Standards:** `@ai-agent/rules/playwright/api.md`
