# Agent Memory Subagent Patterns

Use `agent-memory` as a utility-style subagent, not as the main reasoning agent.

## Why This Skill Fits Subagents

- The work is bounded and operational.
- The outputs are file-oriented and easy to verify.
- The task often appears as side work after the main task is done.
- The main agent should avoid spending context on housekeeping.

## When to Delegate vs Inline

| Condition | Action |
|-----------|--------|
| 5+ playbook cases | Delegate to subagent |
| 3+ knowledge files same domain | Delegate to subagent |
| Simple append or single-file update | Do inline |
| Short session with no durable learnings | Skip entirely |

## Recommended Utility Subagents

### 1. `memory-curator`

Use when:
- A task or session just completed
- `CONTEXT.md` is getting noisy or near 2,500 bytes
- A useful lesson should be saved to `MEMORY.md`

Responsibilities:
- Read `CONTEXT.md`, `MEMORY.md`, `USER-PROFILE.md`, `PLAYBOOK.md`, and `SKILL-LOG.md`
- Propose the minimal updates needed
- Consolidate `CONTEXT.md` if near the 2,500 byte limit
- Identify candidate lessons for `MEMORY.md` or `PLAYBOOK.md`
- Reset `CONTEXT.md` Now section at session end

Expected output:
- Short summary of changes
- Files to update
- Any follow-up questions only if strictly necessary

### 2. `memory-bootstrapper`

Use when:
- Starting a new project
- Resetting the memory structure
- Recreating missing memory files

Responsibilities:
- Create the base `agent-memory/` structure
- Ensure required files exist: `CONTEXT.md`, `MEMORY.md`, `PLAYBOOK.md`, `SKILL-LOG.md`, `USER-PROFILE.md`
- Apply the standard templates from `references/templates/`
- Create `knowledge/`, `plans/`, `drafts/` subdirectories

Expected output:
- Created file list
- Missing optional folders, if any

### 3. `knowledge-promoter`

Use when:
- A fix or pattern has been reused several times (Applied >= 3)
- Multiple related lessons should be grouped into `knowledge/`
- 3+ promoted files share same domain (crystallization candidate)

Responsibilities:
- Scan PLAYBOOK.md rows for promotion candidates (Applied >= 3)
- Create `knowledge/{case-id}.md` with full detail
- Detect domain clusters for crystallization
- Create `knowledge/{domain}-pattern.md` when 3+ files share domain + keyword
- Archive cases with Applied+Prevented >= 5 AND no use in 30 days
- Archive zero-score cases older than 30 days

Expected output:
- Promotion candidates + actions taken
- Crystallization candidates + actions taken
- Archive candidates + actions taken

### 4. `skill-evolution-checker`

Use when:
- A skill was used successfully and the pattern might be missing from the skill file
- SKILL-LOG.md has pending proposals that need review

Responsibilities:
- Compare the approach used in this session with the skill file content
- If a novel, reusable, evidence-backed pattern is missing → propose in SKILL-LOG.md
- If a pending proposal has evidence from 2+ sessions → recommend auto-apply

Expected output:
- Proposals created or recommended for auto-apply
- Rationale for each

## Invocation Pattern

Recommended flow:

1. Main agent finishes the primary task
2. Main agent spawns a utility subagent with a narrow scope
3. Subagent reads only memory files
4. Subagent returns a compact update plan or applies the scoped edits
5. Main agent verifies and resumes the primary thread

## Scope Rules

- Read scope: `agent-memory/**`
- Write scope: only the files requested or clearly implied by the task
- Never touch source code or unrelated project files
- Never store secrets, credentials, or PII

## Cost Guidance

Good value:
- End-of-session cleanup with 5+ playbook cases
- Knowledge promotion/crystallization with 3+ files
- Memory consolidation when CONTEXT.md near capacity

Poor value:
- Short sessions with no durable learnings
- Running after every minor turn
- Using a subagent when a single append is enough

## Suggested Prompt Skeleton

```text
You are a utility subagent for the agent-memory system (v2).

Task:
- Curate/update the memory files for this completed task/session.

Read first:
- agent-memory/CONTEXT.md      ← current session state (rewrite at end)
- agent-memory/MEMORY.md       ← append-only decisions + lessons
- agent-memory/USER-PROFILE.md ← user preferences (stable)
- agent-memory/PLAYBOOK.md     ← problem cases (append + score)
- agent-memory/SKILL-LOG.md    ← skill proposals (append-only)

Constraints:
- Stay within agent-memory files only.
- Keep edits minimal and structured.
- CONTEXT.md: rewrite Now section; only append to Open Questions if unresolved.
- MEMORY.md: append-only — never overwrite existing entries.
- Do not invent lessons that are not supported by this session.

Return:
- What changed
- Why it changed
- Any promotion/crystallization candidates
```
