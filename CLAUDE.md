# Claude Code Workspace

## Agent Tier (pick before every task)

| Task | Agent |
|------|-------|
| Read code / research / scaffold | Gemini 3 Flash |
| Single-file fix, clear spec | Gemini 2.5 Pro |
| Logic bug / arch / async / critical | Gemini 3 Pro |

> One agent owns a task end-to-end — no mid-task handoffs (Gemini bug cascade cost 2 days).
> **Search / root cause / research rule:** Always call **Gemini CLI Flash 3** first.

## Rules (Claude-specific)

- **Cache:** Do NOT edit CLAUDE.md / rules / MCP config mid-session (breaks prompt cache)
- **Token:** Toggle Extended Thinking off (Tab) for simple tasks

## Hooks (auto-active via settings.json)

| Hook | Trigger | Action |
|------|---------|--------|
| SessionStart | Session open | Load `.unified-memory/palace/state.md`, user-profile.md, classify wings, nudge check, skill suggestions |
| Stop | Session end | Full save: admission → write wings/rooms → search-index → skill crystallize → user-profile → sync knowledge → verify |
| PostToolUse | Bash test cmd | Score ±0.5/1.0 in knowledge index |
| PostToolUse | Write/Edit file | Track dirty flag for session save reminder |

<!-- ═══ AGENTS.md — Shared Agent Rules (inlined) ═══ -->

## Reading Order & Trust Priority

When information conflicts, higher items win:

1. Latest explicit user instruction
2. Verified codebase state (grep/read before acting)
3. `AGENTS.md` — shared rules & skill map (inlined in each agent's config file)
4. Agent-specific file — tier routing, escalation, cache rules
5. `.unified-memory/palace/state.md` — active session state
6. Skill files at `{skills_root}/` (e.g. `~/.claude/skills/`, `~/ai-agent/skills/`, or project `ai-agent/skills/`)
7. After any file write or decision → note internally that session has unsaved work (dirty); before ending session, follow the save workflow in `system/unified-memory/` skill

If notes conflict with the codebase, trust the codebase.

## Skill Map

> All paths relative to `{skills_root}/` (e.g. `~/.claude/skills/` or `ai-agent/skills/`)
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

- **AIDLC first:** All dev/QA work goes through `ai-dlc/core/aidlc/` — never call qa/dev skills directly unless AIDLC routes there
- **Phase gates:** If prerequisites missing → STOP, tell user what's needed first
- **Phase gate check (MANDATORY):** Before ANY dev/QA work → scan `.aidlc/[system]/[feature]/` for existing outputs → find first missing phase → start THERE, not at the user's requested phase. If no `.aidlc/` folder exists for the feature → start from Phase 0/1.2. NEVER skip to a later phase. This check MUST happen BEFORE reading spec docs or generating any output.
- **No shortcuts:** "เขียน code เลย" without prerequisites = STOP, not proceed
- **Knowledge check:** Before writing test code, check `ai-dlc/knowledge/` for existing templates + lessons
- **Language:** English for all generated files, Thai for user interaction
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

## Do Not Store

Never record: secrets/credentials, raw chat transcripts, chain-of-thought reasoning, speculative notes without evidence, duplicate summaries already in `.unified-memory/`.

## Minimum Update Contract

After meaningful work, update:
- `.unified-memory/palace/state.md` → Current Focus + Open Threads when focus/blockers/next steps change
- `.unified-memory/` rooms → when decisions, architecture choices, or lessons are made
- Trigger "save session + learn" at session end if dirty=true
