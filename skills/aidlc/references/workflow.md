# AI-DLC Development Workflow Rules

## Artifact Locations (read FIRST — before any file operation)

All AIDLC artifacts live in `agent-memory/` — no `.aidlc/` folder, no exceptions.

Default paths (override via `<project>/.claude/aidlc.json` if needed):

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

**Behavior:**
- Step 1 (DECISIONS): dialog as normal → append resolved decisions to `MEMORY.md` Decisions section
- Step 3 (PLAN): write to `agent-memory/plans/[feature]/plan.md`
- Step 7 (AUDIT): update `CONTEXT.md` Completed section with phase entry
- Step 8 (PROGRESS): update `CONTEXT.md` Now section with current feature + phase

Optional path override (`<project>/.claude/aidlc.json`):
```json
{
  "plansPath": "agent-memory/plans",
  "contextFile": "agent-memory/CONTEXT.md",
  "memoryFile": "agent-memory/MEMORY.md",
  "knowledgePath": "agent-memory/knowledge"
}
```

---

## Essential Rules

- **DECISIONS → PLAN → EXECUTE** (Always create decisions first)
- **NEVER skip decisions** (Always create decision file with options)
- **⛔ MANDATORY: Read the "Decision-Plan-Execute Process" section below before starting ANY decision dialog** — it contains per-question flow, anti-patterns, and userInput rules
- **STOP after creating plan** (Wait for approval — NEVER auto-execute)
- **NEVER fill decision answers** (User decides)
- **MANDATORY APPROVAL** (Plans require explicit user approval before execution)
- **Update plans incrementally** (Every 3-5 tasks)
- **Use .aidlc folder structure** (All artifacts)
- **Apply DDD** (Domain-Driven Design throughout inception)
- **Apply BDD** (Behavior-Driven Development for test cases)
- **Apply TDD** (Test-Driven Development: RED → GREEN → REFACTOR)
- **MANDATORY GATES** (dev-task-design and qa-task-design MUST be completed before any implementation or test scripting — they create the iteration path)

## Development Approach (Question 2 — after Mode, before Phase 2)

> Ask after selecting Mode, before entering Phase 2 — determine sequence of QA and Dev

When entering Phase 2 (after Inception or Lite Inception), ask **Development Approach**:

```text
อยากทำแบบไหน?
1. 🧪 TDD (Recommended) — เขียน test ก่อน แล้วค่อยเขียน code ให้ผ่าน
   ✓ Test coverage สูงตั้งแต่เริ่ม
   ✓ Code ถูก design ให้ testable
   ✓ รู้ว่า "เสร็จ" เมื่อไหร่ (test ผ่าน = เสร็จ)
   ✓ ลด bug ที่หลุดไป production

2. 📋 SDLC — เขียน code ก่อน แล้วค่อยเขียน test ทีหลัง
   ✓ เห็น working code เร็วกว่า
   ✓ เหมาะกับ prototype / UI ที่ยังเปลี่ยนบ่อย
   ✓ ไม่ต้องแก้ test ถ้า design เปลี่ยน
   ✓ เหมาะกับ exploratory development
```

**Detection:** If user explicitly says "TDD" or "เขียน test ก่อน" → auto-select TDD. If not specified → default to TDD (Recommended).

---

### 🧪 TDD (Recommended) — QA before Dev

**Philosophy:** "RED → GREEN → REFACTOR" — write failing test first → write code to make test pass → refactor

**Sequence:**
```text
Phase 2.1 QA Task Design — Create task breakdown for test
    │
    ▼
Phase 2.2 Test Case Design — Design test scenarios (BDD)
    │
    ▼
Phase 2.3 QA Architecture — Define test framework structure
    │
    ▼
Phase 2.4 Test Script Design — Write test scripts (RED — tests FAIL)
    │
    ▼
Phase 2.5 Dev Task Design — Create task breakdown for code
    │
    ▼
Phase 2.6 Sync Gate — QA + Dev align
    │
    ▼
Phase 3.1 Implementation — Write code to make tests PASS (GREEN)
    │
    ▼
Phase 3.2 Refactor + Validation — refactor and run tests again (REFACTOR)
    │
    ▼
Phase 3.3 Create PR
```

**Suitable for:**
- Clear specs/PBI/requirements exist (knowing what to do)
- High confidence needed that code works correctly
- Prevent regression — test acts as a safety net from the start
- Teams familiar with test-first workflow

**Pros:**
- High test coverage from the start
- Code is designed to be testable
- Reduces bugs leaking to production
- Dev knows when it is "done" (test passes = done)

**Cons:**
- If requirements change frequently → tests must be updated accordingly
- Takes more time at the start (but saves time during debugging)

---

### 📋 SDLC — Dev before QA

**Philosophy:** "Design → Build → Test → Ship" — write working code first, then write tests to verify

**Sequence:**
```text
Phase 2.5 Dev Task Design — Create task breakdown for code
    │
    ▼
Phase 3.1 Implementation — Write code first
    │
    ▼
Phase 2.1 QA Task Design — Create task breakdown for test
    │
    ▼
Phase 2.2 Test Case Design — Design test scenarios (BDD)
    │
    ▼
Phase 2.3 QA Architecture — Define test framework structure
    │
    ▼
Phase 2.4 Test Script Design — Write test scripts
    │
    ▼
Phase 3.2 Automated Testing — run tests against existing code
    │
    ▼
Phase 3.3 Create PR
```

**Suitable for:**
- Prototype / MVP requiring fast working code
- Features where UI/UX is not yet stable (changes frequently)
- Teams unfamiliar with test-first
- Exploratory development — not yet sure what the solution will look like

**Pros:**
- See working code faster
- Suitable for rapid prototyping
- No need to write new tests if design changes

**Cons:**
- Test coverage may be incomplete (writing later often misses edge cases)
- Code might not be testable (not designed for testing from the start)
- Bugs might leak to the PR before tests exist

---

### Approach Comparison

| Dimension | TDD 🧪 (Recommended) | SDLC 📋 |
|------|----------------------|----------|
| **Sequence** | QA → Dev (test before code) | Dev → QA (code before test) |
| **Phase order** | 2.1→2.2→2.3→2.4→2.5→3.1→3.2→3.3 | 2.5→3.1→2.1→2.2→2.3→2.4→3.2→3.3 |
| **Test timing** | Write test before code (RED→GREEN) | Write test after code |
| **Confidence** | High (test-first = safety net) | Medium (test-after = verification) |
| **Speed to working code** | Slower (must write test first) | Faster (code first) |
| **Suitable for** | Stable requirements, production code | Prototype, exploratory, unstable UI |
| **Default** | ✅ Recommended | Use when there is a clear reason |

---

## Execution Modes (Question 1 — Mode Selection)

AIDLC supports 3 execution modes. User selects mode at start — AI detects from command or asks.

> **Note:** After mode is selected, ask Development Approach (TDD vs SDLC) before entering Phase 2. See "Development Approach" section above.

### Mode Selection

| Mode | Detection | When to use |
|------|-----------|-------------|
| Full | `"start AI-DLC"` / Kiro Spec mode / medium+ complexity | Do both design + QA + Dev (default) |
| QA Only | `"start AI-DLC QA ..."` | Specs/PBI already exist, only want to do QA (select sub-mode below) |
| Dev Only | `"start AI-DLC Dev only"` | Specs/PBI already exist, only want to do Dev |

**Detection:** In Kiro, mode is read from IDE context. In other AI agents, detect from context or ask user.

If user intent is ambiguous → ASK:

```text
ต้องการ mode ไหน?
1. 📋 Full — Full AIDLC workflow ทั้งหมด
2. QA only
3. Dev only
```

### QA Sub-Modes

When mode = QA Only, ask further:

