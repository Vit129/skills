# AI-DLC (AI Development Lifecycle)

Skills library สำหรับ dev/QA workflow ทั้งหมด — ทุก task ต้องผ่าน `core/aidlc/` ก่อนเสมอ

> **Exception:** Postman migration → ใช้ `ai-agent/skills/postman-to-playwright/SKILL.md` โดยตรง ไม่ต้องผ่าน AIDLC

---

## core/ — Governance & Foundation

> **เริ่มที่นี่เสมอ** สำหรับทุก dev/QA task

### `core/brainstorming/` — Multi-Role Brainstorming (3 Amigos — Subagent-Driven)
**Triggers:** "brainstorm", "คิดก่อน", "ยังไม่แน่ใจ", "explore", "ลองคิด", "ช่วยคิด", "อยากทำ", "มีไอเดีย", "ก่อนเริ่ม", "party mode", "ให้ทุก role ช่วยคิด", "3 amigos", "discuss before task", "คุยก่อนแบ่งงาน"

> 💡 ใช้ที่ **Phase 1.8** — หลัง Inception (Phase 1) เสร็จ ก่อนเข้า Phase 2 (Task Design)
> Orchestrator dispatch subagent ต่อ role (PO/Dev/QA) — แต่ละ subagent วิเคราะห์จาก Phase 1 artifacts
> Output: `brainstorming-summary.md` → feed เข้า Phase 2.1 QA Task Design + 2.5 Dev Task Design

| Reference | ใช้เมื่อ |
|-----------|---------|
| `po-lens.md` | PO subagent — user value, scope gaps, success criteria |
| `dev-lens.md` | Dev subagent — feasibility, architecture risks, complexity |
| `qa-lens.md` | QA subagent — testability, edge cases, AC gaps |
| `output-template.md` | Format ของ brainstorming-summary.md |

### `core/subagent-driven/` — Subagent-Driven Development
**Triggers:** "spawn subagent", "ใช้ subagent", "parallel tasks", "dispatch agent", "2-stage review", "subagent-driven"

> ⚡ ใช้ **ระหว่าง Phase 3.1** เมื่อมี 3+ tasks ที่ independent — dispatch subagent ต่อ task พร้อม 2-stage review
> ต้องมี `dev-task-progress.md` ก่อน

| Reference | ใช้เมื่อ |
|-----------|---------|
| `dispatch-rules.md` | เมื่อไหร่ควร dispatch vs execute inline |
| `context-template.md` | Template สำหรับ subagent prompt |
| `review-checklist.md` | Stage 1 (Spec) + Stage 2 (Quality) checklist |

### `core/aidlc/` — AIDLC Governance
**Triggers:** "start AIDLC", "เริ่ม AI-DLC", "plan", "build", "test scenario", "automate", "QA"

Full governance: DECISIONS→PLAN→EXECUTE, phase gates, naming, templates

| Reference | ใช้เมื่อ |
|-----------|---------|
| `workflow.md` | Phase routing, anti-shortcut rules, quick commands, decision dialog |
| `dev-task-design.md` | Dev task breakdown |
| `qa-task-design.md` | QA task breakdown |
| `shared-task-progress-guide.md` | Task progress tracking |
| `knowledge-buffer.md` | Capture patterns across features |
| `complexity-examples.md` | Complexity assessment examples |

### `core/source-driven/` — Source-Driven Development
**Triggers:** "verify docs", "cite source", "official docs", "check API version", "unverified", "documented implementation"

> 🔍 ใช้เมื่อ implement framework-specific code — บังคับ verify กับ official docs, cite sources, flag สิ่งที่ unverified
> ลด hallucination จาก stale training data

| Reference | ใช้เมื่อ |
|-----------|---------|
| (self-contained) | Process: DETECT→FETCH→IMPLEMENT→CITE |

### `core/debugging/` — Debugging and Error Recovery
**Triggers:** "debug", "fix failing test", "triage error", "reproduce bug", "root cause", "flaky test", "build breaks"

> 🐛 ใช้เมื่อ tests fail, build breaks, หรือ behavior ไม่ตรง expectation
> Stop-the-line → Reproduce → Localize → Reduce → Fix → Guard

| Reference | ใช้เมื่อ |
|-----------|---------|
| (self-contained) | 6-step triage + Playwright-specific patterns |

