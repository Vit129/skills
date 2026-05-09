# /build — Implement incrementally

Route to `ai-dlc/core/aidlc/` Phase 3 (Execute).

## Instructions

1. Read `ai-dlc/core/aidlc/SKILL.md`
2. Scan `.aidlc/[system]/[feature]/` for Phase 2 outputs (task breakdown)
3. If Phase 2 missing → STOP, tell user: "Run `/plan` first — task breakdown is required before building."
4. If Phase 2 exists → find first incomplete task in progress file
5. Implement one task at a time:
   - Load relevant rules (`playwright-rules/`, `robotframework-rules/`, etc.)
   - Check `knowledge/` for existing patterns
   - Write code → run tests → commit
6. Update task progress after each task
7. If 3+ independent tasks → consider `core/subagent-driven/` for parallel execution

## Prerequisites

- Phase 2 task breakdown must exist
- Rules loaded before generating code

## Done When

- All tasks marked complete in progress file
- Tests pass for each task
- Commit hash recorded per task
