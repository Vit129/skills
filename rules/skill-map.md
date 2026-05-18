# Skill Map

> Canonical inventory is `~/.claude/skills/`.
> All paths are relative to `{skills_root}/` (for example `~/.claude/skills/`).
> For any dev/QA coding task → start with `ai-dlc/core/aidlc/` first (governance + phase routing)
> Keywords are semantic — match by meaning, not exact string.
> Bilingual triggers (TH/EN) are in each SKILL.md description.

## Quick Commands (`~/.claude/commands/`)

| Command | Route to | What it does |
|---------|----------|-------------|
| `/spec` | `core/aidlc/` Phase 0→1 | Define requirements, inception, DECISIONS file |
| `/plan` | `core/aidlc/` Phase 2 | Break spec into tasks (qa-task-design / dev-task-design) |
| `/build` | `core/aidlc/` Phase 3 | Implement tasks one by one, commit each |
| `/test` | `qa/playwright-testing/` + `core/debugging/` | Write/run tests, triage failures |
| `/review` | `core/review-personas/` | Pre-merge review (code + security + test coverage) |
| `/simplify` | `dev/code-simplification/` | Reduce complexity, preserve behavior |
| `/ship` | `dev/shipping-launch/` | Pre-launch checklist, staged rollout, monitoring |
| `/resume` | Scan `.aidlc/` → find last phase → continue | Pick up where you left off |

> Commands are shortcuts, NOT bypasses — prerequisites still apply.
> `/resume` scans `.aidlc/[system]/[feature]/` → finds last completed phase → starts next one.

### ai-dlc/core/ — Governance & Foundation
| Keyword | Skill |
|---------|-------|
| brainstorm, คิดก่อน, ยังไม่แน่ใจ, party mode, explore idea | `ai-dlc/core/brainstorming/` ← mandatory before aidlc for new features |
| interview me, ถามทีละข้อ, ถามจนชัด, grill me, underspecified, ไม่ชัด, สัมภาษณ์ | `ai-dlc/core/interview-me/` ← BEFORE Phase 0 — one-question-at-a-time until 95% confidence |
| **AUTO-DETECT** any SDLC intent: implement, build, create, test, fix bug, deploy, design API/DB, write code, automation — route here WITHOUT waiting for "start AIDLC" | `ai-dlc/core/aidlc/` |
| spawn subagent, parallel tasks, dispatch agent, subagent-driven, 2-stage review | `ai-dlc/core/subagent-driven/` ← use during Phase 3.1 for large task sets |
| analyze, gap analysis, requirements, reverse-eng | `ai-dlc/core/analysis-skills/` |
| domain design, DDD, bounded contexts, logical design | `ai-dlc/core/architect/` |
| verify docs, cite source, official docs, check API version, unverified | `ai-dlc/core/source-driven/` ← use when implementing framework-specific code |
| debug, fix failing test, triage error, reproduce bug, root cause | `ai-dlc/core/debugging/` ← use when tests fail or behavior is unexpected |
| doubt, adversarial review, verify decision, high stakes, critical path | `ai-dlc/core/doubt-driven/` ← use for non-trivial decisions before committing |
| review code, pre-merge, security audit, test coverage, ship check | `ai-dlc/core/review-personas/` ← 3 personas: code-reviewer, test-engineer, security-auditor |

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
| browser CLI, navigate, screenshot | `playwright-cli/` ← per-project, installed via `playwright-cli install --skills` |
| QA architecture, test framework design | `ai-dlc/qa/qa-architect/` |
| test scenario, test case design | `ai-dlc/qa/test-scenario/` |
| write/run/fix RF mobile tests | `ai-dlc/qa/robotframework-testing/` |
| postman migration to playwright | `postman-to-playwright/postman/` |
| load test, k6, performance, Core Web Vitals, bundle size, LCP, INP | `ai-dlc/qa/performance-testing/` |
| verify, verification loop, quality gate, pre-commit check, build+test+lint | `ai-dlc/qa/verification-loop/` ← run after implementation, before commit |
| eval, measure skill quality, consistency check, pass@k | `ai-dlc/qa/eval-harness/` ← measure skill reliability with structured eval runs |

### ai-dlc/dev/ — Implementation
| Keyword | Skill |
|---------|-------|
| backend API, node, python, C#, .NET, C, C++, docker | `ai-dlc/dev/backend-dev/` |
| frontend React, Next.js, Flutter, Swift | `ai-dlc/dev/frontend-dev/` |
| CI/CD, github actions, PR, pipeline, commit, push, QA pipeline, test pipeline | `ai-dlc/dev/devops-pipeline/` |
| design quality, anti-AI-slop, typography, OKLCH, craft UI, polish UI, impeccable | `ai-dlc/dev/impeccable-design/` ← use after ui-designer |
| OWASP, secure coding, input validation, auth hardening, XSS, injection | `ai-dlc/dev/security-hardening/` ← use when writing code that handles user input/auth |
| ship, deploy, launch, pre-launch checklist, rollback, feature flag, staged rollout | `ai-dlc/dev/shipping-launch/` ← use when preparing production deployment |
| simplify, refactor, reduce complexity, Chesterton's Fence, clean up code | `ai-dlc/dev/code-simplification/` ← use when code works but is too complex |
| deprecate, migrate, sunset, remove legacy, dead code, strangler fig | `ai-dlc/dev/deprecation-migration/` ← use when removing old systems or migrating APIs |
| ADR, architecture decision, document why, changelog, API docs | `ai-dlc/dev/documentation-adrs/` ← use when documenting decisions or APIs |

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
| find stocks, screen stocks, new ideas, watchlist, หาหุ้น, หาไอเดีย | `finance/research/idea-generation/` ← start here for new ideas |
| earnings preview, pre-earnings, before earnings, ก่อน earnings | `finance/research/earnings-preview/` |
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
| approve skill draft, review draft skill, apply draft | `drafts/` ← review + move to final location + sync |
| stocktake, skill audit, skill health, stale skills, orphan files | `/stocktake` command ← scan all skills and report health |
| agent status, dashboard, system health | `ai-agent/scripts/agent-status.sh` ← CLI dashboard |

### thai-accountant/ — Thai Accounting & Tax
| Keyword | Skill |
|---------|-------|
| accounting, tax, VAT, WHT, Thai GAAP, TFRS, financial analysis | `thai-accountant/` |
