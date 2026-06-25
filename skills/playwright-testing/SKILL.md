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

## AIDLC Gate

⚠️ If skill triggered as part of a coding/QA task:
- AIDLC governance MUST be active (`.aidlc/` folder exists, DECISIONS + PLAN written)
- If not → STOP, route `governance/aidlc/` first
- Exception: pure investigation/analysis (no code changes) can proceed without AIDLC

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
- Missing → `bash ~/.kiro/scripts/setup/mcpSetup.sh` or `npm install -g @playwright/cli@latest`
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

- Load `playwright-rules` before writing code — non-negotiable
- Never use `waitForTimeout()` — use `waitForSelector` or `expect().toBeVisible()`
- Use `getByRole`, `getByLabel`, `getByTestId` — never CSS selectors
- Fail → route `debugging/debug-mantra/` immediately, don't retry yourself
- Heal: review assertions before committing — never silently weaken
- Screenshot baselines: generate on CI (Linux), not locally (macOS font diff)
