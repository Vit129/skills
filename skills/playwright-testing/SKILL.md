---
name: playwright-testing
description: >
  skill should used when user asks "write Playwright tests", "เขียน Playwright tests",
  "review test code", "review test", "run tests", "รัน tests", "fix failing tests",
  "แก้ test ที่ fail", "heal test failures", "heal failures", "visual regression test",
  "screenshot comparison", "accessibility test", "axe-core", "WCAG", "component test",
  "test React component in browser", "ทดสอบ React component", or needs full Playwright
  automation cycle: write code, review quality, execute tests, auto-heal failures.
version: 1.1.0
last_improved: 2026-06-25
improvement_count: 1
---

# Playwright Testing

## Required Context

| Dependency | Purpose |
|-----------|---------|
| `playwright-rules` | MUST read before writing/reviewing any code |
| `playwright-cli` skill | Navigate, screenshot, interact live pages |
| `knowledge/automation/` | Check before writing new test patterns |
| `knowledge/lessons/webUi/` | Past mistakes — prevent repeat failures |

## playwright-CLI Prerequisite (do before every workflow)

```bash
npx --no-install playwright-cli --version
```
- Missing → `bash ~/.claude/scripts/setup/mcpSetup.sh` or `npm install -g @playwright/cli@latest`
- Always read `.claude/skills/playwright-cli/SKILL.md` before using playwright-cli

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "review test code", "check quality", "audit test" | `references/playwright-code-review.md` |
| "write tests", "run tests", "fix failing tests", "heal failures" | `references/workflow.md` |
| "add test", "quick fix", "patch test" | `references/quick-automation.md` |
| "generate DB config", "create test data service", "seed database" | `references/db-writer.md` |
| "convert recording", "I recorded with Codegen" | `references/recorder.md` |
| "visual regression", "screenshot test", "UI looks wrong" | `references/visual-regression.md` |
| "accessibility test", "axe-core", "WCAG", "a11y" | `references/accessibility.md` |
| "component test", "mount component", "ct test" | `references/component-testing.md` |
| "HAR mock", "routeFromHAR", "offline test", "network mock" | `references/har-mocking.md` |
| "explore API", "discover endpoints", "explore-to-test" | `references/explore-to-test.md` |
| "property test", "fast-check", "invariant test" | `references/property-testing.md` |

## Key Rules

Selector/wait/`waitForTimeout` rules live in `playwright-rules` (loaded via Required Context above) — not restated here. Workflow-specific rules only:

- Self-heal exhausted (per `workflow.md` § 3-4 attempt policy) → route `debug-mantra`, don't keep retrying yourself
- Heal: review assertions before committing — never silently weaken
- Screenshot baselines: generate on CI (Linux), not locally (macOS font diff)
- Uploading results to an issue tracker (Jira/Azure DevOps/etc.) is project-specific plumbing — write a small upload script for your tracker if you need it; don't hardcode one vendor's API here

## Gotchas

- **Selector breaks after UI refactor** — hardcoded CSS/text selectors break silently. Use `getByTestId` as primary; add `data-testid` to components during dev.
- **Healing loop overwrites correct assertions** — auto-heal can change `toEqual` to `toContain` just to pass. Always review healed assertions before committing.
- **Page Object state leak between tests** — shared PO instances carry state across tests. Instantiate fresh PO in each test's Arrange block.
- **Screenshot baseline mismatch on CI** — macOS vs Linux font rendering differs. Always generate baselines on CI, not locally.
- **DB seed not cleaned up** — data written via db-writer persists and pollutes later tests. Always teardown in `afterEach` or use transaction rollback.

## Anti-Rationalization

| Excuse | Counter |
|---|---|
| "I'll add tests later" | Later = never. Untested code is unverified code. |
| "The test is flaky, I'll just skip it" | Flaky tests hide real bugs. Fix the flakiness, don't skip. |
| "waitForTimeout is fine for now" | It's never fine — slow and flaky both. Use a real wait condition. |
| "Auto-heal fixed it, ship it" | Auto-heal can mask real bugs by weakening assertions. Always review healed code before committing. |
| "It works on my machine" | CI runs different fonts/rendering. Generate baselines on CI, test locally for logic only. |

## Red Flags

- 🚩 `waitForTimeout()` anywhere in new code
- 🚩 Test passes locally but fails on CI — don't ignore, it's an environment-specific issue
- 🚩 No `data-testid` on interactive elements — will break on the next UI refactor
- 🚩 POM instance shared across tests — instantiate fresh per test
- 🚩 More than 3 assertions in one test — likely testing multiple things, split it

## Verification

Before declaring implementation complete:
- [ ] `playwright-rules` loaded before writing code
- [ ] No `waitForTimeout()` in new code
- [ ] `getByTestId` used as primary locator strategy
- [ ] POM instantiated fresh per test (no state leak)
- [ ] DB seed has corresponding teardown in `afterEach`
- [ ] Tests pass locally
- [ ] `playwright-code-review.md` checklist passed
- [ ] `knowledge/lessons/webUi/` checked before writing new patterns

## Human-in-the-Loop Points

| Step | Approval | When |
|------|----------|------|
| Test architecture proposal | Pick approach (POM vs helper-based) | Before scaling to all scenarios |
| First spec file written | Confirm pattern | Before generating the rest |
| Self-heal exhausted (workflow.md's attempt cap) | Accept heal / manual fix / skip test | After heal attempts run out |
| Before committing healed code | Review weakened assertions | Every heal |

## Self-Learning

After a test implementation is approved:
1. Save the pattern to `knowledge/lessons/webUi/{feature}-pattern.md`
2. If self-heal was needed, log symptom → root cause → fix to `knowledge/lessons/webUi/{feature}-heal-log.md`
3. If a new locator/wait pattern proves effective across 3+ features — promote to `knowledge/automation/webUi/`

## Bug Life Cycle Integration (GUARD state)

When writing a regression test after a bug fix, this skill is the GUARD state:

```text
debug-mantra (FIX) — fix validated
      ↓
playwright-testing ← YOU ARE HERE (GUARD) — regression test
      ↓
post-mortem (CLOSED) — document root cause
```

Regression test rules:
- Must fail without the fix applied, pass with it
- Name it with the bug reference: `[TS-XXX] regression: {bug description}`
- Tag `@regression` for easy filtering
- After GUARD passes → offer to write a post-mortem