| QA Sub-Mode | Command | Phases | Output |
|-------------|---------|--------|--------|
| QA Scenario Only | `"start AI-DLC QA scenario only"` | Lite Inception (if needed) → 2.1 → 2.2 | test scenarios (CSV/MD) |
| QA Automation | `"start AI-DLC QA automation"` | Lite Inception (if needed) → 2.1 → 2.2 → 2.3 → 2.4 | test scenarios + test scripts |
| QA Scenario + Automation | `"start AI-DLC QA scenario automation"` | Lite Inception (if needed) → 2.1 → 2.2 → 2.3 → 2.4 | test scenarios + test scripts (generate scenarios then proceed to automation immediately) |

When mode = QA Automation, ask platform:

```
Platform ไหน? (เลือกได้มากกว่า 1)
1. API
2. Web UI
3. Android
4. iOS
5. API + Web UI
6. API + Web UI + Mobile (Android & iOS)
7. API + Mobile (Android & iOS)
```

> **Combined Platform:** Choose options 5-7 when the feature has cross-layer tests (e.g., API setup + Web UI verify, or API + Mobile deep link)
> Combined platform uses `shared-fixtures/` as a single source of truth for shared test data

Platform affects:

| Platform | QA Architecture | Coding Rules | Labels | TestId Map | Test Framework |
|----------|----------------|--------------|--------|------------|----------------|
| API | `api-arch.md` | `playwright-rules/api.md` | ❌ | ❌ | Playwright |
| Web UI | `web-arch.md` | `playwright-rules/web-ui.md` | ✅ Labels.ts | ✅ testid-map.md | Playwright |
| Android | `mobile-arch.md` | `robotframework-rules/android.md` | ✅ Labels.yaml | ✅ testid-map.md | Robot Framework |
| iOS | `mobile-arch.md` | `robotframework-rules/ios.md` | ✅ Labels.yaml | ✅ testid-map.md | Robot Framework |

### Combined Platform Rules

When multiple platforms are selected (options 5-7):

**Architecture:** Read ALL relevant arch files — produce a single `implementation-plan.md` with sections per platform.

**Coding Rules:** Load ALL relevant coding rules. When conflicts exist, platform-specific rules win over general rules.

**Task Ordering:** Infrastructure (shared) → API tests → Web UI tests → Mobile tests (Android before iOS)

**Shared Fixtures (MANDATORY for combined):**
- `tests/shared-fixtures/[system]/[feature]/` — cross-layer test data
- API seed/setup payloads used by Web UI or Mobile tests go here
- Business data (codes, keywords) shared across platforms go here

**Combined Platform Matrix:**

| Combined Option | Arch Files | Coding Rules | Labels | TestId Map | Frameworks |
|----------------|-----------|--------------|--------|------------|------------|
| API + Web UI | `api-arch.md` + `web-arch.md` | `playwright-rules/api.md` + `web-ui.md` | ✅ Labels.ts (Web) | ✅ testid-map.md (Web) | Playwright (both) |
| API + Web UI + Mobile | `api-arch.md` + `web-arch.md` + `mobile-arch.md` | `playwright-rules/api.md` + `web-ui.md` + `robotframework-rules/android.md` + `ios.md` | ✅ Labels.ts (Web) + Labels.yaml (Mobile) | ✅ testid-map.md (both) | Playwright (API+Web) + Robot Framework (Mobile) |
| API + Mobile | `api-arch.md` + `mobile-arch.md` | `playwright-rules/api.md` + `robotframework-rules/android.md` + `ios.md` | ✅ Labels.yaml (Mobile) | ✅ testid-map.md (Mobile) | Playwright (API) + Robot Framework (Mobile) |

**Phase behavior for combined platforms:**
- Phase 2.1 (QA Task Design): Create ONE `qa-task-progress.md` with sections per platform
- Phase 2.2 (Test Case Design): Tag each scenario with `Test_type` (API / Web UI / Mobile UI)
- Phase 2.3 (QA Architecture): Produce `implementation-plan.md` with per-platform sections
- Phase 2.4 (Test Script Design): Write scripts per platform in their respective folders, share fixtures via `shared-fixtures/`

**Folder structure for combined:**
```text
tests/
├── shared-fixtures/[system]/[feature]/
│   ├── web/[featureName]SharedData.ts
│   ├── web/[featureName]ApiSetup.ts
│   ├── mobile/[featureName]SharedData.yaml
│   └── mobile/[featureName]ApiSetup.yaml
├── api-testing/[system]/[feature]/
│   └── [feature].spec.ts
├── web-testing/[system]/[feature]/
│   ├── pages/
│   ├── helpers/
│   └── [feature].spec.ts
└── mobile-testing/
    ├── android/[system]/[feature]/
    │   └── [feature].robot
    └── ios/[system]/[feature]/
        └── [feature].robot
```

### Mode Phase Matrix (SDLC Approach — Dev before QA)

| Phase | Full | QA Scenario Only | QA Automation (API/Web) | Dev Only |
|-------|------|-------------------|-------------------------|----------|
| Phase 0 (Project Detection) | ✅ | ✅ | ✅ | ✅ |
| Lite Inception | ⏭️ skip (does full inception) | ✅ if no specs | ✅ if no specs | ✅ if no specs |
| Phase 1.1-1.7 (Inception) | ✅ | ⏭️ skip | ⏭️ skip | ⏭️ skip |
| Phase 1.8 (Brainstorming 3 Amigos) | ✅ (skip for Small) | ⏭️ skip | ⏭️ skip | ⏭️ skip |
| Phase 2.5 (Dev Task Design) | ✅ **FIRST** | ⏭️ skip | ⏭️ skip | ✅ MANDATORY |
| Phase 3.1 (Implementation) | ✅ | ⏭️ skip | ⏭️ skip | ✅ |
| Phase 2.1 (QA Task Design) | ✅ | ✅ MANDATORY | ✅ MANDATORY | ⏭️ skip |
| Phase 2.2 (Test Case Design) | ✅ | ✅ → DONE | ✅ | ⏭️ skip |
| Phase 2.3 (QA Architecture) | ✅ | ⏭️ skip | ✅ | ⏭️ skip |
| Phase 2.4 (Test Script Design) | ✅ | ⏭️ skip | ✅ → DONE | ⏭️ skip |
| Phase 3.2 (Automated Testing) | ✅ | ⏭️ skip | ⏭️ skip | ⏭️ skip |
| Phase 3.3 (Create PR) | ✅ | ⏭️ skip | ⏭️ skip | ✅ |

### Mode Phase Matrix (TDD Approach — QA before Dev) ⭐ Recommended

| Phase | Full | QA Scenario Only | QA Automation (API/Web) | Dev Only |
|-------|------|-------------------|-------------------------|----------|
| Phase 0 (Project Detection) | ✅ | ✅ | ✅ | ✅ |
| Lite Inception | ⏭️ skip (does full inception) | ✅ if no specs | ✅ if no specs | ✅ if no specs |
| Phase 1.1-1.7 (Inception) | ✅ | ⏭️ skip | ⏭️ skip | ⏭️ skip |
| Phase 1.8 (Brainstorming 3 Amigos) | ✅ (skip for Small) | ⏭️ skip | ⏭️ skip | ⏭️ skip |
| Phase 2.1 (QA Task Design) | ✅ **FIRST** | ✅ MANDATORY | ✅ MANDATORY | ⏭️ skip |
| Phase 2.2 (Test Case Design) | ✅ | ✅ → DONE | ✅ | ⏭️ skip |
| Phase 2.3 (QA Architecture) | ✅ | ⏭️ skip | ✅ | ⏭️ skip |
| Phase 2.4 (Test Script Design — RED) | ✅ | ⏭️ skip | ✅ → DONE | ⏭️ skip |
| Phase 2.5 (Dev Task Design) | ✅ | ⏭️ skip | ⏭️ skip | ✅ MANDATORY |
| Phase 2.6 (Sync Gate) | ✅ | ⏭️ skip | ⏭️ skip | ⏭️ skip |
| Phase 3.1 (Implementation — GREEN) | ✅ | ⏭️ skip | ⏭️ skip | ✅ |
| Phase 3.2 (Refactor + Validation) | ✅ | ⏭️ skip | ⏭️ skip | ✅ |
| Phase 3.3 (Create PR) | ✅ | ⏭️ skip | ⏭️ skip | ✅ |

