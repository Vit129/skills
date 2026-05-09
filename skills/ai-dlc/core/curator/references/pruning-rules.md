# Pruning Rules

## Archive Threshold

Archive a knowledge file or playbook case when ALL of these are true:

1. **Usage = 0** in last 30 days (Applied + Prevented = 0, or no file access)
2. **Quality score < 3** (incomplete, stub, or broken)
3. **Not referenced** by any active skill's `references/` folder
4. **Not seasonal** — check if the file relates to a project type that runs periodically

## Archive Process

1. Move file to appropriate archive location:
   - Knowledge files → `knowledge/archive/{original-subfolder}/`
   - Playbook cases → `agent-memory/knowledge/archive-playbook.md`
2. Add metadata header to archived file:
   ```markdown
   <!-- Archived: {date} | Reason: {reason} | Restore: move back to original path -->
   ```
3. Update `knowledge/index.md` if it exists (mark as archived)
4. Log in curator-report.md

## Restore Process

If an archived item is needed again:
1. Move back to original location
2. Remove archive metadata header
3. Update index
4. Note in curator-report.md: "Restored: {file} — reason: {why}"

## Never Archive

- Any file in `core/aidlc/` or `rules/`
- Files with quality score >= 4 (even if unused — they're ready when needed)
- Files modified in last 14 days
- Files explicitly pinned by user (marked with `<!-- pinned -->` comment)

## Seasonal Detection

Before archiving, check if the file matches a seasonal pattern:
- QA automation patterns → used during test phases (may be quiet during design phases)
- Performance testing → used only before releases
- Mobile patterns → used only when mobile features are active

If seasonal → do NOT archive. Instead, note in report: "Seasonal — skip"

## Bulk Archive Safety

- Never archive more than 3 items in a single curator run
- If 4+ items qualify → archive top 3 (lowest scores), flag rest for next run
- This prevents accidental mass-pruning