### `core/doubt-driven/` — Doubt-Driven Development
**Triggers:** "doubt", "adversarial review", "verify decision", "high stakes", "critical path", "ตรวจก่อน commit"

> ⚠️ ใช้เมื่อ decision เป็น non-trivial (production, security, irreversible, unfamiliar code)
> CLAIM→EXTRACT→DOUBT→RECONCILE→STOP — bounded 3 cycles max

| Reference | ใช้เมื่อ |
|-----------|---------|
| (self-contained) | Adversarial self-review process |

### `core/review-personas/` — Review Personas (Code/Test/Security)
**Triggers:** "review code", "pre-merge", "security audit", "test coverage", "ship check", "OWASP", "coverage gaps"

> 🔍 3 specialist personas ใน 1 skill: code-reviewer (5-axis), test-engineer (Prove-It), security-auditor (OWASP)
> ใช้ทีละตัว หรือ fan-out ทั้ง 3 สำหรับ pre-merge gate

| Reference | ใช้เมื่อ |
|-----------|---------|
| (self-contained) | Persona 1: Code Reviewer (5-axis + severity labels) |
| (self-contained) | Persona 2: Test Engineer (coverage analysis + Prove-It) |
| (self-contained) | Persona 3: Security Auditor (OWASP + severity classification) |

### `core/analysis-skills/` — Analysis
**Triggers:** "analyze codebase", "gap analysis", "extract requirements", "reverse engineer", "big picture first"

| Reference | ใช้เมื่อ |
|-----------|---------|
| `context.md` | Goals, conflicts, zoom out |
| `discovery-domain.md` | Find existing assets, map domains |
| `gap.md` | What's missing vs required |
| `requirements.md` | User stories, BDD scenarios |
| `reverse-eng.md` | Scan codebase, understand architecture |

### `core/architect/` — System Architecture (DDD + TDD)
**Triggers:** "design architecture", "bounded contexts", "model domain", "API contracts", "logical design", "TDD"

| Reference | ใช้เมื่อ |
|-----------|---------|
| `decomposition.md` | DDD Strategic Design, bounded contexts |
| `architecture-patterns.md` | Microservices vs Monolith, file structure |
| `domain-design.md` | Entities, aggregates, domain events |
| `logical-design.md` | API contracts, DB schemas, frontend specs |
| `tdd.md` | Red → Green → Refactor cycle |

---

## rules/ — Coding Standards

> **Load ก่อน generate code เสมอ**

### `rules/playwright-rules/` — Playwright Standards
**Triggers:** "check Playwright standards", "review Playwright code", writing/reviewing any Playwright code

Key mandates: No `waitForTimeout()`, `getByTestId` + `getByRole` hybrid, AAA pattern, Labels.ts

| Reference | เนื้อหา |
|-----------|---------|
| `coding-standards.md` | AI governance, strategy, restrictions |
| `api.md` | API test structure, naming, assertions, schemas, fixtures |
| `web-ui.md` | Page Object Model, locators, interactions |

### `rules/robotframework-rules/` — Robot Framework Standards
**Triggers:** "check RF standards", "review RF code", writing/reviewing any Robot Framework code

Key mandates: Identical keyword names Android/iOS, `accessibility_id` priority, no `Sleep`, AAA, YAML fixtures

| Reference | เนื้อหา |
|-----------|---------|
| `standards.md` | AI governance, naming, locator priority, tags |
| `android.md` | Android locators, ADB, deep linking |
| `ios.md` | iOS predicates, biometrics, class chain |

### `rules/test-scenario-rules/` — Test Scenario Standards
**Triggers:** "check scenario rules", "CSV format", "review scenario design"

| Reference | เนื้อหา |
|-----------|---------|
| `guidelines.md` | Title format, priority, categories, language policy |
| `csv-export.md` | 23-column format, validation checklists |

### `rules/industry-rules/` — Industry Design Rules (161 rules)
**Triggers:** "design rules for finance/healthcare/ecommerce/tech", "industry patterns"

| Reference | Rules |
|-----------|-------|
| `tech-saas.md` | 20 rules — productivity, collaboration, data viz |
| `finance.md` | 21 rules — trust, security, regulatory compliance |
| `healthcare.md` | 20 rules — accessibility, empathy, patient-centric |
| `ecommerce.md` | 20 rules — conversion, trust, checkout simplicity |

