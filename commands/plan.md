# /plan — Break spec into tasks

Route to `~/.claude/skills/aidlc/` Phase 2 (Task Design).

## Instructions

1. Read `~/.claude/skills/aidlc/SKILL.md`
2. Scan `agent-memory/plans/[feature]/outputs/` + `agent-memory/MEMORY.md` for resolved decisions
3. If Phase 1 missing → STOP, tell user: "Run `/spec` first — Phase 1 (Inception) is required before planning."
4. If Phase 1 exists → proceed to Phase 2
5. Load appropriate task design reference:
   - QA mode → `references/qa-task-design.md`
   - Dev mode → `references/dev-task-design.md`
   - Full mode → both

## Prerequisites

- Phase 0-1 outputs must exist in `agent-memory/plans/[feature]/`
- DECISIONS must be resolved

## Done When

- Task breakdown complete (`agent-memory/plans/[feature]/dev-tasks.md` or `qa-tasks.md`)
- Each task has acceptance criteria
- Dependencies identified
