---
name: find-mismatch
description: Systematic bug detection with full Bug Life Cycle — scans codebase for cross-boundary mismatches, serialization gaps, logic bugs, async bugs, and stub code. Then manages the lifecycle DETECT→CLASSIFY→REPRODUCE→FIX→GUARD. Trigger on /find-mismatch and proactively when user asks to find bugs, hunt mismatches, audit for hidden issues, or run a systematic code scan.
credit: Inspired by 9arm-skills (https://github.com/thananon/9arm-skills) — engineering/find-mismatch
version: 1.2.0
last_improved: 2026-07-10
improvement_count: 2
---

# Find Mismatch — Systematic Bug Detection + Bug Life Cycle

> Most bugs hide at **boundaries** — where two systems, modules, or layers meet and disagree about contracts, types, timing, or encoding. This skill finds those disagreements before users do.

## Invoke

```
/find-mismatch [scope]
```
No scope → scan entire project. With scope → scan specified files/directories.

## Workflow

0. **Prioritize with the graph, if available** — if `graphify-out/` exists in the project root, run `mcp__graphify__query_graph` (god-nodes, blast radius) to focus the scan on the highest-impact modules first, especially when scope is the whole project.
1. **SCAN** — walk the 7 categories in order → `references/detection-checklist.md`
2. **LIFECYCLE** — every finding enters DETECT→CLASSIFY→REPRODUCE→FIX→GUARD→CLOSED → `references/lifecycle-output.md`
3. **REPORT** — prioritized list, output format in `references/lifecycle-output.md`

## 7 Detection Categories (detail → detection-checklist.md)

1. **Cross-boundary contracts** — name/param/return/event/API shape disagreements
2. **Serialization & encoding** — casing, optional vs required, date formats, schema drift
3. **Logic bugs** — off-by-one, double counting, inverted conditions, wrong operators
4. **Property/method access** — null deref, wrong property name, array bounds
5. **Async & concurrency** — missing await, race, resource leak, stale closure
6. **Placeholder & stub** — TODO in prod path, empty catch, hardcoded values
7. **Language-specific** — TS/Python/C#/Swift idioms that hide bugs

## Operating Rules

1. **Real bugs only** — style/naming/formatting are NOT findings
2. **Evidence required** — cite specific `file:line`, show the mismatch concretely
3. **False positive check** — before reporting, ask "is this intentional?" Check comments, tests, docs
4. **Severity honesty** — don't inflate. P3 is fine. Empty report is fine
5. **Lifecycle tracking** — every finding tracked to CLOSED or CANNOT_REPRO
6. **One fix per finding** — own fix + test, no bundling
7. **Guard mandatory** — fix without regression test = not done (test fails without fix, passes with it)

## Integration with the Dev Flow

- **During `/plan` (dev-architect):** run on existing code before designing — find landmines early
- **During `/build`:** run after each task — catch mismatches from new code
- **Pre-merge gate:** Persona 4 (Bug Hunter) in `review-personas` fan-out
- **With debugging:** finding → feed into `debug-mantra` for reproduction + fix

## Anti-Patterns

| Anti-Pattern | Why It's Wrong |
|---|---|
| Report style issues as bugs | Wastes time, dilutes real findings |
| Skip reproduction step | "I think it's a bug" ≠ "I proved it's a bug" |
| Fix without guard | Bug will return. Guaranteed. |
| Close as CANNOT_REPRO after 1 attempt | Try 3 times with different approaches first |
| Bundle multiple fixes in one commit | Makes rollback impossible, hides which fix solved what |
| Ignore P3 findings forever | They accumulate into P1 problems |

## Verification

- [ ] Every finding cites specific `file:line`
- [ ] No style issues reported as bugs
- [ ] False positive check performed per finding
- [ ] Severity assigned honestly (not inflated)
- [ ] Each fix has a corresponding regression test
- [ ] Lifecycle tracker updated (no orphan findings)

## Self-Learning

After findings are confirmed and fixed:
1. Save the confirmed bug class + detection method to `knowledge/lessons/{platform}/{mismatch-type}.md`
2. If a finding was rejected — note why, to improve future scan accuracy
3. If 3+ findings share the same category — promote to `knowledge/lessons/{category}-pattern.md`
