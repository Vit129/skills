---
name: robotframework-testing
description: >
  This skill should be used when the user asks to "write Robot Framework tests", "เขียน Robot Framework tests",
  "review mobile test code", "review mobile test", "run mobile tests", "รัน mobile tests",
  "fix failing mobile tests", "แก้ mobile test ที่ fail", "heal mobile test failures",
  "use Browser Library", "use Playwright with Robot Framework", "RF 7 features",
  "secret variables", "typed keywords",
  "Flutter test", "test Flutter app", "Flutter Appium", "appium-mcp setup", "setup Appium MCP",
  or needs the full Robot Framework + Appium automation cycle: write code, review quality, execute tests, and auto-heal failures.
version: 1.1.0
last_improved: 2026-06-11
improvement_count: 1
---

# Robot Framework Testing


Full automation cycle for Robot Framework + Appium: write → review → run → heal.

Always read the `robotframework-rules` skill before writing or reviewing any Robot Framework code.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "review mobile test", "code review RF", "audit robot code" | `references/rf-code-review.md` |
| "write RF tests", "run mobile tests", "fix failing tests", "heal failures" | `references/workflow.md` |
| "generate DB config", "create Python DB service", "seed mobile test data" | `references/python-db.md` |
| "Browser Library", "Playwright RF", "web test with RF", "rfbrowser" | `references/browser-library.md` |
| "RF 7 features", "secret variables", "typed keywords", "WHILE loop", "TRY EXCEPT", "VAR syntax" | `references/rf7-features.md` |
| "Flutter test", "Flutter Appium", "test Flutter app", "byValueKey", "Flutter driver" | `references/flutter-appium.md` |
| "appium-mcp setup", "setup Appium MCP", "install appium-mcp", "mobile MCP" | `references/appium-mcp-setup.md` |
| "property test", "hypothesis", "property-based", "invariant test" | Hypothesis pattern (inline below) |

- **RF Code Review** — Static audit checklist: locators, AAA, identical naming, YAML fixtures, Expert Gems. (Read `references/rf-code-review.md`)
- **Workflow** — Write, review, execute, and self-heal Robot Framework tests. (Read `references/workflow.md`)
- **Python DB Writer** — Generate Python database config and service classes for mobile test data. (Read `references/python-db.md`)
- **Browser Library** — Playwright-powered web testing with RF: auto-wait, network mocking, modern locators. (Read `references/browser-library.md`)
- **RF 7.x Features** — Secret variables, typed keywords, TRY/EXCEPT, WHILE, VAR syntax, Listener API v3. (Read `references/rf7-features.md`)
- **Flutter + Appium** — Flutter Driver locators (byValueKey, byText), context switching, capabilities, page objects. (Read `references/flutter-appium.md`)
- **Appium MCP Setup** — Installation guide: mcpSetup.sh, Android SDK, iOS, Flutter builds, capabilities.json. (Read `references/appium-mcp-setup.md`)

## Property-based Testing Pattern (Hypothesis)

Use when test-scenario/SKILL.md Step 1.5 has identified invariants.

**Install:**
```bash
pip install hypothesis
```

**Standard pattern (Python keyword library + RF):**
```python
# keywords/property_keywords.py
from hypothesis import given, settings
from hypothesis import strategies as st

@given(amount=st.integers(min_value=1, max_value=100000))
@settings(max_examples=20)  # mobile E2E: 20, unit: 100
def test_total_invariant(amount):
    # property: must hold for any valid input
    result = calculate_total(amount)
    assert result >= amount
```

```robot
# tests/property_test.robot
*** Test Cases ***
[TC-PROP-001] Property: Total must be >= amount for any valid input
    [Tags]    property
    Run Property Test    amount_invariant
```

**Rules:**
- Tag every property test with `property` to filter: `robot --include property`
- When a property fails, Hypothesis auto-shrinks to minimal failing input — read output before debugging
- Invariants come from Quick Review Summary Properties section (test-scenario Step 1.5)
- Use Python keyword library for logic-heavy properties, RF keyword for UI flow properties

## Inline Process

