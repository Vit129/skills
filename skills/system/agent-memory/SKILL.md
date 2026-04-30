---
name: agent-memory
description: >
  This skill should be used when the user asks to "bootstrap agent memory",
  "setup memory", "สร้าง agent memory", "reset memory", "memory template",
  "initialize memory files", "create memory structure",
  or needs guidance on the agent memory file structure, session flow,
  Save/Discard Gate rules, or memory hook behavior.
  Non-coding tasks (research, analysis, finance, fitness, accounting)
  use this memory system alongside coding tasks — it is cross-domain.
---

# Agent Memory

Bootstrap, manage, and reference the agent memory system.

## Memory Structure

```text
agent-memory/
├── memory.md        ← Hot state (2.5KB max, loaded first)
├── playbook.md      ← Flat problem resolution table
├── skill-log.md     ← Append-only skill improvement log
├── drafts/          ← Temporary resolution drafts (ephemeral)
└── knowledge/       ← Optional detail files (on-demand)
```

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "bootstrap memory", "setup memory", "initialize", "reset" | `references/templates/` — copy templates to `agent-memory/` |
| "session flow", "how does memory work", "save/discard gate" | `references/session-flow.md` |
| "draft format", "playbook format", "memory format" | `references/templates/` — show the relevant template |

## Quick Reference

- **Session start**: Hook reads `memory.md` → searches `playbook.md`
- **Mid-session**: Hook checkpoints `memory.md` after each task
- **Problem resolved**: Create draft in `drafts/` immediately
- **Session end**: Hook evaluates drafts → updates playbook → reports summary
- **Skill underperformed**: Hook flags in `memory.md` after write ops

## Rules

- `memory.md` max 2,500 bytes — consolidate when exceeded
- Task_Ledger max 5 entries — stale after 3 sessions without update
- Skill_Flags max 5 entries — auto-clear after 3 consecutive successes
- Playbook fields max 120 chars — overflow to `knowledge/`
- Playbook scoring: Applied++ when fix used, Prevented++ when trigger recognized and avoided
- Playbook auto-promote: Applied >= 3 → move to `knowledge/{case-id}.md` automatically
- Playbook archive: Applied+Prevented >= 5 AND no use in 30 days → `knowledge/archive-playbook.md`
- Auto-crystallize: 3+ promoted files same domain + shared keyword → `knowledge/{domain}-pattern.md` (no user confirm needed)
- Drafts are ephemeral — deleted after Save/Discard Gate evaluation
- Never store secrets, credentials, or PII in any memory file
