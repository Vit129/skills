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
2. Save lessons: `{knowledge_root}/lessons/api/apiLes[Category].json`
   - Categories: validation, authentication, error_handling, performance
3. Update `apiIndex.json`

### Web UI Automation
1. Save test data: `fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Data.sit.ts`
2. Save UI labels: `fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Labels.ts` (TH/EN)
3. Save lessons: `{knowledge_root}/lessons/webUi/webUiLes[Category].json`
   - Categories: locators, interactions, waits, assertions, components
4. Update `webUiIndex.json` with components and page_objects

### Mobile Automation
1. Save test data: `fixtures/[platform]/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Data.sit.yaml`
2. Save UI labels: `fixtures/[platform]/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Labels.yaml` (TH/EN)
3. Save lessons: `{knowledge_root}/lessons/mobile/mobileLes[Category].json`
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

## Score Update (after saving lesson)

After saving a lesson to a lesson file, update the score in the corresponding index file:

- Test PASS → `effectiveness.applied_count += 1`, `last_used = today`
- Test FAIL (lesson prevented it) → `effectiveness.prevented_failures += 1`
- New auto-captured lesson → `effectiveness.confidence = 0.75`, `auto_captured = true`

Conflict check before save:
1. Load existing index
2. Same id + same content → skip (increment `applied_count` only)
3. Same id + different content → create new entry with `-v2` suffix
4. Contradicting existing lesson → flag for human review, do NOT save
5. Log: "✅ Knowledge updated: {id} effectiveness {before}→{after}"

Index files to update:
- API lessons → `{knowledge_root}/lessons/api/apiLessonsIndex.json`
- Web UI lessons → `{knowledge_root}/lessons/webUi/webUiLessonsIndex.json`
- Mobile lessons → `{knowledge_root}/lessons/mobile/mobileLessonsIndex.json`
- Template used → `{knowledge_root}/automation/{platform}/{platform}Index.json` → `utility_score += 0.5`, `usage_count += 1`
