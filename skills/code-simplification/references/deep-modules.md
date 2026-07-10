# Deep Modules

A design-level complement to `process.md`'s function-level signals. Use when
the complexity isn't in one function but in how modules are shaped —
too many shallow ones, unclear boundaries, or logic scattered across files
that should own one responsibility each.

## The Principle (Ousterhout)

A good module has a **narrow interface** and a **deep implementation** — it
hides a lot of complexity behind a small, simple-to-use surface. A shallow
module's interface is nearly as complex as its implementation, so using it
costs almost as much as understanding it would.

| Signal | Problem |
|--------|---------|
| Module/class with 1-2 trivial methods that just forward to another module | Shallow — adds an indirection layer without hiding anything |
| Caller needs to know 3+ implementation details to use the interface correctly | Interface leaks internals instead of hiding them |
| Same concept configured/validated/transformed in multiple modules | No module actually owns that responsibility |
| Adding one feature requires touching 5+ files for reasons unrelated to the feature | Boundaries don't match how the system actually changes (shotgun surgery) |
| A module's name doesn't describe what it hides, only what it does | Likely shallow — deep modules are named for the complexity they own |

## Scanning a Codebase for Opportunities

For a repo-wide pass (not just the file in front of you):

1. **Find god-nodes / high-blast-radius modules first** — if `graphify-out/` exists, use `mcp__graphify__query_graph`/`blast_radius` to prioritize; otherwise start from the most-imported or most-changed files (`git log --stat` frequency).
2. Walk each candidate against the signal table above.
3. Write findings as a prioritized **markdown** list (never an HTML report — see `rules/coding.md` §2), one entry per opportunity:
   ```markdown
   ### [module/file] — [one-line problem]
   **Signal:** [which row from the table above]
   **Cost:** [what this makes harder — onboarding, a specific kind of change, testing]
   **Deepening move:** [merge shallow modules / pull scattered logic into one owner / narrow the interface — concrete, not "refactor this"]
   ```
4. Present the list — don't auto-apply. Let the user pick which opportunity to act on, then follow `process.md`'s incremental-apply loop for that one.

## When to Skip

- The module is shallow on purpose (a thin adapter/facade at a system boundary is fine — it's not hiding complexity because there's none to hide there)
- You're mid-feature — this is a separate pass, not something to bundle into unrelated work (see `process.md`'s anti-rationalization table)
