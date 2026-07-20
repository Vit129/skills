---
name: debug-mantra-workflow
description: Workspace layer around the 9arm-skills debug-mantra plugin — adds HITL gates, a verification checklist, self-learning capture, and bug lifecycle handoff around the mantra method itself. Trigger on the same signals as debugging — user reports a bug, says something is broken/crashing/failing, asks to debug/diagnose/investigate an issue, or pastes a stack trace or error log.
credit: Wraps 9arm-skills:debug-mantra (https://github.com/thananon/9arm-skills) — does not duplicate its content.
---

# Debug Mantra — Workspace Workflow

Wraps `9arm-skills:debug-mantra` (the actual method) with this workspace's process layer.
Never duplicate the method itself — always defer to the plugin for the 4 mantra steps.

## Step 1 — Load the method first

Invoke `Skill(9arm-skills:debug-mantra)` now, before starting any debugging work.
Its 4 steps (reproduce → trace fail path → falsify hypothesis → breadcrumb ledger) run for
real. Everything below adds gates and capture around them — it does not replace them. This
must load before Step 1 of the mantra begins, so the gates below can interleave with it.

## Step 2 — Gates (interleave with the mantra's own steps, don't wait until the end)

| After | Gate | Type |
|---|---|---|
| Mantra step 1 (repro) | User confirms repro is reliable | checkbox |
| Mantra step 3 (hypothesis list) | User picks which of the 3-5 ranked hypotheses to test first | single select |
| Before applying fix | User approves fix + rationale, or suggests alternative | open field |
| After fix validated | User confirms it's the real fix, not symptom-hiding | checkbox |

Never commit to a single hypothesis without presenting ranked alternatives first.

## Step 3 — After fix lands

- `knowledge/lessons/{platform}/{bug-class}.md` — root cause + fix approach
- `agent-memory/playbook.md` — new entry if this is a new failure pattern
- confidence: `1.0` if user-validated, `0.7` if auto-healed
- 3+ bugs sharing root cause → `knowledge/lessons/{platform}/{pattern}-pattern.md`

## Step 4 — Hand off

```
find-mismatch → debug-mantra-workflow (YOU) → regression test (GUARD) → post-mortem → agent-memory
```

Always: write a regression test, offer `post-mortem`, and if this came from a `find-mismatch`
scan, update its Lifecycle Tracker.

## Verification

- [ ] Repro was reliable before the fix was attempted
- [ ] A hypothesis was disproved before committing to it
- [ ] Fix addresses root cause, not symptom
- [ ] `knowledge/lessons/` checked for prior art before starting
