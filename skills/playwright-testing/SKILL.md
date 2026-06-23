---
name: playwright-testing
description: >
  This skill should be used when the user asks to "write Playwright tests", "เขียน Playwright tests",
  "review test code", "review test", "run the tests", "รัน tests", "fix failing tests", "แก้ test ที่ fail",
  "heal test failures", "heal failures", "visual regression test", "screenshot comparison",
  "accessibility test", "axe-core", "WCAG", "component test",
  "test React component in browser", "ทดสอบ React component",
  or needs the full Playwright automation cycle: write code, review quality, execute tests, and auto-heal failures.
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# Playwright Testing

## AIDLC Gate

⚠️ If this skill is triggered as part of a coding/QA task:
- AIDLC governance MUST be active (`.aidlc/` folder exists with DECISIONS + PLAN)
- If not → STOP and route to `governance/aidlc/` first
- Exception: pure investigation/analysis (no code changes) can proceed without AIDLC


Full automation cycle for Playwright: write → review → run → heal.

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| `playwright-rules` | Coding standards | MUST read before writing/reviewing any code |
| `playwright-cli` skill | Browser automation | Navigate, screenshot, interact with live pages |
| `knowledge/automation/` | Lessons learnt | Check before writing new tests |
| `knowledge/lessons/webUi/` | Past mistakes | Prevent repeat failures |
| Playwright CLI (`npx playwright`) | Shell tool | Run tests, codegen, trace viewer |

Always read the `playwright-rules` skill before writing or reviewing any Playwright code.

## Playwright-CLI Prerequisite (MANDATORY — ทำก่อนทุก workflow)

### Step 1 — ตรวจสอบการติดตั้ง

```bash
npx --no-install playwright-cli --version
```

- **มี** (`0.x.x` ปรากฎ) → ไป Step 2
- **ไม่มี** → ติดตั้งด้วย:

```bash
# Option A — ถ้าใช้ Kiro (ติดตั้ง playwright-cli + ตั้งค่า MCP ทั้งหมด)
bash ~/.kiro/scripts/setup/mcpSetup.sh

# Option B — ติดตั้งตรงๆ เฉพาะ playwright-cli
npm install -g @playwright/cli@latest
```

ถ้า global install ล้มเหลว → ใช้ `npx playwright-cli` แทนทุกคำสั่งในขั้นตอนถัดไป

### Step 2 — อ่าน playwright-cli SKILL.md (บังคับ ไม่มี exception)

```
.claude/skills/playwright-cli/SKILL.md  ← ใน project root (installed โดย CLI)
```

อ่านทุกครั้งก่อนใช้งาน playwright-cli ไม่ว่าจะเป็น debug, explore, หรือ visual check

### Step 3 — Screenshot ทุก action (บังคับ)

Pattern มาตรฐาน: **action → screenshot → snapshot**

```bash
playwright-cli goto https://your-app.com
playwright-cli screenshot --filename=step-01-initial.png

playwright-cli click e15
playwright-cli screenshot --filename=step-02-after-click.png

playwright-cli fill e5 "test@example.com"
playwright-cli screenshot --filename=step-03-after-fill.png
playwright-cli snapshot
```

Naming: `step-{NN}-{action}.png` | Location: `.playwright/output/` (auto-created)

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "review test code", "code review", "check quality", "audit test" | `references/playwright-code-review.md` |
| "write tests", "run tests", "fix failing tests", "heal failures" | `references/workflow.md` |
| "add a test", "modify this test", "quick fix", "patch test" | `references/quick-automation.md` |
| "generate DB config", "create test data service", "seed database" | `references/db-writer.md` |
| "convert recording", "I recorded with Codegen", "transform this script" | `references/recorder.md` |
| "visual regression", "screenshot test", "screenshot comparison", "UI looks wrong" | `references/visual-regression.md` |
| "accessibility test", "axe-core", "WCAG", "a11y", "screen reader" | `references/accessibility.md` |
| "component test", "test component in isolation", "mount component", "ct test" | `references/component-testing.md` |
| "HAR mock", "routeFromHAR", "offline test", "record HAR", "network mock" | `references/har-mocking.md` |
| "explore API", "discover endpoints", "Chrome DevTools", "explore-to-test", "capture API" | `references/explore-to-test.md` |
| "property test", "fast-check", "property-based", "invariant test" | `references/workflow.md` + fast-check pattern (inline below) |

