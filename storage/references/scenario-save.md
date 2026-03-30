# Scenario Knowledge Save

Save completed test scenarios to central index and extract test data patterns.

## When to use
- After test scenario design is complete and approved
- Need to update the central scenario index

## What to save
1. **Test data** — extract TD_XXX items from scenario file, save as `testData{id}.json`
2. **Tester assignment** — update `qaAssignTo.json` with tester email and project tags
3. **Scenario index** — update `testScenarioIndex.json` with paths to CSV, MD, and test data

## File structure
```
tests/test-scenario/{system}/{feature}/testData{id}.json     — test data per feature
tests/test-scenario/testScenarioIndex.json                    — central index
tests/test-scenario/qaAssignTo.json                           — tester assignments
```

## Test data format
```json
{
  "id": "TD_001",
  "description": "what this data represents",
  "category": "success | alternative | edge",
  "data": { "field1": "value1" },
  "validation_rules": { "field1": "BL_XXX" }
}
```

## Rules
- Validate JSON structure before writing
- Tester assignment: single tester, merge projects/tags on update
- Deduplicate index entries by ID
