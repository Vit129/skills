# Maintenance — Consolidation, Dedup, Stale, Conflict, Score Normalization

Everything about keeping the knowledge base clean and reliable over time.

---

## Why Maintenance Matters

Without maintenance, knowledge bases degrade:
- Duplicate lessons with slightly different wording → routing noise
- Stale entries that no longer apply → bad recommendations
- Relative dates ("last week") → lose meaning over time
- Contradicting entries from different sessions → confusion
- All templates drifting to the same high score → no differentiation

Maintenance restores signal quality.

---

## Trigger Conditions

Run maintenance ("consolidate knowledge") when ANY:

```
Condition 1: sessions_since_last_consolidation >= 5
Condition 2: days_since_last_consolidation >= 7
Condition 3: knowledge items increased by > 20% since last consolidation
Condition 4: User explicitly asks "consolidate knowledge"

Track in agent-memory/palace/wings/knowledge-evolution/hall.md:
  Sessions_Since_Consolidation: N
  Last_Consolidation: YYYY-MM-DD
```

---

## Step 1: Deduplication

```
For each knowledge domain (templates + lessons separately):

  1. Load all items in domain
  2. Group by semantic similarity:
       Same error pattern → same group
       Same solution approach → same group
       Same root cause → same group

  3. For each duplicate group:
       Keep: highest utility_score + usage_count
       Merge: applied_count + prevented_failures from all duplicates
       Retire others: still_relevant = false
       Add note: "merged into {winner_id} on {date}"

  4. Log: "Deduped {N} items in {domain} → {M} survivors"
```

**Example:**
```
Before:
  LESSON-API-001: "Always validate payload" (applied: 3, prevented: 2)
  LESSON-API-007: "Validate input before processing" (applied: 1, prevented: 0)
  → Same root cause: input validation

After:
  LESSON-API-001: "Always validate payload" (applied: 4, prevented: 2) ← winner
  LESSON-API-007: still_relevant = false, merged into LESSON-API-001
```

---

## Step 2: Stale Detection

Flag items likely outdated:

```
Stale signals:
  - last_used older than 90 days AND usage_count > 0
  - still_relevant = true + applied_count = 0 + created > 180 days ago
  - auto_captured = true + confidence < 0.6 + created > 30 days ago (never reviewed)

Action:
  Set still_relevant = false (soft delete — keep for audit)
  Add note: "auto-staled: {reason} on {date}"
  Log: "Staled {N} items: {list}"

Never hard-delete — stale items stay for audit trail.
```

---

## Step 3: Date Normalization

```
Scan all text fields in rooms + lessons for relative date references:

  Patterns to replace:
    "last week"   → calculate + replace with YYYY-MM-DD
    "last month"  → calculate + replace with YYYY-MM-DD
    "recently"    → replace with approximate YYYY-MM-DD or "~YYYY-MM"
    "yesterday"   → replace with YYYY-MM-DD
    "soon"        → remove or flag: "⚠️ undated: clarify"
    "a few days"  → flag: "⚠️ relative date: clarify"

Never modify timestamps that are already absolute (YYYY-MM-DD).
```

---

## Step 4: Conflict Resolution

```
Search for contradicting lessons (same domain + opposite guidance):

Detection:
  Lesson A: "always do X"
  Lesson B: "never do X" (same domain)
  → Contradiction detected

Action:
  Flag both: "⚠️ Contradicts: {other_lesson_id}"
  Ask human: "Lesson {A} says X. Lesson {B} says Y. Which is correct?"
  
  Human resolves:
    Keep A → set B: still_relevant = false, note "overridden by {A}"
    Keep B → set A: still_relevant = false, note "overridden by {B}"
    Both valid (different contexts) → add context discriminator to each

  Auto-captured vs Human-curated conflict:
    Auto-captured ALWAYS loses — no human needed
    Set auto_captured.still_relevant = false
    Note: "overridden by human-curated {id}"
```

---

## Step 5: Score Normalization (Recalibration)

