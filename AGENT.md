# AI Agent Skills — Universal Entry Point

> This file is the single entry point for all AI agents (Claude Code, Kiro, or any future agent).
> Skills root = the folder containing this file. No hardcoded paths needed.

---

## Quick Start

| Agent | Load this file |
|-------|---------------|
| **Kiro** | Tell Kiro: `"Read AGENT.md in the skills folder and follow those instructions"` or use `#[[file:AGENT.md]]` in steering |
| **Claude Code** | `CLAUDE.md` is auto-loaded — reads this file for skill discovery |
| **Any agent** | Read `SKILL.md` for full skill index |

---

## Paths (relative to this file)

```
SKILLS_ROOT  = {folder containing this file}
CLAUDE_RULES = {SKILLS_ROOT}/../rules/        ← Claude Code rules
MEMORY_GLOBAL = ~/.memory/global/             ← cross-project memory
MEMORY_PROJECT = {project}/.memory/           ← per-project memory
KNOWLEDGE_GLOBAL = {SKILLS_ROOT}/ai-dlc/knowledge/  ← global templates + lessons
KNOWLEDGE_PROJECT = {project}/.knowledge/     ← per-project knowledge (overrides global)
```

> Resolution order: `{project}/.knowledge/` first → fallback to `KNOWLEDGE_GLOBAL`

---

## Agent-Specific Instructions

- **Kiro:** `KIRO.md` — tier selection (Sonnet/Opus), token control, Playwright/test refs
- **Claude Code:** `CLAUDE.md` — tier selection (Gemini/Haiku/Sonnet), workflow, token control
- **Skill index:** `SKILL.md` — full map of all available skills

---

## Engineering Standards (All Agents)

Regardless of which agent is used, **always follow**:

1. **Explain Before Acting** — briefly state intent before invoking any tool
2. **Evidence-First** — never guess — search for evidence first
3. **Validation is Finality** — work is complete only when tests confirm correctness
4. **Context Efficiency** — read only necessary files, batch operations
5. **Commit Early & Often** — after each logical step, not just at the end
6. **Commit After Final Review** — stage all changes and commit with descriptive message

---

## Karpathy Coding Principles (All Agents, Always Active)

> Derived from Andrej Karpathy's observations on LLM coding pitfalls.

### Think Before Coding
**Don't assume. Don't hide confusion. Surface tradeoffs.**

- State assumptions explicitly. If uncertain, **ask** — don't guess.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, **stop**. Name what's confusing. Ask.

### Simplicity First
**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

> Test: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### Surgical Changes
**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, **mention it** — don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

> Test: Every changed line should trace directly to the user's request.

### Goal-Driven Execution
**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```text
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

> Strong success criteria = agent loops independently. Weak criteria ("make it work") = constant clarification needed.

---

## Skills

→ Full index with trigger phrases: `SKILL.md`

---

## Knowledge

```
KNOWLEDGE_GLOBAL  = {SKILLS_ROOT}/ai-dlc/knowledge/   ← cross-project templates + lessons
KNOWLEDGE_PROJECT = {project}/.knowledge/              ← per-project overrides
```

Resolution order: `{project}/.knowledge/` first → fallback to `KNOWLEDGE_GLOBAL`

- Structure, setup, and Phase A→D implementation: `system/knowledge-evolution/references/implementation-guide.md`
- Skill index and routing: `system/knowledge-evolution/SKILL.md`

**Ingest trigger phrases:** "ingest this", "add to knowledge", "learn from this", "dump to raw"
→ Dump raw → `{project}/.memory/wings/{topic}/raw/YYYY-MM-DD-{desc}.md` → extract → write to `.knowledge/`

**Citation convention:**
```
[from: LESSON-AUTH-001]        ← lesson reference
[from: skill:playwright-rules] ← skill reference
[from: memory:{wing}/{room}]   ← memory palace reference
```

---

## Memory

```
Global (cross-project):  ~/.memory/global/
Per-project:             {project}/.memory/
```

### Global Memory Structure

```
~/.memory/global/
├── state.md                    ← global palace map (active wings across all projects)
├── tunnels.md                  ← cross-project links
└── wings/
    ├── knowledge-evolution/    ← template scores + lesson effectiveness (cross-project)
    │   ├── hall.md
    │   ├── rooms/
    │   │   ├── template-health.md
    │   │   ├── lesson-effectiveness.md
    │   │   └── gap-tracker.md
    │   └── closets/
    └── {other-global-wings}/
```

### Session Rules

On session start:
1. Load `~/.memory/global/state.md` if exists → cross-project context
2. Load project `.memory/state.md` → project-specific context
3. Treat both as **hints** (skeptical memory) — verify against actual files before acting

On session end (if decisions were made):
1. Save to project `.memory/` first
2. Sync knowledge-evolution scores to `~/.memory/global/wings/knowledge-evolution/`
3. Update `~/.memory/global/state.md` if cross-project state changed

### Relocation

If moving memory to a different path, update `MEMORY_GLOBAL` in the Paths section above.

---

## Kiro Setup for New Projects

Run once per project:

```bash
{SKILLS_ROOT}/system/hook-creator/setup-kiro-project.sh /path/to/project
```

Copies standard hooks + steering templates to `.kiro/hooks/` and `.kiro/steering/`.

---

## Relocation Guide

Moving skills folder to a new path (e.g., `~/ai-agent/`):

1. Move the folder
2. Update `MEMORY_GLOBAL` path above if different from `~/.memory/global/`
3. Re-run `setup-kiro-project.sh` for each project to update hooks/steering
4. Update `SKILLS_ROOT` in each project's `STEERING_INDEX.md`

Everything else resolves relative to this file automatically.
