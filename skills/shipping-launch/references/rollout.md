# Feature Flags and Staged Rollout

## Feature Flag Lifecycle

```typescript
const flags = await getFeatureFlags(userId);
if (flags.newFeature) {
  return <NewFeaturePanel />;
}
return null; // existing behavior
```

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

## Rollout Decision Thresholds

| Metric | Advance ✅ | Hold ⚠️ | Roll Back 🚨 |
|--------|-----------|---------|-------------|
| Error rate | Within 10% of baseline | 10-100% above | >2x baseline |
| P95 latency | Within 20% of baseline | 20-50% above | >50% above |
| Client JS errors | No new types | New at <0.1% sessions | New at >0.1% |
| Business metrics | Neutral or positive | Decline <5% | Decline >5% |
