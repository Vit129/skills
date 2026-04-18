---
name: unified-memory-workspace
description: >
  Workspace adapter for Unified Memory (Memory Palace + Knowledge Evolution). 
  Trigger when: starting a new chat, finishing a task, user says "remember this",
  "สรุป session", "save memory", "load context", "อ่าน memory", "what did we do last time",
  "save session + learn", "update scores".
  Core concepts live at {skills_root}/system/unified-memory/SKILL.md
---

# Unified Memory — Workspace Adapter

Core concepts, AAAK compression, Scoring, Learning, and Archive System:
→ `{skills_root}/system/unified-memory/SKILL.md`

Architecture & Design (ภาษาไทย):
→ `{skills_root}/system/unified-memory/SYSTEM_README.md`

## Workspace Storage

**Per-project (default):**
```
{project_root}/.unified-memory/
├── palace/
│   ├── state.md       ← palace map (read this first on session start)
│   ├── tunnels.md     ← cross-wing refs
│   ├── wings/
│   │   └── {topic}/
│   └── archive/
└── knowledge/
    ├── index.json     ← utility scores (source of truth)
    └── lessons/
```

**Global (optional):**
```
{project_root}/skills/knowledge/    ← cross-project knowledge fallback
```

## Session Workflow

### Session Start
1. Read `{project_root}/.unified-memory/palace/state.md`
2. Read `{project_root}/.unified-memory/knowledge/index.json` (if exists)
3. Load relevant wing hall.md + top lessons
4. Brief user on last session context + learning state

### Session End (Manual Trigger or agentStop hook)
→ Follow save/learn process in `{skills_root}/system/unified-memory/references/session.md`
→ Hook: `{project_root}/.kiro/hooks/memory-save.kiro.hook`

## Knowledge Root Convention

`{knowledge_root}` resolves in this order:

| Priority | Path | When to use |
|----------|------|-------------|
| 1. Per-project | `{cwd}/.unified-memory/knowledge/` | Working within a specific project workspace — walk up from cwd until found |
| 2. Global fallback | `{project_root}/skills/knowledge/` | No per-project knowledge found — cross-project shared patterns |

**Rule:** Always read/write per-project first. Sync to global only when patterns have cross-project value.

## Knowledge Tracking

On session end:
- Update `.unified-memory/knowledge/index.json` with utility score changes
- Capture new lessons in `.unified-memory/knowledge/lessons/`
- Sync back to global if cross-project relevance: `{project_root}/skills/knowledge/`
