# Automated Testing

**Objective**: Execute automated tests and validate implementation
**Focus**: Test execution, bug reporting, test results analysis

## Entry Point Requirements
**Can start this phase if:**
- [ ] `user-stories.md` exists
- [ ] `domain-decomposition.md` exists
- [ ] Test cases created
- [ ] Test scripts generated
- [ ] Implementation completed
- [ ] Application runs locally without errors
- [ ] All MVP user stories implemented and testable

**Missing Prerequisites Handling:**
- Guide user to complete missing phases first
- Validate implementation completeness before proceeding
- Ensure application can be started and tested locally

## Required Context from Previous Phases

- **From 1.1**: User stories and acceptance criteria from `user-stories.md`
- **From 2.3**: Test cases and expected results
- **From 2.4**: Playwright/Robot framework test scripts
- **From 2.6**: Implementation and deployed application

## Process

### 1. Test Environment Setup
- Verify application is running and accessible
- Configure test environment variables
- Prepare test data and fixtures
- Validate API endpoints are available

### 2. Execute Automated Tests
- Run API tests using Playwright
- Run Web UI tests using Playwright (if have)
- Run Mobile UI tests using Robot framework (if have)
- Execute tests by sprint/feature
- Capture screenshots and videos for failures

### 3. Test Results Analysis
- Review test execution reports
- Identify failed test cases
- Analyze failure patterns
- Document bugs and issues

### 4. Bug Reporting
- Create bug reports for failed tests
- Link bugs to test cases and user stories
- Assign priority and severity
- Track bug status in Azure DevOps (optional)

### 5. Regression Testing
- Re-run failed tests after bug fixes
- Execute full regression suite
- Validate bug fixes don't break existing functionality

## Test Execution Commands

### Web UI Tests (Playwright)
```bash
# Run all Web UI tests
npm run ui:dev:all:cliMode

# Run specific test file
npx playwright test integration_tests/ui/test_ui/login.spec.ts

# Run specific feature in UI tests
FEATURE=create-ppr npm run ui:dev:feature:cliMode

# Run with UI mode
npm run ui:dev:all:guiMode
```

### API Tests (Playwright)
```bash
# Run all API tests
npm run api:dev:all:cliMode

# Run specific feature in API tests
FEATURE=create-ppr npm run api:dev:feature:cliMode
# npx playwright test --grep "@PBI-1234

# Run specific test file
npx playwright test integration_tests/api/test_api/auth.spec.ts
```

### Mobile UI Tests (Robot Framework)
```bash
# Run all Mobile UI tests
robot tests/mobile_ui/tests_ui/

# Run specific test file
robot tests/mobile_ui/tests_ui/user_login.robot

# Run tests by PBI tag
robot --include "PBI123" tests/mobile_ui/tests_ui/

# Run tests by feature tag
robot --include "*login*" tests/mobile_ui/tests_ui/

# Run tests by priority
robot --include "Critical" tests/mobile_ui/tests_ui/

# Run with specific test data environment
robot --variable ENV:dev tests/mobile_ui/tests_ui/

# Generate detailed reports
robot --outputdir results --report mobile_report.html tests/mobile_ui/tests_ui/
```

## Deliverables

### Test Execution Report
- Total tests executed
- Pass/Fail count
- Test coverage percentage
- Execution time
- Failed test details

### Bug Report
- Bug ID and title
- Steps to reproduce
- Expected vs actual results
- Screenshots/videos
- Severity and priority
- Linked test case

### Summary
- Update result of 'Automation Status'
#### API Case (Playwright)
| Endpoint | Method | User Story | Test Case | Case | Automation Status |
|----------|--------|---------|------------|-----|-----|
| [/api/resource] | [GET/POST/etc] | [US-001] | [TC-001] | [Success] | ✅/❌ |
| [/api/resource] | [GET/POST/etc] | [US-001] | [TC-002] | [Validation Error] | ✅/❌ |

#### Web UI Case (Playwright)
| User Flow | User Story | Test Case | Case | Automation Status |
|--------|---------|------------|-----|-----|
| [User Story] | [US-001] | [TC-003] | [Test flow in short] | ✅/❌ |
| [User Story] | [US-001] | [TC-004] | [Validation Error] | ✅/❌ |

#### Mobile UI Case (Robot Framework)
| User Flow | User Story | Test Case | Case | Automation Status |
|--------|---------|------------|-----|-----|
| [Mobile User Story] | [US-001] | [TC-005] | [Mobile flow in short] | ✅/❌ |
| [Mobile User Story] | [US-001] | [TC-006] | [Mobile validation error] | ✅/❌ |

## Phase Transition Validation

Before proceeding to Operation phase (3.1), validate:

- [ ] All automated tests executed
- [ ] Test results documented
- [ ] Critical bugs identified and reported
- [ ] Test coverage meets requirements
- [ ] Regression tests passed
- [ ] **User approval obtained** on test results

## Success Criteria

- [ ] All test scripts executed successfully
- [ ] Test results analyzed and documented
- [ ] Bugs reported and tracked
- [ ] Test coverage meets acceptance criteria
- [ ] Application validated against user stories
- [ ] Ready for deployment to next environment
