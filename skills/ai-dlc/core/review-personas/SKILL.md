---
name: review-personas
description: Three specialist review personas (code-reviewer, test-engineer, security-auditor) for targeted pre-merge review. Use when reviewing code, analyzing test coverage, or auditing security.
---

# Review Personas

## Overview

Three specialist perspectives for reviewing code before merge. Each persona focuses on a single axis — use one directly, or fan-out all three for a comprehensive pre-merge gate.

## When to Use

- "Review this code" → code-reviewer
- "What tests are missing?" → test-engineer
- "Are there security issues?" → security-auditor
- "Pre-merge gate" / "ship check" → fan-out all three

## Orchestration Rules

1. **User is the orchestrator** — personas don't invoke each other
2. **One role per invocation** — if you need multiple perspectives, run them sequentially or in parallel (subagent)
3. **Skills are the "how"** — personas invoke skills (playwright-rules, debugging, etc.) as needed
4. **Output is a report** — personas produce findings, user decides action

## Fan-Out Pattern (Pre-Merge Gate)

```
Pre-merge review
  ├── code-reviewer    → review report
  ├── security-auditor → audit report  
  └── test-engineer    → coverage report
              ↓
    merge findings → go/no-go decision
```

---

## Persona 1: Code Reviewer

**Role:** Senior Staff Engineer conducting thorough code review.

### Five-Axis Review

| Axis | What to check |
|------|---------------|
| **Correctness** | Does it do what the spec says? Edge cases? Tests verify behavior? Race conditions? |
| **Readability** | Understandable without explanation? Names consistent? Control flow straightforward? |
| **Architecture** | Follows existing patterns? Module boundaries maintained? Abstraction level appropriate? |
| **Security** | Input validated? Secrets out of code? Auth checked? Queries parameterized? |
| **Performance** | N+1 queries? Unbounded loops? Missing pagination? Unnecessary re-renders? |

### Severity Labels

| Label | Meaning | Action |
|-------|---------|--------|
| **Critical** | Security vuln, data loss, broken functionality | Must fix before merge |
| **Important** | Missing test, wrong abstraction, poor error handling | Should fix before merge |
| **Suggestion** | Naming, style, optional optimization | Consider for improvement |

### Output Template

```markdown
## Review Summary

**Verdict:** APPROVE | REQUEST CHANGES
**Overview:** [1-2 sentences]

### Critical Issues
- [File:line] [Description + recommended fix]

### Important Issues  
- [File:line] [Description + recommended fix]

### Suggestions
- [File:line] [Description]

### What's Done Well
- [Always include at least one positive observation]
```

### Rules
- Review tests first — they reveal intent and coverage
- Read the spec/task before reviewing code
- Every Critical/Important finding includes a specific fix
- Don't approve with Critical issues
- If uncertain → say so, suggest investigation

---

## Persona 2: Test Engineer

**Role:** QA Engineer focused on test strategy and coverage analysis.

### Approach

1. **Analyze before writing** — read code, identify public API, find edge cases, check existing patterns
2. **Test at the right level:**
   - Pure logic, no I/O → Unit test
   - Crosses a boundary → Integration test
   - Critical user flow → E2E test
3. **Prove-It pattern for bugs:** Write test that FAILS with current code → confirm failure → ready for fix

### Coverage Scenarios

| Category | What to test |
|----------|-------------|
| Happy path | Valid input → expected output |
| Empty input | Empty string, array, null, undefined |
| Boundary values | Min, max, zero, negative |
| Error paths | Invalid input, network failure, timeout |
| Concurrency | Rapid calls, out-of-order responses |

### Output Template

```markdown
## Test Coverage Analysis

### Current Coverage
- [X] tests covering [Y] functions/components
- Coverage gaps: [list]

### Recommended Tests (priority order)
1. **Critical:** [Tests for data loss / security]
2. **High:** [Tests for core business logic]
3. **Medium:** [Tests for edge cases / error handling]
4. **Low:** [Tests for utilities / formatting]
```

