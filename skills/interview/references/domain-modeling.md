# Domain Modeling

Active discipline for building and sharpening a project's domain model. Use when updating GLOSSARY.md or ADRs — not just reading them.

## GLOSSARY.md — strict glossary only

GLOSSARY.md is a **glossary and nothing else**. No implementation details, no specs, no scratch notes, no decision rationale. If it wouldn't appear in a conversation between a domain expert and a developer explaining "what things are called", it doesn't belong here.

File structure:
```
/
├── GLOSSARY.md          ← single context (most repos)
└── docs/adr/

# or for multi-context repos:
├── CONTEXT-MAP.md      ← points to each context
└── src/
    ├── ordering/GLOSSARY.md
    └── billing/GLOSSARY.md
```

Create lazily — only when the first term is resolved. Never create an empty file.

## During a session

### Challenge against the glossary
When the user uses a term that conflicts with GLOSSARY.md, call it out immediately.
```
"Your glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"
```

### Sharpen fuzzy language
When the user uses vague or overloaded terms, propose a canonical term.
```
"You're saying 'account' — do you mean Customer or User? Those are different things in this codebase."
```

### Cross-reference with code
When the user states how something works, grep to verify.
```
User: "cancel order ได้"
→ grep "cancel" src/ordering/
→ Found: cancelOrder() line 45 — full cancel only, no partial
→ Surface: CONFLICT — plan says partial, code does full → which is right?
```
Surface conflicts immediately. Never pick a side silently.

### Update GLOSSARY.md inline — never batch
When a term is resolved, write it to GLOSSARY.md immediately. Don't accumulate.

GLOSSARY.md format:
```markdown
# [Project] Domain Language

## [Subdomain / grouping]

| Term | Definition | Aliases to avoid |
|------|-----------|-----------------|
| **Order** | A confirmed purchase request | Purchase, transaction |

## Relationships
- An **Invoice** belongs to exactly one **Customer**
```

### Record the decision — offer sparingly
Only when ALL three are true:
1. **Hard to reverse** — cost of changing later is meaningful
2. **Surprising without context** — future reader will wonder "why this way?"
3. **Real trade-off** — genuine alternatives existed, one was chosen for specific reasons

If any of the three is missing, skip it. Otherwise record it as an ADR (`documentation-adrs`).
