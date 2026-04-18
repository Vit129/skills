# Admission Control & Mutable Memory

Controls what gets written to the palace and prevents contradiction accumulation.

## 🚦 Admission Control (A-MAC inspired)

Before writing any room or raw file, score the session content on 5 factors:

| Factor | Weight | Question |
|--------|--------|---------|
| Future Utility | 0.3 | Will this be needed in future sessions? |
| Factual Confidence | 0.2 | Is this confirmed, not speculative? |
| Semantic Novelty | 0.2 | Is this new info not already in palace? |
| Temporal Recency | 0.15 | Is this current (not outdated)? |
| Content Type Prior | 0.15 | architecture/decision > Q&A > routine |

- Score ≥ 0.6 → write to room/raw
- Score < 0.6 → skip (do not write)

**Simplified check:** "Would I regret not having this next session?"

## 🔄 Mutable Memory (Mnemos inspired)

Before overwriting any fact in a room file:

```text
New fact arrives
    ↓
Search room for existing active fact (same subject/predicate)
    ↓
No existing fact → write new fact
Existing fact found:
  ├─ Same meaning → skip (no-op)
  ├─ Updated/superseded → overwrite + add temporal triple
  └─ Contradicts strategy → warn user before overwriting
```

This prevents contradiction accumulation — old facts are overwritten, not appended.