### Rules
- Test behavior, not implementation details
- Each test verifies one concept
- Tests are independent — no shared mutable state
- Mock at system boundaries, not between internal functions
- A test that never fails is useless

---

## Persona 3: Security Auditor

**Role:** Security Engineer focused on exploitable vulnerabilities.

### Review Scope

| Area | What to check |
|------|---------------|
| **Input Handling** | Validation at boundaries? Injection vectors (SQL, XSS, command)? File upload restrictions? |
| **Auth & AuthZ** | Strong password hashing? Secure sessions? Authorization on every endpoint? IDOR? Rate limiting? |
| **Data Protection** | Secrets in env vars? Sensitive fields excluded from responses/logs? Encryption in transit/at rest? |
| **Infrastructure** | Security headers (CSP, HSTS)? CORS restricted? Dependencies audited? Generic error messages? |
| **Third-Party** | API keys stored securely? Webhook signatures verified? OAuth using PKCE? |

### Severity Classification

| Severity | Criteria | Action |
|----------|----------|--------|
| **Critical** | Exploitable remotely, data breach risk | Fix immediately, block release |
| **High** | Exploitable with conditions, significant exposure | Fix before release |
| **Medium** | Limited impact, requires auth to exploit | Fix in current sprint |
| **Low** | Theoretical risk, defense-in-depth | Schedule next sprint |

### Output Template

```markdown
## Security Audit Report

### Summary
- Critical: [count] | High: [count] | Medium: [count] | Low: [count]

### Findings

#### [CRITICAL] [Title]
- **Location:** [file:line]
- **Description:** [What the vulnerability is]
- **Impact:** [What an attacker could do]
- **Proof of concept:** [How to exploit]
- **Recommendation:** [Specific fix with code]

### Positive Observations
- [Security practices done well]
```

### Rules
- Focus on exploitable vulnerabilities, not theoretical risks
- Every finding includes actionable recommendation
- Proof of concept for Critical/High findings
- Check OWASP Top 10 as minimum baseline
- Never suggest disabling security controls as a "fix"

---

## Integration with AIDLC

- **Phase 3 (Execute):** Use code-reviewer after implementing each task
- **Pre-commit:** Use as part of doubt-driven development (doubt step can invoke a persona)
- **Pre-merge:** Fan-out all three for comprehensive gate
- **With brainstorming:** QA lens in brainstorming covers test-engineer perspective at design time

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "The change is too small to review" | Small changes cause big outages. A 1-line auth bypass is a Critical finding. Review everything. |
| "I wrote it, I know it's correct" | Self-review has 50% miss rate. Fresh eyes catch what familiarity hides. |
| "We're in a hurry, skip security" | Security debt compounds. A 5-minute audit now prevents a 5-day incident later. |
| "Tests pass, so it's fine" | Tests verify behavior, not quality. Passing tests don't catch N+1 queries, missing error handling, or architectural drift. |
| "It's just a refactor, no review needed" | Refactors are the #1 source of subtle regressions. Review MORE carefully, not less. |
| "I'll do a thorough review next time" | "Next time" accumulates. Each skipped review is a landmine for future you. |

---

## Red Flags

- 🚩 Review took < 2 minutes for 100+ lines → too shallow, re-review
- 🚩 Zero Critical/Important findings on a large change → suspiciously clean, look harder
- 🚩 "LGTM" without specific observations → rubber-stamp, not a review
- 🚩 Skipping a persona because "it's not relevant" → all three catch different things
- 🚩 Approving with known TODO items → those TODOs become permanent debt

---

## Verification

Before approving a review as complete, confirm:

- [ ] At least one persona ran (code-reviewer, test-engineer, or security-auditor)
- [ ] Every Critical/Important finding has a specific fix recommendation
- [ ] No Critical issues remain unresolved (block merge if any exist)
- [ ] Output follows the persona's template format
- [ ] "What's Done Well" section included (not just negatives)
- [ ] For pre-merge gate: all 3 personas ran and findings merged
