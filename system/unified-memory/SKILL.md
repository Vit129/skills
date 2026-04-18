---
name: unified-memory
description: >
  Persistent memory + self-learning knowledge system for any domain.
  Use when: "save memory", "load context", "what did we do last time",
  "remember this", "track which templates work", "score lessons",
  "auto-capture patterns", "session summary", "what works best",
  "knowledge feedback loop", "domain health check", "prepare next session".
  Works for: code, design, writing, decision-making, learning, any domain.
concurrency: unsafe
isolation: shared
---

# Unified Memory System 🧠

Two systems, one skill: **Memory Palace** (what happened) + **Knowledge Evolution** (what works).

```
Memory Palace  = storage layer  → WHERE things are remembered
Knowledge Evo  = learning layer → WHAT improves over time
Together       = compound growth: remembers past + gets smarter each session
```

---

## 🏛️ Storage Architecture

```
{project}/
└── .unified-memory/
    ├── palace/                           ← Memory Palace (narrative + decisions)
    │   ├── state.md                      ← palace map (≤100 lines)
    │   ├── tunnels.md                    ← cross-wing links
    │   ├── wings/
    │   │   ├── {topic}/
    │   │   │   ├── hall.md               ← wing index (≤50 lines)
    │   │   │   ├── rooms/{topic}.md      ← full detail
    │   │   │   ├── closets/{topic}.md    ← AAAK compressed (room >80 lines)
    │   │   │   └── raw/YYYY-MM-DD-*.md   ← verbatim records
    │   │   └── knowledge-evolution/      ← learning tracking wing
    │   │       ├── hall.md               ← top templates, top lessons, flags
    │   │       ├── rooms/
    │   │       │   ├── template-health.md
    │   │       │   ├── lesson-effectiveness.md
    │   │       │   ├── gap-tracker.md
    │   │       │   └── routing-log.md
    │   │       └── closets/knowledge-state.md
    │   └── archive/
    │       ├── index.md
    │       └── {topic}/{year}/
    │
    └── knowledge/                        ← Knowledge Evolution (scored templates + lessons)
        ├── index.json                    ← domain catalog + utility_score
        └── lessons/{domain}/
            ├── *LessonsIndex.json
            └── *.md

Global Knowledge: ~/.claude/skills/ai-dlc/knowledge/ ← cross-project fallback
```

**Resolution order:** `{project}/.unified-memory/knowledge/` → fallback → `~/.claude/skills/ai-dlc/knowledge/`

---

## 🔄 Session Workflow

### Session Start
```
User: "load memory for {project}"

1. Read .memory/state.md (palace map)
2. Read .memory/wings/knowledge-evolution/hall.md (learning state)
3. Classify wings: Hot (relevant) vs Cold (skip)
4. Load Hot wings: hall.md + closets only
5. Brief:
   "Last: {what happened}, Open: {threads}
    Learning: Template {A} proven (7.5), Lesson {B} prevented 3 failures
    Gaps: {domains without templates}"
```

### Session Execute
```
- Use templates from .knowledge/index.json
- Track outcome: SUCCESS or FAILURE after each execution
- Note reasoning in-session (write at end)
```

### Session End (Manual Trigger)
```
User: "save session + learn"

1. Admission Control: score ≥0.6? → proceed | skip
2. Write to .memory/wings/{topic}/ (rooms, closets, hall)
3. Update knowledge-evolution wing (scores changed, lessons applied)
4. Sync back: write utility_score changes to .knowledge/index.json
5. Update state.md + tunnels.md
6. Confirm: "✅ Saved X rooms, Y templates updated, Z lessons captured"
```

---

## 📖 References — Load ONE per Need

| Need | Load |
|------|------|
| Session start/end, admission control, sync, schemas | `references/session.md` |
| Wings, rooms, halls, closets, archive, AAAK | `references/storage.md` |
| Scoring, routing, auto-capture, semantic search, parallel | `references/intelligence.md` |
| Consolidation, dedup, stale, conflict, score normalization | `references/maintenance.md` |
| Domain setup, PASS/FAIL signals, intent patterns, phases A→D | `references/adaptation.md` |

---

## ⚠️ Critical Gotchas

See `GOTCHAS.md` for full list. Top 5:

1. **Recalled facts ≠ truth** — always grep/glob to verify before acting
2. **hall.md drifts** — update synchronously when adding/removing rooms
3. **Stale closet** — regenerate after any room edit >10 lines
4. **Score drift** — recalibrate if templates all converge to same score
5. **Sync must complete** — verify write-back to index.json before ending session

---

## 🛠️ Key Principles

- **No dependencies** — markdown + JSON only
- **Manual triggers** — "save session + learn" (no hooks = no token waste)
- **Source of truth** — .knowledge/index.json (memory is session buffer)
- **Admission control** — score ≥0.6 gates writes (prevents noise)
- **Human override** — auto-captured = advisory, not authoritative
- **Any domain** — code, design, writing, decision, learning, anything
