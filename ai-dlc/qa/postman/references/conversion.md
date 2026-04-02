# Postman Conversion

Convert Postman Collections to Playwright Test Scripts.

## When to use
- Analyzing Postman collection files for migration
- Converting Postman to Playwright
- Extracting API documentation from Postman

## Process
1. Wait for `collection_path`, `kebab-case-feature`, and `lowerCamelCaseFeature`
2. Run collection analysis script:
   ```
   npx ts-node scripts/postman-migration/readPostmanCollection.ts {collection_file} --output {plan_path}
   ```
   → Generates API documentation in implementation plan
3. Run environment analysis (optional):
   ```
   npx ts-node scripts/postman-migration/readPostmanEnv.ts {env_file} --output {plan_path}
   ```
   → Generates environment configuration
4. Update Knowledge Buffer with generated assets

## Scripts
- `scripts/postman-migration/readPostmanCollection.ts` — collection analysis
- `scripts/postman-migration/readPostmanEnv.ts` — environment analysis
- `scripts/postman-migration/postmanMdToPlaywright.ts` — MD to Playwright conversion

## Rules
- Use provided ts-node scripts for analysis — no manual conversions
- Verify collection file exists before running scripts
- Replace "Pending" placeholders in implementation plan after script execution
- If environment file provided, reflect config in `🔧 Environment Configuration` section
