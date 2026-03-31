# Claude Code Skills — Overview

21 active skills. Single source of truth for all AI-assisted development and QA.

## Skills

| Folder | Type | Purpose |
|--------|------|---------|
| `aidlc/` | Workflow | Full AI-DLC lifecycle: governance, phases, templates, guides, task design |
| `ai-techniques/` | Reasoning | CoT, LATS, Step-Back, AoT, Discovery |
| `analysis-skills/` | Analysis | Context, Figma, Gap, Domain, Requirements, Reverse Eng, Scenario Reader |
| `architect/` | Design | DDD Strategic & Tactical, Architecture Patterns, Logical Design, TDD |
| `backend-dev/` | Development | API design, DB, Auth, Node.js, Python, Docker |
| `devops-pipeline/` | DevOps | CI/CD pipeline, pull requests, Azure DevOps sync |
| `frontend-dev/` | Development | React, Flutter, Android Kotlin, iOS Swift, Tailwind, Vite |
| `google-sheets/` | Integration | GAS sync patterns |
| `playwright-cli/` | Tool | Browser automation via CLI |
| `playwright-rules/` | Rules | Playwright coding standards (API + Web UI) |
| `playwright-testing/` | Testing | Write/review/run/heal/quick-automation Playwright tests |
| `postman/` | Migration | Postman → Playwright conversion + scripts |
| `qa-architect/` | Architecture | API/Web/Mobile test automation arch, Test DB Strategy |
| `robotframework-rules/` | Rules | RF coding standards (Android + iOS) |
| `robotframework-testing/` | Testing | Write/review/run/heal RF mobile tests |
| `skill-creator/` | Meta | Create, improve, validate Claude Code skills |
| `storage/` | Knowledge | Knowledge save, buffer update, scenario archive |
| `test-scenario/` | QA | Scenario design, data gen, reuse, quick-scenario, CSV validator |
| `test-scenario-rules/` | Rules | Test scenario design guidelines + CSV export |
| `ui-designer/` | Design | Design system, colors, typography, layout |

## How it works

- ALL development and QA work goes through `aidlc` skill first
- `aidlc/references/workflow.md` determines which phase to run by scanning `.aidlc/` files
- Other skills are called by AIDLC phases as needed
- Rules skills (playwright-rules, robotframework-rules, test-scenario-rules) are always read before coding

## Maintenance

- Edit skills here (`~/.claude/skills/`) — this is the single source of truth
- Kiro steering files reference back here via `#[[file:...]]`
- Evolution history: see `ai-agent/docs/AIDLC-EVOLUTION.md`
