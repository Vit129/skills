---
inclusion: auto
---

# Agent Memory — Self-Improve Rules

You have persistent memory files that you can write to **at any time during a session**.

## Memory Location

```text
agent-memory/
├── memory.md        ← Hot state (2.5KB max, loaded first)
├── playbook.md      ← Flat problem resolution table
├── skill-log.md     ← Append-only skill improvement log
├── drafts/          ← Temporary resolution drafts (ephemeral)
└── knowledge/       ← Optional detail files (on-demand)
```

## When to Write Mid-Session

Write immediately when:

1. **Problem resolved** → create draft in `agent-memory/drafts/`
2. **Task status changed** → update Task_Ledger in `memory.md`
3. **Decision made** → add to Decisions_In_Force in `memory.md`
4. **Skill underperformed** → add Skill_Flag in `memory.md`
5. **Skill flag cleared** (3 successes) → remove from `memory.md`

## Save/Discard Gate (for drafts)

Before promoting a draft to playbook.md, evaluate 3 criteria:

- **Novel**: not already covered by an existing case
- **Likely to recur**: the problem pattern may appear again
- **Non-trivial**: the fix is not obvious or single-step

Score >= 2/3 → proceed to Evidence Gate.
Score < 2/3 → delete the draft.

Evidence Gate:

- Coding: test pass or build pass required
- Non-coding: user approval or verified outcome required

## Bounded State

If `memory.md` exceeds 2,500 bytes → consolidate before adding:

- Remove oldest stale Task_Ledger entry (stale = 3 sessions without update)
- Remove lowest-priority Skill_Flag (most successes since flagging)
- Trim Recent_Lessons to 5 entries

## Task_Ledger Formats

- **Coding**: `system/feature/phase/status` (references `.aidlc/` but does NOT duplicate PROGRESS.md)
- **Non-coding**: `domain/goal/status` (no `.aidlc/` folder)

## What NOT to Create

Do NOT create: `palace/`, `graph.md`, `tunnels.md`,
`search-index.md`, `user-profile.md`, `evolution.md`, `index.md`,
or any subdirectories within `agent-memory/` beyond `drafts/` and `knowledge/`.

## Playbook Scoring

When using a playbook case during a session:
- **Applied++**: the case's fix was actively used
- **Prevented++**: recognizing the trigger helped avoid the problem

Archive: `Applied + Prevented >= 5` AND no use in 30 days → move to `knowledge/archive-playbook.md`.

## Crystallization

When 3+ playbook cases share the same domain → suggest merging to `knowledge/{domain}-pattern.md`.
Report the suggestion. Do NOT auto-create — wait for user confirmation.

## Do Not Store

Never record: secrets/credentials, raw chat transcripts, chain-of-thought reasoning, speculative notes without evidence.
