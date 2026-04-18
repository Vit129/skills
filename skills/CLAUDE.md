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
| Press `Tab` to toggle off Extended Thinking for simple tasks | Massively reduces output tokens |
| Use **Haiku** model for Tier 2 tasks (`/model claude-haiku-4-5`) | ~20x cheaper than Sonnet |
| Use Gemini for research before asking Claude to implement | Claude doesn't need to read files itself |
| Keep prompts focused — don't dump whole codebase | Reduces input tokens |
| `.claudeignore` excludes build/test artifacts | Reduces context scan |

### Prompt Cache Protection

- **Do NOT edit** CLAUDE.md, `.claude/rules/`, MCP config mid-session — cache is permanently lost for the entire session
- Configure everything before starting a session — editing mid-session = cache lost, never recovers
- If you must edit → `/clear` and start a new session
- CLAUDE.md structure: stable content (standards, rules) on top, dynamic content (test mapping) at bottom → cache-aware boundaries

### Token Budget Targeting

For large tasks where cost matters, specify budget explicitly in the prompt:
- `"Use no more than 50K tokens"` → agent scopes work to fit, avoids over-engineering
- `"Spend up to 200K — go deep"` → agent deep dives fully
- Not specified = agent decides on its own (may over or under spend)

---

## 5. Engineering Standards & Karpathy Principles

→ See `AGENT.md` — Engineering Standards + Karpathy Coding Principles apply to all agents.

---

## 6. Playwright Skills (Mandatory for All Test Work)

→ Full rules: `.claude/rules/playwright-standards.md`

When writing, reviewing, fixing, or running Playwright tests, activate both `playwright-rules` and `playwright-cli` skills. Key mandates: no `waitForTimeout()`, `getByTestId` selector priority, AAA pattern, Page Object Model.

---

## 7. Test Coverage Rules (Mandatory)

→ Full rules + test mapping: `.claude/rules/test-coverage.md`

After every file write or edit, run the corresponding test(s). Never mark a task done until all relevant tests pass.

---

## 8. Optimization Tips

→ Full guide: `.claude/rules/optimization.md`

Key rules: toggle Extended Thinking off for simple tasks, do NOT edit CLAUDE.md/rules/MCP config mid-session (breaks prompt cache), use `.claudeignore` to reduce context scan.