---

## qa/ — Quality & Testing

### `qa/playwright-testing/` — Playwright Automation
**Triggers:** "write Playwright tests", "review test code", "run tests", "fix failing tests", "heal failures", "visual regression", "accessibility test", "component test"

| Reference | ใช้เมื่อ |
|-----------|---------|
| `workflow.md` | Write → review → run → heal cycle |
| `playwright-code-review.md` | Static audit checklist |
| `quick-automation.md` | Add/modify tests without full workflow |
| `db-writer.md` | Generate DB config + test data service |
| `recorder.md` | Transform Codegen recordings → POM |
| `visual-regression.md` | Screenshot comparison, baseline management |
| `accessibility.md` | axe-core, WCAG, keyboard navigation |
| `component-testing.md` | Test React/Vue/Svelte in isolation |
| `runtime-inspection.md` | Debug failing tests: console, network, DOM, storage, trace |

### `.claude/skills/playwright-cli/` — Browser CLI (external)
**Triggers:** "open URL", "take screenshot", "test login flow", "scrape page", "interact with element"

> 📦 Installed via `npm install -g @playwright/cli@latest` + `playwright-cli install --skills`
> Source of truth: `.claude/skills/playwright-cli/SKILL.md` (not in `ai-dlc/qa/`)
> Setup script: `ai-agent/scripts/setup/setupTests.sh` handles installation

Browser automation via terminal: YAML snapshots, `eX` references, session persistence, test generation

### `qa/qa-architect/` — Test Architecture
**Triggers:** "design test automation architecture", "API test framework", "page object structure", "test DB strategy"

| Reference | ใช้เมื่อ |
|-----------|---------|
| `api-arch.md` | Multi-service API test blueprints |
| `web-arch.md` | Layout-based POM blueprints |
| `mobile-arch.md` | Android/iOS page object blueprints |
| `test-db-strategy.md` | Seed, verify, cleanup protocols |

### `qa/test-scenario/` — Test Scenario Design
**Triggers:** "design test scenarios", "create test cases", "generate test data", "export to CSV"

| Reference | ใช้เมื่อ |
|-----------|---------|
| `reuse-analysis.md` | Find reusable scenarios first |
| `designer.md` | Generate scenarios (CoT + 2026 standards) |
| `data-gen.md` | BVA, pairwise test data |
| `csv-validator.md` | Export MD → 23-column CSV |
| `quick-scenario.md` | Add/modify without full workflow |
| `test-cases.md` | Parse CSV/MD, extract automatable cases |

### `qa/robotframework-testing/` — RF Mobile Testing
**Triggers:** "write RF tests", "review mobile test", "run mobile tests", "fix RF failures", "Browser Library", "RF 7 features"

| Reference | ใช้เมื่อ |
|-----------|---------|
| `workflow.md` | Write → review → run → heal cycle |
| `rf-code-review.md` | Static audit checklist |
| `python-db.md` | Python DB service for mobile test data |
| `browser-library.md` | Playwright-powered web testing with RF |
| `rf7-features.md` | Secret vars, typed keywords, TRY/EXCEPT, WHILE |

### `qa/performance-testing/` — Load Testing (k6)
**Triggers:** "load test", "stress test", "k6", "simulate concurrent users", "performance gate"

| Reference | ใช้เมื่อ |
|-----------|---------|
| `k6-scripting.md` | Write load test scripts, scenarios, thresholds |
| `ci-integration.md` | Run k6 in GitHub Actions / Azure DevOps |
| `analysis.md` | p95/p99, error rate, Grafana dashboards |
| `frontend-performance.md` | Core Web Vitals, bundle analysis, image optimization, React re-renders |

---

## dev/ — Implementation

### `dev/backend-dev/` — Backend
**Triggers:** "design API", "build backend service", "set up auth", "database schema", "Docker", "Node.js", "Python", "FastAPI"

| Reference | ใช้เมื่อ |
|-----------|---------|
| `api-design.md` | REST/GraphQL/gRPC, versioning, error handling |
| `database-design.md` | Schema, normalization, indexing, migrations |
| `authentication.md` | JWT, OAuth2, RBAC, sessions |
| `nodejs.md` | Express, Fastify, NestJS |
| `python.md` | FastAPI, Django |
| `docker.md` | Dockerfile, docker-compose, multi-stage |
| `backend-code-review.md` | Architecture, validation, auth, DB, security audit |

