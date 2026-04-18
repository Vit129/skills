# Wiki-Graph Pattern — Knowledge Management

> Ingested: 2026-04-16 | Source: YouTube (Obsidian + Claude/Cursor)
> [from: memory:knowledge-ingest/raw/2026-04-16-wiki-graph-second-brain]

## Core Concept

Wiki-Graph เป็น alternative ของ RAG แบบ vector DB:
- โครงสร้าง: nodes (notes/rooms) + edges (links/backlinks)
- ประหยัด token กว่า RAG เพราะไม่ต้อง embedding
- ความสัมพันธ์เชิงลึกดีกว่า เพราะ explicit links ไม่ใช่ similarity score
- Scale: เหมาะ ~100s pages, RAG ดีกว่าที่ ~10,000+ pages

## Ingest Flow (3 Steps)

```
raw/ → admission-control → room → backlinks
  ↑                                    ↓
  └──────── knowledge grows ───────────┘
```

1. dump raw content → `raw/YYYY-MM-DD-{desc}.md`
2. AI extracts concepts + scores admission (≥ 0.6 → proceed)
3. AI writes room + updates hall.md + adds backlinks

## Applied to This System

| Obsidian concept | Our system |
|---|---|
| Vault | `.memory/` + `skills/` |
| Notes | rooms + lesson files |
| Links `[[note]]` | `related_lessons` + tunnels.md |
| Graph view | lessonGraph.json (planned) |
| Raw folder | `.memory/wings/knowledge-ingest/raw/` |
| Health check | knowledge-evolution auto-consolidation |
| Citation | `[from: ...]` convention |

## Key Decisions Applied

- ไม่ใช้ Obsidian app — เอาแค่หลักการ
- Backlinks: distributed (ตอนนี้) → centralized lessonGraph.json (planned)
- Citation convention เพิ่มใน AGENT.md + KIRO.md แล้ว

## Related

- [from: skill:memory-palace] — storage layer
- [from: skill:knowledge-evolution] — health check + scoring
- [from: memory:knowledge-ingest/raw/2026-04-16-wiki-graph-second-brain]