- **Playwright Code Review** — Static audit checklist: locators, AAA pattern, Labels.ts, DB patterns, reliability. (Read `references/playwright-code-review.md`)
- **Workflow** — Write, review, execute, and self-heal Playwright tests. (Read `references/workflow.md`)
- **Quick Automation** — Add/modify tests without full workflow. (Read `references/quick-automation.md`)
- **DB Writer** — Generate database config and service classes for test data. (Read `references/db-writer.md`)
- **Recorder** — Transform Playwright Codegen recordings into Page Object Model. (Read `references/recorder.md`)
- **Visual Regression** — Screenshot comparison, baseline management, multi-viewport testing. (Read `references/visual-regression.md`)
- **Accessibility** — axe-core integration, WCAG scanning, keyboard navigation testing. (Read `references/accessibility.md`)
- **Component Testing** — Test React/Vue/Svelte components in isolation in a real browser. (Read `references/component-testing.md`)
- **HAR Mocking** — Use HAR files to mock network traffic for offline/CI testing. (Read `references/har-mocking.md`)
- **Explore-to-Test** — Combined workflow: Chrome DevTools + HAR + Extension + AI → complete test suite. (Read `references/explore-to-test.md`)
| "TypeScript", "tsconfig", "fixtures", "POM", "locator", "trace", "best practices" | `references/typescript-modern.md` |

## Property-based Testing Pattern (fast-check)

Use when test-scenario/SKILL.md Step 1.5 has identified invariants.

**Install:**
```bash
npm install --save-dev fast-check
```

**Standard pattern:**
```typescript
import * as fc from 'fast-check';
import { test, expect } from '@playwright/test';

test('property: [invariant description] @property', async ({ page }) => {
  await fc.assert(
    fc.asyncProperty(
      fc.record({ amount: fc.integer({ min: 1, max: 100000 }) }),
      async ({ amount }) => {
        await page.goto('/checkout');
        await page.fill('[data-testid="amount"]', String(amount));
        const total = await page.textContent('[data-testid="total"]');
        // property: must hold for any valid input
        expect(Number(total)).toBeGreaterThanOrEqual(amount);
      }
    ),
    { numRuns: 20 } // E2E: 20 runs, unit/integration: 100
  );
});
```

**Rules:**
- Tag every property test with `@property` to filter separately from example-based tests
- When a property fails, fast-check auto-shrinks to minimal failing input — read output before debugging
- Invariants come from Quick Review Summary Properties section (test-scenario Step 1.5)

## Inline Process

1. **Load coding rules first** — Read `playwright-rules` before writing or reviewing any code. Non-negotiable.
2. **Write test code** — Create directory structure (kebab-case) → generate fixtures (`Data.ts` + `Labels.ts`) → generate schemas (AJV) → generate helpers/pages → create spec files with AAA pattern and `test.step()`. Use resilient locators (`getByRole`, `getByLabel`, `getByTestId` for explicit app contracts), never `waitForTimeout()`.
3. **Code review** — Static audit against playwright-rules: locator strategy, AAA pattern, Labels.ts usage, DB patterns, no forbidden patterns. Output: APPROVED or NEEDS_FIX.
4. **Execute tests** — Run with `--reporter=line` → parse results → if failures, trigger self-healing (max 3 attempts).
5. **Self-heal failures** — Impact analysis first → visual-first debugging (screenshot before code changes) → triage (environment = skip, code = heal) → fix by error type. Never delete functions or change architecture.
   - **ถ้า fail → route ไป `debugging/debug-mantra/` ทันที** ไม่ต้อง retry เอง
6. **Record results** — Write to `.aidlc/` audit trail. Log every heal attempt (symptom → root cause → fix → outcome).
7. **Verify** — No `waitForTimeout()`, `getByTestId` used, AAA pattern, POM fresh per test, DB seed has teardown, tests pass locally.
8. **Upload to Azure** — หลังจาก tests ผ่านทั้งหมดแล้ว upload ขึ้น Azure DevOps (upload-ts workflow)
9. **Cleanup screenshots** — หลัง upload Azure เสร็จแล้ว **ต้องให้คนยืนยันก่อนเสมอ:**

   > "✅ Tests ผ่านและ upload Azure แล้ว — ยืนยันลบ screenshot ทั้งหมดใน `.playwright/output/` ด้วยมั้ย? (yes/no)"

   ลบได้ก็ต่อเมื่อได้รับ **"yes"** เท่านั้น ถ้า upload ยังไม่เสร็จ → ห้ามลบโดยเด็ดขาด

## ⚠️ Gotchas

