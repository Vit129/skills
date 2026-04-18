# K6 Results Analysis

Interpret K6 output and make decisions from performance data.

## Key Metrics

| Metric | What it means | Good target |
|--------|--------------|-------------|
| `http_req_duration` | Total request time (send + wait + receive) | p95 < 500ms |
| `http_req_waiting` | Time to first byte (TTFB) — server processing | p95 < 300ms |
| `http_req_failed` | % requests that failed (non-2xx or network error) | < 1% |
| `http_reqs` | Total requests / requests per second | depends on load |
| `vus` | Active virtual users at any point | matches scenario |
| `iterations` | Total script executions | — |
| `checks` | % of `check()` assertions that passed | > 99% |

## Reading K6 Terminal Output

```
✓ status is 200
✓ response time < 500ms

checks.........................: 99.80% ✓ 4990 ✗ 10
data_received..................: 12 MB  400 kB/s
data_sent......................: 2.1 MB 70 kB/s
http_req_blocked...............: avg=1.2ms   min=1µs    med=3µs    max=1.2s   p(90)=5µs    p(95)=8µs
http_req_connecting............: avg=0.8ms   min=0µs    med=0µs    max=800ms  p(90)=0µs    p(95)=0µs
http_req_duration..............: avg=245ms   min=120ms  med=210ms  max=2.1s   p(90)=380ms  p(95)=490ms ✓
  { expected_response:true }...: avg=243ms   min=120ms  med=208ms  max=1.9s   p(90)=375ms  p(95)=485ms
http_req_failed................: 0.20%  ✓ 4990 ✗ 10
http_req_receiving.............: avg=1.1ms   min=50µs   med=0.9ms  max=50ms   p(90)=2ms    p(95)=3ms
http_req_sending...............: avg=0.2ms   min=50µs   med=0.1ms  max=5ms    p(90)=0.3ms  p(95)=0.5ms
http_req_tls_handshaking.......: avg=0.5ms   min=0µs    med=0µs    max=500ms  p(90)=0µs    p(95)=0µs
http_req_waiting...............: avg=244ms   min=119ms  med=209ms  max=2.1s   p(90)=378ms  p(95)=488ms
http_reqs......................: 5000   166.7/s
iteration_duration.............: avg=1.25s   min=1.12s  med=1.21s  max=3.1s   p(90)=1.38s  p(95)=1.49s
iterations.....................: 5000   166.7/s
vus............................: 10     min=10     max=10
vus_max........................: 10     min=10     max=10
```

**Reading this:**
- `p(95)=490ms` — 95% of requests completed in under 490ms ✅ (threshold was 500ms)
- `http_req_failed: 0.20%` — 10 out of 5000 requests failed ✅ (threshold was 1%)
- `avg=245ms` — average is misleading if there are outliers — always use p95/p99

## JSON Output Analysis

```bash
# Run with JSON output
k6 run --out json=results.json script.js

# Quick summary with jq
cat results.json | jq 'select(.type=="Point" and .metric=="http_req_duration") | .data.value' \
  | awk '{sum+=$1; count++} END {print "avg:", sum/count, "ms"}'
```

## Identifying Bottlenecks

```
High http_req_waiting (TTFB)  → Server-side slow (DB query, computation)
High http_req_connecting      → Connection pool exhausted or DNS slow
High http_req_tls_handshaking → TLS overhead (consider connection reuse)
High http_req_receiving       → Large response payload (consider pagination/compression)
Errors spike at N VUs         → Concurrency limit found — that's your breaking point
```

## Trend Analysis (Compare Runs)

```javascript
// results-compare.js — simple comparison
const baseline = require('./baseline-results.json')
const current  = require('./current-results.json')

const baseP95 = getP95(baseline)
const currP95 = getP95(current)
const regression = ((currP95 - baseP95) / baseP95) * 100

if (regression > 10) {
  console.error(`❌ Performance regression: p95 increased by ${regression.toFixed(1)}%`)
  process.exit(1)
}
console.log(`✅ p95: ${baseP95}ms → ${currP95}ms (${regression.toFixed(1)}% change)`)
```

## Grafana Dashboard (Local)

```yaml
# docker-compose.yml — local Grafana + InfluxDB for K6
version: '3'
services:
  influxdb:
    image: influxdb:1.8
    ports: ['8086:8086']
    environment:
      INFLUXDB_DB: k6

  grafana:
    image: grafana/grafana:latest
    ports: ['3000:3000']
    environment:
      GF_AUTH_ANONYMOUS_ENABLED: 'true'
    volumes:
      - ./grafana:/etc/grafana/provisioning
```

```bash
# Stream K6 results to InfluxDB
k6 run --out influxdb=http://localhost:8086/k6 script.js
```

## Decision Framework

| Result | Action |
|--------|--------|
| All thresholds pass | ✅ Release approved |
| p95 > threshold by < 20% | ⚠️ Investigate — may be environment noise |
| p95 > threshold by > 20% | ❌ Block release — performance regression |
| Error rate > 1% | ❌ Block release — reliability issue |
| Errors only at high VUs | ⚠️ Document capacity limit — plan scaling |
| Gradual degradation in soak | ❌ Memory leak suspected — investigate |
