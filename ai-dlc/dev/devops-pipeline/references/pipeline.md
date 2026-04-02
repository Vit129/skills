# DevOps Pipeline

Create and configure Azure DevOps Pipeline YAML files.

## When to use
- After a new feature test has been developed and validated
- New automation project needs Azure DevOps integration
- Updating pipeline configurations

## Required Questions (ask one at a time)

**Q1a:** Trigger type? (Schedule / Auto push / Manual only)
**Q1b:** Branch? (main / develop / both)
**Q2:** Schedule time? (if Schedule — AI converts to cron using Bangkok UTC+7)
**Q3:** Test command? (AI reads package.json → filter `(api|ui):*:cliMode` scripts → show list)
**Q4:** Notification? (Teams webhook / Email / None)

All other data (path, feature name, DB strategy, variable groups) must be auto-detected.

## Path Resolution
- `[RELATIVE-TEST-PATH]`: relative path from project_root to folder containing package.json
- `[PIPELINE-OUT-PATH]`: final destination for YAML file
- `[Database Base Path]`: from `### 🗄️ Database Strategy` in plan

## Naming
- Folder: `[system-feature-kebab]` (all lowercase with hyphens)
- File: `[system-feature-camel].yaml` (starts with lowercase, no hyphens)
- API/WebUI: `pipelines/[system-feature-kebab]/[system-feature-camel].yaml`
- Mobile: `pipelines/[platform]/[system-feature-kebab]/[system-feature-camel].yaml`

## Cron Examples (Bangkok UTC+7)

| Human Input | Cron | Note |
|---|---|---|
| Mon-Fri 08:30 | `30 1 * * 1-5` | subtract 7hrs for UTC |
| Daily 09:00 | `0 2 * * *` | |
| Daily 02:00 | `0 19 * * *` | previous day UTC |

## Critical Constraints
- NEVER hardcode sub-directories — resolve dynamically
- No `NodeTool@0` — use pre-installed Node
- No `npx playwright install` — use `BROWSER_CHANNEL: chrome`
- Report path must match `outputFolder` in `playwright.config.ts`
- Use `cross-env` in package.json for Windows support

## Validation Checklist
- [ ] `[RELATIVE-TEST-PATH]` physically exists
- [ ] `package.json` contains the test command
- [ ] DB path exists if DB strategy present
- [ ] cron expression is valid
- [ ] playwright-report matches outputFolder
- [ ] File path follows naming convention
