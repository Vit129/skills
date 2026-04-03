# Global Agent Instructions — Gemini-First Engineering

> **Compatible with:** Claude Code · Gemini CLI · Cursor · Codex

---

## 1. Agent Selection Decision Matrix

**Before starting any task**, the AI must evaluate and suggest the appropriate agent to the user:

| Task Type | Recommended Agent | Reasoning |
|-----------|-------------------|-----------|
| **Codebase Mapping & Research** | ♊ **Gemini CLI** | 1M Context Window — ideal for reading many files |
| **Feature Implementation** | ♊ **Gemini CLI** | Autonomous execution — faster and more token-efficient |
| **Bug Fixing & Refactoring** | ♊ **Gemini CLI** | Better cross-file dependency analysis |
| **High-Level Architecture** | ❄️ **Claude Code** | Deeper reasoning and precision in design decisions |
| **Final Review & UX Polish** | ❄️ **Claude Code** | Superior sensitivity to style and user experience |

---

## 2. Gemini-First Engineering Workflow (Primary)

### Step 1 — Suggest the Agent
Notify the user immediately if the task should go through Gemini CLI:
> "♊ This task is recommended for **Gemini CLI** (model: `gemini-3-flash-preview`) for maximum efficiency and context savings — would you like me to generate the ready-to-run command?"

### Step 2 — Handover
Generate a ready-to-run command:
```bash
gemini --model gemini-3-flash-preview -p "[Prompt with detailed task context and goals]"
```

### Step 3 — Gemini Self-Review + Commit (Mandatory — No Exceptions)

After Gemini completes the task, it MUST do **all 3** before the task is considered done:

**3a. Build Verification**
```bash
npm run build   # Must pass with zero errors
```

**3b. Commit ALL changes** (no uncommitted work allowed)
```bash
git add <all changed files>
git commit -m "feat/fix: [description]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

**3c. Report commit hash**
> "✅ Done — committed as `abc1234`"

> ⚠️ **Rule:** A task without a commit hash is NOT done — no matter how good the screenshot looks. Code in a worktree that isn't committed will be lost when the worktree is deleted.

> ⚠️ **Rule:** Gemini must self-review AND fix all issues before the result is considered done. Do NOT hand off unreviewed output to Claude/Kiro. This prevents overloading Claude/Kiro with avoidable corrections.

### Lesson Learned (2026-04-03)
Gemini implemented Sandbox Mode successfully (screenshot showed orange banner ✅, build passed ✅) but **never committed**. When the worktree was deleted, all code was lost. The fix: commit hash is the only proof of completion.

---

## 3. Claude-Assisted Workflow (Alternative)

Use Claude when the user prefers it or when the task requires strategic decision-making:
- Emphasize Planning before execution
- Use for Final Quality Check after Gemini completes work
- Small tasks where Context < 25,000 tokens

---

## 4. Engineering Standards & AIDLC

Regardless of which agent is used, **the same standards must be followed**:
1. **Explain Before Acting:** Briefly state intent before invoking any tool
2. **Evidence-First:** Never guess — always `grep` or `glob` for evidence first
3. **Validation is Finality:** Work is only complete when tests confirm correctness — `npm run build` passing is necessary but NOT sufficient; runtime behavior must also be verified
4. **Context Efficiency:** Use tools economically (read only necessary lines, batch commands in one turn)
5. **Commit After Final Review:** After every Final Review, stage all changes and commit with a descriptive message

---

## 5. Test Coverage Rules (Mandatory)

After **every file write or edit**, the agent must run the corresponding test(s):

- **Single file changed** → run the test that covers that file
- **Multiple files changed across modules** → run ALL matching tests for every affected module — do not skip any
- **Cross-cutting changes** (e.g. shared utils, hooks, services) → run the full regression suite

### Test Mapping (My Investment Port)

| File Pattern | Test Command |
|---|---|
| `src/features/holdings/**` or `src/pages/HoldingsPage.jsx` | `cd tests/web-testing && npx cross-env LANG=th ENV=sit npx playwright test --config=playwright.config.ts tests-web/port/holdings/holdings.spec.ts --reporter=line` |
| `src/features/tax/**` or `src/pages/TaxPage.jsx` | `cd tests/web-testing && npx cross-env LANG=th ENV=sit npx playwright test --config=playwright.config.ts tests-web/port/tax/tax.spec.ts --reporter=line` |
| `src/features/passiveIncome/**` or `src/pages/PassiveIncomePage.jsx` | `cd tests/web-testing && npx cross-env LANG=th ENV=sit npx playwright test --config=playwright.config.ts tests-web/port/passive/passive.spec.ts tests-web/port/passive/archive.spec.ts --reporter=line` |
| `src/features/rmf/**` or `src/pages/RmfPage.jsx` | `cd tests/web-testing && npx cross-env LANG=th ENV=sit npx playwright test --config=playwright.config.ts tests-web/port/rmf/rmf.spec.ts --reporter=line` |
| `src/App.jsx` or `src/components/**` or `css/**` | `cd tests/web-testing && npx cross-env LANG=th ENV=sit npx playwright test --config=playwright.config.ts tests-web/port/main-menu/mainMenu.spec.ts tests-web/port/regression/regression.spec.ts --reporter=line` |
| `src/data/services/**` | `cd tests/api-testing && npx cross-env LANG=th ENV=sit npx playwright test --config=playwright.config.ts --reporter=line` |

> ⚠️ **Rule:** Never mark a task as done until all relevant tests pass. If tests fail, fix the root cause — do NOT modify test expectations to force a pass.
