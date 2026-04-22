# Gemini Workspace

## Role (Tier 1 — Explorer & Scaffold)

Gemini is the research and scaffold agent. Leverage the 1M context window for wide reading — stay surgical on edits.

| Do | Don't |
|----|-------|
| Read code, map context, summarize | Fix logic bugs |
| Generate boilerplate / scaffold | State management changes |
| List files, find relevant sections | Async / timing fixes |
| Document existing behavior | Any task graded 🟡 or 🔴 |

> If a logic bug persists after 2 attempts → hand off to Claude Sonnet explicitly.

> See `AGENTS.md` in the same skills root folder as this file for shared Skill Map and Karpathy Principles.

## Rules (Gemini-specific)

- **Verify before done:** `npm run build` must pass + all changes committed
- **Commit format:** include hash — a task without a commit hash is NOT done
- **Escalate:** don't retry the same failing approach 3+ times — hand off to Sonnet
- **Surgical:** use `grep_search` and `glob` to map context before suggesting changes
- **Cache:** Do NOT edit GEMINI.md mid-session (breaks prompt cache)
