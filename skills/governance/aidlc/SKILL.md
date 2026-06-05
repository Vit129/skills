---
name: aidlc
description: >
  This skill should be used when the user asks to "start AIDLC", "start AI-DLC",
  "create a decision file", "plan the execution",
  "break down tasks", "resume AI-DLC",
  "start from domain design", "start from logical design",
  "build web", "build api", "build feature", "create app", "build",
  "test scenario", "test case", "create test", "write test",
  "automate", "automation", "QA", "testing",
  "QA only", "Dev only", "QA scenario only", "QA automation", "QA scenario automation",
  or needs governance for the AI Development Lifecycle.
  ALL coding, development, and QA work MUST go through this skill first.
  Supports 3 modes: Full (default), QA Only, Dev Only.
  Non-coding tasks (research, analysis, finance, presentation, knowledge management)
  can go directly to the relevant skill or knowledge without AIDLC governance.
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# AIDLC (AI Development Lifecycle)

## AIDLC Gate

⚠️ If this skill is triggered as part of a coding/QA task:
- AIDLC governance MUST be active (`.aidlc/` folder exists with DECISIONS + PLAN)
- If not → STOP and route to `governance/aidlc/` first
- Exception: pure investigation/analysis (no code changes) can proceed without AIDLC


---

Full governance and planning for the complete development lifecycle.

## Pre-Flight: Mode + Approach Detection (Mandatory — before Phase 2)

> Ask in order: 1) Mode (Full/QA/Dev) → 2) QA Sub-Mode (if QA Only) → 3) Development Approach (TDD vs SDLC) before entering Phase 2

**Question 1 — Execution Mode:**
- Full / QA Only / Dev Only (detect from command or ask)

**Question 1b — QA Sub-Mode (ask only when Mode = QA Only):**

| Sub-Mode | Command | Phases | Output |
|----------|---------|--------|--------|
| QA Scenario Only | `"start AI-DLC QA scenario only"` | 2.1 → 2.2 | test scenarios (CSV/MD) |
| QA Automation | `"start AI-DLC QA automation"` | 2.1 → 2.2 → 2.3 → 2.4 | test scenarios + test scripts |
| QA Scenario + Automation | `"start AI-DLC QA scenario automation"` | 2.1 → 2.2 → pause → 2.3 → 2.4 | test scenarios (approve first) + test scripts |

If not specified → ask with 3 options:
```
Which QA Phase do you want?
A) QA Scenario Only — Design Test Scenario (2.1 → 2.2) then done
B) QA Automation — Design + write Playwright automation (2.1 → 2.2 → 2.3 → 2.4)
C) QA Scenario + Automation — Design scenario first, pause for approval, then continue automation (2.1 → 2.2 → pause → 2.3 → 2.4)
```

**QA Scenario + Automation behavior:**
- Phase 2.1 → 2.2 complete → pause → show Progress Breadcrumb → wait for user to approve scenarios
- After approval → continue Phase 2.3 → 2.4 immediately (no need to ask mode again)

**When mode = QA Automation or QA Scenario + Automation → ask platform:**
```
Which platform? (can select more than 1)
1. API
2. Web UI
3. API + Web UI
4. Android / iOS / Mobile
```

**Question 2 — Development Approach (ask ONLY when mode = Full):**
- ⚠️ **SKIP this question entirely for QA Only and Dev Only modes** — not applicable
- `"TDD"` / `"write test first"` / `"test-first"` → TDD (Recommended)
- `"SDLC"` / `"code first"` / `"implement first"` → SDLC
- Not specified → default to TDD (Recommended)

**TDD (Recommended):** QA first, then Dev — write test first, then write code to pass (RED→GREEN→REFACTOR)
**SDLC:** Dev first, then QA — write code first, then write test later

**⚠️ When mode = QA Only:** Do NOT ask TDD/SDLC. QA Only always follows: Lite Inception → 2.1 → 2.2 → 2.3 → 2.4. There is no "code first" option in QA Only mode.

**Detection:**
- **Kiro IDE:** reads Vibe/Spec mode from IDE context (user selects in UI, never types it)
- **Other AI agents:** detect from context (`.aidlc/` exists → Spec resume, complexity → Vibe/Spec) or ask user

