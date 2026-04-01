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

- **Logging** — Structured logging setup, log levels, correlation IDs. (Read `references/logging.md`)
- **Error Tracking** — Capture, group, and alert on runtime exceptions. (Read `references/error-tracking.md`)
- **Performance** — Measure latency, identify bottlenecks, set SLO/SLA baselines. (Read `references/performance.md`)
- **Alerts** — Define alert thresholds and notification routing. (Read `references/alerts.md`)
- **Tracing** — Track request flow across multiple services, find bottlenecks in call chains. (Read `references/tracing.md`) — use only when system has 2+ services

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
