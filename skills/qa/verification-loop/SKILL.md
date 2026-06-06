---
name: verification-loop
description: >
  Use after implementing any AIDLC Phase 3 task, before marking a task done in PLAN.md,
  before creating a commit, or when /review is invoked. Runs build, lint, test, coverage,
  and security checks in mandatory order before sign-off.
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

## When to Use

- After implementing any task in AIDLC Phase 3
- Before marking a task as `[x] done` in PLAN.md
- Before creating a commit
- When `/review` is invoked


## Consistency Contract

> These steps MUST execute in the same order every time this skill runs.
> Output may vary, but the workflow is fixed.
> If any step is skipped without a documented skip condition, the session-save hook will flag this skill.

## Verification Steps (Mandatory Order)

### Step 1: Build Check
```bash
# TypeScript projects

## AIDLC Gate

⚠️ If this skill is triggered as part of a coding/QA task:
- AIDLC governance MUST be active (`.aidlc/` folder exists with DECISIONS + PLAN)
- If not → STOP and route to `governance/aidlc/` first
- Exception: pure investigation/analysis (no code changes) can proceed without AIDLC

npx tsc --noEmit

# Node projects
npm run build

# Python projects
python -m py_compile <file>
```
**Gate:** If build fails → fix before proceeding. Do NOT skip.

### Step 2: Lint Check
```bash
# Playwright/TS projects
npx eslint . --ext .ts --max-warnings 0

# Python projects
ruff check .
```
**Gate:** Zero warnings policy for new code. Pre-existing warnings are acceptable.

### Step 3: Test Execution
```bash
# Run only affected tests (surgical)
npx playwright test <spec-file> --reporter=list

# Run full suite if change is cross-cutting
npx playwright test --reporter=list
```
**Gate:** All tests must pass. If a test fails:
1. Is it YOUR change that broke it? → Fix it
2. Is it a pre-existing flaky test? → Document and skip with `test.fixme()`
3. Is it an environment issue? → Note in commit message

### Step 4: Coverage Check (if applicable)
```bash
npx playwright test --reporter=list,html
# Check: new code has test coverage
```
**Gate:** New features must have corresponding test cases. Bug fixes must have regression tests.

### Step 5: Security Scan (for auth/input/API code)
- No hardcoded secrets
- Input validation present
- No `eval()` or dynamic code execution
- API endpoints have auth checks

**Gate:** Only applies to code handling user input, authentication, or external data.

---


## Consistency Contract

> These steps MUST execute in the same order every time this skill runs.
> Output may vary, but the workflow is fixed.
> If any step is skipped without a documented skip condition, the session-save hook will flag this skill.

## Verification Report Format

After completing all steps, produce:

```markdown
## ✅ Verification Report

| Check | Status | Notes |
|-------|--------|-------|
| Build | ✅ Pass | tsc --noEmit clean |
| Lint | ✅ Pass | 0 warnings |
| Tests | ✅ Pass | 12/12 passed |
| Coverage | ✅ New code covered | hotelPricing.spec.ts added |
| Security | ⏭️ N/A | No auth/input code changed |

**Ready to commit:** Yes
```

---

## Failure Handling

### If Step 1-2 fails (Build/Lint)
→ Fix immediately. These are always your responsibility.

### If Step 3 fails (Tests)
→ Apply `debugging/debug-mantra/` skill:
1. Read error message
2. Identify root cause (your code vs environment vs flaky)
3. Fix or document

### If Step 4 fails (Coverage)
→ Write missing tests before proceeding.

### If Step 5 fails (Security)
→ Apply `dev/security-hardening/` skill.

---

## Integration with AIDLC

```text
Phase 3: Implementation
  │
  ├── Task N: Write code
  │     │
  │     ▼
  │   verification-loop (this skill)
  │     │
  │     ├── All pass → commit + mark done
  │     └── Any fail → fix → re-run loop
  │
  └── All tasks done → Phase 3 complete
```

---

## Quick Reference

| Metric | Target |
|--------|--------|
| Build | Zero errors |
| Lint | Zero warnings (new code) |
| Tests | 100% pass rate |
| Coverage | New code must be tested |
| Security | No secrets, validated inputs |

---

## Rules

- **Never skip build check** — even for "small" changes
- **Run tests locally** before pushing
- **One commit per task** — verification must pass per-task, not per-batch
- **Document skipped checks** — if a step is N/A, say why
- **Escalate after 3 failures** — if the same test fails 3 times, ask for help

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "It's a one-line change, no need to verify" | One-line changes cause production outages. The smaller the change, the easier the verification — just do it. |
| "Tests are slow, I'll run them later" | "Later" means "never". Run at least the affected spec file. |
| "The build was passing before my change" | Your change is the variable. Verify YOUR change didn't break it. |
| "It's just a config/docs change" | Config changes can break builds. Docs changes can break linters. Verify. |
| "I'll batch-verify at the end" | Batching makes it impossible to know which change broke what. Per-task verification is non-negotiable. |
| "The CI will catch it" | CI is the safety net, not the primary check. Don't push known-broken code. |

---

## Red Flags

- 🚩 You're about to commit without running any checks → STOP
- 🚩 You skipped a step because "it's obvious it works" → go back and verify
- 🚩 Build passes but you didn't run tests → incomplete verification
- 🚩 You're fixing the same test for the 3rd time → escalate, don't loop
- 🚩 You marked a step as "N/A" without explaining why → document the reason

---


## Consistency Contract

> These steps MUST execute in the same order every time this skill runs.
> Output may vary, but the workflow is fixed.
> If any step is skipped without a documented skip condition, the session-save hook will flag this skill.

## Verification

Before marking a task as done and committing, confirm:

- [ ] Build: zero errors (`tsc --noEmit` / `npm run build`)
- [ ] Lint: zero warnings on new code
- [ ] Tests: 100% pass rate on affected specs
- [ ] Coverage: new code has corresponding test cases
- [ ] Security: no secrets, inputs validated (if applicable)
- [ ] Commit: one commit per task with descriptive message


---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| Test results (build, lint, test execution) | Quality data | Input for verification report |
| Acceptance criteria (from AIDLC task spec) | Requirements | Verify implementation matches spec |
| Quality gates (zero errors, zero warnings) | Standards | Pass/fail thresholds per step |
| `dev/security-hardening/` skill | Security check | Apply when auth/input code changed |
| `knowledge/lessons/` | Lessons learnt | Check before execute |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After verification report | Checkbox (confirm all gates pass) | Before marking task as done |
| Before sign-off (commit) | Single select (commit / fix / investigate) | When all checks pass but edge cases exist |
| Escalation decision | Open field | After 3 consecutive failures on same test |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.

## Self-Learning

After user approves the output:

1. **Record good example:** Save approved output to `knowledge/lessons/qa-verification/{pattern}.md`
2. **Record failures:** If output was rejected → note what went wrong for next time
3. **Progressive update:** If a new pattern proved effective → append to relevant knowledge index
4. **Confidence tracking:** `confidence: 1.0` (user-approved) vs `confidence: 0.7` (auto-generated)

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
