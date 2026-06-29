# AI-DLC Development Workflow Rules

## Artifact Locations (read FIRST — before any file operation)

All AIDLC artifacts live in `agent-memory/` — no `.aidlc/` folder, no exceptions.

| AIDLC artifact | Location |
|---|---|
| Feature folder | `agent-memory/plans/[feature]/` |
| Resolved decisions | `agent-memory/MEMORY.md` Decisions section |
| Execution plan | `agent-memory/plans/[feature]/plan.md` |
| Progress tracking | `agent-memory/CONTEXT.md` Now section |
| Phase history | `agent-memory/CONTEXT.md` Completed section |
| Dev tasks | `agent-memory/plans/[feature]/dev-tasks.md` |
| QA tasks | `agent-memory/plans/[feature]/qa-tasks.md` |
| Outputs | `agent-memory/plans/[feature]/outputs/` |
| Knowledge buffer | `agent-memory/knowledge/` |

---

## Essential Rules

- **Read before write** — read architecture, existing patterns, and affected files before touching anything
- **DECISIONS → PLAN → EXECUTE** — follow this flow when scope is unclear or multi-session; skip when scope is obvious
- **Artifacts** — create DECISIONS + PLAN when genuinely needed for alignment; skip when scope fits in conversation
- **Approval** — ask only when the tradeoff is the user's to own (scope priority, UI preference, external constraint); don't ask for obvious calls
- **Apply DDD / BDD / TDD** — when tests or architecture are part of the ask; skip otherwise
- **Update plans incrementally** (every 3-5 tasks, multi-session features only)

---

## Approach

**TDD** (default): `2.1 → 2.2 → 2.3 → 2.4 → 2.5 → 3.1 → 3.2 → 3.3`
**SDLC** (prototype/unstable UI): `2.5 → 3.1 → 2.1 → 2.2 → 2.3 → 2.4 → 3.2 → 3.3`

Auto-select TDD unless user says "SDLC", "prototype", or "code first".

---

## Modes

| Mode | When | Phases |
|---|---|---|
| Full | New system, unclear scope | Phase 0 → Inception → Phase 2-3 |
| QA Scenario Only | Specs exist, need scenarios | Lite Inception → 2.1 → 2.2 |
| QA Automation | Specs exist, need scripts | Lite Inception → 2.1 → 2.2 → 2.3 → 2.4 |
| Dev Only | Specs exist, need implementation | Lite Inception → 2.5 → 3.1 → 3.2 → 3.3 |

Auto-detect from context. Ask only if genuinely ambiguous.

**Platform → Framework:**
| Platform | Coding Rules | Framework |
|---|---|---|
| API | `playwright-rules/api.md` | Playwright |
| Web UI | `playwright-rules/web-ui.md` | Playwright |
| Android | `robotframework-rules/android.md` | Robot Framework |
| iOS | `robotframework-rules/ios.md` | Robot Framework |

---

## Lite Inception _(QA Only / Dev Only without specs)_

Run when user has only PBI and no external specs.

1. `analysis-skills` (context.md) — extract goals, scope from PBI
2. `analysis-skills` (requirements.md) — write user stories + BDD AC
3. `analysis-skills` (discovery-domain.md) — check knowledge base for reuse
4. `interview` (doc mode if codebase exists, me mode if new) — min 3 questions before proceeding
5. `analysis-skills` (gap.md) — identify missing logic
6. Output: `outputs/inception/mini-spec.md`
7. User approves mini-spec before proceeding

**Skip Lite Inception** if user provides external specs directly.

---

## Routing Table (resume / navigation)

| Has | Missing | Go to |
|---|---|---|
| Nothing | Everything | Phase 0 → Phase 1.1 or 1.2 |
| reverse-engineering/ | requirements | Phase 1.2 Requirements |
| user-stories.md | domain-decomposition | Phase 1.3 Domain Decomposition |
| domain-decomposition.md | domain-design | Phase 1.4 Domain Design |
| domain-design.md | ui-ux-design | Phase 1.5 UI/UX Design |
| ui-ux-design.md | logical-design | Phase 1.6 Logical Design |
| logical-design.md | testid-map | Phase 1.7 TestId Map Sync |
| testid-map.md | brainstorming | Phase 1.8 Brainstorming |
| brainstorming-summary.md | qa-task-design | Phase 2.1 QA Task Design |
| qa-task-progress.md | test-cases | Phase 2.2 Test Case Design |
| test scenarios | QA architecture | Phase 2.3 QA Architecture |
| implementation-plan.md | test-scripts + dev-tasks | Phase 2.4 + 2.5 (parallel) |
| test-scripts + dev-tasks | sync-gate | Phase 2.6 Sync Gate |
| sync-gate | implementation | Phase 3.1 Implementation |
| implementation | test results | Phase 3.2 Automated Testing |
| test results | PR | Phase 3.3 Create PR |

