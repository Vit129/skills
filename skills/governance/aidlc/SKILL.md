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

## Pre-Flight: Mode + Approach Detection (Mandatory — before Phase 2)

> ถามตามลำดับ: 1) Mode (Full/QA/Dev) → 2) Development Approach (TDD vs SDLC) ก่อนเข้า Phase 2

**Question 1 — Execution Mode:**
- Full / QA Only / Dev Only (detect from command or ask)

**Question 2 — Development Approach (ถามก่อนเข้า Phase 2):**
- `"TDD"` / `"เขียน test ก่อน"` / `"test-first"` → TDD (Recommended)
- `"SDLC"` / `"code ก่อน"` / `"implement ก่อน"` → SDLC
- Not specified → default to TDD (Recommended)

**TDD (Recommended):** QA ก่อน Dev — เขียน test ก่อน แล้วค่อยเขียน code ให้ผ่าน (RED→GREEN→REFACTOR)
**SDLC:** Dev ก่อน QA — เขียน code ก่อน แล้วค่อยเขียน test ทีหลัง

**Detection:**
- **Kiro IDE:** reads Vibe/Spec mode from IDE context (user selects in UI, never types it)
- **Other AI agents:** detect from context (`.aidlc/` exists → Spec resume, complexity → Vibe/Spec) or ask user

**Global rule:** ALL AIDLC interactions use **dialog message format** (structured step-by-step) — not plain chat. Applies to every mode, every AI agent.

For detection logic, approach comparison, phase matrices, Vibe flow, escalation rules, dialog format, and artifact rules → Read `references/workflow.md` (Development Approach + Mode Selection + Dialog & Artifact Integration sections)

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

For skill routing guide → see AGENTS.md Skill Map (workspace root)

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

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "เขียน code เลย ไม่ต้อง plan" | Code without plan = rework. DECISIONS file takes 5 minutes, saves 5 hours. |
| "Feature เล็ก ไม่ต้องผ่าน AIDLC" | "เล็ก" is subjective. Even 1-endpoint features need DECISIONS + PLAN. The overhead is minimal. |
| "มี spec อยู่แล้ว ข้าม Phase 1 ได้" | Spec ≠ DECISIONS file. Phase 1 formalizes scope, constraints, and approach. Don't skip. |
| "Resume แล้ว ทำต่อเลย" | Resume MUST read existing artifacts first. Starting fresh wastes previous work. |
| "User บอก 'ทำเลย' = skip dialog" | Short commands are NOT permission to skip. Dialog flow is mandatory regardless of message length. |
| "Brainstorming ไม่จำเป็น feature นี้เล็ก" | Check the scale table. If medium+, brainstorming catches gaps that save rework in Phase 3. |

---

## Red Flags

- 🚩 Writing code without a DECISIONS file → STOP, create DECISIONS first
- 🚩 Phase 2 started without Phase 1 output → prerequisites missing
- 🚩 Agent auto-executing without dialog → must present options and wait for approval
- 🚩 All inception docs written in one shot without pauses → bulk dump, not phased execution
- 🚩 Task marked done without commit hash → not done
- 🚩 `.aidlc/` folder doesn't exist but agent is writing implementation → governance bypassed


---

## Verification

Before advancing to the next phase, confirm:

- [ ] DECISIONS file exists in `.aidlc/[system]/[feature]/planning/decisions/`
- [ ] Mode (Full/QA/Dev) explicitly selected and recorded
- [ ] Development Approach (TDD/SDLC) confirmed before Phase 2
- [ ] Phase gate check passed (previous phase output exists)
- [ ] Dialog format used for all interactions (not plain chat)
- [ ] Commit hash recorded for completed implementation tasks

---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| `references/workflow.md` | Workflow reference | Phase routing, dialog format, mode selection rules |
| `.aidlc/` folder | Artifact store | Resume state, phase outputs, decisions, plans |
| `knowledge/` (per-project or global) | Lessons learnt | Check before execute |
| MCP `azure-devops` tools | Integration | Sync work items, update boards, link commits |
| `references/templates/` | Templates | Planning, output, and framework templates |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| Mode selection (Full/QA/Dev) | Single select | Before Phase 2 starts |
| Development Approach (TDD/SDLC) | Single select | Before Phase 2 starts |
| Phase transition approval | Checkbox (approve/refine) | At every phase gate boundary |
| Brainstorming synthesis | Open field | After 3 Amigos output (Phase 1.8) |
| Task design review | Checkbox | Before Phase 3 execution begins |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.

## Self-Learning

After user approves the output:

1. **Record good example:** Save approved output to `knowledge/lessons/governance/{pattern}.md`
2. **Record failures:** If output was rejected → note what went wrong for next time
3. **Progressive update:** If a new pattern proved effective → append to relevant knowledge index
4. **Confidence tracking:** `confidence: 1.0` (user-approved) vs `confidence: 0.7` (auto-generated)
