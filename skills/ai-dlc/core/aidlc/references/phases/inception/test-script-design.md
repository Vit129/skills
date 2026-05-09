# Test Script Design

**Objective**: Generate automated test scripts based on test cases
- For API and Website UI case using Playwright
- For Mobile UI case using Robot framework with appium library
**Focus**: Test automation, Playwright scripts, API testing, UI testing automation

## Entry Point Requirements
**Can start this phase if:**
- [ ] `user-stories.md` exists
- [ ] `domain-decomposition.md` exists
- [ ] Domain design completed for target context
- [ ] Logical design completed for target context
- [ ] Test cases created
- [ ] Test scenarios documented in test-cases-template.md

**Missing Prerequisites Handling:**
- Guide user to complete missing phases first
- Validate implementation completeness before proceeding
- Ensure application can be started and tested locally

## Required Context from Previous Phases

- **From 1.1**: User stories and acceptance criteria from `user-stories.md`
- **From 1.2**: Architecture pattern and bounded contexts from `domain-decomposition.md`
- **From 2.2**: API specifications and UI components from `logical_design.md`
- **From 2.3**: Test cases and test scenarios from `test-scenario-sprint[N].md`

## Process

### 1. Test Script Generation
- Generate Playwright/Robot framework test scripts based on test cases from phase 2.3 which have automation stauts = 'Automatable'
- Follow naming convention from test cases: [Platform][Module][Function] {{scenario}}
- Implement test scripts for automatable test cases
- Use TypeScript for all test scripts

## Deliverables

### Test Coverage Report
- Summary of test coverage per user story
- Breakdown by test type (API, UI, Integration)
- Coverage metrics (Happy Path, Error Handling, Boundary cases)

## Phase Transition Validation

Before proceeding to Dev Task Design phase, validate:

- [ ] All MVP user stories have corresponding test cases
- [ ] Test cases follow template format and naming convention
- [ ] Test coverage includes positive, negative, and boundary cases
- [ ] Priority levels assigned using Severity × Urgency matrix
- [ ] API test cases include request/response specifications
- [ ] UI test cases cover all user workflows
- [ ] Test cases organized by sprint
- [ ] **User approval obtained** on test coverage and test cases

## Success Criteria

- [ ] Test cases generated for all implemented features
- [ ] Test coverage meets requirements (Happy Path, Alternative Path, Error Handling)
- [ ] Test cases follow standard template and naming convention
- [ ] Priority levels properly assigned
- [ ] Test cases are executable and traceable to user stories
- [ ] Test documentation is complete and organized


**Test Script Design Template**: **MANDATORY** - Use the template at `references/templates/outputs/test-script-template.md` to ensure complete coverage of all required sections including project structure.
