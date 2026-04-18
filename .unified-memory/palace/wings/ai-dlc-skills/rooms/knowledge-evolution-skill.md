# Room — knowledge-evolution Skill

Created: 2026-04-11

## What Was Built

New system skill: `.claude/skills/system/knowledge-evolution/`

```
knowledge-evolution/
├── SKILL.md                       ← concept skill (domain-agnostic, adaptable)
└── references/
    ├── utility-scoring.md         ← Layer 1: schema + score protocol + auto-capture
    ├── smart-routing.md           ← Layer 2: intent patterns + weighted routing
    ├── memory-integration.md      ← Layer 3: palace wing + session sync + write-back
    └── implementation-guide.md   ← Phase A→D roadmap + complete file change list
```

## Purpose

Generic concept skill — describes HOW to make any knowledge base self-evolving.
Not tied to ai-dlc paths or json format. Adapt by filling in {placeholders}.
Pattern: same as `analysis-concept` and `memory-palace` system skills.

## SKILL.md Design Decision

- (knowledge-evolution SKILL.md, type, concept skill NOT operational) [2026-04-12 - ∞]
  → Rewritten from operational (ai-dlc specific) → generic (any system)
  → Follows analysis-concept pattern: describe HOW, not WHAT
  → {placeholders} instead of hardcoded paths
  → Adaptation Steps guide users to map concepts to their system

## Three Layers

| Layer | What | Key Concept |
|-------|------|-------------|
| 1 — Utility Scoring | Add score/usage/failure fields to index files | Templates that work get higher scores |
| 2 — Smart Routing | Intent patterns + score-weighted selection | Match by flow (Input→Process→Output), not just keyword |
| 3 — Memory Integration | knowledge-evolution wing in Memory Palace | Track cross-session, sync back to index files |

## Key Design Decisions

- (knowledge-evolution, placement, system/) [2026-04-11 - ∞]
  → Domain-agnostic, not inside ai-dlc/ — usable by any project
- (index files, role, source of truth) [2026-04-11 - ∞]
  → Memory Palace = tracking layer only, index files = authoritative
- (vector/BM25, decision, deferred) [2026-04-11 - ∞]
  → intent_patterns cover routing gap without search library
  → Revisit when knowledge/ has >50 templates or >100 lessons
- (auto-captured lessons, admission, confidence ≥ 0.6) [2026-04-11 - ∞]
  → Human-curated always takes priority over auto-captured

## Score Thresholds

| Score | Status |
|-------|--------|
| ≥ 7.0 | Proven — prefer first |
| 3.0–6.9 | Active — normal use |
| < 3.0 | Flagged — warn before use |
| 0.0 | Deprecated — skip |

## Implementation Phases

- Phase A: Add fields to index files (safe, no behavior change)
- Phase B: Update workflow files to use scores
- Phase C: Connect Memory Palace
- Phase D: Automation hooks for feedback loop

## Source Concepts

EvoSkill (utility scoring + failure analysis), Trace2Skill (conflict-free consolidation),
ACE (living skillbook + structured incremental updates), ASG-SI (verifier-backed promotion),
Memento-Skills (closed loop + skill routing), OpenSpace (workflow reuse)

## Open Thread

- [ ] Implement Phase A-B in actual ai-dlc knowledge index files
  (was already in state.md open threads — this skill is the design artifact for that work)
