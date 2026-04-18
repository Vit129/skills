# Room: Standards Update — 2026-04-09

## What Changed

### New Cross-Platform Standards (frontend-dev)
- `testability-standards.md` — data-testid/accessibilityIdentifier for React/Flutter/Android/iOS
- `ui-states-standards.md` — Loading/Empty/Error/Success states
- `error-handling-standards.md` — AppError pattern all platforms
- `env-config-standards.md` — .env per environment
- `logging-standards.md` — structured JSON logs
- `navigation-standards.md` — route naming + deep links

### New Cross-Language Standards (backend-dev)
- `error-handling-standards.md` — AppError + error codes
- `logging-standards.md` — Winston/structlog
- `env-config-standards.md` — Zod/pydantic-settings validation at startup
- `validation-standards.md` — Zod/class-validator/Pydantic at edge

### Locator Strategy (KEY DECISION)
- Pattern: `getByTestId` (scope) + `getByRole({ name: L.keyName })` (target)
- Labels.ts: `fixtures/[system]/[feature]/[feature]Labels.ts` with `{ th: {}, en: {} }`
- Mobile: `[feature]Labels.yaml` with same structure
- Files updated: web-ui.md, web-arch.md, workflow.md, recorder.md, SKILL.md, test-script-template.md, testability-standards.md, mobile-arch.md, robotframework workflow+SKILL, aidlc workflow, automation-save.md

### Workflow Fixes
- `qa-task-design.md` Next Phase: was → azure-devops-sync, now → workflow.md routing table
- `workflow.md` audit format: added "Skills Used" column (mandatory)
- `playwright-testing/workflow.md`: added playwright-cli to Visual-First Debugging

### logical-design.md
- Added data-testid Specification section — mandatory for Client Application

## Temporal Triples
- (locator-strategy, is, getByTestId+getByRole-hybrid) [2026-04-09 - ]
- (Labels.ts, required-for, web-ui-tests) [2026-04-09 - ]
- (qa-task-design-next-phase, points-to, workflow-routing-table) [2026-04-09 - ]
- (audit.md, must-include, skills-used-column) [2026-04-09 - ]
