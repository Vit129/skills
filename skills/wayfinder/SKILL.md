---
name: wayfinder
description: >
  Plan work too big for one session as a shared decision map — investigation
  tickets with blocking edges, resolved one at a time until the destination is
  clear. Trigger on "wayfinder", "chart the way", "too big for one session",
  "this needs a map", "plan this properly" — use when scope spans multiple
  sessions or agents and can't be interviewed/designed in one sitting.
credit: Based on mattpocock/skills (https://github.com/mattpocock/skills) — engineering/wayfinder
version: 1.0.0
last_improved: 2026-07-10
improvement_count: 0
---

# Wayfinder

Chart huge, fog-wrapped work as a map of tickets before executing. Produces
decisions, not deliverables — execution happens after the map is clear, via
the normal `interview → dev-architect → task-design` chain, per ticket.

## When to use

- Scope too big to interview/design in one session (this is what `interview`'s
  Step 0 scope check should flag before handing off)
- Destination is fixed (a spec, a migration, a locked decision) but the route
  there has real unknowns
- Work may span multiple sessions or get picked up later, possibly by someone
  else

Skip for anything that fits in one `interview → dev-architect → task-design`
pass — that's most tasks. Don't chart what you can just do.

## Tracker

Tracker-agnostic, resolved per `rules/routing.md`'s Tracker Sync section:

- Personal repos → GitHub Issues (`gh issue create` / `gh issue edit`)
- `.kiro/**`, `Company/**` → Azure DevOps work items (`az boards work-item
  create`), per Core Rules' VCS Remote by Path
- No tracker / solo local work → `agent-memory/plans/[FEATURE]/wayfinder-map.md`,
  checkbox-tracked the same way as `dev-task-progress.md`

## Charting (one session — plan only, don't resolve tickets yet)

1. **Name the destination** — run `interview`'s `doubt.md` or `amigos.md`
   mode (whichever fits) to pin down what "done" means. One session.
2. **Map the frontier breadth-first** — list everything blocking the
   destination, at whatever grain is currently visible. Don't force
   premature sharpness.
3. **Create the map** — issue/doc labeled `wayfinder:map`:
   ```markdown
   ## Destination
   [what "done" means]
   ## Notes
   [constraints, non-goals]
   ## Decisions so far
   (empty at start)
   ## Not yet specified (fog)
   [suspected work too vague to ticket yet]
   ## Out of scope
   (empty at start)
   ```
4. **Create child tickets** for anything already specifiable — one per
   decision needed, not per deliverable. Wire blocking edges between them.
5. **Stop.** Charting is one session. Resolving tickets is separate work,
   done later.

## Ticket types

Tag each ticket so it's clear who resolves it and how:

| Type | Meaning | Resolve via |
|------|---------|-------------|
| `research` (AFK) | doc/API/codebase reading, produces a written summary | `interview`'s `source.md` mode, or `analysis-skills` |
| `grilling` (HITL) | a decision needs the user's judgment | `interview`'s `doubt.md` / `amigos.md` mode |
| `prototype` (HITL) | need a throwaway artifact to sharpen the discussion | ad hoc — build it, discuss, discard |
| `task` (HITL/AFK) | prerequisite work (provisioning, data move) blocking a decision | direct implementation |

## Working through (repeat across sessions)

1. Load the map — high-level view only, not every ticket
2. **Claim** an unresolved ticket. Frontier = open + unblocked + unclaimed.
   Assign it to yourself first.
3. Resolve it via the matching skill above; post the answer as a resolution
   comment/note on the ticket
4. **Close** the ticket, append a one-line gist to Decisions-so-far on the map
5. If new fog surfaced, add it to "Not yet specified" — graduate it into a
   real ticket only once the question is sharp enough to answer in one
   sitting
6. When every ticket is closed and fog is empty, the map is done. Hand off to
   `dev-architect` / `task-design` for the actual build, per ticket.

## Rules

- **Refer by ticket title, never bare number** — "#42, #43" is illegible
  later.
- **Fog vs ticket** — only make a ticket once the question is sharp. Vague,
  suspected-but-unclear work stays in fog until it isn't.
- **Out-of-scope work gets closed immediately** with a one-line entry in
  Out-of-scope — it never graduates into a ticket.
- **Produce decisions, not deliverables** — a resolved ticket is an answer,
  not code. Code happens after the map is clear, in the normal dev chain,
  per ticket.
