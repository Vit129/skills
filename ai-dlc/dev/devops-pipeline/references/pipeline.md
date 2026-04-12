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

## BCIBOT Pipeline Template (Azure DevOps — NTDC-BCIBOT pool)

Use this template when the project runs on the BCIBOT agent pool:

```yaml
name: [TYPE] - [SystemFeaturePascal] SIT Tests

trigger:
  branches:
    include:
      - main
      - develop
  paths:
    include:
      - [RELATIVE-TEST-PATH]/**

# IF schedule selected:
schedules:
  - cron: "[CRON_EXPRESSION]"
    displayName: "[HUMAN_READABLE_SCHEDULE]"
    branches:
      include:
        - main
    always: true

resources:
  repositories:
    - repository: qaTemplates
      type: git
      name: QA Ready Checklist/qa-shared-templates
      ref: refs/heads/main

pool:
  name: NTDC-BCIBOT

variables:
  # - group: database-connection-config   # IF plan has DB strategy
  - name: TEAMS_WEBHOOK_URL
    value: ''
  - name: workingDirectory
    value: '$(System.DefaultWorkingDirectory)/[RELATIVE-TEST-PATH]'

stages:
  - stage: [StageName]
    displayName: "[TYPE] [SystemFeaturePascal] Tests"
    jobs:
      - job: Run[Feature]Tests
        displayName: "Run [Feature] Tests"
        steps:
          - script: |
              cd $(workingDirectory)
              npm install
            displayName: "Install Dependencies"

          - script: |
              cd $(workingDirectory)
              npx playwright test --project="chromium" --config=playwright.config.ts [TEST-FOLDER-PATH]/
            displayName: "Run [TEST-FOLDER-PATH]/"
            continueOnError: true
            env:
              BROWSER_CHANNEL: chrome

          # NOTIFICATION: Uncomment if Teams selected
          # - template: pipeline/sent-notification.yaml@qaTemplates
          #   parameters:
          #     dependsOn: '[StageName]'
          #     teamWebhookUrl: $(TEAMS_WEBHOOK_URL)
          #     artifactName: 'job-status-noti'

          - task: PublishTestResults@2
            displayName: "Publish Test Results"
            condition: succeededOrFailed()
            inputs:
              testResultsFormat: "JUnit"
              testResultsFiles: "$(workingDirectory)/test-results/junit.xml"
              testRunTitle: "[TYPE] [SystemFeaturePascal] Test Results"

          - template: pipeline/publish-pw-results-artifacts.yaml@qaTemplates
            parameters:
              junitFile: "$(workingDirectory)/test-results/junit.xml"
              reportPath: "$(workingDirectory)/playwright-report"
              reportArtifactName: "[type]-[system-feature-kebab]-html-report"
              statusArtifactName: "job-status-noti"
              jobName: "Run[Feature]Tests"

  - stage: UpdateAutomated
    displayName: 'Update Automated Status'
    dependsOn: [StageName]
    condition: always()
    jobs:
    - template: pipeline/UpdateAutomated.yml@qaTemplates
```

**Placeholders:**
- `[TYPE]` — API / WebUI / Mobile
- `[SystemFeaturePascal]` — e.g., `ShopeePayment`
- `[RELATIVE-TEST-PATH]` — relative path to folder with `package.json`
- `[TEST-FOLDER-PATH]` — test folder relative to workingDirectory
- `[StageName]` — e.g., `RunApiTests`
