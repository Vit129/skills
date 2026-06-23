---
name: test-scenario-rules
description: >
  This skill should be used when the user asks to "check test scenario rules",
  "what's the CSV format", "CSV format",
  "review scenario design standards", "review scenario standards",
  or needs the authoritative design guidelines and CSV export rules for test scenarios.
  Always activate when designing or exporting test scenarios.
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# Test Scenario Rules

The authoritative rules for designing and exporting test scenarios.

- **Design Guidelines** — Title format, priority levels, categories, paired design, language policy. (Read `references/ts-standards.md`)
- **CSV Export Rules** — 23-column format, validation checklists, data handling rules. (Read `references/csv-export.md`)

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
