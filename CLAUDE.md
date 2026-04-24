# Claude Code Workspace (Project Root)

> 🔗 **Full SSOT Architecture:** 
> - Source of truth: `CLAUDE.md` (this file)
> - `.claude/shared/agent-core.md` — Universal rules (reading order, state, principles)
> - **Synced sections** (marked below) → auto-generated to `~/.codex/CODEX.md` and `~/.gemini/GEMINI.md`
> - `.claude/scripts/sync-agent-instructions.sh` — Extract marked sections + generate agents
>
> **Workflow:** Edit CLAUDE.md, run sync script, all agents updated ✅

---

<!-- SYNC:START skill-map -->
## Skill Map

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
<!-- SYNC:END skill-map -->

<!-- SYNC:START project-rules -->
## Project Rules (overrides/extends shared)

- **AIDLC first:** All dev/QA work goes through `ai-dlc/core/aidlc/` — never call qa/dev skills directly unless AIDLC routes there
- **AIDLC exception — Postman migration:** `postman-to-playwright/postman/` skill bypasses AIDLC entirely — source of truth is the Postman collection, not requirements. Use migration flow in `postman-to-playwright/postman/SKILL.md` directly (Step 1→2→2.5→3→4). No `.aidlc/` folder needed.
- **Phase gates:** If prerequisites missing → STOP, tell user what's needed first
- **Phase gate check (MANDATORY):** Before ANY dev/QA work → scan `.aidlc/[system]/[feature]/` for existing outputs → find first missing phase → start THERE, not at the user's requested phase. If no `.aidlc/` folder exists for the feature → start from Phase 0/1.2. NEVER skip to a later phase. This check MUST happen BEFORE reading spec docs or generating any output.
- **No shortcuts:** "เขียน code เลย" without prerequisites = STOP, not proceed
- **Knowledge check:** Before writing test code, check `ai-dlc/knowledge/` for existing templates + lessons
- **Language:** English for all generated files, Thai for user interaction
- **Test:** After every edit → run matching test (mapping: `rules/test-coverage.md`)
- **Build:** Build must pass + commit hash required before task is done
- **Playwright:** no `waitForTimeout()` · `getByTestId` > `getByRole` · AAA pattern
- **Escalate:** Don't retry the same failing approach 3+ times — hand off or ask
<!-- SYNC:END project-rules -->

<!-- SYNC:START citation-format -->
## Citation Format

```
[from: LESSON-AUTH-001]        ← lesson
[from: skill:ai-dlc/rules/playwright-rules] ← skill
[from: memory:{wing}/{room}]   ← memory palace
```
<!-- SYNC:END citation-format -->
