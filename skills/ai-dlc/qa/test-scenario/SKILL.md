---
name: test-scenario
description: >
  This skill should be used when the user asks to "design test scenarios", "ออกแบบ test scenarios",
  "create test cases", "สร้าง test cases", "generate test data", "สร้าง test data",
  "export to CSV", "export CSV", "add test scenario", "เพิ่ม test scenario",
  "quick scenario", "สร้าง scenario เร็วๆ",
  or needs the full test scenario design cycle: analyze → design → data → validate → export.
---

# Test Scenario

Design, generate, and export test scenarios for Azure DevOps.

Always read the `ai-dlc/rules/test-scenario-rules/` skill before designing or exporting any test scenarios.

## Full Workflow (MANDATORY for new PBI/feature)

Execute ALL steps in order. Do NOT skip any step.

```
Step 1: Reuse Analysis    → references/reuse-analysis.md
         ↓ (scan testScenarioIndex.json, find reusable patterns)
Step 2: Design — Batch 1  → references/ts-design.md
         ↓ (Success cases only → write to file → show summary → wait for approval)
Step 3: Design — Batch 2  → references/ts-design.md
         ↓ (Alternative cases → write to file → show summary → wait for approval)
Step 4: Design — Batch 3  → references/ts-design.md
         ↓ (Edge cases → write to file → show summary → wait for approval)
Step 5: Data Generation   → references/data-gen.md
         ↓ (Valid/Boundary/Edge data sets → write to file → wait for approval)
Step 6: CSV Export        → references/csv-validator.md
         ↓ (run md2csv.sh → run csvValidator.sh → verify 23 columns)
Step 7: Done ✅
```

**⚠️ HARD RULES:**
- Step 1 (Reuse Analysis) is MANDATORY before any design — never skip
- Each batch (Steps 2-4) MUST pause and wait for user approval before proceeding
- Step 5 (Data Generation) is MANDATORY after design — never skip
- Step 6 (CSV Export) is MANDATORY after finalization — never skip
- AI MUST NOT self-approve any batch — always wait for user

## When to Load Each Reference

| Trigger | Load |
|---------|------|
| Starting new scenario design (always first) | `references/reuse-analysis.md` |
| Designing scenarios (batches 1-3) | `references/ts-design.md` |
| After design approved — generate test data | `references/data-gen.md` |
| After data approved — export to CSV | `references/csv-validator.md` |
| "add scenario", "quick scenario", "modify scenario" | `references/quick-scenario.md` |
| "parse scenarios", "extract automatable cases", "read CSV" | `references/scenario-reader.md` |
| "extract test cases for automation" | `references/test-cases.md` |

## Reference Descriptions

- **Reuse Analysis** — Scan `testScenarioIndex.json` for reusable patterns before designing. (Read `references/reuse-analysis.md`)
- **Designer** — Generate scenarios in 3 batches (Success → Alternative → Edge) with batch approval. HTML format for Azure DevOps. (Read `references/ts-design.md`)
- **Data Generation** — BVA + pairwise test data sets after scenario design. (Read `references/data-gen.md`)
- **CSV Validator** — Export MD → CSV with 23-column validation via `md2csv.sh` + `csvValidator.sh`. (Read `references/csv-validator.md`)
- **Quick Scenario** — Add/modify scenarios without full workflow (surgical edits only). (Read `references/quick-scenario.md`)
- **Scenario Reader** — Parse existing CSV/MD and extract automatable cases. (Read `references/scenario-reader.md`)
- **Test Cases** — Extract automatable test cases filtered by platform and priority. (Read `references/test-cases.md`)

## Shortcut Commands

| Command | Skips | Use when |
|---------|-------|----------|
| Full workflow (default) | Nothing | New PBI, new feature |
| Quick scenario | Steps 1, 5, 6 | Adding/modifying 1-2 scenarios to existing file |
| Export only | Steps 1-5 | Scenarios already designed, just need CSV |
| Read only | Steps 1-6 | Parsing existing scenarios for automation |

## ⚠️ Gotchas (common mistakes to avoid)

- **Skipping reuse-analysis** — agent designs from scratch without checking existing patterns → wasted effort, duplicate scenarios
- **Bulk batch dump** — agent writes all 3 batches at once without pausing for approval → user cannot review incrementally
- **Missing HTML format** — agent uses plain markdown instead of `<ul><li>` format → Azure DevOps import fails
- **Missing metadata** — agent omits `Assigned to`, `Remaining Work`, `Effort` fields → CSV export incomplete
- **Skipping data-gen** — agent finishes scenarios without generating test data → QA has no data to run tests with
- **Skipping CSV export** — agent considers Phase 2.2 done without running `md2csv.sh` + `csvValidator.sh` → scenarios not importable to Azure DevOps
