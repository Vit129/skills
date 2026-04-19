---
name: test-scenario
description: >
  This skill should be used when the user asks to "design test scenarios", "create test cases",
  "generate test data", "export to CSV", "add test scenario", "quick scenario",
  or needs the full test scenario design cycle: analyze → design → data → validate → export.
---

# Test Scenario

Design, generate, and export test scenarios for Azure DevOps.

Always read the `test-scenario-rules` skill before designing or exporting any test scenarios.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "find existing scenarios", "reuse scenarios", "check before designing" | `references/reuse-analysis.md` |
| "design test scenarios", "create test cases", "generate scenarios" | `references/designer.md` |
| "generate test data", "BVA", "pairwise", "data set" | `references/data-gen.md` |
| "export to CSV", "validate CSV", "23-column" | `references/csv-validator.md` |
| "add scenario", "quick scenario", "modify scenario" | `references/quick-scenario.md` |
| "parse scenarios", "extract automatable cases", "read CSV" | `references/test-cases.md` |

- **Reuse Analysis** — Find reusable scenarios before designing new ones. (Read `references/reuse-analysis.md`)
- **Designer** — Generate test scenarios with AI reasoning (CoT + 2026 standards). (Read `references/designer.md`)
- **Data Generation** — Smart test data collection with BVA and pairwise. (Read `references/data-gen.md`)
- **CSV Validator** — Export MD to CSV with 23-column validation. (Read `references/csv-validator.md`)
- **Quick Scenario** — Add/modify scenarios without full workflow. (Read `references/quick-scenario.md`)
- **Test Cases** — Parse existing CSV/MD scenarios and extract automatable cases. (Read `references/test-cases.md`)
