# Git Commit & PR Workflow

## Branching Strategy (Trunk-Based)

```
main (always deployable)
  └── feat/feature-name (short-lived, < 2 days)
  └── fix/bug-description
  └── test/test-feature
```

**Rules:**
- Branch from `main`, merge back to `main`
- Keep branches short-lived (< 2 days ideal)
- Delete branch after merge
- Never commit directly to `main` for team projects

## Commit Flow

```bash
# 1. Create feature branch
git checkout main && git pull origin main
git checkout -b feat/feature-name

# 2. Work in small commits
git add -A
git commit -m "feat(scope): description"

# 3. Push and create PR
git push -u origin feat/feature-name
```

## Commit Message Convention

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | When |
|------|------|
| `feat` | New feature |
| `fix` | Bug fix |
| `test` | Adding or fixing tests |
| `refactor` | Code change that neither fixes nor adds |
| `docs` | Documentation only |
| `ci` | CI/CD pipeline changes |
| `chore` | Build process, tooling, deps |
| `perf` | Performance improvement |

### Rules
- Subject: imperative mood, lowercase, no period, < 72 chars
- Body: explain what and why (not how)
- Footer: breaking changes, issue references

### Examples

```bash
# Good
feat(auth): add JWT refresh token rotation
fix(api): handle null response from payment gateway
test(checkout): add e2e test for guest checkout
ci: add Trivy image scanning to pipeline
refactor(db): extract query builder into separate module

# Bad
Fixed stuff                    # ❌ no type, vague
feat: Add new feature.         # ❌ period, capitalized, vague
FEAT(auth): ADD LOGIN          # ❌ uppercase
```

## Pull Request

### PR Title
```
feat(scope): concise description (< 70 chars)
```

### PR Description Template

```markdown
## What
Brief description of the change.

## Why
Context and motivation.

## How to Test
1. Step to verify
2. Expected result

## Checklist
- [ ] Tests pass
- [ ] Build succeeds
- [ ] No secrets in code
- [ ] Reviewed own diff before requesting review
```

### PR Size Guidelines
- Ideal: ~100 lines changed
- Max: ~400 lines (split if larger)
- Single concern per PR

## Safety Rules

**Always ask user before:**
- `git push --force` / `git push -f`
- `git reset --hard`
- `git rebase` on shared branches
- `git branch -D` (force delete)
- `git clean -fd`

**Never:**
- Force push to `main`
- Amend commits that are already pushed (unless solo branch)
- Delete branches others are working on
