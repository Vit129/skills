# Subagent Context Template

Use this template when constructing the prompt for a subagent (Kiro `invokeSubAgent`, Claude Code `Task`, or equivalent).

---

## ⚠️ Context Isolation Warning

**Subagents know NOTHING about your conversation.** They start completely fresh.
- Never say "fix the bug we discussed" — the subagent has no idea what bug you mean
- Always pass: file paths, error messages, project structure, constraints, AC
- If context is unclear → the subagent will fail or produce wrong output

---

## Template

```
You are implementing a single task as part of AIDLC Phase {phase}.

## AIDLC Context
- System: {system_name}
- Feature: {feature_name}
- Mode: {Full | QA Only | QA Automation | Dev Only}
- Phase: {2.4 Test Script Design | 3.1 Implementation}

## Your Task
{paste full task block from dev-task-progress.md or qa-task-progress.md}

## Acceptance Criteria
{paste relevant AC from test scenarios — Phase 2.2 output}

## Files to Read First
{list file paths relevant to this task}

## Skills to Load
{list skill paths — e.g., ai-dlc/qa/playwright-testing/, ai-dlc/rules/playwright-rules/}

## Toolsets (RESTRICTED)
You may ONLY use: {toolsets list — e.g., ["file", "terminal"]}
Do NOT use tools outside this list.

## Constraints
- Write ONLY the files listed in your task scope
- Do NOT modify files outside your task scope
- Run tests after implementation — all must pass
- If committing is part of your workflow, commit when done and include the commit hash

## Review Required
After implementation, self-review against:
1. Spec Compliance: does your output match the AC above?
2. Code Quality: naming, error handling, no dead code, standards compliance

Report: PASS or FAIL with details for each stage.
```

---

## Filling the Template

| Placeholder | Source |
|---|---|
| `{system_name}` | `.aidlc/[system]/` folder name |
| `{feature_name}` | `.aidlc/[system]/[feature]/` folder name |
| `{phase}` | `2.4` for QA scripts, `3.1` for Dev implementation |
| `{task block}` | Copy from `dev-task-progress.md` or `qa-task-progress.md` |
| `{AC}` | From `outputs/construction/test-scenarios.md` or `outputs/inception/user-stories.md` |
| `{file paths}` | Files the task needs to read/write |
| `{skills}` | Based on task type (QA: playwright/robotframework + rules; Dev: frontend/backend) |
| `{toolsets}` | From dispatch-rules.md Toolset Scoping table |

## Phase-Specific Guidance

### Phase 2.4 (QA Test Script Design)
- Skills: `qa/playwright-testing` or `qa/robotframework-testing` + `rules/{platform}-rules`
- AC source: test scenarios from Phase 2.2
- Write scope: test spec files only
- Must load: `implementation-plan.md` for architecture context

### Phase 3.1 (Dev Implementation)
- Skills: `dev/frontend-dev` or `dev/backend-dev`
- AC source: user stories + logical design
- Write scope: source files only
- Must load: `logical-design.md` for API/DB/component specs

## What NOT to Include

- Full file contents (subagent reads them directly)
- Other tasks' details (one task per subagent)
- Brainstorming output
- Conversation history (subagents are context-isolated by design)
- Architecture decisions (subagent reads logical-design.md directly if needed)

## Tool Notes

- If runtime supports parallel → ensure write-scopes are disjoint
- If runtime is sequential-only → dispatch one at a time, same rules apply
- Subagents cannot use: `clarify` (no user interaction), `memory` (no persistence), `send_message` (no messaging)
