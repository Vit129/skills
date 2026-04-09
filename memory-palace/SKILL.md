---
name: memory-palace
description: >
  Organizes project knowledge into a hierarchical structure (Wings, Rooms, Closets, Drawers)
  using AAAK (AI Agent Knowledge) compression for high-density state management and 
  temporal knowledge graphs for tracking changes over time.
---

# Memory Palace

A system for high-recall, long-term memory management for AI agents, inspired by the "Memory Palace" metaphor and the MemPalace repository.

## 🏰 The Palace Hierarchy

Divide project knowledge into layers to maximize recall and minimize context bloat:

- **L0: Wings (High-Level Domain):** Top-level categories (e.g., "Retirement Portfolio", "System Architecture").
- **L1: Rooms (Topic/Module):** Semantic groupings within a wing (e.g., "DCA Logic", "Tailwind Migration", "API Service").
- **L2: Closets (State Summaries):** AAAK-compressed summaries of a Room. This is what the AI should read first to get the "Global State".
- **L3: Drawers (Leaf Data):** Verbatim records, raw transaction logs, or specific code snippets. These are accessed only when detailed evidence is needed.
- **L4: Halls & Tunnels (Relational Links):**
  - **Halls:** Connections between Rooms within the same Wing.
  - **Tunnels:** Connections between Rooms in different Wings.

## 💠 AAAK (AI Agent Knowledge) Compression

When summarizing state or technical context, use AAAK principles:

- **Lossless Density:** Use symbols, abbreviations, and structural shorthand that the LLM understands but takes fewer tokens.
- **Context Pinning:** Always include the "Current Truth" (Pointer to the latest version/state).
- **Relational Links:** Use arrows (`->`, `=>`) and temporal markers (`@2026-04-09`) to show relationships.

## 🕰️ Temporal Knowledge Graph

Track the "History of Truth" using Temporal Triples:

- **Format:** `(Subject, Predicate, Object) [valid_from - valid_to]`
- **Usage:** Never just overwrite state. Document when a strategy was active.
  - *Example:* `(AAPL, strategy, DCA-Aggressive) [2024-01-01 - 2024-03-31]`
  - *Example:* `(AAPL, strategy, Hold) [2024-04-01 - Present]`

## 🛠️ Application

### Storage Locations (Hybrid)

**Per-project (default):**
```
{project}/.memory/          ← project-specific memory, commit to git
```

**Global (optional):**
```
~/.memory-palace/global/    ← cross-project memory (skill decisions, shared patterns)
```

**Resolution order:** AI reads `{project}/.memory/state.md` first. If user asks about cross-project context → read `~/.memory-palace/global/state.md`.

Generic mapping for any project:
- `Wing` — project or domain (e.g., "postman-migration", "backend-api")
- `Room` — specific topic with full detail
- `Closet` — AAAK-compressed summary of a room
- `Drawer` — verbatim records, raw data, code snippets
- `Hall` — intra-wing connections (category index)
- `Tunnel` — cross-wing references

## 🔁 Session Workflow

### On Session Start
1. Read `{project}/.memory/state.md` to load palace map (or `.claude/memory/state.md` if `.memory/` doesn't exist yet)
2. Identify relevant wing(s) for current task
3. Read `hall.md` + relevant rooms to restore context
4. Brief user on last session context

### On Session End
**SKIP saving if session was ONLY:**
- Q&A with no decisions made
- Comparisons without a conclusion
- Commit messages / git commands only
- Repeating information already in palace

**SAVE if session had ANY of:**
- File writes or code changes
- A decision made (even from a comparison)
- New open threads identified
- Architecture or design choices

If SAVE → follow 10-step process in workspace adapter.

## 🗂️ Archive System

Long-term storage for inactive wings and old session history.

### Structure
```
archive/
├── index.md                    ← AI reads this first when searching past work
└── {topic}/                    ← topic-first (e.g., postman-migration)
    ├── summary.md              ← AAAK snapshot, latest state, read before drilling down
    └── {year}/                 ← year subfolder (e.g., 2026)
        ├── rooms/              ← archived room files
        ├── closets/            ← compressed summaries
        └── sessions.md         ← session rows from that year
```

### When to Archive
- Wing has no activity for >2 sprints (or user says "archive {wing}")
- Recent Sessions in state.md >10 rows → move old rows to `archive/{topic}/{year}/sessions.md`
- User explicitly requests archival

### How to Archive
1. Move entire wing folder from `wings/{topic}/` to `archive/{topic}/{year}/`
2. Create/update `archive/{topic}/summary.md` with AAAK snapshot
3. Update `archive/index.md` with new entry
4. Remove wing from `state.md` Active Wings
5. Move related tunnel entries to archive if both wings are archived

### How to Search Archives
1. Read `archive/index.md` → find topic
2. Read `archive/{topic}/summary.md` → get overview
3. Drill down to `archive/{topic}/{year}/rooms/` for detail

### Restore from Archive
- Copy wing folder from `archive/{topic}/{year}/` back to `wings/{topic}/`
- Re-add to `state.md` Active Wings

## 📦 Optional Features

### Raw Verbatim Storage (Optional)
Store full uncompressed conversation/data alongside AAAK closets for maximum recall.

- Create `wings/{topic}/raw/` folder for verbatim records
- Use when exact wording matters (e.g., API responses, error messages, user quotes)
- Default is AAAK compression — enable raw only when lossless recall is critical
- Trade-off: higher file size + token cost vs. zero information loss

### ChromaDB + Semantic Search (Optional — Full Version)
Upgrade from file-based search to vector similarity search.

- Requires: Python 3.9+, ChromaDB
- Store every conversation in ChromaDB vectors
- Search by meaning, not just keywords
- See `references/full-version-plan.md` for implementation details

### MCP Tools (Optional — Full Version)
19 standard tools for programmatic palace management.

| Category | Tools |
|----------|-------|
| Hierarchy CRUD | `add_wing`, `add_room`, `add_closet`, `add_drawer`, `delete_x` |
| Relational | `add_hall` (intra-wing), `add_tunnel` (inter-wing) |
| Knowledge | `add_fact` (triples), `add_rule` (logic), `get_fact_history` |
| Retrieval | `search` (global), `search_rooms`, `get_taxonomy` |
| Maintenance | `prune_memory`, `clear_all` |

- Requires: MCP server setup (see `references/full-version-plan.md`)
- Not needed for Light version — markdown files work without MCP
