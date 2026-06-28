# AIDLC — Full Mode

## Pre-Flight

**Q1 — Approach:**
```
A) TDD  — QA first → RED → Dev → GREEN → REFACTOR (default)
B) SDLC — Dev first → QA after
```
Not specified → default TDD.

## Phase Flow

| Approach | Order |
|---|---|
| TDD  | 0 → 1.1-1.8 → **[QA: 2.1→2.2→2.3→2.4→2.4b]** → **[Dev: 2.5→3.1]** → 3.2 → 3.3 |
| SDLC | 0 → 1.1-1.8 → **[Dev: 2.5→3.1]** → **[QA: 2.1→2.2→2.3→2.4→2.4b]** → 3.2 → 3.3 |

## Phase 0 — Inception

1. Fetch PBI: `npx ts-node ~/.kiro/scripts/azure-devops/pull-pbi/pullPbi.ts`
2. Load `interview` → auto-detects: no codebase → me mode, codebase exists → doc mode
3. Load `analysis-skills` → context.md → goals, scope, constraints
4. Codebase exists → load `analysis-skills` → reverse-eng.md → scan architecture
5. Load `graph-report` → identify affected modules
6. Confirm output paths (`agent-memory/plans/[feature]/`, QA test root, Dev source root)
7. Write DECISIONS.md + PLAN.md
→ Full steps + dialog format: `references/workflow.md` § Phase 0

## Phase 1.1-1.7 — Domain & Logical Design

→ Read `references/workflow.md` § Phase 1 for full steps
Key outputs: `user-stories.md`, `domain-design.md`, `logical-design.md`
Each phase: DECISIONS → PLAN → PREVIEW → APPROVAL → EXECUTE → Progress Breadcrumb

## Phase 1.8 — Brainstorming (3 Amigos)

Load `interview` (amigos mode) → dispatch PO/Dev/QA subagents → synthesize → refine
Input: Phase 1 outputs. Output: `brainstorming-summary.md`

| Size | Signals | Mode |
|---|---|---|
| Small | 1-2 stories, 1 endpoint | Quick: 1 round, 1 question/role — skip if trivial |
| Medium | 3-5 stories, multi-page | Normal: 2 rounds |
| Large | 6+ stories, multi-context | Full: 3 rounds |

Skip if: `brainstorming-summary.md` exists / user says "skip" / feature is small.

## QA Phases (2.1 → 2.2 → 2.3 → 2.4 → 2.4b)

→ Follow `references/qa.md` § Phase 2.x
_TDD: QA runs before Dev implementation. SDLC: QA runs after Dev._

## Dev Phases (2.5-Dev → 3.1)

→ Follow `references/dev.md` § Phase 2.5-Dev and Phase 3.1

## Phase 3.2-3.3 — Integration + Ship

→ Follow `references/dev.md` § Phase 3.2 and Phase 3.3

## Gotchas

- **Phase skip** — enforce gate: previous phase output must exist before advancing
- **Bulk artifact dump** — each phase ends with Progress Breadcrumb + "continue?" — never write all at once
- **Brainstorming misplaced** — runs AFTER Phase 1 artifacts, BEFORE Phase 2. Check `brainstorming-summary.md` for medium+
- **Output path not confirmed** — Phase 0 MUST confirm `agent-memory/plans/[feature]/`, QA root, Dev root before first write
- **Dialog skipped on short commands** — "PBI-002" is NOT permission to skip dialog. Always: detect → check state → announce → wait approval

## Red Flags

- Writing code without DECISIONS file → STOP
- Phase 2 started without Phase 1 output → prerequisites missing
- Agent auto-executing without dialog → present options, wait approval
- Commit hash missing → task not done