### Hard Rules (ALL modes)

- **`agent-memory/plans/[feature]/` is MANDATORY** — create with outputs/ before first write
- **DECISIONS → PLAN → EXECUTE** — every mode follows this process for each active phase
- **qa-task-design is MANDATORY** for QA modes — do not skip to test case design without qa-task-progress.md
- **dev-task-design is MANDATORY** for Dev mode — do not skip to implementation without dev-task-progress.md
- **audit.md is MANDATORY** — every mode maintains audit trail
- **Dialog message format** — ALL AIDLC interactions use structured dialog format, not plain chat. Applies to every mode, every AI agent. See "Dialog & Artifact Integration (Kiro)" section below.

### Lite Inception (for QA Only / Dev Only without specs)

When user has only PBI (no Business Spec, no Architecture Spec), run Lite Inception before entering QA/Dev phases.
Uses existing `core/analysis-skills/` — no new skills needed.

**Trigger:** Mode is QA Only or Dev Only AND no external specs provided

**Steps:**
1. **Context Analysis** → `core/analysis-skills` (context.md) — extract goals, scope, conflicts from PBI
2. **Requirements Extraction** → `core/analysis-skills` (requirements.md) — write user stories + BDD AC
3. **Domain Discovery** → `core/analysis-skills` (discovery-domain.md) — check knowledge base for reuse
4. **Interview** (MANDATORY — pick based on context):
   - **If codebase exists** → `interview (doc mode)` — cross-ref PBI + Figma + codebase → ask user about gaps + sharpen domain language
   - **If no codebase (new project)** → `interview (me mode)` — one-question-at-a-time until 95% confidence
   - **Rule:** Never skip. At minimum 3 questions must be asked before proceeding.
5. **Gap Analysis** → `core/analysis-skills` (gap.md) — identify missing logic
6. **Figma Analysis** (if link provided) → `ux-ui/ui-designer` (figma.md) — extract UI structure
7. **Output:** `outputs/inception/mini-spec.md` — consolidated 1-2 page spec
8. **User approves mini-spec** before proceeding to QA/Dev phases

**Lite Inception output structure:**
```markdown
# Mini-Spec: {Feature Name}

## Source
- PBI: {id + title}
- External links: {Figma, wiki, MCP — if any}

## Scope
- In: {features included}
- Out: {features excluded}

## User Stories (BDD)
- US-001: {title} — Given/When/Then
- US-002: ...

## Technical Context
- API endpoints: {list or "unknown — infer from PBI"}
- Data storage: {type or "unknown"}
- UI pages: {list or "API-only"}

## Gaps & Assumptions
- {list of gaps and assumptions made}
```

**If user provides external specs** (e.g., `JapanTravelBookingSystem.md` + `JapanTravelArchitectureSpec.md`):
→ Skip Lite Inception entirely — use provided specs as input for QA/Dev phases

### Mode-Aware Routing Table

For QA Only / Dev Only, the routing table changes:

**QA Scenario Only routing:**

| Has | Missing | Go to | ✅ Done when |
|---|---|---|---|
| Nothing | mini-spec or external specs | Lite Inception (or ask for specs) | mini-spec.md exists OR external specs provided |
| mini-spec.md (or external specs) | qa-task-design | Phase 2.1 QA Task Design | `qa-task-progress.md` exists |
| qa-task-progress.md | test-cases | Phase 2.2 Test Case Design | test scenario CSV/MD exists |
| test scenarios | — | ✅ WORKFLOW COMPLETE | — |

**QA Automation routing:**

| Has | Missing | Go to | ✅ Done when |
|---|---|---|---|
| Nothing | mini-spec or external specs | Lite Inception (or ask for specs) | mini-spec.md exists OR external specs provided |
| mini-spec.md (or external specs) | qa-task-design | Phase 2.1 QA Task Design | `qa-task-progress.md` exists |
| qa-task-progress.md | test-cases | Phase 2.2 Test Case Design | test scenario CSV/MD exists |
| test scenarios | QA architecture | Phase 2.3 QA Architecture | `implementation-plan.md` exists |
| QA architecture | test-scripts | Phase 2.4 Test Script Design | spec files exist |
| test-scripts | — | ✅ WORKFLOW COMPLETE | — |

**Dev Only routing:**

| Has | Missing | Go to | ✅ Done when |
|---|---|---|---|
| Nothing | mini-spec or external specs | Lite Inception (or ask for specs) | mini-spec.md exists OR external specs provided |
| mini-spec.md (or external specs) | dev-task-design | Phase 2.5 Dev Task Design | `dev-task-progress.md` exists |
| dev-task-progress.md | implementation | Phase 3.1 Implementation | all tasks `[x]` |
| implementation | test results | Phase 3.2 Automated Testing | tests PASS |
| test results | PR | Phase 3.3 Create Pull Request | PR created |

### Mode-Aware Anti-Shortcut Rules

| User tries to | Mode | Prerequisite missing | Action |
|---|---|---|---|
| "เขียน test scenario เลย" | QA Only | No qa-task-design | STOP → "ต้องทำ QA Task Design ก่อน (Phase 2.1)" |
| "เขียน test script เลย" | QA Automation | No test scenarios, no QA architecture | STOP → "ต้องทำ test scenario + QA architecture + qa-task-design ก่อน" |
| "เขียน code เลย" | Dev Only | No dev-task-design | STOP → "ต้องทำ Dev Task Design ก่อน (Phase 2.5)" |
| Skip Lite Inception | QA/Dev Only | No specs AND no mini-spec | STOP → "ต้องมี specs หรือทำ Lite Inception ก่อน" |

## Language Policy

| What | Language | Example |
|------|----------|---------|
| User communication (questions, approval prompts, status updates) | Thai | "📐 Architecture นี้ถูกต้องหรือไม่?" |
| Test scenario content (Title, Steps, Expected Result) | Thai | "[UI][Success] แสดงหน้าจองเที่ยวบิน" |
| AIDLC documents (decision, plan, design, user stories) | English | "Option A: Create missing artifacts" |
| Code (variables, functions, JSDoc, comments) | English | `async searchFlight(data)` |
| Test names (describe, test) | English | `test('[TS-001] Search round-trip flight')` |
| File and folder names | English (kebab/camelCase) | `flight-booking-visa-advice/` |

## Routing Rules

ALL work goes through AIDLC. AI determines the correct phase by checking what exists:

1. Scan `agent-memory/plans/[feature]/` — what files exist?
2. Find the first phase that has no output yet → start there
3. If user specifies a phase (e.g., "start from logical design") → verify prerequisites exist first

