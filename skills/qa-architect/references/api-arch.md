# API Automation Architecture

Design the file structure and service layer for API test automation using Playwright.

## When to use
- Designing API automation for a new feature
- After asset discovery and database strategy are done

## Process
1. Read implementation plan — extract test cases, DB strategy, existing assets, templates found
2. **Reuse API knowledge** — check `knowledge/arch/{feature}-api-spec.md` first (if it exists). If it exists, read endpoint/schema data straight from there instead of re-deriving from scratch
3. Read coding rules from `playwright-rules` skill (api.md + pw-coding-standards.md) — ALL parts
4. Analyze requirements (CoT) — count endpoints, group by domain, check DB integration, determine complexity
5. Generate patterns (LATS) — simulate 3-4 architectures, score on reusability/maintainability/compliance, select hybrid
6. Validate design — check against all coding standards (Constitutional AI)
7. Self-reflect — test isolation? over-engineering? unverified assumptions about API or DB?
8. Generate architecture — services, file structure, schema mapping, test structure blueprint, compliance checklist

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
schemas/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Schema.ts    — JSON schemas (AJV)
fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Data.ts     — test data
```
- Folders: kebab-case. Files: lowerCamelCase
- MUST use 2-level structure: `[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/` — never flat
  - ❌ WRONG: `helpers/shopee/shopeePaymentHelper.ts`
  - ✅ CORRECT: `helpers/shopee/shopee-payment/shopeePaymentHelper.ts`

## Key rules
- Multi-Service pattern — separate services by business domain
- All endpoints need schema validation (AJV)
- Auth: globalSetup login-once per role, re-login only when role differs; fail cases use different parameters, not re-login
- SIT as default environment
- No inline logic, no hard waits, no hardcoded credentials

## Template Integration from Discovery
If Resources Discovery found existing templates/patterns:
1. Extract reusable templates (AuthService, BasePage, DbService patterns)
2. Import shared utilities: `import { AuthService } from '../../shared/authService'`
3. Extend rather than duplicate — add feature-specific methods to base classes

## Shared Fixtures Detection (Cross-Layer)
When a feature has tests across multiple layers (API + Web UI + Mobile):
1. Detect: check if feature has test scenarios for more than 1 platform
2. Create shared-fixtures structure:
```text
tests/shared-fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/
├── [systemFeature]SharedData.ts    — business data used by all layers
├── web/                            — web-specific shared data
└── mobile/                         — mobile-specific shared data
```
3. What goes in shared-fixtures: business data, auth tokens, seed data results
4. What stays in layer-specific fixtures: viewport sizes, device capabilities, request headers

## Schema Consistency Check
MUST run after logical design and before test script design (skip if `knowledge/arch/{feature}-api-spec.md` already exists — schema already captured):
1. Extract API schema — list all request/response fields per endpoint with types
2. Extract DB schema — list all columns per table with types
3. Compare and report mismatches (missing fields, type mismatches, constraint mismatches)
4. Fix mismatches before proceeding
5. Write result to `knowledge/arch/{feature}-api-spec.md` — sections: `## Endpoints` (method + path + auth), `## Request/Response Schema` (per endpoint, with types), `## Error Cases` (status codes + conditions), `## Status` (`assumed` or `verified` — see Mock-API Prefix Rule below)

## Mock-API Prefix Rule (Backend Not Ready)

If a feature's real backend doesn't exist yet, don't block API test design on it — point `ApiService` at a mock endpoint under a `mock-api/` prefix (e.g. `/mock-api/orders` served by a local mock server/msw/json-server) instead of the real path (`/api/orders`), derived from the intended contract (frontend calls, design notes). Mark `knowledge/arch/{feature}-api-spec.md`'s `## Status` section `assumed` so it's visually distinct from a confirmed-real design.

When the real backend lands: swap the endpoint prefix from `mock-api/` to the real path, re-run Schema Consistency Check against it, fix mismatches, then flip `## Status` to `verified`. Never leave a test asserting an exact schema against an `assumed` endpoint without that status traveling into the test file header as a TODO.

## Test Structure Blueprint
Generate a blueprint mapping test cases to services:
```text
describe('[Feature] API Tests', () => {
  beforeAll: AuthService.login() → storageState
  beforeEach: DbService.seed(testId)
  afterEach: DbService.cleanup(testId)

  TC-001 (Create): ApiService.create() → verify response + DB
  TC-002 (Read): ApiService.getById() → verify schema
  TC-003 (Update): ApiService.update() → verify response + DB
  TC-004 (Delete): ApiService.delete() → verify cleanup
  TC-005 (Validation): ApiService.create(invalid) → verify 400
})
```
Tags: `@Feature:[name]`, `@Important:[level]`, `@Scenario:[type]`

## LATS Forbidden Patterns
- ❌ Single-service monolith
- ❌ Hard-coded locators/credentials
- ❌ Missing Storage State strategy
- ❌ Missing Error Simulation
- ❌ Patterns ignoring DB Strategy

## Approval
Show architecture summary to user and wait for explicit approval before coding.
