---
name: monitoring
description: >
  This skill should be used when the user asks to "add logging", "set up monitoring",
  "debug production issues", "track errors", "add observability", "set up alerts",
  "check why this is slow", "trace a request", or needs runtime visibility into
  application health, performance, or errors in production or staging.
---

# Monitoring & Observability

Add runtime visibility into application health, performance, and errors.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "add logging", "structured logs", "log levels", "correlation ID" | `references/logging.md` |
| "track errors", "capture exceptions", "error alerts" | `references/error-tracking.md` |
| "slow response", "latency", "bottleneck", "SLO/SLA" | `references/performance.md` |
| "set up alerts", "notification routing", "thresholds" | `references/alerts.md` |
| "trace a request", "distributed tracing", "request flow" (2+ services only) | `references/tracing.md` |
| "what should I monitor", "where to start", "observability overview" | `references/quick-guide.md` |

- **Logging** — Structured logging, log levels, correlation IDs. (Read `references/logging.md`)
- **Error Tracking** — Capture, group, alert on exceptions. (Read `references/error-tracking.md`)
- **Performance** — Latency, bottlenecks, SLO/SLA baselines. (Read `references/performance.md`)
- **Alerts** — Thresholds and notification routing. (Read `references/alerts.md`)
- **Tracing** — Request flow across services. (Read `references/tracing.md`)
- **Quick Guide** — Three pillars, decision table, rules. (Read `references/quick-guide.md`)