| Has | Missing | Go to | ✅ Done when |
|---|---|---|---|
| Nothing | Everything | Phase 0 (Project Detection) → Phase 1.1 or 1.2 | project context detected |
| reverse-engineering/ | requirements | Phase 1.2 Requirements | `user-stories.md` exists |
| user-stories.md | domain-decomposition | Phase 1.3 Domain Decomposition | `domain-decomposition.md` exists |
| domain-decomposition.md | domain-design | Phase 1.4 Domain Design | `domain-design.md` exists |
| domain-design.md | ui-ux-design | Phase 1.5 UI/UX Design | `ui-ux-design.md` exists (or skipped for API-only) |
| ui-ux-design.md (or domain-design.md for API-only) | logical-design | Phase 1.6 Logical Design | `logical-design.md` exists |
| logical-design.md | testid-map | Phase 1.7 TestId Map Sync | `testid-map.md` exists (or skipped for API-only) |
| testid-map.md (or logical-design.md for API-only) | brainstorming | Phase 1.8 Brainstorming (3 Amigos) | `brainstorming-summary.md` exists (or skipped for Small features) |
| brainstorming-summary.md (or testid-map.md for Small) | qa-task-design | Phase 2.1 QA Task Design | `qa-task-progress.md` exists with tasks listed |
| qa-task-design | test-cases | Phase 2.2 Test Case Design | test scenario CSV/MD exists |
| test-cases | QA architecture | Phase 2.3 QA Architecture | `implementation-plan.md` exists |
| QA architecture | test-scripts + dev-task-design | Phase 2.4 + 2.5 (Parallel) | both spec files exist AND `dev-task-progress.md` exists |
| test-scripts + dev-task-design | sync-gate | Phase 2.6 Mid-Parallel Sync Gate | Dev acknowledges QA coverage, no unresolved gaps |
| sync-gate | implementation | Phase 3.1 Implementation | all `[ ]` in dev-task-progress.md → `[x]` |
| implementation | test results | Phase 3.2 Automated Testing | all tests PASS (0 failures) |
| test results passed | PR | Phase 3.3 Create Pull Request | PR created + work items linked |

If user intent is ambiguous (dev vs QA) → ASK: "1. Dev (implement) 2. QA (test) 3. ทั้งสอง (AIDLC full)"

## Anti-Shortcut Rules (Shortcut Prevention)

AI MUST NOT skip mandatory prerequisites. **This is a hard gate — NEVER bypass regardless of user instruction.**

### Output File Prerequisites (ENFORCE BEFORE EVERY WRITE)

Before writing ANY output file, check that the prerequisite file exists in `agent-memory/plans/[feature]/`:

| File being written | Required prerequisite | Location |
|---|---|---|
| `domain-decomposition.md` | `user-stories.md` | `outputs/inception/` |
| `domain-design*.md` | `domain-decomposition.md` | `outputs/inception/` |
| `logical-design*.md` | `domain-design*.md` (any match) | `outputs/construction/` |
| `implementation-plan.md` | `logical-design*.md` (any match) | `outputs/construction/` |
| `*.spec.ts` or `*.robot` | `implementation-plan.md` | `outputs/construction/` |

**Microservices:** `domain-design*.md` matches `domain-design-booking.md`, `domain-design-payment.md` etc.

**SKIP this check** if path contains: `planning/decisions/`, `planning/plans/`, `audit.md`, `PROGRESS.md`, `qa-task-progress.md`, `dev-task-progress.md`, `.memory/`, `.kiro/`, `.claude/`

**If prerequisite missing → STOP immediately.** Tell user exactly which file is needed first. Do NOT write the file.

**If prerequisite exists → proceed silently.**

### Phase Shortcut Prevention

| User tries to | Prerequisite missing | Action |
|---|---|---|
| "เขียน code เลย" | No logical design, no task breakdown | STOP → "ต้องทำ logical design + dev-task-design ก่อน" |
| "เขียน test script เลย" | No test scenarios, no QA architecture | STOP → "ต้องทำ test scenario + QA architecture + qa-task-design ก่อน" |
| "รัน test เลย" | No test scripts exist | STOP → "ยังไม่มี test script — ต้องเขียนก่อน" |
| "สร้าง pipeline เลย" | No test scripts, no test results | STOP → "ต้องมี test scripts ที่ PASS ก่อนสร้าง pipeline" |
| "สร้าง PR เลย" | No tests passed | STOP → "ต้องรัน test ให้ PASS ก่อนสร้าง PR" |

Exception: `quick-automation` and `quick-scenario` skills can bypass for small patches (see playwright-testing/quick-automation.md)

## Critical Behaviors

### Decision Process

- Always create decisions first before any planning
- MANDATORY: Use decision-record-template.md format
- Never fill in decision answers — leave blank for user
- Present options with rationale, but don't make decisions
- Wait for user to resolve decisions before creating plan
- For full interactive decision dialog rules → see "Decision-Plan-Execute Process" section below

### Plan Process

- Always plan before executing
- MANDATORY: Use plan-template.md format
- Never proceed without explicit user approval
- NEVER combine planning and execution
- Strict two-step: Generate plan → Get approval → Then execute

### Execution Process

- Update plan status after completing each task with [x] checkboxes
- Include backend AND frontend in logical design
- MANDATORY: Use output templates for all deliverables
- Always maintain audit trail — update audit.md at each phase completion

## Methodology Integration

### DDD (Domain-Driven Design) — Inception Phase

- Phase 1.3: Strategic Design (Bounded Contexts, Context Map, Architecture Decision)
- Phase 1.4: Tactical Design (Entities, Value Objects, Aggregates, Domain Events)
- Phase 1.5: Technical Specifications (API Contracts, Data Models)

### BDD (Behavior-Driven Development) — Test Design Phase

- Phase 1.2: User stories with Given-When-Then acceptance criteria
- Phase 2.1: Test cases in BDD format

### TDD (Test-Driven Development) — Construction Phase

- Phase 2.4: Write test scripts FIRST (RED — tests should fail)
- Phase 3.1: Write minimal production code to pass tests (GREEN)
- Phase 3.2: Refactor code while keeping tests green (REFACTOR)

### TDD Locator Strategy (QA)

When writing test scripts before UI exists (TDD RED phase):
- Use `getByTestId` as primary locator — agree testId naming with dev team upfront (from logical-design testId map)
- Use hybrid pattern: `getByTestId` to scope + `getByRole({ name: L.keyName })` to target
- Create `[feature]Labels.ts` with TH/EN labels upfront — agree with dev on visible text — **Web UI tests only**
- If locator breaks after dev implements → heal using `playwright-testing` skill (visual-first debugging)
- Never block on "locator doesn't exist yet" — write the test with expected locators, fix after GREEN phase

> **⚠️ Labels.ts Context:**
> - `Labels.ts` is **MANDATORY for Web UI tests only** — contains UI button text, headings used in `getByRole({ name })`
> - `Labels.ts` is **NOT required for API tests** — API tests have no UI text to match
> - If QA task is API-only → skip Labels.ts task entirely

## File Structure

```text
agent-memory/plans/
├── [SYSTEM_KEBAB]/
│   ├── PROGRESS.md                                ← system-level index (all iterations in this system)
│   ├── [SYSTEM_FEATURE_KEBAB]/
│   │   ├── audit.md                               ← iteration info + phase history
│   │   ├── dev-task-progress.md                   ← dev task tracking
│   │   ├── qa-task-progress.md                    ← QA task tracking
│   │   ├── planning/
│   │   │   ├── decisions/
│   │   │   │   ├── 01-requirements-gathering.md
│   │   │   │   ├── 02-domain-decomposition.md
│   │   │   │   └── ...
│   │   │   └── plans/
│   │   │       ├── 01-requirements-gathering.md
│   │   │       └── ...
│   │   └── outputs/
│   │       ├── inception/
│   │       │   ├── user-stories.md
│   │       │   └── domain-decomposition.md
│   │       └── construction/[{context}/]
│   │           ├── domain-design.md
│   │           ├── logical-design.md
│   │           └── implementation-plan.md
```

Example: `agent-memory/CONTEXT.md` Now section tracks active feature (payment, refund, etc.)

## Naming Conventions

- System folders: `[SYSTEM_KEBAB]/` (e.g., `ecommerce/`, `hospital/`, `crm/`)
- Feature folders: `[SYSTEM_FEATURE_KEBAB]/` (e.g., `payment/`, `patient-triage/`, `user-auth/`)
- Decision/Plan Files: `{phase-number}-{phase-name}.md` (e.g., `01-requirements-gathering.md`)
- Context Files: Add `-{context-name}` for microservices (e.g., `03-domain-design-catalog.md`)
- MUST match test output paths: `agent-memory/plans/payment/` ↔ `{test-root}/web-testing/ecommerce/payment/`

