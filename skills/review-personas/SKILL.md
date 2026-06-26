---
name: review-personas
description: Four specialist review personas (code-reviewer, test-engineer, security-auditor, bug-hunter) for targeted pre-merge review. Use when reviewing code, analyzing test coverage, auditing security, or hunting hidden bugs.
credit: Inspired by 9arm-skills (https://github.com/thananon/9arm-skills) — engineering/scrutinize
version: 1.1.0
last_improved: 2026-06-25
improvement_count: 1
---

# Review Personas

Four specialist perspectives for reviewing code before merge. Each focuses on a single axis — use one directly, or fan-out all four for a comprehensive pre-merge gate.

## Load the Right Persona

| User says | Load |
|-----------|------|
| "review this code", "code review", "check quality" | `references/code-reviewer.md` |
| "what tests are missing?", "coverage analysis" | `references/test-engineer.md` |
| "security issues?", "audit security", "vulnerabilities" | `references/security-auditor.md` |
| "find hidden bugs", "scan for mismatches" | `references/bug-hunter.md` |
| "pre-merge gate", "ship check" | fan-out — load all 4 |

## Orchestration Rules

1. **User is the orchestrator** — personas don't invoke each other
2. **One role per invocation** — multiple perspectives = run sequentially or in parallel (subagent)
3. **Skills are the "how"** — personas invoke skills (playwright-rules, debug-mantra, find-mismatch) as needed
4. **Output is a report** — personas produce findings, user decides action

## Fan-Out Pattern (Pre-Merge Gate)

```
Pre-merge review
  ├── code-reviewer    → review report
  ├── security-auditor → audit report
  ├── test-engineer    → coverage report
  └── bug-hunter       → mismatch report
              ↓
    merge findings → go/no-go decision
```

## Integration with AIDLC

- **Phase 2 (Plan):** run bug-hunter on existing code before designing new features
- **Phase 3 (Execute):** code-reviewer after each task, bug-hunter for boundary-heavy changes
- **Pre-commit:** adversarial review — interview (doubt mode) can invoke a persona
- **Pre-merge:** fan-out all four for comprehensive gate
- **With 3 amigos:** QA lens in interview (amigos mode) covers test-engineer perspective at design time
- **With debugging:** bug-hunter findings feed into `debug-mantra` for reproduction + fix

## Anti-Rationalization

| Excuse to Skip | Counter-Argument |
|---|---|
| "The change is too small to review" | Small changes cause big outages. A 1-line auth bypass is Critical. Review everything. |
| "I wrote it, I know it's correct" | Self-review has 50% miss rate. Fresh eyes catch what familiarity hides. |
| "We're in a hurry, skip security" | Security debt compounds. 5-minute audit now prevents a 5-day incident. |
| "Tests pass, so it's fine" | Tests verify behavior, not quality. They don't catch N+1, missing error handling, architectural drift. |
| "It's just a refactor" | Refactors are the #1 source of subtle regressions. Review MORE carefully. |

## Red Flags

- 🚩 Review took < 2 minutes for 100+ lines → too shallow, re-review
- 🚩 Zero Critical/Important findings on a large change → look harder
- 🚩 "LGTM" without specific observations → rubber-stamp, not a review
- 🚩 Skipping a persona because "it's not relevant" → all four catch different things

## Verification

- [ ] At least one persona ran
- [ ] Every Critical/Important finding has a specific fix recommendation
- [ ] No Critical issues remain unresolved (block merge if any exist)
- [ ] Output follows the persona's template format
- [ ] "What's Done Well" section included (not just negatives)
- [ ] Pre-merge gate: all 4 personas ran and findings merged
