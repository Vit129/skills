# AGENTS.md — Shared Agent Rules

> Read this first. Then read your agent-specific file (CLAUDE.md / GEMINI.md / KIRO.md).

## Reading Order

1. `.agents/AGENTS.md` (this file) — shared rules & skill map
2. Agent-specific file — tier routing, escalation, cache rules
3. `.unified-memory/palace/state.md` — active session state
4. Skill files at `~/.claude/skills/`

## Skill Map

> All paths relative to `~/.claude/skills/`
> For any dev/QA coding task → start with `ai-dlc/core/aidlc/` first (governance + phase routing)

### ai-dlc/core/ — Governance & Foundation
| Keyword | Skill |
|---------|-------|
| any dev/QA task, start AIDLC, plan, build, phases | `core/aidlc/` |
| analyze, gap analysis, requirements, reverse-eng | `core/analysis-skills/` |
| logging, monitoring, observability, alerts | `core/monitoring/` |
| save knowledge, backup, knowledge buffer | `core/storage/` |

### ai-dlc/qa/ — Quality & Testing
| Keyword | Skill |
|---------|-------|
| playwright standards, coding rules | `qa/playwright-rules/` ← load first |
| write/run/fix playwright tests | `qa/playwright-testing/` |
| browser CLI, navigate, screenshot | `qa/playwright-cli/` |
| QA architecture, test framework design | `qa/qa-architect/` |
| test scenario, test case design | `qa/test-scenario/` |
| test scenario rules, CSV format | `qa/test-scenario-rules/` ← load first |
| robot framework standards, RF rules | `qa/robotframework-rules/` ← load first |
| write/run/fix RF mobile tests | `qa/robotframework-testing/` |
| postman migration to playwright | `qa/postman/` |
| load test, k6, performance | `qa/performance-testing/` |

### ai-dlc/dev/ — Implementation
| Keyword | Skill |
|---------|-------|
| backend API, node, python, docker | `dev/backend-dev/` |
| frontend React, Next.js, Flutter, Swift | `dev/frontend-dev/` |
| CI/CD, github actions, PR, pipeline | `dev/devops-pipeline/` |

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
| investment port, tax, dividend, rebalance | `finance/coding/` |
| stock analysis, fundamental research | `finance/research/stock-deep-analysis/` |

## Karpathy Principles (always active)

### 1. Think Before Coding
**Don't assume. Don't hide confusion. Surface tradeoffs.**

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First
**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes
**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution
**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## Rules (always active)

- **Test:** After every edit → run matching test (mapping: `rules/test-coverage.md`)
- **Build:** Build must pass + commit hash required before task is done
- **Playwright:** no `waitForTimeout()` · `getByTestId` > `getByRole` · AAA pattern
- **Escalate:** Don't retry the same failing approach 3+ times — hand off or ask

## Citation Format

```
[from: LESSON-AUTH-001]        ← lesson
[from: skill:playwright-rules] ← skill
[from: memory:{wing}/{room}]   ← memory palace
```
