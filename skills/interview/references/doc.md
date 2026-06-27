# Interview Doc

Grill with codebase awareness — cross-ref code, sharpen language, update CONTEXT.md + ADRs inline.

## Step 1 — Load Context First
```
1. Read CONTEXT.md (project root) + scan codebase structure
2. Read docs/adr/ for existing decisions
3. Report: "CONTEXT: 12 terms, 3 ADRs, modules: src/ordering/ src/billing/"
```
If no CONTEXT.md → create when first term is resolved (never create empty).

## Step 2 — Interview (ONE question at a time)
- If answer is in codebase → explore code first, don't ask
- Always give recommended answer extracted from code/docs
- Format: same as `me.md`

**Question order:** WHAT → SCOPE → DOMAIN (term match) → RELATIONSHIPS → EDGE CASES → DECISIONS

## Step 3 — Cross-Reference Every Claim
```
User: "cancel order ได้"
→ grep "cancel" src/ordering/
→ Found: cancelOrder() line 45 — full cancel only, no partial
→ Surface: CONFLICT — plan says partial, code does full → which is right?
```
Surface conflicts immediately — never pick a side silently.

## Step 4 — Sharpen Language
```
CONTEXT.md defines "Order" as confirmed purchase
User says "draft order" → in this codebase that's "Cart"
→ which term to use?
```

## Step 5 — Update Docs Inline (never batch)
Follow `references/domain-modeling.md` for all CONTEXT.md and ADR rules (glossary only, ADR criteria, file structure).

## Summary Format
```markdown
## Interview-Doc Summary
**Plan:** [1-2 sentences]
**CONTEXT.md updates:** Added/Updated/Flagged [terms]
**Conflicts resolved:** [conflict → resolution]
**ADRs created:** ADR-XXX: [title]
**Open questions:** [unresolved]
→ Ready for AIDLC Phase 0 / Phase 1
```
