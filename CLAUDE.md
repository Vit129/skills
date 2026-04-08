# Global Agent Instructions — Right-Tool Engineering

> **Compatible with:** Claude Code · Gemini CLI · Cursor · Codex

---

## 1. Agent Selection Decision Matrix

**Before starting any task**, evaluate the correct tier — always start from the cheapest tier that can do the job:

### Tier 1 — ♊ Gemini Flash (Free / Cheapest)
> Use when: wide reading, no logic required, low risk of breaking things

| Task Type | Reasoning |
|-----------|-----------|
| **Codebase Mapping & Research** | 1M context — reads 50+ files at once |
| **Generating boilerplate / scaffold** | Low risk, easy to verify |
| **Summarizing / documenting** | No code logic involved |

### Tier 2 — ❄️ Claude Haiku (Cheap)
> Use when: small edits, simple fixes, clear spec — Tab off Extended Thinking

| Task Type | Reasoning |
|-----------|-----------|
| **Simple one-file edits** | Known fix, low ambiguity |
| **Writing test data / fixtures** | Mechanical, easy to verify |
| **Renaming / restructuring** | Low logic complexity |

### Tier 3 — ❄️ Claude Sonnet (Expensive — use sparingly)
> Use when: logic is complex, mistakes are costly, precision matters

| Task Type | Reasoning |
|-----------|-----------|
| **Bug fixing with logic tracing** | Gemini tends to introduce new bugs |
| **Architecture decisions** | Requires deep reasoning |
| **Debugging state/async/race conditions** | Needs precision thinking |
| **Final review & QA** | Catches subtle UX and logic issues |

> ⚠️ **Escalation Rule:** If Tier 1 or 2 produces incorrect output → escalate to next tier. Do NOT let Gemini's output get handed to Claude to clean up without flagging the cost to the user.

> ⚠️ **Lesson Learned (2026-04-05):** Gemini fixed a test bug but introduced a new one (`null` vs `[]` logic). Claude had to re-trace the entire flow to find it, then needed Kiro to verify the fix. This wasted 2 days and multiple sessions.
>
> **Root cause:** Handing off buggy code between agents (Gemini → Claude → Kiro) multiplies the cost.
>
> **Prevention:**
> 1. **Gemini must test locally** before handing to Claude (run: `npm run build && npm test`)
> 2. **Single-test smoke test** immediately (`playwright test 1 spec only`) to catch regressions fast
> 3. **NO hand-offs** — one agent owns the fix start-to-finish + commit

---

## 2. Tier Selection Strategy (Risk-Based, Pay-Per-Use)

> **Philosophy:** Default assume all tasks are risky. User controls which tier to use on a per-task basis—no fixed subscription required.

### Workflow: Assess → Recommend → User Chooses

```
1. Gemini: Read task + summarize findings
                    ↓
2. Claude: Assess complexity → recommend tier
                    ↓
3. User: Choose [Haiku (risky)] [Sonnet (safe)] [Skip]
                    ↓
4. Execute + commit
```

### Tier Recommendation Matrix

| Complexity | Risk Level | Recommend | Haiku Risk | Cost |
|-----------|-----------|-----------|-----------|------|
| 🟢 **Easy** (boilerplate, simple fix, clear spec) | Low | **Haiku** | Safe | $0.01 |
| 🟡 **Medium** (bug with logic, state change, test coverage exists) | Medium-High | **Sonnet** | 10-15% miss subtle bugs | $0.10 |
| 🔴 **Hard** (state mutation, async/race conditions, critical path, no tests) | Critical | **Sonnet** (required) | Not recommended | $0.15 |

### Assessment Checklist (Claude Uses)

When recommending tier, Claude checks:

- **Logic complexity**: State mutations? Async? Race conditions?
- **Test coverage**: Exists? Will catch regressions?
- **Risk of bug**: If wrong, how bad? (UI broken = low risk; data loss = critical)
- **Subtlety**: Edge cases? Timing issues? (Haiku misses these)

### Example: Claude Assessment Output

```
## Task Assessment
Title: Fix calendar input validation
Complexity: 🟡 Medium

Analysis:
  ✓ Tests exist (holdings.spec.ts)
  ✓ Logic is clear (input min-date validation)
  ⚠️ Involves state update (calendar selection)
  ⚠️ Date comparison (off-by-one risk)

Haiku risk:
  • 10% chance miss off-by-one edge case
  • 5% chance wrong date comparison

Recommendation:
  → Sonnet (safer for this)
  → Or Haiku if you accept 10-15% risk

Your choice:
  [A] Sonnet ($0.10 — safe)
  [B] Haiku ($0.01 — risky)
  [C] Skip for now
```

### Cost Model (Pay-Per-Use)

No fixed subscription. Sample month:

```
Task 1 (Easy fix):    Haiku    → $0.01
Task 2 (Medium bug):  Sonnet   → $0.10
Task 3 (API work):    Sonnet   → $0.15
Task 4 (Scaffold):    Haiku    → $0.01
─────────────────────────────────────
Monthly total:                    ~$5-15

vs Claude Max ($100/month) = 6-20x cheaper
vs Claude Pro ($20/month) = Similar cost with more control
```

