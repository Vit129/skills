---
name: knowledge-evolution
description: >
  Reusable pattern for making any knowledge base self-evolving through execution feedback.
  Use when the user asks to "make knowledge self-evolving", "track which templates work",
  "score lessons by effectiveness", "auto-capture patterns from failures",
  "add feedback loop to knowledge", "improve routing with intent matching",
  "knowledge base keeps getting better", "templates that work get promoted",
  "lessons learned from test results", "knowledge feedback loop",
  or when designing a system where AI should learn from its own execution history.
  Adapt to any domain — not tied to any specific tech stack or file format.
---

# Knowledge Evolution

A pattern for making any knowledge base self-improving through a closed feedback loop.
Adapt the concepts here to your system's storage format, naming conventions, and workflow.

## Knowledge Structure (Two Layers)

```
KNOWLEDGE_GLOBAL  = ~/.claude/skills/ai-dlc/knowledge/   ← cross-project templates + lessons
KNOWLEDGE_PROJECT = {project}/.knowledge/                 ← per-project overrides
```

Resolution order: `{project}/.knowledge/` first → fallback to `KNOWLEDGE_GLOBAL`

### Global (`ai-dlc/knowledge/`)
```
ai-dlc/knowledge/
├── index.json              ← master catalog, utility_score per domain
├── automation/
│   ├── api/                apiIndex.json + templates
│   ├── webUi/              webUiIndex.json + templates
│   ├── mobile/             mobileIndex.json + templates
│   └── common/             commonIndex.json + templates
├── business/
│   ├── auth/               businessAuthIndex.json + rules
│   ├── finance/            businessFinIndex.json + rules
│   └── document/           businessDocIndex.json + rules
└── lessons/
    ├── api/                apiLessonsIndex.json + lesson files
    ├── webUi/              webUiLessonsIndex.json + lesson files
    └── mobile/             mobileLessonsIndex.json + lesson files
```

### Per-Project (`{project}/.knowledge/`)
```
{project}/.knowledge/
├── index.json              ← project domain catalog, utility_score per domain
├── README.md               ← usage guide
└── lessons/
    └── {domain}/           *LessonsIndex.json + lesson files
```

## Core Concept

```
Read → Execute → Reflect → Write
  ↑                           ↓
  └─────── knowledge ─────────┘
```

Every execution produces a signal. Good outcomes promote knowledge. Bad outcomes flag it.
The system learns which knowledge is reliable without human intervention.

## Six Concepts — Load ONE per task

| Need | Load |
|------|------|
| เพิ่ม `utility_score` ให้ templates, `effectiveness` ให้ lessons, auto-capture หลัง test fail/pass, conflict detection | `references/utility-scoring.md` |
| เพิ่ม `intent_patterns`, routing sort by score, lesson sort by prevented_failures | `references/smart-routing.md` |
| Knowledge base > 50 templates / > 100 lessons → BM25 หรือ vector embeddings | `references/semantic-routing.md` |
| สร้าง knowledge-evolution wing, session start/end protocol, write-back sync to index files | `references/memory-integration.md` |
| Deduplicate, stale detection, date normalization, conflict resolution, score normalization | `references/auto-consolidation.md` |
| วิเคราะห์ failure > 5 อันพร้อมกัน, batch lesson capture, conflict-free consolidation | `references/parallel-analysis.md` |
| Phase A→D roadmap, folder structure สองชั้น, setup `.knowledge/`, placeholder mapping | `references/implementation-guide.md` |

## How to Adapt

- **Storage format** — json index files, markdown, database, vector store — adapt the schema
- **Trigger points** — after test run, after save, on session end — adapt to your workflow hooks
- **Score fields** — `utility_score` is a suggestion; rename to fit your domain
- **Routing logic** — check `.knowledge/` first → fallback to global
- **Memory layer** — Memory Palace is the reference implementation; any persistent store works

## Design Principles

- **No new dependencies** — works with whatever storage format already exists
- **Additive only** — new fields don't break existing consumers
- **Graceful degradation** — if score is missing, treat as neutral (5.0), never block execution
- **Human override always wins** — auto-captured knowledge is advisory, not authoritative
- **Source of truth stays in files** — memory/tracking layers are caches, not replacements
