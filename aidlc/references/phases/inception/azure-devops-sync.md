# Azure DevOps Sync

**Objective**: Sync tasks and test cases to Azure DevOps
**Focus**: Work item creation, test case linking, sprint assignment

---

## Scope

- Use MCP Server to connect to Azure DevOps
- Automatically create Work Items (PBI, Task, Test Case) via AI
- Create relationships and links between work items
- Validate and verify results on Azure Board

---

## Entry Point Requirements

- [ ] Inception Phase completed (task-decomposition.md available)
- [ ] MCP Server for Azure DevOps configured
- [ ] AI Assistant connected to MCP Server
- [ ] Contributor permissions in Azure DevOps Project

---

## Required Context from Previous Phases

- Task decomposition artifacts from task-decomposition.md
- List of PBIs, Tasks, and Test Cases already decomposed and mapped
- Mapping data reviewed and approved

---

## Process Flow

### 1. Prepare Input Data

- Open `task-decomposition.md` from Inception Phase
- Verify completeness of PBI, Task, and Test Case data

### 2. Auto-Create Work Items via AI + MCP

**Usage Example:**

```
Prompt AI:
"Read task-decomposition.md, user-stories.md, and test-scenario-sprint1.md files and create work items on Azure DevOps following the azure-devops-field-mapping.json configuration:

1. Create all PBIs from user stories with proper field mapping:
   - Map title, description, acceptance criteria, business value, goal, persona, UX/UI reference, user flow
   - Ensure multi-line fields (description, acceptance criteria) use proper HTML formatting with <br> tags for line breaks

2. Create Tasks under each relevant PBI:
   - Map task title, description, parent relationship
   - Set proper effort estimates and state

3. Create Test Cases (type: 'Test Scenario') and link them to PBIs:
   - Map all custom fields: Components, Brief Description, Precondition, Test Steps, Expected Result
   - Apply newlines formatter to multi-line fields (Brief Description, Precondition, Test Steps, Expected Result)
   - Convert bullet points to proper HTML format with <br> tags
   - Set Test Type and GUI Automate Test based on conditional logic
   - Link with 'Tested By' relationship to parent PBI

4. Apply field transformations:
   - Priority mapping (Critical=1, High=2, Medium=3, Low=4)
   - Automation status mapping
   - Test application mapping
   - Conditional field logic for API vs UI tests

5. Show a summary of created items with all work item IDs and verify field formatting"
```

### 3. MCP Operations Used by AI

AI will use these MCP tools automatically:

- `azure_devops.create_work_item` - Create PBI/Task/Test Case
- `azure_devops.link_work_items` - Create parent-child relationships
- `azure_devops.update_work_item` - Update work item data (if needed)
- `azure_devops.query_work_items` - Query created work items

### 4. Validation

```
Prompt AI:
"Validate created work items on Azure DevOps:
- List all PBIs with IDs and verify field mapping
- Check that all Tasks are linked to their parent PBIs with correct effort estimates
- Check that all Test Cases (type: 'Test Scenario') are linked to PBIs with 'Tested By' relationship
- Verify multi-line fields display with proper line breaks in Azure DevOps
- Verify custom fields are populated: Components, Brief Description, Precondition, Test Steps, Expected Result
- Check conditional field logic is applied correctly (Test Type, GUI Automate Test)
- List any items that failed to create with detailed error messages
- Verify field transformations are applied (priority, automation status, test application mapping)"
```


### 5. Sync IDs Back to Project Files

```
Prompt AI:
"Update project files with Azure DevOps work item IDs:
- Add 'PBI ID: #XXXXX' to user stories in user-stories.md
- Add 'Test Scenario ID: #XXXXX' to test cases in test-scenario files
- Create work-items-mapping.csv with local ID to Azure DevOps ID mapping
- Create sync-log.json with complete sync details and field verification"
```

### 6. Export Summary

```
Prompt AI:
"Generate a sync summary report:
- Number of PBIs, Tasks, and Test Cases created
- All Work Item IDs
- List of failed items with reasons
- Save as sync-summary.md"
```

---

## Checklist

### Data Reading
- [ ] AI successfully reads task-decomposition.md
- [ ] AI successfully reads user-stories.md
- [ ] AI successfully reads test-scenario-sprint1.md
- [ ] AI loads azure-devops-field-mapping.json configuration

### PBI Creation
- [ ] All PBIs are created on Azure Board as "Product Backlog Item" type
- [ ] System.Title mapped correctly from user story titles
- [ ] System.Description formatted with HTML <br> tags for line breaks
- [ ] System.AcceptanceCriteria formatted with proper HTML formatting
- [ ] Custom fields populated: Goal, Persona, UX/UI Reference, User Flow, Business Value
- [ ] Multi-line custom fields formatted with <br> tags

### Task Creation
- [ ] Tasks are created and linked to parent PBIs
- [ ] System.Title and System.Description mapped correctly
- [ ] Task descriptions formatted with HTML <br> tags
- [ ] Effort estimates set (RemainingWork, OriginalEstimate)
- [ ] Parent-child relationships established

