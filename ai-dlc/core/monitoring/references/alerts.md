# Alerts

Define thresholds and route notifications to the right people.

## Alert Design Principles

- Every alert must be **actionable** — if you can't act on it, it's noise
- Alert on **symptoms** (user-facing impact), not causes (CPU high)
- Set thresholds from **measured baselines**, not guesses
- Route to the right person — don't blast the whole team

## Alert Severity Levels

```
P1 — Page on-call NOW (production down, data loss, security breach)
P2 — Alert within 5 minutes (core feature broken)
P3 — Alert within 1 hour (degraded, workaround exists)
P4 — Next business day (low impact, informational)
```

## Common Alert Thresholds

```yaml
# Error rate
- alert: HighErrorRate
  condition: error_rate_5m > 1%
  severity: P2

# Latency
- alert: SlowResponses
  condition: p99_latency > 2000ms
  severity: P3

# Availability
- alert: ServiceDown
  condition: health_check_failures >= 3
  severity: P1

# Queue depth
- alert: QueueBacklog
  condition: queue_depth > 1000
  severity: P3
```

## GitHub Actions Alert Example

```yaml
on:
  workflow_run:
    workflows: ["CI"]
    types: [completed]

jobs:
  notify:
    if: ${{ github.event.workflow_run.conclusion == 'failure' }}
    runs-on: ubuntu-latest
    steps:
      - name: Send notification
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -d '{"text":"❌ CI failed on ${{ github.event.workflow_run.head_branch }}"}'
```

## On-Call Runbook Template

Every P1/P2 alert should link to a runbook:

```markdown
## Alert: [AlertName]

**Symptom:** What the user sees
**Likely cause:** Most common root cause
**Immediate action:**
1. Check [log query / dashboard link]
2. If [condition] → run [command]
3. If still failing → escalate to [team]

**Rollback:** [command or link to deploy step]
**Post-incident:** Open RCA ticket in [tracker]
```
