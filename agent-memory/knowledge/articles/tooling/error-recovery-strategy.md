---
id: error-recovery-strategy
name: Error Recovery Strategy Pattern
type: pattern
scope: global
status: active
score: 5.0
created: 2026-04-26
updated: 2026-04-27
keywords: error handling, debugging, escalation, retry logic, persistence vs giving up
---

# Error Recovery Strategy

**Pattern:** Diagnose → Adjust → Verify → Loop/Escalate (max 3 different attempts)

## Rules

| Rule | Why |
|------|-----|
| **Max 3 different attempts** | After that, you need more info or user guidance |
| **Different ≠ retry** | Retry = same thing again; Different = new strategy |
| **Diagnose first** | Don't fix symptoms, fix root cause |
| **Verify before continuing** | One-time fix isn't enough; it must be durable |
| **Report what was tried** | Helps user understand the problem scope |

## The 4-Step Loop

1. **Diagnose** — read the full error, identify root cause (not symptom)
2. **Adjust** — try a different strategy, not the same thing again
3. **Verify** — confirm the fix works and doesn't break anything else
4. **Loop or Escalate** — if 3 different approaches fail, stop and escalate with what was tried

## Escalation Patterns

Escalate when:
- Same error after 3 different fixes → env issue or missing context
- Different errors each attempt → system instability
- Can't identify root cause → need more visibility
- User's decision required → can't guess

## Evidence
- Applied across multiple debugging sessions in ai-dlc and agent-memory work
