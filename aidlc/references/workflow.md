# AI-DLC Development Workflow Rules

## Essential Rules

- **DECISIONS → PLAN → EXECUTE** (Always create decisions first)
- **NEVER skip decisions** (Always create decision file with options)
- **STOP after creating plan** (Wait for approval — NEVER auto-execute)
- **NEVER fill decision answers** (User decides)
- **MANDATORY APPROVAL** (Plans require explicit user approval before execution)
- **Update plans incrementally** (Every 3-5 tasks)
- **Use .aidlc folder structure** (All artifacts)
- **Apply DDD** (Domain-Driven Design throughout inception)
- **Apply BDD** (Behavior-Driven Development for test cases)
- **Apply TDD** (Test-Driven Development: RED → GREEN → REFACTOR)

## Critical Behaviors

### Decision Process

- Always create decisions first before any planning
- MANDATORY: Use decision-record-template.md format
- Never fill in decision answers — leave blank for user
- Present options with rationale, but don't make decisions
- Wait for user to resolve decisions before creating plan

### Plan Process

- Always plan before executing
- MANDATORY: Use plan-template.md format
- Never proceed without explicit user approval
- NEVER combine planning and execution
- Strict two-step: Generate plan → Get approval → Then execute

### Execution Process

- Update plan status after completing each task with [x] checkboxes
- Include backend AND frontend in logical design
- MANDATORY: Use output templates for all deliverables
- Always maintain audit trail — update audit.md at each phase completion

## Methodology Integration

### DDD (Domain-Driven Design) — Inception Phase

- Phase 1.3: Strategic Design (Bounded Contexts, Context Map, Architecture Decision)
- Phase 1.4: Tactical Design (Entities, Value Objects, Aggregates, Domain Events)
- Phase 1.5: Technical Specifications (API Contracts, Data Models)

### BDD (Behavior-Driven Development) — Test Design Phase

- Phase 1.2: User stories with Given-When-Then acceptance criteria
- Phase 2.1: Test cases in BDD format

### TDD (Test-Driven Development) — Construction Phase

- Phase 2.3: Write test scripts FIRST (RED — tests should fail)
- Phase 3.1: Write minimal production code to pass tests (GREEN)
- Phase 3.2: Refactor code while keeping tests green (REFACTOR)

## File Structure

```text
.aidlc/
├── [SYSTEM_KEBAB]/
│   ├── PROGRESS.md                                ← system-level index (all features in this system)
│   ├── [SYSTEM_FEATURE_KEBAB]/
│   │   ├── audit.md
│   │   ├── dev-task-progress.md                   ← dev task tracking
│   │   ├── qa-task-progress.md                    ← QA task tracking
│   │   ├── planning/
│   │   │   ├── decisions/
│   │   │   │   ├── 01-requirements-gathering.md
│   │   │   │   ├── 02-domain-decomposition.md
│   │   │   │   └── ...
│   │   │   └── plans/
│   │   │       ├── 01-requirements-gathering.md
│   │   │       └── ...
│   │   └── outputs/
│   │       ├── inception/
│   │       │   ├── user-stories.md
│   │       │   └── domain-decomposition.md
│   │       └── construction/[{context}/]
│   │           ├── domain-design.md
│   │           ├── logical-design.md
│   │           └── implementation-plan.md
```

Example: `.aidlc/ecommerce/PROGRESS.md` tracks all ecommerce features (payment, refund, etc.)

## Naming Conventions

- System folders: `[SYSTEM_KEBAB]/` (e.g., `ecommerce/`, `hospital/`, `crm/`)
- Feature folders: `[SYSTEM_FEATURE_KEBAB]/` (e.g., `payment/`, `patient-triage/`, `user-auth/`)
- Decision/Plan Files: `{phase-number}-{phase-name}.md` (e.g., `01-requirements-gathering.md`)
- Context Files: Add `-{context-name}` for microservices (e.g., `03-domain-design-catalog.md`)
- MUST match test output paths: `.aidlc/ecommerce/payment/` ↔ `{test-root}/web-testing/ecommerce/payment/`

## Master Index (per system)

ALWAYS maintain `.aidlc/[SYSTEM_KEBAB]/PROGRESS.md`:

```markdown
# AIDLC Progress — {System Name}

| # | Feature | Dev | QA | Status | Date |
|---|---------|-----|-----|--------|------|
| 1 | payment | 12/12 | 8/8 | ✅ | 2026-01 |
| 2 | refund | 0/10 | 0/6 | 🔄 | 2026-02 |
```

Update when: new feature starts (add row), tasks complete (update counts), feature completes (mark ✅)

## Multi-Feature Requirements

When requirements contain multiple features (e.g., a PBI with 5 sub-features):
- Related features that share domain logic → group under 1 system, separate feature folders
- Each feature gets its own `.aidlc/[system]/[feature]/` folder
- Track all in the same `PROGRESS.md`
- Execution order: user decides priority, AI suggests based on dependency analysis

## Feature Complexity Levels

Measure by QA impact (not dev effort):

| Level | QA Impact | AIDLC Behavior |
|---|---|---|
| Lightweight | QA tests 1 page, no regression risk | All phases, but output is concise (1 paragraph per section) |
| Standard | QA tests 2-5 pages, some regression risk | All phases, normal output depth |
| Full | QA tests 5+ pages or regression across module | All phases, full output + sequence diagrams + test checklists |

NEVER skip phases regardless of complexity — always run full AIDLC. Only output depth changes.
AI MUST ask user to confirm complexity level at Phase 1.2 (Requirements Gathering).

