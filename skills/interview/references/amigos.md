# 3 Amigos — Multi-Role Review

Collaborative review through PO, Dev, QA perspectives — runs after requirements are captured, before `/plan`, for complex features.

## Input
`agent-memory/plans/[feature]/GLOSSARY.md` (from `/spec`)
Pre-step: run `analysis-skills` (gap.md) on GLOSSARY.md → feed gaps to all 3 roles.

## Scale (auto-detect)
| Size | Signals | Mode |
|---|---|---|
| Small | 1-2 stories, 1 endpoint | Quick: 1 round, 1 question/role — skip if trivial |
| Medium | 3-5 stories, multi-page | Normal: 2 rounds |
| Large | 6+ stories, multi-context | Full: 3 rounds |

## PO Perspective
Focus: user value, scope clarity, success metrics
Key questions: Who benefits? What's the smallest MVP? How do we measure success? What's out of scope?
```
Output: Problem Statement | Target User | MVP Scope | Out of Scope | Success Metric | Open Questions
```

## Dev Perspective
Focus: technical feasibility, architecture risk, complexity
Key questions: What changes in the data model? What existing code is affected? Where's the complexity? Simpler alternative?
```
Output: Feasibility | Architecture Impact | Complexity Estimate | Risk Areas | Open Questions
```

## QA Perspective
Focus: testability, edge cases, AC completeness
Key questions: Is it testable in isolation? What breaks if X fails? Are AC complete? Regression risk?
```
Output: Testability | Key Scenarios (happy/alt/edge) | Risk Areas | AC Draft | Open Questions
```

## Output
`agent-memory/plans/[feature]/outputs/brainstorming-summary.md`
Synthesize tensions across 3 roles → refine GLOSSARY.md → proceed to `/plan`.
