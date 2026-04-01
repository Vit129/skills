# Distributed Tracing

Track request flow across multiple services to find where time is spent.

## When to use tracing
- System has 2+ services communicating (API → DB service, API → queue → worker, etc.)
- A request is slow but logs don't show where
- You need to visualize the full call chain end-to-end

## Core Concepts

```
Trace  = one full request journey (has a traceId)
Span   = one hop in that journey (has spanId, parentSpanId, start/end time)
Context propagation = passing traceId/spanId across service boundaries via headers
```

## Node.js — Manual Tracing (without vendor SDK)

```javascript
// Simple trace context propagation via HTTP headers
const { randomUUID } = require('crypto')

// Outgoing request — pass trace context
async function callService(url, body, traceContext) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-trace-id': traceContext.traceId,
      'x-span-id': randomUUID(),           // new span for this hop
      'x-parent-span-id': traceContext.spanId
    },
    body: JSON.stringify(body)
  })
}

// Incoming request — extract trace context
app.use((req, res, next) => {
  req.traceContext = {
    traceId: req.headers['x-trace-id'] || randomUUID(),
    spanId: randomUUID(),
    parentSpanId: req.headers['x-span-id'] || null
  }
  next()
})
```

## Span Timing Pattern

```javascript
async function tracedOperation(name, traceContext, fn) {
  const start = Date.now()
  let status = 'ok'
  try {
    return await fn()
  } catch (err) {
    status = 'error'
    throw err
  } finally {
    logger.info({
      type: 'span',
      name,
      traceId: traceContext.traceId,
      spanId: traceContext.spanId,
      parentSpanId: traceContext.parentSpanId,
      durationMs: Date.now() - start,
      status
    })
  }
}

// Usage
const result = await tracedOperation('db.getUser', req.traceContext, () =>
  db.query('SELECT * FROM users WHERE id = ?', [userId])
)
```

## What to Instrument

- Every external HTTP call (fetch, axios)
- Every DB query that takes > 50ms
- Every queue publish/consume
- Every cache hit/miss
- Auth/token validation

## When You Don't Need Tracing

- Single service with no inter-service calls → use logging + performance.md instead
- Monolith where all DB calls are local → query timing in performance.md is enough
- Tracing adds overhead — only add it when logs can't answer "where is the time going?"

## Reading a Trace

```
traceId: abc-123
├── span: api.handleRequest      0ms → 450ms  (total)
│   ├── span: auth.validate      0ms → 12ms
│   ├── span: db.getUser        15ms → 85ms
│   ├── span: cache.get         88ms → 90ms   ← cache hit
│   └── span: http.callService  92ms → 440ms  ← bottleneck here
```
Longest span = where to investigate first.
