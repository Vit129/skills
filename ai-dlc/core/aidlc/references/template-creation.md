# Template Creation

Initialize files from master templates with placeholder substitution.

## When to use
- Creating new implementation plan files
- Initializing test scenario documents
- Starting any new AIDLC artifact

## Process
1. Read session state → determine workflow_type, system, feature
2. Resolve template and target path based on workflow_type
3. Create target directory if it doesn't exist
4. Read template → replace all `[KEY]` and `{key}` placeholders with actual values
5. Write processed content to target path
6. Verify file exists and is readable

## Placeholder variables

| Variable | Source |
|----------|--------|
| `[SYSTEM_KEBAB]` | kebabCase(system) |
| `[SYSTEM_FEATURE_KEBAB]` | kebabCase(system + feature) |
| `[SYSTEM_FEATURE_CAMEL]` | lowerCamelCase(system + feature) |
| `[DATE]` | Current date |

## Rules
- Resolve target path before any file operation
- Ensure directory exists before writing
- Never leave partial or corrupted files
- If file already exists, follow workflow logic to decide if overwrite is safe
