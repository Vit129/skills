# Test Case Design

**Objective**: Create comprehensive test scenarios and test cases before implementation
**Focus**: Test case generation, test coverage planning, acceptance criteria validation

## Project Structure
```
project-root/
├── tests/
    ├── testcase/
    │   └── test-scenario-sprint[N].md
```

## Quick Reference

**Naming Format:** `[Platform][Module][Function] {{scenario}}`
- Platform: API | WEB | MOBILE
- Example: `[API][Login][Authenticate] Login fails with expired token`

**File Organization:** One file per sprint (e.g., test-cases-sprint1.md)

**Language:** English only


## Entry Point Requirements
**Can start this phase if:**
- [ ] `user-stories.md` exists
- [ ] `domain-decomposition.md` exists
- [ ] `logical-design.md` exists
- [ ] Domain design completed for target context
- [ ] Logical design completed for target context
- [ ] API specifications and UI components defined

**Missing Prerequisites Handling:**
- Guide user to complete missing phases first
- Validate logical design completeness before proceeding
- Ensure all technical specifications are defined

## Required Context from Previous Phases

- **From 1.1**: User stories and acceptance criteria from `user-stories.md`
- **From 1.2**: Architecture pattern and bounded contexts from `domain-decomposition.md`
- **From 2.1**: Domain model specifications from `domain_design.md`
- **From 2.2**: API specifications and UI components from `logical_design.md`

## Process

### 1. Test Case Generation
- **MANDATORY**: Use test cases template at `references/templates/outputs/test-cases-template.md`
- Generate test cases following naming convention: [Platform][Module][Function] {{scenario}}
- Cover positive cases (Happy Path), negative cases (Error Handling), and boundary cases
- Separate test cases by sprint: `test-scenario-sprint[N].md`
- File test cases store in `../tests/testcase/`
- Include both GUI and API test cases

### 2. Test Coverage Requirements
- **Happy Path**: At least 1 test case per user story
  - Valid inputs, expected success
- **Alternative Path**: Cover alternative scenarios as appropriate
- **Error Handling**: Cover input validation, authentication, authorization
  - required fields, format, length
- **Boundary Testing**: Use boundary test design principles for input boundaries
  - min/max limits
- **API Testing**:
  - Make sure that API test case is covered all case in `logical-design.md`
  - Always specify:
    - HTTP Method (GET, POST, PUT, DELETE, PATCH)
    - Request body, query parameters, headers
    - Expected HTTP status code and response body
- **UI Testing**: Cover all user interactions and workflows

### 3. Priority Assignment
- Use **Severity × Urgency** matrix to determine priority
- Assign Critical/High/Medium/Low based on business impact and user impact
- Reference priority matrix in test cases template

### 4. Test Execution Approach
- **API Tests**: Default to "Automatable" status
- **UI Tests**: Default to "Can't automate" unless simple flows
- Set Effort starting at 0.5, increase by 0.5 increments based on complexity

### 5. Related Test Case Analysis
- In section '## Related Test Scenario'

**Obsolete Test Case Review**:
- Review test cases from previous sprints that are invalidated by new requirements in current sprint
- Reference existing files: `tests/testcase/`
- Document obsolete test cases with:
  - Test case ID and name
  - Current sprint PBI that invalidates the test case
  - Reason for obsolescence

**Regression Test Case Review**:
- Identify test cases from previous sprints that are affected by new requirements and need regression testing
- Reference existing files: `tests/testcase/`
- Document regression test cases with:
  - Test case ID and name
  - Current sprint PBI that requires regression
  - Reason for regression testing

**Suggestion Test Case**:
- If exising logical-design.md missing some alternative case, list all missing case with priority

**Coverage Validation**:
- Ensure no test gaps exist after removing obsolete cases
- Verify regression test cases maintain system integrity
- Update test coverage metrics accordingly

### 6. Summary
- In section '## Summary'
- List all API and UI case
- Column 'Automation Status' will default as ⚠️
 - Can change to ✅ when automation test script is implemented
 - If that test case is obsoleted or inactive in any reason, change to 🚫

## Architecture-Specific Approach

### Microservices - Context Selection
**Context Selection (No Decision File)**:
- **If coming from Logical Design**: Continue with the same context that was just completed
- **If starting fresh**: Ask user directly which bounded context to test
- **Wait for user selection** - User responds with context name or number

**File Generation**:
- **Create test cases file** covering all modules in sprint
- **File naming**: `test-scenario-sprint[N].md`


## Deliverables

### Test Cases Document
- **MANDATORY**: Use test cases template format
- Include all required fields: User Story, Work Item Type, Title, State, Components, Brief description, Pre condition, Test steps with test data, Expected result, Priority Level, Test Application, Automation Status, Effort, Remaining Work
- Follow naming convention: [Platform][Module][Function] {{scenario}}
- Organize by sprint number

### Test Coverage Report
- Summary of test coverage per user story
- Breakdown by test type (API, UI)
- Coverage metrics (Happy Path, Error Handling, Boundary cases)

## Phase Transition Validation

Before proceeding to Test Script Design phase, validate:

- [ ] All MVP user stories have corresponding test cases
- [ ] Test cases follow template format and naming convention
- [ ] Test coverage includes positive, negative, and boundary cases
- [ ] Priority levels assigned using Severity × Urgency matrix
- [ ] API test cases include request/response specifications
- [ ] UI test cases cover all user workflows
- [ ] Test cases organized by sprint
- [ ] **User approval obtained** on test coverage and test cases

## Success Criteria

- [ ] Test cases generated for all planned features
- [ ] Test coverage meets requirements (Happy Path, Alternative Path, Error Handling)
- [ ] Test cases follow standard template and naming convention
- [ ] Priority levels properly assigned
- [ ] Test cases are traceable to user stories
- [ ] Test documentation is complete and organized
