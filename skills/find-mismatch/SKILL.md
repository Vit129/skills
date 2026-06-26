---
name: find-mismatch
description: Systematic bug detection with full Bug Life Cycle — scans codebase for cross-boundary mismatches, serialization gaps, logic bugs, async bugs, and stub code. Then manages the lifecycle DETECT→CLASSIFY→REPRODUCE→FIX→GUARD. Trigger on /find-mismatch and proactively when user asks to find bugs, hunt mismatches, audit for hidden issues, or run a systematic code scan.
credit: Inspired by 9arm-skills (https://github.com/thananon/9arm-skills) — engineering/find-mismatch
version: 1.1.0
last_improved: 2026-06-25
improvement_count: 1
---

# Find Mismatch — Systematic Bug Detection + Bug Life Cycle

> Most bugs hide at **boundaries** — where two systems, modules, or layers meet and disagree about contracts, types, timing, or encoding. This skill finds those disagreements before users do.

## Invoke

```
/find-mismatch [scope]
```
No scope → scan entire project. With scope → scan specified files/directories.

## Workflow

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

## Integration with AIDLC

- **Phase 2 (Plan):** run on existing code before designing — find landmines early
- **Phase 3 (Execute):** run after each task — catch mismatches from new code
- **Pre-merge gate:** Persona 4 (Bug Hunter) in `review-personas` fan-out
- **With debugging:** finding → feed into `debug-mantra` for reproduction + fix

## Verification

- [ ] Every finding cites specific `file:line`
- [ ] No style issues reported as bugs
- [ ] False positive check performed per finding
- [ ] Severity assigned honestly (not inflated)
- [ ] Each fix has a corresponding regression test
- [ ] Lifecycle tracker updated (no orphan findings)
