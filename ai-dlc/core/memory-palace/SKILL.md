---
name: memory-palace-workspace
description: >
  Workspace adapter for Memory Palace. Trigger when: starting a new chat,
  finishing a task, user says "remember this", "สรุป session", "save memory",
  "load context", "อ่าน memory", "what did we do last time".
  Core concepts live at ~/.claude/skills/memory-palace/SKILL.md
---

# Memory Palace — Workspace Adapter

Core concepts, AAAK compression, Temporal KG, Contradiction Detection:
→ `~/.claude/skills/memory-palace/SKILL.md`

Full version plan (ChromaDB + MCP):
→ `~/.claude/skills/memory-palace/references/full-version-plan.md`

README (ภาษาไทย):
→ `~/.claude/skills/memory-palace/MEMORY_PALACE_README.md`

## Workspace Storage

```
.claude/memory/
├── state.md       ← palace map (read this first on session start)
├── tunnels.md     ← cross-wing refs
└── wings/
    └── {project}/
        ├── hall.md
        ├── rooms/
        └── closets/
```

## Session Start
1. Read `.claude/memory/state.md`
2. Load relevant wing hall.md + rooms
3. Brief user on last session context

## Session End (agentStop hook)
→ Follow 10-step save process in `~/.claude/skills/memory-palace/SKILL.md`