**Global rule:** ALL AIDLC interactions use **dialog message format** (structured step-by-step) — not plain chat. Applies to every mode, every AI agent.

For detection logic, approach comparison, phase matrices, Vibe flow, escalation rules, dialog format, and artifact rules → Read `references/workflow.md` (Development Approach + Mode Selection + Dialog & Artifact Integration sections)

## Phase 1.8: Brainstorming — 3 Amigos Review (after Inception, before Task Design)

> Execute after Phase 1 (Inception) completes — before entering Phase 2 (Task Design)
> Load `thinking/brainstorming/SKILL.md` → dispatch PO/Dev/QA subagents → synthesize → refine if needed → proceed to Phase 2

**Why here?** Like real work — PO provides requirements (Phase 1) → team discusses (3 amigos)
→ crystallizes → then break down tasks (Phase 2)

**Input:** Phase 1 artifacts (user-stories.md, domain-design.md, logical-design.md) + UI/UX context (ui-ux-design.md, Figma/wireframe if exists)
**Output:** `.aidlc/[system]/[feature]/outputs/inception/brainstorming-summary.md`

**Pre-step:** Run `thinking/analysis-skills` (gap.md) on Phase 1 outputs → feed gaps to all subagents
**Pre-step 2:** Load `ux-ui/ui-designer/SKILL.md` context → PO subagent validates UX flow vs user stories

**Skip this step if:**
- Small feature (1-2 user stories, single endpoint) — go directly to Phase 2
- Resume session where brainstorming already completed (`brainstorming-summary.md` exists)
- User explicitly says "skip brainstorming" or "continue"

**Scale (auto-detect from Phase 1 output volume):**

| Size | Signals | Brainstorming Mode |
|------|---------|-------------------|
| Small | 1-2 user stories, 1 endpoint | Quick: 1 round, 1 question per role |
| Medium | 3-5 user stories, multi-page | Normal: 2 rounds |
| Large | 6+ user stories, multi-context | Full: 3 rounds |

User can override: "request quick" or "request deep"

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

## CONTEXT.md — Per-Project Domain Glossary

Every project should have a `CONTEXT.md` at its root — a shared language between human and AI.
Generated as a side-effect of Phase 1 (domain-design step). Updated inline during interview-me, interview-doc, and brainstorming.

- **Format:** See `references/CONTEXT-FORMAT.md`
- **Create lazily:** Only when the first domain term is resolved
- **Update inline:** When a term is sharpened during any session, update immediately — don't batch
- **No implementation details:** Glossary only — what terms mean, not how they're built

**When to use which skill to update CONTEXT.md:**

| Situation | Skill |
|-----------|-------|
| No code yet, want to extract requirements | `thinking/interview-me` |
| Have codebase, want to align language with code | `thinking/interview-doc` |
| After Phase 1 Inception completes, team discusses | `thinking/brainstorming` |

## Templates

- Planning: `references/templates/planning/`
- Outputs: `references/templates/outputs/`
- Frameworks: `references/templates/frameworks/`

## Related Skills

For skill routing guide → see AGENTS.md Skill Map (workspace root)

> **Brainstorming** — Phase 1.8 (after Inception, before Task Design) — 3 Amigos review via subagents → `thinking/brainstorming/SKILL.md`
> **Subagent-Driven** — use during Phase 3.1 when 3+ independent tasks exist → `governance/subagent-driven/SKILL.md`
> **Interview-Me** — before Phase 0 when no code yet — extract requirements → `thinking/interview-me`
> **Interview-Doc** — before Phase 0 when codebase exists — align language + cross-ref code + update CONTEXT.md → `thinking/interview-doc`

## ⚠️ Gotchas

