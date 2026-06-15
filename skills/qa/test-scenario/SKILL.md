---
name: test-scenario
description: >
  This skill should be used when the user asks to "design test scenarios", "ออกแบบ test scenarios",
  "create test cases", "สร้าง test cases", "generate test data", "สร้าง test data",
  "export to CSV", "export CSV", "add test scenario", "เพิ่ม test scenario",
  "quick scenario", "สร้าง scenario เร็วๆ",
  or needs the full test scenario design cycle: analyze → design → data → validate → export.
version: 1.1.0
last_improved: 2026-06-01
improvement_count: 1
---

# Test Scenario

## AIDLC Gate

⚠️ If this skill is triggered as part of a coding/QA task:
- AIDLC governance MUST be active (`.aidlc/` folder exists with DECISIONS + PLAN)
- If not → STOP and route to `governance/aidlc/` first
- Exception: pure investigation/analysis (no code changes) can proceed without AIDLC


Design, generate, and export test scenarios for Azure DevOps.

Always read the `ai-dlc/rules/test-scenario-rules/` skill before designing or exporting any test scenarios.

## Full Workflow (MANDATORY for new PBI/feature)

Execute ALL steps in order. Do NOT skip any step.

```
Step 1: Reuse Analysis       → references/reuse-analysis.md
         ↓ (scan testScenarioIndex.json, find reusable patterns)
Step 1.5: Property Definition  (Property-based testing)
         ↓ From AC, identify invariants — rules that must hold for any input
         ↓ Format: "for any [input] → [property] must hold"
         ↓ Example: "for any valid amount → total = sum(items) must always hold"
         ↓ Output: property list in Quick Review Summary (Properties section)
         ↓ Skip if: pure UI flow test with no business logic / calculation
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

## Batch Skip Guard (MANDATORY — applies when user skips any batch)

When user says "ข้าม", "skip", "ไม่ทำ", "ข้ามไป automation", or any phrase that skips Batch 2, Batch 3, or Data Generation:

**AI MUST immediately ask (via userInput or plain text if userInput unavailable):**

```
⚠️ คุณกำลังข้าม [Batch 2 / Batch 3 / Data Generation]
ขั้นตอนที่จะถูกข้ามด้วย:
- [รายการ steps ที่จะหายไป]
- Step 6: CSV Export (จะถูกข้ามด้วยถ้าข้าม Data Generation)

ต้องการ:
1. ข้ามทั้งหมดรวม CSV Export (ไม่ต้อง import Azure DevOps)
2. ข้าม Batch แต่ยัง Export CSV จาก Batch 1 ที่มีอยู่
3. ทำต่อตามปกติ (ไม่ข้าม)
```

**Rules:**
- NEVER silently skip CSV Export — always surface the consequence to user
- If user confirms skip including CSV → record in session: `csv_export_skipped = true`
- If user wants CSV from partial batches → proceed to Step 5 (Data Gen) → Step 6 (CSV Export) using only completed batches
- This guard fires ONCE per skip event — do not repeat on every message

## When to Load Each Reference

| Trigger | Load |
|---------|------|
| Starting new scenario design (always first) | `references/reuse-analysis.md` |
| After reuse analysis — identify invariants from AC | Property Definition (inline, no reference file needed) |
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
- **Silent batch skip** — user says "ข้ามไป automation" or "ไม่ทำ Batch 2" and agent silently skips CSV Export without asking → user loses Azure DevOps import. Fix: Batch Skip Guard MUST fire immediately when any batch/step is skipped — ask user whether to also skip CSV or export from partial batches.

## 📋 Quick Review Summary (MANDATORY — add to every scenario file)

Every scenario file MUST have a Quick Review Summary section at the top, before the first batch.

**Why:** Users don't read 50+ lines of HTML on first open. Summary lets reviewer approve/reject in 10 seconds without scrolling.

### Required format:

```markdown
<!-- 📋 Quick Review = สำหรับคนอ่าน | Full Detail (ด้านล่าง) = สำหรับ md2csv.sh export จริง -->
<!-- 💡 TIP: Full Detail ส่วนล่างเป็น HTML — กด Cmd+Shift+V (Markdown Preview) จะอ่านง่ายกว่า raw text -->

## 📋 Quick Review Summary

| # | Azure ID | Scenario | Spec File | Priority | Effort | Domain |
|---|----------|----------|-----------|----------|--------|--------|
| TS-001 | — | [title] | — | Critical | 2h | [domain] |
...

**Total: N scenarios | Effort: Xh | Critical: N | High: N | Medium: N**

**Coverage by domain:**
- Domain A: N (description)
- Domain B: N (description)

