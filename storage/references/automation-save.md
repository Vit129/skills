# Automation Knowledge Save

Save technical automation patterns, test data, and lessons learned.

## When to use
- After completing an automation workflow
- Discovered a reusable technical pattern
- Need to archive lessons from test execution

## What to save (by workflow type)
- **API:** request/response templates, auth patterns, error handling, data transformation
- **Web UI:** page object patterns, locator strategies, component patterns, wait strategies
- **Mobile:** keyword patterns, gesture interactions, app management, platform-specific logic

## Lesson format
- `type`: improvement / mistake / discovery
- `summary`: one-line description (max 100 chars)
- `detail`: full explanation with context
- `impact`: how this affects future development
- `source`: reference to code location

## File structure
```
tests/{type}-testing/fixtures/{system}/{feature}/[feature]Data.ts    — test data
knowledge/lessons/{type}/[type]Les{Category}.json                    — lessons
knowledge/automation/{type}/{type}Index.json                         — index
```

## Rules
- Technical scope only — no business rules here
- Validate JSON structure before writing
- Deduplicate lessons by ID
- At least one file must be written — verify before returning success
