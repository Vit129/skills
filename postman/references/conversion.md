# Postman to Playwright Conversion

Analyze Postman collections and generate Playwright API test files.

## When to use
- Migrating existing Postman test suites to Playwright
- Need API documentation extracted from Postman collections

## Scripts (in `scripts/` folder)

1. **readPostmanCollection.ts** — Parse collection → interactive folder selection → generate markdown with Playwright snippets
2. **readPostmanEnv.ts** — Parse environment → generate `.env` snippet + `process.env` declarations
3. **postmanMdToPlaywright.ts** — Read markdown from steps 1+2 → generate `.spec.ts` + `Helper.ts` + `Data.ts`

## Workflow
1. Run `readPostmanCollection.ts` on your `.json` collection
2. Run `readPostmanEnv.ts` on your environment file (pass `--used-vars` from step 1 output)
3. Run `postmanMdToPlaywright.ts` to generate Playwright files
4. Review technical debt report → fix issues → confirm file generation

## Key features
- Arrow key folder selection (interactive)
- Execution graph analysis (`setNextRequest` flow)
- State dependency detection (parallel execution risks)
- Auth inheritance from parent folders
- CPS → async/await conversion (`pm.sendRequest` → `request.fetch()`)
- 9-type environment variable detection
- Technical debt analysis with skill-mapped checks

## Output
- `tests-api/{folder}/{name}.spec.ts` — test specs
- `helpers/{folder}/{name}Helper.ts` — API service helpers
- `fixtures/{folder}/{name}Data.ts` — test data fixtures
- `helpers/core/CollectionHelpers.ts` — shared collection functions (if needed)

See `scripts/POSTMAN_README.md` for full documentation.
