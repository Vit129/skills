# /resume — Pick up where you left off

Find last completed phase → continue from next phase.

## Instructions

1. Read `agent-memory/CONTEXT.md` Now section — find active feature + phase
2. If multiple features found → ask user which one to resume
3. For the selected feature, check phase outputs in `agent-memory/plans/[feature]/`
4. Find the FIRST incomplete phase → start there
5. If Phase 3 is in progress → find first incomplete task → continue from there
6. Tell user: "Resuming [feature] from Phase [X] — [description of what's next]"

## Decision Tree

```
CONTEXT.md Now section has active feature?
├── NO → "No AIDLC work in progress. Use /spec to start."
└── YES → read feature name → check agent-memory/plans/[feature]/
    ├── No plan.md → "Inception incomplete. Continuing /spec..."
    ├── No dev-tasks.md or qa-tasks.md → "Task design needed. Continuing /plan..."
    ├── Tasks incomplete → "Tasks in progress. Continuing /build..."
    └── All complete → "Feature complete! Ready for /review or /ship."
```

## Prerequisites

None — this command discovers state automatically.

## Done When

- User is oriented on where they are
- Next phase is executing
