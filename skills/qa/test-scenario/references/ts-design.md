# Scenario Designer

Generate detailed test scenarios and steps using AI reasoning, adhering to 2026 design standards.

## When to use
- Designing test scenarios for a new PBI
- After PO analysis and context analysis are done

## Title Format (Mandatory)
`[TestType][Prefix] + Verb (Thai) + Object + Context`
- TestType: `[API]`, `[UI]`, `[Mobile]`, `[Tablet]`
- Prefix: `[Success]`, `[Alternative]`
- Forbidden: Do NOT start with "ทดสอบ" or "ตรวจสอบ"
- Note: Title uses `[UI]` but Test_type field uses `Web UI`

## Language
- All content (Title, Brief Description, Pre_conditions, Test Steps, Expected Result) MUST be in Thai
- Technical terms can be used in Thai script (e.g., คลิกปุ่ม, เลือก Dropdown)

## Process
1. Load `ai-dlc/rules/test-scenario-rules/references/ts-standards.md` for design standards
2. Check `## QA Config` section below for `qaEmail` — if empty, ask user via `userInput` then save it here
3. **Figma Analysis (MANDATORY — run ONCE before Batch 1, applies to ALL platforms):**
   - Load `ux-ui/ui-designer/references/figma.md`
   - Follow Step 1: Check for Visual Context — if PBI has Figma links → try to access (2 attempts max)
   - If no Figma link → ask user to upload screenshot or type "ไม่มีรูปภาพ"
   - Follow Step 2+3: Extract screens, components, interactions, Visual-to-Business Rules mapping
   - Output: figma analysis saved to `.aidlc/[system]/[feature]/outputs/inception/figma-analysis.md`
   - **Run once** — reuse the same output for API, Web UI, and Mobile batches (do NOT re-run per platform)
   - API batch uses: User Flow, business rules, endpoint names, field names, workflow
   - Web UI / Mobile batch uses: UI components, button names, modal behavior, states, interactions
   - **Skip only if:** user explicitly says "ไม่มีรูปภาพ" AND no Figma link in PBI → write "No visual context" and continue
4. Execute Chain-of-Thought (internal only — never show to user)
5. Generate scenarios in 3 sequential batches:

**Batch 1: Success Cases**
- End-to-end positive flows
- Write to file → show summary → ask approval → wait

**Batch 2: Alternative Cases**
- Constraint verification, BL_XXX validations
- Write to file → show summary → ask approval → wait

**Batch 3: Edge Cases**
- BVA (Min-1, Max+1), Null, Special Chars, concurrent state, temporal mismatch, semantic equivalence (e.g., "sesame"="งา"), rollback
- Write to file → show summary → ask approval → wait

## Metadata (Mandatory for CSV Export)
- `Test_type`: API / Mobile UI / Web UI / WindowsApp UI / Other
- `Priority level`: Critical / High / Medium / Low
- `Automation test status`: Automated / Automatable / Cannot automate
- `Assigned to`: tester email from `## QA Config` section in this file
- `Remaining Work` / `Effort`: hours — use scale below

### Effort Scale (ALL platforms: API, Web UI, Mobile UI)

| Level | Effort | Examples |
|-------|--------|---------|
| **Simple** | 1 hr | Single endpoint, 1-2 assertions, no DB, no auth |
| **Standard** | 1.5–2 hr | Multi-step flow, schema validation, basic auth, form submit |
| **Complex** | 2–3 hr | Multi-page flow, DB verify, edge cases, mock setup |
| **Full** | 3–5 hr | E2E flow (search→book→pay→confirm), multi-service, stateful |

- **Remaining Work** = **Effort** for new cases
- Use midpoint when unsure (e.g., Standard → 2 hr)

## Format (HTML for Azure DevOps)
- Pre_conditions: `<div>...<br>...</div>` format
- Test Steps: `<div><ol style="box-sizing:border-box;padding-left:40px;"><li style="box-sizing:border-box;">...</li></ol></div>` format
- Expected Result: `<div>...<br>...</div>` format

## Output Format (Mandatory)

> ⚠️ This format must match exactly down to every character — md2csv.sh parses using an exact match regex

