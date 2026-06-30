# Inline Documentation and Changelog

## Inline Comments

### What to Comment

| Comment type | When | Example |
|---|---|---|
| **Why** | Non-obvious decision | `// Retry 3x because payment API is flaky under load` |
| **Constraint** | External limitation | `// Max 100 items — API pagination limit` |
| **Warning** | Gotcha for future devs | `// WARNING: Order matters — auth must run before rate limit` |
| **TODO** | Known incomplete work | `// TODO(#123): Add retry logic for timeout` |

### What NOT to Comment

| Don't | Why |
|-------|-----|
| `// increment counter` above `count++` | Code is self-explanatory |
| `// constructor` above `constructor()` | Obvious from syntax |
| Commented-out code | Use version control instead |

## Changelog

### Format (Keep a Changelog)

```markdown
## [1.2.0] - 2026-05-09

### Added
- User profile photo upload (#234)

### Changed
- Upgraded Playwright to 1.48 (#238)

### Fixed
- Duplicate records in user search (#235)

### Removed
- Legacy getUser() API (deprecated since 1.0) (#240)
```

### Rules
- Group by: Added, Changed, Fixed, Removed, Security
- Link to PR/issue numbers
- Write for humans (not machines)
- Update changelog in the same PR as the change
