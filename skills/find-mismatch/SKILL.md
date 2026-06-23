---
name: find-mismatch
description: Systematic bug detection with full Bug Life Cycle — scans codebase for cross-boundary mismatches, serialization gaps, logic bugs, async bugs, and stub code. Then manages the lifecycle DETECT→CLASSIFY→REPRODUCE→FIX→GUARD. Trigger on /find-mismatch and proactively when user asks to find bugs, hunt mismatches, audit for hidden issues, or run a systematic code scan.
credit: Inspired by 9arm-skills (https://github.com/thananon/9arm-skills) — engineering/find-mismatch
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# Find Mismatch — Systematic Bug Detection + Bug Life Cycle

Scan a codebase systematically for real bugs — not style issues. Then manage each finding through a full lifecycle until it's fixed and guarded against regression.

## Philosophy

> Most bugs hide at **boundaries** — where two systems, modules, or layers meet and disagree about contracts, types, timing, or encoding.

This skill finds those disagreements before users do.

---

## Part 1: Detection (The Scan)

### How to Invoke

```
/find-mismatch [scope]
```

- No scope → scan entire project
- With scope → scan specified files/directories

### Detection Checklist (7 Categories)

Scan in this order. Each category has specific patterns to look for.

#### 1. Cross-Boundary Contract Mismatches

Where two pieces of code **agree on intent but disagree on shape**.

| Check | Example |
|-------|---------|
| Function name at call site ≠ definition | `getUserName()` called but `getUsername()` defined |
| Parameter count mismatch | Caller passes 3 args, function expects 2 |
| Parameter type mismatch | Caller sends `string`, receiver expects `number` |
| Return type mismatch | Function returns `T | null`, caller doesn't handle null |
| Interface implementation gaps | Class claims to implement interface but misses a method |
| Event name mismatch | Publisher emits `user.created`, subscriber listens `userCreated` |
| API contract drift | Frontend expects `{ data: [] }`, backend returns `{ items: [] }` |

#### 2. Serialization & Encoding Gaps

Where data **crosses a wire or storage boundary** and loses fidelity.

| Check | Example |
|-------|---------|
| Casing mismatch | Code uses `camelCase`, JSON/DB uses `snake_case`, no mapping |
| Optional vs required confusion | Field optional in type, but code accesses without null check |
| Date/time format mismatch | ISO string stored, epoch number expected |
| Encoding layers | Double-encoding URLs, HTML entities in JSON, UTF-8 vs Latin-1 |
| Missing fields after schema change | New field added to DB, old code doesn't read/write it |
| Enum string vs number | TypeScript enum serializes as number, API expects string |

#### 3. Logic Bugs

Where the code **computes the wrong answer**.

| Check | Example |
|-------|---------|
| Off-by-one | `< length` vs `<= length`, 0-indexed vs 1-indexed |
| Double counting | Fee calculated in service AND in controller |
| Inverted condition | `if (!isValid)` where `if (isValid)` intended |
| Dead code after early return | Code after `return` / `throw` that never executes |
| Shadowed variables | Inner scope re-declares outer variable, hides the real value |
| Wrong operator | `=` vs `==`, `&&` vs `||`, `+` (concat) vs `+` (add) |
| Incorrect default | Default value doesn't match business rule |

#### 4. Property & Method Access Errors

Where code **reaches for something that isn't there**.

| Check | Example |
|-------|---------|
| Null/undefined dereference | `user.address.city` when `address` can be null |
| Wrong property name | `response.data` vs `response.body` |
| Array access without bounds check | `items[0]` when array might be empty |
| Optional chaining inconsistency | `user?.name` in one place, `user.name` in another |
| Type narrowing gaps | After `if (x)` check, code still treats x as possibly falsy |

#### 5. Async & Concurrency Bugs

Where **timing or ordering** assumptions are wrong.

| Check | Example |
|-------|---------|
| Missing await | `const data = fetchData()` — gets Promise, not data |
| Race condition | Two requests modify same resource, last-write-wins silently |
| Resource leak | Connection/stream opened but not closed on error path |
| Unhandled rejection | Promise `.catch()` missing, error swallowed |
| Stale closure | Event handler captures old state, doesn't see updates |
| Concurrent modification | Iterating collection while another path modifies it |

#### 6. Placeholder & Stub Code

Where code **pretends to work but doesn't**.

| Check | Example |
|-------|---------|
| TODO/FIXME/HACK in production path | `// TODO: implement validation` |
| Empty catch blocks | `catch (e) {}` — error swallowed silently |
| Hardcoded values | `if (userId === "admin")` instead of proper auth |
| Unused function results | `calculateTotal()` called but return value discarded |
| Dead imports | Import statement but symbol never used |
| Console.log left in | Debug logging in production code |

#### 7. Language-Specific Checks

##### TypeScript / JavaScript
- `any` type hiding real mismatches
- `as` type assertions bypassing type safety
- `==` instead of `===`
- Missing `readonly` on arrays/objects that shouldn't mutate
- `JSON.parse()` without validation

##### Python
- Mutable default arguments (`def f(x=[])`)
- `is` vs `==` for value comparison
- Missing `__init__` assignments
- Bare `except:` catching everything

##### C# / .NET
- `async void` (unobservable exceptions)
- Missing `ConfigureAwait(false)` in library code
- `IDisposable` not disposed
- String comparison without `StringComparison`

---

## Part 2: Bug Life Cycle

Every finding from the scan enters this lifecycle. No bug is "found" until it's classified and tracked.

### Lifecycle States

```
DETECT → CLASSIFY → REPRODUCE → FIX → GUARD → CLOSED
   ↑                    |
   └── CANNOT_REPRO ────┘  (re-investigate later)
```

### State Definitions

| State | Entry Criteria | Exit Criteria |
|-------|---------------|---------------|
| **DETECT** | Pattern matched during scan | Classified with severity + category |
| **CLASSIFY** | Finding confirmed as real (not false positive) | Severity assigned, reproduction plan exists |
| **REPRODUCE** | Reproduction plan exists | Failing test written OR manual repro documented |
| **FIX** | Failing test exists | Test passes, no regressions |
| **GUARD** | Fix verified | Regression test committed, CI passes |
| **CLOSED** | Guard in place | Finding removed from active list |
| **CANNOT_REPRO** | 3 attempts failed to reproduce | Parked with notes, revisit trigger defined |

### Severity Classification

| Severity | Criteria | SLA |
|----------|----------|-----|
| **P0 — Critical** | Data loss, security breach, system down | Fix immediately, block release |
| **P1 — High** | Core flow broken, workaround exists | Fix this sprint |
| **P2 — Medium** | Edge case failure, limited impact | Fix next sprint |
| **P3 — Low** | Cosmetic, theoretical, defense-in-depth | Backlog |

### Classification Rules

- **False positive?** → If the "bug" is actually correct behavior, document WHY and close as `NOT_A_BUG`
- **Duplicate?** → Link to existing finding, close as `DUPLICATE`
- **Won't fix?** → Requires explicit justification + tech debt ticket

---

## Part 3: Output Format

### Scan Report

```markdown
## Find-Mismatch Report

**Scope:** [files/directories scanned]
**Date:** [timestamp]
**Findings:** [total] (P0: [n] | P1: [n] | P2: [n] | P3: [n])

---

### [P0] [Category] — [Title]

- **Location:** `file:line`
- **What:** [One sentence describing the mismatch]
- **Why it's a bug:** [The consequence — what breaks]
- **Evidence:** [Code snippet or trace showing the mismatch]
- **Lifecycle:** DETECT → next action: [CLASSIFY/REPRODUCE/FIX]
- **Suggested fix:** [Specific, minimal change]

---

### [P1] [Category] — [Title]
...

---

## Summary

| Category | Count | Highest Severity |
|----------|-------|-----------------|
| Cross-boundary | [n] | [Px] |
| Serialization | [n] | [Px] |
| Logic | [n] | [Px] |
| Property access | [n] | [Px] |
| Async | [n] | [Px] |
| Stub code | [n] | [Px] |
| Language-specific | [n] | [Px] |

## Lifecycle Tracker

| # | Title | Severity | State | Owner | Next Action |
|---|-------|----------|-------|-------|-------------|
| 1 | ... | P0 | REPRODUCE | — | Write failing test |
| 2 | ... | P1 | CLASSIFY | — | Confirm not false positive |
```

---

## Operating Rules

1. **Real bugs only.** Style issues, naming preferences, and formatting are NOT findings. If it doesn't break behavior or create risk, skip it.
2. **Evidence required.** Every finding must cite specific `file:line` and show the mismatch concretely. No vague "this might break."
3. **False positive awareness.** Before reporting, ask: "Is there a reason this is intentionally this way?" Check for comments, tests, or documentation that explain the apparent mismatch.
4. **Severity honesty.** Don't inflate severity to make the report look important. P3 is fine. Empty report is fine.
5. **Lifecycle tracking.** Every finding enters the lifecycle. Don't just report and walk away — track to CLOSED or CANNOT_REPRO.
6. **One fix per finding.** Each finding gets its own fix + test. Don't bundle unrelated fixes.
7. **Guard is mandatory.** A fix without a regression test is not done. The test must fail without the fix and pass with it.

---

## Integration with AIDLC

- **Phase 2 (Plan):** Run `/find-mismatch` on existing code before designing new features — find landmines early
- **Phase 3 (Execute):** Run after implementing each task — catch mismatches introduced by new code
- **Pre-merge gate:** Use as Persona 4 (Bug Hunter) in review-personas fan-out
- **With debugging:** If `/find-mismatch` finds something → feed into `debug-mantra` for reproduction + fix

---

## Anti-Patterns (Don't Do This)

| Anti-Pattern | Why It's Wrong |
|---|---|
| Report style issues as bugs | Wastes time, dilutes real findings |
| Skip reproduction step | "I think it's a bug" ≠ "I proved it's a bug" |
| Fix without guard | Bug will return. Guaranteed. |
| Close as CANNOT_REPRO after 1 attempt | Try 3 times with different approaches first |
| Bundle multiple fixes in one commit | Makes rollback impossible, hides which fix solved what |
| Ignore P3 findings forever | They accumulate into P1 problems |

---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| Full codebase access | Read | Scan across boundaries |
| TypeScript/Python/C# compiler | Shell tool | Type-check for contract mismatches |
| `grep_search` / `readCode` | Agent tool | Pattern matching across files |
| `knowledge/lessons/` | Lessons learnt | Check if this mismatch class was seen before |
| Test runner | Shell tool | Reproduce findings |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After scan report generated | Checkbox review | User confirms which findings are real (not false positive) |
| Before REPRODUCE step | Single select | User picks priority order for reproduction |
| Before FIX step | Open field | User approves fix approach or suggests alternative |
| After GUARD (regression test) | Checkbox | User confirms test is adequate |

**Rule:** Present scan results as a prioritized list — user decides which to pursue. Never auto-fix P0 without explicit approval.

## Verification

After find-mismatch session completes:

- [ ] Every finding cites specific `file:line`
- [ ] No style issues reported as bugs
- [ ] False positive check performed for each finding
- [ ] Severity assigned honestly (not inflated)
- [ ] Each fix has a corresponding regression test
- [ ] Lifecycle tracker updated (no orphan findings)

## Self-Learning

After user confirms findings and fixes:

1. **Record mismatch pattern:** Save confirmed bug class + detection method to `knowledge/lessons/{platform}/{mismatch-type}.md`
2. **Record false positives:** If findings were rejected → note why, to improve future scan accuracy
3. **Progressive update:** If a new detection heuristic proved effective, append to this skill's Detection Checklist
4. **Pattern aggregation:** If 3+ findings share the same category → create `knowledge/lessons/{category}-pattern.md`

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
