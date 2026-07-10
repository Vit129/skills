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

## Integration with the Dev Flow

- **During `/plan` (dev-architect):** run bug-hunter on existing code before designing new features
- **During `/build`:** code-reviewer after each task, bug-hunter for boundary-heavy changes
- **Pre-commit:** adversarial review — interview (doubt mode) can invoke a persona
- **Pre-merge:** fan-out all four for comprehensive gate
- **With 3 amigos:** QA lens in interview (amigos mode) covers test-engineer perspective at design time
- **With debugging:** bug-hunter findings feed into `debug-mantra` for reproduction + fix

## Verification

- [ ] At least one persona ran
- [ ] Every Critical/Important finding has a specific fix recommendation
- [ ] No Critical issues remain unresolved (block merge if any exist)
- [ ] Output follows the persona's template format
- [ ] "What's Done Well" section included (not just negatives)
- [ ] Pre-merge gate: all 4 personas ran and findings merged

## Human-in-the-Loop Points

| Step | Approval | When |
|------|----------|------|
| After review report | Acknowledge findings | After a persona produces findings |
| Before posting verdict (APPROVE/REQUEST CHANGES) | Confirm decision | Before finalizing |
| Fan-out scope | Which personas to run | When pre-merge gate requested |

## Self-Learning

After the user approves the output:
1. Save the approved pattern to `knowledge/lessons/review/{pattern}.md`
2. If rejected — note what went wrong before the next review
3. If a pattern proves effective across 3+ reviews — promote to `knowledge/{domain}.md`
