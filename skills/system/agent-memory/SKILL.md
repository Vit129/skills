---
name: agent-memory
description: >
  Persistent memory + self-learning knowledge system for any domain.
  Use when: "save memory", "load context", "what did we do last time",
  "remember this", "track which templates work", "score lessons",
  "auto-capture patterns", "session summary", "what works best",
  "knowledge feedback loop", "domain health check", "prepare next session".
  Works for: code, design, writing, decision-making, learning, any domain.
concurrency: unsafe
isolation: shared
---

# Agent Memory

Persistent memory has two halves that must move together:

```text
Memory Palace      = what happened, decisions, context, open threads
Knowledge Library  = what works, reusable patterns, lessons, evolution
Session Save       = update Palace + Knowledge in one operation
```

## Non-Negotiables

- Persistent memory data is Markdown-first. Do not create or update JSON memory indexes.
- Source of truth is `agent-memory/knowledge/index.md`, not `index.json`.
- Palace updates without Knowledge updates are incomplete saves.
- Always verify paths on disk before reading or writing remembered facts.
- Existing `*.json` files under `agent-memory/` are legacy compatibility artifacts. Read only if no Markdown replacement exists; never write them as the primary store.
- Skills under `skills/` are execution instructions only. Knowledge data lives under `agent-memory/knowledge/`.

## Storage Architecture

```text
{project_root}/
└── agent-memory/
    ├── palace/
    │   ├── state.md
    │   ├── tunnels.md
    │   ├── search-index.md
    │   ├── user-profile.md
    │   ├── wings/
    │   │   └── {topic}/
    │   │       ├── hall.md
    │   │       ├── rooms/{room}.md
    │   │       ├── closets/{room}.md
    │   │       ├── skills/{skill}.md
    │   │       └── raw/YYYY-MM-DD-*.md
    │   └── archive/
    │       └── index.md
    └── knowledge/
        ├── index.md
        ├── evolution.md
        ├── {knowledge-article}.md
        └── lessons/{domain}/
            ├── index.md
            └── {lesson-id}.md
```

Optional legacy files that may exist but must not be treated as authoritative:

```text
agent-memory/knowledge/index.json
agent-memory/knowledge/lessons/**/**Index.json
agent-memory/palace/keyword-index.json
agent-memory/palace/date-index.json
```

## Session Start

When the user asks to load memory:

1. Find `{project_root}/agent-memory/`. If missing, bootstrap the Markdown tree from `references/session.md`.
2. Read `palace/state.md` and `palace/user-profile.md`.
3. Read `knowledge/index.md` and `knowledge/evolution.md` if present.
4. Classify wings as Hot, Warm, or Cold for the current task.
5. Load Hot wing `hall.md` files and closets first; load full rooms on demand.
6. Brief the user with last session, open threads, relevant knowledge, and gaps.

## During Work

Track saveable items in memory:

- code or file changes
- decisions made
- reusable patterns discovered
- lessons applied or created
- knowledge gaps
- unresolved follow-ups

If any of those occur, the session is dirty and should be saved before topic switches or session end.

## Session Save

When the user says "save session + learn", "remember this", or equivalent:

1. Score admission: save if the item has future utility, confidence, novelty, or a decision.
2. Update Palace:
   - `palace/state.md`
   - relevant wing `hall.md`
   - relevant `rooms/*.md` and `closets/*.md`
   - `palace/search-index.md`
   - `palace/tunnels.md` if cross-links changed
   - `palace/user-profile.md` if preferences changed
3. Update Knowledge:
   - `knowledge/index.md` for every new or changed article/lesson
   - `knowledge/evolution.md` for score/status/history changes
   - `knowledge/lessons/{domain}/index.md`
   - `knowledge/lessons/{domain}/{lesson-id}.md` for lesson details
4. Verify sync:
   - every saved room appears in the wing hall and `search-index.md`
   - every new lesson appears in the domain lesson index and global knowledge index
   - no JSON file was required for the save
5. Confirm what was saved and what remains open.

## Knowledge Index Format

`agent-memory/knowledge/index.md`:

```markdown
# Knowledge Index

Updated: YYYY-MM-DD

## Articles
| ID | Type | Scope | Status | Score | Updated | Path | Keywords |
|----|------|-------|--------|-------|---------|------|----------|

## Lessons
| ID | Domain | Type | Status | Applied | Prevented | Updated | Path |
|----|--------|------|--------|---------|-----------|---------|------|

## Gaps
| Domain | Gap | First Seen | Status | Notes |
|--------|-----|------------|--------|-------|
```

`agent-memory/knowledge/evolution.md`:

```markdown
# Knowledge Evolution

Updated: YYYY-MM-DD

## Change Log
| Date | ID | Change | Signal | Before | After | Evidence |
|------|----|--------|--------|--------|-------|----------|
```

`agent-memory/knowledge/lessons/{domain}/index.md`:

```markdown
# {Domain} Lessons

Updated: YYYY-MM-DD

| ID | Type | Status | Applied | Prevented | Confidence | Summary | Detail |
|----|------|--------|---------|-----------|------------|---------|--------|
```

## References

Load only the reference needed for the current action:

| Need | Load |
|------|------|
| Session load/save, bootstrap, dirty flag | `references/session.md` |
| Palace and Knowledge file schemas | `references/storage.md` |
| Scoring, routing, lessons, evolution | `references/intelligence.md` |
| Known failure modes | `GOTCHAS.md` |

| Consolidation, dedup, stale, auto-dream | `references/maintenance.md` |
| Domain setup, signal mapping, phases | `references/adaptation.md` |

## Operating Principles

- Human-readable first: tables and short Markdown sections beat nested data.
- One save means one synchronized memory update.
- Prefer updating existing rooms/articles over creating duplicates.
- Keep halls and indexes small enough to scan.
- Capture lessons as concrete reusable behavior, not vague summaries.
- Mark status explicitly: `draft`, `active`, `proven`, `stale`, or `deprecated`.
- When facts may have changed, verify from the workspace or authoritative source before treating memory as truth.
