# Skill Structure Upgrade — 2026-04-12

## What Happened
Major upgrade to 5 skills: frontend-dev, backend-dev, devops-pipeline, playwright-testing, robotframework-testing.
Triggered by: user asked to check internet for upgrades + reorganize into sub-folders.

## frontend-dev — Sub-folder Restructure

### New Structure
```
references/
├── web/          react.md, nextjs.md (NEW), tailwind-standards.md, vite-config.md
├── android/      android-kotlin.md
├── ios/          ios-swift.md
├── flutter/      flutter.md
└── shared/       env-config, error-handling, logging, navigation, testability, ui-states
```

### Old flat files still exist (not deleted — backward compat)
`references/react.md`, `references/android-kotlin.md`, etc. still present at root level.
Decision: keep old files, new sub-folder files are the canonical versions going forward.

### New Content Added
- `web/nextjs.md` — Next.js 15 App Router, Server Components, Server Actions, React 19 hooks, streaming, middleware, route handlers
- `web/react.md` — updated with React 19 hooks: useActionState, useOptimistic, useFormStatus, React Compiler note
- `android/android-kotlin.md` — updated: collectAsStateWithLifecycle, Compose Navigation (no Fragments), Kotlin Serialization preferred over Gson
- `ios/ios-swift.md` — updated: @Observable macro (iOS 17+) replaces ObservableObject

## playwright-testing — 3 New References

| File | Content |
|------|---------|
| `references/visual-regression.md` | Screenshot comparison, baseline management, masking dynamic content, multi-viewport, CI integration |
| `references/accessibility.md` | axe-core integration, WCAG 2.1 AA scanning, keyboard navigation, CI integration |
| `references/component-testing.md` | Mount React components in real browser, test states/interactions/forms, providers setup |

## robotframework-testing — 2 New References

| File | Content |
|------|---------|
| `references/browser-library.md` | Playwright-powered RF web testing, auto-wait, CSS locators, network mocking, Page Object pattern |
| `references/rf7-features.md` | RF 7.4 features: secret variables, typed keywords, TRY/EXCEPT, WHILE, VAR syntax, Listener API v3 |

## backend-dev — python.md Updated
- Added Pydantic v2 patterns: `field_validator`, `model_validator`, `Field` constraints
- Added SQLAlchemy 2.0 async: `Mapped`, `mapped_column`, `AsyncSession`, `async_sessionmaker`

## devops-pipeline — github-actions.md Updated
- Added OIDC keyless auth for AWS and Azure (no long-lived secrets)
- Added advanced reusable workflows with inputs/secrets
- Added concurrency control pattern
- Added dynamic matrix with `fail-fast: false`

## SKILL.md Updates
All 5 SKILL.md files updated with new description keywords and reference table entries.

## State: Old flat files
(Subject, Predicate, Object) [2026-04-12 - ?]
- (frontend-dev/references/, HasStructure, flat-files) [? - 2026-04-12]
- (frontend-dev/references/, HasStructure, sub-folders: web/android/ios/flutter/shared) [2026-04-12 - ?]

## Cleanup — 2026-04-12 (follow-up session)

Deleted 12 old flat files from `references/` root — all replaced by sub-folder versions:

(frontend-dev/references/, HasStructure, flat-12-files) [? - 2026-04-12]
(frontend-dev/references/, HasStructure, sub-folders-only-17-files) [2026-04-12 - ?]

Deleted: react.md, tailwind-standards.md, vite-config.md, android-kotlin.md, ios-swift.md,
flutter.md, env-config-standards.md, error-handling-standards.md, logging-standards.md,
navigation-standards.md, testability-standards.md, ui-states-standards.md

## Gap Analysis Decision — 2026-04-12

Gemini provided skill gap analysis comparing current skills vs 2024-2025 trends.

### Already covered by recent upgrade
- Next.js 15 App Router ✅, Accessibility ✅, Visual Regression ✅, React 19 ✅, Self-healing QA ✅

### Decided: DO next
- `qa/performance-testing/` — K6 load testing (stable API, high value)
- `devops-pipeline/references/security-scanning.md` — Trivy + CodeQL (1 file addition)

### Decided: DEFER
- Agentic Workflows (LangGraph/CrewAI) — API changes every 2-3 months, too unstable for reference
- IaC Terraform — different domain, needs separate wing planning
- MCP Deep-dive — already built into Kiro/Claude, no separate skill needed

## New Skills Added — 2026-04-12 (K6 + Security)

### Architecture Decision
security-scanning.md → `devops-pipeline/references/` NOT `qa/`
Reason: it's a pipeline step used by both dev (Dockerfile, deps) and qa (test images)
(security-scanning, BelongsTo, devops-pipeline) [2026-04-12 - ?]

