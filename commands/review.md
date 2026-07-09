# /review — Pre-merge quality gate

Route to `~/.claude/skills/review-personas/`.

## Instructions

1. Read `~/.claude/skills/review-personas/SKILL.md`
2. Determine scope:
   - If user specifies files → review those
   - If a feature is in progress (`agent-memory/plans/[feature]/`) → review all changes from that feature
   - If user says "full review" or "ship check" → fan-out all 4 personas
3. Default: run **code-reviewer** (5-axis review)
4. If user asks for specific perspective:
   - "security" → security-auditor persona
   - "test coverage" → test-engineer persona
   - "hidden bugs" → bug-hunter persona
   - "all" / "ship check" → fan-out all 4
5. Output: structured review report with severity labels

## Fan-Out (all 4 personas)

```
code-reviewer    → Correctness, Readability, Architecture, Security, Performance
security-auditor → OWASP, auth, input validation, secrets, infrastructure
test-engineer    → Coverage gaps, missing scenarios, test quality
bug-hunter       → Hidden bugs, edge cases, mismatches, silent failures
```

## Prerequisites

- Code changes exist to review

## Done When

- Review report generated
- Critical issues identified (if any)
- Verdict: APPROVE or REQUEST CHANGES
