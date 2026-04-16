# AI Agent Skills — Universal Entry Point

> This file is the single entry point for all AI agents (Claude Code, Kiro, or any future agent).
> Skills root = the folder containing this file. No hardcoded paths needed.

---

## Quick Start

| Agent | Load this file |
|-------|---------------|
| **Kiro** | Tell Kiro: `"Read AGENT.md in the skills folder and follow those instructions"` or use `#[[file:AGENT.md]]` in steering |
| **Claude Code** | `CLAUDE.md` is auto-loaded — reads this file for skill discovery |
| **Any agent** | Read `SKILL.md` for full skill index |

---

## Paths (relative to this file)

```
SKILLS_ROOT  = {folder containing this file}
CLAUDE_RULES = {SKILLS_ROOT}/../rules/        ← Claude Code rules
MEMORY_GLOBAL = ~/.memory/global/             ← cross-project memory
MEMORY_PROJECT = {project}/.memory/           ← per-project memory
```

> When moving this folder: only update `MEMORY_GLOBAL` above if needed. Everything else is relative.

---

## Agent-Specific Instructions

- **Kiro:** `KIRO.md` — tier selection, engineering standards, prompt cache rules
- **Claude Code:** `CLAUDE.md` — tier selection (Gemini/Haiku/Sonnet), workflow, token control
- **Skill index:** `SKILL.md` — full map of all available skills

---

## Skills

→ Full index with trigger phrases: `SKILL.md`

---

## Knowledge Ingest Workflow (Wiki-Graph Pattern)

เมื่อต้องการเพิ่มความรู้ใหม่เข้าระบบ:

```
1. dump raw content → {project}/.memory/wings/{topic}/raw/YYYY-MM-DD-{desc}.md
2. AI reads raw file → extracts key concepts
3. AI checks admission-control score (≥ 0.6 → proceed)
4. AI writes to room + updates hall.md + updates lessons index
5. Update lessonGraph.json if new lesson connections found
```

**Trigger phrases:** "ingest this", "add to knowledge", "learn from this", "dump to raw"

---

## Lesson Backlinks (Embedded in Index)

Lesson relationships (edges) are embedded in each platform's index file:

```
ai-dlc/knowledge/lessons/api/apiLessonsIndex.json      → "edges": [...]
ai-dlc/knowledge/lessons/webUi/webUiLessonsIndex.json   → "edges": [...]
ai-dlc/knowledge/lessons/mobile/mobileLessonsIndex.json  → "edges": [...]
```

Do NOT edit `related_lessons` in individual lesson files — use `edges` in the index only.

---

## Citation Convention

เมื่อ AI ตอบโดยอ้างอิงจาก knowledge base ให้ระบุ source เสมอ:

```
[from: LESSON-AUTH-001]       ← lesson reference
[from: skill:playwright-rules] ← skill reference  
[from: memory:{wing}/{room}]   ← memory palace reference
```

ถ้าตอบจากหลาย source: `[from: LESSON-AUTH-001, skill:playwright-rules]`
ถ้าตอบจาก general knowledge (ไม่มี source): ไม่ต้องใส่ tag

---

## Memory

```
Global (cross-project):  ~/.memory/global/
Per-project:             {project}/.memory/
```

### Global Memory Structure

```
~/.memory/global/
├── state.md                    ← global palace map (active wings across all projects)
├── tunnels.md                  ← cross-project links
└── wings/
    ├── knowledge-evolution/    ← template scores + lesson effectiveness (cross-project)
    │   ├── hall.md
    │   ├── rooms/
    │   │   ├── template-health.md
    │   │   ├── lesson-effectiveness.md
    │   │   └── gap-tracker.md
    │   └── closets/
    └── {other-global-wings}/
```

### Session Rules

On session start:
1. Load `~/.memory/global/state.md` if exists → cross-project context
2. Load project `.memory/state.md` → project-specific context
3. Treat both as **hints** (skeptical memory) — verify against actual files before acting

On session end (if decisions were made):
1. Save to project `.memory/` first
2. Sync knowledge-evolution scores to `~/.memory/global/wings/knowledge-evolution/`
3. Update `~/.memory/global/state.md` if cross-project state changed

### Relocation

If moving memory to a different path, update `MEMORY_GLOBAL` in the Paths section above.

---

## Kiro Setup for New Projects

Run once per project:

```bash
{SKILLS_ROOT}/system/hook-creator/setup-kiro-project.sh /path/to/project
```

Copies standard hooks + steering templates to `.kiro/hooks/` and `.kiro/steering/`.

---

## Relocation Guide

Moving skills folder to a new path (e.g., `~/ai-agent/`):

1. Move the folder
2. Update `MEMORY_GLOBAL` path above if different from `~/.memory/global/`
3. Re-run `setup-kiro-project.sh` for each project to update hooks/steering
4. Update `SKILLS_ROOT` in each project's `STEERING_INDEX.md`

Everything else resolves relative to this file automatically.
