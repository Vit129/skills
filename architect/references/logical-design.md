# Logical Design

Transform domain design into technical specifications: API contracts, DB schemas, and frontend specs.

## When to use

- After domain design
- Need technical specifications before implementation or test case design

## How it works

1. **Map user stories to technical components** — API endpoints, UI components, data models. Mark MVP vs future
2. **Design backend per endpoint:**
   - Method, path, purpose, user story reference
   - Request schema with validation rules
   - Success response schema
   - Error responses (400, 401, 403, 404, 409, 500)
   - Sequence diagram (mermaid)
   - Test case checklist (success + error cases)
3. **Design data models** — entities, relationships, constraints
4. **Design frontend per user story** — components, forms, navigation, state management

## Output per endpoint

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

## Rules

- Full coverage — no orphan user stories
- Both backend AND frontend must be specified
- MVP scope must be explicit
