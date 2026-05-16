---
name: devops-pipeline
description: >
  This skill should be used when the user asks to "create a pipeline", "สร้าง pipeline",
  "set up CI/CD", "ตั้งค่า CI/CD", "create a pull request", "สร้าง pull request",
  "link work items", "link work item", "sync to DevOps", "sync DevOps",
  "set up GitHub Actions", "ตั้งค่า GitHub Actions", "set up GitLab CI", "add workflow YAML",
  "OIDC authentication", "keyless deployment", "reusable workflows",
  "concurrency control", "คอมมิต", "พุช", "commit", "push",
  or needs pipeline YAML generation, cron scheduling, test command selection, or PR creation with work item linking.
  Supports Azure DevOps, GitHub Actions, and GitLab CI.
  Also covers DevSecOps: "scan Docker image", "Trivy", "CodeQL", "secret detection",
  "Gitleaks", "SAST", "SCA", "security gate in pipeline", "shift-left security",
  "สแกน Docker image", "ตรวจสอบ security".
---

# DevOps Pipeline

Create CI/CD pipelines and manage pull requests across Azure DevOps, GitHub Actions, and GitLab CI.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "create pipeline", "CI/CD YAML", "schedule tests", "cron" | `references/pipeline.md` |
| "create PR", "pull request", "link work items", "test summary" | `references/pull-request.md` |
| "sync to DevOps", "create work items", "create tasks via MCP" | `references/azure-sync.md` |
| "GitHub Actions", "workflow YAML", "GitHub CI", "branch protection" | `references/github-actions.md` |
| "commit", "push", "git commit", "คอมมิต", "พุช" | `references/git-commit.md` |
| "scan image", "Trivy", "CodeQL", "Gitleaks", "SAST", "SCA", "secret scan", "security gate" | `references/security-scanning.md` |

Ask which platform if not stated, then follow the appropriate reference:

- Azure DevOps → `azure-sync.md` for work items + `pipeline.md` for YAML
- GitHub → `github-actions.md` for workflow YAML + `pull-request.md` for PRs
- GitLab CI → follow GitHub Actions patterns but adapt syntax to `.gitlab-ci.yml` (stages, jobs, artifacts)

- **Pipeline** — Generate pipeline YAML files with scheduling, test commands, and notifications. (Read `references/pipeline.md`)
- **Pull Request** — Create PRs linked to work items with test result summaries. (Read `references/pull-request.md`)
- **Azure DevOps Sync** — Auto-create work items, tasks, and test cases via MCP. (Read `references/azure-sync.md`)
- **GitHub Actions** — Workflow YAML for GitHub repositories: triggers, jobs, OIDC keyless auth, reusable workflows, concurrency control, and branch protection. (Read `references/github-actions.md`)
- **Security Scanning** — Shift-left DevSecOps: Trivy (image/deps), CodeQL (SAST), Gitleaks (secrets), Semgrep. Used by both dev and QA pipelines. (Read `references/security-scanning.md`)

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "Security scanning slows down the pipeline" | A 2-minute scan is cheaper than a 2-week incident response. Shift-left is faster overall. |
| "We'll add security gates later" | Pipelines without gates ship vulnerabilities to production. Add gates from day 1. |
| "It's an internal tool, security doesn't matter" | Internal tools get compromised too. Lateral movement starts from internal services. |
| "I'll just hardcode the secret for now" | "For now" becomes "forever". Use env vars or secret managers from the start. |
| "The test stage isn't needed for this PR" | Every PR can introduce regressions. Test stage is non-negotiable. |
| "OIDC is too complex, I'll use long-lived tokens" | Long-lived tokens are the #1 credential leak vector. OIDC is worth the setup cost. |

---

## Red Flags

- 🚩 Pipeline has no test stage → incomplete, add test execution
- 🚩 Secrets in YAML files or commit history → rotate immediately
- 🚩 No branch protection on main → anyone can push directly
- 🚩 Security scan disabled "temporarily" → re-enable, temporary = permanent
- 🚩 Pipeline passes but no artifact/report generated → silent failures hidden
- 🚩 Manual deployment without approval gate → add environment protection rules
