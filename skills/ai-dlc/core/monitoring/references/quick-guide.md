# Monitoring Quick Guide

## The Three Pillars

- **Logs** — What happened (events, errors, audit trail)
- **Metrics** — How often / how much (counters, histograms, gauges)
- **Traces** — Where time was spent (request path across services)

## Quick Decision Guide

| Problem | Use |
|---------|-----|
| "Something broke but I don't know where" | Logs + Error Tracking |
| "It's slow but I don't know why" | Performance → Tracing (if multi-service) |
| "I want to be alerted when errors spike" | Metrics + Alerts |
| "I need to audit who did what" | Structured Logs with correlation IDs |
| "Request goes through 3 services, where's the delay?" | Tracing |

## Rules

- Log at the right level: ERROR for actionable, WARN for degraded, INFO for lifecycle, DEBUG for dev
- Never log PII (passwords, tokens, personal data)
- Always include `requestId` / `correlationId` for traceability
- Set alert thresholds based on baseline, not gut feel — measure first