### Gemini's Role in This Strategy

✅ **Gemini ONLY for:**
- Reading code / documentation
- Summarizing task requirements
- Listing files / context mapping
- Finding relevant code sections

❌ **Never Gemini for:**
- Fixing logic bugs
- State management changes
- Async/timing fixes
- Any task graded 🟡 or 🔴

**Why:** Gemini bug cascade wastes more tokens than just using Sonnet upfront.

---

## 3. Right-Tool Engineering Workflow (Primary)

### Pre-Flight — Create Feature Branch (Always)
**Always**, even working solo — protects against mistakes and gives easy rollback:

```bash
git checkout -b feat/description-of-work
```

Benefits:
- 🔄 Easy rollback if something breaks (`git reset --hard`)
- 📋 Clear git history (each PR = one logical change)
- 🧪 Safe to experiment without affecting main
- 🛑 Catch mistakes before merging (self-review)
- ⚡ **Critical when using multiple AI agents** — if Gemini introduces bugs, Claude can revert and retry without polluting main

> 💡 **Note:** Even solo work benefits from branches. Especially with AI assistance where mistakes can be subtle (e.g., Gemini's `h || []` bug was hidden in conditional logic).

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

## 4. Token Cost Control

| Action | Saves |
|--------|-------|
| Press `Tab` to toggle off Extended Thinking for simple tasks | ลด output tokens มหาศาล |
| Use **Haiku** model for Tier 2 tasks (`/model claude-haiku-4-5`) | ~20x ถูกกว่า Sonnet |
| Use Gemini for research before asking Claude to implement | Claude ไม่ต้องอ่านไฟล์เอง |
| Keep prompts focused — don't dump whole codebase | ลด input tokens |
| `.claudeignore` excludes build/test artifacts | ลด context scan |

---

## 5. Engineering Standards & AIDLC

Regardless of which agent is used, **the same standards must be followed**:
1. **Explain Before Acting:** Briefly state intent before invoking any tool
2. **Evidence-First:** Never guess — always `grep` or `glob` for evidence first
3. **Validation is Finality:** Work is only complete when tests confirm correctness — `npm run build` passing is necessary but NOT sufficient; runtime behavior must also be verified
4. **Context Efficiency:** Use tools economically (read only necessary lines, batch commands in one turn)
5. **Commit Early & Often:** After each logical step (not just at the end) — gives safe checkpoints to revert to if something breaks
6. **Commit After Final Review:** After every Final Review, stage all changes and commit with a descriptive message

---

## 6. Playwright Skills (Mandatory for All Test Work)

When writing, reviewing, fixing, or running Playwright tests, **both skills must be activated**:

| Skill | When to Use |
|-------|-------------|
| **`playwright-rules`** | Always — before writing or reviewing any `.spec.ts` or page object. Enforces coding standards: no `waitForTimeout`, selector priority, AAA pattern, Page Object Model. |
| **`playwright-cli`** | When running browser automation via terminal (navigate, click, screenshot, extract data). Use YAML snapshots and `eX` references — NOT raw HTML. |

### Activation in Gemini Prompts
Always include this block in any Gemini prompt that involves Playwright:

```
Before writing or reviewing any test code:
1. Read ~/.claude/skills/ai-dlc/qa/playwright-rules/references/coding-standards.md
2. Read ~/.claude/skills/ai-dlc/qa/playwright-rules/references/web-ui.md
3. Adhere to all rules strictly — especially:
   - No waitForTimeout() — use smart waits
   - Selector priority: getByTestId > getByRole > getByLabel
   - AAA Pattern: Arrange-Act-Assert in every test
   - No inline logic: all interactions through Page Objects or Helpers
```

---

## 7. Test Coverage Rules (Mandatory)

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

---

## 8. Claude Code Optimization Tips (Manual Usage)

### Extended Thinking Token Management
Extended Thinking (深い思考 mode) consumes **all thinking tokens as output tokens**, making it expensive for simple tasks.

**Usage:**
- **Toggle on/off:** Press `Tab` in Claude Code CLI to toggle instantly
- **Global limit:** Set in `~/.zshrc` to cap spending:
  ```bash
  export MAX_THINKING_TOKENS=8000
  ```
  Then reload: `source ~/.zshrc`

**When to use:**
- ✅ Complex architectural decisions
- ✅ Debugging multi-file dependencies
- ❌ Simple commands (quick fixes, file reads)

### Context Efficiency with .claudeignore
The `.claudeignore` file (like `.gitignore`) excludes unnecessary files from Claude's context scanning.

**Already configured for this project:**
- Build artifacts: `dist/`, `assets/`
- Dependencies: `node_modules/`
- Test noise: `playwright-report/`, `test-results/`
- Secrets: `.env`, `.firebase/`
- OS/Logs: `*.log`, `.DS_Store`

**Benefit:** Faster scanning, lower context usage, faster responses.
