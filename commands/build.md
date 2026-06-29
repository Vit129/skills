# /build — Implement incrementally

Route to `~/.claude/skills/aidlc/` Phase 3 (Execute).

## Instructions

1. Read `~/.claude/skills/aidlc/SKILL.md`
2. Scan `agent-memory/plans/[feature]/dev-tasks.md` or `qa-tasks.md` for task breakdown
3. If Phase 2 missing → STOP, tell user: "Run `/plan` first — task breakdown is required before building."
4. If Phase 2 exists → find first incomplete task in progress file
5. Implement one task at a time:
   - Load relevant rules (`playwright-rules/`, `robotframework-rules/`, etc.)
   - Check `agent-memory/knowledge/` for existing patterns
   - Write code → run tests → commit
6. Update task progress after each task

## Prerequisites

- Phase 2 task breakdown must exist in `agent-memory/plans/[feature]/`
- Rules loaded before generating code

## Done When

- All tasks marked complete
- Tests pass for each task
- Commit hash recorded per task
