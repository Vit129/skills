---
name: performance-testing
description: >
  This skill should be used when the user asks to "load test", "ทำ load test",
  "stress test", "ทำ stress test", "performance test", "ทดสอบ performance",
  "k6", "write k6 script", "เขียน k6 script", "test API under load", "ทดสอบ API ภายใต้ load",
  "check response time", "เช็ค response time", "find bottleneck", "หา bottleneck",
  "simulate concurrent users", "จำลอง concurrent users",
  "spike test", "soak test", or needs to validate system performance before release.
version: 1.1.0
last_improved: 2026-06-01
improvement_count: 1
---

# Performance Testing

## AIDLC Gate

⚠️ If this skill is triggered as part of a coding/QA task:
- AIDLC governance MUST be active (`agent-memory/plans/[feature]/plan.md` must exist)
- If not → STOP and route to `aidlc` first
- Exception: pure investigation/analysis (no code changes) can proceed without AIDLC


Load and performance testing with K6 — script, run, analyze, integrate into CI/CD.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "write k6 script", "load test API", "simulate users", "test endpoint" | `references/k6-scripting.md` |
| "run in CI", "GitHub Actions k6", "performance gate", "threshold" | `references/ci-integration.md` |
| "analyze results", "p95", "p99", "error rate", "grafana" | `references/analysis.md` |
| "frontend performance", "Core Web Vitals", "LCP", "bundle size", "lazy load", "Chrome DevTools frontend", "resource waterfall" | `references/frontend-performance.md` |
| "database performance", "slow query", "index", "connection pool", "EXPLAIN" | `references/database-performance.md` |
| "mobile performance", "app startup", "memory leak", "frame rate", "jank" | `references/mobile-performance.md` |
| "backend performance", "API response time", "per-endpoint", "E2E flow timing", "Chrome DevTools API", "curl timing", "profile API" | `references/backend-performance.md` |

- **K6 Scripting** — Write load test scripts: scenarios, thresholds, checks, data parameterization. (Read `references/k6-scripting.md`)
- **CI Integration** — Run K6 in GitHub Actions / Azure DevOps with performance gates. (Read `references/ci-integration.md`)
- **Analysis** — Interpret results: p95/p99 latency, error rate, throughput, Grafana dashboards. (Read `references/analysis.md`)
- **Frontend Performance** — Core Web Vitals, Chrome DevTools MCP trace, bundle optimization, render performance, API waterfall จาก browser. (Read `references/frontend-performance.md`)
- **Backend Performance** — API response time, per-endpoint profiling, E2E flow timing, Chrome DevTools MCP + curl + k6. (Read `references/backend-performance.md`)

## Inline Process

1. **Define test scope** — Identify endpoints/flows to test. Include auth, search, file uploads — not just the "main" endpoint. Determine test type: Smoke, Load, Stress, Spike, or Soak.
2. **Write k6 script** — Use `setup()` for dynamic auth → define scenarios with ramping VUs → add `thresholds` block (p95, p99, error_rate) → parameterize test data from CSV/JSON.
3. **Add performance gates** — Thresholds ARE the test: `http_req_duration: ['p(95)<500', 'p(99)<1000']`, `http_req_failed: ['rate<0.01']`. K6 exits code 99 on failure.
4. **Run locally first** — Smoke test with 1-2 VUs to verify script works before scaling.
5. **Integrate into CI** — Configure pipeline with k6 step. Performance gates prevent regressions from reaching production.
6. **Analyze results** — Interpret p95/p99, error rate, throughput. Compare against baseline or SLA targets.
7. **Verify** — Thresholds exist, scenarios use ramping VUs, auth is dynamic, CI configured, results compared against baseline, analysis report produced.

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

---


## Consistency Contract

> These steps MUST execute in the same order every time this skill runs.
> Output may vary, but the workflow is fixed.
> If any step is skipped without a documented skip condition, the session-save hook will flag this skill.

## Verification

Before declaring performance testing complete, confirm:

- [ ] k6 script has `thresholds` block (p95, p99, error_rate)
- [ ] Scenarios use ramping VUs (not fixed count)
- [ ] Auth tokens generated dynamically in `setup()` (not hardcoded)
- [ ] CI pipeline config exists (not just local runs)
- [ ] Results compared against baseline or SLA targets
- [ ] Analysis report produced (p95/p99/error rate/throughput interpreted)


---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| k6 / Artillery documentation | Tool reference | Script syntax, scenarios, thresholds |
| Target SLAs (p95, p99, error rate) | Performance criteria | Define pass/fail thresholds |
| Infrastructure specs (server capacity, limits) | System context | Inform realistic load levels |
| `references/*.md` (one per phase) | Skill reference | Scripting, CI integration, analysis |
| `knowledge/lessons/` | Lessons learnt | Check before execute |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After test plan (scope + thresholds) | Checkbox (confirm endpoints + SLAs) | Before writing k6 scripts |
| After baseline results | Single select (acceptable / needs tuning / investigate) | After first successful load test run |
| After analysis report | Open field | Before declaring performance testing complete |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.

## Self-Learning

After user approves the output:

1. **Record good example:** Save approved output to `knowledge/lessons/qa-performance/{pattern}.md`
2. **Record failures:** If output was rejected → note what went wrong for next time
3. **Progressive update:** If a new pattern proved effective → append to relevant knowledge index
4. **Confidence tracking:** `confidence: 1.0` (user-approved) vs `confidence: 0.7` (auto-generated)

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
