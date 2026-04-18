# Git Commit & Version Control

Commit and push code following Azure DevOps work item linking conventions.

## When to use
- After completing any implementation or test scripting task
- User says "commit", "push", "commit and push", "คอมมิต", "พุช"

## Two Workflow Options

Ask user which method before starting:

### Option 1: Direct Commit to Main
Suitable for: minor fixes, hotfixes, solo work.

```bash
git checkout main && git pull origin main
git add .
git commit -m "[AB#xxxxx,AB#yyyyy] Description"
git push origin main
```

Commit format: `[AB#xxxxx,AB#yyyyy] Description`

### Option 2: Pull Request Workflow
Suitable for: new features, major changes, team collaboration.

```bash
git checkout main && git pull origin main
git checkout -b automated-files/[sprint]
git add .
git commit -m "[PR][AB#xxxxx,AB#yyyyy] Description"
git push -u origin automated-files/[sprint]
# Then create PR on Azure DevOps
```

Commit format: `[PR][AB#xxxxx,AB#yyyyy] Description`

## Work Item Linking

`AB#xxxxx` = Azure DevOps Test Scenario ID (numeric)

To find Work Items:
1. Ask user for keyword + tags (e.g., `F3S1 and 2024SP24`)
2. Search Azure DevOps for "Axons Test Scenario" with "Automate" in title
3. Let user select → generate `AB#xxxxx,AB#yyyyy` string

## Safety Rules

Always ask confirmation before:
- `git push -f` (force push)
- `git reset --hard`
- `git branch -d` / `-D` (delete branch)
- `git rebase`
- `git clean -fd`

Never push directly to `main` in Option 2.

## Commit Message Examples

```bash
# Option 1 (Direct)
[AB#107778,AB#107779] Add test script F3S1, F3S2
[AB#107780] Fix login API test data

# Option 2 (PR)
[PR][AB#107778,AB#107779] Add test script F3S1, F3S2
[PR][AB#107780] Add automated test files for F3S1
```

## Bad Commit Messages
```bash
Add test files              # ❌ Missing Work Items
[AB#107778] Update          # ❌ Unclear description
AB#107778 Add test files    # ❌ Missing brackets
```
