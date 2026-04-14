---
name: memory-palace-workspace
description: >
  Workspace adapter for Memory Palace. Trigger when: starting a new chat,
  finishing a task, user says "remember this", "สรุป session", "save memory",
  "load context", "อ่าน memory", "what did we do last time".
  Core concepts live at {skills_root}/system/memory-palace/SKILL.md
---

# Memory Palace — Workspace Adapter

Core concepts, AAAK compression, Temporal KG, Contradiction Detection, Archive System:
→ `{skills_root}/system/memory-palace/SKILL.md`

Full version plan: ยกเลิกแล้ว — markdown-only เป็น final approach

README (ภาษาไทย):
→ `{skills_root}/system/memory-palace/MEMORY_PALACE_README.md`

## Workspace Storage (Hybrid)

**Per-project (default):**
```
{project}/.memory/
├── state.md       ← palace map (read this first on session start)
├── tunnels.md     ← cross-wing refs
├── wings/
│   └── {project}/
│       ├── hall.md
│       ├── rooms/
│       └── closets/
└── archive/
    ├── index.md
    └── {topic}/{year}/
```

**Global (optional):**
```
~/.memory-palace/global/    ← cross-project memory
```

## Session Start
1. Read `{project}/.memory/state.md`
2. Load relevant wing hall.md + rooms
3. Brief user on last session context

## Session End (agentStop hook)
→ Follow save process in `{skills_root}/system/memory-palace/SKILL.md`
→ Hook: `{project}/.kiro/hooks/memory-palace-save.kiro.hook`

## Knowledge Tracking

On session start (if knowledge-evolution wing exists):
- Load `~/.claude/.memory/wings/knowledge-evolution/hall.md`
- Brief: top template score, top lesson effectiveness, flags, gaps
- Example: "📚 Knowledge state: apiAuth score=8.5, LESSON-NET-002 prevented=3x. ⚠️ Flagged: none."

On session end (if knowledge was used this session):
- Update `rooms/template-health.md` with score changes
- Update `rooms/lesson-effectiveness.md` with lessons applied
- Append to `rooms/routing-log.md`: `{date}: Used {template_id}, Applied {lesson_id}`
- Sync back to index files: `{knowledge_root}/automation/*/Index.json` and `{knowledge_root}/lessons/*/Index.json`
- Tunnel: knowledge-evolution ↔ active project wing
