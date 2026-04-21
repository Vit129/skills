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

> **Quick alias:** Wing = domain folder | Hall = index | Room = detail | Closet = summary | Tunnel = cross-link

Two systems, one skill: **Memory Palace** (what happened) + **Knowledge Evolution** (what works).

```
Memory Palace  = storage layer  → WHERE things are remembered
Knowledge Evo  = learning layer → WHAT improves over time
Together       = compound growth: remembers past + gets smarter each session
```

---

## 🏛️ Storage Architecture

```
{project_root}/
└── .unified-memory/
    ├── palace/                           ← Memory Palace (narrative + decisions)
    │   ├── state.md                      ← palace map (≤100 lines)
    │   ├── tunnels.md                    ← cross-wing links
    │   ├── search-index.md              ← grep-searchable session index
    │   ├── user-profile.md              ← persistent user model (≤80 lines)
    │   ├── wings/
    │   │   ├── {topic}/
    │   │   │   ├── hall.md               ← wing index (≤50 lines)
    │   │   │   ├── rooms/{topic}.md      ← full detail
    │   │   │   ├── closets/{topic}.md    ← AAAK compressed (room >80 lines)
    │   │   │   ├── skills/{name}.md      ← crystallized execution paths (DRAFT/ACTIVE/STALE)
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
        ├── index.json                    ← domain catalog + utility_score + evolution_log[]
        └── lessons/{domain}/
            ├── *LessonsIndex.json
            └── *.md

Global Knowledge: {project_root}/skills/knowledge/ ← cross-project fallback
```

**Resolution order:** `{project_root}/.unified-memory/knowledge/` → fallback → `{project_root}/skills/knowledge/`

---

## 🔄 Session Workflow

### Session Start
```
User: "load memory for {project}"

0. Bootstrap: if .unified-memory/ doesn't exist → auto-create full tree (see references/session.md)
1. Read .memory/state.md (palace map)
2. Read .memory/user-profile.md (user preferences + patterns)
3. Read .memory/wings/knowledge-evolution/hall.md (learning state)
4. Classify wings: Hot (relevant) vs Cold (skip)
5. Load Hot wings: hall.md + closets only
6. Brief:
   "Last: {what happened}, Open: {threads}
    Learning: Template {A} proven (7.5), Lesson {B} prevented 3 failures
    Gaps: {domains without templates}"
7. Nudge check: run 6 nudge rules, show max 3 (High→Medium→Low)
8. Skill suggestions: match Hot wing ACTIVE skills against today's task
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
3. Update search-index.md (keywords + room paths for this session)
4. Skill auto-crystallize: pattern ≥2x in routing-log → auto-write DRAFT
5. Skill self-improve: if skill used → compare execution vs Steps → auto-refine on positive
6. Update user-profile.md (new preferences/patterns observed)
7. Update knowledge-evolution wing (scores changed, lessons applied)
8. Sync back: write utility_score + evolution_log[] to .knowledge/index.json
9. Update state.md + tunnels.md
10. Confirm: "✅ Saved X rooms, Y templates updated, Z lessons captured"
```

---

## 📖 References — Load ONE per Need

| Need | Load |
|------|------|
| Session start/end, admission control, sync, nudges, skill suggestions | `references/session.md` |
| Wings, rooms, halls, closets, archive, AAAK, skills, search index, user profile | `references/storage.md` |
| Scoring, routing, auto-capture, semantic search, nudge rules, audit trail | `references/intelligence.md` |
| Consolidation, dedup, stale, conflict, score normalization | `references/maintenance.md` |
| Domain setup, PASS/FAIL signals, intent patterns, phases A→D | `references/adaptation.md` |

---

## ⚠️ Critical Gotchas

See `GOTCHAS.md` for full list (30 items). Top 7:

1. **Recalled facts ≠ truth** — always grep/glob to verify before acting
2. **hall.md drifts** — update synchronously when adding/removing rooms
3. **Stale closet** — regenerate after any room edit >10 lines
4. **Score drift** — recalibrate if templates all converge to same score
5. **Sync must complete** — verify write-back to index.json before ending session
6. **Dirty flag missed** — err on side of dirty=true; better to remind than lose data
7. **Hook prompt drift** — after restructure, cross-check settings.json paths + workflow against SKILL.md

---

## 🛠️ Key Principles

- **No dependencies** — markdown + JSON only
- **Manual triggers** — "save session + learn" (no hooks = no token waste)
- **Dirty flag safety net** — track saveable content in-session, remind before data loss (see `references/session.md`)
- **Source of truth** — .knowledge/index.json (memory is session buffer)
- **Admission control** — score ≥0.6 gates writes (prevents noise)
- **Human override** — auto-captured = advisory, not authoritative
- **Any domain** — code, design, writing, decision, learning, anything
- **Skill Crystallization** — repeated patterns (≥2x) → auto-write as DRAFT, promote to ACTIVE after 1 success (see `references/storage.md`)
- **Skill Self-improvement** — auto-refine Steps on positive outcome with deviation, rollback on regression (see `references/storage.md`)
- **User Modeling** — persistent user-profile.md captures preferences, patterns, expertise across sessions (see `references/storage.md`)
- **Session Search** — grep-based flat-file index for cross-session lookup (see `references/storage.md`)
- **Periodic Nudges** — 6 rules checked at session start, max 3 shown, fatigue-protected (see `references/intelligence.md`)
- **Evolution Audit Trail** — every score change logged with before/after/reason in index.json (see `references/intelligence.md`)
- **Wing Split** — >15 rooms → auto-split to child wings (see `references/storage.md`)
- **Burst Mode** — >10 score changes/7d → dampen with factor 0.90 (see `references/maintenance.md`)
- **Cross-project promote** — `projects_used_in[]` ≥3 → auto-promote to global (see `references/session.md`)
- **Domain-aware settling** — auto-dream thresholds: arch:5, api:4, ui:2, default:3 (see `references/maintenance.md`)
