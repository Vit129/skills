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

### Completion Criteria

A task is **NOT done** until:
1. ✅ Code written
2. ✅ Relevant tests pass
3. ✅ Changes committed with hash

> ⚠️ **Rule:** A task without a commit hash is NOT done. Code that isn't committed can be lost.

> **Engineering Standards & Karpathy Principles** → See `AGENT.md`

---

## 4. Playwright Skills (Mandatory for All Test Work)

→ Full rules: `system/hook-creator/templates/kiro/steering/` or load `#playwright-rules` in chat

When writing, reviewing, fixing, or running Playwright tests, activate both `playwright-rules` and `playwright-cli` skills. Key mandates: no `waitForTimeout()`, `getByTestId` selector priority, AAA pattern, Page Object Model.

Skill paths (relative to SKILLS_ROOT):
- Standards: `ai-dlc/qa/playwright-rules/SKILL.md`
- Testing workflow: `ai-dlc/qa/playwright-testing/SKILL.md`
- CLI: `ai-dlc/qa/playwright-cli/SKILL.md`

---

## 5. Test Coverage Rules (Mandatory)

→ Load `#qa-architect` in chat for full test mapping

After every file write or edit, run the corresponding test(s). Never mark a task done until all relevant tests pass.

Skill path: `ai-dlc/qa/qa-architect/SKILL.md`

---

## 6. Token / Cost Control

| Action | Effect |
|--------|--------|
| Use Sonnet for most tasks | Cheaper than Opus, sufficient for 80%+ of tasks |
| Keep prompts focused | Reduces input tokens |
| Read only necessary files | Reduces context scan |
| Escalate to Opus only when needed | Avoids unnecessary cost |
| Do NOT edit KIRO.md/rules mid-session | Breaks prompt cache permanently |

### Prompt Cache Protection

- **Do NOT edit** KIRO.md, `.kiro/steering/`, MCP config mid-session — cache is permanently lost
- Configure everything before starting a session — editing mid-session = cache lost, never recovers
- If you must edit → start a new session
- KIRO.md structure: stable content (standards, rules) on top, dynamic content at bottom → cache-aware boundaries

### Token Budget Targeting

For large tasks where cost matters, specify budget explicitly in the prompt:
- `"Use no more than 50K tokens"` → agent scopes work to fit, avoids over-engineering
- `"Spend up to 200K — go deep"` → agent deep dives fully
- Not specified = agent decides on its own (may over or under spend)

---

## How to Load This File

Tell Kiro in chat:
> "Read `AGENT.md` in the skills folder and follow those instructions for this session."

Or reference directly:

```
#[[file:~/.claude/skills/AGENT.md]]
```

Or if skills folder has moved:

```
#[[file:{skills_root}/AGENT.md]]
```

AGENT.md will point Kiro to this file and all available skills automatically.

---

## Knowledge Ingest & Citation

→ See `AGENT.md` §Knowledge Ingest Workflow and §Citation Convention

**Ingest trigger phrases:** "ingest this", "add to knowledge", "learn from this", "dump to raw"

**Citation format when answering from knowledge base:**
```
[from: LESSON-AUTH-001]        ← lesson
[from: skill:playwright-rules] ← skill
[from: memory:{wing}/{room}]   ← memory palace
```
