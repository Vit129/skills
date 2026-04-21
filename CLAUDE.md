# Claude Code Workspace

> See [`.agents/AGENTS.md`](.agents/AGENTS.md) for shared Skill Map and Karpathy Principles.

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
| SessionStart | Session open | Load `.unified-memory/palace/state.md` |
| PreToolUse | Write/Edit | Check design → decompose → implement |
| PostToolUse | Edit test file | Run test, auto-heal on fail |