### Test Case Creation
- [ ] Test Cases created as "Test Scenario" type
- [ ] System.Title mapped without TC-XXX prefix
- [ ] Custom.Components field populated (UI | API format)
- [ ] Custom.Briefdescription formatted with HTML <br> tags
- [ ] Custom.Precondition formatted with bullet points as HTML
- [ ] Custom.Teststepswithtestdata formatted with numbered steps and <br> tags
- [ ] Custom.Expectedresult formatted with bullet points as HTML
- [ ] Custom.TestType set based on conditional logic
- [ ] Custom.GUIAutomatetest set based on conditional logic
- [ ] Microsoft.VSTS.Scheduling.Effort mapped from test case effort
- [ ] Custom.TestScenariobyAI set to "Yes"
- [ ] 'Tested By' relationships established with parent PBIs

### Field Transformations
- [ ] Priority mapping applied (Critical=1, High=2, Medium=3, Low=4)
- [ ] Automation status mapping applied (Automatable→Planned, etc.)
- [ ] Test application mapping applied (API→API Testing, etc.)
- [ ] Conditional logic for Test Type field applied correctly
- [ ] Conditional logic for GUI Automate Test field applied correctly

### Formatting Verification
- [ ] Bullet points converted to HTML format with <br>• pattern
- [ ] Line breaks converted to <br> tags
- [ ] Numbered lists preserved with proper formatting
- [ ] Multi-line content displays correctly in Azure DevOps interface

### Sync IDs Back to Project
- [ ] User stories updated with PBI ID fields
- [ ] Test cases updated with Test Scenario ID fields
- [ ] work-items-mapping.csv created with local to Azure DevOps ID mapping
- [ ] sync-log.json created with complete sync details

### Export and Validation
- [ ] sync-summary.md exported with field mapping details
- [ ] work-items-mapping.csv includes all created items
- [ ] sync-log.json contains detailed transformation log
- [ ] Results verified on Azure DevOps Portal
- [ ] Field formatting verified in Azure DevOps interface
- [ ] Project files updated with Azure DevOps IDs

---

## Example Conversation Flow

### Step 1: Create Work Items

```
You: "Read task-decomposition.md and create all PBIs on Azure DevOps"

AI: [using MCP] "Creating PBIs..."
     PBI #12345: User Authentication Module
     PBI #12346: Data Sync Service
     PBI #12347: Reporting Dashboard

     3 PBIs created successfully
```

### Step 2: Create Tasks

```
You: "Create Tasks for each PBI as per decomposition"

AI: [using MCP] "Creating Tasks and linking to PBIs..."
     Task #12348: Setup OAuth2 (Parent: #12345)
     Task #12349: Implement Login API (Parent: #12345)
     Task #12350: Create Database Schema (Parent: #12346)

     15 Tasks created successfully
```

### Step 3: Create Test Cases with Proper Formatting

```
You: "Create Test Cases from test-scenario-sprint1.md with proper field mapping"

AI: [using MCP] "Creating Test Cases with custom fields..."
     Test Case #12351: [MOBILE][Auth][Login] User login on mobile app
        - Type: Test Scenario
        - Components: UI | API
        - Brief Description: Verify that users can successfully login through mobile application
        - Precondition: <br>• Mobile application is installed and accessible<br>• Test user account exists in database<br>• Backend API is running
        - Test Steps: <br>1. Open mobile application<br>2. Navigate to login screen<br>3. Enter email: "test@example.com"<br>4. Enter password: "SecurePass123!"<br>5. Tap login button
        - Expected Result: <br>• Login screen displays properly with email and password fields<br>• Valid credentials result in successful login<br>• User is redirected to main app screen<br>• Authentication state is maintained across app sessions
        - Tested By: PBI #12345

     15 Test Cases created with proper HTML formatting
```

### Step 4: Validate

```
You: "Validate that all items are correctly linked and formatted"

AI: [using MCP] "Validating..."
     PBI #12345 has 5 Tasks with effort estimates
     PBI #12346 has 7 Tasks with effort estimates
     PBI #12347 has 3 Tasks with effort estimates
     All Test Cases linked with 'Tested By' relationship
     Multi-line fields display with proper <br> tags in Azure DevOps
     Custom fields populated: Components, Brief Description, Precondition, Test Steps, Expected Result
     Field transformations applied correctly

     No issues found
```

---

## Output Artifacts

- **sync-summary.md** - Sync summary report

  - Number of work items created
  - All Work Item IDs
  - List of failed items

- **work-items-mapping.csv** - Mapping between local and Azure

```csv
Local ID,Type,Title,Azure Board ID,Status
PBI-001,PBI,User Auth,12345,Created
T-001,Task,Setup OAuth2,12348,Created
TC-001,Test Case,Login Test,12351,Created
```

- **sync-log.json** - Full sync log

```json
{
  "timestamp": "2025-11-19T10:30:00Z",
  "total_created": 25,
  "pbis": 3,
  "tasks": 15,
  "test_cases": 7,
  "errors": []
}
```

---

## Troubleshooting

| Issue                     | Solution                                       |
| ------------------------- | ---------------------------------------------- |
| AI cannot see MCP tools   | Check MCP Server configuration                 |
| Work item creation failed | Check PAT permissions and Project settings     |
| Link relationship failed  | Ensure parent work item is created first       |
| Duplicate work items      | Use AI query before creating to check existing |

---

## Notes

- **No manual coding required** - AI + MCP handles everything
- **Repeatable** - Sync can be rerun if changes occur
- **Auditable** - Log and summary generated every time
- **Human-in-the-loop** - AI will confirm before bulk creation

---

## References

- [MCP Server Documentation](https://modelcontextprotocol.io/)
- [Azure DevOps REST API](https://learn.microsoft.com/en-us/rest/api/azure/devops/)