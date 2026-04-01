---
name: devops-pipeline
description: >
  This skill should be used when the user asks to "create a pipeline", "set up CI/CD",
  "create a pull request", "link work items", "sync to DevOps", "set up GitHub Actions",
  "set up GitLab CI", "add workflow YAML", or needs pipeline YAML generation, cron scheduling,
  test command selection, or PR creation with work item linking.
  Supports Azure DevOps, GitHub Actions, and GitLab CI.
---

# DevOps Pipeline

Create CI/CD pipelines and manage pull requests across Azure DevOps, GitHub Actions, and GitLab CI.

- **Pipeline** — Generate pipeline YAML files with scheduling, test commands, and notifications. (Read `references/pipeline.md`)
- **Pull Request** — Create PRs linked to work items with test result summaries. (Read `references/pull-request.md`)
- **Azure DevOps Sync** — Auto-create work items, tasks, and test cases via MCP. (Read `references/azure-sync.md`)
- **GitHub Actions** — Workflow YAML for GitHub repositories: triggers, jobs, secrets, branch protection, and reusable workflows. (Read `references/github-actions.md`)

## Platform Selection

Ask which platform if not stated, then follow the appropriate reference:

- **Azure DevOps** → `azure-sync.md` for work items + `pipeline.md` for YAML
- **GitHub** → `github-actions.md` for workflow YAML + `pull-request.md` for PRs
- **GitLab CI** → follow GitHub Actions patterns but adapt syntax to `.gitlab-ci.yml` (stages, jobs, artifacts)
