# /simplify — Reduce complexity

Route to `~/.claude/skills/code-simplification/`.

## Instructions

1. Read `~/.claude/skills/code-simplification/SKILL.md`
2. Determine scope:
   - If user specifies file/function → simplify that
   - If user says "this file" → simplify active file
   - If no scope → ask user what to simplify
3. Follow the process:
   - Step 1: Understand (Chesterton's Fence — check git blame, understand why)
   - Step 2: Identify opportunities (nesting, long functions, dead code, naming)
   - Step 3: Apply incrementally (one change → run tests → next)
   - Step 4: Verify (is it genuinely simpler?)
4. Rules:
   - Preserve behavior exactly — tests must pass WITHOUT modification
   - Follow project conventions
   - Scope to what was asked — no drive-by refactors
   - Rule of 500: if >500 lines → suggest automation

## Prerequisites

- Code must work (tests pass before starting)
- Must understand the code before simplifying

## Done When

- All tests pass without modification
- Code is measurably easier to read
- Diff is clean and reviewable
