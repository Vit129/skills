# /resume — Pick up where you left off

Find last completed stage → continue from next stage.

## Instructions

1. Read `PROGRESS.md` (project root) — find the 🔄 In Progress feature + stage
2. If multiple features found → ask user which one to resume
3. For the selected feature, check outputs in `agent-memory/plans/[feature]/`
4. Find the FIRST incomplete stage → start there
5. If build is in progress → find first incomplete task → continue from there
6. Tell user: "Resuming [feature] from [stage] — [description of what's next]"

## Decision Tree

```
PROGRESS.md has an active (🔄) feature?
├── NO → "No feature work in progress. Use /spec to start."
└── YES → read feature name → check agent-memory/plans/[feature]/
    ├── No requirements doc → "Requirements incomplete. Continuing /spec..."
    ├── No dev-task-progress.md or qa-task-progress.md → "Task design needed. Continuing /plan..."
    ├── Tasks incomplete → "Tasks in progress. Continuing /build..."
    └── All complete → "Feature complete! Ready for /review or /ship."
```

## Prerequisites

None — this command discovers state automatically.

## Done When

- User is oriented on where they are
- Next phase is executing
