# Git Commit, Push & Pull Request

Complete flow: commit → push → create PR, following Azure DevOps work item linking conventions.

## When to use

- After completing any implementation or test scripting task
- User says "commit", "push", "create PR", "คอมมิต", "พุช"

---

## Step 1: Commit & Push

### Option A: Direct Commit to Main

Suitable for: minor fixes, hotfixes, solo work.

```bash
git checkout main && git pull origin main
git add .
git commit -m "[AB#xxxxx,AB#yyyyy] Description"
git push origin main
```

Commit format: `[AB#xxxxx,AB#yyyyy] Description`

### Option B: Feature Branch (for PR)

Suitable for: new features, major changes, team collaboration.

```bash
git checkout main && git pull origin main
git checkout -b automated-files/[sprint]
git add .
git commit -m "[PR][AB#xxxxx,AB#yyyyy] Description"
git push -u origin automated-files/[sprint]
```

Commit format: `[PR][AB#xxxxx,AB#yyyyy] Description`

---

## Step 2: Create Pull Request (Option B only)

### Prerequisites

- All tests must pass (tests_failed = 0)
- Code pushed to feature branch
- DevOps MCP tools available (or manual)

### PR Creation

1. Create PR with title: `AB#{work_item_id}: {feature description}`
2. PR description includes:
   - Summary of changes
   - Work item references (`AB#xxxxx`)
   - Test results (passed/failed/skipped counts)
   - TDD summary (if applicable)
3. Link PR to work items via MCP
4. Update work item status: "In Progress" → "Code Review"
5. Add comment with PR ID and test results

### PR Rules

- **FORBIDDEN** to create PR if any tests are still failing
- If MCP unavailable, provide manual instructions instead
- Never push directly to `main` when using PR workflow

---

## Work Item Linking

`AB#xxxxx` = Azure DevOps Work Item ID (numeric)

To find Work Items:
1. Ask user for keyword + tags (e.g., `F3S1 and 2024SP24`)
2. Search Azure DevOps for "Org Test Scenario V2" with "Automate" in title
3. Let user select → generate `AB#xxxxx,AB#yyyyy` string

---

## Commit Message Examples

```bash
# Option A (Direct to main)
[AB#107778,AB#107779] Add test script F3S1, F3S2
[AB#107780] Fix login API test data

# Option B (Feature branch for PR)
[PR][AB#107778,AB#107779] Add test script F3S1, F3S2
[PR][AB#107780] Add automated test files for F3S1
```

### Bad Commit Messages

```bash
Add test files              # ❌ Missing Work Items
[AB#107778] Update          # ❌ Unclear description
AB#107778 Add test files    # ❌ Missing brackets
```

---

## Safety Rules

Always ask confirmation before:
- `git push -f` (force push)
- `git reset --hard`
- `git branch -d` / `-D` (delete branch)
- `git rebase`
- `git clean -fd`
