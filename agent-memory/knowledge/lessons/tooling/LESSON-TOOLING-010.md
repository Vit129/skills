---
id: LESSON-TOOLING-010
domain: tooling
type: pattern
status: active
applied: 1
prevented: 0
confidence: 1.0
created: 2026-04-29
updated: 2026-04-29
keywords: agent-memory, design-origins, mempalace, hermes, aaak, pure-markdown, sqlite-tradeoff
---

# LESSON-TOOLING-010: Agent Memory Design Origins

## Summary

Our agent-memory system is a **MemPalace-inspired Markdown implementation** mixed with Hermes learning loop. Understanding the origins explains why certain files are hard to maintain.

## Design Origins

| Our Component | Source | Original Implementation |
|---|---|---|
| palace/ + Wings/Rooms/Halls | MemPalace | Python library + SQLite |
| palace/tunnels.md | MemPalace Tunnel concept | SQLite cross-wing links |
| palace/graph.md | MemPalace Knowledge Graph | SQLite temporal KG |
| AAAK compression in state.md | MemPalace AAAK format | 30x compression, LLM-readable |
| knowledge/lessons/ | Hermes Skills system | ~/.hermes/skills/ |
| knowledge/evolution.md | Hermes learning loop | Agent-curated, self-improve |
| palace/user-profile.md | Hermes USER.md | ~/.hermes/memories/USER.md |
| palace/search-index.md | MemPalace search accuracy | SQLite FTS + structured index |

## Key Insight

MemPalace uses **SQLite + Python** for derived data (graph, tunnels, temporal KG, search). We implemented the same concepts in **pure Markdown** — which works for core files but makes derived files (graph.md, tunnels.md) a maintenance burden because:

1. SQLite auto-updates on write; Markdown requires manual sync
2. SQLite has temporal queries; Markdown has no built-in expiry
3. SQLite FTS is fast; Markdown search-index needs manual append

## Fix

Cut derived files (graph.md, tunnels.md, archive/, domain indexes) → keep only Markdown-native core files that don't need SQLite to stay consistent.
