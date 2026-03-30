# Test Data Generation

Generate smart test data with BVA, Pairwise, and hierarchical reuse.

## When to use
- Need test data for designed scenarios
- Want to reuse existing data patterns before generating new

## Process
1. Check `testScenarioIndex.json` for existing data patterns (exact match → fuzzy match → domain fallback)
2. Analyze entity dependencies: Level 1 (no deps) → Level 2 (needs L1) → Level 3 (needs L2)
3. Generate ALL data in one batch:
   - Valid/Standard — reuse existing patterns (~70%)
   - Boundary/BVA — Min/Max/Just Above/Just Below
   - Edge — Null, empty, special chars, invalid formats
   - Pairwise — combinatorial interactions between dependent fields
4. Show summary → wait for approval

## Validation requirements
- At least 3 data sets per feature (Valid, Boundary, Edge)
- Pairwise sets if interacting fields detected
- All fields from test scenarios included
- Validated against business rules (BL_XXX)
- Proper data types (string, number, boolean, date)
- Realistic values — no generic placeholders

## Rules
- Never proceed without user approval
- Follow dependency order when generating (Level 1 first)
- If circular dependency detected → flag to user
