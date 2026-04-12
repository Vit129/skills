# Auto-Consolidation Concept

Automatically consolidate, deduplicate, and prune knowledge over time —
so the knowledge base stays clean without manual intervention.

Inspired by: Anthropic's Auto-Dream (Claude Code, 2026), Memory Palace Rolling Distillation

---

## The Problem

Knowledge bases accumulate noise over time:
- Duplicate lessons with slightly different wording
- Stale entries that no longer apply
- Relative dates ("last week") that lose meaning
- Contradicting entries from different sessions
- Low-confidence auto-captured items never reviewed

Without consolidation, routing quality degrades as the signal-to-noise ratio drops.

---

## Trigger Conditions

Run consolidation when ANY of these are true:

```
Condition 1: session_count_since_last_consolidation >= {N}   // e.g., 5 sessions
Condition 2: days_since_last_consolidation >= {D}            // e.g., 7 days
Condition 3: {knowledge_store} item count increased by > 20%
Condition 4: user explicitly requests "consolidate knowledge"
```

Track in `{memory_layer}/knowledge-evolution/hall.md`:

```
last_consolidation: YYYY-MM-DD
sessions_since_consolidation: N
```

---

## Consolidation Steps

### Step 1: Deduplication

For each `{knowledge_store}` category:

```
1. Load all items in category
2. Group by semantic similarity (same error pattern, same solution approach)
3. For duplicates:
   - Keep entry with highest {score_field} + usage_count
   - Merge applied_count + prevented_failures from all duplicates
   - Mark others as still_relevant: false (soft-delete, keep for audit)
4. Log: "Merged {N} duplicates in {category}"
```

### Step 2: Stale Detection

Flag items that are likely outdated:

```
Stale signals:
- last_used older than {stale_threshold}    // e.g., 90 days
- still_relevant = true but applied_count = 0 AND created > 180 days ago
- auto_captured = true AND confidence < 0.6 AND created > 30 days ago (never reviewed)

Action:
- Set still_relevant = false (soft-delete)
- Add note: "auto-staled: {reason} on {date}"
- Log in {memory_layer}: "Staled {N} items"
```

### Step 3: Date Normalization

Convert relative references to absolute:

```
Scan all text fields for relative date patterns:
- "last week" → resolve to actual date based on created_at
- "recently" → replace with created_at date
- "yesterday" → resolve to actual date
- "3 months ago" → resolve to actual date

Update field in-place. Log: "Normalized {N} date references"
```

### Step 4: Contradiction Resolution

Find conflicting entries:

```
Contradiction signals:
- Two lessons with same category + pattern but opposite solutions
- Template with last_failure more recent than last_used
- Lesson says "always X" + another says "never X" in same domain

Action:
- Flag both: add "⚠️ CONFLICT with {other_id}" to notes
- Do NOT auto-resolve — flag for human review
- Log in {memory_layer}: "Flagged {N} conflicts for review"
```

### Step 5: Score Normalization

Prevent score drift over time:

```
If max {score_field} in category > 9.5:
  → Apply soft normalization: scale all scores in category proportionally
  → Preserve relative ranking, reset ceiling
  → Log: "Score normalization applied to {category}"
```

### Step 6: Consolidation Summary

Write to `{memory_layer}/knowledge-evolution/rooms/consolidation-log.md`:

```
## Consolidation — {date}

- Duplicates merged: {N}
- Items staled: {N}
- Dates normalized: {N}
- Conflicts flagged: {N}
- Score normalization: {applied/skipped}
- Next consolidation: after {N} sessions or {D} days
```

---

## Hook Implementation

### Kiro Hook (agentStop trigger)

```json
{
  "name": "Knowledge Auto-Consolidation",
  "version": "1.0.0",
  "when": {
    "type": "agentStop"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Check if knowledge consolidation is needed: read {memory_layer}/knowledge-evolution/hall.md and check sessions_since_consolidation. If >= {N} sessions or >= {D} days since last consolidation, run the consolidation steps from knowledge-evolution/references/auto-consolidation.md. Update hall.md with new last_consolidation date after completion."
  }
}
```

### Manual Trigger

User says any of:
- "consolidate knowledge"
- "clean up knowledge base"
- "deduplicate lessons"
- "prune stale templates"

→ Run all 6 consolidation steps immediately.

---

## What NOT to Auto-Consolidate

- ❌ Human-curated entries (`auto_captured: false`) — never auto-stale
- ❌ High-score items (`{score_field} >= 70% of max`) — proven, keep regardless of age
- ❌ Items with `prevented_failures > 0` — they worked, keep them
- ❌ Entries flagged for conflict — wait for human resolution

---

## Relationship to Memory Palace Rolling Distillation

Memory Palace has Rolling Distillation (every 5 sessions, compress rooms to closets).
Auto-Consolidation is the knowledge-layer equivalent — same trigger cadence, different target:

| | Memory Palace | Knowledge Evolution |
|--|--------------|---------------------|
| Target | Session context rooms | Template/lesson index files |
| Trigger | Every 5 sessions | Every {N} sessions or {D} days |
| Action | Compress to AAAK closet | Dedup + stale + normalize |
| Output | Smaller rooms | Cleaner index files |
