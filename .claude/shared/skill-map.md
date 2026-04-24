# Skill Map

> All paths relative to `{skills_root}/` (e.g. `~/.gemini/skills/` or `ai-agent/skills/`)
> For any dev/QA coding task → start with `ai-dlc/core/aidlc/` first (governance + phase routing)

### ai-dlc/core/ — Governance & Foundation
| Keyword | Skill |
|---------|-------|
| any dev/QA task, start AIDLC, plan, build, phases | `core/aidlc/` |
| analyze, gap analysis, requirements, reverse-eng | `core/analysis-skills/` |
| logging, monitoring, observability, alerts | `core/monitoring/` |
| save knowledge, backup, knowledge buffer | `core/storage/` |

### ai-dlc/rules/ — Coding Standards & Rules
| Keyword | Skill |
|---------|-------|
| playwright standards, coding rules | `ai-dlc/rules/playwright-rules/` ← load first |
| test scenario rules, CSV format | `ai-dlc/rules/test-scenario-rules/` ← load first |
| robot framework standards, RF rules | `ai-dlc/rules/robotframework-rules/` ← load first |
| industry design rules, finance/healthcare/ecommerce/saas design | `ai-dlc/rules/industry-rules/` ← load first |

### ai-dlc/qa/ — Quality & Testing
| Keyword | Skill |
|---------|-------|
| write/run/fix playwright tests | `qa/playwright-testing/` |
| browser CLI, navigate, screenshot | `qa/playwright-cli/` |
| QA architecture, test framework design | `qa/qa-architect/` |
| test scenario, test case design | `qa/test-scenario/` |
| write/run/fix RF mobile tests | `qa/robotframework-testing/` |
| postman migration to playwright | `postman-to-playwright/postman/` |
| load test, k6, performance | `qa/performance-testing/` |

### ai-dlc/dev/ — Implementation
| Keyword | Skill |
|---------|-------|
| backend API, node, python, docker | `dev/backend-dev/` |
| frontend React, Next.js, Flutter, Swift | `dev/frontend-dev/` |
| CI/CD, github actions, PR, pipeline | `dev/devops-pipeline/` |
| design quality, anti-AI-slop, typography, OKLCH, craft UI, polish UI, impeccable | `dev/impeccable-design/` ← use after ui-designer |

### ai-dlc/po/ — Product & Architecture
| Keyword | Skill |
|---------|-------|
| domain design, DDD, bounded contexts, logical design | `po/architect/` |

### ai-dlc/ux-ui/ — Design
| Keyword | Skill |
|---------|-------|
| UI design, figma, design system, tokens | `ux-ui/ui-designer/` ← use before frontend-dev |

### system/ — Meta Skills
| Keyword | Skill |
|---------|-------|
| save memory, load context, session start/end | `system/unified-memory/` |
| CoT, LATS, AoT, reasoning technique | `system/ai-techniques/` |
| create new skill | `system/skill-creator/` |
| create hook | `system/hook-creator/` |

### finance/ — Investment Portfolio
| Keyword | Skill |
|---------|-------|
| stock analysis, fundamental research | `finance/research/stock-deep-analysis/` |
