# Plan: [Step Name] - [Unit of Work]

**Template Usage**: Use this template for Requirements Gathering (1.1), Domain Decomposition (1.2), Domain Design (2.1), and Logical Design (2.2). For Implementation (2.3), use `implementation-plan-template.md` instead.

## Status: Planning | Approved | In Progress | Paused | Completed | Blocked

## Objective
[Clear objective statement]

## Decision Reference
**Based on decisions from**: [../decisions/{phase-number}-{phase-name}.md]

## Task Breakdown

### Phase 1: [Name] - Status: Not Started | In Progress | Completed
**User Stories**: US-001, US-002
- [ ] Task 1.1: [Specific task]
- [ ] Task 1.2: [Specific task]

### Phase 2: [Name] - Status: Not Started | In Progress | Completed
**User Stories**: US-003, US-004
- [ ] Task 2.1: [Specific task]

## Success Criteria (Process Validation)
**Note**: These validate the planning process. Deliverable-specific criteria are in the output templates.

- [ ] [Criterion 1 from phase validation checklist]
- [ ] [Criterion 2 from phase validation checklist]
- [ ] [Criterion 3 from phase validation checklist]
- [ ] User approval obtained on deliverables

## Pause/Resume Information
**If pausing work, update this section:**
- **Paused At**: [Current task or section]
- **Next Steps**: [What to do when resuming]

## Writing Guide

### Task Description
Every task MUST specify three things:
1. **File**: What file to create or modify (full path)
2. **Content**: What goes in it (key sections, not just a title)
3. **Source**: Where the information comes from (which existing file to read)

Bad: "Task 1.1: Create user-stories.md"
Good: "Task 1.1: Create `outputs/inception/user-stories.md` — extract 2 capabilities (flight booking + visa check) from `JapanTravelBookingSystem.md` Section 1. Write user stories with BDD acceptance criteria (Given/When/Then)."

### Phase Descriptions
Before each phase's task list, write 1-2 sentences explaining:
- What this phase produces
- What input it reads

### Language
- All content in English
- Task descriptions should be actionable — start with a verb (Create, Read, Extract, Reference, Update)
