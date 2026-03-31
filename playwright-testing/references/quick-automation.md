# Quick Automation

Add or modify test scripts without running the full QA workflow.

## When to use

- "เพิ่ม test", "แก้ test script", "patch test"
- Adding test cases to existing spec files
- Fixing test logic without re-architecting

## Scope Check (Decision Tree)

Before making changes, classify the scope:

| Scope | Action | Example |
|-------|--------|---------|
| Quick | Fix in place, no new files | Fix assertion, update locator, add 1 test case |
| Phase 2 (Architecture) | Re-run QA architecture design | New service class needed, new page object |
| Phase 3 (Code Gen) | Re-run code generation | New spec file, new helper structure |
| Full Workflow | Start from test scenario design | New feature, new domain, DB schema change |

## Process

1. Read existing spec file and understand current structure
2. Read coding rules (`playwright-rules` or `robotframework-rules`)
3. Classify scope using decision tree above
4. If Quick → proceed below. If not → escalate (see Escalation)
5. Adversarial review before proposing changes:
   - Does the change break existing tests?
   - Does it follow naming conventions (SYSTEM_KEBAB/SYSTEM_FEATURE_KEBAB)?
   - Does it comply with AAA pattern, mandatory tags, locator priority?
   - Is test data in fixtures (not hardcoded)?
6. Propose changes to user → wait for approval
7. Implement changes
8. Run tests → verify PASS
9. If tests fail → heal (max 3 attempts, then escalate)

## Escalation Triggers

MUST route back to full workflow when:
- New multi-file service needed (e.g., new DbService, new ApiService)
- Data storage schema change (new table, new column, new spreadsheet tab)
- Locator style change affecting multiple files (e.g., switch from id to testId)
- New platform added (e.g., adding mobile tests to API-only feature)
- More than 3 spec files need modification
- Architecture pattern change (e.g., from flat to multi-service)

When escalating, inform user:
```text
⚠️ Scope ใหญ่เกินสำหรับ Quick Automation
เหตุผล: {reason}
แนะนำ: รัน full workflow ตั้งแต่ {phase name}
```

## Platform Compliance

Before saving, verify per platform:

| Platform | Check |
|----------|-------|
| Playwright API | Schema validation (AJV), auth via globalSetup, fixtures in .ts |
| Playwright Web | Page Object Model, locator priority, storageState auth |
| Robot Framework | Identical keyword names cross-platform, YAML fixtures, accessibility_id first |
