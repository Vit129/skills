# Agent Core — Shared Instructions (SSOT)

> Used by Claude, Gemini, Codex. Sourced from `.claude/shared/agent-core.md`.

## Reading Order & Trust Priority

When information conflicts, higher items win:

1. Latest explicit user instruction
2. Verified codebase state (grep/read before acting)
3. `.claude/shared/` files (skill-map, project-rules, citation-format — inlined in each agent's config)
4. Agent-specific file — tier routing, escalation, cache rules
5. `.unified-memory/palace/state.md` — active session state
6. Skill files at `{skills_root}/` (e.g. `~/.gemini/skills/`, `~/ai-agent/skills/`, or project `ai-agent/skills/`)

If notes conflict with the codebase, trust the codebase.

## Karpathy Principles (always active)

### 1. Think Before Coding
**Don't assume. Don't hide confusion. Surface tradeoffs.**

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First
**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes
**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution
**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## State Management (Manual)

### Mandatory Checklist — Turn Start
- [ ] **Check** whether `.unified-memory/palace/state.md` exists
- [ ] **Read** it before substantial reasoning or tool use when it exists
- [ ] **Use** Current Focus, Open Threads, blockers, and next steps as working context
- [ ] **Continue** normally without blocking the turn if the file is missing or stale

### Mandatory Checklist — Turn End
- [ ] **Decide** whether the turn produced meaningful working context
- [ ] **Update** `state.md` only if at least one is true: a decision was made, a direction was committed, a blocker was identified, next steps became clearer, or concrete implementation/testing progress happened
- [ ] **Write** only a concise summary that helps the next turn continue work
- [ ] **Skip** `state.md` updates for pure Q&A, no-decision turns, compare-only discussion, brainstorming without commitment, or general conversation
- [ ] **Commit** if files changed and the task requires completion proof

> Summary rule: action verbs only (Added, Fixed, Updated, Completed, Migrated). Exclude: discussions, no-decision turns, compare-only turns, and general learnings.

## Do Not Store

Never record: secrets/credentials, raw chat transcripts, chain-of-thought reasoning, speculative notes without evidence, duplicate summaries already in `.unified-memory/`.

## Placeholder Convention

```
{project_root}   = root directory of the active project (walk up from cwd)
{knowledge_root} resolves in order:
  1. {project_root}/.unified-memory/knowledge/
  2. {project_root}/ai-agent/skills/ai-dlc/knowledge/
  3. ~/.claude/skills/ai-dlc/knowledge/

{skills_root}    = {project_root}/skills/ or {project_root}/ai-agent/skills/
{cwd}            = current working directory
```
