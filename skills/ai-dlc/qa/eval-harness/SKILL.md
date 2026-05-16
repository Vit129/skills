# Eval Harness

> Measure skill quality and agent consistency through structured evaluation runs.
> Inspired by ECC's eval-harness skill — adapted for AIDLC.

---

## When to Use

- After creating or updating a skill — verify it produces consistent output
- When a skill is flagged in `agent-memory/memory.md` — measure improvement
- Periodic skill health checks (monthly)
- Before promoting a playbook entry to knowledge

---

## Eval Types

### 1. Consistency Eval (pass@k)

Run the same task k times, check if at least ONE succeeds:

```
pass@k: probability that at least 1 of k attempts succeeds
  k=1: baseline (single shot)
  k=3: 91% if individual pass rate is 70%
  k=5: 97% if individual pass rate is 70%
```

**Use when:** You just need it to work (e.g., code generation, test writing).

### 2. Reliability Eval (pass^k)

Run the same task k times, check if ALL succeed:

```
pass^k: probability that ALL k attempts succeed
  k=1: 70% (same as individual)
  k=3: 34% if individual pass rate is 70%
  k=5: 17% if individual pass rate is 70%
```

**Use when:** Consistency is essential (e.g., security checks, data validation).

### 3. Checkpoint Eval

Set explicit checkpoints within a task, verify each:

```markdown
## Checkpoint Eval: [Skill Name]

| Checkpoint | Criteria | Pass? |
|-----------|----------|-------|
| Structure | Output follows SKILL.md format | ✅ |
| Completeness | All required sections present | ✅ |
| Accuracy | No factual errors | ❌ |
| Style | Matches project conventions | ✅ |

Score: 3/4 (75%)
```

---

## Eval Process

### Step 1: Define the Task
```markdown
**Task:** [Exact prompt to give the agent]
**Skill:** [Skill path being evaluated]
**Expected:** [What success looks like]
**Grader:** [manual | automated | hybrid]
```

### Step 2: Run k Attempts
- k=3 for routine evals
- k=5 for critical skills (security, architecture)
- Record each output

### Step 3: Grade
| Grader Type | When to Use |
|-------------|-------------|
| **Automated** | Output has clear pass/fail (tests pass, build succeeds) |
| **Manual** | Output quality is subjective (code style, architecture) |
| **Hybrid** | Automated checks + manual review of edge cases |

### Step 4: Score & Decide

| Score | Action |
|-------|--------|
| pass@3 = 100% | Skill is healthy ✅ |
| pass@3 = 67% | Skill needs minor tuning |
| pass@3 = 33% | Skill needs rework — flag in memory.md |
| pass@3 = 0% | Skill is broken — escalate |

---

## Eval Report Format

```markdown
## 📊 Eval Report: [Skill Name]

**Date:** YYYY-MM-DD
**Task:** [Description]
**Runs:** k=3
**Grader:** automated

| Run | Result | Notes |
|-----|--------|-------|
| 1 | ✅ Pass | Clean output |
| 2 | ✅ Pass | Minor style diff |
| 3 | ❌ Fail | Missing error handling |

**pass@3:** 67% (2/3)
**Verdict:** Minor tuning needed
**Action:** Update SKILL.md section on error handling
```

---

## Integration with AIDLC

- **Phase 2 (Task Design):** Eval existing skills before assigning tasks
- **Phase 3 (Implementation):** Run checkpoint eval after each task
- **Post-Phase 3:** Run consistency eval on the full feature

---

## Rules

- Never eval during active implementation (context waste)
- Store eval reports in `.aidlc/[system]/[feature]/evals/` if project-specific
- Store skill-level evals in `ai-dlc/knowledge/lessons/` for reuse
- Flag skills with pass@3 < 67% in `agent-memory/memory.md`
