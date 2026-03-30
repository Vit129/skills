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
4. Show proposed changes → wait for approval
5. Apply changes to markdown
6. Review test data — still valid? Need additions?
7. Self-check: no duplicate IDs, sequential numbering, correct format
8. Re-generate CSV via validator

## Rules
- Always confirm target before modifying
- Surgical edits only — don't rewrite entire file
- Re-sequence IDs within same section only (not across sections)
- Auto-regenerate CSV after every edit
