# Self-Review Rubric

Rubric-based evaluation for the background review fork (self-improvement loop).
After each turn/task, the agent evaluates what to save using this rubric — not free-form judgment.

## When This Runs

- After each completed task (postTaskExecution hook)
- At session end (agentStop hook)
- The review is scoped to memory + skills only (no shell, no web access)

## What Gets Reviewed

| Item | Source | Decision |
|------|--------|----------|
| Problem resolution | Current session context | → Draft in `drafts/` if criteria met |
| Skill performance | Tool outputs + results | → Flag in `CONTEXT.md` or clear |
| Knowledge gap | Missing pattern that would have helped | → Propose in `SKILL-LOG.md` |
| Memory staleness | CONTEXT.md task entries | → Mark stale or remove |
| Confirmed decision | Choices made this session | → Append to `MEMORY.md` Decisions |

## Save/Discard Rubric (for drafts)

Score each draft on 3 criteria (yes/no):

| # | Criterion | Question |
|---|-----------|----------|
| 1 | **Novel** | Is this a new pattern not already in PLAYBOOK.md or knowledge? |
| 2 | **Recurrent** | Could this problem happen again (not a one-off typo)? |
| 3 | **Non-trivial** | Did it take >1 attempt to solve, or would it waste >5 min next time? |

**Gate: 2/3 = save to PLAYBOOK.md. 1/3 or 0/3 = discard.**

## Skill Flag Rubric

After each write operation, evaluate the skill that produced the output:

| Signal | Action |
|--------|--------|
| Output has errors requiring rework | Add/update flag in `CONTEXT.md` (failure description) |
| Output is correct, skill was flagged | Increment success counter in `CONTEXT.md` |
| Success counter reaches 3 | Clear the flag from `CONTEXT.md` |
| Recurring flag (3+ sessions) | Promote to `MEMORY.md` as a lesson |

## Skill Improvement Rubric

After each task, evaluate if a skill could be improved:

| Signal | Score | Action |
|--------|-------|--------|
| Skill was loaded but missing a pattern that would have helped | High | Propose addition in `SKILL-LOG.md` |
| Skill has outdated info that caused confusion | High | Propose update in `SKILL-LOG.md` |
| Skill worked perfectly | — | No action |
| Minor style preference | Low | Skip — not worth a proposal |

**Proposal threshold:** Only propose if the improvement would save 5+ minutes on next occurrence.

## Memory Consolidation Rubric

At session end, evaluate `CONTEXT.md`:

| Check | Action |
|-------|--------|
| Byte count > 2,500 | Remove oldest stale task entry |
| Task entry not updated in 3+ sessions | Mark as stale |
| All 5 task slots full + new task needed | Prompt user to archive one |
| Open Question unresolved for 2+ sessions | Escalate to user or document assumption |
| Confirmed decision or lesson | Append to `MEMORY.md` (not CONTEXT.md) |

**Rule:** `CONTEXT.md` is session-scoped — reset at session end. `MEMORY.md` is permanent — append only.

## Review Fork Constraints

- **Scoped toolsets:** memory + skills read/write only
- **No shell access:** cannot run commands
- **No web access:** cannot fetch external data
- **Inherits parent runtime:** uses same model/provider as main session
- **Max 1 proposal per skill per session:** prevents spam
- **Evidence required:** every proposal must cite the specific moment/output that triggered it

## Anti-Patterns

- ❌ Free-form "should I save this?" — use the rubric
- ❌ Saving every minor observation — gate with 2/3 criteria
- ❌ Proposing skill changes without evidence — cite the failure
- ❌ Flagging skills for style preferences — only flag for functional failures
- ❌ Reviewing other agents' outputs — only review your own session
- ❌ Writing decisions into `CONTEXT.md` — decisions go into `MEMORY.md`
- ❌ Overwriting `MEMORY.md` — it is append-only; only add new entries
