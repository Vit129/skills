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

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "I'll write the k6 script without defining thresholds — we'll add them later" | Thresholds ARE the test. A k6 script without thresholds is just a load generator with no pass/fail criteria. Without them, CI integration is impossible and results are meaningless. |
| "I'll skip CI integration — we can run k6 locally" | Local runs are for development. Performance gates in CI prevent regressions from reaching production. Without CI integration, performance testing is a one-time activity, not continuous. |
| "The p95 looks fine so I won't analyze p99 or error rate" | p95 hides the worst 5% of user experiences. p99 + error rate under load reveal the actual breaking point. Reporting only p95 gives false confidence. |
| "I'll just test the main endpoint — the others are simple" | Bottlenecks hide in unexpected places (auth token refresh, file uploads, search queries). Test all endpoints that users hit in a realistic scenario, not just the "main" one. |
| "I'll use a fixed number of virtual users instead of ramping scenarios" | Fixed VU count doesn't simulate real traffic patterns (ramp-up, sustained, spike). Without scenarios, you can't identify at what load the system degrades. |

---

## Red Flags

- 🚩 k6 script has no `thresholds` block → Script will never fail in CI; add p95, p99, and error_rate thresholds before integrating.
- 🚩 Test runs only once locally with no CI pipeline config → Performance testing is not automated; load `ci-integration.md` and set up the pipeline.
- 🚩 Results reported without comparing against baseline → Numbers without context are meaningless; always compare against previous run or SLA targets.
- 🚩 Load test uses hardcoded auth tokens → Tokens expire; use k6's `setup()` function to authenticate dynamically before test execution.
- 🚩 Analysis section missing but agent declared "performance testing done" → Running the test is half the job; load `analysis.md` and interpret p95/p99/error rate/throughput.
