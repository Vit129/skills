# /spec — Define what to build

Route to `ai-dlc/core/aidlc/` Phase 0→1 (Inception).

## Instructions

1. Read `ai-dlc/core/aidlc/SKILL.md`
2. Scan `.aidlc/[system]/[feature]/` — if Phase 0-1 outputs already exist, tell user and ask if they want to redo or skip to `/plan`
3. If no existing outputs → start Phase 0 (Lite Inception or Full Inception based on mode)
4. Create DECISIONS file + inception artifacts
5. Output goes to `.aidlc/[system]/[feature]/`

## Mode Detection

- If user said "QA only" or "QA scenario" → Lite Inception (QA mode)
- If user said "Dev only" → Lite Inception (Dev mode)
- Otherwise → Full Inception (Phase 0→1)

## Prerequisites

None — this is the starting point.

## Done When

- DECISIONS file exists in `.aidlc/[system]/[feature]/`
- Inception artifacts complete (requirements, scope, constraints)
