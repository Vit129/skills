# Session Flow & Save/Discard Gate

## Session Lifecycle

```text
Session Start (promptSubmit hook v3.1 — first prompt only)
  → Search PLAYBOOK.md for cases matching active task domain/triggers
  → Proceed with user's request

Mid-Session Work
  → Agent resolves problem → create draft in drafts/ immediately

Skill Evolve (postTaskExecution hook v1.0)
  → Check SKILL-LOG.md for pending proposals matching this domain
  → If task used a skill successfully + pattern missing from skill → propose
  → If skill was flagged + this was success → increment success counter
  → Report: 📝 Skill evolve: [proposed/applied/flag cleared]

Knowledge Curation (agentStop hook v1.0 — runs before session-save)
  → Auto-promote: PLAYBOOK.md cases with Applied >= 3 → knowledge/{case-id}.md
  → Auto-crystallize: 3+ knowledge files same domain + keyword → {domain}-pattern.md
  → Archive: Applied+Prevented >= 5 AND no use 30 days → archive-playbook.md
  → Subagent delegation: use when 5+ playbook cases OR 3+ knowledge files same domain
  → Report: 📝 Knowledge curated: [promoted N, crystallized N, archived N]

Session Save (agentStop hook v4.0 — runs after knowledge-curate)
  → Check if meaningful changes occurred
  → If Q&A only → 📝 No memory changes
  → If changes occurred:
    1. Evaluate drafts through Save/Discard Gate
    2. Passing drafts → append to PLAYBOOK.md, delete draft
    3. Failing drafts → delete draft
    4. Score increment: Applied++ / Prevented++
    5. Skill proposals → note in SKILL-LOG.md
    6. Evolution nudges (pending proposals, underperforming skills)
    7. Report: 📝 Session saved: [summary]
```

## Save/Discard Gate

Evaluate each draft against 3 criteria:

| Criterion | Question | Score |
|-----------|----------|-------|
| **Novel** | Not already covered by an existing PLAYBOOK.md case? | +1 if yes |
| **Likely to recur** | Will this problem pattern appear again? | +1 if yes |
| **Non-trivial** | Was the fix more than a simple retry or typo fix? | +1 if yes |

**Score >= 2** → proceed to Evidence Gate
**Score < 2** → delete the draft

## Evidence Gate

| Task Type | Evidence Required |
|-----------|-------------------|
| Coding (AIDLC-governed) | Test pass or build pass |
| Non-coding (finance, fitness, accounting) | User approval or verified outcome |

**Pass** → append to PLAYBOOK.md + delete draft
**No evidence yet** → keep draft for next evaluation cycle

## Hooks Summary

| Hook | Event | Files Touched |
|------|-------|---------------|
| Session Load | `promptSubmit` (first only) | reads: PLAYBOOK.md |
| Skill Evolve | `postTaskExecution` | writes: SKILL-LOG.md |
| Knowledge Curate | `agentStop` | writes: PLAYBOOK.md, knowledge/; deletes: drafts/ |
| Session Save | `agentStop` | writes: PLAYBOOK.md, SKILL-LOG.md |

## Meaningful Changes (triggers Session Save)

Save when any of these occurred:
- New decision made (appended to PLAYBOOK.md)
- Problem resolved (draft created)
- Skill flagged or cleared

Skip when session was only:
- Q&A / comparison / research
- Exploration without decisions
- Reading files without changes
