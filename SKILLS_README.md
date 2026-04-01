# Claude Code Skills — Overview

24 active skills. Single source of truth for all AI-assisted development and QA.

## Skills

| Folder | Type | Purpose |
|--------|------|---------|
| `aidlc/` | Workflow | Full AI-DLC lifecycle: governance, phases, templates, guides, task design |
| `ai-techniques/` | Reasoning | CoT, LATS, Step-Back, AoT, Discovery |
| `analysis-skills/` | Analysis | Context, Figma, Gap, Domain, Requirements, Reverse Eng, Scenario Reader — each sub-skill is independent |
| `architect/` | Design | DDD Strategic & Tactical, Architecture Patterns, Logical Design, TDD |
| `backend-dev/` | Development | API design, DB, Auth, Node.js, Python, Docker |
| `devops-pipeline/` | DevOps | CI/CD pipeline, PRs — supports Azure DevOps, GitHub Actions, GitLab CI |
| `brainstorming/` | Discovery | Idea → spec workflow: explore → question → propose approaches → write design doc → user approval → implementation plan |
| `financial-algorithms/` | Finance | Tax brackets, DCA, SMA/EMA, Sharpe Ratio, dividend forecasting, deduplication — sourced from My Investment Port |
| `frontend-dev/` | Development | React, Flutter, Android Kotlin, iOS Swift, Tailwind, Vite — implementation only (see ui-designer for design decisions) |
| `monitoring/` | Observability | Logging, error tracking, performance metrics, tracing, alerts |
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
| `ui-designer/` | Design | Design system + aesthetic direction (tone, typography, composition) — design decisions only (see frontend-dev for implementation) |
| `vercel-react-best-practices/` | Rules | 65 React/Next.js performance rules from Vercel Engineering — waterfalls, bundle, re-render, rendering |

## Removed Skills

- `google-sheets/` — Removed from global. Project-specific GAS integration lives in each project's `.claude/skills/google-sheets/` (e.g., My Investment Port).

## Skill Boundaries (avoid overlap)

- **ui-designer** → WHAT to design (tokens, visual language, specs)
- **frontend-dev** → HOW to implement in code (React, Tailwind, Flutter)
- **analysis-skills** → Each sub-skill is independent — load ONLY the matching reference file
- **devops-pipeline** → Ask which platform (Azure / GitHub / GitLab) before generating YAML

## How it works

- ALL development and QA work goes through `aidlc` skill first
- `aidlc/references/workflow.md` determines which phase to run by scanning `.aidlc/` files
- Other skills are called by AIDLC phases as needed
- Rules skills (playwright-rules, robotframework-rules, test-scenario-rules) are always read before coding

## Maintenance

- Edit skills here (`~/.claude/skills/`) — this is the single source of truth
- Kiro steering files reference back here via `#[[file:...]]`
- Evolution history: see `ai-agent/docs/AIDLC-EVOLUTION.md`
- Last updated: 2026-03-31
