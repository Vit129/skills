# Search Scaling Research — 2026-04-20

## Context
Open thread from competitive analysis: grep doesn't scale past 200+ sessions.
Researched how Elasticsearch, SQLite FTS5, Obsidian handle search.

## Key Findings

### Data Structures Compared
| DS | Search | Insert | Used By |
|----|--------|--------|---------|
| grep (linear) | O(n) | O(1) | Us now |
| Hash Map | O(1) avg | O(1) | Key-value |
| Inverted Index | O(1)/term | O(n) build | ES, FTS5, Lucene |
| Trie | O(L) | O(L) | Autocomplete |
| BM25+InvIdx | O(k)/term | O(n) build | ES, FTS5, Solr |

### How Big Systems Work
- Elasticsearch/Lucene: inverted index + BM25 ranking + sharding
- SQLite FTS5: inverted index in shadow tables + BM25 + Porter stemming
- Obsidian: in-memory index, grep-like, slows at 10K+ notes

## Decision: Zero-dep Inverted Index (JSON)
- Tier 1 (0-200): grep search-index.md → O(n), sufficient
- Tier 2 (200-500): split by year → O(n/y)
- Tier 3 (500+): keyword-inverted-index.json → O(1)/term

### JSON Inverted Index Schema
```json
{"terms": {"keyword": {"df": N, "postings": [{"path":"...", "date":"...", "tf": N}]}}}
```

### BM25 Optional: add tf+df fields, compute score at query time

## Status
Research complete. **Architecture decision made 2026-04-20**: Skip tiered approach → implement full Hybrid Inverted Index + Sorted Date Array immediately. No SQLite. Pure JSON.

## Architecture Decision (2026-04-20)
**Decision**: Hybrid 2-structure approach — skip phased tiers, build production-ready from day 1.

**Rejected**: SQLite (violates no-dependency principle), Trie (overkill for AI use), B-Tree (needs runtime), Skip List (too complex to maintain manually).

### Structure 1: Inverted Index (`keyword-index.json`)
- Keyword → postings list
- Single keyword: O(1)
- AND query: O(min(k1, k2)) — intersect posting lists
- OR query: O(k1 + k2) — union posting lists
- Insert: O(k) where k = keywords per session

### Structure 2: Sorted Date Array (`date-index.json`)
- Array sorted DESC by date
- Binary search for date range: O(log n)
- "Last 7 days": O(log n + results)
- Insert: O(n) worst case (maintain sort) → append + periodic resort

### Files
```
.unified-memory/palace/
├── keyword-index.json    ← inverted index (keyword → postings)
└── date-index.json       ← sorted array (date → rooms)
```

### Complexity Summary
| Operation | Complexity |
|-----------|-----------|
| Keyword search | O(1) |
| AND multi-keyword | O(min posting lists) |
| OR multi-keyword | O(sum posting lists) |
| Date range query | O(log n + k) |
| Insert (session end) | O(k keywords) |
| Scales to | 10,000+ sessions |

## Implementation Plan

### Phase 0: Auto-detect Tier (ทำตอน session start)
```
At session start, count rows in search-index.md:
  rows < 200  → Tier 1 (grep, do nothing)
  rows 200-500 → Tier 2 (split by year)
  rows > 500  → Tier 3 (inverted index)
  
Log: "📊 Search tier: {tier} ({n} sessions)"
```

### Phase 1: Tier 2 — Split by Year (trigger: 200 sessions)

Tasks:
1. Split search-index.md → search-index-{year}.md per year
2. Update search logic: grep current year first → fallback to older years
3. Update session end: append to search-index-{current_year}.md
4. Update consolidation: archive years >2 years old

Files changed:
- `references/storage.md` — add split-by-year schema
- `references/session.md` — update search + write logic
- `references/maintenance.md` — add year-split maintenance

Complexity: O(n/y) where y = number of years

### Phase 2: Tier 3 — Inverted Index (trigger: 500 sessions)

Tasks:
1. Create `palace/keyword-inverted-index.json` with schema:
   ```json
   {
     "_meta": {"version": "1.0", "total_docs": 0, "total_terms": 0, "last_rebuilt": null},
     "terms": {
       "{keyword}": {
         "df": 0,
         "postings": [{"path": "...", "date": "...", "tf": 0, "summary": "..."}]
       }
     }
   }
   ```
2. Build logic (session end):
   - Extract terms from room content (nouns, decisions, technical terms)
   - Stopword removal: skip "the", "a", "is", "was", "ที่", "ของ", "และ", etc.
   - For each term: append to postings[] if not duplicate
   - Update df (document frequency) count
3. Search logic:
   - Single term: O(1) lookup → return postings sorted by date DESC
   - Multi-term AND: intersect posting lists → O(min(k1,k2))
   - Multi-term OR: union posting lists → O(k1+k2)
   - Display: date, wing, summary for each match
4. Rebuild logic (consolidation):
   - Full rebuild: scan all rooms → extract terms → write fresh index
   - Incremental: only process rooms modified since last rebuild
5. Maintenance:
   - Remove postings pointing to archived/deleted rooms
   - Cap terms: if >5000 unique terms → remove terms with df=1 and age >90 days

Files changed:
- `references/storage.md` — add inverted index section
- `references/session.md` — update search + build logic
- `references/intelligence.md` — add search routing
- `references/maintenance.md` — add index maintenance
- `SKILL.md` — update architecture diagram
- `GOTCHAS.md` — add index-specific gotchas

### Phase 3: Optional BM25 Ranking (trigger: user needs relevance ranking)

Tasks:
1. Add BM25 scoring to search results:
   ```
   score(term, doc) = IDF × (tf × (k1+1)) / (tf + k1 × (1 - b + b × dl/avgdl))
   where: k1=1.2, b=0.75, dl=doc length, avgdl=avg doc length
   ```
2. Add `_meta.avgdl` field to index
3. Sort results by BM25 score DESC instead of date DESC
4. Display score alongside results

### Trigger Checklist (check at session start)
```
□ Count search-index.md rows
□ If ≥200 and no year-split files exist → run Phase 1
□ If ≥500 and no inverted-index.json exists → run Phase 2
□ Log tier transition: "📊 Search upgraded: Tier {n-1} → Tier {n}"
```

### Estimated Effort
| Phase | Effort | When |
|-------|--------|------|
| Phase 0 (auto-detect) | 30 min | Next session |
| Phase 1 (year split) | 1 hour | When 200 sessions |
| Phase 2 (inverted index) | 2-3 hours | When 500 sessions |
| Phase 3 (BM25) | 1 hour | When user needs ranking |
