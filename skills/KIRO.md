# Kiro Workspace

## Agent Tier (pick before every task)

| Task | Agent |
|------|-------|
| Most tasks — logic, impl, bug fix, tests | Sonnet (default) |
| Complex multi-file / async / critical path | Opus (escalate only) |

> Escalation rule: if Sonnet fails twice on the same problem → escalate to Opus, don't retry.
> Task is NOT done without: code written + tests pass + commit hash.

> See `AGENTS.md` in the same skills root folder as this file for shared Skill Map and Karpathy Principles.

## Rules (KIRO-specific)

- **Cache:** Do NOT edit KIRO.md / steering mid-session (breaks prompt cache)
- **Branch:** Always `git checkout -b feat/...` before starting work

## Citation format (when answering from knowledge base)

```
[from: LESSON-AUTH-001]        ← lesson
[from: skill:playwright-rules] ← skill
[from: memory:{wing}/{room}]   ← memory palace
```