### `dev/frontend-dev/` — Frontend
**Triggers:** "build React app", "Flutter widget", "Next.js", "Tailwind", "Android Kotlin", "iOS Swift", "write component"

| Reference | ใช้เมื่อ |
|-----------|---------|
| `web/react.md` | React 19, hooks, useActionState, useOptimistic |
| `web/nextjs.md` | App Router, Server Components, Server Actions |
| `web/tailwind-standards.md` | Tailwind v4 |
| `web/vite-config.md` | Vite + React + Tailwind |
| `flutter/flutter.md` | Widget, state, navigation, networking |
| `android/android-kotlin.md` | MVVM, Jetpack Compose 2025, Hilt, Coroutines |
| `ios/ios-swift.md` | MVVM, SwiftUI, @Observable, async/await |
| `shared/frontend-code-review.md` | Cross-platform audit checklist |
| `shared/testability-standards.md` | data-testid, accessibilityIdentifier, testTag |
| `shared/ui-states-standards.md` | Loading, Success, Empty, Error states |

### `dev/devops-pipeline/` — CI/CD
**Triggers:** "create pipeline", "set up CI/CD", "create PR", "GitHub Actions", "Azure DevOps", "security scan", "Trivy", "CodeQL"

| Reference | ใช้เมื่อ |
|-----------|---------|
| `pipeline.md` | Pipeline YAML, scheduling, test commands |
| `git-commit.md` | Commit, push, and PR creation flow |
| `axons-azure-sync.md` | Auto-create work items via MCP |
| `github-actions.md` | Workflow YAML, OIDC, reusable workflows |
| `git-commit.md` | Commit conventions |
| `security-scanning.md` | Trivy, CodeQL, Gitleaks, Semgrep (DevSecOps) |

### `dev/impeccable-design/` — Design Quality
**Triggers:** "make it look better", "polish UI", "fix typography", "improve colors", "anti-AI-slop", "craft UI"

> ⚠️ Use AFTER `ux-ui/ui-designer` — this is for implementation quality, not design decisions

Key anti-patterns: no side-stripe borders, no gradient text, no Inter/Roboto, no pure black/white, no card grids

| Reference | ใช้เมื่อ |
|-----------|---------|
| `typography.md` | Font pairing, modular scale, fluid sizing |
| `color-and-contrast.md` | OKLCH, 60-30-10 rule, tinted neutrals |
| `spatial-design.md` | 4pt spacing scale, layout, visual hierarchy |
| `motion-design.md` | Easing, timing, `prefers-reduced-motion` |
| `interaction-design.md` | Forms, focus, loading, modals |
| `craft.md` | Shape then build workflow |

### `dev/security-hardening/` — Security & Hardening (OWASP)
**Triggers:** "OWASP", "secure coding", "input validation", "auth hardening", "XSS prevention", "SQL injection", "rate limiting"

> 🔒 Secure coding practices ตอนเขียน code — เสริม `devops-pipeline/security-scanning.md` (CI detection tools)
> Three-Tier Boundary: Always Do / Ask First / Never Do

| Reference | ใช้เมื่อ |
|-----------|---------|
| (self-contained) | OWASP Top 10 prevention + input validation + rate limiting + secrets management |

### `dev/shipping-launch/` — Shipping & Launch
**Triggers:** "ship", "deploy", "launch", "pre-launch checklist", "rollback plan", "feature flag", "staged rollout", "canary"

> 🚀 Pre-launch checklist + staged rollout + rollback strategy + monitoring setup
> ใช้เมื่อเตรียม deploy production

| Reference | ใช้เมื่อ |
|-----------|---------|
| (self-contained) | Pre-launch checklist, feature flag lifecycle, rollout thresholds, rollback plan |

### `dev/code-simplification/` — Code Simplification
**Triggers:** "simplify", "refactor", "reduce complexity", "clean up code", "Chesterton's Fence", "too complex", "hard to read"

> 🧹 ลด complexity โดยไม่เปลี่ยน behavior — Chesterton's Fence, Rule of 500, incremental refactoring
> ใช้เมื่อ code ทำงานได้แต่อ่านยาก/ซับซ้อนเกินจำเป็น

