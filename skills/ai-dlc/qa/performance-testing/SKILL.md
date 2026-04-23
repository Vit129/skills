---
name: performance-testing
description: >
  This skill should be used when the user asks to "load test", "ทำ load test",
  "stress test", "ทำ stress test", "performance test", "ทดสอบ performance",
  "k6", "write k6 script", "เขียน k6 script", "test API under load", "ทดสอบ API ภายใต้ load",
  "check response time", "เช็ค response time", "find bottleneck", "หา bottleneck",
  "simulate concurrent users", "จำลอง concurrent users",
  "spike test", "soak test", or needs to validate system performance before release.
---

# Performance Testing

Load and performance testing with K6 — script, run, analyze, integrate into CI/CD.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "write k6 script", "load test API", "simulate users", "test endpoint" | `references/k6-scripting.md` |
| "run in CI", "GitHub Actions k6", "performance gate", "threshold" | `references/ci-integration.md` |
| "analyze results", "p95", "p99", "error rate", "grafana" | `references/analysis.md` |

- **K6 Scripting** — Write load test scripts: scenarios, thresholds, checks, data parameterization. (Read `references/k6-scripting.md`)
- **CI Integration** — Run K6 in GitHub Actions / Azure DevOps with performance gates. (Read `references/ci-integration.md`)
- **Analysis** — Interpret results: p95/p99 latency, error rate, throughput, Grafana dashboards. (Read `references/analysis.md`)
