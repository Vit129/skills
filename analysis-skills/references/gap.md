# Gap Analysis

Compare what's required vs what's available, then prioritize what's missing.

## When to use
- After domain analysis — know what's reusable, need to find what's not
- Before implementation — need to estimate effort for new logic
- Validating completeness of a design

## How it works
1. **List required logic** — from context analysis: business rules, validations, UI actions, calculations
2. **Match against available** — from domain analysis: existing BL_XXX, UA_XXX, reusable patterns
3. **Classify each item:**
   - Direct Match (100% confidence) — exists and works as-is
   - Partial Match (50%) — exists but needs adaptation
   - No Match (0%) — must be built from scratch
4. **Calculate metrics:**
   - Reusable % = (direct + partial matches) / total required × 100
   - Missing % = 100 - reusable %
5. **Prioritize gaps by impact:**
   - Critical — system can't function without it
   - High — wrong business results
   - Medium — poor user experience
   - Low — nice to have

## Output
```
Required: [N] items
Reusable: [N] ([XX]%)
Missing: [N] ([XX]%)

Critical: [list]
High: [list]
Medium: [list]
Low: [list]
```
