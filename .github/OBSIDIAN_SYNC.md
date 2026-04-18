# Obsidian Branch — One-Way Sync Pattern

## Branch Structure

```
main (source of truth)
  └── claude/obsidian-isolated-version-28reI  (obsidian downstream)
```

## Rules

| Direction | Allowed? |
|-----------|----------|
| main → obsidian | ✅ Auto-synced via GitHub Actions |
| obsidian → main | ❌ Never |

## How It Works

- Every push to `main` triggers `.github/workflows/sync-main-to-obsidian.yml`
- The workflow does `git merge main` on the obsidian branch automatically
- Changes made on the obsidian branch stay isolated — they never go back to main

## Manual Sync (if needed)

```bash
git checkout claude/obsidian-isolated-version-28reI
git merge main
git push origin claude/obsidian-isolated-version-28reI
```

## Branch Protection (set on GitHub)

Go to **Settings → Branches → main**:
- Require pull request before merging ✅
- Do NOT approve any PR from `claude/obsidian-isolated-version-28reI` → `main`
