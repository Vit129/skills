# Logical Design

**Objective**: Transform domain design into technical implementation specifications
**Focus**: Technology stack, API contracts, data persistence, and integration patterns

## Entry Point Requirements
**Can start this phase if:**
- [ ] `user-stories.md` exists
- [ ] `domain-decomposition.md` exists
- [ ] Domain design is completed for target context
- [ ] Domain entities and business rules are defined
- [ ] Repository interfaces are specified

**Missing Prerequisites Handling:**
- Guide the user to complete missing phases first
- Offer to create a minimal domain design if missing
- Validate domain model completeness before proceeding

## Required Context from Previous Phases

- **From 1.1**: User stories and non-functional requirements from `user-stories.md`
- **From 1.2**: Architecture decisions and bounded context definitions from `domain-decomposition.md`
- **From 2.1**: Domain entities, value objects, and business rules from `domain_design.md`

## CRITICAL SUCCESS CRITERIA

- Must cover ALL user stories from requirements (step 1.1)
- Must align with bounded context responsibilities (step 1.2)
- Must implement domain entities from domain design (step 2.1)
- Must include BOTH backend AND frontend specifications
- Must define MVP scope clearly (what's in, what's out)
- Must be runnable and testable locally first
- Must have a sequence diagram for all API specifications
- Must have API test case checklist coverage for each API endpoint

## Technical Requirements Source Priority

1. **First**: Check `/docs/technical-requirements.md` for technical constraints and decisions
2. **Second**: Check project root `technical-requirements.md`
3. **Third**: If no file is found, ask comprehensive questions below

## Process

- If technical-requirements.md exists: Read, analyze, and incorporate solutions into the logical design
- **Cross-reference**: Map each user story to technical components (API endpoints, UI screens, data models)
- **Validate completeness**: Ensure all domain entities have corresponding technical specifications
- Generate a logical design document that aligns with technical requirements
- If technical-requirements.md is missing: Ask comprehensive questions to gather technical decisions

## Architecture-Specific Approach

### Microservices - Context Selection and Design

**Context Selection (No Decision File)**:
- **If coming from Domain Design**: Continue with the same context that was just completed
- **If starting fresh**: Ask the user directly which bounded context to design
- **Present options** with recommended priority if multiple contexts are available
- **Wait for user selection** - User responds with context name or number
- **Simple workflow choice — no file needed** - This is a simple workflow choice

**File Generation**:
- **Note the design choice in `audit.md`** for the selected bounded context only
- **Create logical design plan file** for the selected bounded context
- **Execute logical design** for the selected bounded context
- **File naming**: `logical-design-{context-name}.md`
- **Location**: `agent-memory/plans/[feature]/outputs/construction/{context-name}/logical-design.md`

**Context Completion**:
After completing one context, continue with the next bounded context (repeat logical design):

### Monolith Architecture
- **Create single logical design file** covering all bounded contexts
- **File naming**: `logical-design.md`
- **Location**: `agent-memory/plans/[feature]/outputs/construction/logical-design.md`
- **Structure**: Organize by bounded context sections within the single file

## Mandatory Sections in Logical Design Document

### 1. User Story Mapping (NEW)
- Map each user story from step 1.1 to technical components
- Identify which APIs, UI screens, and data models are needed
- Mark MVP vs Future scope

### 2. Backend Design
- API endpoints (all CRUD operations)
- **API request/response contracts** (request schemas, validation rules, response formats, error responses, sequence diagrams)
    - Sequence diagram: mermaid sequence
- Data models and persistence
- Business logic layer (TypeScript code)
- Integration patterns
- Implementation notes
- **Test case checklists:** List all API test cases that will cover the API endpoints
    - **Success scenarios**: Happy path with valid data
    - **Error handling**: 
        - Input validation (required fields, data types, format)
        - Field constraints (min/max length, allowed values)
        - Resource not found (404)
        - Duplicate entries (409 conflict)
        - Unauthorized access (401, 403)
    - **Boundary values**: Min/max limits, edge cases
    - **Suggestion**: Verify existing schema/diagram and suggest uncovered error cases (if any)

### 3. Frontend Design (MANDATORY - often missed)
- UI components for each user story
- Forms for create/edit operations
- List/detail views
- Navigation and routing
- State management approach

### 4. MVP Task Breakdown (NEW)
- Phase 1: Core domain + basic CRUD (runnable)
- Phase 2: UI for all operations (testable)
- Phase 3: Integration and polish
- Clearly mark what's MVP vs Future

### 5. Completeness Checklist (Architecture-Aware)
- [ ] All user stories have technical specifications
- [ ] All domain entities have {microservices: API endpoints | monolith: data models}
- [ ] All operations have UI components
- [ ] Create, Read, Update, and Delete are all covered
- [ ] Backend and Frontend are both specified
- [ ] {microservices: Service boundaries and integration points | monolith: Module boundaries and internal APIs} are defined
- [ ] {microservices: Local development approach | monolith: Shared database schema} is defined
- [ ] MVP scope is clearly defined

## Comprehensive Question Framework

**When to Ask Questions**: Only if technical-requirements.md is missing

Use the comprehensive technical questions framework at `references/templates/frameworks/technical-questions-framework.md` to gather technical decisions systematically.

**Key Categories**: Architecture, Frontend, Backend, Data, Infrastructure, Integration, Observability, Security, Testing, and CI/CD

**Note**: For existing projects, check existing patterns first before asking questions.

## Validation Before Moving to Next Phase

Before proceeding, validate the logical design:

### 1. User Story Coverage Check
- Review user-stories.md
- Verify each user story has corresponding technical specifications
- Confirm all CRUD operations are specified

### 2. Frontend Completeness Check
- Verify UI components are specified for all user interactions
- Confirm forms exist for create/edit operations
- Ensure list and detail views are defined
- Check navigation and routing are planned

### 3. Backend Completeness Check
- Verify all API endpoints are defined
- **Confirm API request/response contracts are specified** (request schemas, validation rules, response formats, status codes, sequence diagrams, and test case checklists)
- Confirm data models match domain entities
- Ensure all business logic is specified

### 4. MVP Scope Validation
- Confirm what's in MVP versus future releases
- Verify MVP is runnable and testable locally
- Ensure no critical features are missing

### 5. Cross-Reference with Domain Decomposition
- Review domain-decomposition.md
- **Microservices**: Verify bounded context responsibilities are covered and integration points are specified
- **Monolith**: Verify module responsibilities are covered and internal APIs are specified

**If any checks fail, update the logical design before proceeding to the next phase.**

**Logical Design Template**: **MANDATORY** - Use the template at `references/templates/outputs/logical-design-template.md` to ensure complete coverage of all required sections including project structure.
