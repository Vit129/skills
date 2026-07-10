# Bug Life Cycle + Output Format

## Lifecycle States

```
DETECT → CLASSIFY → REPRODUCE → FIX → GUARD → CLOSED
   ↑                    |
   └── CANNOT_REPRO ────┘  (re-investigate later)
```

| State | Entry Criteria | Exit Criteria |
|-------|---------------|---------------|
| **DETECT** | Pattern matched during scan | Classified with severity + category |
| **CLASSIFY** | Finding confirmed real (not false positive) | Severity assigned, reproduction plan exists |
| **REPRODUCE** | Reproduction plan exists | Failing test written OR manual repro documented |
| **FIX** | Failing test exists | Test passes, no regressions |
| **GUARD** | Fix verified | Regression test committed, CI passes |
| **CLOSED** | Guard in place | Finding removed from active list |
| **CANNOT_REPRO** | 3 attempts failed | Parked with notes, revisit trigger defined |

## Severity

| Severity | Criteria | SLA |
|----------|----------|-----|
| **P0 — Critical** | Data loss, security breach, system down | Fix immediately, block release |
| **P1 — High** | Core flow broken, workaround exists | Fix this sprint |
| **P2 — Medium** | Edge case failure, limited impact | Fix next sprint |
| **P3 — Low** | Cosmetic, theoretical, defense-in-depth | Backlog |

## Classification Rules
- **False positive?** → correct behavior → document WHY, close as `NOT_A_BUG`
- **Duplicate?** → link to existing finding, close as `DUPLICATE`
- **Won't fix?** → requires explicit justification + tech debt ticket

## Classify Tags (assign at CLASSIFY, carry through the tracker)

Tag every surviving finding with both:

| Tag | Values | Meaning |
|-----|--------|---------|
| **Category** | `bug` \| `enhancement` | Is this broken, or a new capability being requested? |
| **Readiness** | `ready-for-agent` \| `needs-human` | Fully specified + reproducible → agent can take it straight to REPRODUCE. Ambiguous root cause, missing context, or a design call → route to the user first, don't guess. |

A confirmed reproduction (or a confirmed diff-matches-claim, for review findings)
makes a much stronger brief for whoever picks the ticket up next — assign
`ready-for-agent` only once repro is actually confirmed, not just suspected.

---

## Output Format

```markdown
## Find-Mismatch Report

**Scope:** [files/directories scanned]
**Findings:** [total] (P0: [n] | P1: [n] | P2: [n] | P3: [n])

### [P0] [Category] — [Title]
- **Location:** `file:line`
- **What:** [One sentence describing the mismatch]
- **Why it's a bug:** [The consequence — what breaks]
- **Evidence:** [Code snippet or trace showing the mismatch]
- **Lifecycle:** DETECT → next action: [CLASSIFY/REPRODUCE/FIX]
- **Suggested fix:** [Specific, minimal change]

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
| # | Title | Severity | Category | Readiness | State | Next Action |
|---|-------|----------|----------|-----------|-------|-------------|
| 1 | ... | P0 | bug | ready-for-agent | REPRODUCE | Write failing test |
```

## Human-in-the-Loop Points

| Step | Approval | When |
|------|----------|------|
| After scan report | Checkbox review | User confirms which findings are real |
| Before REPRODUCE | Single select | User picks priority order |
| Before FIX | Open field | User approves fix approach |
| After GUARD | Checkbox | User confirms test adequate |

**Rule:** Present as prioritized list — user decides which to pursue. Never auto-fix P0 without approval.
