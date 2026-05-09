# /review — Pre-merge quality gate

Route to `ai-dlc/core/review-personas/`.

## Instructions

1. Read `ai-dlc/core/review-personas/SKILL.md`
2. Determine scope:
   - If user specifies files → review those
   - If in AIDLC context → review all changes from current feature
   - If user says "full review" or "ship check" → fan-out all 3 personas
3. Default: run **code-reviewer** (5-axis review)
4. If user asks for specific perspective:
   - "security" → security-auditor persona
   - "test coverage" → test-engineer persona
   - "all" / "ship check" → fan-out all 3
5. Output: structured review report with severity labels

## Fan-Out (all 3 personas)

```
code-reviewer    → Correctness, Readability, Architecture, Security, Performance
security-auditor → OWASP, auth, input validation, secrets, infrastructure
test-engineer    → Coverage gaps, missing scenarios, test quality
```

## Prerequisites

- Code changes exist to review

## Done When

- Review report generated
- Critical issues identified (if any)
- Verdict: APPROVE or REQUEST CHANGES