- **Phase skip** — agent jumps from Domain Design directly to implementation without Logical Design. Fix: enforce phase gate — check that the previous phase output file exists before proceeding.
- **Decision file not created** — agent starts planning without creating a DECISIONS file first. Fix: DECISIONS file is mandatory before any PLAN or EXECUTE step.
- **Resume without reading context** — on resume, agent starts from scratch instead of reading the existing decision/plan files. Fix: always read `planning/decisions/` and `planning/plans/` before any action on resume.
- **Multiple agents on same task** — two agents (e.g., Gemini + Claude) edit the same file simultaneously, causing conflicts. Fix: one agent owns one task start-to-finish.
- **Task marked done without commit** — agent reports completion but hasn't committed. Fix: commit hash is the only proof of completion — no hash = not done.
- **Dialog skipped on short commands** — user gives a brief command like "TICKET-002" or "continue feature X" and agent auto-executes everything without dialog. Fix: ANY AIDLC trigger — regardless of how short the user's message is — MUST still follow the full dialog flow (Phase Announcement → Decision Dialog → wait for approval → execute). Short commands are NOT permission to skip dialog. The agent must:
  1. Detect the feature/ticket
  2. Check `.aidlc/` for existing state (resume vs new)
  3. If new: run Brainstorming first
  4. Present Phase Announcement with structured options
  5. Wait for user approval before writing any artifact
- **Bulk artifact dump** — agent writes all inception docs (user-stories, domain-decomposition, domain-design, logical-design) in one shot without pausing between phases. Fix: each phase MUST end with a Progress Breadcrumb and "→ ready to continue?" before starting the next phase. User must explicitly approve or say "continue" / "approve all remaining".
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
| "Just write code, no need to plan" | Code without plan = rework. DECISIONS file takes 5 minutes, saves 5 hours. |
| "Feature is small, doesn't need AIDLC" | "Small" is subjective. Even 1-endpoint features need DECISIONS + PLAN. The overhead is minimal. |
| "Already have spec, can skip Phase 1" | Spec ≠ DECISIONS file. Phase 1 formalizes scope, constraints, and approach. Don't skip. |
| "Resume, just continue" | Resume MUST read existing artifacts first. Starting fresh wastes previous work. |
| "User said 'do it' = skip dialog" | Short commands are NOT permission to skip. Dialog flow is mandatory regardless of message length. |
| "Brainstorming not needed, feature is small" | Check the scale table. If medium+, brainstorming catches gaps that save rework in Phase 3. |

---

## Red Flags

- 🚩 Writing code without a DECISIONS file → STOP, create DECISIONS first
- 🚩 Phase 2 started without Phase 1 output → prerequisites missing
- 🚩 Agent auto-executing without dialog → must present options and wait for approval
- 🚩 All inception docs written in one shot without pauses → bulk dump, not phased execution
- 🚩 Task marked done without commit hash → not done
- 🚩 `.aidlc/` folder doesn't exist but agent is writing implementation → governance bypassed


---


## Consistency Contract

> These steps MUST execute in the same order every time this skill runs.
> Output may vary, but the workflow is fixed.
> If any step is skipped without a documented skip condition, the session-save hook will flag this skill.

### Per-Phase Mandatory Steps (Standard Process)

Every phase MUST execute steps 1-9 in this order:

| Step | Action | Skip Condition |
|------|--------|----------------|
| 1 | Create DECISIONS file (`planning/decisions/{NN}-{phase-name}.md`) | Never skip |
| 2 | Wait for user to resolve decisions | Never skip |
| 3 | Create PLAN file (`planning/plans/{NN}-{phase-name}.md`) | Never skip |
| 4 | Show PREVIEW (draft output summary) to user | Never skip |
| 5 | Wait for user APPROVAL | Never skip |
| 6 | EXECUTE — write output files | Never skip |
| 7 | Update `audit.md` with phase entry | Never skip |
| 8 | Update `PROGRESS.md` with current counts | Never skip |
| 9 | Capture knowledge to Knowledge Buffer | No new pattern learned |
| 10 | Update GRAPH_REPORT.md | No new files created |
| 11 | Update agent-memory (Task_Ledger + Playbook) | No real artifact produced |

### Lite Inception Internal Steps (QA Only / QA Automation / Dev Only)

> Used by: QA Scenario Only, QA Automation, Dev Only modes (replaces Full Phase 0–1.8)
> Full details + output format: see `references/workflow.md` → "Lite Inception" section
> This table = execution checklist. workflow.md = detailed reference with examples.

