---
name: eval-harness
description: >
  Measure skill consistency and reliability using pass@k and checkpoint evals.
  Use when a skill is flagged in memory.md, after creating/updating a skill,
  or for periodic skill health checks. Trigger on "eval skill", "measure skill quality",
  "pass@k", "consistency check", "skill health", "eval harness".
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# Eval Harness

Measure skill consistency and reliability before trusting it in production workflows.

## AIDLC Gate

⚠️ If this skill is triggered as part of a coding/QA task:
- AIDLC governance MUST be active (`.aidlc/` folder exists with DECISIONS + PLAN)
- If not → STOP and route to `governance/aidlc/` first
- Exception: pure investigation/analysis (no code changes) can proceed without AIDLC

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

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "The skill works fine — I don't need to run an eval" | "Works fine" is subjective. pass@3 gives you a number. A skill that passes 2/3 times has a 33% failure rate that compounds across tasks. Measure, don't assume. |
| "Running k=3 attempts wastes tokens — one successful run is enough" | One success proves nothing about consistency. pass@1 = 70% means 30% of users hit failures. k=3 reveals the true reliability that single runs hide. |
| "I'll grade it myself — automated grading is overkill" | Manual grading is inconsistent and biased toward "good enough." Define clear pass/fail criteria upfront so grading is reproducible across sessions. |
| "The eval report format is bureaucracy — I'll just note pass/fail" | The report format captures run-by-run details that reveal PATTERNS (e.g., "fails on edge cases but passes happy path"). A bare pass/fail loses diagnostic value. |
| "I'll eval after the feature ships — no time now" | Post-ship evals discover problems after users hit them. Pre-ship evals catch skill degradation before it affects output quality. Eval during development, not after. |

---

## Red Flags

- 🚩 Skill flagged in `memory.md` but no eval report exists → Measurement skipped; run pass@3 eval before attempting fixes.
- 🚩 Eval report shows pass@3 = 100% on a skill known to be problematic → Eval task was too easy or grading too lenient; use realistic prompts that exercise edge cases.
- 🚩 Agent ran eval during active implementation (mid-Phase 3) → Context waste; eval should run before or after implementation, not during.
- 🚩 Eval results stored only in chat, not persisted to file → Results will be lost; write to `.aidlc/evals/` or `knowledge/lessons/`.
- 🚩 Skill with pass@3 < 67% not flagged in `agent-memory/memory.md` → Escalation rule violated; flag underperforming skills for rework.

---

## Consistency Contract

> These steps MUST execute in the same order every time this skill runs.
> Output may vary, but the workflow is fixed.
> If any step is skipped without a documented skip condition, the session-save hook will flag this skill.

## Verification

Before declaring an eval complete, confirm:

- [ ] Eval task defined with clear expected output
- [ ] k runs completed (minimum k=3)
- [ ] Each run graded with consistent criteria
- [ ] Score calculated and verdict assigned
- [ ] Report written to persistent location (not just chat)
- [ ] Action taken if score < 67% (flag or fix)

---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| Skill outputs to evaluate | Test subject | The actual outputs being measured |
| Scoring criteria (pass/fail definition) | Grading rubric | Consistent evaluation across runs |
| `agent-memory/memory.md` | Skill health flags | Identify which skills need eval |
| `.aidlc/[system]/[feature]/evals/` | Output location | Store eval reports persistently |
| `knowledge/lessons/` | Lessons learnt | Check before execute |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After eval results (pass@k score) | Checkbox (confirm verdict) | After all k runs graded |
| After scoring calibration | Open field (adjust criteria) | When grading seems too lenient/strict |
| Action decision | Single select (tune / rework / escalate) | When score < 67% |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.

## Self-Learning

After user approves the output:

1. **Record good example:** Save approved output to `knowledge/lessons/qa-eval/{pattern}.md`
2. **Record failures:** If output was rejected → note what went wrong for next time
3. **Progressive update:** If a new pattern proved effective → append to relevant knowledge index
4. **Confidence tracking:** `confidence: 1.0` (user-approved) vs `confidence: 0.7` (auto-generated)

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
