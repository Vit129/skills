# Agent Memory Lifecycle Protocol

> Single source of truth. Symlinked into each project as `.ai/memory-protocol.md`.
> All agents (Claude, Codex, Gemini, Kiro) read this via `@.ai/memory-protocol.md`.

## Task Start (MANDATORY)

1. Read `agent-memory/CONTEXT.md` → current task, active plan, key files
2. Read `agent-memory/MEMORY.md` → active decisions + lessons
3. If task matches known pattern → read `agent-memory/PLAYBOOK.md`
4. If task involves a specific domain → read `agent-memory/knowledge/{topic}.md`

## During Task

- Update `agent-memory/CONTEXT.md` with progress, blockers, key files touched
- New decision made → append to `agent-memory/MEMORY.md` (date-prefixed)
- Hit+solved a reusable pattern → add CASE-xxx to `agent-memory/PLAYBOOK.md`
- New domain knowledge → write/update `agent-memory/knowledge/{topic}.md`

## Task End (MANDATORY)

1. Rewrite `agent-memory/CONTEXT.md` with next-task state (or clear if done)
2. Append final decisions/lessons to `agent-memory/MEMORY.md`
3. If MEMORY.md > 100 lines → archive oldest entries to `agent-memory/COMPLETED-TASKS-ARCHIVE.md`
4. Update `agent-memory/INDEX.md` if new plans/knowledge files were created

## File Reference

| File | Purpose | Update frequency |
|------|---------|-----------------|
| `CONTEXT.md` | Active task state | Every task start/end |
| `MEMORY.md` | Decisions + lessons (append-only) | When decisions made |
| `PLAYBOOK.md` | Reusable fix patterns (CASE-xxx) | When pattern solved |
| `INDEX.md` | Catalog of plans + knowledge | When new files created |
| `USER-PROFILE.md` | User preferences (stable) | Rarely |
| `SKILL-LOG.md` | Skill improvements | After learning |
| `knowledge/{topic}.md` | Domain reference | When domain insight gained |
| `plans/{feature}.md` | Feature plans | During planning |
