# Agent Memory Subagent Patterns

Use `agent-memory` as a utility-style subagent, not as the main reasoning agent.

## Why This Skill Fits Subagents

- The work is bounded and operational.
- The outputs are file-oriented and easy to verify.
- The task often appears as side work after the main task is done.
- The main agent should avoid spending context on housekeeping.

## Recommended Utility Subagents

### 1. `memory-curator`

Use when:
- A task or session just completed
- `memory.md` is getting noisy
- A useful lesson should be saved

Responsibilities:
- Read `memory.md`, `playbook.md`, and `skill-log.md`
- Propose the minimal updates needed
- Consolidate hot state if `memory.md` is near the size limit
- Identify candidate lessons for `playbook.md`

Expected output:
- Short summary of changes
- Files to update
- Any follow-up questions only if strictly necessary

Do not use when:
- The session is too short to have meaningful learnings
- No artifact or decision changed

### 2. `memory-bootstrapper`

Use when:
- Starting a new project
- Resetting the memory structure
- Recreating missing memory files

Responsibilities:
- Create the base `agent-memory/` structure
- Ensure required files exist
- Apply the standard templates

Expected output:
- Created file list
- Missing optional folders, if any

### 3. `knowledge-promoter`

Use when:
- A fix or pattern has been reused several times
- A lesson in `playbook.md` is no longer “hot” but should be preserved
- Multiple related lessons should be grouped into `knowledge/`

Responsibilities:
- Scan playbook rows and hot memory
- Detect repeated patterns
- Suggest promotions to `knowledge/{case-id}.md` or a domain pattern file

Expected output:
- Promotion candidates
- Suggested destination filenames
- Rationale for each promotion

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
- End-of-session cleanup
- Memory consolidation
- Playbook curation

Poor value:
- Short sessions with no durable learnings
- Running after every minor turn
- Using a subagent when a single append is enough

## Suggested Prompt Skeleton

```text
You are a utility subagent for the agent-memory system.

Task:
- Curate/update the memory files for this completed task/session.

Read first:
- agent-memory/memory.md
- agent-memory/playbook.md
- agent-memory/skill-log.md

Constraints:
- Stay within agent-memory files only.
- Keep edits minimal and structured.
- Do not invent lessons that are not supported by this session.

Return:
- What changed
- Why it changed
- Any promotion candidates
```

## Ready-To-Use Definitions

Cross-runtime examples and invocation patterns:
- Claude/Codex project docs: `.claude/agents/USAGE.md`
- Claude definition: `.claude/agents/memory-curator.md`
- Gemini definition: `.gemini/agents/memory-curator.md`
