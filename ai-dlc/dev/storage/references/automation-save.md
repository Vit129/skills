# Automation Knowledge Save

Save technical automation knowledge (components, test data, lessons) for API/Web UI/Mobile workflows.

## Scope
- ✅ Technical patterns: code patterns, utilities, helpers
- ✅ API documentation: endpoint specs, schemas, request/response formats
- ✅ UI components: page objects, locators, interaction patterns
- ✅ Test data: fixtures, mock data, environment configs
- ✅ Technical lessons: reflexion logs, debugging insights
- ❌ NOT business rules or domain knowledge (use `business-save.md`)

## Process by Workflow Type

### API Automation
1. Save test data: `fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Data.sit.ts`
2. Save lessons: `ai-agent/knowledge/lessons/api/apiLes[Category].json`
   - Categories: validation, authentication, error_handling, performance
3. Update `apiIndex.json`

### Web UI Automation
1. Save test data: `fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Data.sit.ts`
2. Save UI labels: `fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Labels.ts` (TH/EN)
3. Save lessons: `ai-agent/knowledge/lessons/webUi/webUiLes[Category].json`
   - Categories: locators, interactions, waits, assertions, components
4. Update `webUiIndex.json` with components and page_objects

### Mobile Automation
1. Save test data: `fixtures/[platform]/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Data.sit.yaml`
2. Save UI labels: `fixtures/[platform]/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Labels.yaml` (TH/EN)
3. Save lessons: `ai-agent/knowledge/lessons/mobile/mobileLes[Category].json`
   - Categories: locators, app_management, gestures, performance

## Lesson Schema
```json
{
  "id": "LESSON-[TYPE]-001",
  "type": "improvement | mistake | discovery",
  "summary": "One-line description (max 100 chars)",
  "detail": "Full explanation with context",
  "impact": "How this affects future development",
  "source": "Reference to Reflexion Log or code location",
  "created_at": "YYYY-MM-DD"
}
```

## Rules
- AI-Direct Mode: write all JSON/TS files directly, no shell scripts
- Self-validate JSON structure before every write (braces, quotes, no trailing commas)
- Deduplicate by id when merging with existing files
- Update implementation plan save status after successful save
- Verify at least one file was written before returning success
