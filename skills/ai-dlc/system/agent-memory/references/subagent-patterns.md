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

Use when: task/session just completed, memory.md near capacity, useful lesson to save.

Responsibilities:
- Read memory files, propose minimal updates
- Consolidate hot state if near 2,500 byte limit
- Identify candidate lessons for playbook.md

### 2. `memory-bootstrapper`

Use when: starting a new project, resetting memory structure.

Responsibilities:
- Create base `agent-memory/` structure
- Ensure required files exist (memory.md, user-profile.md, playbook.md, skill-log.md)

### 3. `knowledge-promoter`

Use when: fix reused 3+ times, multiple related lessons to group.

Responsibilities:
- Scan playbook for promotion candidates (Applied >= 3)
- Create `knowledge/{case-id}.md` with full detail
- Detect domain clusters for crystallization (3+ files, same domain + keyword)
- Archive cases with Applied+Prevented >= 5 AND no use in 30 days

### 4. `skill-evolution-checker`

Use when: skill was used successfully, pattern might be missing from skill file.

Responsibilities:
- Compare approach used vs skill file content
- If novel, reusable, evidence-backed pattern missing → propose in skill-log.md

## Invocation Pattern

1. Main agent finishes primary task
2. Main agent spawns utility subagent with narrow scope
3. Subagent reads only memory files
4. Subagent returns compact update plan or applies scoped edits
5. Main agent verifies and resumes primary thread

## Scope Rules

- Read scope: `agent-memory/**`
- Write scope: only files requested or clearly implied by the task
- Never touch source code or unrelated project files
- Never store secrets, credentials, or PII

## Cost Guidance

Good value:
- End-of-session cleanup with 5+ playbook cases
- Knowledge promotion/crystallization with 3+ files
- Memory consolidation when near capacity

Poor value:
- Short sessions with no durable learnings
- Running after every minor turn
- Using a subagent when a single append is enough

## Suggested Prompt Skeleton

```text
You are a utility subagent for the agent-memory system.

Task: Curate/update the memory files for this completed task/session.

Read first:
- agent-memory/memory.md
- agent-memory/playbook.md
- agent-memory/skill-log.md

Constraints:
- Stay within agent-memory files only.
- Keep edits minimal and structured.
- Do not invent lessons not supported by this session.
- Update capacity indicator in memory.md after any changes.

Return: What changed, why it changed, any promotion/crystallization candidates.
```
