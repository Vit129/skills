---
name: ubiquitous-language
description: >
  Post-hoc extraction of domain terms from the current conversation into GLOSSARY.md.
  Triggers: "extract glossary", "build glossary", "scan terms", "ubiquitous language",
  "define domain terms", "harden terminology", "domain model", "DDD".
version: 1.0.0
---

# Ubiquitous Language

Scan the current conversation for domain terms, resolve ambiguities, and write canonical definitions to GLOSSARY.md.

## Process

**Step 1 — Scan for domain terms**
Read the conversation and identify domain-relevant nouns, verbs, and concepts. Skip generic programming terms (array, function, endpoint) unless they carry domain-specific meaning in this project.

**Step 2 — Identify problems**
- Same word used for different concepts (ambiguity)
- Different words used for the same concept (synonyms to collapse)
- Vague or overloaded terms that need a precise canonical name

**Step 3 — Propose canonical terms**
Be opinionated. When multiple words exist for the same concept, pick the best one and list the rest as aliases to avoid. Flag conflicts explicitly — never silently pick a side.

**Step 4 — Update GLOSSARY.md**
Follow the `domain-modeling` reference for GLOSSARY.md rules (glossary only, no impl details).

If GLOSSARY.md already exists → merge new terms in, update definitions that have evolved, re-flag new ambiguities.
If GLOSSARY.md doesn't exist → create it now with the resolved terms.

GLOSSARY.md format:
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

**Step 5 — Report inline**
```
Extracted: N terms
Added to GLOSSARY.md: [list]
Updated: [list]
Flagged ambiguities: [list]
Aliases removed: [list]
```

## Rules

- **Glossary only.** GLOSSARY.md gets term definitions — no implementation details, no specs, no decision notes.
- **One sentence per definition.** Define what it IS, not what it does.
- **Show relationships.** Use bold term names, express cardinality where obvious.
- **Group by subdomain** when natural clusters emerge. One table is fine if everything is cohesive.
- **Domain expert language only.** If a term only makes sense to engineers, skip it.

## Re-running

When invoked again in the same session, read the existing GLOSSARY.md first, incorporate new terms from the subsequent discussion, update evolved definitions, and re-flag any new ambiguities.