| Step | Action | Skip Condition |
|------|--------|----------------|
| 0 | **Load skill:** Read project management bridge skill (`tooling/azure-devops-bridge/SKILL.md` or Jira equivalent) | Never skip |
| 1 | Fetch ticket details → extract Title, Description, Acceptance Criteria | Never skip |
| 2 | **Codebase exists?** YES → Read `thinking/interview-doc/SKILL.md` → align terms, cross-ref code, update CONTEXT.md. NO → Read `thinking/interview-me/SKILL.md` → extract requirements via Q&A | Never skip |
| 3 | **Read `meta-skills/graph-report/SKILL.md`** → scan codebase structure, identify affected modules | Skip if no codebase yet |
| 4 | Confirm output paths with user: `.aidlc/` folder, QA test files root, Dev source root | Never skip |
| 5 | Write DECISIONS.md → scope, constraints, approach | Never skip |
| 6 | Write PLAN.md → phase sequence for chosen mode | Never skip |

### Phase Routing (must follow mode matrix)

| Mode | Phase Order |
|------|-------------|
| QA Scenario Only | Lite Inception → 2.1 → 2.2 → DONE |
| QA Automation (TDD) | Lite Inception → 2.1 → 2.2 → 2.3 → 2.4 → (2.5 optional) → DONE |
| Full (TDD) | 0 → 1.1-1.8 → 2.1 → 2.2 → 2.3 → 2.4 → (2.5 optional) → 2.5 → 2.6 → 3.1 → 3.2 → 3.3 |
| Full (SDLC) | 0 → 1.1-1.8 → 2.5 → 3.1 → 2.1 → 2.2 → 2.3 → 2.4 → (2.5 optional) → 3.2 → 3.3 |
| Dev Only | Lite Inception → 2.5 → 3.1 → 3.2 → 3.3 → DONE |

### Phase 2.1 Internal Steps (QA Task Design)

| Step | Action | Skip Condition |
|------|--------|----------------|
| 0 | **Load skill:** Read project management bridge skill (`tooling/azure-devops-bridge/SKILL.md` or Jira equivalent) | Never skip |
| 1 | Re-read ticket Acceptance Criteria (always fresh, never from memory) | Never skip |
| 2 | Read `thinking/interview-doc/SKILL.md` → validate domain terms against CONTEXT.md | Skip if CONTEXT.md already complete |
| 3 | Read `thinking/brainstorming/SKILL.md` → run lightweight 3-Amigos check on AC gaps | Skip if feature is trivial |
| 4 | Write `qa-task-progress.md` → list planned scenarios + assigned QA | Never skip |

### Phase 2.2 Internal Steps (Test Case Design)