```
Problem: Over time, successful templates all drift to 7.5–9.0
         → No differentiation → routing becomes random

Detection: > 80% of templates have utility_score ≥ 7.0

Recalibration formula:
  new_score = score × 0.85
  
  Example:
    Template A: 9.0 → 7.65
    Template B: 7.5 → 6.38
    Template C: 5.0 → 4.25
    → Relative ranking preserved, absolute values reset

Rule: Run recalibration max once per quarter
Log: "Recalibrated {N} templates on {date}. Factor: 0.85"

### Burst Activity Recalibration (Sprint Mode)
```
Trigger: >10 score changes within 7 days for same domain

Problem: Rapid iteration inflates scores faster than normal cadence
         → templates reach "Proven" before truly validated

Sprint mode factor: 0.90
  Apply to ALL score changes in that domain during burst window:
    effective_boost = 0.5 × 0.90 = 0.45 (instead of 0.5)
    effective_penalty = 1.0 × 0.90 = 0.90 (instead of 1.0)

Detection:
  Count score_changes in last 7 days per domain (from routing-log.md)
  If count > 10 → activate sprint mode for that domain

Deactivation:
  When 7-day rolling count drops to ≤10 → resume normal scoring

Log: "⚡ Sprint mode: {domain} ({n} changes/7d) — factor 0.90 applied"
```
```

---

## Step 6: Auto-Dream (Rolling Distillation)

Inspired by Anthropic Claude Code Auto-Compaction:

```
When to run: After consolidation steps 1–5
What it does:
  For each wing in agent-memory/palace/wings/:
    1. Read all closets for this wing
    2. Identify: what information has "settled" (unchanged for N sessions, domain-aware)
    3. Domain-aware settling threshold:
         arch (architecture/decisions): 5 sessions unchanged → settled
         api (API patterns/endpoints):  4 sessions unchanged → settled
         ui (UI components/locators):   2 sessions unchanged → settled
         default:                       3 sessions unchanged → settled
    3. Distill settled facts → single compact statement per topic
    4. Archive the source rooms that fed into distilled statements
    5. Keep distilled version as new "ground truth" closet

Effect:
  - Settled knowledge becomes more compact over time
  - Active, changing knowledge stays in full rooms
  - Palace grows smarter and more efficient simultaneously

Example:
  Before: 6 rooms about auth decisions (each session added notes)
  After: 1 distilled closet (settled truth) + archive (for audit)
```

---

## Maintenance Checklist

Run in this order:

```
□ 1. Check trigger conditions (session count, days, item count)
□ 2. Deduplication — group by semantic similarity, merge duplicates
□ 3. Stale detection — flag items not used in 90+ days
□ 4. Date normalization — replace relative dates with absolute
□ 5. Conflict resolution — flag contradictions, resolve with human
□ 6. Score normalization — recalibrate if >80% templates ≥7.0 (quarterly only)
□ 7. Auto-dream — distill settled facts, archive sources
□ 8. Update hall.md: Sessions_Since_Consolidation = 0, Last_Consolidation = today
□ 9. Log summary: "Consolidated: {N} deduped, {M} staled, {K} conflicts resolved"
```

---

## Post-Maintenance State Check

After maintenance, verify health:

```
Palace Health:
  - state.md ≤ 100 lines? ✅ / ❌ (archive old wings)
  - hall.md ≤ 50 lines? ✅ / ❌ (create hall-detail.md overflow)
  - Any room > 80 lines without closet? ✅ / ❌ (compress now)
  - Tunnels reference archived wings? ✅ / ❌ (update tunnels.md)

Knowledge Health:
  - Score distribution: mix of Proven/Active/Flagged? ✅ / ❌ (recalibrate)
  - Auto-captured items reviewed? ✅ / ❌ (review queue)
  - Gap tracker: gaps getting resolved? ✅ / ❌ (create templates for top gaps)
  - Sessions_Since_Consolidation reset to 0? ✅ / ❌
```
