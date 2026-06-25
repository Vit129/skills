---
name: test-scenario
description: >
  skill used when user asks "design test scenarios", "ออกแบบ test scenarios",
  "create test cases", "สร้าง test cases", "generate test data", "สร้าง test data",
  "export to CSV", "export CSV", "add test scenario", "เพิ่ม test scenario",
  "quick scenario", "สร้าง scenario เร็วๆ", needs full test scenario design cycle:
  analyze → design → data → validate → export.
version: 1.2.0
last_improved: 2026-06-25
improvement_count: 2
---

# Test Scenario

## AIDLC Gate

⚠️ If triggered as part of a coding/QA task:
- AIDLC governance MUST be active (`.aidlc/` folder, DECISIONS + PLAN)
- If not → STOP, route `governance/aidlc/` first
- Exception: pure investigation/analysis can proceed without AIDLC

Always read `test-scenario-rules` before designing or exporting.

## Full Workflow (MANDATORY for new PBI/feature — execute ALL steps in order)

```
Step 1: Reuse Analysis        → references/reuse-analysis.md
Step 1.5: Property Definition → (inline) identify AC invariants: "any [input] → [property] must hold"
Step 2: Batch 1 — Success     → references/ts-design.md  → write file → summary → wait approval
Step 3: Batch 2 — Alternative → references/ts-design.md  → write file → summary → wait approval
Step 4: Batch 3 — Edge        → references/ts-design.md  → write file → summary → wait approval
Step 5: Data Generation       → references/data-gen.md   → write file → wait approval
Step 6: CSV Export            → references/csv-validator.md → run md2csv.sh → run csvValidator.sh
Step 7: Done ✅
```

**Hard rules:** Reuse Analysis is mandatory before design. Each batch MUST pause for user approval. AI MUST NOT self-approve. Data Gen and CSV Export are never optional.

## Batch Skip Guard (fires immediately on any skip signal)

If user says "ข้าม", "skip", "ข้ามไป automation", or skips any batch:

```
⚠️ คุณกำลังข้าม [Batch X / Data Generation]
ขั้นตอนที่จะถูกข้ามด้วย: [รายการ]
ต้องการ:
1. ข้ามทั้งหมดรวม Export (ไม่ต้อง Azure DevOps)
2. ข้าม แต่ยัง Export CSV จากที่มีอยู่
3. ทำต่อตามปกติ (ไม่ข้าม)
```

- NEVER silently skip CSV Export — always surface consequence to user
- Guard fires ONCE per skip event, not repeatedly

## When to Load Each Reference

| Trigger | Load |
|---------|------|
| Starting new scenario design (always first) | `references/reuse-analysis.md` |
| Designing scenarios (batches 1-3) | `references/ts-design.md` |
| After design approved — generate test data | `references/data-gen.md` |
| After data approved — export CSV | `references/csv-validator.md` |
| "add scenario", "quick scenario", "modify scenario" | `references/quick-scenario.md` |
| "parse scenarios", "extract automatable cases", "read CSV" | `references/scenario-reader.md` |
| "extract test cases for automation" | `references/test-cases.md` |
| Quick Review Summary format | `references/quick-review-format.md` |

## Shortcut Commands

| Command | Action |
|---------|--------|
| `/ts new` | Start Full Workflow from Step 1 |
| `/ts quick` | Quick scenario (surgical edit only) |
| `/ts export` | Jump to CSV Export (Step 6) |
| `/ts read` | Parse existing scenario file |