| Step | Action | Skip Condition |
|------|--------|----------------|
| 0 | **Load skill:** Read `qa/test-scenario/SKILL.md` + `rules/test-scenario-rules/SKILL.md` | Never skip |
| 0b | **Load UI context:** Read `tooling/ui-to-text/SKILL.md` → check `agent-memory/knowledge/biz/` for existing UI KB. If not found → use Figma MCP or screenshot to build KB first. If no Figma KB and no screenshot available → Read `ux-ui/ui-designer/SKILL.md` to generate mockup description first. **Applies to ALL platforms (API + Web UI)** — API tests also need UI flow understanding for end-to-end context | Never skip |
| 1 | Resolve ticket Assigned To + QA Assigned To | Never skip |
| 2 | Read `test-scenario-rules/references/ts-standards.md` | Never skip |
| 3 | Read `test-scenario-rules/references/csv-export.md` | Never skip |
| 4 | Run reuse analysis (`test-scenario/references/reuse-analysis.md`) | Never skip |
| 5 | Design batch 1 (Success) → pause for approval | Never skip |
| 6 | Design batch 2 (Alternative) → pause for approval | Never skip |
| 7 | Design batch 3 (Edge) → pause for approval | Never skip |
| 8 | **Add Quick Review Summary table** at top of scenario .md file (columns: #, Ticket ID, Scenario, Spec File, Priority, Effort, Domain) — Ticket ID and Spec File start as "—" | Never skip |
| 9 | Generate test data (`test-scenario/references/data-gen.md`) | Never skip |
| 10 | Export CSV + validate (`csv-validator.md`) | Never skip |
| 11 | Upload Gate — ask user: "Upload test scenarios to project management tool?" → if yes, fill ticket ID column | Never skip (ask is mandatory, upload is optional) |
| 12 | PO Sign-off Gate | Never skip |

### Phase 2.3 Internal Steps (QA Architecture)

| Step | Action | Skip Condition |
|------|--------|----------------|
| 0 | **Load skill:** Read `qa/qa-architect/SKILL.md` + `rules/playwright-rules/SKILL.md` (or `rules/robotframework-rules/SKILL.md` for mobile) | Never skip |
| 1 | Read platform-specific arch file (api-arch/web-arch/mobile-arch) | Never skip |
| 2 | Read platform-specific coding rules | Never skip |
| 3 | Design test structure (folders, page objects, helpers) | Never skip |
| 4 | Write `implementation-plan.md` | Never skip |

### Phase 2.4 Internal Steps (Test Script Design)

| Step | Action | Skip Condition |
|------|--------|----------------|
| 0 | **Load skill:** Read `qa/playwright-testing/SKILL.md` + `rules/playwright-rules/SKILL.md` + `debugging/debug-mantra/SKILL.md` (or RF equivalents for mobile). **debug-mantra is ALWAYS loaded regardless of platform (API/Web/Mobile)** | Never skip |
| 1 | Read `implementation-plan.md` | Never skip |
| 2 | Read coding rules (playwright-rules or robotframework-rules) | Never skip |
| 3 | Check `knowledge/lessons/` for prior patterns | Never skip |
| 4 | Write test scripts (RED — should fail if TDD) | Never skip |
| 5 | Run tests to confirm state (FAIL for TDD, PASS for SDLC) | Never skip |
| 5b | **Self-heal loop (max 3x):** If tests fail → Read `qa/verification-loop/SKILL.md` → fix → re-run | Skip if tests pass on first run |
| 5c | **If still failing after 3x:** Read `debugging/debug-mantra/SKILL.md` → root-cause analysis before continuing | Skip if tests pass |
| 6 | **Update Quick Review Summary** → fill `Spec File` column in testScenario-*.md for each spec written | Never skip |
| 7 | **Upload Test Result Gate** — ask user: "Upload test result to project management tool?" → if yes, trigger upload workflow | Never skip (ask is mandatory, upload is optional) |
| 8 | **Git Push + Pipeline Gate** — ask user: "Git commit + push + trigger pipeline?" → if yes: `git add . && git commit -m "test: {feature} - all tests pass" && git push` | Never skip (ask is mandatory, push is optional) |

### Phase 2.5 Internal Steps (Performance Testing — Optional)

> Trigger: after Phase 2.4 tests ALL PASS + user wants performance testing
> Skip condition: user says "skip" or feature has no performance requirement

| Step | Action | Skip Condition |
|------|--------|----------------|
| 0 | **Load skill:** Read `qa/performance-testing/SKILL.md` | Never skip |
| 1 | Ask user: "Do you want performance testing? (Frontend / Backend / Both / Skip)" | Never skip (ask is mandatory) |
| 2 | If Frontend: run Chrome DevTools MCP trace → Core Web Vitals + resource waterfall | User chose Backend only or Skip |
| 3 | If Backend: profile API endpoints (per-endpoint p95 + E2E flow) | User chose Frontend only or Skip |
| 4 | Compare against thresholds (p95 < 500ms, LCP < 2.5s) | Never skip if step 2 or 3 ran |
| 5 | Generate performance report (Quick Review format) | Never skip if step 2 or 3 ran |
| 6 | If thresholds PASS → ✅ done | — |
| 7 | If thresholds FAIL → create ticket (Bug or Task) in project management tool + link to parent ticket | Never skip if thresholds fail |
| 8 | Route back to Phase 3.1 (Dev fixes performance issue) | Never skip if thresholds fail |
| 9 | After fix → re-run Phase 2.5 (loop until thresholds pass) | Never skip if thresholds fail |

### Phase 2.5-Dev Internal Steps (Dev Task Design) — Full/Dev Only

| Step | Action | Skip Condition |
|------|--------|----------------|
| 0 | **Load skill:** Read `dev/dev-architect/SKILL.md` + relevant dev skill (backend/frontend) | Never skip |
| 0b | **Load UI context:** Read `ux-ui/ui-designer/SKILL.md` → reference design tokens, component specs, wireframes for frontend task breakdown | Skip if feature is API-only with no UI |
| 1 | Read `references/dev-task-design.md` | Never skip |
| 2 | Break feature into implementation tasks | Never skip |
| 3 | Write `dev-task-progress.md` | Never skip |
| 4 | Confirm task order with user | Never skip |

### Phase 2.6 Internal Steps (Sync Gate) — Full Only (TDD)

> QA + Dev align before implementation starts. Conversation checkpoint — no file output required.
> Skip condition: mode is QA Only, Dev Only, or Full (SDLC)

| Step | Action | Skip Condition |
|------|--------|----------------|
| 1 | QA presents: test file list + scenario count per file + edge cases found during scripting | Never skip |
| 2 | Dev confirms: task breakdown covers all scenarios — add tasks to `dev-task-progress.md` if gaps found | Never skip |
| 3 | If gaps found → update test scenarios (Minor: amend in-place / Major: re-plan Phase 2.2) | Skip if no gaps |
| 4 | ✅ Gate passes when: Dev acknowledges coverage, no unresolved gaps | Never skip |

### Phase 3.1 Internal Steps (Implementation) — Full/Dev Only

| Step | Action | Skip Condition |
|------|--------|----------------|
| 0 | **Load skill:** Read `dev/backend-dev/SKILL.md` or `dev/frontend-dev/SKILL.md` + `dev/security-hardening/SKILL.md` + `debugging/debug-mantra/SKILL.md` | Never skip |
| 0b | **Conditional:** If task involves architecture decision → Read `dev/documentation-adrs/SKILL.md`. If task involves replacing legacy code → Read `dev/deprecation-migration/SKILL.md` | Skip if not applicable |
| 0c | **Load UI context (frontend tasks):** Read `ux-ui/ui-designer/SKILL.md` → reference design tokens, component specs, spacing/color system for implementation | Skip if task is backend-only |
| 1 | Read task from `dev-task-progress.md` | Never skip |
| 2 | Read coding rules for target stack | Never skip |
| 3 | Check `knowledge/lessons/` for prior patterns | Never skip |
| 4 | Implement code (follow TDD if applicable — make tests pass) | Never skip |
| 5 | Run tests + lint | Never skip |
| 5b | **Self-heal loop (max 3x):** If tests fail → Read `qa/verification-loop/SKILL.md` → fix → re-run | Skip if tests pass on first run |
| 5c | **If still failing after 3x:** Apply `debugging/debug-mantra/SKILL.md` → root-cause analysis | Skip if tests pass |
| 6 | Commit with task reference | Never skip |
| 7 | Update `dev-task-progress.md` status | Never skip |

### Phase 3.2 Internal Steps (Integration + Review) — Full/Dev Only

| Step | Action | Skip Condition |
|------|--------|----------------|
| 0 | **Load skill:** Read `review/review-personas/SKILL.md` + `qa/verification-loop/SKILL.md` | Never skip |
| 1 | Run full test suite (integration) | Never skip |
| 2 | Code review (security + quality + coverage) | Never skip |
| 3 | Apply `dev/code-simplification/SKILL.md` for refactoring opportunities | If no complexity issues found |
| 4 | Fix review findings | If no findings |
| 5 | All tests pass after fixes | Never skip |

### Phase 3.3 Internal Steps (PR + Ship) — Full/Dev Only

| Step | Action | Skip Condition |
|------|--------|----------------|
| 0 | **Load skill:** Read `dev/shipping-launch/SKILL.md` + project management bridge skill + `dev/devops-pipeline/SKILL.md` | Never skip |
| 1 | Create PR (git push + PR via CLI) | Never skip |
| 2 | Link PR to ticket | Never skip |
| 3 | Update ticket state → "Testing" or "In Review" | Never skip |
| 4 | Pipeline pass confirmation | Never skip |
| 5 | Merge + close ticket (if all children done) | Never skip |

### Violation Detection

The `session-save.json` hook checks at end of session:
- Were all mandatory steps executed for each phase that ran?
- Were any steps skipped without a documented skip condition?
- If yes → flag skill in `agent-memory/skill-log.md` with specific step that was skipped

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
| Project management tools (Azure DevOps MCP / Jira API) | Integration | Sync tickets, update boards, link commits |
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

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
