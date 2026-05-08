# Test Cases Reader

Parse test scenario files (CSV/Markdown) and extract automatable test cases.

## When to use
- Have existing test scenarios in CSV or Markdown format
- Need to filter for automatable cases only
- Need to extract metadata (system, feature, business rules)

## Process
1. Read CSV file: `testScenario{ID}.csv`
2. Filter: Automation Status = "Automatable"
3. Filter by type and priority based on workflow_type:
   - `api_automation` → Test_type = "API" → include all priorities
   - `webui_automation` → Test_type = "Web UI" → Critical and High only
   - `android_automation` → Test_type = "Android"/"Mobile" → Critical and High only
   - `ios_automation` → Test_type = "iOS"/"Mobile" → Critical and High only
4. Extract metadata from MD file: system name, feature name, business rules
5. Output as simple list (not complex tables)

## Derive Mode
When test scenarios exist for one platform but not another:
1. Read existing scenarios
2. Derive equivalent for target platform:
   - UI "fill form and submit" → API "POST with same data"
   - UI "verify display" → API "GET and verify response"
3. Tag derived scenarios with `[DERIVED-FROM-UI]` or `[DERIVED-FROM-API]`
4. Show derived scenarios to user for approval

## Output per test case
```
TS-001: [Title]
- Priority: [Critical/High/Medium/Low]
- Test Steps: [numbered list]
- Expected Results: [list]
```

## Rules
- If 0 rows remain after filter → warn user and offer to derive or stop
- Always verify both CSV and MD files exist before starting
- Write test cases in simple list format (NOT table) to implementation plan
