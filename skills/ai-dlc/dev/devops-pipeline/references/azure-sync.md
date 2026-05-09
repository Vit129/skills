# DevOps Sync

Auto-create work items, tasks, and test cases in DevOps via MCP.

## When to use
- After dev task design (Phase 1.8)
- DevOps MCP tools are configured

## Process
1. Validate MCP is available — if not, notify user and skip
2. Create work items from user-stories.md (Type: "Product Backlog Item")
3. Create tasks from dev-task-breakdown.md (Type: "Task", linked to parent)
4. Create test cases from test-scenario-sprint.md (Type: "Test Scenario", linked to parent)
5. Sync IDs back to local files
6. Validate all items exist via MCP query

## Field mapping
- Follow `azure-devops-field-mapping.json` (in this skill's references/) for all field transformations
- Customize field names per project's Azure DevOps process template
- Priority mapping: Critical=1, High=2, Medium=3, Low=4
- Automation status: Automatable → Planned

## HTML Formatting Rules (for multi-line fields)
- `\n` → `<br>`
- `- item` → `<br>• item`
- `* item` → `<br>• item`
- Numbered lists: preserve as-is
- Never use raw `\n` in field values — always convert to `<br>`

## Rules
- MCP required — if unavailable, skip gracefully
- Always sync IDs back to local files after creation
- Always validate created items after bulk creation
