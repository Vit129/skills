---
name: ubiquitous-language
description: >
  Post-hoc extraction of domain terms from the current conversation into LANGUAGE.md.
  Triggers: "extract glossary", "build glossary", "scan terms", "ubiquitous language",
  "define domain terms", "harden terminology", "domain model", "DDD".
version: 1.0.0
---

# Ubiquitous Language

Scan the current conversation for domain terms, resolve ambiguities, and write canonical definitions to LANGUAGE.md.

## Process

Scan the conversation for domain-relevant nouns, verbs, and concepts (skip generic programming terms like array/function/endpoint unless they carry domain-specific meaning). Flag ambiguity (same word, different concepts), synonyms to collapse, and vague/overloaded terms.

Be opinionated. When multiple words exist for the same concept, pick the best one and list the rest as aliases to avoid. Flag conflicts explicitly — never silently pick a side.

Update LANGUAGE.md following the `domain-modeling` reference (glossary only, no impl details) — merge into an existing file or create a new one.

LANGUAGE.md format:
```markdown
# [Project] Domain Language

## [Grouping]

| Term | Definition | Aliases to avoid |
|------|-----------|-----------------|
| **Order** | A confirmed purchase request | Purchase, transaction |

## Relationships
- An **Invoice** belongs to exactly one **Customer**

## Flagged ambiguities
- "account" was used to mean both Customer and User — [resolution or open question]
```

Report inline:
```
Extracted: N terms
Added to LANGUAGE.md: [list]
Updated: [list]
Flagged ambiguities: [list]
Aliases removed: [list]
```

## Rules

- **Glossary only.** LANGUAGE.md gets term definitions — no implementation details, no specs, no decision notes.
- **One sentence per definition.** Define what it IS, not what it does.
- **Show relationships.** Use bold term names, express cardinality where obvious.
- **Group by subdomain** when natural clusters emerge. One table is fine if everything is cohesive.
- **Domain expert language only.** If a term only makes sense to engineers, skip it.

## Re-running

When invoked again in the same session, read the existing LANGUAGE.md first, incorporate new terms from the subsequent discussion, update evolved definitions, and re-flag any new ambiguities.
