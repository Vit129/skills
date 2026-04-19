# Claude Code Workspace

## Agent Tier (pick before every task)

| Task | Agent |
|------|-------|
| Read code / research / scaffold | Gemini Flash (free) |
| Single-file fix, clear spec | Haiku |
| Logic bug / arch / async / critical | Sonnet |

> One agent owns a task end-to-end — no mid-task handoffs (Gemini bug cascade cost 2 days).
> Gemini must pass build + commit before the task is considered done.

## Skill Map (keyword → path)

| Keyword / Task | Skill |
|----------------|-------|
| playwright test, spec, automation | `ai-dlc/qa/playwright-rules/` + `playwright-testing/` |
| browser CLI, navigate, click | `ai-dlc/qa/playwright-cli/` |
| QA architecture, test strategy | `ai-dlc/qa/qa-architect/` |
| test scenario, test case design | `ai-dlc/qa/test-scenario/` |
| robot framework, mobile test | `ai-dlc/qa/robotframework-rules/` + `robotframework-testing/` |
| postman migration | `ai-dlc/qa/postman/` |
| performance test, k6 | `ai-dlc/qa/performance-testing/` |
| backend API, node, python, docker | `ai-dlc/dev/backend-dev/` |
| frontend React, Flutter, Swift | `ai-dlc/dev/frontend-dev/` |
| CI/CD, github actions, PR | `ai-dlc/dev/devops-pipeline/` |
| domain design, DDD, architect | `ai-dlc/po/architect/` |
| UI design, figma, design system | `ai-dlc/ux-ui/ui-designer/` |
| task design, phase, aidlc | `ai-dlc/core/aidlc/` |
| gap analysis, context, reverse-eng | `ai-dlc/core/analysis-skills/` |
| save memory, load context, session | `system/unified-memory/` |
| CoT, LATS, AoT, reasoning | `system/ai-techniques/` |
| create new skill | `system/skill-creator/` |
| create hook | `system/hook-creator/` |
| investment port, tax, dividend | `finance/coding/` |
| stock analysis, fundamental | `finance/research/stock-deep-analysis/` |

All skill paths relative to `~/.claude/skills/`

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
- **Playwright:** no `waitForTimeout()` · selector priority: `getByTestId` > `getByRole` · AAA pattern
- **Cache:** Do NOT edit CLAUDE.md / rules / MCP config mid-session (breaks prompt cache)
- **Token:** Toggle Extended Thinking off (Tab) for simple tasks

## Hooks (auto-active via settings.json)

| Hook | Trigger | Action |
|------|---------|--------|
| SessionStart | Session open | Load `.unified-memory/palace/state.md` |
| PreToolUse | Write/Edit | Check design → decompose → implement |
| PostToolUse | Edit test file | Run test, auto-heal on fail |
