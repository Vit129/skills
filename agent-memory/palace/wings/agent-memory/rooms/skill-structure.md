# Room: Agent Memory Skill Structure

## Architecture (post-restructure 2026-04-18)
```
~/.claude/skills/system/agent-memory/   ← skill (instructions)
~/.claude/agent-memory/                ← data (state)
  ├── palace/state.md, tunnels.md, wings/, archive/
  └── knowledge/index.json, lessons/
```

## Reference Files
| File | When to Load |
|------|-------------|
| references/session.md | Session start/end, admission control, sync, schemas |
| references/storage.md | Wings, rooms, halls, closets, archive, AAAK |
| references/intelligence.md | Scoring, routing, auto-capture, semantic search |
| references/maintenance.md | Consolidation, dedup, stale, conflict, score normalization |
| references/adaptation.md | Domain setup, PASS/FAIL signals, intent patterns |

## Key Rules
- state.md ≤100 lines | hall.md ≤50 lines | archive/index.md ≤200 lines
- Room >80 lines → create closet
- Tags: 3–7 per file
- Hooks must reference session.md for save workflow (GOTCHA #22)

## Changes
- @2026-04-18: Consolidated memory-palace + knowledge-evolution → agent-memory wing
- @2026-04-20: Hook v4.0 — full save workflow + verification, paths fixed to agent-memory/palace/
- @2026-04-20: GOTCHAS #18-22 added (wing split orphans, burst mode, cross-project dupe, domain settling, hook drift)
