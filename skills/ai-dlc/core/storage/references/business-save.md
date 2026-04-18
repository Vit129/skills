# Business Knowledge Save

Save business knowledge (rules, UI actions, domain config) to centralized repository.

## Scope
- ✅ Business rules, validation logic, calculations
- ✅ State transitions, workflow constraints
- ✅ UI actions and behaviors
- ✅ Domain configuration
- ❌ NOT technical patterns (use `automation-save.md`)

## Code-to-Business-Rule Mapping

### From API Code
- Method names → business actions
- Validation logic → business constraints
- Conditional logic → business rules

### From UI Code
- Form validations → input constraints
- State changes → workflow rules
- Error messages → business feedback

### 5 Required Fields per Rule
Every business rule MUST contain:
1. **id:** `BL_{DOMAIN}_{SEQ}` (e.g., BL_MED_001)
2. **name:** descriptive name
3. **condition:** when does this rule apply?
4. **action:** what happens when triggered?
5. **source:** file path and line number

## Files Generated
- `{knowledge_root}/business/{domain}/business{Domain}Rules.json` — business rules
- `{knowledge_root}/business/{domain}/uiActions.json` — UI actions
- `{knowledge_root}/business/{domain}/config.json` — domain config
- `{knowledge_root}/business/businessIndex.json` — master index

## Rules
- AI-Direct Mode: write all JSON files directly
- Self-validate JSON before every write
- Deduplicate by id when merging
- Only save business behaviors, not coding patterns
- Update implementation plan save status after success
