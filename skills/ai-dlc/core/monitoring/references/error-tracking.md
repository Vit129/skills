# Error Tracking

Capture, group, and alert on runtime exceptions.

## What to Capture

- Unhandled exceptions and promise rejections
- HTTP 5xx responses
- Failed background jobs / cron tasks
- Client-side JS errors

## Node.js — Global Error Handlers

```javascript
process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught exception')
  process.exit(1) // Always exit — state is unknown
})

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled promise rejection')
})
```

## Express — Error Middleware

```javascript
// Must be LAST middleware, after all routes
app.use((err, req, res, next) => {
  logger.error({
    err,
    requestId: req.requestId,
    method: req.method,
    path: req.path,
    statusCode: err.statusCode || 500
  }, 'Request error')

  res.status(err.statusCode || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal error' : err.message
  })
})
```

## Error Grouping Strategy

Group errors by: `(error type) + (file:line) + (message pattern)`
- Same error from different users = 1 group
- Same error from different environments = separate groups
- Resolved errors should auto-reopen if they recur

## Error Severity Tiers

- **P1 Critical** — Data loss, security breach, entire service down → page on-call immediately
- **P2 High** — Core feature broken for many users → alert within 5 min
- **P3 Medium** — Feature degraded, workaround exists → alert within 1 hour
- **P4 Low** — Minor issue, low user impact → next business day

## Fingerprinting (deduplicate errors)

```javascript
// Custom fingerprint to avoid noise
function getErrorFingerprint(err) {
  return [
    err.name,                        // TypeError
    err.message.replace(/\d+/g, 'N'), // normalize IDs/numbers
    err.stack?.split('\n')[1]         // first stack frame
  ].join('|')
}
```
