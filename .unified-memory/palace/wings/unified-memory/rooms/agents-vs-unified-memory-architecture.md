# .agents/ vs .unified-memory/ vs agent-context-kit — Architecture Decision — 2026-04-21

## Context
User asked whether to merge `.agents/`, `.unified-memory/`, and GitHub `ThanakritAof/agent-context-kit` or keep them separate.

## Systems Compared

| Aspect | `.unified-memory/` | `.agents/AGENTS.md` | `agent-context-kit` |
|--------|---------------------|---------------------|---------------------|
| Purpose | Persistent memory + self-learning | Agent rules + skill routing | Lightweight repo context scaffold |
| Data | Session history, decisions, user profile, scored templates, lessons, search index | Static rules, skill map, Karpathy principles | Active task state, repo tree, session checkpoints, topic notes |
| Scope | Cross-project, cross-session | Per-workspace | Per-repo |
| Intelligence | Scoring, auto-crystallize, nudges, AAAK, dirty tracking | None — static rules | None — static files |
| Dependencies | Markdown + JSON only | Markdown only | bash + python3 |

## Decision

- [2026-04-21] **Keep `.agents/` and `.unified-memory/` separate** — different lifecycle, different purpose
  - `.agents/AGENTS.md` = entry point + routing (changes rarely, when skills added/removed)
  - `.unified-memory/` = data layer (changes every session)
- [2026-04-21] ~~Do NOT adopt agent-context-kit~~ → **REVISED**: closer than initially thought, 4 concepts worth adopting

## Key Insight
Three distinct layers that should stay separate:
1. **Rules layer** (`.agents/`) — WHAT to do, HOW to route
2. **Memory layer** (`.unified-memory/`) — WHAT happened, WHAT works
3. **Repo context** (not needed — IDE tools handle this natively)

## Deeper Analysis — agent-context-kit actual content (2026-04-21)

Initial comparison was too shallow. After reading the actual generated files (agents.sh heredocs), found 4 concepts we're missing:

| Concept | What it does | Our gap |
|---------|-------------|---------|
| **Trust Priority** (1-7 ranking) | user instruction > codebase > AGENTS.md > active > topics > sessions > tree | No explicit conflict resolution order |
| **"Do not store" list** | Explicit: no secrets, raw transcripts, CoT, speculative, duplicates | Not documented |
| **Minimum Update Contract** | Rules in AGENTS.md: "after meaningful work, update X" — replaces hooks | We rely on hooks/manual triggers |
| **active.md pattern** | focus/blockers/next action as explicit fields | state.md has wings/threads but no focus/blockers |

### agent-context-kit also uses "contract in AGENTS.md" instead of hooks
Their approach: write rules that agent must follow → no IDE dependency. Our approach: hooks trigger save workflow. Both valid, theirs is more portable.

### Status
- ✅ Implemented 2026-04-21: Trust Priority + Do-not-store + Minimum Update Contract → AGENTS.md, Current Focus section → state.md

## Follow-up: AGENTS.md Split Proposal — 2026-04-21

### Problem
AGENTS.md contains both routing (skill map) and portable rules (Karpathy, test/build rules). Rules part could be shared across projects but is stuck in per-workspace `.agents/`.

### Chicken-and-Egg Issue
Agent needs AGENTS.md to know which skills exist → can't put AGENTS.md itself inside a skill without a bootstrap pointer.

### Proposed Split (pending user decision)
| Part | Location | Reason |
|------|----------|--------|
| AGENTS.md (slim) | `.agents/AGENTS.md` — stay | Entry point, reading order, skill map (~20 lines) |
| Karpathy + Rules + Citation | `~/.claude/skills/system/agent-rules/SKILL.md` — new | Portable, always-load, cross-project |

### Status
- ⏳ Awaiting user decision
