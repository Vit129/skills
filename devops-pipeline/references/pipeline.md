# Pipeline Creation

Generate CI/CD pipeline YAML files for test automation projects.

## When to use

- New feature test has been developed and validated
- New automation project needs CI/CD integration
- Updating pipeline configuration

## Questions to ask (one at a time, in Thai)

Ask one question at a time — wait for the answer before asking the next.

**Q1: Trigger type?**
"จะให้ pipeline trigger แบบไหน?
1. Schedule (cron) — รันอัตโนมัติตามเวลาที่กำหนด เช่น ทุกวันจันทร์-ศุกร์ 08:30
2. Auto push to branch — รันทันทีเมื่อมี push หรือ merge เข้า branch ที่กำหนด
3. Manual only — รันเฉพาะเมื่อกด trigger เองใน Azure DevOps (trigger: none)"

**Q2: Branch?**
"จะ trigger จาก branch ไหน? 1) main 2) develop 3) ทั้งคู่"

**Q3: Schedule time? (if schedule)**
"อยากให้รันเวลาไหน? (ระบุเป็นภาษาคน เช่น ทุกวันจันทร์-ศุกร์ 08:30)"
→ AI converts to cron automatically using Bangkok timezone (UTC+7)

**Q4: Test command?**
"อยากรัน command ไหน?"
→ AI scan `package.json` → filter scripts matching `(api|ui):*:cliMode` → show numbered list → user picks → AI uses `npm run [script]`
→ If no matching scripts found → AI creates the missing script in `package.json` first, then generates pipeline

**Q5: Notification?**
"อยากให้แจ้งเตือนหลัง pipeline เสร็จมั้ย? 1) Teams (ระบุ webhook URL variable) 2) Email 3) ไม่ส่ง"

All other data (path, feature name, DB strategy, variable groups) must be auto-detected — do NOT ask.

## Path Resolution

Before generating YAML, dynamically resolve:

- `[RELATIVE-TEST-PATH]`: Relative path from project root to the folder containing `package.json` (e.g., `Automation/tests/api-testing`)
- `[Database Base Path]`: Found under Database Strategy in implementation plan (if applicable)
- Verify both paths physically exist in workspace before generating

Final path structure:
- API/WebUI: `{project_root}/[RELATIVE-TEST-PATH]/pipelines/[system-feature-kebab]/[system-feature-camel].yaml`
- Mobile: `{project_root}/[RELATIVE-TEST-PATH]/pipelines/[platform]/[system-feature-kebab]/[system-feature-camel].yaml`

## Naming

- Folder: kebab-case (e.g., `organization-login`)
- File: lowerCamelCase (e.g., `organizationLogin.yaml`)

## Rules

- Never hardcode sub-directories — resolve dynamically from implementation plan
- Do NOT use `NodeTool@0` — use pre-installed Node
- Do NOT use `npx playwright install` — use `BROWSER_CHANNEL: chrome`
- Verify `playwright-report` matches `outputFolder` in `playwright.config.ts`
- Verify test files and DB paths physically exist before generating

## Validation Checklist (Before Generating)

- [ ] `[RELATIVE-TEST-PATH]` physically exists in workspace
- [ ] `package.json` contains the test command
- [ ] DB path exists if DB strategy is present in plan
- [ ] Cron expression is valid (if schedule selected)
- [ ] `playwright-report` matches `outputFolder` in `playwright.config.ts`
- [ ] File path follows naming convention

## Cron examples (Bangkok UTC+7)

| Human | Cron |
| ----- | ---- |
| Mon-Fri 08:30 | `30 1 * * 1-5` |
| Daily 09:00 | `0 2 * * *` |
| Daily 02:00 | `0 19 * * *` |
| Every 6 hours | `0 */6 * * *` |
