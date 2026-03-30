---
name: test-scenario
description: >
  This skill should be used when the user asks to "design test scenarios", "generate test data",
  "find reusable test cases", "export to CSV", "validate CSV", or needs AI-driven scenario
  generation, BVA/Pairwise test data, reuse analysis, or CSV export for test management.
---

# Test Scenario Skills

Design, generate, and manage test scenarios end-to-end.

Before designing or exporting test scenarios, always read the `test-scenario-rules` skill first.

- **Scenario Designer** — Generate Happy Path, Alternative, and Edge cases using CoT. (Read `references/designer.md`)
- **Test Data Generation** — Smart data collection with BVA/Pairwise. (Read `references/data-gen.md`)
- **Reuse Analysis** — Find similar test patterns before designing new. (Read `references/reuse-analysis.md`)
- **Quick Scenario** — Surgical edits to existing scenarios without full workflow. (Read `references/quick-scenario.md`)
- **CSV Validator** — Validate and export scenarios to CSV. (Read `references/csv-validator.md`)

## Rules (in `test-scenario-rules` skill)
- Design Guidelines — title format, priority levels, paired design
- CSV Export Rules — 23-column format, validation checklists