---

## Language Policy

| What | Language |
|---|---|
| User communication (questions, status) | Thai |
| Test scenario content (Title, Steps, Expected) | Thai |
| AIDLC documents (decision, plan, design) | English |
| Code (variables, functions, comments) | English |
| Test names (describe, test) | English |
| File and folder names | English kebab/camelCase |

---

## File Structure

```text
agent-memory/plans/
├── [SYSTEM_KEBAB]/
│   ├── PROGRESS.md
│   ├── [FEATURE_KEBAB]/
│   │   ├── audit.md
│   │   ├── dev-task-progress.md
│   │   ├── qa-task-progress.md
│   │   ├── planning/
│   │   │   ├── decisions/
│   │   │   └── plans/
│   │   └── outputs/
│   │       ├── inception/
│   │       │   ├── mini-spec.md
│   │       │   ├── user-stories.md
│   │       │   └── domain-decomposition.md
│   │       └── construction/
│   │           ├── domain-design.md
│   │           ├── logical-design.md
│   │           └── implementation-plan.md
```

**Naming:** system and feature folders in kebab-case. Decision/Plan files: `{NN}-{phase-name}.md`.
Test paths must mirror: `agent-memory/plans/payment/` ↔ `{test-root}/web-testing/ecommerce/payment/`

---

## Standard Process (every phase)

1. **DECISIONS** — create `planning/decisions/{NN}-{phase}.md` with options
2. **USER RESOLVES** — user fills decisions
3. **PLAN** — create `planning/plans/{NN}-{phase}.md` from resolved decisions
4. **PREVIEW** — show summary (titles, counts) before asking approval
5. **USER APPROVES** — explicit approval before execute
6. **EXECUTE** — write output; verify file exists with required sections before moving on
7. **AUDIT** — append to `audit.md`: `| Phase | Status | Date | Skills Used | Notes |`
8. **PROGRESS** — update `agent-memory/CONTEXT.md` Now section
9. **KNOWLEDGE** — promote reusable patterns (≥2 features) to `agent-memory/knowledge/{domain}/`

---

## Workflow Phases

### Inception (Business Focus)

- **1.1** Reverse Engineering — analyze existing codebase (brownfield only)
  → `analysis-skills` (reverse-eng.md)
- **1.2** Requirements Gathering — user stories with BDD AC
  → `analysis-skills` (requirements.md) → then (domain.md) → then (gap.md)
- **1.3** Domain Decomposition — DDD Strategic Design + Architecture Decision
  → `dev-architect` (decomposition.md, architecture-patterns.md)
- **1.4** Domain Design — DDD Tactical Patterns (pseudocode)
  → `dev-architect` (domain-design.md)
- **1.5** UI/UX Design — design system, Figma analysis, wireframes _(skip for API-only)_
  → `ui-designer` (design-system.md, figma.md)
- **1.6** Logical Design — technical specs (Server, Data, Client)
  → `dev-architect` (logical-design.md)
- **1.7** TestId Map Sync — agree testId naming QA↔Dev _(skip for API-only)_
  → Output: `testid-map.md`
- **1.8** Brainstorming (3 Amigos) — PO/Dev/QA review gaps _(skip for small 1-2 story features)_
  → `interview` (amigos mode); pre-step: `analysis-skills` (gap.md)

### QA Focus

- **2.1** QA Task Design — task breakdown for QA automation
  → `aidlc` (qa-task-design.md); output: `qa-task-progress.md`
