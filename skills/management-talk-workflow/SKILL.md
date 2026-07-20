---
name: management-talk-workflow
description: Workspace layer around the 9arm-skills management-talk plugin — adds self-learning capture after a draft is approved. Trigger on the same signals as management-talk — user asks to write/rewrite for management/exec/VP/director/PM, asks for an "executive summary/leadership update/status update", says "make this less technical/less jargony", or asks for a Slack/email/standup/meeting version of engineering work.
credit: Wraps 9arm-skills:management-talk (https://github.com/thananon/9arm-skills) — does not duplicate its content. Its Output Flow, Rules, and HITL gates (channel confirm, JIRA sign-off, 3rd-revision check) already cover the whole process; don't restate them here.
---

# Management Talk — Workspace Workflow

Wraps `9arm-skills:management-talk` (the actual rewrite discipline) with one addition:
self-learning capture. Everything else — channel confirmation, tone rules, output flow,
sign-off before posting — already lives in the plugin skill. Don't duplicate it.

## Step 1 — Load the method first

Invoke `Skill(9arm-skills:management-talk)` now, before drafting anything.

## Step 2 — After the draft is approved and used

- `knowledge/lessons/communication/{channel}-example.md` — the approved draft + channel type
- if the user rewrites significantly — note what framing was wrong
- if the same source type keeps needing the same reframe — flag it as a candidate for a
  shortcut template
