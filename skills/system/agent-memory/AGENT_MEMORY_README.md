# Agent Memory

Agent Memory is a Markdown-first memory and learning system.

```text
Memory Palace      = what happened
Knowledge Library  = what works
Session Save       = update both together
```

## Why The Redesign

The previous design split durable memory across Markdown and JSON:

- Palace files were readable Markdown.
- Knowledge and indexes depended on JSON.
- JSON indexes often stayed stale.
- Knowledge did not reliably update when Palace changed.

The new contract is simpler:

- All persistent memory content is Markdown.
- `agent-memory/knowledge/index.md` is the knowledge source of truth.
- JSON files under `agent-memory/` are legacy import material only.
- A valid save must update both `palace/` and `knowledge/`.

## Layout

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
    ├── {article}.md
    └── lessons/{domain}/
        ├── index.md
        └── {lesson-id}.md
```

## Save Rule

When saving a session:

1. Update relevant Palace rooms, halls, state, and search index.
2. Extract reusable lessons, patterns, and gaps.
3. Update `knowledge/index.md`.
4. Update the domain lesson index.
5. Append meaningful score/status changes to `knowledge/evolution.md`.
6. Verify every saved item is discoverable from Markdown.

## Status

All phases implemented:

- `SKILL.md` — Markdown-first contract
- `references/session.md` — session load/save with routing, nudges, consolidation counter
- `references/storage.md` — all Markdown schemas including search-index archive
- `references/intelligence.md` — scoring, routing, crystallization, nudge rules
- `references/maintenance.md` — consolidation, dedup, stale, auto-dream
- `references/adaptation.md` — domain setup, Markdown index creation
- `GOTCHAS.md` — 30 failure modes updated for Markdown-first
- Hooks: session-load v3.1.0 (routing + nudges), session-save v6.0.0 (Knowledge Sync Gate + crystallization + consolidation counter)
- `agent-memory/knowledge/index.md`, `evolution.md`, `lessons/tooling/index.md` — live data

Remaining:
- `skills/ai-dlc/knowledge/` has ~30 JSON files needing Markdown migration (separate spec, tracked as open thread)