- **2.2** Test Case Design — BDD test scenarios
  → `test-scenario` + `test-scenario-rules`
  → MANDATORY read order: ts-standards.md → csv-export.md → reuse-analysis.md → ts-design.md → data-gen.md → csv-validator.md
  → Pre-step: resolve PBI Assigned To + QA Assigned To before writing any CSV
  → Each batch (Success/Alternative/Edge) pauses for approval
  → ✅ Upload Gate: offer Azure DevOps upload after CSV approved
  → ✅ PO Sign-off: PO confirms coverage before Phase 2.3
- **2.3** QA Architecture — test framework blueprints _(Automation only)_
  → `qa-architect` (api-arch.md / web-arch.md / mobile-arch.md + test-db-strategy.md)
- **2.4** Test Script Design — write specs (TDD: RED) — runs **parallel with 2.5**
  → Playwright: `playwright-rules` (pw-coding-standards.md → api.md / web-ui.md) → `playwright-testing` (workflow.md → db-writer.md if needed)
  → Robot Framework: `robotframework-rules` (rf-coding-standards.md → android.md / ios.md) → `robotframework-testing` (workflow.md → python-db.md if needed)
  → Complete skeleton first → 2.5 can start immediately (not waiting for full completion)
- **2.5** Dev Task Design — task breakdown for implementation — runs **parallel with 2.4**
  → `aidlc` (dev-task-design.md); output: `dev-task-progress.md`
- **2.6** Sync Gate — QA + Dev align before implementation
  → QA presents test file list; Dev confirms task breakdown covers all scenarios
  → Conversation checkpoint — no file output required
- **2.7** DevOps Sync — create work items
  → `devops-pipeline` (azure-sync.md)

### Construction (Technical Focus)

- **3.1** Implementation — TDD: GREEN (code to pass tests)
  → `frontend-dev` and/or `backend-dev`
  → Auth-related: load `security` skill
  → 3+ independent tasks: dispatch subagents per task batch
- **3.2** Automated Testing — TDD: REFACTOR + validation
  → Playwright: `playwright-rules` (pw-coding-standards.md) → `playwright-testing` (workflow.md → playwright-code-review.md)
  → Robot Framework: `robotframework-rules` (rf-coding-standards.md) → `robotframework-testing` (workflow.md → rf-code-review.md)
  → On failure: `debug-mantra` → on fix validated: `post-mortem`
- **3.3** Create Pull Request
  → `shipping-launch`; pre-merge: `review-personas` (code-reviewer + test-engineer + security-auditor)

### Operation

- **4.1** Deployment → CI/CD and monitoring

---

## Quick Commands

```
# Full Mode
"start AI-DLC"                          → Phase 0 (auto-detect greenfield/brownfield)
"start AI-DLC greenfield"               → skip reverse engineering
"start AI-DLC brownfield"               → include reverse engineering

# QA Only
"start AI-DLC QA scenario only"         → Lite Inception → 2.1 → 2.2
"start AI-DLC QA automation"            → Lite Inception → 2.1 → 2.2 → 2.3 → 2.4
"start AI-DLC QA scenario automation"   → same as above, generate then automate

# Dev Only
"start AI-DLC Dev only"                 → Lite Inception → 2.5 → 3.1 → 3.2 → 3.3

# Phase Entry
"start AI-DLC from [phase name]"        → jump directly to that phase
"resume AI-DLC"                         → scan CONTEXT.md → resume at active phase
"resume AI-DLC #3"                      → resume iteration #3
```

---

## Output Root Confirmation

**Trigger:** workspace root has 2+ sibling project folders that could be valid targets.

Ask user before writing the first file of each type:
- QA test files → "Which folder is the QA test root?"
- Dev source files → "Which folder is the Dev source root?"

Skip if user already specified the folder explicitly. Store confirmed paths in `dev-task-progress.md` and `qa-task-progress.md` Context section.

---

## Mocking Fallback Strategy

When external dependencies are unavailable during test execution:

| Platform | Fallback | How |
|---|---|---|
| API tests | Hardcoded fixture | Return mock JSON from service layer |
| Web UI tests | `page.route()` mocking | Intercept API calls, return fixture |
| Mobile tests | YAML fixture with mock flag | Load from local fixture file |

- Always implement health check in `beforeAll` — if dependency down, switch to mock
- Tag results with `[PARTIAL_MOCK]` when using fallback
- Never silently skip tests
