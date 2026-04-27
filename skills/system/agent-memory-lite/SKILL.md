---
name: agent-memory-lite
description: >
  Lightweight persistent memory + learning system. Same features as agent-memory
  but with fewer files — merged palace and knowledge into compact structure.
  Use when: "save memory", "load context", "remember this", "what did we do last time".
concurrency: unsafe
isolation: shared
---

# Agent Memory Lite

Same core loop as full agent-memory, fewer files.

```text
Memory Palace      = what happened (palace/state.md + palace/topics/)
Knowledge Library  = what works (knowledge/index.md + knowledge/lessons/)
Session Save       = update both together, always
```

## Non-Negotiables

- Markdown-only. No JSON memory files.
- Source of truth: `knowledge/index.md` (includes evolution log).
- Palace updates without Knowledge updates are incomplete saves.
- Verify paths on disk before acting on remembered facts.

## Storage Architecture

```text
{project_root}/
└── agent-memory/
    ├── palace/
    │   ├── state.md              ← sessions, focus, threads, search index, user profile, cross-links
    │   ├── topics/               ← flat topic files (1 per topic, replaces wings/rooms/halls)
    │   │   └── {topic}.md
    │   └── archive.md            ← archived topics + old search rows
    └── knowledge/
        ├── index.md              ← articles + lessons + gaps + evolution log + consolidation state
        └── lessons/
            └── {domain}.md       ← lessons per domain (table + details in one file)
```

## Lite vs Full Comparison

| Feature | Full | Lite |
|---------|------|------|
| Files (minimum) | ~15+ | ~3 (state.md, index.md, archive.md) |
| Palace structure | wings/rooms/halls/closets + graph.md | flat topics/ folder |
| Room metadata | YAML frontmatter + links | not applicable |
| Search index | separate search-index.md | section in state.md |
| User profile | separate user-profile.md | section in state.md |
| Cross-links | separate tunnels.md (prose + Purpose+Sync) | section in state.md |
| Knowledge index | separate index.md | index.md (with evolution) |
| Evolution log | separate evolution.md | section in index.md |
| Lesson files | lessons/{domain}/index.md + {id}.md | lessons/{domain}.md (all-in-one) |
| Articles | articles/{domain}/{article}.md | inline in index.md Articles table |
| Score routing | ✅ | ✅ |
| Nudge system | 5 types, max 3 | consolidation + stale + gap (max 2) |
| Crystallization | ✅ auto-draft | ✅ inline in index.md |
| Consolidation | ✅ | ✅ |
| Knowledge Sync Gate | ✅ | ✅ |
| Dirty tracking | ✅ | ✅ |

## Session Start

1. Find `agent-memory/`. Bootstrap if missing.
2. Read `palace/state.md` (includes user profile, search index, cross-links).
3. Read `knowledge/index.md` (includes evolution log, consolidation state).
4. Score-based routing: match prompt keywords against Articles/Lessons, top 2 matches.
5. Nudge check (max 2): consolidation due? stale knowledge? open gap?
6. Load relevant `palace/topics/{topic}.md` if Hot.
7. Brief user. dirty=false.

## Session Save

1. Admission control: save if decision, lesson, pattern, gap, or user asks.
2. Update `palace/state.md`:
   - Recent Sessions table
   - Current Focus + Open Threads
   - Search Index table (append row)
   - User Profile (if preferences changed)
   - Cross-Links (if topic relationships changed)
3. Update or create `palace/topics/{topic}.md` for detailed session content.
4. Update `knowledge/index.md`:
   - Articles/Lessons/Gaps tables
   - Evolution Log (append row — mandatory every dirty save)
   - Consolidation State (increment counter)
5. Update `knowledge/lessons/{domain}.md` if lesson captured.
6. Crystallization: if 2+ POSITIVE entries for same domain → add draft row to Articles.
7. Verify: state.md has session row, index.md has evolution row, no JSON written.
8. Confirm.

## palace/state.md Schema

```markdown
# Palace State

## Active Topics
- **{topic}** — {description} (last updated: YYYY-MM-DD)

## Recent Sessions
| Date | Topic | Summary |
|------|-------|---------|

## Current Focus
- focus: "{current focus}"
- blockers: ""
- next_action: "{next}"

## Open Threads
- [ ] {thread}

## Search Index
| Date | Topic | Keywords | Path | Summary |
|------|-------|----------|------|---------|

## User Profile
- Language: {prefs}
- Style: {prefs}
- Domains: {expertise}

## Cross-Links
| From | To | Relationship |
|------|----|-------------|
```

## knowledge/index.md Schema

```markdown
# Knowledge Index

Updated: YYYY-MM-DD

## Articles
| ID | Type | Scope | Status | Score | Updated | Keywords |
|----|------|-------|--------|-------|---------|----------|

## Lessons
| ID | Domain | Type | Status | Applied | Prevented | Updated | Path |
|----|--------|------|--------|---------|-----------|---------|------|

## Gaps
| Domain | Gap | First Seen | Status | Notes |
|--------|-----|------------|--------|-------|

## Consolidation State
- sessions_since_consolidation: 0
- last_consolidation: YYYY-MM-DD

## Evolution Log
| Date | ID | Change | Signal | Before | After | Evidence |
|------|----|--------|--------|--------|-------|----------|
```

## palace/topics/{topic}.md Schema

```markdown
# {Topic}

## Current State
{active facts}

## Decisions
- YYYY-MM-DD: {decision} — reason: {why}

## Details
{implementation notes, paths, configs}

## Open Questions
- {question}
```

## knowledge/lessons/{domain}.md Schema

```markdown
# {Domain} Lessons

Updated: YYYY-MM-DD

## Index
| ID | Type | Status | Applied | Prevented | Confidence | Summary |
|----|------|--------|---------|-----------|------------|---------|

## LESSON-{DOMAIN}-001: {Title}
**Type:** bug | pattern | architecture
**Status:** active | draft | stale
**Confidence:** 0.90

{Detail — what happened, why it matters, how to apply next time}

**Evidence:** {source}
```

## Upgrade Path

When Lite becomes too crowded (state.md >150 lines, index.md >200 lines):
1. Split `state.md` → separate `search-index.md`, `user-profile.md`, `tunnels.md`
2. Split `topics/` → `wings/{topic}/hall.md` + `rooms/`
3. Split `index.md` → separate `evolution.md`
4. Split `lessons/{domain}.md` → `lessons/{domain}/index.md` + `{id}.md`
5. You now have Full agent-memory

## References

Same as full agent-memory — load from `skills/system/agent-memory/references/` when needed:
- `references/session.md` — bootstrap, dirty flag details
- `references/intelligence.md` — scoring, routing, lessons
- `references/maintenance.md` — consolidation, dedup, stale
- `references/adaptation.md` — domain setup, signal mapping
- `references/GOTCHAS.md` — known failure modes
