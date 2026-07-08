# Dev Task Design

Break logical design into small, sequential, manageable development tasks.

For progress tracking rules, file behavior, master index, and resume protocol → Read `shared-task-progress-guide.md`

## Entry Point Requirements

### Dev Only mode (Phase 2.5 — after Lite Inception)
Can start this phase if:
- [ ] Lite Inception complete (mini-spec.md exists) OR external specs provided
- [ ] Logical design exists (logical-design.md) OR will be created as part of Lite Inception

### Full mode (Phase 2.5 — parallel with Phase 2.4)
Can start this phase if:
- [ ] `logical-design.md` exists and is validated
- [ ] Phase 2.4 (Test Script Design) has at least test file skeleton created
- [ ] Technical specifications are complete

> **Note:** This skill plans the Dev work (task breakdown). Implementation happens AFTER this phase at Phase 3.1. The dev-task-progress.md produced here defines the iteration path for construction phases (3.1, 3.2, 3.3).

## Required Context from Previous Phases

- From Logical Design: API specs / service contracts, data storage schema, client application components
- From Test Case Design (if available): scenarios to be supported
- From Test Script Design (if available): automation scripts to be built first (TDD: RED)

## Critical Success Criteria

- ✅ All logical design components have corresponding tasks
- ✅ Tasks are atomic (completable in 1-2 hours)
- ✅ Dependencies are clearly identified
- ✅ Sequencing is logical (Data Storage first, Server Logic second, Client Application third)
- ✅ Includes "Run Test Scripts" tasks after each component
- ✅ Lessons Learnt reviewed before task creation

## When to use

- After Lite Inception or Phase 1 Inception + Phase 2.4 (test script skeleton) is complete
- As the FIRST Dev phase — plans what Dev work needs to be done
- Before implementation (Phase 3.1)
- Need to plan Dev work in manageable chunks with clear iteration path

## Process

1. Read logical design, test scenarios, test scripts
2. Read Lessons Learnt: Check `{knowledge_root}/lessons/` for technical patterns, past mistakes, and implementation pitfalls
3. For each user story, decompose into categories below
4. Sequence by dependency order
5. Estimate complexity per task

## Task Categories

Adapt to project type — use only categories that apply:

| Category | Traditional (REST + SQL) | Serverless | Spreadsheet-backed | Frontend-only |
|----------|------------------------|------------|-------------------|---------------|
| Infrastructure | DB schema migrations, message broker config, outbox table | NoSQL collections, function config | Spreadsheet tab structure | LocalStorage schema |
| Data Storage | DTOs, Repository | NoSQL collections | GAS doGet/doPost | N/A (skip) |
| Server Logic | Service, Controller | Function triggers, handlers | GAS doGet/doPost | N/A (skip) |
| Client Application | Components, Pages, State, API integration | Same | Same + LocalStorage sync | Components, Pages, State |
| Integration | E2E wiring, run test scripts | Same | Same | Same |

Sequence: **Infrastructure → Data Storage → Server Logic → Client Application → Integration**

### Infrastructure Tasks (MANDATORY — list before Data Storage)

Infrastructure tasks ต้องมาก่อนเสมอ เพราะ Server Logic depend on it:

```markdown
## Infrastructure
- [ ] DB schema migration — {table names}
- [ ] Message broker config — {Kafka topic / RabbitMQ queue} (ถ้ามี async events)
- [ ] Outbox table — {event types} (ถ้าใช้ Outbox Pattern)
- [ ] Environment config (.env) — {new env vars}
- [ ] External service credentials — {API keys, endpoints}
```

## Rules

- Tasks MUST be completable in 1-2 hours
- Every component from logical design MUST have a corresponding task
- Include tasks to run test scripts after each component
- Skip categories that don't apply (e.g., no Server Logic for frontend-only)

## Task Rollback Protocol

เมื่อ task ที่ทำเสร็จแล้วทำให้ test fail หรือ dependent tasks พัง:

| สถานการณ์ | Action |
|----------|--------|
| Task fail (test ไม่ผ่าน) | Mark task ❌, note root cause, fix before proceeding |
| Dependent task พัง (task B พังเพราะ task A) | Re-sequence: fix task A ก่อน, re-run task B |
| Architecture assumption ผิด | Escalate to architect → re-design → re-plan affected tasks |
| Multiple tasks พังพร้อมกัน | Stop, assess scope, create new task breakdown |

**Rollback steps:**
1. Mark failed task as ❌ ใน dev-task-progress.md
2. Note root cause: `Root cause: [อธิบาย]`
3. ถ้า fix ง่าย → fix in-place, re-run test, mark ✅
4. ถ้า fix กระทบ tasks อื่น → list affected tasks, re-sequence
5. ถ้า fix กระทบ architecture → escalate ก่อน fix

> ⚠️ ห้าม mark task ✅ ถ้า test ยังไม่ผ่าน — completion = test GREEN

## Progress Checklist Template

Create at:
`agent-memory/plans/[FEATURE]/dev-tasks.md`

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

## Output

File: `agent-memory/plans/[FEATURE]/dev-tasks.md`
Location:
`agent-memory/plans/[FEATURE]/dev-tasks.md`

## Phase Transition Validation

Before proceeding to next phase, validate:
- [ ] All logical design components have corresponding tasks
- [ ] All tasks have complexity estimates
- [ ] Dependencies are sequenced correctly
- [ ] Test script tasks are included after each component
- [ ] Progress file created with Context + Artifacts filled in
- [ ] PROGRESS.md updated with new row

## Next Phase

When all tasks complete:
- If DevOps Sync is next → go to `references/phases/inception/azure-devops-sync.md`
- If Construction is next → go to `references/phases/construction/implementation.md`

## Score-Aware Lesson Reading (Step 2 — updated)

When reading Lessons Learnt before task creation:

1. Load `{knowledge_root}/lessons/{platform}/` index
2. Filter: `still_relevant = true` only
3. Sort: `effectiveness.prevented_failures DESC`, then `applied_count DESC`
4. Surface top 3 most effective lessons first
5. Note `confidence` for `auto_captured` lessons — treat with lower trust if `confidence < 0.8`
6. Skip lessons where `still_relevant = false`
7. Report: "📚 Applying lesson: {id} — prevented {n}x failures"
