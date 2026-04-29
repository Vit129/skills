---
inclusion: auto
---

# Agent Memory — Self-Improve Rules

You have persistent memory files that you can write to **at any time during a session** — not just at session end.

## Memory Location

```
~/.claude/agent-memory/
├── palace/state.md          ← current focus, open threads, recent sessions
├── palace/search-index.md   ← keyword search index
├── palace/user-profile.md   ← user preferences
├── knowledge/index.md       ← lessons + articles + gaps index
├── knowledge/evolution.md   ← change history
├── knowledge/lessons/{domain}/{LESSON-ID}.md  ← lesson detail files
└── knowledge/articles/{domain}/{article-id}.md ← article detail files
```

## When to Write Mid-Session (Self-Improve)

Write immediately — don't wait for session end — when:

1. **Bug fixed** → create lesson immediately
2. **Error diagnosed** (403, CORS, env var, etc.) → create lesson immediately
3. **Pattern discovered** that will apply again → create lesson
4. **User preference stated** → update `palace/user-profile.md` immediately
5. **Decision made** → add to `palace/state.md` Key Decisions
6. **Open thread resolved** → mark `[x]` in `palace/state.md` immediately
7. **Skill file improved** → note in `knowledge/evolution.md`

## How to Write

Use `fsWrite` or `fsAppend` tool directly — no special command needed.

```
# Add lesson immediately after fixing a bug:
fsAppend .claude/agent-memory/knowledge/lessons/{domain}/{LESSON-ID}.md
fsAppend .claude/agent-memory/knowledge/index.md  ← add row to Lessons table
fsAppend .claude/agent-memory/knowledge/evolution.md  ← add row to Change Log

# Update user preference immediately:
strReplace .claude/agent-memory/palace/user-profile.md
```

## Bounded State

If `palace/state.md` exceeds 3,000 characters → consolidate before adding new content.

**Rolling window for Recent Sessions:**
- Keep only the last 10 sessions in the Recent Sessions table
- When adding a new session row → remove the oldest row if count > 10
- This prevents state.md from growing unbounded

## What NOT to Create

Do NOT create: `graph.md`, `tunnels.md`, `archive/`, `lessons/{domain}/index.md` — these have been removed.
