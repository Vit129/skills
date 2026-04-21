# Competitive Analysis & Roadmap — 2026-04-20

## Context
Compared unified-memory system against 4 GitHub projects: Hermes Agent, Claude-Mem, Evolver, GenericAgent.

## Key Findings

### Our Strengths (unique, keep)
- Admission control (score ≥0.6 gating) — no competitor has this
- Contradiction detection (temporal triples)
- Zero dependencies (markdown + JSON only)
- 22 documented gotchas — most thorough edge case coverage
- Hierarchical compression (Wing → Room → Closet → AAAK)
- Cross-project auto-promote (≥3 projects)

### Competitor Highlights
| Project | Key Feature | Our Gap |
|---------|------------|---------|
| Hermes Agent | Skills self-improve + periodic nudges + FTS5 search | No skill crystallization, no nudges, no search |
| Claude-Mem | Progressive disclosure + token cost visibility + Web UI | No UI, no token cost tracking |
| Evolver | GEP audit trail + network sharing | No evolution audit trail |
| GenericAgent | Auto-crystallize skills + <30K context | No auto-skill creation |

## Decisions Made

- [2026-04-20] **P1 — Skill crystallization**: Add `wings/{topic}/skills/` folder, auto-suggest after pattern ≥2x, markdown-only
- [2026-04-20] **P1 — Session search index**: Add `palace/search-index.md` flat file, grep-based, no SQLite
- [2026-04-20] **P2 — Periodic nudges**: Add nudge_rules to intelligence.md, check at session start
- [2026-04-20] **P2 — Evolution audit trail**: Add evolution_log field to index.json per template
- [2026-04-20] **Skip — Network sharing**: Too complex for single user, use git if needed
- [2026-04-20] **Skip — FTS5 + LLM summarization**: Breaks zero-dep principle, AAAK closets sufficient

## Open Thread
- [x] Implement P1: Skill crystallization design @2026-04-20
- [x] Implement P1: Session search index design @2026-04-20
- [x] Implement P2: Periodic nudges @2026-04-20
- [x] Implement P2: Evolution audit trail @2026-04-20

## Phase 2 Decisions (2026-04-20)

### Gaps identified from competitor analysis:
1. **User modeling** → `palace/user-profile.md` (≤80 lines, auto-observed patterns) — ✅ Implemented
2. **Auto-crystallize** → DRAFT/ACTIVE/STALE status + auto-write, promote after 1 success, remove after 30d unused — ✅ Implemented
3. **Search scale** → Tiered: grep(0-200) → split-by-year(200-500) → keyword-inverted-index.json(500+) — ⏳ Deferred (needs DS&A discussion)
4. **Skill self-improve** → Auto-refine Steps on positive outcome with deviation, Previous Steps rollback, regression protection — ✅ Implemented

### Naming Decision (2026-04-20)
- Compared Palace metaphor vs File metaphor vs Keep+alias
- Decision: Keep current naming (Wing/Hall/Room/Closet/Tunnel) + add one-line alias in SKILL.md
- Reason: renaming = breaking change across all docs + existing palace data, not worth it
