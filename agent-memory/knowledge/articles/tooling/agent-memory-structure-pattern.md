---
id: agent-memory-structure-pattern
type: pattern
scope: global
status: draft
score: 5.0
created: 2026-04-27
updated: 2026-04-27
keywords: agent-memory, knowledge-structure, articles-subfolder, graph-md, room-frontmatter, palace-graph, tunnels-prose
---

# Agent Memory Structure Pattern

## Use When
- Bootstrapping a new project's agent-memory/
- Reviewing whether an existing agent-memory/ follows proven structure
- Updating the agent-memory skill spec

## Pattern

Knowledge articles belong in `knowledge/articles/{domain}/` — not flat in `knowledge/`. This mirrors the `lessons/{domain}/` structure and prevents scatter as articles grow.

Palace graph (`palace/graph.md`) provides a structured Nodes/Rooms/Edges index when the palace has 3+ wings — faster to scan than reading all halls.

Rooms benefit from optional YAML frontmatter with `links` field for wiki-style cross-referencing.

Tunnels use prose format with explicit `Purpose` and `Sync` fields — more readable than a plain table.

Wing halls can include optional sections (Vision, Deliverables, Shipped Metrics, Tunnel Links) for project wings with milestones.

## Evidence
- 2026-04-27: Derived from My Investment Port (real usage, 9 wings, 22 lessons, 4 articles) vs SKILL.md spec comparison
- 2026-04-27: Validated by CoT+LATS analysis across 4 projects (My Investment Port, .claude, VitProjects, Home Assistant)
- 2026-04-27: Applied to SKILL.md + storage.md (9-point update)

## Maintenance
- status: draft
- next_review: 2026-06-27
