# Logical Design

Transform domain design into technical specifications: service contracts, data storage schemas, and client application specs.

## When to use

- After domain design
- Need technical specifications before implementation or test case design

## How it works

1. **Map user stories to technical components** — service endpoints, UI components, data models. Mark MVP vs future
2. **Design server logic per endpoint/function:**
   - Method, path/trigger, purpose, user story reference
   - Request schema with validation rules
   - Success response schema
   - Error responses (400, 401, 403, 404, 409, 500)
   - Sequence diagram (mermaid)
   - Test case checklist (success + error cases)
3. **Design data storage** — entities, relationships, constraints (SQL tables, NoSQL collections, spreadsheet tabs, etc.)
4. **Design client application per user story** — components, forms, navigation, state management

## Multi-Platform Projects

When project has multiple client platforms (e.g., Web + Mobile):

1. **Shared specs** — API contracts and data storage are shared across platforms (design once)
2. **Platform-specific specs** — each platform gets its own client application section:

```text
## Client Application — Web (React)
- Components: [list per user story]
- Pages: [list per user story]
- State management: [approach]
- Responsive breakpoints: [if applicable]

## Client Application — Mobile (Flutter/React Native)
- Screens: [list per user story]
- Navigation: [stack/tab structure]
- Platform differences: [iOS vs Android specifics]
- Offline support: [if applicable]
```

3. **Cross-platform shared logic** — identify reusable logic (validation rules, business calculations, API calls) that should be shared or duplicated
4. **Test implications** — note which features need testing on which platforms (API-only, Web-only, Mobile-only, or all)

## Adapt to project type

| Project Type | Server Logic | Data Storage | Client Application |
|---|---|---|---|
| Traditional (REST + SQL) | API endpoints | DB schemas + migrations | React/Vue/Angular components |
| Serverless (Cloud Functions) | Function triggers | NoSQL / managed DB | Web or mobile components |
| Spreadsheet-backed | Spreadsheet tab structure | Web components + LocalStorage |
| Frontend-only | External API calls | LocalStorage / IndexedDB | SPA components |

Use the row that matches your project. Skip sections that don't apply (e.g., no server logic for frontend-only).

## Output per endpoint/function

```text
POST /api/[resource]
- Purpose: [what it does]
- Story: US-001
- Request: { field1: string (required), field2: number }
- Success: 201 { id, field1, field2, createdAt }
- Errors: 400 (validation), 401 (unauthorized), 409 (duplicate)
- Test checklist: [happy path, validation, not found, duplicate, boundary]
```

## Completeness checklist

- Every user story has technical specs
- Every API endpoint has request/response contracts
- Every endpoint has a test case checklist
- Every endpoint has a sequence diagram
- Frontend components specified for all user interactions
- MVP scope clearly defined

## Sensitive Data Classification (mandatory at this phase)

Before implementation, classify every data field:

| Category | Location | Examples |
|---|---|---|
| Sensitive → `.env` | Environment variables | Credentials, tokens, passwords, API keys, login emails |
| Non-sensitive → fixture | Hardcoded in test data files | companyCode, customerCode, invoiceNumber, productCode |

Rule: `process.env.X` in fixture is allowed ONLY for sensitive fields. Business data must be hardcoded in fixture, NOT read from `.env`.

## Client Application — data-testid Specification (Mandatory)

Every component in the Client Application section **MUST** include a `data-testid` map so dev and QA are aligned before implementation.

### Format

```text
## Client Application — Web (React)

### Components & testIds
// [ComponentName]
data-testid="[component-root]"
data-testid="[action-element]"
data-testid="[result-element]-{id}"   ← use {id} for dynamic lists
```

### Rules
- testId names use kebab-case
- Dynamic items must include `{id}` or `{type}` placeholder
- Every button, input, result list, status indicator, and modal must have a testId
- QA uses these testIds directly in `getByTestId()` — names must match exactly
- Dev must implement these testIds in React components before QA can run Web UI tests
- If testId needs to change after design, both dev and QA must agree and update together

### Example

```text
// FlightSearchWidget
data-testid="flight-search-form"
data-testid="trip-type-selector"
data-testid="btn-search-flights"

// FlightResultList
data-testid="flight-result-list"
data-testid="flight-result-item-{id}"
data-testid="btn-select-flight-{id}"

// BookingConfirmation
data-testid="booking-confirmation"
data-testid="booking-qr-code"
data-testid="booking-status"
```

## Rules

- Full coverage — no orphan user stories
- Both server logic AND client application must be specified (skip server logic only if frontend-only project)
- MVP scope must be explicit
- Client application section MUST include data-testid map for all components
