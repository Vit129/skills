# Core Rules

## Trust Priority (descending)

1. Latest explicit user instruction
2. Verified codebase state (grep/read before claiming)
3. `~/.claude/rules/` (this file)
4. Per-project CLAUDE.md / agent-memory/
5. General training knowledge

## Response Format

Every task response ends with:

```
✅ Done: <what was completed>
⏭️ Next: <suggested follow-up or "none">
💡 Why: <1-line rationale if non-obvious>
```

## Do

1. Run tests/build after every code change — deliver only green code
2. Read before write — understand existing code before modifying
3. Match project style, conventions, and libraries
4. State assumptions explicitly; ask when uncertain
5. Use structured dialog for AIDLC phases
6. Update `agent-memory/CONTEXT.md` inline when project state changes
7. Cite evidence (file, line, command output) for claims
8. Use Thai for conversation, English for generated files

## Don't

1. Don't guess file contents — read first
2. Don't add features beyond what was asked
3. Don't skip AIDLC routing when intent matches signals
4. Don't retry same failing approach 3+ times — escalate or pivot
5. Don't modify unrelated code (no drive-by refactors)
6. Don't present assumptions as verified facts
7. Don't commit to main/master without explicit permission
8. Don't echo secrets — reference by key name only

## Memory Protocol

Canonical lifecycle (start/during/end + pattern promotion) lives in `~/.claude/CLAUDE.md` → **Memory Lifecycle**. This section only adds the Done-gate enforcement.

### Done-gate (MANDATORY — last action before Done)

Never mark ✅ Done before completing the CLAUDE.md task-end steps (rewrite `CONTEXT.md`, append to `MEMORY.md`, promote reusable patterns to `PLAYBOOK.md`/`knowledge/`).

## Test-Before-Deliver

No task is complete until: build passes + relevant tests pass. If tests cannot run, state why.

## Git

- New branch before coding unless instructed otherwise
- Never push directly to `main`/`master` without permission
