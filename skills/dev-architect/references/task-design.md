# Task Design

Break a completed design into small, sequential, manageable tasks — Dev or QA. Sections marked **Dev** or **QA** apply to that domain only; unmarked sections apply to both.

For progress tracking rules, file behavior, master index, and resume protocol → Read `shared-task-progress-guide.md`

## Entry Point Requirements

Can start once (all mandatory, no exceptions):
- [ ] `interview` has run (Step 0 scope-check or full gather) — never skipped
- [ ] Design is complete — **Dev:** `dev-architect` Logical Design step done · **QA:** `qa-architect` design approved
- [ ] **Dev:** Test scripts, if any, have at least a skeleton created (TDD: RED)
- [ ] **QA:** Platform selected (single: API / Web UI / Android / iOS — or combined) + coding rules reviewed (`playwright-rules`/`robotframework-rules` for the selected platform(s), `test-scenario-rules` for scenario-only work)

> **Note:** This skill plans the work (task breakdown). Implementation/automation happens AFTER this via `/build`. The progress file produced here defines the iteration path for that work.

## Required Context

- **Dev:** From Logical Design: API specs/service contracts, data storage schema, client app components. From test scenarios/scripts, if available.
- **QA:** From `/spec` (interview): user stories, acceptance criteria, domain context. From platform selection: which coding rules and architecture patterns apply.

## Critical Success Criteria

- ✅ Tasks are atomic (completable in 1-2 hours)
- ✅ Lessons Learnt reviewed before task creation
- **Dev:** All logical design components have corresponding tasks · dependencies clearly identified · sequencing logical (Data Storage → Server Logic → Client Application) · "Run Test Scripts" task after each component
- **QA:** Every test scenario has a corresponding script task · Infrastructure and shared services come FIRST, then scripts · "Run All Tests" verification task per component · Final Review task (code review + full test suite)

## Platform Routing (QA only, MANDATORY — read before creating tasks)

Based on the test platform, MUST read the corresponding skill first:

| Platform | Read skill | Key references |
|----------|-----------|----------------|
| Web UI | `playwright-testing` | workflow.md, quick-automation.md, recorder.md |
| API | `playwright-testing` | workflow.md, quick-automation.md, db-writer.md |
| Android | `robotframework-testing` | workflow.md, python-db.md |
| iOS | `robotframework-testing` | workflow.md, python-db.md |

Also read coding rules:
- Web/API → `playwright-rules` (pw-coding-standards.md + web-ui.md or api.md)
- Mobile → `robotframework-rules` (rf-coding-standards.md + android.md or ios.md)

## When to use

- After requirements and design are clear (Dev: logical design + test script skeleton if any; QA: architecture + platform selected)
- As the first Dev/QA step after design — plans what work needs to be done
- Before `/build` (Dev) or before test case design/test scripts (QA)

## Process

1. **Dev:** Read logical design, test scenarios, test scripts. **QA:** Read test scenarios, QA architecture, data storage strategy.
2. Read Lessons Learnt: check `{knowledge_root}/lessons/` for technical patterns, past mistakes[, and UI behaviors — QA].
3. **QA only:** Classify test data sensitivity (below) and define Mock Strategy (below) before creating fixture/mock tasks.
4. For each user story / test scenario, decompose into the task categories below.
5. Sequence by dependency order.
6. Estimate complexity per task.

### Sensitive Data Classification (QA only, MANDATORY)

Before writing fixture data, classify every data field:

| Classification | Location | Examples |
|---|---|---|
| Sensitive → `.env` | `process.env.X` | credentials, tokens, passwords, login emails, API keys |
| Encrypted → fixture (plain text) | hardcoded plain text | PDPA fields, health data, PII — DbService handles encrypt/decrypt |
| Non-sensitive → fixture file | hardcoded in `.ts`/`.yaml` | companyCode, customerCode, productCode, invoiceNumber |

Rule: `process.env.X` in fixture is allowed ONLY for sensitive fields. Business data MUST be hardcoded in fixture file.

**Encrypted Fields Category:**

Fields ที่ encrypt ใน DB (เช่น PDPA, health data) ต้องระบุแยกออกมา:

