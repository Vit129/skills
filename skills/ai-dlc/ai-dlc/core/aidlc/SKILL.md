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

## Pre-Flight: Mode Detection (Mandatory — before Brainstorming)

> ทำก่อนทุกอย่าง — detect mode แล้วค่อย route ไป Brainstorming หรือ Lite Inception

**Detection:**
- **Kiro IDE:** reads Vibe/Spec mode from IDE context (user selects in UI, never types it)
- **Other AI agents:** detect from context (`.aidlc/` exists → Spec resume, complexity → Vibe/Spec) or ask user

**Global rule:** ALL AIDLC interactions use **dialog message format** (structured step-by-step) — not plain chat. Applies to every mode, every AI agent.

For detection logic, Vibe flow, and escalation rules → Read `references/vibe-mode.md`
For dialog format templates and artifact rules → Read `references/kiro-spec-integration.md`

## Phase 1.8: Brainstorming — 3 Amigos Review (after Inception, before Task Design)

> ทำหลัง Phase 1 (Inception) เสร็จ — ก่อนเข้า Phase 2 (Task Design)
> Load `core/brainstorming/SKILL.md` → dispatch PO/Dev/QA subagents → synthesize → refine if needed → proceed to Phase 2

**Why here?** เหมือนทำงานจริง — PO ให้ requirement มาแล้ว (Phase 1) → ทีมคุยกัน (3 amigos)
→ ตกผลึก → แล้วค่อยแบ่งงาน (Phase 2)

**Input:** Phase 1 artifacts (user-stories.md, domain-design.md, logical-design.md)
**Output:** `.aidlc/[system]/[feature]/outputs/inception/brainstorming-summary.md`

**Pre-step:** Run `core/analysis-skills` (gap.md) on Phase 1 outputs → feed gaps to all subagents

**Skip this step if:**
- Small feature (1-2 user stories, single endpoint) — go directly to Phase 2
- Resume session where brainstorming already completed (`brainstorming-summary.md` exists)
- User explicitly says "ข้าม brainstorming" or "ไปต่อเลย"

**Scale (auto-detect จาก Phase 1 output volume):**

| Size | Signals | Brainstorming Mode |
|------|---------|-------------------|
| Small | 1-2 user stories, 1 endpoint | Quick: 1 round, 1 question per role |
| Medium | 3-5 user stories, multi-page | Normal: 2 rounds |
| Large | 6+ user stories, multi-context | Full: 3 rounds |

User สามารถ override ได้: "ขอแบบ quick" หรือ "ขอแบบ deep"

## Rules & Guides

- **Vibe Mode** — Inline in workflow.md (Mode Selection + Escalation sections)
- **Workflow Rules** — DECISIONS→PLAN→EXECUTE, phases, naming, quick commands, decision dialog, Kiro tool mapping — ALL in one file. (Read `references/workflow.md`)
- **All other guides** — Included in `references/workflow.md` sections

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

> **Brainstorming** — Phase 1.8 (หลัง Inception, ก่อน Task Design) — 3 Amigos review via subagents → `core/brainstorming/SKILL.md`
> **Subagent-Driven** — ใช้ระหว่าง Phase 3.1 เมื่อมี 3+ independent tasks → `core/subagent-driven/SKILL.md`

## ⚠️ Gotchas

- **Phase skip** — agent jumps from Domain Design directly to implementation without Logical Design. Fix: enforce phase gate — check that the previous phase output file exists before proceeding.
- **Decision file not created** — agent starts planning without creating a DECISIONS file first. Fix: DECISIONS file is mandatory before any PLAN or EXECUTE step.
- **Resume without reading context** — on resume, agent starts from scratch instead of reading the existing decision/plan files. Fix: always read `planning/decisions/` and `planning/plans/` before any action on resume.
- **Multiple agents on same task** — two agents (e.g., Gemini + Claude) edit the same file simultaneously, causing conflicts. Fix: one agent owns one task start-to-finish.
- **Task marked done without commit** — agent reports completion but hasn't committed. Fix: commit hash is the only proof of completion — no hash = not done.
- **Dialog skipped on short commands** — user gives a brief command like "PBI-002" or "ทำต่อ feature X" and agent auto-executes everything without dialog. Fix: ANY AIDLC trigger — regardless of how short the user's message is — MUST still follow the full dialog flow (Phase Announcement → Decision Dialog → wait for approval → execute). Short commands are NOT permission to skip dialog. The agent must:
  1. Detect the feature/PBI
  2. Check `.aidlc/` for existing state (resume vs new)
  3. If new: run Brainstorming first
  4. Present Phase Announcement with structured options
  5. Wait for user approval before writing any artifact
- **Bulk artifact dump** — agent writes all inception docs (user-stories, domain-decomposition, domain-design, logical-design) in one shot without pausing between phases. Fix: each phase MUST end with a Progress Breadcrumb and "→ พร้อมไปต่อ?" before starting the next phase. User must explicitly approve or say "ทำต่อเลย" / "approve all remaining".
- **Brainstorming skipped or misplaced** — agent runs brainstorming before Phase 1 (no artifacts to analyze) or skips it entirely for medium+ features. Fix: brainstorming is Phase 1.8 — runs AFTER Inception produces artifacts, BEFORE Phase 2 Task Design. Check `brainstorming-summary.md` exists before entering Phase 2 for medium+ features.
- **Output path not confirmed** — agent writes QA test files or Dev source files to wrong project folder (e.g., `Automation/` instead of `ai-dlc-skill-testing/`) because workspace has multiple sibling project folders. Fix: Phase 0 MUST ask user to confirm output root for `.aidlc/`, QA test files, and Dev source files before writing the first file of each type. Use `userInput` tool. Store confirmed paths in `qa-task-progress.md` and `dev-task-progress.md` Context section so subagents inherit correct paths. Skip only if user already specified folder explicitly in their message.

## Knowledge Root Convention

`{knowledge_root}` resolves in this order:

| Priority | Path | When to use |
|----------|------|-------------|
| 1. Per-project | `{cwd}/agent-memory/knowledge/` | Working within a specific project workspace — walk up from cwd until found |
| 2. Global fallback | `{project_root}/skills/knowledge/` | No per-project knowledge found — cross-project shared patterns |

**Rule:** Always check per-project first. Fall back to global only if `agent-memory/knowledge/` does not exist in the project tree.
