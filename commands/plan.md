# /plan — Break spec into tasks

Route to `ai-dlc/core/aidlc/` Phase 2 (Task Design).

## Instructions

1. Read `ai-dlc/core/aidlc/SKILL.md`
2. Scan `.aidlc/[system]/[feature]/` for Phase 1 outputs
3. If Phase 1 missing → STOP, tell user: "Run `/spec` first — Phase 1 (Inception) is required before planning."
4. If Phase 1 exists → proceed to Phase 2
5. Load appropriate task design reference:
   - QA mode → `references/qa-task-design.md`
   - Dev mode → `references/dev-task-design.md`
   - Full mode → both

## Prerequisites

- Phase 0-1 outputs must exist in `.aidlc/[system]/[feature]/`
- DECISIONS file must exist

## Done When

- Task breakdown complete (qa-task-progress.md or dev-task-progress.md)
- Each task has acceptance criteria
- Dependencies identified
