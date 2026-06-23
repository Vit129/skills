# Robot Framework Code Review

Static code audit checklist — run BEFORE executing mobile tests.
MUST read `robotframework-rules` skill first to know the full standards.

## When to Use

- After writing/generating Robot + Python code (before first run)
- After healing loop fixes (verify fix quality)
- PR review for test code changes

## Review Process

1. Load standards: `robotframework-rules/references/rf-coding-standards.md` + `android.md` or `ios.md`
2. Check every file against checklist below
3. Output review report
4. If NEEDS_FIX + autoFixable → fix immediately, re-review
5. If APPROVED → proceed to execution

## Checklist

### Structure & Naming
- [ ] Test case names: `[TC-xxx] Descriptive Name` with scenario ID
- [ ] Tags: `Scenario:Success`, `Scenario:Error`, `Priority:High`
- [ ] AAA pattern in keywords: Arrange → Act → Assert sections
- [ ] One .robot file per feature — not one giant file
- [ ] File naming: `camelCase.robot` for test files, `camelCasePage.robot` for pages

### Locators (Critical — Mobile)
- [ ] Priority: `accessibility_id` > `id` > `xpath` (last resort)
- [ ] Identical naming across Android and iOS for shared keywords
- [ ] No hardcoded coordinates or pixel-based locators
- [ ] Locators in variables section or page object — not inline in test cases
- [ ] Platform-specific locators wrapped in IF/ELSE or separate page files

### Appium Configuration
- [ ] Desired capabilities in YAML or variables — not hardcoded
- [ ] Implicit wait configured — no `Sleep` keywords
- [ ] App lifecycle: install/launch/close handled in Suite Setup/Teardown

### Database (if applicable)
- [ ] Python DB service class — not raw SQL in .robot files
- [ ] Seed/verify/cleanup pattern: beforeAll → test → afterAll
- [ ] Connection config from environment variables

### Keywords Quality
- [ ] Keywords are reusable — not copy-pasted across files
- [ ] Arguments have default values where sensible
- [ ] Return values documented with `[Return]` or `RETURN`
- [ ] No `Sleep` — use explicit waits (`Wait Until Element Is Visible`)
- [ ] Keyword names identical across Android/iOS for dual-platform support

### Expert Gems (Advanced)
- [ ] API Hybrid Setup: use API calls for preconditions instead of UI navigation
- [ ] Self-healing logs: descriptive action logging for healer to understand intent
- [ ] YAML fixtures for test data — not hardcoded in test cases
- [ ] Secret variables for sensitive data (RF 7.4+)

### Code Quality
- [ ] Docstrings on custom Python keywords
- [ ] No commented-out test cases
- [ ] No TODO without ticket reference
- [ ] Variables section organized: locators → test data → config

## Review Report Format

```markdown
### 🔍 Robot Framework Code Review
- Status: APPROVED ✅ / NEEDS FIX ⚠️
- Files Reviewed: {N}
- Platform: Android / iOS

| Severity | File | Issue | Fix |
|----------|------|-------|-----|
| 🔴 High | login.robot | Missing [TC-xxx] prefix | Add scenario ID |
| 🔴 High | commonPage.robot | Hardcoded locator | Use accessibility_id |
| 🟡 Med | payment.robot | Missing Scenario tag | Add Scenario:Success |
| 🟢 Low | keywords.py | Missing docstring | Add description |

Auto-Fixable: {Y/N}
Critical Blockers: {N}
```

## Severity Guide

| Severity | Criteria | Action |
|----------|----------|--------|
| 🔴 High | Wrong locator strategy, missing TC-ID, platform mismatch | Must fix before run |
| 🟡 Medium | Missing tags, no YAML fixtures, Sleep usage | Fix before PR |
| 🟢 Low | Missing docstrings, variable ordering | Fix when convenient |
