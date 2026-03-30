# Business Knowledge Save

Save business rules and domain knowledge to a centralized repository.

## When to use
- Extracted business rules from code or requirements
- Need to persist domain knowledge for future reuse

## What to save
- Business rules (BL_XXX): validation, calculation, workflow constraints
- UI actions (UA_XXX): trigger → behavior mappings
- Domain config: validation rules, feature flags

## How to extract from code
- Validation logic → business constraint
- Calculation logic → business rule
- State transitions → workflow rule
- Method names → business actions
- Test assertions → business behaviors

## Required fields per rule
- `id`: BL_{DOMAIN}_{SEQ}
- `name`: descriptive name
- `condition`: when does this apply?
- `action`: what happens?
- `source`: file path + line number

## File structure
```
knowledge/business/{domain}/
├── business{Domain}Rules.json  — rules with BL_XXX IDs
├── uiActions.json              — UI action mappings
└── config.json                 — domain configuration
```

Update `businessIndex.json` after every save.

## Rules
- Business scope only — no technical patterns here
- Every rule must have all 5 required fields
- Validate JSON structure before writing
- Deduplicate by ID before appending