| Reference | ใช้เมื่อ |
|-----------|---------|
| (self-contained) | 5 Principles + Process: Understand→Identify→Apply→Verify |

### `dev/deprecation-migration/` — Deprecation & Migration
**Triggers:** "deprecate", "migrate", "sunset", "remove legacy", "dead code", "strangler fig", "code-as-liability"

> ♻️ จัดการ legacy code/API ที่ต้องเลิกใช้อย่างเป็นระบบ
> Lifecycle: ANNOUNCE→PROVIDE→MONITOR→DEADLINE→REMOVE

| Reference | ใช้เมื่อ |
|-----------|---------|
| (self-contained) | Deprecation lifecycle + 4 migration patterns (Strangler Fig, Parallel Run, Feature Flag, Branch by Abstraction) |

---

## ~~po/~~ → ดูที่ `core/architect/` ด้านบน

> `po/architect/` ไม่มีแล้ว — ย้ายไปอยู่ที่ `core/architect/` (path จริง: `ai-agent/skills/ai-dlc/core/architect/`)

---

## ux-ui/ — Design

### `ux-ui/ui-designer/` — UI Design System
**Triggers:** "design UI", "create design system", "pick colors/typography", "design tokens", "avoid generic design", "recommend colors for my industry"

> 💡 Optional — ใช้เมื่อต้องการออกแบบ design system หรือ aesthetic direction ก่อน implement
> ถ้ามี design system อยู่แล้ว หรือ project ไม่ต้องการ UI design → ข้ามได้เลย
> ถ้าใช้ → ควรทำก่อน `dev/frontend-dev` เพื่อให้ได้ tokens + direction ก่อน code

Capabilities: 161 industry rules, 67 UI styles, 161 color palettes, 57 font pairings, 25 chart types, 99 UX guidelines

| Reference | ใช้เมื่อ |
|-----------|---------|
| `reasoning-engine/four-stage-process.md` | Build design system from scratch |
| `design-patterns/colors-index.md` | Color palette options |
| `tech-stacks.md` | React/Flutter/SwiftUI token guidance |
| `figma.md` | Figma integration |

---

## knowledge/ — Knowledge Base (Global)

> **Global knowledge base** — ใช้ร่วมกันข้ามทุก project
> สามารถ copy ไปทำ per-project version ได้เมื่อต้องการ customize ให้เข้ากับ team/structure เฉพาะ
> เช่น login auth ที่มี UI handling ต่างจาก global → copy global → แก้ให้ตรงกับ project

```
knowledge/
├── index.json              ← Utility scores, usage counts per domain
├── automation/
│   ├── api/                ← API test patterns
│   ├── webUi/              ← Web UI test patterns
│   ├── mobile/             ← Mobile test patterns
│   └── common/             ← Shared automation patterns
├── business/
│   ├── auth/               ← Authentication patterns
│   ├── finance/            ← Finance domain rules
│   ├── document/           ← Document handling
│   └── common/             ← Shared business rules
└── lessons/
    ├── api/                ← API lessons learned
    ├── webUi/              ← Web UI lessons learned
    └── mobile/             ← Mobile lessons learned
```

**Resolution order (AI ค้นหาตามลำดับ):**
1. `{project_root}/agent-memory/knowledge/` — per-project (custom / business version)
2. `{project_root}/ai-agent/skills/ai-dlc/knowledge/` — skills copied into project
3. `~/.claude/skills/ai-dlc/knowledge/` — global fallback (เฉพาะคนที่ติดตั้ง Claude)

---

## system/ — Meta Skills

> **Path:** `ai-agent/skills/system/` (แยกจาก `ai-dlc/` — อยู่คนละ folder)

### `system/ai-techniques/` — Reasoning Techniques
**Triggers:** "think step by step", "compare approaches", "explore options", "backtrack", "analyze sequentially"

| Reference | Technique |
|-----------|-----------|
| `references/cot.md` | Chain of Thought — break complex problems into sequential steps |
| `references/lats.md` | LATS Simulation — compare multiple strategies, pick best hybrid |
| `references/aot.md` | Algorithm of Thought — branching decisions, backtrack from dead-ends |

> Note: Step-Back Prompting อยู่ใน `ai-dlc/core/analysis-skills/references/context.md`

