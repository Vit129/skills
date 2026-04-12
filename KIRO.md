# Global Agent Instructions — Right-Tool Engineering (Kiro Edition)

> **For:** Kiro AI IDE
> **Companion file:** `CLAUDE.md` (same folder — Claude Code version with Gemini tier)

---

## 1. Agent Selection Decision Matrix

**Before starting any task**, evaluate the correct tier:

### Tier 1 — ❄️ Claude Sonnet 4.6 (Default)
> Use when: most tasks — logic, implementation, bug fixing, architecture

| Task Type | Reasoning |
|-----------|-----------|
| **Bug fixing with logic tracing** | Precision thinking, avoids subtle regressions |
| **Implementation (features, components)** | Reliable output, good context retention |
| **Architecture decisions** | Deep reasoning, considers tradeoffs |
| **Test writing and review** | Understands AAA pattern, Page Object Model |
| **Code review and QA** | Catches subtle UX and logic issues |
| **Refactoring** | Understands intent, not just syntax |

### Tier 2 — ❄️ Claude Opus 4.6 (Expensive — use sparingly)
> Use when: the problem is genuinely hard and Sonnet has already failed or is likely to fail

| Task Type | Reasoning |
|-----------|-----------|
| **Complex multi-file debugging** | State/async/race conditions across many files |
| **Critical architecture with high stakes** | Wrong decision = weeks of rework |
| **Ambiguous requirements needing deep reasoning** | Needs to infer intent from incomplete specs |
| **Sonnet produced incorrect output twice** | Escalate rather than retry indefinitely |

> ⚠️ **Escalation Rule:** If Sonnet produces incorrect output → try once more with better context → if still wrong, escalate to Opus. Do NOT retry Sonnet 3+ times on the same problem.

---

## 2. Tier Selection Strategy (Risk-Based)

### Assessment Checklist

Before starting, evaluate:

- **Logic complexity**: State mutations? Async? Race conditions?
- **Test coverage**: Exists? Will catch regressions?
- **Risk of bug**: If wrong, how bad? (UI cosmetic = low; data loss = critical)
- **Subtlety**: Edge cases? Timing issues? Off-by-one?

### Tier Recommendation Matrix

| Complexity | Risk Level | Recommend | Cost |
|-----------|-----------|-----------|------|
| 🟢 **Easy** (boilerplate, simple fix, clear spec) | Low | **Sonnet** | Low |
| 🟡 **Medium** (bug with logic, state change, test coverage exists) | Medium | **Sonnet** | Medium |
| 🔴 **Hard** (state mutation, async/race, critical path, no tests) | Critical | **Opus** | High |

### Example Assessment Output

```
## Task Assessment
Title: Fix calendar input validation
Complexity: 🟡 Medium

Analysis:
  ✓ Tests exist (holdings.spec.ts)
  ✓ Logic is clear (input min-date validation)
  ⚠️ Involves state update (calendar selection)
  ⚠️ Date comparison (off-by-one risk)

Recommendation:
  → Sonnet (sufficient for this)
  → Escalate to Opus only if Sonnet misses edge case after 2 attempts

Proceeding with Sonnet.
```

---

## 3. Engineering Workflow

### Pre-Flight — Create Feature Branch (Always)

```bash
git checkout -b feat/description-of-work
```

Benefits:
- Easy rollback if something breaks
- Clear git history (each PR = one logical change)
- Safe to experiment without affecting main

### Workflow

```
1. Assess complexity → recommend tier
2. User confirms or overrides
3. Execute task
4. Run relevant tests
5. Commit with descriptive message
```

### Completion Criteria

A task is **NOT done** until:
1. ✅ Code written
2. ✅ Relevant tests pass
3. ✅ Changes committed with hash

> ⚠️ **Rule:** A task without a commit hash is NOT done. Code that isn't committed can be lost.

---

## 4. Engineering Standards

Regardless of tier, **always follow**:

1. **Explain Before Acting** — briefly state intent before invoking any tool
2. **Evidence-First** — never guess — search for evidence first
3. **Validation is Finality** — work is complete only when tests confirm correctness
4. **Context Efficiency** — read only necessary files, batch operations
5. **Commit Early & Often** — after each logical step, not just at the end
6. **Commit After Final Review** — stage all changes and commit with descriptive message

---

## 5. Playwright Skills (Mandatory for All Test Work)

When writing, reviewing, fixing, or running Playwright tests:

| Skill | When to Use |
|-------|-------------|
| **`playwright-rules`** | Always — before writing or reviewing any `.spec.ts` or page object |
| **`playwright-cli`** | When running browser automation via terminal |

**Key rules (always enforce):**
- No `waitForTimeout()` — use smart waits
- Selector priority: `getByTestId` > `getByRole` > `getByLabel`
- AAA Pattern: Arrange-Act-Assert in every test
- No inline logic: all interactions through Page Objects or Helpers

Skill files:
- `~/.claude/skills/ai-dlc/qa/playwright-rules/references/coding-standards.md`
- `~/.claude/skills/ai-dlc/qa/playwright-rules/references/web-ui.md`

---

## 6. Test Coverage Rules (Mandatory)

After **every file write or edit**, run the corresponding test(s):

- **Single file changed** → run the test that covers that file
- **Multiple files changed** → run ALL matching tests for every affected module
- **Cross-cutting changes** (shared utils, hooks, services) → run full regression suite

> ⚠️ **Rule:** Never mark a task done until all relevant tests pass. Fix root cause — do NOT modify test expectations to force a pass.

### Test Mapping (My Investment Port)

| File Pattern | Test Command |
|---|---|
| `src/features/holdings/**` | `cd tests/web-testing && npx cross-env LANG=th ENV=sit npx playwright test tests-web/port/holdings/holdings.spec.ts --reporter=line` |
| `src/features/tax/**` | `cd tests/web-testing && npx cross-env LANG=th ENV=sit npx playwright test tests-web/port/tax/tax.spec.ts --reporter=line` |
| `src/features/passiveIncome/**` | `cd tests/web-testing && npx cross-env LANG=th ENV=sit npx playwright test tests-web/port/passive/passive.spec.ts tests-web/port/passive/archive.spec.ts --reporter=line` |
| `src/features/rmf/**` | `cd tests/web-testing && npx cross-env LANG=th ENV=sit npx playwright test tests-web/port/rmf/rmf.spec.ts --reporter=line` |
| `src/App.jsx` or `src/components/**` | `cd tests/web-testing && npx cross-env LANG=th ENV=sit npx playwright test tests-web/port/main-menu/mainMenu.spec.ts tests-web/port/regression/regression.spec.ts --reporter=line` |
| `src/data/services/**` | `cd tests/api-testing && npx cross-env LANG=th ENV=sit npx playwright test --reporter=line` |

---

## 7. Token / Cost Control

| Action | Effect |
|--------|--------|
| Use Sonnet for most tasks | Cheaper than Opus, sufficient for 80%+ of tasks |
| Keep prompts focused | Reduces input tokens |
| Read only necessary files | Reduces context scan |
| Escalate to Opus only when needed | Avoids unnecessary cost |

---

## How to Load This File

Tell Kiro in chat:
> "Read `~/.claude/skills/KIRO.md` and follow those instructions for this session."

Or reference it in a spec/steering file:
```
#[[file:~/.claude/skills/KIRO.md]]
```
