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

## Approval
Show architecture summary to user and wait for explicit approval before coding.
