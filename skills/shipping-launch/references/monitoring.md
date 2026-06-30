# Monitoring Setup

## What to Monitor

```
Application:
├── Error rate (total + by endpoint)
├── Response time (p50, p95, p99)
├── Request volume
└── Key business metrics

Infrastructure:
├── CPU + memory utilization
├── DB connection pool usage
├── Disk space
└── Queue depth

Client (if frontend):
├── Core Web Vitals (LCP, INP, CLS)
├── JavaScript errors
└── API errors from client perspective
```

## First Hour Protocol

- [ ] Health endpoint returns 200
- [ ] Error monitoring — no new error types
- [ ] Latency dashboard — no regression
- [ ] Test critical user flow manually
- [ ] Verify logs are flowing
- [ ] Confirm rollback mechanism works
