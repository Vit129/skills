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

## Plan Mode (Mandatory Rule)

**Before any non-trivial implementation, enter plan mode.**

Use `EnterPlanMode` when:
- New feature implementation (multiple files, unclear scope)
- Multiple valid approaches exist (need to choose one)
- Code modifications affecting behavior or structure
- Architectural decisions required
- Multi-file changes likely
- Requirements unclear (explore first)
- User preferences matter (present options)

Do NOT use plan mode for:
- Single-line or few-line fixes
- Simple one-function additions with clear requirements
- Research/exploration tasks (use Agent tool instead)
- Tasks with explicit detailed instructions

Plan output:
1. Explore codebase (Glob, Grep, Read)
2. Understand existing patterns
3. Design implementation approach
4. Present plan to user for approval via `ExitPlanMode`
5. Use `AskUserQuestion` if approach unclear

---

## Design & Craftsmanship Rules (Premium Standards)

**Craft UI/code like a senior engineer ships to production.**

### Foundational Tokens (Centralized)
- **Color:** Use design tokens from `.claude/shared/` or design system (not hardcoded hex)
- **Typography:** Consistent font families, sizes, weights, line heights
- **Spacing:** Modular scale (8px, 12px, 16px, 24px, 32px base units)
- **Shadows:** Depth hierarchy (shadow-sm, shadow-md, shadow-lg)
- **Borders:** Consistent radius (0px, 4px, 8px, 12px)
- **Duration:** Consistent animation timing (150ms, 250ms, 350ms)

### Reusable Components
- Extract repeated patterns → shared components
- Props-based customization (not copy-paste variants)
- Accessible by default (ARIA labels, semantic HTML, keyboard nav)
- Dark mode support built-in (not an afterthought)

### Typography Hierarchy
- **Display:** Large, bold, headlines (32px+)
- **Heading:** Section titles (24px)
- **Subheading:** Subsection titles (18px)
- **Body:** Content (16px)
- **Label:** Form labels, captions (14px)
- **Caption:** Metadata, hints (12px)

### Anti-AI-Slop (Checklist)
- [ ] No generic placeholder text ("Click here", "Submit")
- [ ] No orphaned UI elements (every control has clear purpose)
- [ ] No inconsistent spacing or alignment (use grid/flex)
- [ ] No forgotten states (hover, focus, active, disabled)
- [ ] No color contrast fails (WCAG AA minimum)
- [ ] No tiny unreadable text (14px minimum for body)
- [ ] No cluttered layouts (whitespace is content)
- [ ] No missing feedback (loading states, error messages, success confirmations)

### Code Craftsmanship
- **Naming:** Clear, pronounceable, intent-revealing (not `temp`, `data`, `thing`)
- **Functions:** Single responsibility, <20 lines when possible
- **Comments:** Why, not what (code shows what, comments explain why)
- **DRY:** Extract common patterns → utilities/helpers
- **Testability:** Arrange-Act-Assert pattern, one concept per test
- **Performance:** Profile before optimizing, measure after changes

---

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

## Escalation & Handoff Rules (When to STOP)

**Stop and ask user when:**
- **Ambiguous requirements** — multiple valid interpretations, user must choose
- **Blocked by external dependency** — need user credential, API key, decision, or permission
- **Destructive operation** — delete, force push, breaking change, data migration
- **Security/compliance concern** — potential vulnerability, data exposure, regulatory issue
- **3+ different approaches failed** — not retries of same thing, but different strategies
- **Performance/cost impact unclear** — potential for expensive operation, long wait time, or resource exhaustion
- **User preference matters** — multiple valid solutions, no "right" answer

Don't keep struggling. Escalate early, escalate clearly.

---

## Quality Gates (Pre-Done Checklist)

**Before marking task complete, verify:**
- [ ] **Build passes** — no new errors, warnings, or compilation failures
- [ ] **Tests pass** — all relevant tests green (not skipped)
- [ ] **Edge cases handled** — empty inputs, null, max/min values, boundary conditions
- [ ] **Backwards compatible OR documented** — breaking changes clearly noted with migration path
- [ ] **Code clarity** — comments explain WHY, not WHAT (code already shows what)
- [ ] **Git log tells story** — commits are logical, messages describe intent
- [ ] **User can verify** — result is independently testable/observable by user
- [ ] **No new tech debt** — temporary workarounds documented with removal plan

If any check fails, task is not done. Fix it or escalate.

---

## Error Recovery Strategy (What to Do When It Fails)

**Progression for handling failures:**

1. **Diagnose (not panic)**
   - Read error message completely
   - Identify root cause, not symptom
   - Verify assumption: "I thought X, but it's actually Y"

2. **Adjust approach (don't retry)**
   - Try different strategy (not same thing again)
   - Gather more information if needed
   - Modify input, path, or method

3. **Verify fix works**
   - Test the fix
   - Confirm original problem is solved
   - Check for side effects

4. **Loop or escalate**
   - If fix works: continue
   - If 3 different approaches fail: escalate (see Escalation Rules)
   - Track what was tried (helps user understand the problem)

**Key rule:** After 3 *different* attempts fail, stop trying. Ask user.

---

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
