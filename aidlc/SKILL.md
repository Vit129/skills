---
name: aidlc
description: >
  This skill should be used when the user asks to "start AIDLC", "เริ่ม AI-DLC", "start AI-DLC",
  "create a decision file", "สร้าง decision", "plan the execution", "วางแผน",
  "break down tasks", "แบ่งงาน", "resume AI-DLC", "ทำต่อ",
  "start from domain design", "start from logical design",
  "ทำ web", "ทำ api", "ทำ feature", "สร้าง app", "build",
  "test scenario", "test case", "สร้าง test", "เขียน test",
  "automate", "automation", "QA", "testing",
  or needs governance for the AI Development Lifecycle.
  ALL development and QA work MUST go through this skill first.
---

# AIDLC (AI Development Lifecycle)

Full governance and planning for the complete development lifecycle.

## Rules & Guides

- **Workflow Rules** — DECISIONS→PLAN→EXECUTE, phases, naming conventions, quick commands. (Read `references/workflow.md`)
- **Decision-Plan-Execute** — Structured decision-making with mandatory user approval. (Read `references/decision.md`)
- **Approval Framework** — How to get and handle user approval. (Read `references/guides/approval-framework.md`)
- **Resume Command** — How to resume paused AI-DLC sessions. (Read `references/guides/resume-command.md`)
- **Phase Entry** — Multi-entry point support for starting from any phase. (Read `references/guides/phase-entry.md`)
- **Recommendations** — Decision framework and recommendation principles. (Read `references/guides/recommendations.md`)

## Task Design

- **Task Progress Guide** — Shared rules for progress tracking, file behavior, master index, resume. (Read `references/shared-task-progress-guide.md`)
- **Dev Task Design** — Break logical design into atomic 1-2 hour dev tasks. (Read `references/dev-task-design.md`)
- **QA Task Design** — Break test scenarios into atomic 1-2 hour QA tasks. (Read `references/qa-task-design.md`)
- **Template Creation** — Initialize files from master templates. (Read `references/template-creation.md`)

## Phase Instructions

### Inception
- 1.1 Reverse Engineering → (Read `references/phases/inception/reverse-engineering.md`)
- 1.2 Requirements Gathering → (Read `references/phases/inception/requirements-gathering.md`)
- 1.3 Domain Decomposition → (Read `references/phases/inception/domain-decomposition.md`)
- 1.4 Domain Design → (Read `references/phases/inception/domain-design.md`)
- 1.5 Logical Design → (Read `references/phases/inception/logical-design.md`)
- 1.6 UI/UX Design → Use `ui-designer` + `analysis-skills` (figma.md)
- 1.7 Dev Task Design → (Read `references/dev-task-design.md`)

### QA Focus
- 2.1 Test Case Design → (Read `references/phases/inception/test-case-design.md`)
- 2.2 QA Architecture → Use `qa-architect` skill
- 2.3 Test Script Design → (Read `references/phases/inception/test-script-design.md`)
- 2.4 QA Task Design → (Read `references/qa-task-design.md`)
- 2.5 DevOps Sync → (Read `references/phases/inception/azure-devops-sync.md`)

### Construction
- 3.1 Implementation → (Read `references/phases/construction/implementation.md`)
- 3.2 Automated Testing → (Read `references/phases/construction/automated-testing-execution.md`)
- 3.3 Create Pull Request → (Read `references/phases/construction/create-pull-request.md`)

### Operation
- 4.1 Deployment → (Read `references/phases/operation/deployment.md`)

## Templates

- Planning: `references/templates/planning/` (decision-record, plan, implementation-plan)
- Outputs: `references/templates/outputs/` (user-stories, domain-decomposition, domain-design, logical-design, test-cases, test-script, task-decomposition, audit)
- Frameworks: `references/templates/frameworks/` (technical-questions)

## Related Skills

- Analysis → `analysis-skills`
- Architecture → `architect`, QA architecture → `qa-architect`
- AI reasoning → `ai-techniques`
- Test scenarios → `test-scenario`
- Code writing/testing → `playwright-testing`, `robotframework-testing`
- Frontend → `frontend-dev`, Backend → `backend-dev`
- Pipeline & PR & DevOps sync → `devops-pipeline`
- UI/UX → `ui-designer`