```markdown
#### Test Scenario: TS-[NNN] - [TestType][Prefix] Verb + Object

**Pre_conditions:**
<ul><li>Condition 1</li><li>Condition 2</li></ul>

**Test Steps with test data:**
<div><ol style="box-sizing:border-box;padding-left:40px;"><li style="box-sizing:border-box;">Action 1</li><li style="box-sizing:border-box;">Action 2</li></ol></div>

**Expected test result:**
<ul><li>Result 1</li><li>Result 2</li></ul>

**Test_type:** [API/Mobile UI/Web UI/WindowsApp UI/Other]
**Priority level:** [Critical/High/Medium/Low]
**Automation test status:** [Automated/Automatable/Cannot automate]
**Assigned to:** [Tester email from ## QA Config section]
**Remaining Work:** [Hours]
**Effort:** [Hours]
```

### PBI Header (MANDATORY — must appear at top of file before any scenario)

```markdown
**PBI-ID:** [PBI numeric ID e.g. 275957]
**ID Title:** [PBI title]
**State:** To Do
**Priority:** 2
**Area:** [System]\[Feature]
**Iteration:** [System]\Sprint [N]
**Assigned To (PO):** [PO email]

### Assign To: [QA email]
```

### File & Folder Naming (MANDATORY)

| What | Pattern | Example |
|------|---------|---------|
| MD filename (API) | `testScenarioPbi{ID}-api.md` | `testScenarioPbi275957-api.md` |
| MD filename (Web UI) | `testScenarioPbi{ID}-web-ui.md` | `testScenarioPbi275957-web-ui.md` |
| MD filename (Mobile) | `testScenarioPbi{ID}-mobile.md` | `testScenarioPbi275957-mobile.md` |
| Test scenario folder | `pbi-{ID}-{feature-kebab}` | `pbi-275957-document-status-reason` |

> **Why separate files per platform:**
> - `md2csv.sh` exports one CSV per file — mixed `Test_type` in one file causes Azure DevOps import issues
> - Upload script (`upload-test-cases.ts`) processes one platform CSV at a time
> - Phase 2.4 automation lives in separate folders (`api-testing/` vs `web-testing/`) — matching TS files keeps traceability clean

> **Paired design rule (Section 7 of ts-standards.md):** Design API + UI scenarios as pairs so user can choose which to keep — but store them in **separate files**, not combined.

> **Why:** `md2csv.sh` parses PBI ID from filename via regex `testScenario(\d+)` — wrong filename = empty ID in CSV.

### Format Rules (for md2csv.sh compatibility)

| Element | Correct | Wrong |
|---------|---------|-------|
| Scenario heading | `#### Test Scenario: TS-001 - Title` | `### Test Scenario:` (3 hashes) |
| Pre_conditions | `<ul><li>...</li></ul>` | `<div>...<br>...</div>` |
| Expected result | `<ul><li>...</li></ul>` | `<div>...<br>...</div>` |
| Test Steps | `<div><ol style="..."><li style="...">...</li></ol></div>` | plain text |
| JSON in steps | single quotes `{'key': 'value'}` | double quotes `{"key": "value"}` |
| Path separator | single backslash `\` | double backslash `\\` |

## Rules
- API+UI Pairing: separate scenarios (TS-001 API, TS-002 UI) — NOT combined
- If requirement unclear / missing AC → ask user for clarification, do NOT guess
- AI MUST NOT approve by itself — always wait for user
- Accepted approval keywords: "อนุมัติ", "โอเค", "ok", "ได้เลย", "ผ่าน", "ใช่", "approve", "yes"
- Title has NO TS ID prefix — format is `[TestType][Prefix] Verb + Object` only
- Brief Description: optional, use only for complex scenarios

---

## QA Config

> Auto-saved by agent when user provides QA email. Edit directly if needed.

| Field | Value |
|-------|-------|
| `qaEmail` | |

**Rules:**
- If `qaEmail` is empty → ask user via `userInput` before starting TS design
- After user confirms → save email to the `qaEmail` row above immediately
- Use this email for `Assigned to` field in all TS in this session
