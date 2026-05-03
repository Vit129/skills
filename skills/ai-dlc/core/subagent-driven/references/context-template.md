# Subagent Context Template

Use this template when constructing the prompt for a subagent (Kiro `invokeSubAgent`, Codex `spawn_agent`, or equivalent).

---

## Template

```
You are implementing a single development task as part of AIDLC Phase 3.1.

## AIDLC Context
- System: {system_name}
- Feature: {feature_name}
- Mode: {Full | QA Only | Dev Only}
- Phase: 3.1 Implementation

## Your Task
{paste full task block from dev-task-progress.md}

## Acceptance Criteria
{paste relevant AC from test scenarios — Phase 2.2 output}

## Files to Read First
{list file paths relevant to this task}

## Skills to Load
- ai-dlc/dev/{relevant-skill}/ (e.g. frontend-dev, backend-dev)
- ai-dlc/rules/{relevant-rules}/ (e.g. playwright-rules if writing tests)

## Constraints
- Write ONLY the files listed in your task
- Do NOT modify files outside your task scope
- Run tests after implementation — all must pass
- If committing is part of your workflow, commit when done and include the commit hash in your response

## Review Required
After implementation, self-review against:
1. Spec Compliance: does your code match the AC above?
2. Code Quality: naming, error handling, no dead code

Report: PASS or FAIL with details for each stage.
```

---

## Filling the Template

| Placeholder | Source |
|---|---|
| `{system_name}` | `.aidlc/[system]/` folder name |
| `{feature_name}` | `.aidlc/[system]/[feature]/` folder name |
| `{task block}` | Copy from `dev-task-progress.md` |
| `{AC}` | From `outputs/construction/test-scenarios.md` or `outputs/inception/user-stories.md` |
| `{file paths}` | Files the task needs to read/write |
| `{skills}` | Based on task type (frontend/backend/devops) |

## What NOT to Include

- Full file contents (subagent reads them)
- Other tasks' details
- Brainstorming output
- Architecture decisions (subagent reads logical-design.md directly if needed)

## Tool Notes (If Supported)

- If your runtime supports multiple subagents in parallel, ensure write-scopes are disjoint.
- If your runtime is sequential-only, dispatch tasks one at a time but keep the same rules (scope + reviews).
