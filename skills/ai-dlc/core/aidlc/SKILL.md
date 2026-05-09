---
name: aidlc
description: >
  AUTO-ACTIVATE when the user's intent involves any SDLC activity — do NOT wait for
  explicit "start AIDLC" command. Detect by intent, not by exact wording.

  AUTO-ACTIVATE signals (match by meaning):
  - Implement / Build: implement, build, create feature, develop, write code, add, refactor,
    migrate, integrate, ทำ, สร้าง, เพิ่ม feature, พัฒนา, เขียนโค้ด
  - Test / QA: test, testing, QA, automation, automate, test scenario, test case,
    playwright, robot framework, ทดสอบ, เขียน test, สร้าง test scenario, หา bug
  - Bug / Fix: fix bug, debug, reproduce issue, investigate failure, แก้ bug, หาสาเหตุ error
  - Deploy / DevOps: deploy, pipeline, CI/CD, release, docker, ขึ้น production
  - Technical Design: API design, database schema, domain design, architecture, ออกแบบ API
  - Any "verb + software artifact": write/create/fix/update + file/function/component/service/endpoint

  SKIP AIDLC for: pure research, brainstorming questions, finance/fitness domain tasks,
  settings/config changes with no code output.

  Explicit triggers (legacy support):
  "start AIDLC", "เริ่ม AI-DLC", "resume AI-DLC", "ทำต่อ",
  "start from domain design", "start from logical design",
  "QA only", "Dev only", "QA scenario only", "QA automation",
  "ทำแค่ QA", "ทำแค่ Dev", "ทำ test อย่างเดียว",
  or needs governance for the AI Development Lifecycle.

  ALL coding, development, and QA work MUST go through this skill first.
  Supports 3 modes: Full (default), QA Only, Dev Only.
---

# AIDLC (AI Development Lifecycle)

Full governance and planning for the complete development lifecycle.

## Pre-Flight: Mode Detection (Mandatory — before Brainstorming)

> ทำก่อนทุกอย่าง — detect mode แล้วค่อย route ไป Brainstorming หรือ Lite Inception

**Detection:**
- **Kiro IDE:** reads Vibe/Spec mode from IDE context (user selects in UI, never types it)
- **Other AI agents:** detect from context (`.aidlc/` exists → Spec resume, complexity → Vibe/Spec) or ask user

**Global rule:** ALL AIDLC interactions use **dialog message format** (structured step-by-step) — not plain chat. Applies to every mode, every AI agent.

For detection logic, Vibe flow, and escalation rules → Read `references/vibe-mode.md`
For dialog format templates and artifact rules → Read `references/kiro-spec-integration.md`

## Pre-Flight: Brainstorming (Mandatory for New Features)

> ทำก่อน Phase 0 เสมอ เมื่อ user เริ่ม AIDLC ใหม่ (ไม่มี `.aidlc/` folder สำหรับ feature นี้)
> Load `core/brainstorming/SKILL.md` → run Party Mode → produce output-template.md → handoff to Phase 0

**Skip this step if:**
- มี `.aidlc/` folder อยู่แล้ว (resume session)
- User พิมพ์ "resume", "ทำต่อ", หรือ phase entry command เช่น "start from logical design"

**Scale (auto-detect จาก complexity ที่ประเมินได้):**

| Size | Signals | Brainstorming Mode |
|------|---------|-------------------|
| Small | bug fix, 1 story, minor tweak | Quick: 1 round, 1 คำถามต่อ role |
| Medium | 2-5 stories, new feature | Normal: 2 rounds |
| Large | 6+ stories, new system | Full: 3 rounds |

User สามารถ override ได้: "ขอแบบ quick" หรือ "ขอแบบ deep"

## Rules & Guides

- **Vibe Mode** — Fast-track flow, detection logic, escalation rules. (Read `references/vibe-mode.md`)
- **Dialog & Artifact Rules** — Dialog format templates, artifact path rules. (Read `references/kiro-spec-integration.md`)
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

> **Brainstorming** — mandatory ก่อน Phase 0 ทุก new feature → `core/brainstorming/SKILL.md`
> **Subagent-Driven** — ใช้ระหว่าง Phase 3.1 เมื่อมี 3+ independent tasks → `core/subagent-driven/SKILL.md`

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
