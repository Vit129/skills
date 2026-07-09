---
name: post-mortem
description: Write canonical engineering record for a fixed bug — root cause, mechanism, fix, validation, how it slipped through. Engineer-audience, code identifiers welcome. Use after debug session lands the fix, before closing the ticket. Trigger on /post-mortem, "write post-mortem", "RCA", "root cause analysis", "document this fix".
version: 2.0.0
last_improved: 2026-06-30
improvement_count: 1
---

# Post-mortem

Canonical engineering record of a bug fix. Written after debugging, for other engineers. For the leadership version, hand the finished post-mortem to `management-talk`.

---

## When to Invoke

- `/post-mortem` command
- "write post-mortem / postmortem / RCA / root-cause analysis"
- "document this fix" / "close out bug writeup"
- After a debug session clearly lands a fix — proactively offer a draft

## When NOT to Use

- Bug not fixed yet, fix not validated — a post-mortem on a hypothesis is misleading
- Customer-visible outage / incident — those need a separate incident report; flag and confirm before producing one
- Trivial fix (typo, obvious one-liner) — the PR description is the record, don't manufacture ceremony

---

## Required Inputs (refuse draft without all four)

- [ ] **Reliable repro** exists (deterministic or high-rate)
- [ ] **Root cause known** (mechanism identified, not just hypothesis)
- [ ] **Fix is identified** (PR / commit / branch pointer)
- [ ] **Fix is validated** (original repro now passes)

---

## Load Right Reference

| Task | Load |
|------|------|
| Full 9-section structure + worked example | `references/structure.md` |

---

## Output Flow

1. Confirm all four required inputs are satisfied — if any missing, list them and stop
2. Confirm destination: JIRA comment (default), PR description, `docs/postmortems/<ticket>.md`
3. Produce draft in a single block
4. Get sign-off before posting to JIRA

---

## Rules

- Refuse to draft without the four required inputs
- Never invent root cause, owners, validation runs, or action items — ask if missing
- Never strip code identifiers from the engineering record (leadership reframing is management-talk's job)
- Blameless: describe bugs and gaps, never people
- State validation coverage honestly — if you only tested one config, say so
- Never post to JIRA without explicit "go ahead"

---

## Red Flags

- Drafting before all four required inputs are confirmed
- Writing "we believe" or "appears to be" instead of stating the known mechanism
- Inventing action items to look thorough
- Implying broader validation coverage than actually performed

---

## Human-in-the-Loop Points

| Step | Approval | When |
|------|----------|------|
| After confirming 4 required inputs | Checkbox | User confirms repro/root cause/fix/validation all exist |
| After draft produced | Review accuracy | Root cause + fix sections especially |
| Before posting anywhere | Explicit "go ahead" | Show the exact payload first |
| After offering management-talk handoff | Yes/no | Don't hand off automatically |

## Verification

After the post-mortem is drafted:
- [ ] All 4 required inputs confirmed (repro, root cause, fix, validation)
- [ ] Summary is one paragraph — reader can stop there
- [ ] Root cause walks the full cause chain with code identifiers
- [ ] Fix explains WHY it addresses root cause, not just what changed
- [ ] Validation states coverage honestly
- [ ] Action items have owners + tracking artifacts
- [ ] No hedging language ("we believe", "appears to")

## Self-Learning

After the post-mortem is approved:
1. Save the root cause category + "why it slipped through" to `knowledge/lessons/{platform}/{bug-class}.md`
2. Add an entry to `agent-memory/MEMORY.md` with the fix pattern
3. If "why it slipped through" was a CI gap — flag it for follow-up

## Bug Life Cycle Integration

This skill is the **CLOSED** state — the final documentation step. Requires all prior states complete:

```text
find-mismatch (DETECT+CLASSIFY) — bug found and confirmed
      ↓
debug-mantra (REPRODUCE+FIX) — root cause identified, fix validated
      ↓
playwright-testing/robotframework-testing (GUARD) — regression test written and passing
      ↓
post-mortem ← YOU ARE HERE (CLOSED) — document everything
      ↓
knowledge/ — lesson persisted for future
```

After posting: if the bug came from a `find-mismatch` scan → mark the finding CLOSED in its Lifecycle Tracker. If it came from an issue tracker, update its state via whatever script/API you use for that tracker — this skill doesn't hardcode one.
