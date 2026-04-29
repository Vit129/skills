# 🏛️ Hall — agent-memory

> Agent Memory wing managing global persistent memory and intelligence.
> Skill: `~/.claude/skills/system/agent-memory/SKILL.md`
> Data: `~/.claude/agent-memory/`

## Facts
- Two-tier: skill (instructions) at `skills/system/agent-memory/` + data at `agent-memory/`
- Uses AAAK compression for high-density token efficiency
- Admission control: Score ≥ 0.6 gating for knowledge updates
- Hooks v4.0: full 5-step save workflow with verification (2026-04-20)

## Decisions
- [2026-04-18] Consolidated `memory-palace` + `knowledge-evolution` wings → single `agent-memory` wing
- [2026-04-20] Rewrote hooks to v4.0: full save workflow + verification, fixed paths `.memory/` → `agent-memory/palace/`
- [2026-04-20] Added GOTCHAS #18-22 (wing split, burst mode, cross-project, domain settling, hook drift)
- [2026-04-20] Competitive analysis: 4 GitHub agents compared → P1 (skill crystallization, search index), P2 (nudges, audit trail), Skip (network, FTS5)
- [2026-04-20] Implemented P1+P2: skill crystallization, search index, periodic nudges, evolution audit trail → 7 skill files updated, GOTCHAS #23-27 added
- [2026-04-20] Phase 2: user modeling (user-profile.md), auto-crystallize (DRAFT/ACTIVE/STALE), skill self-improve (auto-refine + rollback). Naming: keep Palace metaphor + alias.
- [2026-04-21] Architecture decision: `.agents/` (rules+routing) vs `agent-memory/` (memory+learning) → keep separate. `agent-context-kit` not adopted (already covered).

- [2026-04-26] Bugfix spec created in Kiro for agent-memory-redesign. Decision: palace/ + knowledge/ stay separate dirs with enforced sync (not merged). All-markdown, zero JSON for storage. Requirements approved: 11 defects, 11 expected behaviors, 8 unchanged behaviors. Phased: P1 core, P2 search+profile, P3 skills+consolidation.
- [2026-04-26] Implemented Markdown-first Phase 1 contract: `SKILL.md` and active references now define `knowledge/index.md`, `knowledge/evolution.md`, and domain lesson `index.md` as source of truth; legacy JSON files are read-only import material.
- [2026-04-26] Updated Kiro hooks: session-load v3 reads Markdown knowledge; session-save v6 enforces a mandatory Knowledge Sync Gate, updates `knowledge/evolution.md` every dirty save, and forbids state-only fallback.
- [2026-04-29] Hook v6.5.0: consolidation nudge suppress-repeat — first-time-only in conversation, then 'already flagged'. Synced 3 locations (.claude, My Investment Port, template).

## Rooms Index

| Room | Description |
|------|-------------|
| `skill-structure` | Architecture, reference files, key rules |
| `hook-versions` | Hook version history v1→v4.0, gap analysis |
| `template-health` | Track utility scores and usage for global templates |
| `lesson-effectiveness` | Monitor applied lessons and failure prevention count |
| `gap-tracker` | Missing templates/lessons/business rules |
| `routing-log` | Session routing decisions and stats |
| `knowledge-state` | (AAAK closet) Compressed summary of current knowledge health |
| `competitive-analysis-roadmap` | Hermes/Claude-Mem/Evolver/GenericAgent comparison + P1/P2 roadmap decisions |
| `wiki-graph-pattern` | Wiki-Graph vs RAG, ingest flow, applied to this system (merged from knowledge-ingest wing) |
| `search-scaling-research` | DS&A research: inverted index, BM25, tiered search strategy, Big O analysis |
| `agents-vs-agent-memory-architecture` | .agents/ vs agent-memory/ vs agent-context-kit: keep separate decision |

## Connections (Tunnels)
- → ai-dlc-skills/hall.md: Shared engineering standards and workflow rules