- **`waitForTimeout()` creep** — easy to add as a quick fix for flaky tests. Always replace with `waitForSelector`, `waitForResponse`, or `expect(locator).toBeVisible()` with a timeout option.
- **Selector breaks after UI refactor** — hardcoded CSS selectors or text-based selectors break silently. Fix: use `getByTestId` as primary, add `data-testid` to components during dev.
- **Healing loop overwrites correct assertions** — auto-heal can change `toEqual` to `toContain` to make tests pass without fixing the real bug. Always review healed assertions before committing.
- **Page Object state leak between tests** — shared PO instances carry state across tests. Fix: instantiate fresh PO in each test's Arrange block.
- **Screenshot baseline mismatch on CI** — screenshots taken on macOS differ from Linux CI (font rendering, pixel density). Fix: always generate baselines on CI, not locally.
- **DB seed not cleaned up** — test data written via db-writer persists and pollutes subsequent tests. Fix: always run teardown in `afterEach` or use transaction rollback.

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "I'll add tests later" | "Later" = never. Write tests WITH the code. Untested code is unverified code. |
| "The test is flaky, I'll just skip it" | Flaky tests hide real bugs. Fix the flakiness (use proper waits), don't skip. |
| "waitForTimeout is fine for now" | It's NEVER fine. It makes tests slow AND flaky. Use `waitForSelector` or `expect().toBeVisible()`. |
| "I know the selector works, no need for getByTestId" | CSS selectors break on refactor. `getByTestId` survives UI changes. Always prefer stable locators. |
| "Auto-heal fixed it, ship it" | Auto-heal can mask real bugs by weakening assertions. ALWAYS review healed code before committing. |
| "It works on my machine" | CI uses Linux with different fonts/rendering. Generate baselines on CI, test locally for logic only. |

---

## Red Flags

- 🚩 `waitForTimeout()` anywhere in new code → replace immediately
- 🚩 Test passes locally but fails on CI → environment-specific issue, don't ignore
- 🚩 No `data-testid` on interactive elements → will break on next UI refactor
- 🚩 POM instance shared across tests → state leak, instantiate fresh per test
- 🚩 Test file has no AAA comments (Arrange/Act/Assert) → structure unclear, add them
- 🚩 More than 3 assertions in one test → likely testing multiple things, split it

## Official Documentation Anchors

- Best practices: https://playwright.dev/docs/best-practices
- TypeScript: https://playwright.dev/docs/test-typescript
- Locators: https://playwright.dev/docs/locators
- Fixtures: https://playwright.dev/docs/test-fixtures
- Configuration: https://playwright.dev/docs/test-configuration
- Network: https://playwright.dev/docs/network
- Page object models: https://playwright.dev/docs/pom
- Auto-waiting: https://playwright.dev/docs/actionability
- Assertions: https://playwright.dev/docs/test-assertions

---


## Consistency Contract

> These steps MUST execute in the same order every time this skill runs.
> Output may vary, but the workflow is fixed.
> If any step is skipped without a documented skip condition, the session-save hook will flag this skill.

## Verification

Before declaring Playwright test implementation complete, confirm:

- [ ] `playwright-rules/` loaded before writing code
- [ ] No `waitForTimeout()` in new code
- [ ] `getByTestId` used as primary locator strategy
- [ ] AAA pattern followed (Arrange/Act/Assert comments)
- [ ] POM instantiated fresh per test (no state leak)
- [ ] DB seed has corresponding teardown in `afterEach`
- [ ] Tests pass locally: `npx playwright test <spec> --reporter=list`
- [ ] Code review checklist passed (playwright-code-review.md)
- [ ] `knowledge/lessons/webUi/` checked before writing new patterns

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After test architecture proposal | Single select | User picks approach (POM vs helper-based) |
| After first spec file written | Checkbox review | User confirms pattern before scaling to all scenarios |
| After self-heal (3 attempts) | Open field | User decides: accept heal / manual fix / skip test |
| Before committing healed code | Checkbox | User reviews weakened assertions |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single "here's what I did."

## Self-Learning

After user approves final test implementation:

1. **Record good example:** Save approved spec file path + pattern summary to `knowledge/lessons/webUi/{feature}-pattern.md`
2. **Record failure patterns:** If self-heal was needed, log symptom → root cause → fix to `knowledge/lessons/webUi/{feature}-heal-log.md`
3. **Progressive update:** If a new locator strategy or wait pattern proved effective, append to `knowledge/automation/webUi/` index
4. **Confidence tracking:** Mark lesson as `confidence: 1.0` (user-approved) vs `confidence: 0.7` (auto-captured from heal)

---

## Bug Life Cycle Integration (GUARD state)

When writing a **regression test** after a bug fix, this skill serves as the GUARD state:

```text
debug-mantra (FIX) — fix validated
      ↓
playwright-testing ← YOU ARE HERE (GUARD) — regression test
      ↓
post-mortem (CLOSED) — document root cause
```

**Regression test rules:**
- Test MUST fail without the fix applied (verify by reverting temporarily or asserting the old behavior)
- Test MUST pass with the fix applied
- Name the test with the bug reference: `[TS-XXX] regression: {bug description}`
- Tag with `@regression` for easy filtering
- After GUARD passes → offer to write post-mortem (`debugging/post-mortem/`)

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
