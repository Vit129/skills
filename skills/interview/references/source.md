# Source-Driven Development

Verify against official docs before implementing — never from memory.

## Process

**DETECT** — read dependency files for exact versions:
```
package.json / pyproject.toml / go.mod / Cargo.toml
→ "React 19.1.0, Playwright 1.48.0"
```
If ambiguous → ask. Never guess.

**FETCH** — get the specific doc page for the feature (not the homepage).
Prefer in order: official docs → GitHub source → changelog → community guides.

**IMPLEMENT** — follow the documented pattern exactly.
If docs show multiple approaches → pick the one matching the project's existing style.

**CITE** — every non-obvious pattern gets a source:
```
// Source: https://react.dev/reference/react/useEffect#fetching-data
```

## Unverified Flag
If docs can't be fetched or version is unclear:
```
⚠️ UNVERIFIED: [pattern] — could not confirm against official docs for v[X.Y].
Reason: [why]. Verify before shipping.
```

## Rules
- Training data goes stale — always fetch, never assume
- Cite specific page + version, not just "the docs"
- Flag every unverified pattern explicitly — never silently assume
