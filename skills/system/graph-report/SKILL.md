---
name: graph-report
description: >
  This skill should be used when the user asks to "create graph report", "generate GRAPH_REPORT",
  "update knowledge graph", "map project dependencies", "สร้าง graph report",
  "อัปเดต graph report", or when a project reaches a milestone where its architecture
  should be documented for fast navigation. Also triggers on "อ่านง่ายกว่า src/",
  "project map", "dependency map", or "codebase overview".
---

# Graph Report Generator

Generate or update a per-project `GRAPH_REPORT.md` — a knowledge graph that makes navigating the codebase faster than reading `src/` directly.

## Purpose

Every project workspace MUST have a `GRAPH_REPORT.md` at its root. This file serves as:
- **Agent context** — read this before making changes (faster than scanning src/)
- **Human navigation** — find any file, state, or dependency in seconds
- **Impact analysis** — know what breaks before touching anything

## When to Generate

| Trigger | Action |
|---------|--------|
| New project reaches first working feature | Create initial GRAPH_REPORT.md |
| PBI/feature completed | Update relevant sections |
| Major refactor | Regenerate affected sections |
| User asks "create/update graph report" | Full generation or targeted update |

## Generation Process

1. **Scan** the project structure (pages, features, services, stores, APIs)
2. **Identify God Nodes** — files/modules that everything depends on
3. **Map dependencies** — data flow, state flow, API flow
4. **Index files** — tables with path, purpose, and connections
5. **Find surprises** — non-obvious connections that would trip up a developer
6. **Summarize features** — status, key files, notes
7. **Write FAQ** — common questions a developer would ask

## Output Location

```
{project-root}/GRAPH_REPORT.md
```

Always at project root. Never nested.

## Template & Reference

Full template with all sections and formatting rules → (Read `references/graph-report-template.md`)

## Quality Criteria

- [ ] God Nodes identified (max 5-7, the true bottlenecks)
- [ ] Dependency diagrams use ASCII art (no mermaid — works everywhere)
- [ ] File Index covers all major directories
- [ ] Surprising Connections section has at least 3 non-obvious links
- [ ] Suggested Questions answer real "where is X?" queries
- [ ] Feature Summary shows status at a glance
- [ ] Auto-generated date in header comment
