# Test Scenario - CSV Export Rules

## 1. CSV Format

- Encoding: UTF-8 (No BOM)
- Delimiter: Comma
- Line breaks: `<br>` only (no `\n` in content)
- Quotes: Wrap fields containing commas, semicolons, or `<br>`

## 2. 23 Columns

1. Work Item Type ("Product Backlog Item" / "Test Case")
2. ID (numeric for PBI, empty for TS)
3. State (PBI = state, TS = "To Do")
4. Title 1 (PBI title, TS = empty)
5. Title 2 (PBI = empty, TS = scenario title)
6. Priority (PBI = number, TS = empty but keep comma)
7. Pre_conditions (HTML: `<div>...<br>...</div>`)
8. Test steps with test data (HTML: `<div><ol style="box-sizing:border-box;padding-left:40px;"><li style="box-sizing:border-box;">...</li></ol></div>`)
9. Expected test result (HTML: `<div>...<br>...</div>`)
10. Actual test result (empty)
11. Test result ("Not start")
12. Priority level (Critical/High/Medium/Low)
13. Test_type (API/Web UI/Mobile UI/WindowsApp UI/Other)
14. Automation test status (Automated/Automatable/Cannot automate)
15. Cannot automate reason (if "Cannot automate")
16. Reason (empty)
17. Area Path (single backslash, quoted)
18. Iteration Path (single backslash, quoted)
19. Tags (sprint tag format: `YYYYSPxx`, e.g. `2026SP52` — ask user to confirm before export, default = current sprint year+number)
20. Assigned To — **PBI row:** PO/BA email from `System.AssignedTo` of the PBI (auto-populated from ADO) | **TS row:** QA executor email (from user input at session start)
21. Remaining Work (hours)
22. Effort (hours)
23. Actual Effort (empty)

## 3. Data Handling Rules

- JSON data: single quotes `{'key': 'value'}` (double quotes break CSV)
- Paths: single backslash only, never double `\\`
- Each row: exactly 22 commas (23 columns)
- Fields with commas/backslashes/`<br>`: must be quoted

## 4. PBI Row Rules

- Columns 7-16 must be empty (10 commas between Priority and Area Path)
- Columns 21-23 empty (3 commas)
- Title in column 4 with quotes
- Column 20 (Assigned To): **MUST** fetch from ADO via `az boards work-item show --id {PBI_ID} --query "fields.\"System.AssignedTo\".uniqueName"` — NEVER leave empty or hardcode

## 5. Test Scenario Row Rules

- Column 1: "Test Case"
- Column 2: empty (ID)
- Column 3: "To Do"
- Column 4: empty (Title 1)
- Column 5: scenario title with quotes — format `[TestType][Prefix] Verb + Object` (NO TS ID prefix)
- Column 11: "Not start"
- Area/Iteration Path: same as PBI row, single backslash, quoted
- Pre_conditions (col 7): `<div>...<br>...</div>`
- Test Steps (col 8): `<div><ol style="box-sizing:border-box;padding-left:40px;"><li style="box-sizing:border-box;">...</li></ol></div>`
- Expected Result (col 9): `<div>...<br>...</div>`

## 6. Sprint Tag Rules

- **Format:** `YYYYSPxx` where YYYY = year, xx = sprint number (zero-padded if needed), e.g. `2026SP52`
- **When to apply:** Tag is added to column 19 (Tags) of every TS row in the CSV
- **PBI rows:** Tags column stays empty
- **Multiple tags:** Separate with semicolons e.g. `2026SP52; regression`
- **Ask user before export:** "Sprint tag จะใส่เป็น `2026SP52` ใช่ไหมครับ? (กด Enter เพื่อยืนยัน หรือพิมพ์ tag ที่ต้องการ)"
- **Default:** Derive from sprint name in context — if sprint name is "Sprint 52" and year is 2026 → `2026SP52`

## 7. Validation Checklist

- [ ] All 23 columns present in header
- [ ] PBI row: ID not empty, Title in col 4, 10 empty cols between Priority and Area Path, cols 21-23 empty
- [ ] TS rows: Work Item Type = "Test Case", ID empty, State "To Do", Title in col 5, Test result "Not start"
- [ ] TS Title format: `[TestType][Prefix] Verb + Object` — NO TS ID prefix, NOT starting with "ทดสอบ"/"ตรวจสอบ"
- [ ] No double backslashes in paths (`\` not `\\`)
- [ ] Area/Iteration Path fields are quoted
- [ ] 22 commas per row
- [ ] UTF-8 encoding, no BOM
- [ ] Pre_conditions: `<div>...<br>...</div>` format
- [ ] Test Steps: `<div><ol style="box-sizing:border-box;padding-left:40px;"><li style="box-sizing:border-box;">...</li></ol></div>` format
- [ ] Expected Result: `<div>...<br>...</div>` format
- [ ] JSON data uses single quotes `{'key': 'value'}` not double quotes
- [ ] Priority level includes "Critical" (not just High/Medium/Low)
- [ ] Tags column (col 19): TS rows have sprint tag in `YYYYSPxx` format, PBI rows have empty Tags

## 8. Export Process

1. Read data from `testScenario{id}.md` only — do NOT re-fetch from DevOps
2. Apply sprint tag confirmed at TS design start (col 19 of all TS rows) — do NOT ask again
3. Generate CSV content
4. Validate all fields, rows, columns
5. Export to `{ts_root}/[system]/[feature]/testScenario{id}.csv`
   - `{ts_root}` resolves from `qa-task-progress.md` → `## Context` → `Test Scenario Root` field
   - If `Test Scenario Root` is not set in context → ask user: "Test Scenario Root path คืออะไรครับ? (เช่น `tests/test-scenario`)"
   - NEVER hardcode the path — always read from context first

## 9. Post-Export: Map Work Item IDs

After importing CSV to Azure DevOps:

1. Fetch child work items (Type="Test Case")
2. Match by Title 2
3. Update ID in both CSV and MD files
4. Validate accuracy and row count
