# Smart Routing Protocol

Upgrades knowledge discovery from keyword matching to intent-aware, score-weighted routing.

---

## 1. Intent Pattern Schema

Add `intent_patterns` to `knowledge/business/businessIndex.json` per domain:

```json
{
  "domains": {
    "auth": {
      "keywords": ["login", "logout", "sso", "token", "session"],
      "intent_patterns": [
        "verify identity → grant access",
        "input credentials → validate → create session",
        "revoke access → destroy session",
        "refresh token → extend session"
      ]
    },
    "finance": {
      "keywords": ["payment", "invoice", "transaction", "billing"],
      "intent_patterns": [
        "calculate amount → validate → process transaction",
        "generate document → apply rules → produce output",
        "verify balance → authorize → debit/credit"
      ]
    },
    "document": {
      "keywords": ["upload", "download", "pdf", "file", "attachment"],
      "intent_patterns": [
        "select file → validate format → upload → confirm",
        "request document → fetch → render → download"
      ]
    },
    "common": {
      "keywords": ["search", "filter", "sort", "paginate", "export"],
      "intent_patterns": [
        "input query → filter results → display list",
        "select criteria → apply filter → paginate output"
      ]
    }
  }
}
```

**Intent pattern format:** `{Input} → {Process} → {Output}` — describes the abstract flow,
not the implementation. Match when the feature's flow matches the pattern regardless of naming.

---

## 2. Updated Discovery Phase 4 (Intent Matching)

Replace keyword-only matching in `discovery-domain.md` Phase 4 with this sequence:

```
Phase 4 — Domain Matching (updated):

Step 4.1 — Extract Intent
  "What is the Input → Process → Output of this feature?"
  Example: "user enters credentials → system validates → session created"

Step 4.2 — Intent Match (semantic level)
  Compare extracted intent against intent_patterns in businessIndex.json
  Match = pattern overlap ≥ 2 steps
  → If match found: load domain, proceed to Phase 5

Step 4.3 — Keyword Fallback (original behavior)
  If no intent match → scan keywords array
  → If match found: load domain, proceed to Phase 5

Step 4.4 — Deep Abstraction (original behavior)
  If no keyword match → apply Deep Abstraction Protocol
  → Extract abstract verbs, retry intent match with abstracted terms
```

---

## 3. Utility-Weighted Template Selection

When Phase 5 finds multiple matching templates, rank by score:

```
Phase 5 — Template Selection (updated):

1. Collect all templates matching the feature type
2. Sort by utility_score DESC
3. Select top match
4. If top match utility_score < 3.0:
   → Warn: "⚠️ Template '{id}' มี utility_score {score} — มีปัญหาบ่อย"
   → Offer next best template as alternative
5. If top match auto_captured = true AND confidence < 0.8:
   → Note: "📝 Template นี้ถูก auto-capture — ยังไม่ verified โดยคน"
```

---

## 4. Lesson Effectiveness Sorting

Update `qa-task-design.md` and `dev-task-design.md` Step 2 "Read Lessons Learnt":

```
Step 2 — Read Lessons (updated):

1. Load lessons index for matched domain
2. Filter: still_relevant = true only
3. Sort by effectiveness.prevented_failures DESC, then applied_count DESC
4. Display top 3 most effective lessons first
5. For auto_captured lessons: show confidence score
6. Skip lessons where still_relevant = false (soft-deleted)
```

**Rationale:** Lessons that prevented the most failures are most valuable to read first.
Lessons with high applied_count but low prevented_failures = informational, not critical.

---

## 5. Conflict-Free Routing

Before routing to a template or lesson, check for contradictions:

```
Contradiction check:
- Two templates for same feature type with opposite approaches → flag both
- Lesson says "always do X" + another says "never do X" → flag, ask human
- Template last_failure is recent (< 7 days) → warn before using
```

Log all routing decisions in Memory Palace `knowledge-evolution/rooms/routing-log.md`.

---

## 6. Files to Modify

| File | Change |
|------|--------|
| `knowledge/business/businessIndex.json` | Add `intent_patterns` per domain |
| `core/analysis-skills/references/discovery-domain.md` | Update Phase 4 (intent matching) + Phase 5 (utility routing) |
| `core/aidlc/references/qa-task-design.md` | Update Step 2 (lesson effectiveness sorting) |
| `core/aidlc/references/dev-task-design.md` | Update Step 2 (lesson effectiveness sorting) |