**Properties (invariants — from Property-based testing step):**
- for any [input] → [property] must hold
- (if no business logic → state "N/A — UI flow only")
```

**Column population timeline:**
- `Azure ID`: populated after `uploadTsToAdo.ts` runs (Phase 2.2 upload gate) — initially "—"
- `Spec File`: populated after Phase 2.4 writes each spec file — initially "—"
- Both columns start as "—" and get filled as workflow progresses

### Divider between Quick Review and Full Detail (MANDATORY):

```markdown
---
---
---

# ═══════════════════════════════════════════════════════════
# 📄 FULL DETAIL (ด้านล่างนี้คือเนื้อหาจริงสำหรับ automation)
# ═══════════════════════════════════════════════════════════

---
```

### Rules:
- Quick Review = plain markdown (readable without preview)
- Full Detail = HTML format (`<ul><li>`, `<div><ol>`) for Azure DevOps import
- The divider line MUST be visible and unambiguous
- Add `💡 TIP: กด Cmd+Shift+V` comment so reviewers know how to read HTML section
- Do NOT convert HTML in Full Detail to plain markdown — it breaks `md2csv.sh`

### Why two formats in one file:
- Quick Review: human reads → approves/rejects in 10 seconds
- Full Detail: `md2csv.sh` reads → exports to Azure DevOps
- One file, two purposes — no duplication needed

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "I'll skip reuse analysis — this is a brand new feature with nothing to reuse" | Even new features share patterns with existing scenarios (auth flows, CRUD operations, error handling). Skipping Step 1 guarantees duplicate scenarios and inconsistent naming. |
| "I'll write all 3 batches (Success + Alternative + Edge) at once to save time" | Each batch MUST pause for user approval. Dumping all at once means the user can't course-correct early — they'll reject 60% of scenarios after you've already written everything. |
| "Data generation isn't needed — the scenarios are self-explanatory" | QA cannot execute tests without concrete test data. Scenarios without data are specifications, not executable test cases. Data generation is mandatory, not optional. |
| "I'll skip CSV export — the markdown file is good enough" | Azure DevOps import requires the 23-column CSV format. Markdown stays in the repo but never reaches the test management tool. Export completes the delivery. |
| "The HTML format requirement is just cosmetic — plain markdown works fine" | Azure DevOps renders `<ul><li>` in test step fields. Plain markdown shows as raw text in the UI, making scenarios unreadable for manual testers. Format is functional, not cosmetic. |

---

## Red Flags

- 🚩 All 3 batches appear in a single output without approval pauses between them → Batch approval rule violated; split into 3 separate presentations with userInput between each.
- 🚩 Scenario file has no reuse notes or index reference → Reuse Analysis was skipped; go back and scan the index before designing.
- 🚩 Scenarios lack `Assigned to`, `Remaining Work`, or `Effort` metadata fields → CSV export will fail validation; add all required metadata before export.
- 🚩 Agent declared "done" without running CSV export + validation → Export step skipped; run export and verify 23-column output.
- 🚩 Test data section is empty or says "TBD" → Data Generation was skipped; generate Valid/Boundary/Edge data sets before finalizing.

---


## Consistency Contract

> These steps MUST execute in the same order every time this skill runs.
> Output may vary, but the workflow is fixed.
> If any step is skipped without a documented skip condition, the session-save hook will flag this skill.

## Verification

Before declaring test scenario design complete, confirm:

- [ ] Reuse analysis ran first (existing scenarios checked)
- [ ] All 3 batches delivered with user approval between each
- [ ] Every scenario has: Title, Pre-conditions, Steps, Expected Result
- [ ] Metadata complete: Test_type, Priority, Automation status, Assigned to, Effort
- [ ] Test data generated (Valid + Boundary + Edge)
- [ ] CSV export ran + validated (23 columns, RFC 4180 compliant)


---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| `rules/test-scenario-rules/` | Format standards | CSV columns, HTML format, naming conventions |
| Requirements / Acceptance Criteria | Input | Source material for scenario design |
| `testScenarioIndex.json` | Reuse index | Scan for existing reusable patterns |
| Domain knowledge (business rules) | Context | Inform edge cases and alternative flows |
| `knowledge/lessons/` | Lessons learnt | Check before execute |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After scenario batch (Success/Alternative/Edge) | Checkbox (approve/refine per batch) | After each of the 3 batches — MUST pause |
| After priority assignment | Single select (confirm priority ranking) | Before finalizing metadata |
| Batch skip decision | Single select (skip all / export partial / continue) | When user requests to skip a batch |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.

## Self-Learning

After user approves the output:

1. **Record good example:** Save approved output to `knowledge/lessons/qa-scenarios/{pattern}.md`
2. **Record failures:** If output was rejected → note what went wrong for next time
3. **Progressive update:** If a new pattern proved effective → append to relevant knowledge index
4. **Confidence tracking:** `confidence: 1.0` (user-approved) vs `confidence: 0.7` (auto-generated)

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