### qa/performance-testing/ — new skill
SKILL.md + 3 references:
- k6-scripting.md — scenarios, thresholds, auth flow, data parameterization, test types (smoke/load/stress/spike/soak)
- ci-integration.md — GitHub Actions + Azure DevOps, performance gates, nightly schedule
- analysis.md — p95/p99 interpretation, bottleneck identification, trend comparison

### devops-pipeline/references/security-scanning.md — new reference
Tools: Trivy (image+deps+IaC), CodeQL (SAST JS/TS/Python), Gitleaks (secrets), Semgrep (OWASP)
Pattern: secret scan → dep scan → image scan → SAST (parallel)
Policy: CRITICAL/HIGH block merge, MEDIUM warn only

## _backup vs Agentic Workflows — Clarification 2026-04-12

### Key Decision
(_backup, IsA, AI-DLC-v1-custom-agentic-pattern) [2026-04-12 - ?]
(_backup, IsNOT, LangGraph-CrewAI-framework) [2026-04-12 - ?]

### _backup Architecture (AI-DLC v1)
- orchestrator.md = sequential phase controller (Protocol 1-7)
- agents/*.md = specialist prompts with sharding tags (<!-- STEP_START/END -->)
- sessionState.json = shared state across phases
- skills/ = reusable knowledge loaded on-demand
- Pattern: Orchestrator → Specialist → sessionState → next Specialist

### AI-DLC v2 (current .claude/skills/ai-dlc/)
- Evolved from v1: dropped orchestrator-driven → skill-based
- AI loads skills autonomously based on context (no explicit phase controller)
- sessionState.json replaced by Memory Palace

### Agentic Workflows thread — revised scope
If skill ever created: "when to use LangGraph/CrewAI vs custom orchestration (like _backup)"
NOT just LangGraph how-to — that would miss the point that we already have a custom pattern

## v1 vs v2 Comparison — 2026-04-12

### Verdict
(AI-DLC-v1, BetterThan-v2, execution-control+state-persistence+token-mgmt) [2026-04-12 - ?]
(AI-DLC-v2, BetterThan-v1, flexibility+coverage+maintainability+no-setup) [2026-04-12 - ?]

### v1 strengths v2 lacks
- Sequential phase enforcement (Protocol 1-7, can't skip)
- CHECKPOINT + VERIFY every step (write→read back→confirm)
- sessionState.json: cross-conversation resume ("ทำต่อ PBI-xxx")
- Micro-Step Context Isolation (sharding tags, load only current step)
- orchestratorConfiguration.md: explicit workflow matrix with expected outputs

### v2 strengths v1 lacks
- Full-stack coverage (frontend/backend/devops/qa/core/knowledge)
- Flexible: works outside predefined workflows
- Independent skills: change one without breaking others
- No setup required (no sessionState.json, no ai-agent_root config)

### Action: borrow from v1
- Add checkpoint/verify pattern to aidlc workflow references
- Improve resume mechanism beyond Memory Palace (more robust)

## v1 Checkpoint Borrow — Architecture Decision 2026-04-12

Where to add v1 patterns into v2 (NOT in specific skills):

### 1. workflow.md → Standard Process step 5
Add CHECKPOINT after EXECUTE:
- Read back file just written
- Confirm required sections present
- If missing → fix before proceeding

### 2. workflow.md → Routing Rules table
Add "Done when" column:
| .aidlc/ has | Missing | Go to | Done when |
- e.g. logical-design.md → Phase 2.1 → Done when: qa-task-progress.md exists

### 3. shared-task-progress-guide.md → Resume Protocol
Add artifact verification step:
- Verify files from completed phases still exist
- If missing → warn user
- If present → confirm before resuming

### NOT touching
- dev-task-design.md — output template, not orchestration
- qa-task-design.md — output template, not orchestration
- Individual skills (playwright-testing, etc.) — not their concern

## v1 Checkpoint — IMPLEMENTED 2026-04-12

Files changed:
- `core/aidlc/references/workflow.md`
- `core/aidlc/references/shared-task-progress-guide.md`

### Key design: SOFT GATE (not v1 hard stop)
v1: write → verify → STOP if fail → wait for user
v2: write → verify → fix-in-place → only escalate if can't fix

### workflow.md changes
1. Routing table: added "✅ Done when" column per phase
   - e.g. Phase 2.1 done when: qa-task-progress.md exists with tasks listed
   - e.g. Phase 3.2 done when: all tests PASS (0 failures)
2. Standard Process step 5: added OUTPUT CHECKPOINT
   - Confirm file exists at expected path
   - Confirm required sections present
   - Fix immediately if missing — do not proceed to step 6

### shared-task-progress-guide.md changes
Resume Protocol: added artifact verification (step 3)
- Check each path in Artifacts section before resuming
- If missing → warn user with specific file + phase name
- If all present → confirm "✅ ตรวจสอบไฟล์ครบ — ทำต่อจาก: {task}"
