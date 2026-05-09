---
name: source-driven
description: Grounds framework/library decisions in official documentation. Use when implementing code that depends on specific API versions — verify, cite, flag unverified.
---

# Source-Driven Development

## Overview

Don't implement from memory — verify against official docs, cite sources, flag what's unverified. Training data goes stale, APIs get deprecated. This skill ensures every framework-specific pattern traces back to an authoritative source.

## When to Use

- Building with any framework/library where the API version matters
- Creating boilerplate or patterns that will be copied across the project
- User asks for "correct" or "documented" implementation
- Implementing forms, routing, data fetching, state management, auth
- Reviewing code that uses framework-specific patterns

## When NOT to Use

- Pure logic (loops, conditionals, data structures)
- Renaming, formatting, file moves
- User explicitly says "just do it quickly"

## Process

```
DETECT ──→ FETCH ──→ IMPLEMENT ──→ CITE
  │          │           │            │
  ▼          ▼           ▼            ▼
 What       Get the    Follow the   Show your
 stack?     docs       patterns     sources
```

### Step 1: Detect Stack and Versions

Read dependency files to identify exact versions:

```
package.json / pyproject.toml / go.mod / Cargo.toml / Gemfile / composer.json
```

State what you found:
```
STACK DETECTED:
- React 19.1.0 (from package.json)
- Playwright 1.48.0
→ Fetching official docs for relevant patterns.
```

If versions are ambiguous → ask. Don't guess.

### Step 2: Fetch Official Documentation

Fetch the SPECIFIC page for the feature, not the homepage.

**Source hierarchy (authority order):**

| Priority | Source | Example |
|----------|--------|---------|
| 1 | Official documentation | react.dev, playwright.dev, docs.djangoproject.com |
| 2 | Official blog/changelog | nextjs.org/blog, playwright.dev/docs/release-notes |
| 3 | Web standards | MDN, web.dev |
| 4 | Compatibility tables | caniuse.com, node.green |

**NOT authoritative (never cite as primary):**
- Stack Overflow
- Blog posts / tutorials
- AI-generated docs
- Your own training data

### Step 3: Implement Following Documented Patterns

- Use API signatures from docs, not memory
- If docs show a new way → use the new way
- If docs deprecate a pattern → don't use deprecated version
- If docs don't cover something → flag as unverified

**When docs conflict with existing project code:**
```
CONFLICT DETECTED:
Existing code uses [old pattern], but [version] docs recommend [new pattern].
Source: [URL]

Options:
A) Modern pattern — consistent with current docs
B) Match existing code — consistent with codebase
→ Which approach?
```

Surface the conflict. Don't silently pick one.

### Step 4: Cite Sources

Every framework-specific pattern gets a citation:

```typescript
// Playwright 1.48 — use getByTestId over CSS selectors
// Source: https://playwright.dev/docs/locators#locate-by-test-id
const submitBtn = page.getByTestId('submit-button');
```

**Citation rules:**
- Full URLs, not shortened
- Deep links with anchors when possible
- Quote relevant passage for non-obvious decisions
- If you CANNOT find docs → say so explicitly:

```
UNVERIFIED: Could not find official documentation for this pattern.
Based on training data — may be outdated. Verify before production use.
```

## Anti-Rationalization

| Excuse | Rebuttal |
|--------|----------|
| "I'm confident about this API" | Confidence ≠ evidence. Training data contains outdated patterns that look correct but break. Verify. |
| "Fetching docs wastes tokens" | Hallucinating an API wastes more. User debugs for an hour, then discovers the signature changed. |
| "The docs won't have what I need" | If docs don't cover it → pattern may not be officially recommended. That's valuable info. |
| "I'll just mention it might be outdated" | A disclaimer doesn't help. Either verify+cite, or clearly flag as UNVERIFIED. |
| "This is a simple task" | Simple tasks with wrong patterns become templates. Copied into 10 files before discovering the modern approach. |

## Red Flags

- Writing framework code without checking docs for that version
- Using "I believe" or "I think" about an API instead of citing
- Implementing without knowing which version it applies to
- Citing Stack Overflow instead of official docs
- Using deprecated APIs from training data
- Not reading dependency files before implementing

## Verification

After implementing:

- [ ] Framework/library versions identified from dependency file
- [ ] Official docs fetched for framework-specific patterns
- [ ] All sources are official documentation
- [ ] Code follows patterns from current version's docs
- [ ] Non-trivial decisions include source citations with URLs
- [ ] No deprecated APIs used
- [ ] Conflicts between docs and existing code surfaced to user
- [ ] Anything unverified is explicitly flagged
