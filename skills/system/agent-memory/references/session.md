# Session Workflow

Markdown-first session loading, dirty tracking, and saving.

## Bootstrap

If `{project_root}/agent-memory/` does not exist, create:

```text
agent-memory/
├── palace/
│   ├── state.md
│   ├── tunnels.md
│   ├── search-index.md
│   ├── user-profile.md
│   ├── wings/
│   └── archive/index.md
└── knowledge/
    ├── index.md
    ├── evolution.md
    └── lessons/
```

Create minimal Markdown files:

```markdown
# Palace State

## Active Wings

## Recent Sessions
| Date | Wing | Summary |
|------|------|---------|

## Current Focus
- focus:
- blockers:
- next_action:

## Open Threads
```

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

## Session Start

1. Read `agent-memory/palace/state.md`.
2. Read `agent-memory/palace/user-profile.md` if present.
3. Read `agent-memory/knowledge/index.md` if present.
4. Read `agent-memory/knowledge/evolution.md` if present.
5. Score-based knowledge routing:
   - Extract keywords from the user's current prompt.
   - Scan Articles table in `knowledge/index.md`: match Keywords column against prompt keywords. Sort by Score DESC.
   - Scan Lessons table in `knowledge/index.md` and `knowledge/lessons/{domain}/index.md`: match Summary/Keywords against prompt keywords. Sort by Confidence DESC.
   - Routing tiers: 7.0+ = proven (prefer first), 3.0–6.9 = active (normal use), <3.0 = stale (warn before use).
   - Keep top 3 relevant matches (articles + lessons combined).
   - If no matches found, note the topic as a potential knowledge gap in the brief (do NOT auto-add to Gaps table).
6. Check if consolidation is due:
   - Read `knowledge/evolution.md` → Consolidation State section.
   - If `sessions_since_consolidation` ≥ 5 OR days since `last_consolidation` ≥ 7, include a nudge in the session brief: "Consolidation due ({N} sessions since last). Say 'consolidate knowledge' to run."
7. Classify wings:
   - Hot: directly relevant to today's task
   - Warm: adjacent context
   - Cold: unrelated today
8. Load Hot wing `hall.md` files and closets. Load full rooms only when needed.
9. Brief the user:

```text
Memory loaded: {project}
Last: {recent session}
Open: {open threads or none}
Relevant knowledge: {articles/lessons}
Gaps: {known gaps or none}
```

## Dirty Tracking

Set `dirty = true` when the session includes:

- file edits or generated artifacts
- decisions
- architecture/design choices
- reusable patterns
- lessons applied or created
- new gaps
- unresolved follow-ups

Do not mark dirty for simple Q&A, read-only inspection, or routine command output unless it produced a decision.

When dirty and the user switches topics or ends the session, remind once:

```text
Session has unsaved memory:
- {item}
- {item}

Say "save session + learn" to persist it.
```

## Session Save

Run this on "save session + learn", "remember this", or an equivalent request.

### 1. Admission Control

Save when at least one is true:

- Future utility is clear.
- A decision was made.
- A reusable lesson or pattern appeared.
- The information is new and likely to matter later.
- The user explicitly asks to remember it.

Skip or ask before saving if the content is low-novelty or speculative.

### 2. Update Palace

For each topic:

1. Find or create the relevant wing.
2. Update or create `rooms/{topic}.md`.
3. If a room exceeds roughly 80 lines, create or refresh `closets/{topic}.md`.
4. Update the wing `hall.md` so its room table matches disk.
5. Update `palace/state.md`:
   - recent sessions
   - active wings
   - current focus
   - open threads
6. Update `palace/search-index.md` with a row for the session or changed room.
7. Archive old search-index rows if needed:
   - If `search-index.md` has more than 500 rows, move rows older than 180 days to `palace/archive/search-index-archive.md`.
   - The archive file uses the same table schema: Date | Wing | Keywords | Path | Summary.
   - Append moved rows to the archive table and remove them from the active index.
8. Update `palace/tunnels.md` if cross-wing links changed.
9. Update `palace/user-profile.md` only for stable user preferences or patterns.

### 3. Update Knowledge

For each reusable pattern, lesson, or gap:

1. Update or create a knowledge article under `knowledge/*.md`.
2. Update `knowledge/index.md`.
3. Update or create `knowledge/lessons/{domain}/index.md`.
4. Create a lesson detail file when the lesson needs more than one table row:
   `knowledge/lessons/{domain}/{lesson-id}.md`.
5. Append the score/status/history change to `knowledge/evolution.md`.

### 4. Crystallization Check

After updating knowledge, check if any pattern is ready to crystallize:

1. Scan `knowledge/evolution.md` Change Log for entries sharing the same domain/topic with 2+ POSITIVE or VALIDATED signals.
2. Verify both source entries have the same domain/topic (safeguard — do not merge unrelated domains).
3. If a candidate is found:
   - In interactive sessions: ask the user "Pattern detected: {description}. Crystallize as draft article? [y/n]"
   - In automated hooks (agentStop): auto-create the draft without asking (hooks run automatically). Note the crystallization in the confirm output.
4. Create `knowledge/{pattern-id}.md` with YAML frontmatter (status: draft, score: 5.0), add to `knowledge/index.md` Articles table as `draft`, and log in `knowledge/evolution.md`.
5. If the user declines (interactive only): skip.

Promotion lifecycle (applied in future saves):

| Transition | Condition |
|------------|-----------|
| draft → active | One more positive use of the pattern |
| active → proven | Score reaches ≥7.0 with multiple positive uses |
| active/proven → stale | Article unused for 60+ days |
| stale → active | Article used again with a positive outcome |

### 5. Verify

Before confirming:

- Every changed room appears in its wing hall.
- Every session memory appears in `palace/search-index.md`.
- Every new or updated article appears in `knowledge/index.md`.
- Every new or updated lesson appears in both `knowledge/index.md` and its domain lesson index.
- No JSON memory file was written as part of the save.

### 6. Confirm

```text
Saved:
- Palace: {rooms/wings/search index}
- Knowledge: {articles/lessons/evolution}
- Open: {remaining follow-ups}
```

### 7. Increment Consolidation Counter

After a successful save, increment `sessions_since_consolidation` in `knowledge/evolution.md` → Consolidation State section by 1. This tracks how many sessions have passed since the last consolidation run.

## Consolidation

Consolidation is a manual command ("consolidate knowledge") that the user triggers. It is NOT run automatically by hooks.

**Trigger conditions** (any one):
- `sessions_since_consolidation` ≥ 5
- Days since `last_consolidation` ≥ 7
- Knowledge items increased by >20% since last consolidation
- User explicitly asks "consolidate knowledge"

**Tracking**: Consolidation state is tracked in `knowledge/evolution.md` under the Consolidation State section (`sessions_since_consolidation` and `last_consolidation`). The session-save hook increments the counter (Step 7) and checks if consolidation is due (Step 4D / Session Start step 6) to show a reminder nudge.

**Full workflow**: See `references/maintenance.md` for the complete 8-step consolidation process (deduplication, stale detection, date normalization, conflict resolution, score normalization, auto-dream, archival, tracking update).

## Legacy JSON Handling

If a legacy JSON file exists, treat it as import material only:

1. Read it only when the Markdown replacement is missing or incomplete.
2. Convert useful entries into Markdown.
3. Do not write new state back to JSON.
4. Prefer leaving the JSON untouched over maintaining two sources of truth.
