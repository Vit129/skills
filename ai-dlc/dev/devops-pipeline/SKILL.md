---
name: devops-pipeline
description: >
  This skill should be used when the user asks to "create a pipeline", "set up CI/CD",
  "create a pull request", "link work items", "sync to DevOps", "set up GitHub Actions",
  "set up GitLab CI", "add workflow YAML", "OIDC authentication", "keyless deployment",
  "reusable workflows", "concurrency control", or needs pipeline YAML generation, cron scheduling,
  test command selection, or PR creation with work item linking.
  Supports Azure DevOps, GitHub Actions, and GitLab CI.
  Also covers DevSecOps: "scan Docker image", "Trivy", "CodeQL", "secret detection",
  "Gitleaks", "SAST", "SCA", "security gate in pipeline", "shift-left security".
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
