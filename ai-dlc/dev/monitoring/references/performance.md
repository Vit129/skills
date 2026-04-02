# Performance Monitoring

Measure latency, identify bottlenecks, and set SLO baselines.

## Key Metrics to Track

- **Latency** — p50, p95, p99 response times (not just average)
- **Throughput** — Requests per second, jobs per minute
- **Error rate** — % of requests returning 5xx
- **Saturation** — CPU %, memory %, queue depth

## SLO Basics (Service Level Objectives)

Define before you alert — measure first, then set thresholds.

```
Example SLOs:
- 99% of API requests complete in < 500ms (p99 < 500ms)
- Error rate < 0.1% over any 5-minute window
- Availability > 99.9% per month (< 43 min downtime)
```

## Node.js — Simple Request Timer

```javascript
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info({
      method: req.method,
      path: req.route?.path || req.path,
      statusCode: res.statusCode,
      durationMs: duration,
      slow: duration > 1000
    }, 'Request completed')
  })
  next()
})
```

## Database Query Performance

```javascript
// Log slow queries
const SLOW_QUERY_THRESHOLD_MS = 200

async function query(sql, params) {
  const start = Date.now()
  const result = await db.query(sql, params)
  const duration = Date.now() - start

  if (duration > SLOW_QUERY_THRESHOLD_MS) {
    logger.warn({ sql, durationMs: duration }, 'Slow query detected')
  }
  return result
}
```

## Frontend Performance (Web Vitals)

```javascript
// Core Web Vitals
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals'

function sendMetric({ name, value, rating }) {
  fetch('/api/metrics', {
    method: 'POST',
    body: JSON.stringify({ metric: name, value, rating })
  })
}

onCLS(sendMetric)   // Cumulative Layout Shift (< 0.1 = good)
onLCP(sendMetric)   // Largest Contentful Paint (< 2.5s = good)
onFID(sendMetric)   // First Input Delay (< 100ms = good)
```

## Profiling Checklist

1. Measure baseline BEFORE optimizing — no gut-feel changes
2. Profile p95/p99, not just average (averages hide tail latency)
3. Identify the ONE biggest bottleneck, fix it, re-measure
4. Common culprits: N+1 queries, missing DB indexes, unoptimized loops, large bundles
