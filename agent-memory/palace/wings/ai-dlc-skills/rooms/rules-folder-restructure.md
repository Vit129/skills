# Rules Folder Restructure

## Summary
Separated 4 `-rules` skills from their original locations into a centralized `ai-dlc/rules/` folder for better discoverability and separation of concerns.

## Decision
- [2026-04-23] Architecture choice: centralize all rules into `ai-dlc/rules/` instead of keeping them scattered across `qa/` and `ux-ui/`
- Rationale: rules (what to follow) should be separate from skills (how to do); easier to find, cross-reference, and scale

## Changes Made
| Source | Destination | Status |
|--------|-------------|--------|
| `qa/playwright-rules/` | `rules/playwright-rules/` | ✅ SKILL.md + references copied |
| `qa/robotframework-rules/` | `rules/robotframework-rules/` | ✅ SKILL.md + references copied |
| `qa/test-scenario-rules/` | `rules/test-scenario-rules/` | ✅ SKILL.md + references copied |
| `ux-ui/ui-designer/references/industry-rules/` | `rules/industry-rules/` | ✅ SKILL.md created, references pending user cp |

## Completed
- ✅ User ran cp for industry-rules references
- ✅ `ui-designer/SKILL.md` updated: reference paths now point to `../../rules/industry-rules/references/`
- ⏳ Delete old locations after verification (qa/playwright-rules, qa/robotframework-rules, qa/test-scenario-rules, ux-ui/ui-designer/references/industry-rules)
