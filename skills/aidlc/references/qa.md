# AIDLC — QA Mode

## Pre-Flight (full scope)

**Sub-Mode:**
```
A) QA Scenario Only   → Lite Inception → 2.1 → 2.2
B) QA Automation      → Lite Inception → 2.1 → 2.2 → 2.3 → 2.4
C) QA Scenario + Auto → Lite Inception → 2.1 → 2.2 → 2.3 → 2.4
```

**Platform (if B or C):**
```
1. API   2. Web UI   3. API + Web UI   4. Mobile
```

**Automation Pre-Flight (ask once before 2.3):**
```
1. Test Data: Mock only / Real only / Auto-fallback (default)
2. Backend ready? Yes / No
3. DB verify needed? Yes / No
4. Security concern? Yes / No
```

## Phase Flow

### Lite Inception _(full scope only)_
1. Fetch PBI: `npx ts-node ~/.kiro/scripts/azure-devops/pull-pbi/pullPbi.ts`
2. Confirm `agent-memory/plans/[feature]/` + QA test root
3. Write DECISIONS.md + PLAN.md

### Phase 2.1 — QA Task Design
1. Read cached `pbi-{ID}.json`
2. Load `analysis-skills` → discovery + gap analysis vs AC
3. Write `qa-task-progress.md`
→ Full steps: `references/qa-task-design.md`

### Phase 2.2 — Test Case Design
1. Load `test-scenario` + `test-scenario-rules`
2. Design 3 batches: Success → Alternative → Edge (pause + approve each)
3. Export CSV → validate → Azure upload gate → PO sign-off
→ Full steps: `references/workflow.md` § Phase 2.2

### Phase 2.3 — QA Architecture _(Automation only)_
1. Load `qa-architect` + `playwright-rules`
2. Design test structure → write `implementation-plan.md`

### Phase 2.4 — Test Scripts _(Automation only)_
1. Load `playwright-testing` + `playwright-rules` + `debug-mantra`
2. Check `agent-memory/knowledge/qa/` → `skills/knowledge/` (fallback)
3. Write specs → confirm RED (TDD) or PASS (SDLC)
4. Self-heal max 3× → escalate to `debug-mantra` if still failing
5. Upload gate → Git push gate → write `{feature}-lessons.md`

### Phase 2.4b — Verify Against Real
Trigger: "dev ส่งแล้ว" / "verify" / "switch to real"
→ Read `references/phases/construction/verification-against-real.md`

## Rules

- Knowledge root: `agent-memory/knowledge/qa/` first → `skills/knowledge/` fallback
- Sub-mode B/C security concern (Q3=Yes): load `security` skill in 2.2 + 2.4
