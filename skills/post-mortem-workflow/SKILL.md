---
name: post-mortem-workflow
description: Workspace layer around the 9arm-skills post-mortem plugin — adds self-learning capture and bug lifecycle handoff around the post-mortem writeup itself. Trigger on the same signals as post-mortem writing — user says "write the post-mortem / postmortem / RCA / root cause analysis", "document this fix", "write up the root cause", "close out this bug with a writeup", or hands you a fixed-and-validated bug and asks for the writeup.
credit: Wraps 9arm-skills:post-mortem (https://github.com/thananon/9arm-skills) — does not duplicate its content (the required-inputs gate, posting sign-off, and management-talk handoff offer already live there).
---

# Post-Mortem — Workspace Workflow

Wraps `9arm-skills:post-mortem` (the actual writeup discipline) with this workspace's process
layer. Its own Output Flow already covers: confirming the 4 required inputs, sign-off before
posting, and offering the management-talk handoff — don't restate those here.

## Step 1 — Load the method first

Invoke `Skill(9arm-skills:post-mortem)` now, before drafting anything.

## Step 2 — After the post-mortem is approved

- `knowledge/lessons/{platform}/{bug-class}.md` — root cause category + "why it slipped through"
- `agent-memory/PLAYBOOK.md` — new entry with the fix pattern
- if "why it slipped through" was a CI gap → flag it for follow-up

## Step 3 — Hand off

```
find-mismatch → debug-mantra-workflow → regression test (GUARD) → post-mortem-workflow (YOU, CLOSED) → agent-memory
```

If the bug came from a `find-mismatch` scan → mark the finding CLOSED in its Lifecycle Tracker.
If from an issue tracker → update its state via that tracker's script/API (see Tracker Sync in
`rules/routing.md`).

## Verification

- [ ] Root cause walks the full cause chain with code identifiers, not "a synchronization issue"
- [ ] Validation states coverage honestly, not implied broader than what was tested
- [ ] Lesson captured to `knowledge/lessons/` before closing out
