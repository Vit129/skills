# Skill Routing

## Principle

`interview` is the entry point for every task, no exceptions — it does a silent 1-line scope check first (Step 0) and only opens full elicitation when scope is genuinely unclear. After Step 0 clears, pick the skill that best fits and call it directly.

## Skill Map

| Task signal | Skill |
|-------------|-------|
| fix bug / debug / crash / investigate | `debug-mantra` |
| hunt bugs / audit / find mismatch / scan | `find-mismatch` |
| write test / add test / xctest / swift test / unit test | `xctest-macos` |
| playwright / web ui test / api test | `qa-architect` → `playwright-rules` + `playwright-testing` |
| robot framework / rf / mobile test | `qa-architect` → `robotframework-rules` + `robotframework-testing` |
| postman → playwright | `postman-to-playwright` |
| review / code review / critique | `review-personas` |
| scrutinize / sanity-check / second opinion on plan or PR / is this necessary | `scrutinize` |
| new feature / architecture / unclear scope / requirements unclear | `interview` (full gather) → write LANGUAGE.md → `dev-architect` (design + graphify) → `task-design` (Dev section) → implement |
| macos / swiftui / appkit / metal / swift | `macos-swiftui` |
| finance / stocks / portfolio / earnings | matching finance skill |
| android / kotlin / jetpack compose | `android` |
| ios / uikit / swift ui kit / xcode (non-mac) | `ios` |
| flutter / dart | `flutter` |
| react / vue / next.js / frontend / html / css / browser dom | `frontend-dev` → `web` |
| api server / express / fastapi / go service / backend | `backend-dev` |
| security / vulnerability / owasp / cve / pentest | `security` |
| ci/cd / github actions / docker / kubernetes / deploy pipeline | `devops-pipeline` |
| simplify code / reduce complexity / too complex | `code-simplification` |
| load test / performance test / k6 / jmeter / stress test | `performance-testing` |
| test scenario / test case design / scenario list | `test-scenario` → `test-scenario-rules` |
| create hook / new hook / hook builder | `hook-creator` |
| create skill / new skill / skill template | `skill-creator` |
| verify this / self-verify / verification loop | `verification-loop` |
| graph report / knowledge graph / project graph | `mcp__graphify__query_graph` |
| ui design / wireframe / mockup / design component | `ui-designer` |
| domain model / ubiquitous language / ddd / bounded context / glossary | `ubiquitous-language` |
| stakeholder update / write for management / exec summary / slack message / standup | `management-talk` |
| launch checklist / ship to prod / pre-release / staged rollout | `shipping-launch` |
| industry rules / compliance / healthcare design / finance design / ecommerce rules | `industry-rules` |
| analyze codebase / gap analysis / extract requirements / วิเคราะห์ | `analysis-skills` |
| step by step analysis / chain of thought / lats / compare approaches / big picture thinking | `ai-techniques` |
| workout / exercise plan / nutrition / diet / meal plan / macro | `fitness` |
| ภาษี / vat / บัญชี / thai tax / thai accounting / withholding tax | `thai-accountant` |
| bootstrap memory / setup agent memory / reset memory | `agent-memory` |
| handoff / hand off / ส่งต่องาน / pass to codex/gemini/kiro / switch agent | `handoff` |
| ask agy / second opinion from agy / have agy try | `agy` |
| management talk / เขียนสำหรับ management / rewrite for vp | `management-talk` |
| explain / summarize / search / brainstorm / diagnose | `interview` Step 0 clears in 1 line → direct, no further skill |
| everything else | `interview` → then pick closest skill |

## Continuation

"ทำต่อ" / "continue" / "resume" → read the active feature's `agent-memory/plans/[FEATURE]/dev-task-progress.md` or `qa-task-progress.md` → resume at the first unchecked task.
