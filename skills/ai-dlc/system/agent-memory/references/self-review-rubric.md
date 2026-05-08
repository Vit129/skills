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
| Skill performance | Tool outputs + results | → Flag or clear in `memory.md` |
| Knowledge gap | Missing pattern that would have helped | → Propose in `skill-log.md` |
| Memory staleness | Task_Ledger entries | → Mark stale or remove |

## Save/Discard Rubric (for drafts)

Score each draft on 3 criteria (yes/no):

| # | Criterion | Question |
|---|-----------|----------|
| 1 | **Novel** | Is this a new pattern not already in playbook or knowledge? |
| 2 | **Recurrent** | Could this problem happen again (not a one-off typo)? |
| 3 | **Non-trivial** | Did it take >1 attempt to solve, or would it waste >5 min next time? |

**Gate: 2/3 = save to playbook. 1/3 or 0/3 = discard.**

## Skill Flag Rubric

After each write operation, evaluate the skill that produced the output:

| Signal | Action |
|--------|--------|
| Output has errors requiring rework | Add/update Skill_Flag (failure description) |
| Output is correct, skill was flagged | Increment success counter |
| Success counter reaches 3 | Clear the flag |

## Skill Improvement Rubric

After each task, evaluate if a skill could be improved:

| Signal | Score | Action |
|--------|-------|--------|
| Skill was loaded but missing a pattern that would have helped | High | Propose addition in `skill-log.md` |
| Skill has outdated info that caused confusion | High | Propose update in `skill-log.md` |
| Skill worked perfectly | — | No action |
| Minor style preference | Low | Skip — not worth a proposal |

**Proposal threshold:** Only propose if the improvement would save 5+ minutes on next occurrence.

## Memory Consolidation Rubric

At session end, check `memory.md`:

| Check | Action |
|-------|--------|
| Byte count > 2,500 | Remove oldest stale Task_Ledger entry |
| Task_Ledger entry not updated in 3+ sessions | Mark as stale |
| All 5 Task_Ledger slots full + new task needed | Prompt user to archive one |
| Recent_Lessons > 5 entries | Trim to 5 (keep most recent) |
| Decisions_In_Force superseded | Remove old decision |

## Review Fork Constraints

- **Scoped toolsets:** memory + skills read/write only
- **No shell access:** cannot run commands
- **No web access:** cannot fetch external data
- **Max 1 proposal per skill per session:** prevents spam
- **Evidence required:** every proposal must cite the specific moment/output that triggered it

## Anti-Patterns

- ❌ Free-form "should I save this?" — use the rubric
- ❌ Saving every minor observation — gate with 2/3 criteria
- ❌ Proposing skill changes without evidence — cite the failure
- ❌ Flagging skills for style preferences — only flag for functional failures
