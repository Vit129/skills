# Parallel Trace Analysis Concept

Analyze multiple execution traces simultaneously to extract knowledge faster
and produce conflict-free, consolidated lessons.

Inspired by: Trace2Skill (arXiv:2603.25158) — parallel fleet of sub-agents

---

## The Problem with Sequential Analysis

Sequential lesson capture (current approach):
- One failure → analyze → capture lesson → next failure
- Slow: each failure processed one at a time
- Biased: early failures influence how later ones are interpreted
- Misses cross-trace patterns: similar failures across different features not connected

Parallel analysis solves this by processing multiple traces simultaneously,
then consolidating into a unified, conflict-free knowledge update.

---

## When to Use

Use parallel analysis when:

```
Trigger conditions:
- Running a full test suite (many failures at once)
- Onboarding a new codebase (many patterns to extract)
- Post-incident review (multiple related failures)
- Batch knowledge import from existing logs/reports
- {execution_trigger} produces > 5 failures in one run
```

For single failures, sequential capture (from `utility-scoring.md`) is sufficient.

---

## Parallel Analysis Pattern

### Step 1: Collect Traces

```
Input: N execution traces (test results, error logs, reflexion logs)
Each trace contains:
- What was attempted
- What failed / succeeded
- Error message / stack trace (if failure)
- Healing attempts (if any)
- Final outcome
```

### Step 2: Parallel Extraction (Conceptual)

Process each trace independently to extract candidate lessons:

```
For each trace_i in parallel:
  1. Identify: what type of failure? (timing, locator, auth, data, etc.)
  2. Extract: root cause pattern
  3. Extract: solution that worked (if healed)
  4. Generate: candidate lesson entry
  5. Tag: domain, category, confidence

Output: N candidate lessons (one per trace, may overlap)
```

In practice with a single AI agent: process traces in rapid sequence,
holding all candidates in context before writing any — simulating parallelism.

### Step 3: Hierarchical Consolidation

Before writing to `{lesson_store}`, consolidate candidates:

```
Phase A — Deduplication:
  Group candidates by (category + error_pattern similarity)
  For each group:
    - If same root cause → merge into one lesson
    - Combine: applied_count = sum, prevented_failures = sum
    - Keep: highest confidence version of the solution

Phase B — Conflict Detection:
  For each pair of candidates:
    - Same category + opposite solutions → flag as conflict
    - Same error + different root causes → keep both as -v1, -v2
    - Subset relationship → keep more specific one

Phase C — Cross-Trace Pattern Detection:
  If same pattern appears in ≥ 3 traces across different features:
    → Elevate to "cross-cutting concern" (higher confidence: 0.9)
    → Tag as reusable across domains
    → Add to common/ category if applicable

Phase D — Final Write:
  Write consolidated lessons to {lesson_store}
  Log: "Extracted {N} lessons from {M} traces, merged {K} duplicates, flagged {J} conflicts"
```

---

## Conflict-Free Consolidation Rules

From Trace2Skill — ensures no contradicting knowledge enters the store:

```
Rule 1: Never write two lessons with same id
Rule 2: Never write two lessons that say opposite things about same pattern
Rule 3: If conflict detected → write neither, flag both for human review
Rule 4: Cross-trace consensus (≥3 traces agree) → higher confidence than single-trace
Rule 5: Healing-derived lessons (test passed after fix) → confidence 0.8, not 0.75
```

---

## Output Format

After parallel analysis, write summary to `{memory_layer}`:

```
## Parallel Analysis — {date}

Traces analyzed: {N}
Lessons extracted: {M}
  - New: {n1}
  - Merged duplicates: {n2}
  - Cross-cutting patterns: {n3}
Conflicts flagged: {n4} (needs human review)
Confidence distribution:
  - 0.9+ (cross-trace consensus): {n}
  - 0.8 (healing-derived): {n}
  - 0.75 (single-trace): {n}
```

---

## Practical Implementation for Single AI Agent

True parallelism requires multiple agents. For a single AI agent, simulate with:

```
1. Collect all traces first (don't analyze yet)
2. Read ALL traces in one pass — build mental model of all failures
3. Identify cross-trace patterns BEFORE writing any lesson
4. Write consolidated lessons in one batch
5. This avoids the sequential bias problem
```

Key difference from sequential: **read all, then write all** vs **read one, write one, repeat**.

---

## Relationship to Other References

- `utility-scoring.md` — handles single-trace capture (sequential)
- `parallel-analysis.md` — handles multi-trace capture (batch/parallel)
- `auto-consolidation.md` — handles periodic cleanup of accumulated lessons
- `smart-routing.md` / `semantic-routing.md` — uses the lessons produced here
