---
name: shipping-launch
description: Pre-launch checklist, staged rollout, feature flags, rollback strategy, and monitoring setup. Use when preparing to deploy to production.
---

# Shipping and Launch

## Overview

Ship with confidence. Deploy safely with monitoring in place, rollback plan ready, and clear success criteria. Every launch should be reversible, observable, and incremental.

## When to Use

- Deploying a feature to production for the first time
- Releasing a significant change to users
- Migrating data or infrastructure
- Any deployment that carries risk

## Pre-Launch Checklist

### Code Quality
- [ ] All tests pass (unit, integration, e2e)
- [ ] Build succeeds with no warnings
- [ ] Lint and type checking pass
- [ ] Code reviewed and approved
- [ ] No TODO comments that should be resolved
- [ ] No debug statements in production code
- [ ] Error handling covers expected failure modes

### Security
- [ ] No secrets in code or VCS
- [ ] `npm audit` — no critical/high vulnerabilities
- [ ] Input validation on all user-facing endpoints
- [ ] Auth/authz checks in place
- [ ] Security headers configured
- [ ] Rate limiting on auth endpoints
- [ ] CORS restricted to specific origins

### Performance
- [ ] No N+1 queries in critical paths
- [ ] Database queries have appropriate indexes
- [ ] Caching configured for static assets
- [ ] Bundle size within budget (if frontend)
- [ ] API response time < 200ms (p95)

### Infrastructure
- [ ] Environment variables set in production
- [ ] Database migrations applied (or ready)
- [ ] Logging and error reporting configured
- [ ] Health check endpoint exists and responds
- [ ] DNS and SSL configured

### Documentation
- [ ] README updated with new setup requirements
- [ ] API documentation current
- [ ] Changelog updated
- [ ] ADRs written for architectural decisions

## Feature Flag Strategy

```typescript
const flags = await getFeatureFlags(userId);
if (flags.newFeature) {
  return <NewFeaturePanel />;
}
return null; // existing behavior
```

**Lifecycle:**
```
1. DEPLOY with flag OFF     → Code in production but inactive
2. ENABLE for team/beta     → Internal testing in production
3. GRADUAL ROLLOUT          → 5% → 25% → 50% → 100%
4. MONITOR at each stage    → Error rates, performance, feedback
5. CLEAN UP                 → Remove flag + dead code within 2 weeks
```

**Rules:**
- Every flag has an owner and expiration date
- Clean up within 2 weeks of full rollout
- Don't nest flags (exponential combinations)
- Test both states (on/off) in CI

## Staged Rollout

```
1. DEPLOY to staging
   └── Full test suite + manual smoke test

2. DEPLOY to production (flag OFF)
   └── Health check passes, no new errors

3. ENABLE for team (internal users)
   └── 24-hour monitoring window

4. CANARY (5% of users)
   └── 24-48 hour monitoring
   └── Compare: canary vs baseline

5. GRADUAL (25% → 50% → 100%)
   └── Same monitoring at each step
   └── Can roll back to previous % at any point

6. FULL rollout
   └── Monitor 1 week → clean up flag
```

### Rollout Decision Thresholds

| Metric | Advance ✅ | Hold ⚠️ | Roll Back 🚨 |
|--------|-----------|---------|-------------|
| Error rate | Within 10% of baseline | 10-100% above | >2x baseline |
| P95 latency | Within 20% of baseline | 20-50% above | >50% above |
| Client JS errors | No new types | New at <0.1% sessions | New at >0.1% |
| Business metrics | Neutral or positive | Decline <5% | Decline >5% |

## Rollback Strategy

**Every deployment needs a rollback plan BEFORE it happens:**

```markdown
## Rollback Plan for [Feature]

### Trigger Conditions
- Error rate > 2x baseline
- P95 latency > [X]ms
- User reports of [specific issue]

### Rollback Steps
1. Disable feature flag (< 1 minute)
   OR
1. Deploy previous version: `git revert <commit> && git push`
2. Verify: health check + error monitoring
3. Notify team of rollback

### Time to Rollback
- Feature flag: < 1 minute
- Redeploy previous version: < 5 minutes
- Database rollback: < 15 minutes
```

**Roll back immediately if:**
- Error rate > 2x baseline
- P95 latency > 50% above baseline
- User-reported issues spike
- Data integrity issues detected
- Security vulnerability discovered

## Monitoring Setup

### What to Monitor

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

### Post-Launch Verification (First Hour)

```
1. Health endpoint returns 200
2. Error monitoring — no new error types
3. Latency dashboard — no regression
4. Test critical user flow manually
5. Verify logs are flowing
6. Confirm rollback mechanism works
```

## Anti-Rationalization

| Excuse | Rebuttal |
|--------|----------|
| "It works in staging" | Production has different data, traffic, edge cases. Monitor after deploy. |
| "We don't need feature flags" | Every feature benefits from a kill switch. Even "simple" changes break things. |
| "Monitoring is overhead" | Without monitoring, you discover problems from user complaints. |
| "We'll add monitoring later" | Add before launch. Can't debug what you can't see. |
| "Rolling back is admitting failure" | Rolling back is responsible engineering. Shipping broken is the failure. |
| "It's Friday, let's ship" | Never deploy on Friday afternoon. Monday gives you a full team to respond. |

## Red Flags

- Deploying without a rollback plan
- No monitoring or error reporting in production
- Big-bang releases (everything at once)
- Feature flags with no expiration or owner
- No one monitoring the deploy for the first hour
- Production config done by memory, not code

## Verification

**Before deploying:**
- [ ] Pre-launch checklist completed (all sections)
- [ ] Feature flag configured (if applicable)
- [ ] Rollback plan documented
- [ ] Monitoring dashboards set up
- [ ] Team notified of deployment

**After deploying:**
- [ ] Health check returns 200
- [ ] Error rate is normal
- [ ] Latency is normal
- [ ] Critical user flow works
- [ ] Logs are flowing
- [ ] Rollback verified ready
