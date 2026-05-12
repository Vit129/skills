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
1. Load `testScenario2026.md` standards
2. Load tester assignment from `qaAssignTo.json`
3. Execute Chain-of-Thought (internal only — never show to user)
4. Generate scenarios in 3 sequential batches:

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
- `Assigned to`: tester email from qaAssignTo.json
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

```markdown
### Test Scenario: [TS_ID] - [Title]
**Title:** [TestType][Prefix] คำกริยา + Object + Context

**Brief Description:** (Optional - Use only for complex scenarios)
[Description text]

**Pre_conditions:** (HTML format)
<div>Condition 1<br>Condition 2</div>

**Test Steps with test data:** (HTML format)
<div><ol style="box-sizing:border-box;padding-left:40px;"><li style="box-sizing:border-box;">Action 1</li><li style="box-sizing:border-box;">Action 2</li></ol></div>

**Expected test result:** (HTML format)
<div>Result 1<br>Result 2</div>

**Test_type:** [API/Mobile UI/Web UI/WindowsApp UI/Other]
**Priority level:** [Critical/High/Medium/Low]
**Automation test status:** [Automated/Automatable/Cannot automate]
**Assigned to:** [Tester email from qaAssignTo.json]
**Remaining Work:** [Hours]
**Effort:** [Hours]
```

## Rules
- API+UI Pairing: separate scenarios (TS-001 API, TS-002 UI) — NOT combined
- If requirement unclear / missing AC → ask user for clarification, do NOT guess
- AI MUST NOT approve by itself — always wait for user
- Accepted approval keywords: "อนุมัติ", "โอเค", "ok", "ได้เลย", "ผ่าน", "ใช่", "approve", "yes"
- Title has NO TS ID prefix — format is `[TestType][Prefix] Verb + Object` only
- Brief Description: optional, use only for complex scenarios