| Field | DB Storage | Test Fixture | DB Service |
|-------|-----------|-------------|-----------|
| patient_name | encrypted (AES-256) | plain text | DbService encrypt ก่อน insert, decrypt หลัง verify |
| health_passport | encrypted (FHIR R4) | plain text | DbService encrypt ก่อน insert, decrypt หลัง verify |
| credit_card | encrypted (PCI-DSS) | masked (`****1234`) | ห้าม store plain text ใน fixture |

**กฎ Encrypted Fields:**
- Fixture เก็บ plain text — DbService รับผิดชอบ encrypt/decrypt
- ห้าม hardcode encrypted value ใน fixture (อ่านไม่รู้เรื่อง, maintain ยาก)
- ถ้า field เป็น PCI-DSS → ใช้ masked value เท่านั้น ห้าม plain text

Output in task progress file:
```markdown
### 📂 Test Data Classification
| Field | Value | Location | Reason |
|-------|-------|----------|---------|
| TEST_USER_EMAIL | process.env | .env | sensitive: login credential |
| ACCESS_TOKEN | process.env | .env | sensitive: auth token |
| patient_name | 'John Doe' | fixture.ts | encrypted field — DbService handles encryption |
| companyCode | '1002' | fixture.ts | non-sensitive: business data |
| customerCode | '000XXXX' | fixture.ts | non-sensitive: business data |
```

### Mock Strategy (QA only, MANDATORY for external dependencies)

ก่อนสร้าง mock/interceptor tasks ต้องระบุ behavior สำหรับแต่ละ dependency:

| Dependency | Mock Type | Success Response | Edge Case Behavior |
|-----------|----------|-----------------|-------------------|
| External API | `page.route()` interceptor | return fixture JSON | slow (>5s) → return cached + warning |
| External API (many endpoints) | HAR replay (`routeFromHAR`) | recorded responses | service down → auto-fallback |
| Third-party service | mock service class | return stub data | unavailable → fallback to fixture |
| DB (brownfield) | real DB + TEST_ prefix | real data | conflict → skip with warning |

**HAR vs page.route() Decision:**

| Situation | Use |
|-----------|-----|
| Feature has 5+ API endpoints to mock | HAR (record once, mock all) |
| Need specific error response (4xx, 5xx) | `page.route()` |
| Backend not ready / unstable | HAR (offline replay) |
| Dynamic response per test case | `page.route()` |
| CI/CD needs to run without backend | HAR + `page.route()` hybrid |

> For HAR patterns and recording workflow → see `playwright-testing/references/har-mocking.md`

**Edge Case Mock Rules (MANDATORY):**

ต้องระบุ mock behavior สำหรับ edge cases ก่อนเขียน test scripts:

```markdown
### Mock Strategy
| Dependency | Edge Case | Mock Behavior | Expected Result |
|-----------|----------|--------------|----------------|
| Visa Check API | ตอบช้า >5s | return cached result | show warning banner |
| Flight Search | leg 2 ไม่มีเที่ยวบิน | return empty array | show alternative ±3 วัน |
| Payment Gateway | timeout | return 408 | show retry button |
```

**Security Mock Strategy:**

เมื่อ feature มี security layer (encryption, auth):

| Scenario | Mock Approach | เมื่อไหร่ใช้ |
|---------|--------------|------------|
| Encryption validation | ใช้ real encryption library ใน test env | เมื่อต้องการ validate ว่า encrypt/decrypt ถูกต้อง |
| Encryption bypass | mock response เฉยๆ (ไม่ encrypt จริง) | เมื่อ test business logic ไม่ใช่ security layer |
| Auth token | real token จาก login flow | เสมอ — ห้าม mock auth token |
| API key | process.env | เสมอ — ห้าม hardcode |

## Task Categories

**Dev** — adapt to project type, use only categories that apply:

