# Logging

Structured, consistent logging for production systems.

## Log Levels

| Level | When to use | Example |
|-------|-------------|---------|
| ERROR | Something failed and needs action | DB connection lost, unhandled exception |
| WARN  | Degraded but still working | Retry #2/3, cache miss, slow query |
| INFO  | Normal lifecycle events | Server started, user logged in, job completed |
| DEBUG | Dev/troubleshooting only | Variable values, function entry/exit |

## Structured Logging (JSON)

Always log JSON in production — never plain text strings.

```javascript
// Node.js with pino
import pino from 'pino'
const logger = pino({ level: process.env.LOG_LEVEL || 'info' })

logger.info({ requestId, userId, action: 'purchase', amount }, 'Order placed')
logger.error({ err, requestId, orderId }, 'Payment failed')
```

```python
# Python with structlog
import structlog
log = structlog.get_logger()

log.info("order.placed", request_id=request_id, user_id=user_id, amount=amount)
log.error("payment.failed", exc_info=True, order_id=order_id)
```

## Correlation IDs

Every request must carry a correlation ID through all logs.

```javascript
// Express middleware
app.use((req, res, next) => {
  req.requestId = req.headers['x-request-id'] || crypto.randomUUID()
  res.setHeader('x-request-id', req.requestId)
  next()
})
```

## What NOT to Log

- Passwords, API keys, tokens, secrets
- Full credit card numbers, SSNs, PII
- Request bodies that may contain sensitive data (mask or omit)
- High-frequency debug logs in production (use sampling)

## Frontend Logging

```javascript
// Log errors to backend
window.addEventListener('unhandledrejection', (event) => {
  fetch('/api/log', {
    method: 'POST',
    body: JSON.stringify({
      level: 'error',
      message: event.reason?.message,
      stack: event.reason?.stack,
      url: window.location.href,
      timestamp: new Date().toISOString()
    })
  })
})
```
