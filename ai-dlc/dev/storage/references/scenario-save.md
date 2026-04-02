# Test Scenario Knowledge Save

Save completed Test Scenario PBIs to central index and extract test data patterns.

## Process
1. Extract test data from `testScenarioPbi{pbi_id}.md` → `## 📊 Test Data Definitions`
2. Extract tester email from `### Assign To:` section
3. Update `qaAssignTo.json` — merge projects/tags, single tester entry
4. Save test data: `testDataPbi{pbi_id}.json` in feature folder
5. Update `testScenarioIndex.json` — add/update PBI entry with paths

## File Schemas

### testDataPbi{id}.json
```json
{
  "version": "1.0.0",
  "system": "[SYSTEM_CAMEL]",
  "feature": "[SYSTEM_FEATURE_CAMEL]",
  "lastUpdated": "YYYY-MM-DD",
  "test_data": [{
    "id": "TD_001",
    "description": "...",
    "category": "success|alternative|edge",
    "data": { "field1": "value1" },
    "validation_rules": { "field1": "BL_XXX" },
    "tags": ["tag1"]
  }]
}
```

### qaAssignTo.json
- Same email → merge projects and tags, update lastUsed
- Different email → replace email, merge projects/tags
- Always single tester in array

## Rules
- AI-Direct Mode: write all JSON files directly
- Self-validate JSON before every write
- Category must be one of: "success", "alternative", "edge"
