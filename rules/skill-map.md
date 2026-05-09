# Skill Map

> Canonical inventory is `~/.claude/skills/`.
> All paths are relative to `{skills_root}/` (for example `~/.claude/skills/`).
> For any dev/QA coding task → start with `ai-dlc/core/aidlc/` first (governance + phase routing)
> Keywords are semantic — match by meaning, not exact string.
> Bilingual triggers (TH/EN) are in each SKILL.md description.

### ai-dlc/core/ — Governance & Foundation
| Keyword | Skill |
|---------|-------|
| brainstorm, คิดก่อน, ยังไม่แน่ใจ, party mode, explore idea | `ai-dlc/core/brainstorming/` ← mandatory before aidlc for new features |
| **AUTO-DETECT** any SDLC intent: implement, build, create, test, fix bug, deploy, design API/DB, write code, automation — route here WITHOUT waiting for "start AIDLC" | `ai-dlc/core/aidlc/` |
| spawn subagent, parallel tasks, dispatch agent, subagent-driven, 2-stage review | `ai-dlc/core/subagent-driven/` ← use during Phase 3.1 for large task sets |
| analyze, gap analysis, requirements, reverse-eng | `ai-dlc/core/analysis-skills/` |
| domain design, DDD, bounded contexts, logical design | `ai-dlc/core/architect/` |

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
| write/run/fix playwright tests | `ai-dlc/qa/playwright-testing/` |
| browser CLI, navigate, screenshot | `ai-dlc/qa/playwright-cli/` |
| QA architecture, test framework design | `ai-dlc/qa/qa-architect/` |
| test scenario, test case design | `ai-dlc/qa/test-scenario/` |
| write/run/fix RF mobile tests | `ai-dlc/qa/robotframework-testing/` |
| postman migration to playwright | `postman-to-playwright/postman/` |
| load test, k6, performance | `ai-dlc/qa/performance-testing/` |

### ai-dlc/dev/ — Implementation
| Keyword | Skill |
|---------|-------|
| backend API, node, python, docker | `ai-dlc/dev/backend-dev/` |
| frontend React, Next.js, Flutter, Swift | `ai-dlc/dev/frontend-dev/` |
| design quality, anti-AI-slop, typography, OKLCH, craft UI, polish UI, impeccable | `ai-dlc/dev/impeccable-design/` ← use after ui-designer |

### ai-dlc/ux-ui/ — Design
| Keyword | Skill |
|---------|-------|
| UI design, figma, design system, tokens | `ai-dlc/ux-ui/ui-designer/` ← use before frontend-dev |

### productivity/ — Claude Code Power Use
| Keyword | Skill |
|---------|-------|
| code tips, productivity tips, workspace setup, claude code setup, เคล็ดลับ claude, ตั้งค่า workspace | `claude-code-tips/` |

### finance/ — Research & Portfolio
| Keyword | Skill |
|---------|-------|
| portfolio review, ETF analysis, allocation, rebalance | `finance/portfolio/` |
| analyze stock, deep dive stock, fundamental research | `finance/research/stock-deep-analysis/` |
| compare stocks, peer comparison, valuation comparison | `finance/research/stock-peer-comparison/` |
| trading debate, multi-agent trading, risk-managed decision | `finance/research/tradingagents-orchestrator/` |

### fitness/ — Coaching
| Keyword | Skill |
|---------|-------|
| workout plan, nutrition, body composition, training program | `fitness/` |

### system/ — Meta Skills
| Keyword | Skill |
|---------|-------|
| CoT, LATS, AoT, reasoning technique | `system/ai-techniques/` |
| analysis concepts, abstraction templates, reusable reasoning patterns | `system/analysis-concept/` |
| knowledge graph, project map, dependency map, graph report | `system/graph-report/` |
| create new skill | `system/skill-creator/` |
| create hook | `system/hook-creator/` |
| agent memory, bootstrap memory, setup memory, session flow, save/discard gate, skill evolve, knowledge pipeline | `system/agent-memory/` |

### thai-accountant/ — Thai Accounting & Tax
| Keyword | Skill |
|---------|-------|
| accounting, tax, VAT, WHT, Thai GAAP, TFRS, financial analysis | `thai-accountant/` |
