# Plan: AIDLC Configurable Artifact Path

**Status:** Implementing
**Location:** `~/.claude/` (global skills)

## Problem

AIDLC skills hardcode `.aidlc/` as artifact directory. Some projects (e.g. harness-terminal) prefer `agent-memory/plans/`. Currently no way to configure per-project.

## Decision

Use `agent-memory` integration mode (Option B) — no `.aidlc/` folder created. Artifacts map directly into agent-memory structure via `aidlc.json` config.

## Config (`~/.claude/.claude/aidlc.json`)

```json
{
  "artifactMode": "agent-memory",
  "plansPath": "agent-memory/plans",
  "contextFile": "agent-memory/CONTEXT.md",
  "memoryFile": "agent-memory/MEMORY.md",
  "knowledgePath": "agent-memory/knowledge"
}
```

## Artifact Mapping

| AIDLC artifact | agent-memory path |
|---|---|
| planning/decisions/ | append to MEMORY.md Decisions section |
| planning/plans/ | `plans/[feature]/plan.md` |
| PROGRESS.md | CONTEXT.md Now section |
| audit.md | CONTEXT.md Completed section |
| dev-task-progress.md | `plans/[feature]/dev-tasks.md` |
| qa-task-progress.md | `plans/[feature]/qa-tasks.md` |
| outputs/ | `plans/[feature]/outputs/` |
| knowledge buffer | `knowledge/` (unchanged) |

## Files Changed

- `skills/aidlc/references/workflow.md` — Artifact Mode section (top)
- `skills/aidlc/references/knowledge-buffer.md` — Storage Boundary Rules
- `skills/aidlc/SKILL.md` — Gate check
- `commands/spec.md`, `plan.md`, `resume.md`, `build.md` — aidlc.json check + dual paths
- `.claude/aidlc.json` — created (global config)
- `agent-memory/plans/` — migrated flat files → subfolders
