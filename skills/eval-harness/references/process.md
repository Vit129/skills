# Eval Process

## Step 1: Define the Task

```markdown
**Task:** [Exact prompt to give the agent]
**Skill:** [Skill path being evaluated]
**Expected:** [What success looks like]
**Grader:** [manual | automated | hybrid]
```

## Step 2: Run k Attempts

- k=3 for routine evals
- k=5 for critical skills (security, architecture)
- Record each output

## Step 3: Grade

| Grader Type | When to Use |
|-------------|-------------|
| **Automated** | Output has clear pass/fail (tests pass, build succeeds) |
| **Manual** | Output quality is subjective (code style, architecture) |
| **Hybrid** | Automated checks + manual review of edge cases |

## Step 4: Score and Decide

| Score | Action |
|-------|--------|
| pass@3 = 100% | Skill is healthy ✅ |
| pass@3 = 67% | Skill needs minor tuning |
| pass@3 = 33% | Skill needs rework — flag in memory.md |
| pass@3 = 0% | Skill is broken — escalate |

## AIDLC Integration

- **Phase 2 (Task Design):** Eval existing skills before assigning tasks
- **Phase 3 (Implementation):** Run checkpoint eval after each task
- **Post-Phase 3:** Run consistency eval on the full feature
