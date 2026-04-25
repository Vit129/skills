# Optimization Tips (Claude Code)

## Extended Thinking Token Management

Extended Thinking consumes **all thinking tokens as output tokens** — expensive for simple tasks.

**Usage:**
- **Toggle on/off:** Press `Tab` in Claude Code CLI
- **Global limit:** Set in `~/.zshrc`:
  ```bash
  export MAX_THINKING_TOKENS=8000
  ```
  Then reload: `source ~/.zshrc`

**When to use:**
- ✅ Complex architectural decisions
- ✅ Debugging multi-file dependencies
- ❌ Simple commands (quick fixes, file reads)

## Prompt Cache Protection

- Do NOT edit CLAUDE.md, `.claude/rules/`, or MCP config mid-session — cache breaks permanently for that session
- Configure everything before starting a session — changes mid-session = cache lost, no recovery
- If you must change: run `/clear` and start a new session
- CLAUDE.md structure: stable content (standards, rules) at top; dynamic content (test mapping) at bottom

## Autocompact Circuit Breaker

If compaction fails 3+ times in a row → switch model to 1M context (`/model`) then run `/compact`

## Context Efficiency with .claudeignore

The `.claudeignore` file excludes unnecessary files from context scanning.

**Already configured:**
- Build artifacts: `dist/`, `assets/`
- Dependencies: `node_modules/`
- Test noise: `playwright-report/`, `test-results/`
- Secrets: `.env`, `.firebase/`
- OS/Logs: `*.log`, `.DS_Store`
