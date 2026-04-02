# Claude Code Skills — Overview

Single source of truth for all AI-assisted development, QA, and Finance analysis.

## 1. AI-DLC Category (`ai-dlc/`)

### Core (Governance, Design, Reasoning) — `ai-dlc/core/`
| Folder | Purpose |
|--------|---------|
| `aidlc/` | Full AI-DLC lifecycle: governance, phases, templates, guides, task design, **Investment Port Context** |
| `architect/` | DDD Strategic & Tactical, Architecture Patterns, Logical Design, TDD |
| `brainstorming/` | Idea → spec workflow: explore → question → propose approaches → write design doc |
| `skill-creator/` | Create, improve, validate Claude Code skills |
| `ai-techniques/` | CoT, LATS, Step-Back, AoT, Discovery reasoning patterns |
| `analysis-skills/` | Context, Figma, Gap, Domain, Requirements, Reverse Eng, Scenario Reader |
| `ui-designer/` | Design system + aesthetic direction, **Sovereign Design System** rules |
| `commit-message/` | Standardized git commit message generation |

### Dev (Implementation) — `ai-dlc/dev/`
| Folder | Purpose |
|--------|---------|
| `frontend-dev/` | React, Flutter, Android Kotlin, iOS Swift, Tailwind, Vite implementation |
| `backend-dev/` | API design, DB, Auth, Node.js, Python, Docker |
| `devops-pipeline/` | CI/CD pipeline, PRs (Azure DevOps, GitHub Actions, GitLab CI) |
| `storage/` | Knowledge save, buffer update, **Data Backup & Integrity** standards |
| `monitoring/` | Logging, error tracking, performance metrics, tracing, alerts |
| `vercel-react-best-practices/` | 65 React/Next.js performance rules from Vercel Engineering |

### QA (Testing & Automation) — `ai-dlc/qa/`
| Folder | Purpose |
|--------|---------|
| `playwright-rules/` | Playwright coding standards (API + Web UI) |
| `playwright-testing/` | Write/review/run/heal Playwright tests |
| `playwright-cli/` | Browser automation via CLI |
| `qa-architect/` | API/Web/Mobile test automation arch, Test DB Strategy |
| `robotframework-rules/` | RF coding standards (Android + iOS) |
| `robotframework-testing/` | Write/review/run/heal RF mobile tests |
| `test-scenario/` | Scenario design, data gen, reuse, quick-scenario |
| `test-scenario-rules/` | Test scenario design guidelines + CSV export |
| `postman/` | Postman → Playwright conversion + scripts |

## 2. Finance Category (`finance/`)

### Coding (Claude Code) — `finance/coding/`
| Folder | Purpose |
|--------|---------|
| `financial-algorithms/` | Tax calc, DCA, SMA/EMA, Sharpe Ratio, dividend forecasting |
| `google-sheets/` | Google Apps Script (GAS) integration for portfolio sync |
| `tax-optimizer/` | Tax planning logic and optimization code |
| `tax-review/` | Tax engine review and validation |
| `dividend-tracker/` | Dividend tracking and forecasting logic |
| `portfolio-report/` | Portfolio performance report generation |
| `rebalance-check/` | Portfolio rebalancing logic |
| `fx-alert/` | FX impact calculation and alerts |
| `passive/` | Passive income analysis logic |
| `add-stock/` | Logic for adding new stocks to portfolio |

### Research (Claude Chat/Cowork) — `finance/research/`
| Folder | Purpose |
|--------|---------|
| `stock-deep-analysis/` | Fundamental and deep-dive stock analysis |
| `thai-stock/` | Thai market specific analysis (RMF/SSF/ThaiESG) |
| `us-stock/` | US holdings and market analysis |
| `news-search/` | Market news search and sentiment analysis |
| `ai-recommend/` | AI-driven stock recommendations and insights |

## 3. Internal (`_internal/`)
Folders that store system data, logs, or backups to keep the root directory clean.
- `backups/`, `cache/`, `debug/`, `downloads/`, `file-history/`

## Maintenance
- Edit skills in their respective subdirectories — this is the single source of truth.
- **Project-specific rules** for "My Investment Port" are now consolidated into `ai-dlc/` references.
- Last updated: 2026-04-02 (Eliminated redundancies)
