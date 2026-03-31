# Scenario Designer

Generate detailed test scenarios using AI reasoning (CoT).

## When to use
- Designing test scenarios for a new feature
- Need comprehensive coverage: Success + Alternative + Edge cases

## Process
1. Load design guidelines and tester assignment
2. Run Chain of Thought internally — requirements analysis, scenario identification, self-review
3. Generate scenarios in 3 batches:
   - Batch 1: Success Cases (happy path) → show summary → wait for approval
   - Batch 2: Alternative Cases (error handling, validations) → show summary → wait for approval
   - Batch 3: Edge Cases (BVA, null, special chars, concurrency) → show summary → wait for approval

## Title format
`[TestType][Prefix] + Verb + Object + Context`
- TestType: `[API]`, `[UI]`, `[Mobile]`, `[Tablet]`
- Prefix: `[Success]`, `[Alternative]`
- Forbidden: never start with "ทดสอบ" or "ตรวจสอบ"

## Content language
All content (Title, Pre_conditions, Test Steps, Expected Result) in Thai. Technical terms allowed.

## HTML Format (for Azure DevOps CSV import)

- Pre_conditions: use `<ul><li>...</li></ul>` for lists
- Test Steps: use `<br>` for line breaks between steps
- Expected Result: use `<br>` for line breaks

## Tester Assignment

Read `qaAssignTo.json` (if exists in project) for tester email mapping.
If not found → use default or ask user.

## Edge Case Types

Include these edge case categories in Batch 3:
- BVA (Boundary Value Analysis): min, max, min-1, max+1
- Null/Empty: null, empty string, whitespace
- Special Characters: Thai, emoji, SQL injection, XSS
- Concurrency: simultaneous edits, race conditions
- Temporal Mismatch: timezone differences, expired sessions, stale data
- Semantic Equivalence: different inputs that should produce same result
- Rollback: what happens if operation fails midway?

## Rules
- Never proceed without user approval per batch
- API + UI scenarios must be separate items (paired design)
- Map every scenario to at least one Acceptance Criteria or Business Rule
- Include metadata: Test_type, Priority level, Automation test status, Assigned to, Effort

## Output File Structure (MANDATORY)

```text
tests/test-scenario/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/
├── testScenario[SystemFeature].md    — scenario document
└── testScenario[SystemFeature].csv   — CSV export for Azure DevOps
```
- `[SYSTEM_KEBAB]` = system name in kebab-case (e.g., `shopee`)
- `[SYSTEM_FEATURE_KEBAB]` = feature name in kebab-case (e.g., `shopee-payment`)
- `[SystemFeature]` = feature name in PascalCase (e.g., `ShopeePayment`)
- MUST follow this structure — do not flatten or skip levels
