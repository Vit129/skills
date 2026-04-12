---
name: knowledge-evolution
description: >
  Reusable pattern for making any knowledge base self-evolving through execution feedback.
  Use when the user asks to "make knowledge self-evolving", "track which templates work",
  "score lessons by effectiveness", "auto-capture patterns from failures",
  "add feedback loop to knowledge", "improve routing with intent matching",
  "knowledge base keeps getting better", "templates that work get promoted",
  "lessons learned from test results", "knowledge feedback loop",
  or when designing a system where AI should learn from its own execution history.
  Adapt to any domain — not tied to any specific tech stack or file format.
---

# Knowledge Evolution

A pattern for making any knowledge base self-improving through a closed feedback loop.
Adapt the concepts here to your system's storage format, naming conventions, and workflow.

## Core Concept

```
Read → Execute → Reflect → Write
  ↑                           ↓
  └─────── knowledge ─────────┘
```

Every execution produces a signal. Good outcomes promote knowledge. Bad outcomes flag it.
The system learns which knowledge is reliable without human intervention.

## Six Concepts — Load ONE per task

| Need | Load |
|------|------|
| "score templates/lessons", "track usage", "flag bad templates", "auto-capture from failures" | `references/utility-scoring.md` |
| "improve routing", "intent matching", "find best match", "sort by effectiveness" | `references/smart-routing.md` |
| "semantic search", "BM25", "embedding-based routing", "knowledge base too large for patterns" | `references/semantic-routing.md` |
| "cross-session tracking", "memory palace integration", "sync scores back to source" | `references/memory-integration.md` |
| "consolidate knowledge", "deduplicate lessons", "prune stale", "auto-dream", "clean up knowledge" | `references/auto-consolidation.md` |
| "analyze multiple failures", "batch lesson capture", "parallel trace analysis", "conflict-free lessons" | `references/parallel-analysis.md` |
| "implement all of this", "phase-by-phase plan", "what files to change" | `references/implementation-guide.md` |

## How to Adapt

This skill describes **concepts**, not implementations. Each system will differ:

- **Storage format** — json index files, markdown, database, vector store — adapt the schema
- **Trigger points** — after test run, after save, on session end — adapt to your workflow hooks
- **Score fields** — `utility_score` is a suggestion; rename to fit your domain
- **Routing logic** — intent patterns work for keyword-based systems; swap for semantic search if available
- **Memory layer** — Memory Palace is the reference implementation; any persistent store works

## Adaptation Steps

1. Read the concept reference that matches your need
2. Identify your system's equivalent of: knowledge store, execution trigger, score field, routing logic
3. Map the concept's `{placeholders}` to your system's actual paths and field names
4. Implement the minimal version first — scoring alone adds value without routing or memory

## Design Principles

- **No new dependencies** — works with whatever storage format already exists
- **Additive only** — new fields don't break existing consumers
- **Graceful degradation** — if score is missing, treat as neutral (5.0), never block execution
- **Human override always wins** — auto-captured knowledge is advisory, not authoritative
- **Source of truth stays in files** — memory/tracking layers are caches, not replacements
