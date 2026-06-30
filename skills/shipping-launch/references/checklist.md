# Pre-Launch Checklist

## Code Quality
- [ ] All tests pass (unit, integration, e2e)
- [ ] Build succeeds with no warnings
- [ ] Lint and type checking pass
- [ ] Code reviewed and approved
- [ ] No TODO comments that should be resolved
- [ ] No debug statements in production code
- [ ] Error handling covers expected failure modes

## Security
- [ ] No secrets in code or VCS
- [ ] `npm audit` — no critical/high vulnerabilities
- [ ] Input validation on all user-facing endpoints
- [ ] Auth/authz checks in place
- [ ] Security headers configured
- [ ] Rate limiting on auth endpoints
- [ ] CORS restricted to specific origins

## Performance
- [ ] No N+1 queries in critical paths
- [ ] Database queries have appropriate indexes
- [ ] Caching configured for static assets
- [ ] Bundle size within budget (if frontend)
- [ ] API response time < 200ms (p95)

## Infrastructure
- [ ] Environment variables set in production
- [ ] Database migrations applied (or ready)
- [ ] Logging and error reporting configured
- [ ] Health check endpoint exists and responds
- [ ] DNS and SSL configured

## Documentation
- [ ] README updated with new setup requirements
- [ ] API documentation current
- [ ] Changelog updated
- [ ] ADRs written for architectural decisions
