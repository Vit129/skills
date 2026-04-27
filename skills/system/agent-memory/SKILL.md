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
    │   ├── graph.md               ← required from first wing
    │   ├── wings/
    │   │   └── {topic}/
    │   │       ├── hall.md
    │   │       ├── rooms/{room}.md
    │   │       ├── closets/{room}.md
    │   │       └── raw/YYYY-MM-DD-*.md
    │   └── archive/
    │       ├── index.md
    │       └── search-index-archive.md
    └── knowledge/
        ├── index.md
        ├── evolution.md
        ├── articles/{domain}/
        │   └── {article}.md
        └── lessons/{domain}/
            ├── index.md
            └── {lesson-id}.md
```

Optional legacy files (read-only, never write):

```text
agent-memory/knowledge/index.json
agent-memory/knowledge/lessons/**/**Index.json
agent-memory/palace/keyword-index.json
agent-memory/palace/date-index.json
```

---

## File Schemas

### palace/state.md

```markdown
# Palace State — {project}

## Active Wings
- **{wing}** — {description} (last updated: YYYY-MM-DD)

## Recent Sessions
| Date | Wing | Summary |
|------|------|---------|

## Current Focus
- focus: "{current focus}"
- blockers: "{blockers or empty}"
- next_action: "{next action}"

## Open Threads
- [ ] {wing}: {thread}
```

### palace/graph.md

Create when the first wing is created. Populate as wings and rooms are added.

```markdown
# Palace Graph

Updated: YYYY-MM-DD

## Nodes
| ID | Type | Status | Tags | Notes |
|----|------|--------|------|-------|
| {wing-id} | wing | hot | tag1, tag2 | {one-line description} |

## Rooms
| ID | Wing | Status | Tags |
|----|------|--------|------|
| {wing}/{room} | {wing-id} | hot | tag1, tag2 |

## Edges
| From | To | Type | Purpose |
|------|----|------|---------|
| {wing-a}/{room} | {wing-b}/{room} | tunnel | {why linked} |
| {wing} | knowledge/lessons/{domain}/{lesson} | knowledge | {reusable rule} |
```

Status: `hot` (active this session), `active` (recent), `complete` (done), `archived`.
Edge types: `tunnel` (cross-wing), `knowledge` (wing → knowledge file).

### palace/tunnels.md

Use prose format with Purpose and Sync fields:

```markdown
# Cross-Wing Tunnels

## Active

({wing-a}, {room-or-hall}) → ({wing-b}, {room-or-hall})
  Purpose: {why these are linked}
  Sync: {when to update this tunnel}

## Archived
(none)
```

Update tunnels.md synchronously when archiving a wing.

### palace/wings/{wing}/hall.md

```markdown
# Hall — {wing}

## Summary
{one paragraph}

## Facts
- {stable fact}

## Decisions
- [YYYY-MM-DD] {decision and reason}

## Rooms Index
| Room | Description | Updated |
|------|-------------|---------|

## Open Threads
- [ ] {thread}
```

Optional sections for project wings with milestones:

```markdown
## Vision
{one sentence goal}

## Deliverables
- ✅ {completed item}
- 🟡 {in-progress item}
- 🔲 {planned item}

## Shipped Metrics
- Build: ✅/❌
- Coverage: {what was tested}
- Commits: {hash or range}

