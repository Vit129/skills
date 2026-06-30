# Eval Types

## 1. Consistency Eval (pass@k)

Run the same task k times, check if at least ONE succeeds:

```
pass@k: probability that at least 1 of k attempts succeeds
  k=1: baseline (single shot)
  k=3: 91% if individual pass rate is 70%
  k=5: 97% if individual pass rate is 70%
```

**Use when:** You just need it to work (code generation, test writing).

## 2. Reliability Eval (pass^k)

Run the same task k times, check if ALL succeed:

```
pass^k: probability that ALL k attempts succeed
  k=1: 70% (same as individual)
  k=3: 34% if individual pass rate is 70%
  k=5: 17% if individual pass rate is 70%
```

**Use when:** Consistency is essential (security checks, data validation).

## 3. Checkpoint Eval

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
