# /ship — Deploy with confidence

Route to `ai-dlc/dev/shipping-launch/`.

## Instructions

1. Read `ai-dlc/dev/shipping-launch/SKILL.md`
2. Run pre-launch checklist:
   - Code Quality: tests pass, build succeeds, lint clean, reviewed
   - Security: no secrets, audit clean, auth in place, headers configured
   - Performance: no N+1, indexes exist, caching configured
   - Infrastructure: env vars set, migrations ready, health check exists
   - Documentation: README updated, changelog updated
3. If any checklist item fails → report what's missing, don't proceed
4. If all pass → guide through:
   - Feature flag setup (if applicable)
   - Staged rollout plan (canary → gradual → full)
   - Rollback strategy documented
   - Monitoring configured
5. Optionally fan-out `/review` (all 3 personas) as final gate

## Prerequisites

- Feature is complete (all tasks done)
- Tests pass
- Code reviewed

## Done When

- Pre-launch checklist all green
- Rollback plan documented
- Deployment executed (or ready to execute)
- Post-launch verification passed