## Standard Process (Every Phase)

1. **DECISIONS** → Create decision file with options and recommendations
2. **USER RESOLVES** → User fills in decision answers
3. **PLAN** → Create execution plan based on resolved decisions
4. **USER APPROVES** → User approves the plan
5. **EXECUTE** → Implement the approved plan incrementally
6. **AUDIT** → Update audit trail

## Workflow Phases

### Inception (Business Focus)

Brownfield start from 1.1, Greenfield start from 1.2

- **1.1** Reverse Engineering → Analyze existing codebase (brownfield only)
  → Use `analysis-skills` skill (reverse-eng.md)
- **1.2** Requirements Gathering → User stories with BDD acceptance criteria
  → Use `analysis-skills` skill (requirements.md)
- **1.3** Domain Decomposition → DDD Strategic Design + Architecture Decision
  → Use `architect` skill (decomposition.md, architecture-patterns.md)
- **1.4** Domain Design → DDD Tactical Patterns (pseudocode)
  → Use `architect` skill (domain-design.md)
- **1.5** Logical Design → Technical specifications (Server Logic, Data Storage, Client Application)
  → Use `architect` skill (logical-design.md)
- **1.6** UI/UX Design → Design system, Figma analysis, component specs
  → Use `ui-designer` skill (design-system.md) + `analysis-skills` skill (figma.md)
- **1.7** Dev Task Design → Task breakdown for implementation
  → Use `aidlc` reference (dev-task-design.md)

### QA Focus

- **2.1** Test Case Design → BDD test scenarios
  → Use `test-scenario` skill + `test-scenario-rules` skill
- **2.2** QA Architecture → Test automation framework blueprints
  → Use `qa-architect` skill (api-arch.md, web-arch.md, mobile-arch.md, test-db-strategy.md)
- **2.3** Test Script Design → Playwright/Robot Framework scripts (TDD: RED)
  → Use `playwright-testing` skill or `robotframework-testing` skill
  → Read rules from `playwright-rules` or `robotframework-rules` first
- **2.4** QA Task Design → Task breakdown for QA automation
  → Use `aidlc` reference (qa-task-design.md)
- **2.5** DevOps Sync → Create work items via MCP
  → Use `devops-pipeline` skill (azure-sync.md)

### Construction (Technical Focus)

- **3.1** Implementation → TDD: GREEN (code to pass tests)
  → Use `frontend-dev` skill and/or `backend-dev` skill
- **3.2** Automated Testing → TDD: REFACTOR + validation
  → Use `playwright-testing` skill or `robotframework-testing` skill
- **3.3** Create Pull Request → PR creation + code review
  → Use `devops-pipeline` skill (pull-request.md)

### Operation

- **4.1** Deployment → CI/CD and monitoring

## Architecture Patterns

### Microservices Workflow

- Context Selection: Ask user which bounded context to work on
- Priority: Core Business → Data-Heavy → Integration → Supporting
- File Structure: Separate files per context (`domain-design-{context}.md`)
- Output: `{context}/` folders under `outputs/construction/`

### Monolith Workflow

- Single files with context sections (`domain-design.md`)
- Single `outputs/construction/` folder

For detailed patterns → Use `architect` skill (architecture-patterns.md)

## Quick Commands

- `"start AI-DLC"` — Begin new project (detects greenfield vs brownfield)
- `"start AI-DLC greenfield"` — Skip reverse engineering
- `"start AI-DLC brownfield"` — Include reverse engineering
- `"start AI-DLC from domain design"` — Begin from phase 1.4
- `"start AI-DLC from logical design"` — Begin from phase 1.5
- `"start AI-DLC from UI/UX design"` — Begin from phase 1.6
- `"start AI-DLC from test case design"` — Begin from phase 2.1
- `"start AI-DLC from QA architecture"` — Begin from phase 2.2
- `"start AI-DLC from test script design"` — Begin from phase 2.3
- `"start AI-DLC from dev task design"` — Begin from phase 1.7
- `"start AI-DLC from sync AD"` — Begin from phase 2.5
- `"start AI-DLC from implementation"` — Begin from phase 3.1
- `"start AI-DLC from automation testing"` — Begin from phase 3.2
- `"start AI-DLC from create pull request"` — Begin from phase 3.3
- `"resume AI-DLC"` — Resume paused iteration
- `"reset AI-DLC"` — Reset session
- `"proceed"` or `"1"` — Approve and continue

## Core Philosophy

- Local-First: In-memory storage, console logging for MVP
- MVP Focus: Implement only what's needed to run and test
- Testable: Each component independently testable
- Decision-Driven: ADR format, cover functional and non-functional requirements
- Incremental: Update plans during work, not at end
- Quality Gates: Validate completeness before next phase

## Project Detection (Phase 0)

Before starting any AIDLC workflow, detect project structure:

1. **Test Root:** Scan for `playwright.config.ts` or `package.json` with playwright — use parent folder as test root. If not found at `tests/`, ask user.
2. **Data Storage:** Identify type — SQL DB (PostgreSQL, MySQL), NoSQL (MongoDB, DynamoDB), Spreadsheet, LocalStorage, Firebase Realtime DB, etc.
3. **Server Logic:** Identify type — REST API (Express, FastAPI), Serverless Functions (AWS Lambda, Cloud Functions), GraphQL, none (frontend-only with external APIs)
4. **Client Application:** Identify type — Web (React, Vue, Angular), Mobile (Flutter, Kotlin, Swift), Desktop

Store detected values in the feature's progress files (Context section).
