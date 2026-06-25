# AIDLC — Dev Mode

## Pre-Flight

**Q1 — Approach:**
```
A) TDD  — write test first → RED → implement → GREEN (default)
B) SDLC — implement first → test later
```
Not specified → default TDD.

## Phase Flow

`Lite Inception → 2.5-Dev → 3.1 → 3.2 → 3.3 → DONE`

### Lite Inception
1. Fetch PBI: `npx ts-node ~/.kiro/scripts/azure-devops/pull-pbi/pullPbi.ts`
2. Load `analysis-skills` → context.md → goals, scope, constraints
3. Codebase exists? YES → load `interview` (doc mode) + `analysis-skills` → reverse-eng.md
4. Confirm output paths (`.aidlc/`, Dev source root)
5. Write DECISIONS.md + PLAN.md
→ Full steps: `references/workflow.md` § Lite Inception

### Phase 2.5-Dev — Dev Task Design
1. Load `dev-architect` + relevant dev skill (backend/frontend)
2. Read `references/dev-task-design.md`
3. Break feature into tasks (≤2h each)
4. Write `dev-task-progress.md`
5. Confirm task order with user

### Phase 3.1 — Implementation
1. Load `backend-dev` or `frontend-dev` + `security-hardening` (if auth-related)
2. Read task from `dev-task-progress.md`
3. Check `agent-memory/knowledge/` → `skills/knowledge/` (fallback)
4. Implement → run tests + lint → commit with task ref
5. Update `dev-task-progress.md` status
→ TDD: make failing QA tests pass. SDLC: implement first, tests written in 3.2.
→ 3+ independent tasks: load `subagent-driven`

### Phase 3.2 — Integration + Review
1. Load `review-personas`
2. Run full test suite (integration)
3. Code review (security + quality + coverage) → fix findings

### Phase 3.3 — PR + Ship
1. Load `shipping-launch`
2. Fetch PBI via script → create PR → link PR to PBI
3. Update PBI state → "Testing" or "Developing"
4. Pipeline pass → merge → close PBI (if all children done)

## Rules

- Knowledge root: `agent-memory/knowledge/` first → `skills/knowledge/` fallback
- Dialog format: structured step-by-step — never plain chat dump
- After each phase: Progress Breadcrumb → wait "continue?" before advancing
- Commit hash = only proof of completion — no hash = not done
- Security concern (auth/permission/user input): load `security-hardening` in 3.1
