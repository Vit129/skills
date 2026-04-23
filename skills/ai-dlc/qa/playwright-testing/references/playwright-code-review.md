# Playwright Code Review

Static code audit checklist — run BEFORE executing tests.
MUST read `ai-dlc/rules/playwright-rules/` skill first to know the full standards.

## When to Use

- After writing/generating test code (before first run)
- After healing loop fixes (verify fix quality)
- PR review for test code changes

## Review Process

1. Load standards: `ai-dlc/rules/playwright-rules/references/coding-standards.md` + `api.md` or `web-ui.md`
2. Check every file against checklist below
3. Output review report
4. If NEEDS_FIX + autoFixable → fix immediately, re-review
5. If APPROVED → proceed to execution

## Checklist

### Structure & Naming
- [ ] AAA pattern: `// Arrange`, `// Act`, `// Assert` comments in every test
- [ ] Test names: `test('[TS-xxx] descriptive name')` with scenario ID
- [ ] Tags: `@tag` annotations for filtering (smoke, regression, feature)
- [ ] One spec file per feature/endpoint — not one giant file
- [ ] File naming: `kebab-case.spec.ts`

### Locators (Critical)
- [ ] Primary: `getByTestId` for scoping containers
- [ ] Secondary: `getByRole` + `getByLabel` for semantic elements
- [ ] Hybrid: `getByTestId('container').getByRole('button', { name: L.key })`
- [ ] Labels from `Labels.ts` — never hardcoded Thai/English text
- [ ] No CSS selectors, no XPath, no `nth()` without filter
- [ ] No `page.locator('.class-name')` — use semantic locators

### API Tests (if applicable)
- [ ] Request/response types defined
- [ ] Status code assertions: `expect(response.status()).toBe(200)`
- [ ] Response body validation: check required fields, not entire object
- [ ] Auth token handling via fixture or helper — not inline

### Web UI Tests (if applicable)
- [ ] `waitForLoadState` or auto-wait — no `page.waitForTimeout()`
- [ ] No `Sleep` or hardcoded delays
- [ ] Form interactions: fill → verify → submit → assert result
- [ ] Navigation: verify URL or page element after navigation

### Database (if applicable)
- [ ] Seed before test, verify after action, cleanup in afterAll
- [ ] DB methods in service class — not raw SQL in spec files
- [ ] Connection config from env — not hardcoded

### Performance & Reliability
- [ ] No flaky patterns: no race conditions, no timing-dependent assertions
- [ ] Retry logic for known flaky external dependencies
- [ ] Parallel-safe: tests don't share mutable state
- [ ] Timeout configured per test if needed (not global override)

### Code Quality
- [ ] JSDoc/TSDoc comments on helper functions (Thai description OK)
- [ ] No console.log — use test.info() or custom logger
- [ ] No commented-out code
- [ ] No TODO without ticket reference
- [ ] Import order: playwright → helpers → fixtures → constants

## Review Report Format

```markdown
### 🔍 Playwright Code Review
- Status: APPROVED ✅ / NEEDS FIX ⚠️
- Files Reviewed: {N}
- Mode: API / Web UI

| Severity | File | Line | Issue | Fix |
|----------|------|------|-------|-----|
| 🔴 High | login.spec.ts | 15 | Missing AAA | Add Arrange/Act/Assert comments |
| 🟡 Med | order.spec.ts | 30 | Hardcoded label | Use Labels.ts |
| 🟢 Low | helper.ts | 45 | Missing JSDoc | Add description |

Auto-Fixable: {Y/N}
Critical Blockers: {N}
```

## Severity Guide

| Severity | Criteria | Action |
|----------|----------|--------|
| 🔴 High | Breaks tests, wrong locator strategy, missing assertions | Must fix before run |
| 🟡 Medium | Style violation, missing tags, suboptimal pattern | Fix before PR |
| 🟢 Low | Missing comments, import order, naming nitpick | Fix when convenient |
