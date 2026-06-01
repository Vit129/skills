# Quick Scenario

Quickly add, modify, or delete test scenarios in an existing Markdown file and regenerate CSV.

## When to use
- "เพิ่มเคส", "ลบเคส TS-002", "แก้ไขเคส"
- Adding/modifying scenarios without full design workflow

## Mode Detection (Step 0)
- 🟢 **Quick** — change does NOT affect existing scenarios (add/remove/edit while others remain valid)
- 🔴 **Escalate to scenarioDesigner** — change causes existing scenarios to require redesign (single→multi-select, flow change, business rule change, new PBI with no MD)

## Process
1. Context Gathering — identify PBI ID, load existing MD file, extract last TS-ID
2. Formulate Edits — generate new/modified scenarios following `testScenario2026.md` format
3. Adversarial Review:
   - Title: must be `[TestType][Prefix] + Thai verb + Object`
   - TS-ID: must not duplicate existing
   - Section: Success → Success, Alternative/Edge → Alternative
4. Show proposed changes → wait for user approval
5. Apply changes to Markdown
6. Test Data Review — check if existing data still valid, offer to add if needed
7. Self-Check — no duplicate IDs, sequential within sections, all fields present
8. Re-generate CSV via `csvValidatorSkill`

## Rules
- Never rewrite entire file unless necessary — surgical edits only
- If deleting → re-sequence within same section only (not across sections)
- Always ask approval before writing
- Auto-run CSV generation after edits
