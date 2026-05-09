---
name: devops-pipeline
description: >
  CI/CD pipeline creation, git workflow, PR management, and DevSecOps scanning.
  Use when setting up pipelines, creating PRs, configuring GitHub Actions,
  or adding security scanning to CI.
---

# DevOps Pipeline

CI/CD pipelines, git workflow, and DevSecOps — platform-agnostic with examples for GitHub Actions.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "create pipeline", "CI/CD", "workflow YAML" | `references/pipeline.md` |
| "commit", "push", "create PR", "git workflow" | `references/git-commit.md` |
| "security scan", "Trivy", "CodeQL", "Gitleaks", "SAST" | `references/security-scanning.md` |

## Quick Reference

### Git Workflow

```bash
# Feature branch flow
git checkout main && git pull
git checkout -b feat/feature-name
# ... work ...
git add -A
git commit -m "feat: description of change"
git push -u origin feat/feature-name
# → create PR
```

### Commit Convention

```
<type>(<scope>): <description>

Types: feat, fix, test, refactor, docs, ci, chore
Scope: optional — module or feature name
```

Examples:
```bash
feat(auth): add JWT refresh token rotation
fix(api): handle null response from payment gateway
test(checkout): add e2e test for guest checkout flow
ci: add Trivy image scanning to pipeline
```

### PR Checklist

Before creating a PR:
- [ ] All tests pass locally
- [ ] Build succeeds
- [ ] Lint/type check passes
- [ ] Commit messages follow convention
- [ ] No secrets in code
- [ ] PR title is descriptive (< 70 chars)
- [ ] Description includes: what changed, why, how to test

### Safety Rules

Always ask confirmation before:
- `git push -f` (force push)
- `git reset --hard`
- `git branch -D` (delete branch)
- `git rebase` on shared branches
- `git clean -fd`