### `system/analysis-concept/` — Reusable Analysis Patterns
**Triggers:** "zoom out", "what's the goal", "find existing assets", "what's missing", "reverse engineer"

Domain-agnostic thinking patterns — abstract templates ที่ skill อื่นๆ adapt ได้

| Reference | ใช้เมื่อ |
|-----------|---------|
| `references/context-concept.md` | Extract context before starting |
| `references/discovery-domain-concept.md` | Search before creating (anti-redundancy) |
| `references/gap-concept.md` | Required vs available, prioritize gaps |
| `references/reverse-eng-concept.md` | Scan existing system, understand architecture |
| `references/requirements-concept.md` | Gather requirements, acceptance criteria |

### `system/graph-report/` — Project Knowledge Graph
**Triggers:** "create graph report", "update knowledge graph", "project map", "dependency map", "codebase overview"

Generate per-project `GRAPH_REPORT.md` — faster than reading `src/` directly

### `system/hook-creator/` — Hook Creation
**Triggers:** "สร้าง hook", "create hook", "automate on save", "run test on change", "event-driven automation"

สร้าง hooks สำหรับ Kiro หรือ Claude Code

**Standard Hook Set (8 hooks ที่ทุก project ควรมี):**

| # | Hook | Purpose |
|---|------|---------|
| 1 | memory-load | โหลด context ตอนเริ่ม session |
| 2 | aidlc-phase-guard | check prerequisites ก่อน write output |
| 3 | run-tests-after-write | รัน test หลัง AI write |
| 4 | sync-steering-on-skill-add | sync steering เมื่อเพิ่ม skill |
| 5 | sync-hook-to-templates | sync hook ไป templates |
| 6 | knowledge-score-update | update utility scores หลัง test run |
| 7 | agent-memory-auto-consolidation | auto-consolidate เมื่อถึง threshold |
| 8 | memory-save | บันทึก memory + knowledge ท้ายสุด |

Templates: `templates/kiro/` (Kiro) หรือ `templates/claude-code/settings.json` (Claude Code)

### `system/skill-creator/` — Skill Creation
**Triggers:** "create a skill", "write new skill", "improve skill description", "fix skill format"

```
skill-name/
├── SKILL.md              ← frontmatter + instructions (<500 lines)
├── references/           ← detailed docs, loaded as needed
├── scripts/              ← executable code
└── assets/               ← templates, images
```

Progressive disclosure: metadata (100 words) → SKILL.md body → references (unlimited)

### `system/agent-memory/` — Agent Memory System
**Triggers:** "save memory", "load context", "what did we do last time", "remember this", "bootstrap memory", "session summary"

Lean cross-domain memory: hot state + playbook + skill evolution

```
agent-memory/
├── memory.md        ← Hot state (2.5KB max, loaded first)
├── playbook.md      ← Flat problem resolution table
├── skill-log.md     ← Append-only skill improvement log
├── drafts/          ← Temporary resolution drafts (ephemeral)
└── knowledge/       ← Optional detail files (on-demand)
```

Automated by 4 Kiro hooks: session-load (promptSubmit), checkpoint (postTaskExecution), session-save (agentStop), skill-check (postToolUse write)

| Reference | ใช้เมื่อ |
|-----------|---------|
| `references/session-flow.md` | Session lifecycle, Save/Discard Gate, hook behavior |
| `references/templates/` | Empty templates for bootstrapping new workspaces |

---

## กฎหลัก

1. **ทุก dev/QA task → เริ่มที่ `core/aidlc/` เสมอ** — ห้าม skip ไป qa/ หรือ dev/ โดยตรง
2. **Phase gate check** — scan `.aidlc/[system]/[feature]/` ก่อนทำงาน หา phase แรกที่ขาด แล้วเริ่มตรงนั้น
3. **Load rules ก่อน generate** — `rules/playwright-rules/` หรือ `rules/robotframework-rules/` ต้อง load ก่อนเขียน code เสมอ
4. **Knowledge check** — ก่อนเขียน test code ให้เช็ค `knowledge/` สำหรับ templates + lessons ที่มีอยู่แล้ว
5. **DECISIONS file first** — ห้าม PLAN หรือ EXECUTE โดยไม่มี DECISIONS file
6. **Commit hash = done** — task ไม่เสร็จถ้าไม่มี commit hash
