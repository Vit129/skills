# Session Flow & Save/Discard Gate (v2)

> v2 change: `memory.md` → `CONTEXT.md` (hot state, rewritten) + `MEMORY.md` (append-only decisions/lessons)

## Session Lifecycle

```text
Session Start (promptSubmit hook v3.1 — first prompt only)
  → Read CONTEXT.md (Now: active task, Open Questions, Key Files)
  → Read MEMORY.md (Decisions, Lessons — for persistent context)
  → Read USER-PROFILE.md (preferences, style, IDE)
  → Search PLAYBOOK.md for cases matching active task domain/triggers
  → Proceed with user's request

Mid-Session Work
  → Agent resolves problem → create draft in drafts/ immediately
  → Agent updates CONTEXT.md (Now section) as task state changes
  → Agent appends to MEMORY.md only when a decision/lesson is confirmed

Checkpoint (postTaskExecution hook v1.0)
  → Refresh task status in CONTEXT.md (Now section)
  → Create draft in drafts/ if problem resolved during task
  → Report: 📝 Checkpoint: [files updated]

Skill Check (postToolUse write hook v1.0)
  → Evaluate skill correctness after write
  → Flag in CONTEXT.md (session-scoped, cleared at session end)
  → Report: 📝 Skill flag: [skill] [added/updated/cleared]

Skill Evolve (postTaskExecution hook v1.0)
  → Check SKILL-LOG.md for pending proposals matching this domain
  → If task used a skill successfully + pattern missing from skill → propose
  → If skill was flagged + this was success → increment success counter
  → Report: 📝 Skill evolve: [proposed/applied/flag cleared]

Knowledge Curation (agentStop hook v1.0 — runs before session-save)
  → Auto-promote: PLAYBOOK.md cases with Applied >= 3 → knowledge/{case-id}.md
  → Auto-crystallize: 3+ knowledge files same domain + keyword → {domain}-pattern.md
  → Archive: Applied+Prevented >= 5 AND no use 30 days → archive-playbook.md
  → Consolidate: if CONTEXT.md > 2,500 bytes → trim stale task entries
  → Subagent delegation: use when 5+ playbook cases OR 3+ knowledge files same domain
  → Report: 📝 Knowledge curated: [promoted N, crystallized N, archived N]

Session Save (agentStop hook v4.0 — runs after knowledge-curate)
  → Check if meaningful changes occurred
  → If Q&A only → 📝 No memory changes
  → If changes occurred:
    1. Rewrite CONTEXT.md (Now → reset to "None active", clear resolved questions, add session note)
    2. Append new decisions/lessons to MEMORY.md
    3. Evaluate drafts through Save/Discard Gate
    4. Passing drafts → append to PLAYBOOK.md, delete draft
    5. Failing drafts → delete draft
    6. Score increment: Applied++ / Prevented++
    7. Skill proposals → note in SKILL-LOG.md
    8. Evolution nudges (pending proposals, underperforming skills)
    9. Report: 📝 Session saved: [summary]
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
| Session Load | `promptSubmit` (first only) | reads: CONTEXT.md, MEMORY.md, USER-PROFILE.md, PLAYBOOK.md |
| Checkpoint | `postTaskExecution` | writes: CONTEXT.md, drafts/ |
| Skill Check | `postToolUse` (write) | writes: CONTEXT.md (session flags) |
| Skill Evolve | `postTaskExecution` | writes: SKILL-LOG.md |
| Knowledge Curate | `agentStop` | writes: PLAYBOOK.md, knowledge/; deletes: drafts/ |
| Session Save | `agentStop` | writes: CONTEXT.md (reset), MEMORY.md (append), PLAYBOOK.md, SKILL-LOG.md |

## CONTEXT.md vs MEMORY.md — When to Write Where

| Situation | File | Action |
|-----------|------|--------|
| Task starts / status changes | `CONTEXT.md` | Update `Now` section inline |
| New question arises mid-session | `CONTEXT.md` | Add to `Open Questions` |
| Question resolved | `CONTEXT.md` | Remove from `Open Questions` |
| Decision confirmed (will persist across sessions) | `MEMORY.md` | Append to `Decisions` section |
| Lesson learned from a resolved problem | `MEMORY.md` | Append to `Lessons` section as CASE-xxx |
| Session ends | `CONTEXT.md` | Reset `Now` to idle; clear resolved Qs; add session note |

## Meaningful Changes (triggers Session Save)

Save when any of these occurred:
- Task progress (status changed in CONTEXT.md)
- New decision made (appended to MEMORY.md Decisions)
- Problem resolved (draft created)
- Skill flagged or cleared

Skip when session was only:
- Q&A / comparison / research
- Exploration without decisions
- Reading files without changes
