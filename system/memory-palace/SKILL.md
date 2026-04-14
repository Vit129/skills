---
name: memory-palace
description: >
  This skill should be used when the user asks to "save memory", "load context",
  "compress room", "archive wing", "session start", "session end",
  "remember this for next session", "what did we do last time",
  "store this in memory", "update the palace", "create a wing",
  "check memory", "recall context", "palace health", "consolidate memory",
  or needs cross-session knowledge persistence for any project.
concurrency: unsafe
isolation: shared
---

# Memory Palace

Long-term memory management for AI agents across sessions. Everything is markdown files.

## 🏰 The Palace Hierarchy

- **L0: Wings** — Top-level domain (e.g., "postman-migration", "backend-api")
- **L1: Rooms** — Specific topic with full detail
- **L2: Closets** — AAAK-compressed summary of a Room (read first for Global State)
- **L3: Drawers / Raw** — Verbatim records, accessed only when exact detail needed
- **L4: Halls & Tunnels** — Halls index rooms within a wing; Tunnels link across wings

## 💠 AAAK (AI Agent Knowledge) Compression

Use AAAK principles when writing closets and summaries:

- **Lossless Density:** symbols, abbreviations, structural shorthand
- **Context Pinning:** always include "Current Truth" pointer
- **Relational Links:** use `->`, `=>` and temporal markers (`@2026-04-09`)

## 📁 Folder Structure

```text
{project}/.memory/
├── state.md                    ← palace map (≤100 lines)
├── tunnels.md                  ← cross-wing references
├── wings/
│   └── {topic}/
│       ├── hall.md             ← wing index (≤50 lines / ≤200 tokens)
│       ├── hall-detail.md      ← overflow from hall.md (optional)
│       ├── rooms/{room}.md
│       ├── closets/{room}.md   ← AAAK compressed (when room >80 lines)
│       └── raw/YYYY-MM-DD-{desc}.md
└── archive/
    ├── index.md                ← searchable index (≤200 lines)
    └── {topic}/{year}/
        ├── rooms/, closets/, raw/, sessions.md
        └── summary.md
```

**Rules:** Top-level = only `state.md`, `tunnels.md`, `wings/`, `archive/`. Max depth = 4 levels.

## 📖 Reference Files

Load the appropriate reference when needed:

| When | Load |
|------|------|
| Session start/end, loading context, schemas, archive | `references/scaling-protocol.md` |
| Auto-consolidation trigger, dedup, stale, dream | `references/scaling-protocol.md` §Auto-Consolidation |
| Deciding what to write, contradiction check | `references/admission-control.md` |
| Wing: discover, classify, create, archive | `references/wing-analysis.md` |
| Room: discover, gap, create, compress to closet | `references/room-analysis.md` |
| Hall: index, tunnels, state.md, palace health | `references/hall-analysis.md` |
| Technical logic, AAAK examples | `references/mempalace-logic.md` |

## ⚠️ Gotchas

- **Room >80 lines not compressed** — agent skips compression when room grows gradually. Fix: check room line count explicitly before session end, not just after writes.
- **hall.md drift** — hall.md becomes stale when rooms are added/renamed without updating the index. Fix: always update hall.md when creating or archiving a room.
- **Stale closet after room edit** — editing a room without regenerating its closet leaves the closet out of sync. Fix: after any room edit >10 lines, regenerate the closet.
- **state.md overflow** — state.md can exceed 100 lines if wings accumulate without archiving. Fix: archive wings that haven't been touched in 30+ days.
- **Tunnel references break on archive** — tunnels.md still points to archived rooms. Fix: update tunnels.md when archiving any wing.
- **Recalled facts treated as truth** — loaded hall.md/closets are hints only, not verified facts. Always grep/glob to verify before acting on recalled information.

## 📦 Optional Features

- **File Curator (v2)** — mine files directly into rooms (`curate @file → wing/room`)
