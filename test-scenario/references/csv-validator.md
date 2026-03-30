# CSV Validator

Convert markdown scenarios to CSV and validate structure.

## When to use
- After creating or editing test scenarios
- Need to export to CSV for import into test management tools

## Process
1. Locate `testScenario{id}.md`
2. Run conversion script: `md2csv.sh {md_file_path}`
3. Run auto-fix script: `csvValidator.sh {csv_file_path}`

## Validation rules
- Header must have exactly 23 columns
- Work item row: Col 1 = "Product Backlog Item", ID not empty
- Test scenario rows: Col 1 = "Test Scenario", ID empty, State = "To Do"
- All Area/Iteration paths use single backslash (not double)
- Test result = "Not start"
- Actual Result and Reason fields must be empty

## Scripts
- Primary: `references/scripts/md2csv.sh` — parse MD, generate CSV, validate
- Auto-fix: `references/scripts/csvValidator.sh` — fix column alignment, normalize paths
