# Storage Schemas

The storage layer is Markdown-only for persistent memory content.

## Directory Layout

```text
agent-memory/
├── palace/
│   ├── state.md
│   ├── tunnels.md
│   ├── search-index.md
│   ├── user-profile.md
│   ├── wings/
│   │   └── {wing}/
│   │       ├── hall.md
│   │       ├── hall-detail.md
│   │       ├── rooms/{room}.md
│   │       ├── closets/{room}.md
│   │       ├── skills/{skill}.md
│   │       └── raw/YYYY-MM-DD-*.md
│   └── archive/
│       ├── index.md
│       └── search-index-archive.md
└── knowledge/
    ├── index.md
    ├── evolution.md
    ├── {article}.md
    └── lessons/{domain}/
        ├── index.md
        └── {lesson-id}.md
```

## Palace State

`agent-memory/palace/state.md`

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
- last_consolidation: YYYY-MM-DD

## Open Threads
- [ ] {wing}: {thread}
```

Keep `Recent Sessions` to the most useful recent entries. Archive old detail into rooms or archive files.

## Wing Hall

`agent-memory/palace/wings/{wing}/hall.md`

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

At save time, compare `rooms/*.md` to the `Rooms Index` table and repair drift.

## Room

`agent-memory/palace/wings/{wing}/rooms/{room}.md`

```markdown
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

Rules:

- One room per topic.
- Prefer facts, decisions, evidence, and rejected options.
- If a fact changes, update current state and preserve the old value in the decisions log or temporal note.
- Avoid verbatim transcripts unless they belong in `raw/`.

## Closet

`agent-memory/palace/wings/{wing}/closets/{room}.md`

Use when a room grows beyond roughly 80 lines.

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

## Search Index

`agent-memory/palace/search-index.md`

```markdown
# Session Search Index

| Date | Wing | Keywords | Path | Summary |
|------|------|----------|------|---------|
```

Rules:

- Append or update one row per saved session or meaningful room update.
- Keep keywords short and grep-friendly.
- Use Markdown links or relative paths that point to the actual file.
- Do not maintain `keyword-index.json` or `date-index.json`; they are legacy.
- Hard cap: max 500 rows in the active index. When exceeded, archive rows older than 180 days to `palace/archive/search-index-archive.md`.

## Search Index Archive

`agent-memory/palace/archive/search-index-archive.md`

```markdown
# Search Index Archive

Rows older than 180 days moved from `palace/search-index.md` when active index exceeds 500 rows.

| Date | Wing | Keywords | Path | Summary |
|------|------|----------|------|---------|
```

Same table schema as `search-index.md`. Rows are appended here when the active index exceeds 500 rows and the row date is older than 180 days.

## Knowledge Index

`agent-memory/knowledge/index.md`

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

Score is a lightweight usefulness score from `0.0` to `10.0`.

Status values:

- `draft`: captured but not proven
- `active`: safe to use
- `proven`: repeated positive outcome
- `stale`: needs review
- `deprecated`: avoid unless explicitly requested

## Knowledge Article

`agent-memory/knowledge/{article}.md`

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

## Evidence
- YYYY-MM-DD: {where it worked or failed}

## Maintenance
- status: {status}
- next_review: YYYY-MM-DD
```

## Lesson Domain Index

`agent-memory/knowledge/lessons/{domain}/index.md`

```markdown
# {Domain} Lessons

Updated: YYYY-MM-DD

| ID | Type | Status | Applied | Prevented | Confidence | Summary | Detail |
|----|------|--------|---------|-----------|------------|---------|--------|
```

## Lesson Detail

`agent-memory/knowledge/lessons/{domain}/{lesson-id}.md`

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

## Knowledge Evolution

`agent-memory/knowledge/evolution.md`

```markdown
# Knowledge Evolution

Updated: YYYY-MM-DD

## Change Log
| Date | ID | Change | Signal | Before | After | Evidence |
|------|----|--------|--------|--------|-------|----------|
```

Use this instead of embedding long history arrays in an index.

## User Profile

`agent-memory/palace/user-profile.md`

```markdown
# User Profile

Updated: YYYY-MM-DD

## Preferences
- Language: {language preferences}
- Response style: {style preferences}
- Preferred tools: {tools}
- Work patterns: {patterns}

## Observed Patterns (auto-captured)
- Decision style: {style}
- Common domains: {domains}
- Typical session length: {length}
- Feedback style: {style}
- Build approach: {approach}

## Communication
- Likes: {preferences}
- Dislikes: {anti-preferences}
- Tone: {tone}

## Domain Expertise
- Strong: {domains}
- Learning: {domains}
- Delegated: {domains}

## Nudge Tracking

| Category | Skipped | Last Shown | Suppressed Until |
|----------|---------|------------|-----------------|

## Save Preferences
- Sensitivity: normal | aggressive | conservative
- Auto-capture domains: {comma-separated domains}
- Skip threshold: {N} consecutive skips → reduce to High priority only

## Routing Preferences
- Priority domains: {comma-separated domains}
- Preferred article types: {comma-separated types}
- Score threshold for brief: {N.N} (show active and above)
```

Rules:

- Nudge Tracking records skipped nudge counts per category. Agents update this when a nudge is shown but not acted on.
- Save Preferences controls how aggressively the system captures lessons. `normal` captures on explicit signals, `aggressive` captures on any pattern, `conservative` only on user request.
- Routing Preferences guides score-based knowledge routing at session start. Priority domains are checked first, and articles below the score threshold are excluded from the session brief.
- If skip rate exceeds 80%, reduce nudges to max 2 and show High priority only.
