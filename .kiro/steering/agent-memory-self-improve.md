---
inclusion: auto
---

# Agent Memory — Self-Improve Rules

You have persistent memory files that you can write to **at any time during a session**.

## Memory Location

```text
agent-memory/
├── memory.md          ← Hot state (2.5KB max, loaded first) — task/project context
├── user-profile.md    ← User preferences (stable, loaded at session start)
├── playbook.md        ← Flat problem resolution table
├── skill-log.md       ← Append-only skill improvement log
├── drafts/            ← Temporary resolution drafts (ephemeral)
└── knowledge/         ← Optional detail files (on-demand)
    ├── index.md       ← Searchable master index (tags, edges, scores)
    └── archive-playbook.md  ← Zero-score cases older than 30 days
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
`search-index.md`, `evolution.md`, `index.md`,
or any subdirectories within `agent-memory/` beyond `drafts/` and `knowledge/`.

## Playbook Scoring

When using a playbook case during a session:
- **Applied++**: the case's fix was actively used
- **Prevented++**: recognizing the trigger helped avoid the problem

Auto-promote: `Applied >= 3` → move case to `knowledge/{case-id}.md` with full detail. Remove from playbook.

Archive: `Applied + Prevented >= 5` AND no use in 30 days → move to `knowledge/archive-playbook.md`.

## Crystallization

When 3+ promoted knowledge files share the same domain AND at least one trigger keyword → auto-create `knowledge/{domain}-pattern.md`.
Report the crystallization. No user confirmation needed — safeguard is keyword overlap.

## Do Not Store

Never record: secrets/credentials, raw chat transcripts, chain-of-thought reasoning, speculative notes without evidence.

## Skill Self-Evolution

Skills improve through a closed loop:

1. **Detect**: postToolUse (write) hook flags underperforming skills → Skill_Flags in memory.md
2. **Propose**: postTaskExecution hook checks if a working pattern is missing from the skill file → appends to skill-log.md with status=proposed
3. **Apply**: user says "apply skill proposal" OR agent auto-applies when proposal has evidence from 2+ sessions → update the skill file, set status=applied
4. **Verify**: next use of the skill — if improved, clear Skill_Flag (3 successes). If still failing, keep flag.

Rules:
- Max 1 proposal per skill per session (prevent noise)
- Proposals must be evidence-backed: the pattern worked in this session
- Never modify a skill file without a proposal in skill-log.md first
- Auto-apply only when: proposal has evidence from 2+ sessions AND no user objection

## Knowledge from Lessons Learned

Lessons flow through a pipeline: draft → playbook → knowledge → pattern

```text
Problem resolved → drafts/{id}.md (ephemeral)
    ↓ Save/Discard Gate (2/3 criteria)
playbook.md (scored: Applied/Prevented)
    ↓ Applied >= 3
knowledge/{case-id}.md (promoted, permanent)
    ↓ 3+ files same domain + keyword overlap
knowledge/{domain}-pattern.md (crystallized)
```

Rules:
- Drafts are created immediately when a problem is resolved mid-session
- Playbook cases are scored every session they're relevant
- Promotion is automatic at Applied >= 3 — no user confirmation needed
- Crystallization is automatic at 3+ promoted files per domain — safeguard is keyword overlap
- Archive: Applied+Prevented >= 5 AND no use in 30 days → knowledge/archive-playbook.md
- Zero-score cases (Applied=0, Prevented=0) older than 30 days → archive

## Subagent Delegation

Use subagents for memory housekeeping when the workload justifies it:

- **5+ playbook cases** or **3+ knowledge files same domain** → delegate to subagent
- Otherwise do curation inline (cheaper, faster)
- Subagent scope: read/write only `agent-memory/**` — never touch source code
- Subagent tasks: promote, crystallize, archive, consolidate memory.md

## Knowledge Index (Session Search Lite)

`knowledge/index.md` is a searchable master index of all knowledge files.

Format:
```markdown
| File | Domain | Tags | Score (A/P) | Summary |
```

Rules:
- Session-load hook scans Tags column for keyword matches against user prompt
- Load ONLY matching knowledge files — never preload all
- Update index.md whenever a knowledge file is created, promoted, or archived
- Knowledge-curate hook auto-updates index after promotion/crystallization
- Tags should be comma-separated lowercase keywords (max 10 per file)
- Edges table tracks related knowledge files for cross-domain discovery
