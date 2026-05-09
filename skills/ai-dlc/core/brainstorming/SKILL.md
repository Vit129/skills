---
name: brainstorming
description: >
  This skill should be used when the user wants to explore an idea before committing to a plan.
  Triggers: "brainstorm", "คิดก่อน", "ยังไม่แน่ใจ", "explore", "ลองคิด", "ช่วยคิด",
  "อยากทำ", "มีไอเดีย", "ก่อนเริ่ม", "party mode", "ให้ทุก role ช่วยคิด",
  "what should we build", "help me think through", "not sure what to do".
  Use BEFORE core/aidlc/ — this skill produces the input for the DECISIONS phase.
  Non-coding ideas (business, product, research) can also use this skill.
---

# Brainstorming — Multi-Role Party Mode

Collaborative idea refinement through PO, Dev, and QA lenses in a single session.
Inspired by BMAD Party Mode + Superpowers brainstorming. Output feeds directly into AIDLC DECISIONS phase.

## When to Use

- User has a rough idea but hasn't committed to a direction
- User wants to explore tradeoffs before writing a DECISIONS file
- Feature is complex enough that multiple perspectives matter
- User explicitly asks for multi-role input

## How It Works

**Single agent, multiple lenses** — no subagents needed. The agent switches perspective
per role and responds in character. All roles share the same context.

```
User shares idea (rough is fine)
    ↓
Agent activates 3 roles simultaneously
    ↓
Each role asks 1-2 focused questions from their lens
    ↓
User answers → roles build on each other, challenge, refine
    ↓
2-3 rounds until clarity emerges
    ↓
Agent produces structured output per role
    ↓
Handoff → core/aidlc/ DECISIONS phase
```

## Scale Adaptation

| Idea Size | Rounds | Depth |
|-----------|--------|-------|
| Small (bug fix, minor feature) | 1 round | 1 question per role |
| Medium (new feature, API) | 2 rounds | 2 questions per role |
| Large (new system, major refactor) | 3 rounds | Full lens exploration |

Agent auto-detects size from context. User can override: "ขอแบบ quick" or "ขอแบบ deep".

## Role Lenses

- **PO Lens** — Read `references/po-lens.md`
- **Dev Lens** — Read `references/dev-lens.md`
- **QA Lens** — Read `references/qa-lens.md`

## Output Format

After discussion concludes, produce structured output → Read `references/output-template.md`

## Handoff Rule

When user says "พอแล้ว", "โอเค", "เริ่มได้เลย", "go", or similar:
1. Present the output summary (output-template.md format)
2. Ask: "พร้อม handoff ไป AIDLC DECISIONS phase ไหม?"
3. If yes → trigger `core/aidlc/` with the output as context

## ⚠️ Gotchas

- **Don't over-question** — max 2 questions per role per round. Quality over quantity.
- **Don't skip roles** — all 3 roles must contribute unless user explicitly excludes one.
- **Don't jump to solutions** — roles ask questions first, propose solutions only after round 2.
- **Don't produce DECISIONS file here** — that's AIDLC's job. This skill produces *input* for it.
- **Roles can disagree** — Dev saying "this is too complex" while PO says "users need it" is healthy tension, not a problem.
