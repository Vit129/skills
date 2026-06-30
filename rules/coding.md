# Coding Principles

## 1. Think Before Coding

- State assumptions explicitly. If multiple interpretations exist, present them.
- Push back when a simpler approach exists. Surface tradeoffs.
- If unclear, stop and ask — don't guess.

## 2. Simplicity First

- Minimum code that solves the problem. No speculative features or abstractions.
- No "flexibility" that wasn't requested. If 200 lines could be 50, rewrite.
- Ask: "Would a senior engineer say this is overcomplicated?"

## 3. Graph Before Edit

If `graphify-out/` exists in the project root, run **before the first Edit/Write**:

```bash
graphify query "<symbol or concept being modified>"
```

Use the output to understand the impact surface before touching anything. Skip for trivial changes (typos, config values, docs).

## 4. Surgical Changes

- Touch only what the task requires. Don't improve adjacent code uninvited.
- Match existing style even if you'd do it differently.
- Remove only orphans YOUR changes created — not pre-existing dead code.

## 5. Goal-Driven Execution

- Transform tasks into verifiable goals with explicit success criteria.
- State a brief numbered plan for multi-step work. Loop until verified.
- Weak criteria ("make it work") → ask for clarification before proceeding.

## Citation Format

`[source:path/or/command] — brief note`

## Code Comments

- Comments explain **WHY**, never WHAT.
- No commented-out code in commits.

## Commit Style

```
<type>: <why this change matters>
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
Subject answers "why" — the diff shows "what".
