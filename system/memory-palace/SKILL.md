---
name: memory-palace
description: >
  Organizes project knowledge into a hierarchical structure (Wings, Rooms, Closets, Drawers)
  using AAAK compression for high-density state management. Scales from small projects to
  large multi-wing palaces without any new dependencies — pure markdown files.
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
| Deciding what to write, contradiction check | `references/admission-control.md` |
| Before creating rooms, matching wings, gap analysis | `references/ai-techniques.md` |
| Technical logic, AAAK examples, MCP tools | `references/mempalace-logic.md` |
| ChromaDB, full version plan | `references/full-version-plan.md` |

## 📦 Optional Features

- **ChromaDB + Semantic Search** — see `references/full-version-plan.md`
- **MCP Tools (19 tools)** — see `references/mempalace-logic.md`
- **File Curator (v2)** — mine files directly into rooms (`curate @file → wing/room`)
