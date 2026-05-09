# Session Flow & Save/Discard Gate

## Session Lifecycle

```text
Session Start (promptSubmit hook v3.1 — first prompt only)
  → Read memory.md (Task_Ledger, Skill_Flags, Decisions, Recent_Lessons)
  → Read user-profile.md (preferences, style, IDE)
  → Search playbook.md for cases matching active task domain/triggers
  → Proceed with user's request

Mid-Session Work
  → Agent resolves problem → create draft in drafts/ immediately
  → Agent updates Task_Ledger, Decisions_In_Force as state changes

Checkpoint (postTaskExecution hook v1.0)
  → Refresh Task_Ledger status in memory.md
  → Create draft if problem resolved during task
  → Report: 📝 Checkpoint: [files updated]

Skill Check (postToolUse write hook v1.0)
  → Evaluate skill correctness after write
  → Add/update/clear Skill_Flag in memory.md
  → Report: 📝 Skill flag: [skill] [added/updated/cleared]

Skill Evolve (postTaskExecution hook v1.0)
  → Check skill-log.md for pending proposals matching this domain
  → If task used a skill successfully + pattern missing from skill → propose
  → If Skill_Flag exists + this was success → increment success counter
  → Report: 📝 Skill evolve: [proposed/applied/flag cleared]

Knowledge Curation (agentStop hook v1.0 — runs before session-save)
  → Auto-promote: playbook cases with Applied >= 3 → knowledge/{case-id}.md
  → Auto-crystallize: 3+ knowledge files same domain + keyword → {domain}-pattern.md
  → Archive: Applied+Prevented >= 5 AND no use 30 days → archive-playbook.md
  → Consolidate: if memory.md > 2,500 bytes → trim stale entries
  → Subagent delegation: use when 5+ playbook cases OR 3+ knowledge files same domain
  → Report: 📝 Knowledge curated: [promoted N, crystallized N, archived N]

Session Save (agentStop hook v4.0 — runs after knowledge-curate)
  → Check if meaningful changes occurred
  → If Q&A only → 📝 No memory changes
  → If changes occurred:
    1. Final refresh memory.md (all sections) + update capacity indicator
    2. Evaluate drafts through Save/Discard Gate
    3. Passing drafts → append to playbook.md, delete draft
    4. Failing drafts → delete draft
    5. Score increment: Applied++ / Prevented++
    6. Skill proposals → note in skill-log.md
    7. Evolution nudges (pending proposals, underperforming skills)
    8. Report: 📝 Session saved: [summary]
```

## Save/Discard Gate

Evaluate each draft against 3 criteria:

| Criterion | Question | Score |
|-----------|----------|-------|
| **Novel** | Not already covered by an existing playbook case? | +1 if yes |
| **Likely to recur** | Will this problem pattern appear again? | +1 if yes |
| **Non-trivial** | Was the fix more than a simple retry or typo fix? | +1 if yes |

**Score >= 2** → proceed to Evidence Gate
**Score < 2** → delete the draft

## Evidence Gate

| Task Type | Evidence Required |
|-----------|-------------------|
| Coding (AIDLC-governed) | Test pass or build pass |
| Non-coding (finance, fitness, accounting) | User approval or verified outcome |

**Pass** → append to playbook.md + delete draft
**No evidence yet** → keep draft for next evaluation cycle

## Hooks Summary

| Hook | Event | Files Touched |
|------|-------|---------------|
| Session Load | `promptSubmit` (first only) | reads: memory.md, playbook.md |
| Checkpoint | `postTaskExecution` | writes: memory.md, drafts/ |
| Session Save | `agentStop` | writes: memory.md, playbook.md, skill-log.md; deletes: drafts/ |
| Skill Check | `postToolUse` (write) | writes: memory.md (Skill_Flags) |

## Meaningful Changes (triggers Session Save)

Save when any of these occurred:
- Task progress (status changed in Task_Ledger)
- New decision made (added to Decisions_In_Force)
- Problem resolved (draft created)
- Skill flagged or cleared

Skip when session was only:
- Q&A / comparison / research
- Exploration without decisions
- Reading files without changes
