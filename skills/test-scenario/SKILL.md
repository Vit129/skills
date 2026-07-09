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

Always read `test-scenario-rules` before designing or exporting.

## Requirements Source (before Step 1)

Where the requirements come from is project-specific — this skill doesn't hardcode a tracker:
- Already have them via `/spec` (interview) → use `agent-memory/plans/[feature]/GLOSSARY.md` directly
- Tracked in Jira/Azure DevOps/Linear/etc. → pull with a script you write for that tracker's API, or paste the issue text manually
- Neither → run `/spec` first to extract them

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
1. ข้ามทั้งหมดรวม Export (ไม่ต้อง upload tracker)
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

| Command | Skips | Use when |
|---------|-------|----------|
| `/ts new` | Nothing | New PBI, new feature |
| `/ts quick` | Steps 1, 5, 6 | Adding/modifying 1-2 scenarios to existing file |
| `/ts export` | Steps 1-5 | Scenarios already designed, just need CSV |
| `/ts read` | Steps 1-6 | Parsing existing scenarios for automation |

## Gotchas

- **Skipping reuse analysis** — designing from scratch without checking existing patterns → duplicate scenarios
- **Bulk batch dump** — writing all 3 batches at once without pausing → user can't course-correct early
- **Missing HTML format** — plain markdown instead of `<ul><li>` in Full Detail → import fails on trackers that expect rich-text steps
- **Missing metadata** — omitting `Assigned to`/`Remaining Work`/`Effort` → CSV export incomplete
- **Skipping data-gen** — finishing scenarios without test data → QA has no data to run tests with
- **Skipping CSV export** — considering the work done without running `md2csv.sh` + `csvValidator.sh` → not importable to the tracker

## Anti-Rationalization

| Excuse | Counter |
|---|---|
| "New feature, nothing to reuse" | Auth flows, CRUD, error handling repeat across features. Skip reuse analysis → duplicate scenarios and inconsistent naming. |
| "I'll write all 3 batches at once to save time" | User can't course-correct until you're already done. Batch approval exists to catch this early. |
| "Scenarios are self-explanatory, skip data gen" | QA can't execute a test without concrete data. A scenario without data is a spec, not a test case. |
| "Markdown is good enough, skip CSV export" | Your tracker's import needs the structured CSV. Markdown never reaches the test management tool without it. |

## Red Flags

- 🚩 All 3 batches in one output, no approval pause between them
- 🚩 No reuse notes / index reference in the scenario file
- 🚩 Missing `Assigned to`/`Remaining Work`/`Effort` metadata
- 🚩 Declared done without running CSV export + validation
- 🚩 Test data section empty or "TBD"

## Verification

Before declaring test scenario design complete:
- [ ] Reuse analysis ran first
- [ ] All 3 batches delivered with user approval between each
- [ ] Every scenario has Title, Pre-conditions, Steps, Expected Result
- [ ] Metadata complete (Test_type, Priority, Automation status, Assigned to, Effort)
- [ ] Test data generated (Valid + Boundary + Edge)
- [ ] CSV export ran and validated (23 columns, RFC 4180)

## Required Context

| Dependency | Purpose |
|-----------|---------|
| `test-scenario-rules` | CSV columns, HTML format, naming conventions |
| Requirements / acceptance criteria | Source material for scenario design |
| `testScenarioIndex.json` | Reuse index — scan for existing patterns |
| `knowledge/lessons/` | Check before designing |

## Human-in-the-Loop Points

| Step | Approval | When |
|------|----------|------|
| Each scenario batch (Success/Alternative/Edge) | Approve/refine per batch | After each of the 3 batches — must pause |
| Priority assignment | Confirm ranking | Before finalizing metadata |
| Batch skip | Skip all / export partial / continue | Whenever a batch/step is skipped |

## Self-Learning

After a scenario file is approved:
1. Save the approved pattern to `knowledge/lessons/qa-scenarios/{pattern}.md`
2. If rejected — note what went wrong before retrying
3. If a new pattern proves effective across 3+ features — promote to `knowledge/{domain}.md`
