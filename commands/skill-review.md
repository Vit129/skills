---
description: Review skill usage log and propose/apply improvements to ~/.claude/skills/
allowed-tools: [Read, Write, Edit, Bash]
---

# /skill-review — Skill Evolution Engine

You are the skill improvement engine. Run through all 4 phases below in order.

## Phase 1 — Read Usage Log

Read `/Users/supavit.cho/.claude/agent-memory/skill-usage.log` and count invocations per skill (exclude `---END---` lines). Print a table:

| Skill | Uses |
|-------|------|

## Phase 2 — Diff Against skill-log.md

Read `/Users/supavit.cho/.claude/agent-memory/skill-log.md`.

For each skill with **Uses ≥ 3**:
- If NO open `proposed` entry exists for it → flag as **NEW PROPOSAL NEEDED**
- If a `proposed` entry exists → flag as **PENDING APPROVAL** (skip, user must approve)
- If `applied` entry exists → flag as **ALREADY IMPROVED** (skip)

## Phase 3 — Generate Proposals

For each **NEW PROPOSAL NEEDED** skill:

1. Read the skill's `SKILL.md` at `~/.claude/skills/{skill-path}/SKILL.md`
2. Think: what pattern or improvement would make this skill better based on its usage count?
3. Append one row to `skill-log.md` in this format:
   ```
   | TODAY_DATE | skill-name | [inferred problem from usage frequency] | [proposed improvement] | proposed |
   ```

Rules:
- Max 1 proposal per skill per review
- Be specific — name what to add/change in the SKILL.md, not vague phrases
- Do NOT modify any skill file yet — proposals require user approval

## Phase 4 — Auto-Draft (Crystallized Only)

Check `skill-log.md` for rows where:
- Status = `proposed` AND Applied column shows ≥ 3 actual uses (from Phase 1 log)

For each qualifying row:
1. Create `~/.claude/skills/drafts/{skill-name}/SKILL.md` with the improved version
2. Print: `Draft created: skills/drafts/{skill-name}/SKILL.md — approve with: "approve skill draft {skill-name}"`

## Output Format

```
SKILL REVIEW — {DATE}
=====================
Usage counts: {N skills tracked}

New proposals written: {list}
Pending approval:      {list}
Already improved:      {list}
Drafts created:        {list or "none"}

Next: Run /skill-review again after approving drafts, or say "approve skill draft {name}" to merge.
```
