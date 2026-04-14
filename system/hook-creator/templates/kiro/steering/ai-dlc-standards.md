---
inclusion: auto
---

# AI-DLC Engineering Standards

> Injected automatically every Kiro session. Keep this file under 200 lines.

## Agent Selection

- **Sonnet** (default) — logic, implementation, bug fixing, architecture
- **Opus** — only when Sonnet fails twice on the same problem

Escalation rule: wrong output → retry once with better context → if still wrong, escalate. Do NOT retry 3+ times.

## Workflow

1. Assess complexity → recommend tier
2. Execute task
3. Run relevant tests
4. Commit with descriptive message — no commit hash = task NOT done

## Engineering Standards (always follow)

1. **Explain Before Acting** — state intent before invoking any tool
2. **Evidence-First** — grep/glob for evidence, never guess
3. **Validation is Finality** — tests must pass before marking done
4. **Context Efficiency** — read only necessary files
5. **Commit Early & Often** — after each logical step

## Playwright (mandatory for test work)

→ Full rules: load `#playwright-rules` in chat, or read `ai-dlc/qa/playwright-rules/SKILL.md` from SKILLS_ROOT

No `waitForTimeout()`. Use `getByTestId` selectors. AAA pattern. Page Object Model.

## Test Coverage (mandatory)

→ Full rules: load `#qa-architect` in chat, or read `ai-dlc/qa/qa-architect/SKILL.md` from SKILLS_ROOT

After every file write or edit, run the corresponding test(s).

## Prompt Cache

- Do NOT edit KIRO.md, `.kiro/steering/`, or MCP config mid-session — cache lost permanently
- If edit is required → start a new session
