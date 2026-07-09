---
name: verification-loop
description: >
  Use after implementing any task, before marking a task done, before creating a commit,
  or when /review is invoked. Runs diff-size, build, lint, test, coverage, and security
  checks in mandatory order before sign-off.
version: 2.1.0
last_improved: 2026-07-04
improvement_count: 2
---

# Verification Loop

Run before every commit. Mandatory order: Diff Size → Build → Lint → Test → Coverage → Security.

---

## Load Right Reference

| Task | Load |
|------|------|
| Commands + gates + failure handling for each step | `references/steps.md` |

---

## Quick Reference

| Metric | Target |
|--------|--------|
| Diff Size | Matches task scope — flag if files/lines changed are far outside what the task should touch |
| Build | Zero errors |
| Lint | Zero warnings (new code) |
| Tests | 100% pass rate |
| Coverage | New code must be tested |
| Security | No secrets, validated inputs |

---

## Report Format

```markdown
## ✅ Verification Report

| Check | Status | Notes |
|-------|--------|-------|
| Diff Size | ✅ Pass | `git diff --stat`: 3 files, 42 lines — matches task scope |
| Build | ✅ Pass | tsc --noEmit clean |
| Lint | ✅ Pass | 0 warnings |
| Tests | ✅ Pass | 12/12 passed |
| Coverage | ✅ New code covered | spec.ts added |
| Security | ⏭️ N/A | No auth/input code changed |

**Ready to commit:** Yes
```

---

## Rules

- **Check diff size first** — run `git diff --stat` before Build; if files/lines changed are far beyond the task's scope, stop and confirm before running the rest of the loop
- **Never skip build check** — even for "small" changes
- **Run tests locally** before pushing
- **One commit per task** — verification must pass per-task, not per-batch
- **Document skipped checks** — if a step is N/A, say why
- **Escalate after 3 failures** — if the same test fails 3 times, ask for help

---

## Anti-Rationalization

| Excuse | Rebuttal |
|--------|----------|
| "It's a one-line change" | One-line changes cause production outages. The smaller the change, the easier the verification. |
| "Tests are slow, I'll run them later" | "Later" means "never". Run at least the affected spec file. |
| "The build was passing before my change" | Your change is the variable. Verify YOUR change didn't break it. |
| "I'll batch-verify at the end" | Batching makes it impossible to know which change broke what. Per-task is non-negotiable. |
| "The CI will catch it" | CI is the safety net, not the primary check. Don't push known-broken code. |

---

## Red Flags

- 🚩 About to commit without running any checks
- 🚩 Skipped a step because "it's obvious it works"
- 🚩 Build passes but tests weren't run
- 🚩 Fixing the same test for the 3rd time → escalate, don't loop
- 🚩 Step marked "N/A" without explaining why

---

## Verification

Before marking a task done and committing:
- [ ] Diff size matches task scope
- [ ] Build: zero errors
- [ ] Lint: zero warnings on new code
- [ ] Tests: 100% pass rate on affected specs
- [ ] Coverage: new code has corresponding test cases
- [ ] Security: no secrets, inputs validated (if applicable)
- [ ] One commit per task with a descriptive message

## Self-Learning

After the verification report is approved:
1. If output was rejected — note what went wrong before the next run
2. If a new failure pattern proves effective to catch → append to `references/steps.md`