## Master Index (per system)

ALWAYS update `agent-memory/CONTEXT.md` Now section:

```markdown
# AIDLC Progress — {System Name}

| Iter | Feature | Sprint | Approach | Mode | Dev | QA | Status | Date |
|------|---------|--------|----------|------|-----|-----|--------|------|
| 1 | payment | Sprint 3 | TDD | Full | 12/12 | 8/8 | ✅ | 2026-01 |
| 2 | refund | Sprint 4 | SDLC | Full | 0/10 | 0/6 | 🔄 Phase 2.5 | 2026-02 |
| 3 | loyalty | Sprint 4 | TDD | QA Only | — | 5/12 | 🔄 Phase 2.2 | 2026-02 |
```

**Columns:**
- **Iter** — Running iteration number per system (never resets)
- **Feature** — Feature folder name (kebab-case)
- **Sprint** — Sprint this iteration belongs to
- **Approach** — TDD or SDLC (set before Phase 2)
- **Mode** — Full / QA Only / QA Automation / Dev Only
- **Dev** — Dev tasks completed/total (or `—` if mode has no dev)
- **QA** — QA tasks completed/total (or `—` if mode has no QA)
- **Status** — ✅ Done / 🔄 In Progress (+ current phase) / ⏸️ Paused
- **Date** — Start date (or completion date if ✅)

**Update when:**
- New feature starts → add row (assign next iteration #)
- Tasks complete → update Dev/QA counts
- Phase changes → update Status
- Feature completes → mark ✅, update Date to completion date

**Iteration number assignment:**
- Scan PROGRESS.md → find highest Iter number → +1
- If PROGRESS.md doesn't exist → start at 1

## Iteration Info (per feature — in audit.md)

Every `audit.md` MUST start with an Iteration Info section:

```markdown
# Audit Trail — {Feature Name}

## Iteration Info

| Field | Value |
|-------|-------|
| Iteration | #{N} |
| Sprint | Sprint {X} |
| Mode | Full / QA Only / Dev Only |
| Approach | TDD / SDLC |
| PBI | #{id} — {title} |
| Start Date | YYYY-MM-DD |
| Branch | feat/{system}-{feature} |

## Phase History

| Phase | Status | Date | Skills Used | Notes |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |
```

**Set at Phase 0:**
- Iteration #, Sprint, Mode, PBI, Start Date, Branch

**Set before Phase 2:**
- Approach (TDD / SDLC) — after user answers the approach question

**Used by `/resume`:**
- AI reads Iteration Info → knows approach → routes Phase 2-3 correctly (TDD: QA→Dev / SDLC: Dev→QA)

## Iteration Lifecycle

```text
Phase 0 (Project Detection)
    │
    ├── Assign iteration # (scan PROGRESS.md → max + 1)
    ├── Ask: Sprint? (or detect from config/ADO)
    ├── Ask: Mode? (Full / QA Only / Dev Only)
    ├── Create folder + audit.md with Iteration Info
    └── Update PROGRESS.md (add new row)
    │
    ▼
Inception (Phase 1) — if SDLC Full mode
    │
    ▼
Before Phase 2:
    ├── Ask: Approach? (TDD / SDLC)
    └── Update audit.md Iteration Info (Approach field)
    │
    ▼
Phase 2-3 (route based on Approach)
    │
    ▼
Feature Complete:
    ├── Update PROGRESS.md → Status = ✅, Date = completion date
    └── Update audit.md → final phase entry
```

## Multi-Feature Requirements

When requirements contain multiple features (e.g., a PBI with 5 sub-features):

- Related features that share domain logic → group under 1 system, separate feature folders
- Each feature gets its own `agent-memory/plans/[feature]/` folder
- Track all in the same `PROGRESS.md`
- Execution order: user decides priority, AI suggests based on dependency analysis

### Merge vs Split Decision

- Features that share the same domain entities AND the same UI pages → MERGE into 1 feature folder
  - Example: Tax Input + PVD + Bonus + Total Income + WHT all modify TaxPlanner page → merge as `port/tax-planner/`
- Features that have separate UI pages AND separate domain logic → SPLIT into separate folders
  - Example: Tax Planner vs Google Sheets Sync vs Google Auth → 3 separate folders
- When unsure → ASK user: "ควรรวมเป็น 1 feature หรือแยก?"

## Feature Complexity Levels

Measure by QA impact (not dev effort):

| Level | QA Impact | AIDLC Behavior |
|---|---|---|
| Lightweight | QA tests 1 page, no regression risk | All phases, but output is concise (1 paragraph per section) |
| Standard | QA tests 2-5 pages, some regression risk | All phases, normal output depth |
| Full | QA tests 5+ pages or regression across module | All phases, full output + sequence diagrams + test checklists |

NEVER skip phases regardless of complexity — always run full AIDLC. Only output depth changes.
AI MUST ask user to confirm complexity level at Phase 1.2 (Requirements Gathering).

For output depth examples per level → Read `references/complexity-examples.md`

## Standard Process (Every Phase)

1. **DECISIONS** → Create decision file (`planning/decisions/{NN}-{phase-name}.md`) with options and recommendations
2. **USER RESOLVES** → User fills in decision answers
3. **PLAN** → Create execution plan (`planning/plans/{NN}-{phase-name}.md`) based on resolved decisions
4. **PREVIEW** → Show draft output summary to user before asking for approval:
   - Phase 1.2: show user story titles + AC count
   - Phase 1.3: show bounded contexts + architecture choice
   - Phase 1.4: show entities + key business rules
   - Phase 1.5: show API endpoints + DB tables list
   - Phase 2.2: show test scenario titles by batch
   - Other phases: show task list summary
   - User can request changes before approving — this prevents blind approval
5. **USER APPROVES** → User approves the plan (after seeing preview)
6. **EXECUTE** → Implement the approved plan, write output to `outputs/inception/`

   ⚠️ **OUTPUT CHECKPOINT** — after writing any file, verify before moving on:
   - Confirm the file exists at the expected path
   - Confirm required sections are present (not empty/placeholder)
   - If missing or incomplete → fix immediately, do not proceed to step 7
   - This is a soft gate: fix-in-place, not a hard stop requiring user input
7. **AUDIT** → Update `audit.md` at each phase completion using this format:

```markdown
| Phase | Status | Date | Skills Used | Notes |
|---|---|---|---|---|
| 1.2 - Requirements Gathering | ✅ | YYYY-MM-DD | core/analysis-skills (requirements.md) | Brief summary of output |
```

   - `Skills Used` — list every skill and reference file read during this phase
   - `Notes` — one-line summary of what was produced
8. **PROGRESS** → Update `agent-memory/CONTEXT.md` Now section with current counts
9. **KNOWLEDGE** → Capture reusable patterns to `audit.md` Knowledge Buffer section (Read `references/knowledge-buffer.md`)
10. **GRAPH_REPORT** → Update `{project-root}/GRAPH_REPORT.md` when:
    - First working feature completed (Phase 2.4 done) → create initial graph
    - Feature completed (all tests PASS + PR merged) → update affected sections
    - Use `meta-skills/graph-report/SKILL.md` process (scan → contract → corpus → god nodes → deps → index → surprising)
    - Skip if no new files were created in this phase
11. **MEMORY** → Update `agent-memory/` (business + coding lessons only):

    **A) Task_Ledger** (`memory.md`) — update if phase produced a real artifact:
    - Format: `[system] / [feature] / Phase [N] [name] [status] — [one-line summary]`
    - Skip for Q&A, "ทำต่อ", or phases with no new output

    **B) Playbook** (`playbook.md`) — append ONLY if a new lesson matches these domains:
    | Domain | What to capture | Example |
    |--------|----------------|---------|
    | `biz` | Business rules, domain logic, edge cases that affect correctness | Payment 3-call sequence, booking expiry rules |
    | `arch` | Architecture decisions, patterns, integration gotchas | Microservice boundary, shared service reuse |
    | `qa` | Test patterns, flaky fixes, data strategies that worked/failed | Interceptor pattern, mock server setup |
    | `dev` | Coding patterns, build issues, dependency gotchas | Next.js config, Docker compose networking |

    **DO NOT capture:** process/workflow meta, tool config, hook tuning, AIDLC itself, comparisons without decisions (e.g. "A vs B" with no chosen action), program/tool installation steps
    **Gate:** Only append if trigger+fix is concrete (not "be careful" or "remember to check")
    **Format:** `| CASE-NNN | [trigger 120 chars max] | [fix 120 chars max] | [domain] | [outcome] | 0 | 0 |`

