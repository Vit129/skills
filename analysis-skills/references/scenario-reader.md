# Scenario Reader

Parse test scenario files (CSV/Markdown) and extract automatable test cases.

## When to use
- Have existing test scenarios in CSV or Markdown format
- Need to filter for automatable cases only
- Need to extract metadata (system, feature, business rules) from scenario files

## How it works
1. **Read CSV file** — locate `testScenario{ID}.csv` in test-scenario directory
2. **Filter automatable** — keep only rows where Automation Status = "Automatable"
3. **Filter by type and priority:**
   - API → include all priorities (Critical, High, Medium, Low)
   - Web UI → include Critical and High only
   - Mobile → include Critical and High only
4. **Extract metadata from MD file** — system name, feature name, business rules
5. **Output as simple list** — not complex tables

## Output per test case
```
TS-001: [Title]
- Priority: [Critical/High/Medium/Low]
- Test Steps: [numbered list]
- Expected Results: [list]
```

## Tips
- If no matching test type found, offer to derive cases from available types
- Always verify both CSV and MD files exist before starting
- Use simple list format for readability
