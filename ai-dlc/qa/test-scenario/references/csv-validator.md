# CSV Validator

Handle CSV export formatting, data flattening, column validation, and file persistence.

## When to use
- After test scenarios are finalized
- Need to export MD to CSV for Azure DevOps import
- Need to validate CSV structure

## Process
1. Locate MD file: `testScenarioPbi{pbi_id}.md`
2. Run conversion script: `md2csv.sh {md_file_path}`
3. Always run auto-fix: `csvValidator.sh {csv_file_path}`

## 23-Column Enforcement
Final CSV must contain exactly 23 columns in correct order.

## Validation Rules
- **Checklist A:** Header must have 23 columns
- **Checklist B:** PBI Row — Col 1="Product Backlog Item", ID not empty, single backslash paths
- **Checklist C:** Test Scenario Row — Col 1="Test Scenario", State="To Do", Test result="Not start", Actual Result empty, single backslash paths

## Auto-Fix Actions
- Column alignment (Pre-conditions shifted)
- Work Item Type corrections
- State = "To Do", Test result = "Not start"
- Clear empty fields (Actual Result, Reason, Tags)
- Copy Area Path/Iteration Path from PBI if missing
- Adjust column count to 23
- Validate Priority Level and Test Type

## Scripts
- Primary: `skills/test-scenario-skills/scripts/md2csv.sh`
- Auto-fix: `skills/test-scenario-skills/scripts/csvValidator.sh`
