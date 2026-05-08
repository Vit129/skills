# DevOps Pipeline

Create and configure Azure DevOps Pipeline YAML files.

## When to use
- After a new feature test has been developed and validated
- New automation project needs Azure DevOps integration
- Updating pipeline configurations

## Required Questions (ask one at a time)

**Q1a:** Trigger type? (Schedule / Auto push / Manual only)
**Q1b:** Branch? (main / develop / both)
**Q2:** Schedule time? (if Schedule — user says in plain Thai/English, AI converts to cron using Bangkok UTC+7)

Examples: "ทุกวันจันทร์-ศุกร์ 13:00", "ทุกวัน 09:00", "ทุก 6 ชั่วโมง"
**Q3:** Test command?
  - Scan `package.json` in `[RELATIVE-TEST-PATH]`
  - Filter scripts matching `(api|ui):*:cliMode` pattern
  - Show numbered list for user to select
  - If no matching scripts found → auto-create missing scripts in `package.json` first, then generate pipeline
**Q4:** Notification? (Teams webhook / Email / None)

All other data (path, feature name, DB strategy, variable groups) must be auto-detected — do NOT ask.

## Defaults (auto-applied unless user specifies otherwise)

| Setting | Default | Override by saying |
|---|---|---|
| `continueOnError` | `true` (pipeline continues even if tests fail) | "fail pipeline if tests fail" |
| Agent pool | `NTDC-BCIBOT` | "use pool [name]" |
| Publish results | Always publish | "skip publishing results" |
| External templates | Use `qaTemplates` repo | "generate inline, no templates" |

## Path Resolution
- `[RELATIVE-TEST-PATH]`: relative path from project_root to folder containing package.json
- `[PIPELINE-OUT-PATH]`: final destination for YAML file
- `[Database Base Path]`: from `### 🗄️ Database Strategy` in plan

## Naming
- Folder: `[system-feature-kebab]` (all lowercase with hyphens)
- File: `[system-feature-camel].yaml` (starts with lowercase, no hyphens)
- API/WebUI: `pipelines/[system-feature-kebab]/[system-feature-camel].yaml`
- Mobile: `pipelines/[platform]/[system-feature-kebab]/[system-feature-camel].yaml`

## DB Strategy Injection

Before generating YAML, check `### 🗄️ Database Strategy` in the implementation plan:

**If DB strategy exists:**
- Uncomment `- group: database-connection-config` in variables section
- Add DB seed step BEFORE the test run step:

```yaml
- script: |
    PGPASSWORD="$(DB_PASSWORD)" psql \
      -h $(DB_HOST) -p $(DB_PORT) \
      -d $(DB_NAME) -U $(DB_USERNAME) \
      -f $(workingDirectory)/[DB-SEED-SCRIPT-PATH]
  displayName: "Seed Test Data"
  env:
    DB_PASSWORD: $(DB_PASSWORD)
```

- Add DB cleanup step AFTER publish results:

```yaml
- script: |
    PGPASSWORD="$(DB_PASSWORD)" psql \
      -h $(DB_HOST) -p $(DB_PORT) \
      -d $(DB_NAME) -U $(DB_USERNAME) \
      -f $(workingDirectory)/[DB-CLEANUP-SCRIPT-PATH]
  displayName: "Cleanup Test Data"
  condition: always()
  env:
    DB_PASSWORD: $(DB_PASSWORD)
```

**If no DB strategy:** skip variable group and DB steps entirely.

**Verification:** Physically check that `[Database Base Path]` directory and SQL files exist before generating YAML.

## Test Command Patterns

| Type | Environment | Command |
|---|---|---|
| API | SIT | `npm run api:sit:[feature]:cliMode` |
| API | UAT | `npm run api:uat:[feature]:cliMode` |
| UI | SIT | `npm run ui:sit:[feature]:cliMode` |
| UI | UAT | `npm run ui:uat:[feature]:cliMode` |

| Human Input | Cron | Note |
|---|---|---|
| Mon-Fri 08:30 | `30 1 * * 1-5` | subtract 7hrs for UTC |
| Mon-Fri 13:00 | `0 6 * * 1-5` | |
| Daily 09:00 | `0 2 * * *` | |
| Daily 02:00 | `0 19 * * *` | previous day UTC |
| Every 6 hours | `0 */6 * * *` | |

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

## Pipeline Templates

Choose the correct template based on the agent pool:

| Pool | OS | Template |
|---|---|---|
| `NTDC-BCIBOT` | Windows | #[[file:ai-agent/templates/pipeline-templates/windowsAzureTemplate.md]] |
| `qa-automation` | Linux | #[[file:ai-agent/templates/pipeline-templates/linuxAzureTemplate.md]] |

**How to select:**
- If user says "BCIBOT" or project uses Windows agent → use `windowsAzureTemplate.md`
- If user says "qa-automation" or project uses Linux agent → use `linuxAzureTemplate.md`
- If not specified → ask: "ใช้ pool ไหนครับ? (NTDC-BCIBOT / qa-automation)"

Both templates support:
- Multi-folder test execution with isolated results per folder
- Per-folder JUnit publishing
- HTML report index generation
- Shared template integration (qaTemplates)
- DB strategy injection
- Teams notification (optional)
- Schedule / auto-push / manual triggers
