# Semantic Routing Concept

Upgrade from manual intent_patterns to embedding-based semantic matching
when the knowledge base grows large enough that keyword/pattern matching misses too much.

Inspired by: Memento-Skills BM25+vector hybrid, Retrieval-First Era (2026 industry direction)

---

## When to Upgrade

Stay with intent_patterns (from `smart-routing.md`) until:

```
Trigger conditions (ANY of these):
- {knowledge_store} has > 50 templates OR > 100 lessons
- Routing miss rate > 15% (user says "that's not what I meant" repeatedly)
- New domains added that don't fit existing intent_patterns
- Team size > 1 (shared knowledge base, diverse query styles)
```

Below these thresholds, intent_patterns are sufficient and simpler to maintain.

---

## Upgrade Path: 3 Levels

### Level 0 — Current (intent_patterns)
Manual `Input → Process → Output` patterns per domain.
Good for: small knowledge base, single team, predictable query patterns.

### Level 1 — BM25 (text ranking, no embeddings)
Add BM25 scoring over template descriptions + lesson summaries.
Good for: medium knowledge base, no vector infrastructure needed.

### Level 2 — Hybrid (BM25 + vector embeddings)
Combine BM25 text ranking with semantic vector similarity.
Good for: large knowledge base, diverse query styles, cross-domain matching.

---

## Level 1: BM25 Implementation

BM25 ranks documents by term frequency + inverse document frequency.
No model needed — pure text math. Libraries: `lunr.js` (browser), `rank-bm25` (Python), `minisearch` (JS).

### Build Search Index

```
Index fields per knowledge item:
- id
- description / summary
- category / domain
- error patterns (for lessons)
- solution text (for lessons)
- intent_patterns (if exists)

Build index at:
- First use (lazy init)
- After any knowledge item is added/updated
- After consolidation runs
```

### Query Protocol

```
1. User query arrives (e.g., "login token expired")
2. BM25 search over index → ranked list of matches
3. Filter: still_relevant = true, {score_field} >= {min_threshold}
4. Sort: BM25_score * {score_field} (combined ranking)
5. Return top 3 matches
6. If top match BM25_score < {confidence_threshold}:
   → Fall back to intent_patterns (Level 0)
   → Log: "BM25 low confidence, fell back to intent_patterns"
```

### Combined Ranking Formula

```
final_score = (bm25_score * 0.6) + (normalized_{score_field} * 0.4)

Where:
- bm25_score = BM25 relevance (0–1 normalized)
- normalized_{score_field} = {score_field} / max_score (0–1)
- Weights 0.6/0.4 = prefer relevance over quality, adjust to taste
```

---

## Level 2: Hybrid (BM25 + Vector)

Add semantic embeddings when BM25 still misses cross-domain matches.

### Embedding Strategy (no external service required)

Use a local embedding model or Claude's own understanding:

```
Option A — Local model (offline):
  Use sentence-transformers (Python) or @xenova/transformers (JS)
  Model: all-MiniLM-L6-v2 (~80MB, fast, good quality)
  Store embeddings in {knowledge_store} alongside each item

Option B — AI-assisted (no model needed):
  At query time, ask AI: "What are 5 abstract synonyms for this query?"
  Use expanded query for BM25 search
  Cheaper than embeddings, works with existing infrastructure
```

### Hybrid Query Protocol

```
1. BM25 search → top 10 candidates
2. Semantic re-rank:
   - Option A: cosine similarity between query embedding + item embeddings
   - Option B: AI rates relevance of top 10 candidates (1-5 scale)
3. Final ranking: BM25_score * 0.4 + semantic_score * 0.6
4. Return top 3
```

---

## Graceful Degradation Chain

Always maintain fallback chain:

```
Semantic search (Level 2)
    ↓ (if no embedding model / low confidence)
BM25 search (Level 1)
    ↓ (if BM25 score < threshold)
Intent patterns (Level 0)
    ↓ (if no pattern match)
Keyword matching (original)
    ↓ (if no keyword match)
Deep Abstraction Protocol
```

Never block execution — always return something, even if confidence is low.

---

## Migration from intent_patterns

When upgrading from Level 0 → Level 1:

```
1. Keep intent_patterns in place (still used as fallback)
2. Build BM25 index from existing knowledge items
3. Run parallel for 1 week: compare BM25 results vs intent_pattern results
4. If BM25 consistently better → promote to primary, demote intent_patterns to fallback
5. Log routing decisions to measure improvement
```

---

## What This Does NOT Require

- ❌ No cloud API for embeddings (Option B uses AI reasoning instead)
- ❌ No vector database (embeddings stored in existing json files)
- ❌ No changes to knowledge item schema (embeddings are additive fields)
- ❌ No always-on service (index built lazily, cached in memory)

---

## Relationship to Smart Routing

`smart-routing.md` = Level 0 (intent_patterns, manual)
`semantic-routing.md` = Level 1–2 (BM25 + optional embeddings, automatic)

Use `smart-routing.md` first. Upgrade to `semantic-routing.md` when knowledge base outgrows it.
