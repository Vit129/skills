---
name: management-talk
description: Rewrite engineer-to-engineer content for engineering-org leadership (VPs, directors, PMs, release managers) shaped for the destination channel — JIRA comment, Slack post, async standup, email, or meeting talking-points. Trigger when user asks to write/rewrite for management / exec / VP / director / PM, asks for an "executive summary / leadership update / status update", says "make this less technical", or asks for a Slack / email / standup / meeting version of engineering work.
version: 2.0.0
last_improved: 2026-06-30
improvement_count: 1
---

# Management Talk

Same content, different audience and channel. Audience reads code names but not code.

---

## When to Invoke

- "write for management / exec / VP / director / PM / release manager"
- "make non-technical" / "less jargony"
- "executive summary" / "leadership update" / "status update"
- "Slack update / standup note / email" about engineering work
- "talking points for [meeting]"

If the channel is unclear after trigger: ask one short question — *"JIRA, Slack, standup, or email?"* — then stop.

---

## Load Right Reference

| Task | Load |
|------|------|
| Audience definition + keep/strip/translate rules + source material | `references/audience.md` |
| JIRA / Slack / standup / email / meeting shapes + worked example | `references/channels.md` |

---

## Output Flow

1. Confirm the channel (ask if not stated)
2. Produce draft in a single block formatted for how the channel renders it
3. Default: print-only — user copies it
4. JIRA back-post: show exact payload, wait for explicit "post it" / "go ahead"
5. **Never post Slack, email, or any non-JIRA channel** — hand the draft to the user

---

## Rules

- Never invent facts to make the rewrite cleaner
- Keep JIRA keys, PR numbers, and customer/workload names during de-jargoning — they're the cross-reference bridge
- Never invent owners — ask if the source doesn't name one
- Get sign-off before posting to JIRA
- Stay out of advocacy — this skill produces a status update, not a recommendation

---

## Red Flags

- Code identifiers (`tadaLaunchPrepare`, `scratchBuf`, `0e0a6bac`) appearing in output
- Inventing facts not in the source
- Stripping JIRA keys or PR numbers
- Posting to Slack or email without handing draft to user first

---

## Human-in-the-Loop Points

| Step | Approval | When |
|------|----------|------|
| Channel confirmation | Pick channel | If unclear — ask "JIRA, Slack, standup, or email?" |
| After draft produced | Review tone + accuracy | Before using |
| Before posting to JIRA | Show exact payload | User says "post it" or edits |
| After 3rd revision | Clarify what's wrong | Don't keep tweaking blindly |

## Verification

- [ ] Channel confirmed before drafting
- [ ] No code identifiers remain (function names, file paths, SHAs)
- [ ] Product/framework names preserved (JIRA keys, PR numbers, workload names)
- [ ] Mechanism translated to plain-English cause-and-effect
- [ ] No hedging language unless genuinely uncertain
- [ ] Length appropriate for channel (Slack <80 words, standup 1-3 lines)
- [ ] Sign-off obtained before posting to JIRA

## Self-Learning

After the user approves and uses the draft:
1. Save the approved draft + channel type to `knowledge/lessons/communication/{channel}-example.md`
2. If the user rewrites significantly — note what framing was wrong
3. If the same source type keeps needing the same reframe — create a shortcut template
