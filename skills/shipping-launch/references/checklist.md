# Pre-Launch Checklist

Items a competent AI already handles unprompted (tests/build/lint pass, no secrets,
no debug leftovers, input validation, N+1 queries, `npm audit`) are omitted —
this covers only what needs an explicit human/ops decision or number.

## Security
- [ ] Security headers configured
- [ ] Rate limiting on auth endpoints

## Performance
- [ ] Bundle size within budget (if frontend)
- [ ] API response time target defined and met (e.g. p95 < 200ms)

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
