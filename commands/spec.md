# /spec — Define what to build

Route to `ai-dlc/core/aidlc/` Phase 0→1 (Inception).

## Instructions

1. Read `ai-dlc/core/aidlc/SKILL.md`
2. Scan `agent-memory/plans/[feature]/` for existing Phase 0-1 outputs and `CONTEXT.md` Now section
3. If outputs exist → tell user and ask: redo or skip to `/plan`
4. If no existing outputs → start Phase 0 (Lite Inception or Full Inception based on mode)
5. Create DECISIONS + inception artifacts in `agent-memory/plans/[feature]/`

## Mode Detection

- If user said "QA only" or "QA scenario" → Lite Inception (QA mode)
- If user said "Dev only" → Lite Inception (Dev mode)
- Otherwise → Full Inception (Phase 0→1)

## Prerequisites

None — this is the starting point.

## Done When

- DECISIONS resolved (appended to `agent-memory/MEMORY.md` Decisions section)
- Inception artifacts complete in `agent-memory/plans/[feature]/outputs/`
