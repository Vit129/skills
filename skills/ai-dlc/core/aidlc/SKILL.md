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
  "QA only", "Dev only", "QA scenario only", "QA automation",
  "ทำแค่ QA", "ทำแค่ Dev", "ทำ test อย่างเดียว",
  or needs governance for the AI Development Lifecycle.
  ALL coding, development, and QA work MUST go through this skill first.
  Supports 3 modes: Full (default), QA Only, Dev Only.
  Non-coding tasks (research, analysis, finance, presentation, knowledge management)
  can go directly to the relevant skill or knowledge without AIDLC governance.
---

# AIDLC (AI Development Lifecycle)

Full governance and planning for the complete development lifecycle.

## Rules & Guides

- **Workflow Rules** — DECISIONS→PLAN→EXECUTE, phases, naming, quick commands. (Read `references/workflow.md`)
- **Decision-Plan-Execute** — Structured decision-making with mandatory user approval. (Read `references/decision.md`)
- **Approval Framework** — (Read `references/guides/approval-framework.md`)
- **Resume Command** — (Read `references/guides/resume-command.md`)
- **Phase Entry** — (Read `references/guides/phase-entry.md`)
- **Recommendations** — (Read `references/guides/recommendations.md`)

## Task Design

- **Task Progress Guide** — (Read `references/shared-task-progress-guide.md`)
- **Dev Task Design** — (Read `references/dev-task-design.md`)
- **QA Task Design** — (Read `references/qa-task-design.md`)
- **Knowledge Buffer** — Capture and reuse patterns across features. (Read `references/knowledge-buffer.md`)

## Phase Instructions & Routing

For full phase list, routing table, and anti-shortcut rules → (Read `references/workflow.md`)

## Templates

- Planning: `references/templates/planning/`
- Outputs: `references/templates/outputs/`
- Frameworks: `references/templates/frameworks/`

## Related Skills

For skill routing guide → (Read `references/related-skills.md`)

## ⚠️ Gotchas

- **Phase skip** — agent jumps from Domain Design directly to implementation without Logical Design. Fix: enforce phase gate — check that the previous phase output file exists before proceeding.
- **Decision file not created** — agent starts planning without creating a DECISIONS file first. Fix: DECISIONS file is mandatory before any PLAN or EXECUTE step.
- **Resume without reading context** — on resume, agent starts from scratch instead of reading the existing decision/plan files. Fix: always read `planning/decisions/` and `planning/plans/` before any action on resume.
- **Multiple agents on same task** — two agents (e.g., Gemini + Claude) edit the same file simultaneously, causing conflicts. Fix: one agent owns one task start-to-finish.
- **Task marked done without commit** — agent reports completion but hasn't committed. Fix: commit hash is the only proof of completion — no hash = not done.

## Knowledge Root Convention

`{knowledge_root}` resolves in this order:

| Priority | Path | When to use |
|----------|------|-------------|
| 1. Per-project | `{cwd}/agent-memory/knowledge/` | Working within a specific project workspace — walk up from cwd until found |
| 2. Global fallback | `{project_root}/skills/knowledge/` | No per-project knowledge found — cross-project shared patterns |

**Rule:** Always check per-project first. Fall back to global only if `agent-memory/knowledge/` does not exist in the project tree.
