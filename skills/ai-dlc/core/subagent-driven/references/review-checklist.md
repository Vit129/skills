# 2-Stage Review Checklist

## Stage 1 — Spec Compliance

> "Does the implementation match what was planned?"

| Check | Pass Criteria |
|---|---|
| All AC covered | Every AC from test scenarios has corresponding code |
| No missing endpoints/functions | All items in task spec are implemented |
| No extra scope | No features added beyond task spec (YAGNI) |
| File scope respected | Only files listed in task were modified |
| No placeholder code | No `TODO`, `// implement later`, empty functions |

**Stage 1 Result:**
- ✅ PASS → proceed to Stage 2
- ❌ FAIL → fix in current session, re-check Stage 1 before Stage 2

---

## Stage 2 — Code Quality

> "Is the code good enough to merge?"

| Check | Pass Criteria |
|---|---|
| Naming | Variables, functions, files follow project conventions |
| Error handling | All async operations have try/catch or error boundaries |
| No dead code | No unused imports, variables, commented-out blocks |
| Tests pass | All existing tests still pass; new tests added if required |
| No hardcoded values | No magic strings/numbers without constants |
| Security basics | No SQL injection risk, no secrets in code, input validated |

**Stage 2 Result:**
- ✅ PASS → commit + report commit hash to orchestrator
- ❌ FAIL → fix in current session, re-check Stage 2

---

## Retry Rules

| Scenario | Action |
|---|---|
| Stage 1 fails once | Fix and re-check Stage 1 (same subagent session) |
| Stage 1 fails twice | Report to orchestrator — may need task re-scoping |
| Stage 2 fails once | Fix and re-check Stage 2 (same subagent session) |
| Stage 2 fails twice | Report to orchestrator — escalate to code review |

---

## Reporting Back to Orchestrator

When task is complete, subagent reports:

```
Task: {task-id} — {task-name}
Stage 1 (Spec Compliance): PASS
Stage 2 (Code Quality): PASS
Commit: {hash}
Files changed: {list}
Notes: {any deviations or decisions made}
```
