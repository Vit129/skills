# Consolidation Rules

## When to Consolidate

Merge two or more files when ALL of these are true:

1. **Same domain** — both files are in the same knowledge subdirectory (e.g., `knowledge/automation/api/`)
2. **70%+ keyword overlap** — compare trigger keywords or content headings; if 70%+ match → candidate
3. **No conflicting advice** — the files don't contradict each other
4. **Neither is actively referenced** by a specific skill's `references/` folder

## How to Consolidate

1. Create merged file with combined content (deduplicated)
2. Use the more descriptive filename
3. Add a header note: `<!-- Consolidated from: {file1}, {file2} on {date} -->`
4. Move originals to `knowledge/archive/` with note: `<!-- Superseded by: {merged-file} -->`
5. Update `knowledge/index.md` if it exists

## Consolidation Template

```markdown
# {Pattern Name}

<!-- Consolidated from: {source1}, {source2} on {date} -->

## Pattern
{merged pattern description}

## When to Use
{combined triggers}

## Examples
{best examples from both sources}

## Source History
- Originally: {file1} (created {date})
- Merged with: {file2} (created {date})
```

## Skill Consolidation (Higher Bar)

For skills (not knowledge files), consolidation requires:
- Both skills serve the **exact same role** (not just similar domain)
- User confirmation before merging
- Write recommendation in curator-report.md instead of auto-merging

## Do NOT Consolidate

- Files from different domains (e.g., API pattern + Mobile pattern)
- Files where one is a "lesson" and the other is a "pattern" (different purposes)
- Files actively referenced by different skills
- Anything in `rules/` — these are standards, not patterns
