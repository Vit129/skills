# API Automation Architecture

Design the file structure and service layer for API test automation using Playwright.

## When to use
- Designing API automation for a new feature
- After asset discovery and database strategy are done

## Process
1. Read implementation plan — extract test cases, DB strategy, existing assets
2. Read coding rules from `playwright-rules` skill (api.md + coding-standards.md)
3. Analyze requirements (CoT) — count endpoints, group by domain, check DB integration
4. Generate patterns (LATS) — simulate 3-4 architectures, select hybrid
5. Validate design — check against all coding standards
6. Self-reflect — test isolation? over-engineering? unverified assumptions?
7. Generate architecture — services, file structure, schema mapping, compliance checklist

## Architecture pattern: Multi-Service
```text
[Feature]Helper (Main Controller)
├── [Feature]DbService (Database: seed/verify/cleanup)
├── AuthService (Shared: login/token)
├── [Feature]ApiService (Domain: CRUD endpoints)
└── Workflows (High-level: loginAndCreate, verifyAndCleanup)
```

## File structure
```text
helpers/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Helper.ts     — main controller
helpers/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[domain]Service.ts           — domain services
tests-api/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature].spec.ts   — test specs
schemas/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Schema.ts    — JSON schemas
fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Data.ts     — test data
```
- `[SYSTEM_KEBAB]` = system name in kebab-case (e.g., `shopee`)
- `[SYSTEM_FEATURE_KEBAB]` = feature name in kebab-case (e.g., `shopee-payment`)
- `[systemFeature]` = feature name in lowerCamelCase (e.g., `shopeePayment`)
- MUST follow this structure — do not flatten or skip levels
fixtures/[system]/[feature]/[feature]Data.ts      — test data
schemas/[system]/[feature]/[feature]Schema.ts     — AJV schemas
tests-api/[system]/[feature]/[feature].spec.ts    — test specs
```

## Key rules
- Folders: kebab-case. Files: lowerCamelCase
- Multi-Service pattern — separate services by business domain
- All endpoints need schema validation (AJV)
- Auth: globalSetup login-once per role, re-login only when role differs
- SIT as default environment

## Test Structure Blueprint

Generate a blueprint that maps test cases to services:

```text
describe('[Feature] API Tests', () => {
  // Lifecycle
  beforeAll: AuthService.login() → storageState
  beforeEach: DbService.seed(testId)
  afterEach: DbService.cleanup(testId)

  // Test Cases → Service Mapping
  TC-001 (Create): ApiService.create() → verify response + DB
  TC-002 (Read): ApiService.getById() → verify schema
  TC-003 (Update): ApiService.update() → verify response + DB
  TC-004 (Delete): ApiService.delete() → verify cleanup
  TC-005 (Validation): ApiService.create(invalid) → verify 400
})
```

Tags: `@Feature:[name]`, `@Important:[level]`, `@Scenario:[type]`

## Template Integration from Discovery

If Resources Discovery found existing templates/patterns:
1. Extract reusable templates (AuthService, BasePage, DbService patterns)
2. Import shared utilities: `import { AuthService } from '../../shared/authService'`
3. Extend rather than duplicate — add feature-specific methods to base classes

## Shared Fixtures Detection (Cross-Layer)

When a feature has tests across multiple layers (API + Web UI + Mobile):

1. **Detect:** Check if feature has test scenarios for more than 1 platform
2. **Create shared-fixtures structure:**
```text
tests/shared-fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/
├── [systemFeature]SharedData.ts    — business data used by all layers
├── web/                            — web-specific shared data
└── mobile/                         — mobile-specific shared data
```
3. **What goes in shared-fixtures:**
   - Business data: search keywords, codes, IDs used across API + UI tests
   - Auth tokens: storageState shared between API setup and UI tests
   - Seed data results: IDs created by API that UI tests need to verify
4. **What stays in layer-specific fixtures:**
   - UI-specific: viewport sizes, browser settings
   - Mobile-specific: device capabilities, platform locators
   - API-specific: request headers, schema definitions

## Approval
Show architecture summary to user and wait for explicit approval before coding.