MANDATORY: Steps 1-9 apply to EVERY phase. Step 10 applies when a phase produces a real artifact. Do NOT skip decision/plan files even if user says "approve" or "ทำต่อ". Create the files first, then ask for approval.

## Mid-execution Change Request

When the user wants to make changes during execution:

| Change Type | Criteria | How to Handle |
|---|---|---|
| **Minor** | Does not affect scope, can be fixed in current task | Amend in-place → update output file → continue |
| **Major** | Affects scope or prerequisite phases | Pause → create a new decision file → re-plan → get approval → resume |

**Minor examples:** edit field name, add validation rule, change error message
**Major examples:** add new user story, change architecture pattern, add bounded context

> ⚠️ If unsure whether minor or major → always ask the user first

## Workflow Phases

### Inception (Business Focus)

Brownfield start from 1.1, Greenfield start from 1.2

- **1.1** Reverse Engineering → Analyze existing codebase (brownfield only)
  → Use `core/analysis-skills` skill (reverse-eng.md)
  → **[Kiro]** `invokeSubAgent(name="context-gatherer")` — scan existing codebase before reverse-engineering; pass source folder(s) as contextFiles
- **1.2** Requirements Gathering → User stories with BDD acceptance criteria
  → Use `core/analysis-skills` skill (requirements.md)
  → **[Kiro]** `invokeSubAgent(name="requirement-detailer")` — invoke ONCE per user story / PBI item to expand edge cases + AC; if 3+ stories exist, invoke in parallel
  → **MANDATORY after user stories:** run `core/analysis-skills` skill (domain.md) for cross-domain reuse analysis
    - If `{knowledge_root}/business/businessIndex.json` does not exist → skip Steps 1-2, run Step 3 (Impact Assessment) only — set Reusability Score = 0%
    - Never skip domain.md entirely — Impact Assessment is always required
  → **MANDATORY after domain analysis:** run `core/analysis-skills` skill (gap.md) to identify missing logic (scope: requirements vs existing knowledge)
    - If domain analysis returned 0% → treat all required logic as "No Match" and proceed to prioritize gaps
    - Note: gap.md runs again at Phase 1.8 with broader scope (all Phase 1 artifacts) — these are intentionally different invocations
- **1.3** Domain Decomposition → DDD Strategic Design + Architecture Decision
  → Use `core/architect` skill (decomposition.md, architecture-patterns.md)
- **1.4** Domain Design → DDD Tactical Patterns (pseudocode)
  → Use `core/architect` skill (domain-design.md)
- **1.5** UI/UX Design → Design system, Figma analysis, component specs, wireframes
  → Use `ux-ui/ui-designer` skill (design-system.md) + `ux-ui/ui-designer` skill (figma.md)
  → Skip for API-only features (no UI)
- **1.6** Logical Design → Technical specifications (Server Logic, Data Storage, Client Application)
  → Use `core/architect` skill (logical-design.md)
  → Frontend component tree + state design informed by Phase 1.5 wireframes
- **1.7** TestId Map Sync → Agree testId naming between QA and Dev based on actual UI structure from Phase 1.5
  → Output: `testid-map.md` — maps component/element → testId → owner (QA uses, Dev implements)
  → Skip for API-only features (no UI)
- **1.8** Brainstorming (3 Amigos) → PO/Dev/QA subagents review Phase 1 artifacts, identify gaps and tensions
  → Use `interview (amigos mode)` skill — dispatches subagents per role with Phase 1 artifacts as input
  → Pre-step: run `core/analysis-skills` (gap.md) to feed known gaps to all subagents (scope: all Phase 1 artifacts — broader than Phase 1.2 which only covers requirements)
  → **[Kiro]** `invokeSubAgent(name="general-task-execution")` × 3 in parallel — one per role (PO, Dev, QA); pass all Phase 1 artifacts + gap.md output as contextFiles; collect all 3 outputs before writing `brainstorming-summary.md`
  → Output: `brainstorming-summary.md` — tensions, open questions, refined scope
  → Skip for Small features (1-2 user stories, single endpoint)

### QA Focus

- **2.1** QA Task Design → Task breakdown for QA automation
  → Use `aidlc` reference (qa-task-design.md)
  → Optional companion: `interview (doubt mode)` (for architecture decisions in QA planning)
  → **[Kiro]** `invokeSubAgent(name="context-gatherer")` — invoke ONCE at start; scan `ai-dlc/knowledge/automation/` + existing test root for reusable patterns before designing tasks
- **2.2** Test Case Design → BDD test scenarios
  → Use `test-scenario` skill + `test-scenario-rules` skill
  → **⚠️ MANDATORY PRE-STEP (before any TS design):**
    1. **PBI Assigned To:** Fetch from ADO via `az boards work-item show --id {PBI_ID}` → `System.AssignedTo.uniqueName` → populate col 20 of PBI row
    2. **QA Assigned To:** Check `projects.json` for `qaEmail` → if not found, ASK user: "Assigned To (QA email) สำหรับ TS ชุดนี้คืออะไรครับ?" → save to `projects.json` → populate col 20 of all TS rows
    3. Both values MUST be resolved before writing any CSV — never leave col 20 empty
  → **MANDATORY read order within test-scenario skill:**
    1. `test-scenario-rules/references/ts-standards.md` — title format, priority, language policy
    2. `test-scenario-rules/references/csv-export.md` — 23-column format rules
    3. `test-scenario/references/reuse-analysis.md` — scan testScenarioIndex.json FIRST (never skip)
    4. `test-scenario/references/ts-design.md` — 3 batches (Success → Alternative → Edge), each batch pauses for approval
    5. `test-scenario/references/data-gen.md` — BVA + pairwise test data sets after design approved
    6. `test-scenario/references/csv-validator.md` — run `md2csv.sh` + `csvValidator.sh` after finalization
  → **⚠️ HARD RULES for Phase 2.2:**
    - Reuse analysis (step 3) is MANDATORY before any design
    - Each batch (step 4) MUST pause and wait for user approval — never dump all 3 batches at once
    - Data generation (step 5) is MANDATORY after design — never skip
    - CSV export (step 6) is MANDATORY to complete Phase 2.2 — scenarios not exported = phase not done

  ✅ **Upload Gate** (After CSV approved — Before Phase 2.3):
  - Ask user: "อัพ Test Scenario ขึ้น Azure DevOps ไหม?"
  - If Yes → run script (no MCP — saves tokens):
    ```bash
    # Run your upload script (implement per your PM tool): \
      scripts/upload-test-cases.ts \
      --csv <path-to-csv> --pbi-id <PBI_ID> --ado-project "<project>" --company Your Company
    ```
  - Output: `<csv-dir>/ts-azure-ids.md` → TS title → Azure ID mapping
  - If No → skip (can be done later using a script to upload test cases to your project management tool)

  ✅ **PO Sign-off Gate** (MANDATORY before Phase 2.3):
  - Present test scenario titles + batch summary to PO
  - PO confirms: "scenarios ครอบคลุม requirements ที่ตั้งใจไว้"
  - If PO finds missing scenarios → add them before proceeding
  - If PO finds scenarios that do not match the requirement → fix them before proceeding
  - Rationale: catch misunderstandings before investing in automation — fixing now is cheaper than fixing after test scripts are done