| Category | Traditional (REST + SQL) | Serverless | Spreadsheet-backed | Frontend-only |
|----------|------------------------|------------|-------------------|---------------|
| Infrastructure | DB schema migrations, message broker config, outbox table | NoSQL collections, function config | Spreadsheet tab structure | LocalStorage schema |
| Data Storage | DTOs, Repository | NoSQL collections | GAS doGet/doPost | N/A (skip) |
| Server Logic | Service, Controller | Function triggers, handlers | GAS doGet/doPost | N/A (skip) |
| Client Application | Components, Pages, State, API integration | Same | Same + LocalStorage sync | Components, Pages, State |
| Integration | E2E wiring, run test scripts | Same | Same | Same |

Sequence: **Infrastructure → Data Storage → Server Logic → Client Application → Integration**

Infrastructure tasks ต้องมาก่อนเสมอ เพราะ Server Logic depend on it:

```markdown
## Infrastructure
- [ ] DB schema migration — {table names}
- [ ] Message broker config — {Kafka topic / RabbitMQ queue} (ถ้ามี async events)
- [ ] Outbox table — {event types} (ถ้าใช้ Outbox Pattern)
- [ ] Environment config (.env) — {new env vars}
- [ ] External service credentials — {API keys, endpoints}
```

**QA** — adapt to platform:

| Category | Playwright (API) | Playwright (Web UI) | Robot Framework (Mobile) |
|----------|-----------------|--------------------|-----------------------|
| Infrastructure | DB config, .env, fixtures | Same + storageState | Appium config, .env, YAML fixtures |
| Shared Services | AuthService, API helpers, DB service | Same + storageState login | Python DB helpers, API helpers |
| Page Objects | N/A (use helpers) | NavigationPage, FeaturePage, FeatureHelper | FeaturePage.robot, HelperKeyword.robot |
| Test Scripts | feature.spec.ts (per scenario) | Same | feature.robot (per scenario) |
| Pipeline | package.json scripts, pipeline YAML | Same | robot commands, pipeline YAML |

Sequence: **Infrastructure → Shared Services → Page Objects → Test Scripts → Pipeline**

## Rules

- Tasks MUST be completable in 1-2 hours
- **Dev:** Every component from logical design MUST have a corresponding task. Include tasks to run test scripts after each component. Skip categories that don't apply (e.g., no Server Logic for frontend-only).
- **QA:** Every test scenario MUST have a corresponding script task. Infrastructure and shared services FIRST, then scripts. Group related scenarios into the same spec file where logical. Include review task after each major component. MUST create an executable test script (run file) and verify until all scenarios pass. Architectural Integrity: files MUST follow `[system]/[feature]` structure. Pre-emptive Healing: use patterns from lessons learnt to write robust code from the first attempt.

## Task Rollback Protocol

เมื่อ task ที่ทำเสร็จแล้วทำให้ test fail หรือ dependent tasks พัง (Dev tasks and QA test-script tasks alike):

| สถานการณ์ | Action |
|----------|--------|
| Task fail (test ไม่ผ่าน) | Mark task ❌, note root cause, fix before proceeding |
| Dependent task พัง (task B พังเพราะ task A) | Re-sequence: fix task A ก่อน, re-run task B |
| Architecture assumption ผิด | Escalate to architect → re-design → re-plan affected tasks |
| Multiple tasks พังพร้อมกัน | Stop, assess scope, create new task breakdown |

**Rollback steps:**
1. Mark failed task as ❌ ใน progress file (`dev-task-progress.md` / `qa-task-progress.md`)
2. Note root cause: `Root cause: [อธิบาย]`
3. ถ้า fix ง่าย → fix in-place, re-run test, mark ✅
4. ถ้า fix กระทบ tasks อื่น → list affected tasks, re-sequence
5. ถ้า fix กระทบ architecture → escalate ก่อน fix

> ⚠️ ห้าม mark task ✅ ถ้า test ยังไม่ผ่าน — completion = test GREEN

## Progress Checklist Template

**Dev** → create at `agent-memory/plans/[FEATURE]/dev-task-progress.md`:

