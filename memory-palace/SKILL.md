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

## 🛠️ Application to Investment Dashboard

- **Structure mapping:**
  - `Wing`: Specific Investment Goal.
  - `Room`: Asset Class or Sector.
  - `Closet`: Portfolio Performance & Risk Signal Summary.
  - `Drawer`: Individual `Trade` and `Rebalance` events.
- **Decision Guardrails:** Before executing a trade, check the `Room`'s current strategy triple to ensure no contradiction (**Contradiction Detection**).
- **Maintenance:** Periodically **Prune** old or irrelevant transaction `Drawers` to keep the context window focused on the current investment cycle.
