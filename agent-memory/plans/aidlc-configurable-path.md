# Plan: AIDLC Configurable Artifact Path

**Status:** Planning
**Location:** `~/.claude/` (global skills)

## Problem

AIDLC skills hardcode `.aidlc/` as artifact directory. Some projects (e.g. harness-terminal) prefer `agent-memory/plans/`. Currently no way to configure per-project.

## Proposal: Per-project config file

Add a config file that AIDLC skill reads first to determine artifact path.

### Resolution order:

1. `<project>/.claude/aidlc.json` → `{"artifactPath": "agent-memory/plans"}`
2. `<project>/.aidlc/` exists → use `.aidlc/` (backward compat)
3. Neither → create `.aidlc/` (current default)

### Config format (`aidlc.json`):

```json
{
  "artifactPath": "agent-memory/plans",
  "progressFile": "agent-memory/plans/INDEX.md",
  "completedArchive": "agent-memory/plans/completed-archive.md"
}
```

## Files to change (~20)

| Category | Files | Change |
|----------|-------|--------|
| Core skill | `skills/aidlc/SKILL.md`, `references/workflow.md`, `references/knowledge-buffer.md` | Read config, resolve path |
| Commands | `commands/spec.md`, `commands/plan.md`, `commands/resume.md`, `commands/build.md` | Use resolved path variable |
| Gate checks | All skills with "AIDLC Gate" section (~12 files) | `.aidlc/` → resolved path |
| Kiro hooks | `phase-gate-enforcer.json` (if exists) | Check both locations |

## Implementation

### Step 1: Add path resolver snippet
Add to `skills/aidlc/references/workflow.md`:
```
## Path Resolution
Before any AIDLC operation, resolve artifact path:
1. Check <project>/.claude/aidlc.json → use artifactPath
2. Check <project>/.aidlc/ exists → use .aidlc/
3. Default → .aidlc/
```

### Step 2: Update commands
Replace hardcoded `.aidlc/[system]/[feature]/` with `{AIDLC_PATH}/[system]/[feature]/`

### Step 3: Update gate checks
Replace "`.aidlc/` folder exists" with "AIDLC artifact path exists"

### Step 4: Update knowledge-buffer
Clarify that artifact path is configurable, not always `.aidlc/`

## Migration for existing projects

- harness-terminal: already using `agent-memory/plans/` → add `.claude/aidlc.json`
- Other projects: no change needed (default stays `.aidlc/`)

## Risk

- Low — backward compatible, only kicks in if `aidlc.json` exists
- Commands that scan `.aidlc/` need to check config first (one extra read)

## Effort

~2 hours (mostly find-replace + testing `/spec` and `/resume` commands)
