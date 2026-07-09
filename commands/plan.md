# /plan — Design + break into tasks

Route to `dev-architect` skill (design phases + task breakdown).

## Instructions

1. Read `agent-memory/plans/[feature]/CONTEXT.md` — if missing, STOP: run `/spec` first
2. Invoke `Skill(dev-architect)` — work through Strategic → Tactical → Logical Design
3. For task checklists spanning multiple sessions, load:
   - QA work → `qa-architect/references/qa-task-design.md`
   - Dev work → `dev-architect/references/dev-task-design.md`

## Prerequisites

- `agent-memory/plans/[feature]/CONTEXT.md` must exist (from `/spec`)

## Done When

- Design artifacts produced (bounded contexts, entities, API contracts as applicable)
- Task breakdown saved if work spans multiple sessions
