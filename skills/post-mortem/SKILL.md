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
