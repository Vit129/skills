# Dev Task Design

**Objective**: Break down technical specifications into small, sequential, manageable development tasks
**Focus**: Project Management, Task Sequencing, MVP Definition, Estimation

## Entry Point Requirements

**Can start this phase if:**

- [ ] `logical-design.md` exists
- [ ] `test-cases-template.md` populated
- [ ] `test-script-template.md` populated
- [ ] Technical specifications are complete and validated

## Required Context from Previous Phases

- **From 2.2**: API Specs, Database Schema, Frontend Components from `logical-design.md`
- **From 2.3**: Scenarios to be supported
- **From 2.4**: Automation scripts to be built first

## CRITICAL SUCCESS CRITERIA

- All Logical Design components have corresponding tasks
- Tasks are atomic (small enough to be completed in 1-2 hours)
- Dependencies are clearly identified
- Sequencing is logical (Dependencies first, Core second, UI third)
- Format matches Azure DevOps Bulk Import (or standard task list)
- Includes "Test Implementation" tasks matching Test Scripts

## Process

1. **Review Logical Design**: Identify every Component, API, and Schema change.
2. **Review Test Scripts**: Identify tasks to implement the automation scripts themselves (if needed) or the code that passes them.
3. **Decompose**:
   - Backend: DTOs, Entities, Repositories, Services, Controllers.
   - Frontend: Components, Pages, State, API Integration.
   - Database: Migration scripts, Schema updates.
4. **Sequence**: Order tasks by dependencies (e.g., DB -> Backend -> Frontend).
5. **Estimate**: Provide rough complexity or time estimates.
6. **Generate Output**: Create `dev-task-breakdown.md`.

## Mandatory Sections in Task Breakdown

### 1. Database & Infrastructure Tasks

- Schema migrations
- Infrastructure setup

### 2. Backend Tasks

- Entities & DTOs
- Repository Implementation
- Service Logic
- Controller/API Endpoints
- Unit Tests

### 3. Frontend Tasks

- Component Creation
- Page Layouts
- API Integration
- State Management

### 4. Integration & Verification Tasks

- End-to-End wiring
- Running Test Scripts
- Manual Verification steps

## Output

**File naming**: `dev-task-breakdown.md`
**Location**: `.aidlc/iterations/iteration-{N}-{feature}/outputs/construction/dev-task-breakdown.md`
**Template**: `references/templates/outputs/task-decomposition-template.md`

## Phase Transition Validation

Before proceeding to Sync Azure DevOps phase, validate:
- [ ] All dev task breakdowns are complete
