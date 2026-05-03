---
name: agent-memory
description: >
  This skill should be used when the user asks to "bootstrap agent memory",
  "setup memory", "สร้าง agent memory", "reset memory", "memory template",
  "initialize memory files", "create memory structure",
  or needs guidance on the agent memory file structure, session flow,
  Save/Discard Gate rules, memory hook behavior, skill self-evolution,
  knowledge pipeline, or subagent delegation patterns.
  Non-coding tasks (research, analysis, finance, fitness, accounting)
  use this memory system alongside coding tasks — it is cross-domain.
---

# Agent Memory

Bootstrap, manage, and reference the agent memory system.

## Memory Structure

```text
agent-memory/
├── memory.md          ← Hot state (2.5KB max) — task/project context
├── user-profile.md    ← User preferences (stable, loaded at session start)
├── playbook.md        ← Problem resolution cases (scored)
├── skill-log.md       ← Skill improvement proposals (append-only)
├── drafts/            ← Temporary resolution drafts (ephemeral)
└── knowledge/         ← Promoted cases + crystallized patterns
    ├── index.md       ← Searchable master index (tags, edges, scores)
    └── archive-playbook.md  ← Zero-score/retired cases
```

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "bootstrap memory", "setup memory", "initialize", "reset" | `references/templates/` — copy templates to `agent-memory/` |
| "session flow", "how does memory work", "save/discard gate" | `references/session-flow.md` |
| "draft format", "playbook format", "memory format" | `references/templates/` — show the relevant template |
| "subagent", "memory curator", "knowledge curation", "delegate memory" | `references/subagent-patterns.md` |
| "skill evolve", "self-improve", "skill proposal", "apply proposal" | `references/session-flow.md` → Skill Self-Evolution section |

## Quick Reference

- **Session start**: Hook reads `memory.md` + `user-profile.md` → searches `playbook.md`
- **Mid-session**: Hook checkpoints `memory.md` after each task
- **Problem resolved**: Create draft in `drafts/` immediately
- **Skill evolve**: Hook checks if skill can be improved after each task → proposes in `skill-log.md`
- **Session end**: Knowledge-curate hook promotes/crystallizes/archives → Session-save hook evaluates drafts + scores
- **Skill underperformed**: Hook flags in `memory.md` after write ops

## Hooks (6 total)

| Hook | Event | Role |
|------|-------|------|
| session-load v3.1 | promptSubmit | Load memory + user-profile + playbook search |
| checkpoint v1.0 | postTaskExecution | Save progress mid-session |
| skill-check v1.0 | postToolUse (write) | Flag underperforming skills |
| skill-evolve v1.0 | postTaskExecution | Propose skill improvements |
| knowledge-curate v1.0 | agentStop | Promote/crystallize/archive (subagent when threshold) |
| session-save v4.0 | agentStop | Final state save + scoring + nudges |

## Rules

- `memory.md` max 2,500 bytes — capacity indicator in header, consolidate when exceeded
- `user-profile.md` — stable preferences, update only when user explicitly changes them
- Task_Ledger max 5 entries — stale after 3 sessions without update
- Skill_Flags max 5 entries — auto-clear after 3 consecutive successes
- Playbook fields max 120 chars — overflow to `knowledge/`
- Playbook scoring: Applied++ when fix used, Prevented++ when trigger recognized
- Playbook auto-promote: Applied >= 3 → `knowledge/{case-id}.md`
- Playbook archive: Applied+Prevented >= 5 AND no use in 30 days → `knowledge/archive-playbook.md`
- Zero-score archive: Applied=0, Prevented=0, status=done, older than 30 days → archive
- Auto-crystallize: 3+ promoted files same domain + shared keyword → `knowledge/{domain}-pattern.md`
- Skill proposals: max 1 per skill per session, evidence-backed, auto-apply after 2+ sessions evidence
- Subagent delegation: use when 5+ playbook cases OR 3+ knowledge files same domain
- Drafts are ephemeral — deleted after Save/Discard Gate evaluation
- Never store secrets, credentials, or PII in any memory file

## Closed Learning Loops

### Skill Self-Evolution
```
task → skill-check (flag if bad) → skill-evolve (propose if good pattern missing)
  → skill-log.md (proposed) → user approves or auto-apply after 2+ sessions → skill file updated
  → next use verifies → clear flag after 3 successes
```

### Knowledge from Lessons
```
problem resolved → drafts/ → Save/Discard Gate (2/3 criteria)
  → playbook.md (scored each session) → Applied >= 3 → knowledge/{case-id}.md
  → 3+ same domain → knowledge/{domain}-pattern.md (crystallized)
```

## Subagent Note

If you want to use `agent-memory` as a utility subagent, read `references/subagent-patterns.md`.