## Tunnel Links
- ← {source wing}: {relationship}
- → {target wing or knowledge path}: {relationship}
```

At save time, compare `rooms/*.md` to the Rooms Index table and repair drift.

### palace/wings/{wing}/rooms/{room}.md

Add YAML frontmatter to every room:

```markdown
---
wing: {wing-name}
status: hot | active | complete
tags: [tag1, tag2]
created: YYYY-MM-DD
updated: YYYY-MM-DD
links: ["[[{wing}/hall]]", "[[knowledge/lessons/{domain}/{lesson-id}]]"]
---

# {Room}

## Current State
{active facts}

## Decisions Log
- YYYY-MM-DD: {decision} — reason: {why}

## Implementation Details
- {verified path/config/fact}

## Rejected Approaches
- {approach}: {reason}

## Open Questions
- {question}
```

### palace/wings/{wing}/closets/{room}.md

Use when a room grows beyond ~80 lines:

```markdown
# {Room} — Closet

## Atomic
- {single fact}

## Abstracted
{compressed meaning}

## Applied
- {how to use this next time}

## Known Gaps
- {gap}
```

Never drop Decision+Reason or Core Business Logic when compressing.

### palace/search-index.md

```markdown
# Session Search Index

| Date | Wing | Keywords | Path | Summary |
|------|------|----------|------|---------|
```

Hard cap: 500 rows. When exceeded, archive rows older than 180 days to `palace/archive/search-index-archive.md`.

### knowledge/index.md

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

Score: `0.0`–`10.0`. Status: `draft` | `active` | `proven` | `stale` | `deprecated`.

### knowledge/evolution.md

```markdown
# Knowledge Evolution

Updated: YYYY-MM-DD

## Consolidation State
- sessions_since_consolidation: 0
- last_consolidation: YYYY-MM-DD
- next_due: after 5 sessions or 7 days

## Change Log
| Date | ID | Change | Signal | Before | After | Evidence |
|------|----|--------|--------|--------|-------|----------|
```

Consolidation rules: increment counter after every dirty save; reset to 0 after consolidation. Due when `sessions_since >= 5` OR `days_since >= 7`.

### knowledge/articles/{domain}/{article}.md

```markdown
---
id: article-id
type: pattern | template | rule | reference
scope: global | project
status: active
score: 5.0
updated: YYYY-MM-DD
keywords: keyword-a, keyword-b
---

# {Title}

## Use When
- {trigger}

## Pattern
{reusable guidance}

## Related Lessons
- `lessons/{domain}/{lesson-id}.md`

## Evidence
- YYYY-MM-DD: {where it worked or failed}

## Maintenance
- status: {status}
- next_review: YYYY-MM-DD
```

### knowledge/lessons/{domain}/index.md

```markdown
# {Domain} Lessons

Updated: YYYY-MM-DD

| ID | Type | Status | Applied | Prevented | Confidence | Summary | Detail |
|----|------|--------|---------|-----------|------------|---------|--------|
```

### knowledge/lessons/{domain}/{lesson-id}.md

```markdown
---
id: LESSON-DOMAIN-001
domain: domain
type: bug | pattern | architecture | preference
status: active
confidence: 0.90
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# {Lesson Title}

## Summary
{one or two sentences}

## Detail
{what happened and why it matters}

## Apply Next Time
- {concrete behavior}

## Evidence
- {source session/path}
```

---

## Session Start

When the user asks to load memory:

1. Find `{project_root}/agent-memory/`. If missing, bootstrap the Markdown tree (see `references/session.md`).
2. Read `palace/state.md` and `palace/user-profile.md`.
3. Read `knowledge/index.md` and `knowledge/evolution.md`.
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
   - `palace/graph.md` (add/update nodes and edges)
   - `palace/search-index.md`
   - `palace/tunnels.md` if cross-links changed
   - `palace/user-profile.md` if preferences changed
3. Update Knowledge:
   - `knowledge/index.md` for every new or changed article/lesson
   - `knowledge/evolution.md` (append row + increment consolidation counter)
   - `knowledge/articles/{domain}/{article}.md` for article content
   - `knowledge/lessons/{domain}/index.md`
   - `knowledge/lessons/{domain}/{lesson-id}.md` for lesson details
4. Verify sync:
   - every saved room appears in the wing hall, graph.md, and `search-index.md`
   - every new lesson appears in the domain lesson index and global knowledge index
   - no JSON file was required for the save
5. Confirm what was saved and what remains open.

## References

Load only when needed for the current action:

| Need | Load |
|------|------|
| Session bootstrap, dirty flag details | `references/session.md` |
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
