# Rollback Strategy

Every deployment needs a rollback plan BEFORE it happens.

## Rollback Plan Template

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

## Roll Back Immediately If

- Error rate > 2x baseline
- P95 latency > 50% above baseline
- User-reported issues spike
- Data integrity issues detected
- Security vulnerability discovered

## Post-Deploy Verification

```
1. Health endpoint returns 200
2. Error monitoring — no new error types
3. Latency dashboard — no regression
4. Test critical user flow manually
5. Verify logs are flowing
6. Confirm rollback mechanism works
```