- **2.3** QA Architecture → Test automation framework blueprints
  → Use `qa-architect` skill (api-arch.md, web-arch.md, mobile-arch.md, test-db-strategy.md)
  → **MANDATORY read order within qa-architect skill:**
    - API platform → `references/api-arch.md` + `references/test-db-strategy.md`
    - Web UI platform → `references/web-arch.md` + `references/test-db-strategy.md`
    - Android/iOS platform → `references/mobile-arch.md` + `references/test-db-strategy.md`
    - Multi-platform (API + Web UI) → read BOTH api-arch.md + web-arch.md
- **2.4** Test Script Design → Playwright/Robot Framework scripts (TDD: RED) — runs **parallel with 2.5**
  → Use `playwright-testing` skill or `robotframework-testing` skill
  → **[Kiro]** `invokeSubAgent(name="general-task-execution")` — when writing 3+ spec files; dispatch per file or per platform; pass `implementation-plan.md`, `testid-map.md`, and coding rules as contextFiles
  → **MANDATORY read order — Playwright (API or Web UI):**
    1. `playwright-rules/references/pw-coding-standards.md` — global AI governance + restrictions
    2. `playwright-rules/references/api.md` — if API platform
    3. `playwright-rules/references/web-ui.md` — if Web UI platform (both if multi-platform)
    4. `playwright-testing/references/workflow.md` — write → review → execute → heal cycle
    5. `playwright-testing/references/db-writer.md` — if test data requires DB setup
  → **MANDATORY read order — Robot Framework (Android or iOS):**
    1. `robotframework-rules/references/rf-coding-standards.md` — global naming + locator + AAA rules
    2. `robotframework-rules/references/android.md` — if Android platform
    3. `robotframework-rules/references/ios.md` — if iOS platform
    4. `robotframework-testing/references/workflow.md` — write → review → execute → heal cycle
    5. `robotframework-testing/references/python-db.md` — if test data requires DB setup
  → Contract: Test Scenario (Phase 2.2) + TestId Map (Phase 1.7) — shared with Dev
  → Complete test file skeleton first, then 2.5 can start — full script completion not required
- **2.5** Dev Task Design → Task breakdown for implementation — runs **parallel with 2.4**
  → Use `aidlc` reference (dev-task-design.md)
  → Contract: Test Scenario (Phase 2.2) + TestId Map (Phase 1.7) — shared with QA
  → **[Kiro]** `invokeSubAgent(name="context-gatherer")` — invoke ONCE at start; scan source root + `logical-design.md` for existing patterns before designing dev tasks
  → ⚠️ "Parallel" means non-blocking — 2.5 starts as soon as 2.4 has test file skeleton, NOT waiting for full script completion
  → When Kiro executes both: run 2.4 until skeleton exists → immediately start 2.5 → both proceed independently
- **2.6** Mid-Parallel Sync Gate → QA + Dev align before implementation starts
  → QA presents: test file list + scenario count per file + any new edge cases found during scripting
  → Dev confirms: task breakdown still covers all scenarios — add tasks if gaps found
  → ✅ Gate passes when: Dev acknowledges coverage, no unresolved gaps
  → ⚠️ If gaps found → update test scenarios (Minor: amend in-place / Major: re-plan)
  → This is a conversation checkpoint, not a document — no file output required
- **2.7** DevOps Sync → Create work items via MCP
  → Use `devops-pipeline` skill (azure-sync.md)

### Construction (Technical Focus)

- **3.1** Implementation → TDD: GREEN (code to pass tests)
  → Use `frontend-dev` skill and/or `backend-dev` skill
  → Optional companions: `interview (source mode)` (when implementing framework-specific code — verify docs before coding), `interview (doubt mode)` (for non-trivial implementation decisions)
  → **[Kiro]** `invokeSubAgent(name="general-task-execution")` — MANDATORY when 3+ independent tasks exist; dispatch per task batch (group tasks with no shared file dependency); pass `dev-task-progress.md`, `logical-design.md`, and relevant source files as contextFiles
- **3.2** Automated Testing → TDD: REFACTOR + validation
  → Use `playwright-testing` skill or `robotframework-testing` skill
  → **[Kiro]** `invokeSubAgent(name="general-task-execution")` — when running/healing 3+ test files in parallel; pass spec files + `implementation-plan.md` as contextFiles
  → **MANDATORY read order — Playwright:**
    1. `playwright-rules/references/pw-coding-standards.md` — re-read before any code changes
    2. `playwright-testing/references/workflow.md` — execute → review → heal cycle
    3. `playwright-testing/references/playwright-code-review.md` — static audit before commit
  → **MANDATORY read order — Robot Framework:**
    1. `robotframework-rules/references/rf-coding-standards.md` — re-read before any code changes
    2. `robotframework-testing/references/workflow.md` — execute → review → heal cycle
    3. `robotframework-testing/references/rf-code-review.md` — static audit before commit
  → **playwright-cli** (MANDATORY after Phase 3.1 implementation exists):
    - Use `.claude/skills/playwright-cli/` for live browser interaction: navigate, snapshot, interact, debug
    - Read `playwright-cli/references/spec-driven-testing.md` — plan/generate/heal cycle
    - Read `playwright-cli/references/playwright-tests.md` — running and debugging tests
    - Use `playwright-cli open` → `snapshot` → `click/fill` to verify UI behavior against testId map
    - Use `playwright-cli tracing-start/stop` for debugging failures
  → On test failure: use `core/debugging` skill (4-mantra: reproduce → trace fail path → falsify hypothesis → cross-reference breadcrumbs)
  → After fix validated: use `core/post-mortem` skill (document root cause, mechanism, fix, how it slipped through)
- **3.3** Create Pull Request → PR creation + code review
  → Use `devops-pipeline` skill (pull-request.md)
  → Pre-merge gate: use `core/review-personas` skill (code-reviewer + test-engineer + security-auditor)
  → **[Kiro]** `invokeSubAgent(name="general-task-execution")` × 3 in parallel — dispatch one per review persona (code-reviewer, test-engineer, security-auditor); pass changed files + `audit.md` as contextFiles; collect all 3 outputs before creating PR

### Operation

- **4.1** Deployment → CI/CD and monitoring

## Architecture Patterns

### Microservices Workflow

- Context Selection: Ask user which bounded context to work on
- Priority: Core Business → Data-Heavy → Integration → Supporting
- File Structure: Separate files per context (`domain-design-{context}.md`)
- Output: `{context}/` folders under `outputs/construction/`

### Monolith Workflow

- Single files with context sections (`domain-design.md`)
- Single `outputs/construction/` folder

For detailed patterns → Use `core/architect` skill (architecture-patterns.md)

## Quick Commands

### Full Mode (default)
- `"start AI-DLC"` — Begin new project (detects greenfield vs brownfield)
- `"start AI-DLC greenfield"` — Skip reverse engineering
- `"start AI-DLC brownfield"` — Include reverse engineering

### QA Only Mode
- `"start AI-DLC QA scenario only"` — QA Scenario Only: Lite Inception → 2.1 → 2.2
- `"start AI-DLC QA automation"` — QA Automation: Lite Inception → 2.1 → 2.2 → 2.3 → 2.4 (then asks: API / Web UI / Android / iOS)
- `"start AI-DLC QA scenario automation"` — QA Scenario + Automation: Lite Inception → 2.1 → 2.2 → 2.3 → 2.4 (generate scenarios then proceed to automation immediately)

