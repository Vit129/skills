# QA Task Design

Break test scenarios and architecture into small, sequential QA automation tasks.

For progress tracking rules, file behavior, master index, and resume protocol → Read `shared-task-progress-guide.md`

## Entry Point Requirements

### QA Scenario Only mode (Phase 2.1 → 2.2)
Can start this phase if:
- [ ] Lite Inception complete (mini-spec.md exists) OR external specs provided
- [ ] Coding rules reviewed (ai-dlc/rules/test-scenario-rules)

### QA Automation mode (Phase 2.1 → 2.2 → 2.3 → 2.4)
Can start this phase if:
- [ ] Lite Inception complete (mini-spec.md exists) OR external specs provided
- [ ] Platform selected (API / Web UI / Android / iOS)
- [ ] Coding rules reviewed (ai-dlc/rules/playwright-rules or ai-dlc/rules/robotframework-rules)

### Full mode (Phase 2.1 — after Phase 1.8 Brainstorming)
Can start this phase if:
- [ ] Phase 1 Inception complete (user-stories.md + domain-design.md + logical-design.md exist)
- [ ] Brainstorming complete (brainstorming-summary.md exists) OR feature is Small
- [ ] Coding rules reviewed

> **Note:** This skill plans the QA work (task breakdown). Test scenarios, QA architecture, and test scripts are created AFTER this phase — not before. The qa-task-progress.md produced here defines the iteration path for subsequent phases (2.2, 2.3, 2.4).

## Required Context from Previous Phases

- From Inception/Lite Inception: user stories, acceptance criteria, domain context
- From Brainstorming (if applicable): refined scope, QA-specific concerns
- From Platform Selection: determines which coding rules and architecture patterns to use

## Critical Success Criteria

- ✅ Every test scenario has a corresponding script task
- ✅ Tasks are atomic (completable in 1-2 hours)
- ✅ Infrastructure and shared services come FIRST, then scripts
- ✅ Includes "Run All Tests" verification task per component
- ✅ Includes Final Review task (code review + full test suite)
- ✅ Lessons Learnt reviewed before task creation

## Platform Routing (MANDATORY — read before creating tasks)

Based on the test platform, MUST read the corresponding skill first:

| Platform | Read skill | Key references |
|----------|-----------|----------------|
| Web UI | `playwright-testing` | workflow.md, quick-automation.md, recorder.md |
| API | `playwright-testing` | workflow.md, quick-automation.md, db-writer.md |
| Android | `robotframework-testing` | workflow.md, python-db.md |
| iOS | `robotframework-testing` | workflow.md, python-db.md |

Also read coding rules:
- Web/API → `ai-dlc/rules/playwright-rules/` (coding-standards.md + web-ui.md or api.md)
- Mobile → `ai-dlc/rules/robotframework-rules/` (standards.md + android.md or ios.md)

## When to use

- After Lite Inception or Phase 1 Inception is complete
- As the FIRST QA phase — plans what QA work needs to be done
- Before test case design (Phase 2.2), QA architecture (Phase 2.3), and test scripts (Phase 2.4)
- Need to plan QA work in manageable chunks with clear iteration path

## Process

1. Read test scenarios, QA architecture, and data storage strategy
2. Read Lessons Learnt: Check `{knowledge_root}/lessons/` for technical patterns, past mistakes, and UI behaviors
3. **Classify test data sensitivity** (before creating fixture tasks):

### Sensitive Data Classification (MANDATORY)

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

4. **Define Mock Strategy** (before creating mock/interceptor tasks):

### Mock Strategy (MANDATORY for external dependencies)

ก่อนสร้าง mock/interceptor tasks ต้องระบุ behavior สำหรับแต่ละ dependency:

| Dependency | Mock Type | Success Response | Edge Case Behavior |
|-----------|----------|-----------------|-------------------|
| External API | `page.route()` interceptor | return fixture JSON | slow (>5s) → return cached + warning |
| Third-party service | mock service class | return stub data | unavailable → fallback to fixture |
| DB (brownfield) | real DB + TEST_ prefix | real data | conflict → skip with warning |

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

5. Sequence by dependency order
6. Estimate complexity per task

## Task Categories

Adapt to platform:

| Category | Playwright (API) | Playwright (Web UI) | Robot Framework (Mobile) |
|----------|-----------------|--------------------|-----------------------|
| Infrastructure | DB config, .env, fixtures | Same + storageState | Appium config, .env, YAML fixtures |
| Shared Services | AuthService, API helpers, DB service | Same + storageState login | Python DB helpers, API helpers |
| Page Objects | N/A (use helpers) | NavigationPage, FeaturePage, FeatureHelper | FeaturePage.robot, HelperKeyword.robot |
| Test Scripts | feature.spec.ts (per scenario) | Same | feature.robot (per scenario) |
| Pipeline | package.json scripts, pipeline YAML | Same | robot commands, pipeline YAML |

Sequence: Infrastructure → Shared Services → Page Objects → Test Scripts → Pipeline

## Rules

- Tasks MUST be completable in 1-2 hours
- Every test scenario MUST have a corresponding script task
- Infrastructure and shared services FIRST, then scripts
- Group related scenarios into the same spec file where logical
- Include review task after each major component
- MUST create an executable test script (run file) and verify until all scenarios pass
- Architectural Integrity: Files MUST follow `[system]/[feature]` structure
- Pre-emptive Healing: Use patterns from lessons learnt to write robust code from the first attempt

## Progress Checklist Template

Create at `.aidlc/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/qa-task-progress.md`:

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
- Coding Rules: {ai-dlc/rules/playwright-rules or ai-dlc/rules/robotframework-rules}

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

## Final Review
- [ ] Code review — standards compliance
- [ ] ✅ Full test suite run (all scenarios PASS)
```

## Output

File naming: `qa-task-progress.md`
Location: `.aidlc/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/qa-task-progress.md`

## Phase Transition Validation

Before proceeding to next phase, validate:
- [ ] Every test scenario has a corresponding script task
- [ ] All tasks have complexity estimates
- [ ] Infrastructure tasks come before script tasks
- [ ] Final Review task is included
- [ ] Progress file created with Context + Artifacts filled in
- [ ] PROGRESS.md updated with new row

## Next Phase

When all QA tasks complete → return to `workflow.md` routing table to determine next phase.

## Score-Aware Lesson Reading (Step 2 — updated)

When reading Lessons Learnt before task creation:

1. Load `{knowledge_root}/lessons/{platform}/` index
2. Filter: `still_relevant = true` only
3. Sort: `effectiveness.prevented_failures DESC`, then `applied_count DESC`
4. Surface top 3 most effective lessons first
5. Note `confidence` for `auto_captured` lessons — treat with lower trust if `confidence < 0.8`
6. Skip lessons where `still_relevant = false`
7. Report: "📚 Applying lesson: {id} — prevented {n}x failures"