```markdown
# Dev Task Progress — {Feature Name}

Last updated: {YYYY-MM-DD HH:mm}
Status: In Progress | Completed

## Context
(see shared-task-progress-guide.md for required fields)

## Artifacts
- User Stories: {path}
- Logical Design: {path}
- Test Scripts: {path}
- Implementation Plan: {path}

## Summary
- Total tasks: {N}
- Completed: {N}
- Remaining: {N}

## Data Storage
- [ ] Storage setup — {SQL migration / Spreadsheet structure / LocalStorage schema}
- [ ] Seed data / fixtures
- [ ] Environment config (.env)

## Server Logic — {User Story / Endpoint}
- [ ] Data models / DTOs
- [ ] Service layer — {REST API / Serverless Function / GAS endpoint}
- [ ] Business logic
- [ ] ✅ Run test scripts (verify GREEN)

## Client Application — {User Story / Screen}
- [ ] Component — {ComponentName}
- [ ] Page — {PageName}
- [ ] API/Service integration
- [ ] State management
- [ ] ✅ Run test scripts (verify GREEN)

## Integration
- [ ] End-to-end wiring
- [ ] ✅ Run all test scripts (verify GREEN)
- [ ] Code review
```

**QA** → create at `agent-memory/plans/[FEATURE]/qa-task-progress.md`:

```markdown
# QA Task Progress — {Feature Name}

Last updated: {YYYY-MM-DD HH:mm}
Status: In Progress | Completed

## Context
(see shared-task-progress-guide.md for required fields)

## Artifacts
- Test Scenarios: {path}
- Architecture: {path}
- Data Storage Strategy: {path}
- Coding Rules: {rules/playwright-rules or rules/robotframework-rules}

## Summary
- Total tasks: {N}
- Completed: {N}
- Remaining: {N}

## Infrastructure
- [ ] Data storage config — {database/spreadsheet/connection}
- [ ] Seed/cleanup scripts
- [ ] Fixture files — {fixture description}
- [ ] Environment config (.env)

## Shared Services
- [ ] AuthService / login helper
- [ ] API service — {ServiceName}
- [ ] Data storage service — {ServiceName}

## Page Objects / Keywords — {Feature}
- [ ] {PageName}Page — {screen/endpoint}
- [ ] {HelperName}Helper — {utility}

## Test Scripts — {Feature}
- [ ] {scenario}.spec.ts — {scenario title}
- [ ] {scenario}.spec.ts — {scenario title}
- [ ] ✅ Run all tests (verify PASS)

## Pipeline
- [ ] package.json scripts / run commands
- [ ] Pipeline YAML
- [ ] PR template

## Performance Testing (Optional — after all tests PASS)
- [ ] Ask user: Frontend / Backend / Both / Skip
- [ ] Frontend: Chrome DevTools MCP trace → Core Web Vitals report
- [ ] Backend: Per-endpoint p95 + E2E flow timing report
- [ ] Compare against thresholds
- [ ] Performance report generated

## Final Review
- [ ] Code review — standards compliance
- [ ] ✅ Full test suite run (all scenarios PASS)
```

## Output

- **Dev:** `agent-memory/plans/[FEATURE]/dev-task-progress.md`
- **QA:** `agent-memory/plans/[FEATURE]/qa-task-progress.md`

## Before Marking Complete

Validate:
- [ ] All tasks have complexity estimates
- [ ] Progress file created with Context + Artifacts filled in
- [ ] PROGRESS.md updated with new row
- **Dev:** All logical design components have corresponding tasks · dependencies sequenced correctly · test script tasks included after each component
- **QA:** Every test scenario has a corresponding script task · infrastructure tasks come before script tasks · Final Review task is included

## Next Step

- **Dev:** All tasks broken down → continue with `/build`.
- **QA:** All QA tasks complete → continue with `/build` (or hand off if dev-side work remains).

## Score-Aware Lesson Reading (Step 2 — updated)

When reading Lessons Learnt before task creation:

1. Load `{knowledge_root}/lessons/{platform}/` index
2. Filter: `still_relevant = true` only
3. Sort: `effectiveness.prevented_failures DESC`, then `applied_count DESC`
4. Surface top 3 most effective lessons first
5. Note `confidence` for `auto_captured` lessons — treat with lower trust if `confidence < 0.8`
6. Skip lessons where `still_relevant = false`
7. Report: "📚 Applying lesson: {id} — prevented {n}x failures"
