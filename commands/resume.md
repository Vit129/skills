# /resume — Pick up where you left off

Scan `.aidlc/` → find last completed phase → continue from next phase.

## Instructions

1. Scan `.aidlc/` directory for all systems/features
2. If multiple features found → ask user which one to resume
3. For the selected feature, check phase outputs:
   - Phase 0-1: DECISIONS file + inception artifacts
   - Phase 2: task breakdown (qa-task-progress.md / dev-task-progress.md)
   - Phase 3: task completion status in progress file
4. Find the FIRST incomplete phase → start there
5. If Phase 3 is in progress → find first incomplete task → continue from there
6. Load `agent-memory/memory.md` for session context if available
7. Tell user: "Resuming [feature] from Phase [X] — [description of what's next]"

## Decision Tree

```
.aidlc/ exists?
├── NO → "No AIDLC work in progress. Use /spec to start a new feature."
└── YES → scan features
    ├── Multiple features → ask which one
    └── Single feature → check phases
        ├── No Phase 1 → "Inception incomplete. Continuing /spec..."
        ├── No Phase 2 → "Task design needed. Continuing /plan..."
        ├── Phase 3 incomplete → "Tasks in progress. Continuing /build..."
        └── All complete → "Feature complete! Ready for /review or /ship."
```

## Prerequisites

None — this command discovers state automatically.

## Done When

- User is oriented on where they are
- Next phase is executing
