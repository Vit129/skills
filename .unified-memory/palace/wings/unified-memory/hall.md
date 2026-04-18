# 🏛️ Hall — unified-memory

> Unified Memory wing managing global persistent memory and intelligence.
> Combines Memory Palace (Storage) and Knowledge Evolution (Intelligence).

## Facts
- Two-tier architecture: Global (`~/.memory/global/`) + Project-specific (`.unified-memory/`)
- Unified Memory core skill is at `system/unified-memory/SKILL.md`
- Uses AAAK compression for high-density token efficiency
- Admission control: Score ≥ 0.6 gating for knowledge updates

## Decisions
- [2026-04-18] Audited and consolidated `memory-palace` and `knowledge-evolution` wings into a single `unified-memory` wing to align with `AGENT.md`.

## Rooms Index

| Room | Description |
|------|-------------|
| `skill-structure` | Standard SKILL.md structure and hierarchy |
| `template-health` | Track utility scores and usage for global templates |
| `lesson-effectiveness` | Monitor applied lessons and failure prevention count |
| `knowledge-state` | (AAAK) Compressed summary of current global knowledge health |

## Connections (Tunnels)
- → ai-dlc-skills/hall.md: Shared engineering standards and workflow rules
- → knowledge-ingest/hall.md: Ingest pipeline for new knowledge extraction
