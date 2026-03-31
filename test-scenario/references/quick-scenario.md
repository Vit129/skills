# Quick Scenario

Add, modify, or delete test scenarios in existing files without running the full design workflow.

## When to use
- Adding a few scenarios to an existing file
- Modifying or deleting specific scenarios
- NOT for redesigning entire scenario sets

## Escalation check
- Change doesn't affect existing scenarios → Quick mode
- Change causes existing scenarios to need redesign (e.g., flow change, business rule change) → Escalate to full designer

## Process
1. Confirm target file and feature
2. Load existing `testScenario{id}.md` — extract last TS-ID for sequencing
3. Generate changes following design guidelines
4. **Adversarial review before proposing:**
   - Title format correct? (`[TestType][Prefix] + Verb + Object`)
   - No duplicate IDs?
   - Placed in correct section? (Success/Alternative/Edge)
   - Priority level appropriate?
   - Test data consistent with existing scenarios?
5. Show proposed changes → wait for approval
6. Apply changes to markdown
7. Review test data — still valid? Need additions?
8. Self-check: no duplicate IDs, sequential numbering, correct format
9. Re-generate CSV via validator

## Rules
- Always confirm target before modifying
- Surgical edits only — don't rewrite entire file
- Re-sequence IDs within same section only (not across sections)
- Auto-regenerate CSV after every edit
