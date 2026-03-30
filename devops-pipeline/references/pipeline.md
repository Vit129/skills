# Pipeline Creation

Generate CI/CD pipeline YAML files for test automation projects.

## When to use
- New feature test has been developed and validated
- New automation project needs CI/CD integration
- Updating pipeline configuration

## Questions to ask (one at a time)
1. **Trigger type?** Schedule (cron) / Auto push to branch / Manual only
2. **Branch?** main / develop / both
3. **Schedule time?** (if schedule) — specify in human language, convert to cron UTC+7
4. **Test command?** — scan package.json for `(api|ui):*:cliMode` scripts
5. **Notification?** Teams webhook / Email / None

## Naming
- Folder: kebab-case (e.g., `organization-login`)
- File: lowerCamelCase (e.g., `organizationLogin.yaml`)

## Rules
- Never hardcode sub-directories — resolve dynamically from implementation plan
- Do NOT use `NodeTool@0` — use pre-installed Node
- Do NOT use `npx playwright install` — use `BROWSER_CHANNEL: chrome`
- Verify `playwright-report` matches `outputFolder` in `playwright.config.ts`
- Verify test files and DB paths physically exist before generating

## Cron examples (Bangkok UTC+7)

| Human | Cron |
|-------|------|
| Mon-Fri 08:30 | `30 1 * * 1-5` |
| Daily 09:00 | `0 2 * * *` |
| Every 6 hours | `0 */6 * * *` |
