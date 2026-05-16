# Azure DevOps Sync

Auto-create and sync PBIs, Tasks, and Test Cases to Azure DevOps via MCP.

## Entry Point Requirements

- [ ] Task decomposition artifacts complete (user-stories, dev-task-design, test-scenarios)
- [ ] MCP Server for Azure DevOps configured and connected
- [ ] Personal Access Token (PAT) with Work Items read/write permissions
- [ ] Target project and area path confirmed

## MCP Server Setup

### Configuration

```json
{
  "mcpServers": {
    "azure-devops": {
      "command": "mcp-azure-devops",
      "env": {
        "AZURE_DEVOPS_ORG": "{{your-org}}",
        "AZURE_DEVOPS_PROJECT": "{{your-project}}",
        "AZURE_DEVOPS_PAT": "{{your-pat}}"
      }
    }
  }
}
```

### Available MCP Tools

| Tool | Purpose |
|------|---------|
| `create_work_item` | Create PBI / Task / Test Case |
| `update_work_item` | Update existing work item fields |
| `link_work_items` | Create parent/child or Tested By relationships |
| `query_work_items` | Query work items for validation |
| `create_test_case` | Create test case with structured test steps |

## Process

1. **Prepare** — Read decomposition data from user-stories.md, dev-task-design, and test-scenario files
2. **Create PBIs** — From user stories, map all fields per field mapping below
3. **Create Tasks** — Under each PBI, with effort estimates and parent link
4. **Create Test Cases** — Type: `Test Scenario`, link to parent PBI via "Tested By"
5. **Apply transformations** — HTML formatting, priority mapping, conditional fields
6. **Sync IDs back** — Update local files with Azure DevOps IDs
7. **Validate** — Query created items to confirm all fields populated correctly

## Field Mapping

### PBI (Product Backlog Item)

| Azure Field | Source |
|-------------|--------|
| `System.Title` | PBI title |
| `System.Description` | PBI description (with `|newlines` transform) |
| `System.AcceptanceCriteria` | Requirements (with `|newlines` transform) |
| `Microsoft.VSTS.Common.BusinessValue` | Product Metrics |
| `Custom.Goal` | Goal |
| `Custom.Persona` | Persona |
| `Custom.UXUIReference` | UX/UI Reference |
| `Custom.UserFlow` | User Flow |
| `System.State` | "New" |

### Task

| Azure Field | Source |
|-------------|--------|
| `System.Title` | Task title |
| `System.Description` | Task description (with `|newlines` transform) |
| `System.Parent` | Parent PBI ID |
| `Microsoft.VSTS.Scheduling.RemainingWork` | Effort estimate (hours) |
| `Microsoft.VSTS.Scheduling.OriginalEstimate` | Effort estimate (hours) |
| `System.State` | "To Do" |

### Test Case (Test Scenario)

| Azure Field | Source |
|-------------|--------|
| `System.Title` | Test case title (without ID prefix) |
| `System.State` | Test case state |
| `Custom.Components` | Components under test |
| `Custom.Briefdescription` | Brief description (with `|newlines`) |
| `Custom.Pre_conditions` | Preconditions (with `|newlines`) |
| `Custom.Teststepswithtestdata` | Test steps with data (with `|newlines`) |
| `Custom.Expectedtestresult` | Expected result (with `|newlines`) |
| `Custom.Test_type` | Test application (API/Web UI/Mobile) |
| `Custom.Automationteststatus` | Automation status |
| `Custom.Prioritylevel` | Priority level |
| `Custom.TestScenariobyAI` | "Yes" (always) |
| `Microsoft.VSTS.Scheduling.Effort` | Effort |

### Relationships

| Relationship | From | To |
|-------------|------|-----|
| Parent | Task | PBI |
| Parent | Test Case | PBI |
| Tested By | PBI | Test Case |

## Field Transformations

### Newlines Formatter (`|newlines`)

Apply to all multi-line fields before sending to Azure DevOps:

| Input | Output |
|-------|--------|
| `\n` | `<br>` |
| `\r\n` | `<br>` |
| `\n\n` | `<br><br>` |
| `- item` | `<br>• item` |
| `* item` | `<br>• item` |

Preserve numbered lists and indentation. Never use raw `\n` in field values.

### Priority Mapping

| Source | Azure Value |
|--------|-------------|
| Critical | 1 |
| High | 2 |
| Medium | 3 |
| Low | 4 |

### Automation Status Mapping

| Source | Azure Value |
|--------|-------------|
| Automatable | Planned |
| Not Automatable | Not Planned |
| Automated | Automated |

### Test Application Mapping (Conditional)

| Test Application | `Custom.Test_type` | `Custom.GUIAutomateTest` |
|-----------------|-------------------|--------------------------|
| API | API Testing | — |
| Web UI | GUI Testing | Yes |
| Mobile (Android) | GUI Testing | Yes |
| Mobile (iOS) | GUI Testing | Yes |

## Sync-Back to Local Files

After creating items in Azure DevOps:

1. **User stories** — Add `PBI ID: #XXXXX` field to each story
2. **Test cases** — Add `Test Scenario ID: #XXXXX` field to each case
3. **Create `work-items-mapping.csv`** — Local ID ↔ Azure ID mapping
4. **Create `sync-log.json`** — Full sync details with timestamps

## Output Artifacts

| File | Purpose |
|------|---------|
| `sync-summary.md` | Human-readable sync report |
| `work-items-mapping.csv` | Local ↔ Azure ID mapping |
| `sync-log.json` | Full sync log with field details |

## Validation Checklist

- [ ] All PBIs created with custom fields populated (Goal, Persona, UX/UI Reference, User Flow)
- [ ] All Tasks created and linked to parent PBIs with effort estimates
- [ ] All Test Cases created as `Test Scenario` type
- [ ] Multi-line fields formatted with `<br>` tags (no raw `\n`)
- [ ] Test Case custom fields populated (Components, Brief Description, Precondition, Test Steps, Expected Result)
- [ ] Priority/Automation/Test Application transformations applied
- [ ] `Custom.TestScenariobyAI` = "Yes" on all test cases
- [ ] "Tested By" relationships established between PBIs and Test Cases
- [ ] Azure DevOps IDs synced back to local files
- [ ] `work-items-mapping.csv` and `sync-log.json` created
- [ ] Validation query confirms all items exist with correct field values

## Rules

- MCP required — if unavailable, notify user and skip gracefully
- Always sync IDs back to local files after creation
- Always validate created items after bulk creation
- Never send raw `\n` — always convert to `<br>` HTML
- Test Cases must use type `Test Scenario` (not generic "Test Case")
- Always set `Custom.TestScenariobyAI` = "Yes" for AI-generated scenarios
