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
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# DevOps Pipeline

## AIDLC Gate

⚠️ If this skill is triggered as part of a coding/QA task:
- AIDLC governance MUST be active (`.aidlc/` folder exists with DECISIONS + PLAN)
- If not → STOP and route to `governance/aidlc/` first
- Exception: pure investigation/analysis (no code changes) can proceed without AIDLC


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

## Inline Process

1. **Identify the task** — Determine: Pipeline YAML creation, PR creation, Git commit/push, Azure DevOps sync, or Security scanning. Ask which platform (Azure DevOps / GitHub / GitLab) if not stated.
2. **Pipeline creation** — Ask: trigger type, branch, schedule time (convert to UTC cron), test command. Auto-detect: path, feature name, DB strategy, variable groups. Include test stage (non-negotiable) + security scanning.
3. **Git commit & push** — Format: `[AB#xxxxx] Description` (direct) or `[PR][AB#xxxxx] Description` (feature branch). Stage specific files, not `git add .`. Never force push without permission.
4. **Create PR** — Prerequisites: all tests must pass (0 failures). Link to work items. Update work item status. FORBIDDEN to create PR with failing tests.
5. **Security scanning** — Enable Trivy, CodeQL, Gitleaks in pipeline. Never disable "temporarily".
6. **Verify** — Pipeline has test stage, no secrets in YAML/history, security scanning enabled, branch protection on main, pipeline runs green.

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

---


## Consistency Contract

> These steps MUST execute in the same order every time this skill runs.
> Output may vary, but the workflow is fixed.
> If any step is skipped without a documented skip condition, the session-save hook will flag this skill.

## Verification

Before declaring pipeline/PR work complete, confirm:

- [ ] Pipeline YAML has test stage (not skipped)
- [ ] No secrets in YAML or commit history
- [ ] Security scanning enabled (Trivy/CodeQL/Gitleaks)
- [ ] Branch protection rules configured on main
- [ ] PR linked to work items (if Azure DevOps)
- [ ] Pipeline runs successfully (green check)


---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| CI/CD platform config (Azure Pipelines / GitHub Actions / GitLab CI) | Infrastructure | Target platform for pipeline YAML |
| Existing pipeline configs in repo | Source code | Match conventions, avoid duplication |
| `references/*.md` (one per task) | Skill reference | Pipeline, PR, git-commit, security-scanning |
| Branch protection rules | Platform settings | Understand deployment gates |
| `knowledge/lessons/` | Lessons learnt | Check before execute |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After pipeline design | Checkbox (confirm stages/triggers) | Before writing pipeline YAML |
| Before deploying to production | Single select (deploy now / schedule / hold) | At production deployment gate |
| Before security gate changes | Open field | When modifying security scanning config |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.

## Self-Learning

After user approves the output:

1. **Record good example:** Save approved output to `knowledge/lessons/devops/{pattern}.md`
2. **Record failures:** If output was rejected → note what went wrong for next time
3. **Progressive update:** If a new pattern proved effective → append to relevant knowledge index
4. **Confidence tracking:** `confidence: 1.0` (user-approved) vs `confidence: 0.7` (auto-generated)

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