1. **Load coding rules first** — Read `robotframework-rules` before writing or reviewing any code. Non-negotiable.
2. **Write test code** — Create directory structure (kebab-case) → generate YAML fixtures → generate page objects with accessibility_id locators → generate .robot files with AAA pattern, `[TC-xxxx]` prefix, mandatory tags. Keyword names MUST be identical across Android/iOS.
3. **Code review** — Static audit: identical naming across platforms, AAA pattern, YAML fixtures (no hardcoded data), accessibility_id priority, Expert Gems implementation. Output: APPROVED or NEEDS_FIX.
4. **Execute tests** — Run: `robot --outputdir results --variable ENV:sit [path]` → parse output.xml → if failures, trigger healer (max 3 attempts).
5. **Self-heal failures** — Impact analysis → triage (environment = skip, code = heal) → fix by type (element not found → accessibility_id + XML source; timeout → Wait Until...; assertion → verify YAML data). Never add `Sleep` as a fix.
6. **Record results** — Write test results + Reflexion Log to audit.md.
7. **Verify** — All data in YAML, identical keyword names, accessibility_id locators, AAA pattern, tests pass on target platform.

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "I'll write the RF test code without loading robotframework-rules first" | The rules skill defines naming conventions, locator strategy, AAA pattern, and YAML fixture format. Without it, your code will fail code review on structural issues, not logic. |
| "I'll skip the code review step — the test passes so it's fine" | Passing tests can still have brittle locators, missing AAA structure, or hardcoded data. The rf-code-review checklist catches maintainability issues that passing tests don't reveal. |
| "I'll use XPath locators since they're more flexible" | RF rules mandate accessibility-based locators (id, name, accessibility_id). XPath breaks on any UI restructure and makes tests unmaintainable. |
| "I'll hardcode test data in the test file — it's just one value" | YAML fixtures are required for ALL test data. Hardcoded values create hidden dependencies and make tests impossible to run in different environments. |
| "RF 7 features like TRY/EXCEPT aren't needed — I'll use Run Keyword And Ignore Error" | RF 7.x syntax (TRY/EXCEPT, WHILE, VAR) is cleaner and more maintainable. Using deprecated patterns when modern alternatives exist creates technical debt. |

---

## Red Flags

- 🚩 Test keywords don't follow identical naming convention across Android/iOS → RF rules not loaded; read `robotframework-rules` before writing any code.
- 🚩 Test file has no YAML fixture imports → Test data is hardcoded somewhere; extract all data to YAML fixtures.
- 🚩 `workflow.md` not loaded but agent is writing + running + fixing tests → The full cycle (write → review → run → heal) requires the workflow reference; load it.
- 🚩 Agent fixed a failing test by adding `Sleep` or arbitrary timeout → Masking the real failure; find the actual root cause instead of adding waits.
- 🚩 Browser Library features used without loading `browser-library.md` reference → Web RF tests need the Browser Library reference for correct auto-wait and network mocking patterns.

---


## Consistency Contract

> These steps MUST execute in the same order every time this skill runs.
> Output may vary, but the workflow is fixed.
> If any step is skipped, document the skip condition explicitly.

## Verification

Before declaring RF test implementation complete, confirm:

- [ ] `robotframework-rules/` loaded before writing any code
- [ ] All test data in YAML fixtures (no hardcoded values)
- [ ] Keyword names identical across Android/iOS (no platform suffix)
- [ ] Locators use accessibility_id priority (not XPath)
- [ ] AAA pattern followed (Arrange/Act/Assert comments)
- [ ] Code review checklist passed (rf-code-review.md)
- [ ] Tests run successfully on target platform


---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| `robotframework-rules` | Coding standards | Naming, locators, AAA pattern, YAML fixtures |
| Appium config (capabilities, device farm) | Infrastructure | Target platform and device configuration |
| `references/*.md` (one per task) | Workflow reference | Write, review, execute, heal, Browser Library |
| YAML fixture files | Test data | All test data externalized to YAML |
| `knowledge/lessons/` | Lessons learnt | Check before execute |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After test structure proposal | Checkbox (confirm directory + keyword naming) | Before writing .robot files |
| After first keyword file | Open field (review naming + locator strategy) | Before generating remaining keywords |
| After code review | Single select (APPROVED / NEEDS_FIX) | Before marking test implementation done |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.

## Self-Learning

After user approves the output:

1. **Record good example:** Save approved output to `knowledge/lessons/qa-mobile/{pattern}.md`
2. **Record failures:** If output was rejected → note what went wrong for next time
3. **Progressive update:** If a new pattern proved effective → append to relevant knowledge index
4. **Confidence tracking:** `confidence: 1.0` (user-approved) vs `confidence: 0.7` (auto-generated)