### Dev Only Mode
- `"start AI-DLC Dev only"` — Dev Only: Lite Inception → 2.5 → 3.1 → 3.2 → 3.3

### Phase Entry (any mode)
- `"start AI-DLC from domain design"` — Begin from phase 1.4
- `"start AI-DLC from logical design"` — Begin from phase 1.6
- `"start AI-DLC from UI/UX design"` — Begin from phase 1.5
- `"start AI-DLC from testid map"` — Begin from phase 1.7
- `"start AI-DLC from 3 amigos"` — Begin from phase 1.8 (3 Amigos review)
- `"start AI-DLC from QA task design"` — Begin from phase 2.1
- `"start AI-DLC from test case design"` — Begin from phase 2.2
- `"start AI-DLC from QA architecture"` — Begin from phase 2.3
- `"start AI-DLC from test script design"` — Begin from phase 2.4 (parallel: also starts 2.5)
- `"start AI-DLC from dev task design"` — Begin from phase 2.5 (parallel: also starts 2.4)
- `"start AI-DLC from sync AD"` — Begin from phase 2.7
- `"start AI-DLC from implementation"` — Begin from phase 3.1
- `"start AI-DLC from automation testing"` — Begin from phase 3.2
- `"start AI-DLC from create pull request"` — Begin from phase 3.3

### Session Control
- `"resume AI-DLC"` — Resume paused iteration (scans PROGRESS.md → finds 🔄 → resumes)
- `"resume AI-DLC #3"` — Resume specific iteration #3 by number
- `"reset AI-DLC"` — Reset session
- `"proceed"` or `"1"` — Approve and continue

### Iteration & Sprint
- `"/status"` — Show PROGRESS.md (all iterations in current system)
- `"/sprint Sprint 8"` — Filter PROGRESS.md → show only Sprint 8 iterations
- `"/retro Sprint 8"` — Generate sprint retrospective summary from PROGRESS.md

## Mocking Fallback Strategy

When external dependencies (DB, API, third-party services) are unavailable during test execution:

| Platform | Fallback | How |
|---|---|---|
| API tests | Hardcoded fixture data | Return mock JSON from service layer |
| Web UI tests | `page.route()` mocking | Intercept API calls, return fixture |
| Mobile tests | YAML fixture with mock flag | Load from local fixture file |

Rules:
- Always implement a health check in `beforeAll` — if dependency down, switch to mock
- Tag test results with `[PARTIAL_MOCK]` when using fallback
- Log: "⚠️ [dependency] unavailable — using mock data"
- Never silently skip tests — always run with mock and report

## Core Philosophy

- Local-First: In-memory storage, console logging for MVP
- MVP Focus: Implement only what's needed to run and test
- Testable: Each component independently testable
- Decision-Driven: ADR format, cover functional and non-functional requirements
- Incremental: Update plans during work, not at end
- Quality Gates: Validate completeness before next phase

## Scope Assessment (before Phase 0)

Before starting any AIDLC workflow, estimate scope from user request:

| Size | Signals | Action |
|---|---|---|
| 🟢 Small | 1-2 user stories, 1 page/endpoint, 1 feature | Proceed normally |
| 🟡 Medium | 3-5 user stories, multi-page, cross-feature | Warn user, confirm before proceed |
| 🔴 Large | 6+ user stories, system-level, multi-workflow | Suggest breaking into smaller features |

If 🔴 Large detected:
```
⚠️ Scope ใหญ่มาก — แนะนำให้แบ่งเป็น sub-features ก่อน เพื่อป้องกัน context overflow
ต้องการแบ่ง หรือทำทั้งหมดในรอบเดียว?
```

## Project Detection (Phase 0)

Before starting any AIDLC workflow, detect project structure AND assign iteration:

> **[Kiro]** `invokeSubAgent(name="context-gatherer")` — invoke ALWAYS at Phase 0 before writing first artifact; pass workspace root as context; use output to populate items 1-4 below

**Step A — Iteration Assignment (MANDATORY):**
1. Determine feature name (from user request or existing `agent-memory/plans/` folders)
2. Read `agent-memory/CONTEXT.md` Now section → find active feature → assign next #
3. If PROGRESS.md doesn't exist → this is iteration #1, create PROGRESS.md
4. Ask user: Sprint? (or detect from ADO config / user message)
5. Create feature folder + `audit.md` with Iteration Info header
6. Add new row to PROGRESS.md (Status = 🔄, Approach = TBD until Phase 2)

**Step B — Project Structure Detection:**
1. **Test Root:** Scan for `playwright.config.ts` or `package.json` with playwright — use parent folder as test root. If not found at `tests/`, ask user.
2. **Data Storage:** Identify type — SQL DB (PostgreSQL, MySQL), NoSQL (MongoDB, DynamoDB), Spreadsheet, LocalStorage, Firebase Realtime DB, etc.
3. **Server Logic:** Identify type — REST API (Express, FastAPI), Serverless Functions (AWS Lambda, Cloud Functions), GraphQL, none (frontend-only with external APIs)
4. **Client Application:** Identify type — Web (React, Vue, Angular), Mobile (Flutter, Kotlin, Swift), Desktop
5. **Output Root (MANDATORY — ask user before writing ANY file):** When workspace contains multiple project folders (e.g., `Automation/`, `ai-dlc-skill-testing/`, `src/`), agent MUST ask user which folder is the target before creating any output file.

### Output Root Confirmation (MANDATORY)

**Trigger:** workspace root contains 2+ sibling project folders that could be valid targets.

**Rule:** NEVER assume output path. ALWAYS confirm with user via `userInput` before writing the first file of each type:

| File Type | Ask Before Writing |
|-----------|-------------------|
| artifact paths | "Which folder for QA tests / Dev source?" |
| QA test files (`tests/`, `tests-api/`, `tests-web/`) | "Which folder is the QA test root?" |
| Dev source files (`src/`, `mock-server/`) | "Which folder is the Dev source root?" |

**Example dialog:**
```
🔷 Output Root Confirmation
Workspace has multiple project folders: Automation/, ai-dlc-skill-testing/, src/
Where should QA test files be created?
1. Automation/tests/
2. ai-dlc-skill-testing/tests/
```

**Skip if:** User has already specified the folder explicitly in their message (e.g., "สร้างใน ai-dlc-skill-testing") — use that folder, no need to ask again.

**After confirmation:** Store confirmed paths in the feature's `dev-task-progress.md` and `qa-task-progress.md` Context section so subagents inherit the correct paths.

Store detected values in the feature's progress files (Context section).

## Decision-Plan-Execute Process

> ⚠️ MANDATORY: Read `references/workflow-process.md` before starting ANY decision dialog.
> This section is a summary only — full rules, dialog flow, anti-patterns, and approval patterns are in that file.

**Key rules (summary):**
- Dialog FIRST → file AFTER — never create decision file before asking user interactively
- ONE decision per message — never dump D1+D2+D3 together
- STOP after plan — never auto-execute without explicit approval
- Update audit.md at every phase completion

→ Full details: `references/workflow-process.md`

## Dialog & Artifact Integration (Kiro)

> ⚠️ MANDATORY: Read `references/workflow-dialogs.md` when using Kiro tools or setting up dialog format.
> This section is a summary only — full tool mapping, examples, and format templates are in that file.

**Key rules (summary):**
- ALL artifacts → `agent-memory/plans/[feature]/` — never write to `.kiro/specs/`
- Use `userInput` tool for ALL decisions/approvals — never plain chat text
- Use `invokeSubAgent` for Phase 3.1 when 3+ independent tasks exist
- ONE question per `userInput` call — never combine

→ Full details: `references/workflow-dialogs.md`
