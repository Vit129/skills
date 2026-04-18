# Intelligence — Scoring, Routing, Learning, Semantic Search

Everything about HOW the system gets smarter: utility scoring, intent routing, auto-capture, and semantic upgrade.

---

## Core Loop

```
Read → Execute → Reflect → Write
  ↑                         ↓
  └──────── knowledge ───────┘

Every execution produces a signal.
Good outcomes promote knowledge. Bad outcomes flag it.
```

---

## 1. Outcome Signals (Domain-Specific)

Each domain has its own natural signal vocabulary — do NOT replace with generic SUCCESS/FAILURE:

| Domain | POSITIVE Signal | NEGATIVE Signal | When Captured |
|--------|----------------|-----------------|---------------|
| **Code** | PASS | FAIL | After test run |
| **Design** | APPROVE | REJECT | After stakeholder review |
| **Writing** | ACCEPT | REVISE | After editor feedback |
| **Decision** | POSITIVE | NEGATIVE | After outcome visible |
| **Learning** | MASTERED | GAP | After quiz/assessment |
| **Research** | VALIDATED | DISPROVEN | After experiment |

---

## 2. Knowledge Structure (Two Layers)

```
KNOWLEDGE_GLOBAL  = ~/.claude/skills/ai-dlc/knowledge/              ← cross-project templates + lessons
KNOWLEDGE_PROJECT = {project}/.unified-memory/knowledge/             ← per-project overrides

Resolution order:
  1. Check {project}/.unified-memory/knowledge/ first
  2. Fallback to KNOWLEDGE_GLOBAL if domain not found
```

### Template Index Schema
```json
{
  "templates": {
    "{category}": [{
      "id": "template-id",
      "path": "templates/template.md",
      "utility_score": 5.0,
      "usage_count": 0,
      "outcome_positive_count": 0,
      "outcome_negative_count": 0,
      "last_used": null,
      "last_outcome": null,
      "auto_captured": false
    }]
  }
}
```

### Lesson Index Schema
```json
{
  "lessons": [{
    "id": "LESSON-{DOMAIN}-{TYPE}-{N}",
    "title": "Short description",
    "description": "Full lesson text",
    "effectiveness": {
      "applied_count": 0,
      "prevented_failures": 0,
      "still_relevant": true,
      "confidence": 1.0
    },
    "auto_captured": false,
    "created": "YYYY-MM-DD",
    "last_applied": null
  }]
}
```

---

## 3. Score Update Rules

### After POSITIVE outcome (PASS / APPROVE / ACCEPT / etc.)
```
utility_score += 0.5        (max 10.0)
usage_count += 1
last_used = today
last_outcome = "positive"
outcome_positive_count += 1
```

### After NEGATIVE outcome (FAIL / REJECT / REVISE / etc.)
```
utility_score -= 1.0        (min 0.0)
usage_count += 1
last_used = today
last_outcome = "negative"
outcome_negative_count += 1
```

### After lesson applied + failure prevented
```
effectiveness.applied_count += 1
effectiveness.prevented_failures += 1
effectiveness.last_applied = today
```

### After lesson applied (informational, no prevention)
```
effectiveness.applied_count += 1
effectiveness.last_applied = today
```

---

## 4. Score Thresholds

| Score | Status | Routing Behavior |
|-------|--------|-----------------|
| ≥ 7.0 | ✅ Proven | Prefer first. High confidence. |
| 3.0–6.9 | 🟡 Active | Normal use. |
| < 3.0 | ⚠️ Flagged | Warn before use. Review needed. |
| 0.0 | 🔴 Deprecated | Skip unless explicitly requested. |

**Warning message for flagged template:**
```
"⚠️ Template '{id}' score {score} — failed {n}x recently.
 Next best: '{id2}' (score {score2}). Use flagged? [y/n]"
```

---

## 5. Smart Routing (Intent-Based)

### Intent Pattern Format
```
"{Input} → {Process} → {Output}"

Describes ABSTRACT FLOW, not implementation.
Match when flow matches pattern regardless of naming or domain jargon.
```

### Intent Patterns in Index
```json
{
  "domains": {
    "errorHandling": {
      "keywords": ["error", "exception", "catch", "retry"],
      "intent_patterns": [
        "detect error → validate type → respond appropriately",
        "catch exception → log context → retry or fail gracefully"
      ]
    },
    "formDesign": {
      "keywords": ["form", "input", "field", "validation"],
      "intent_patterns": [
        "user enters data → system validates → show inline feedback",
        "group related fields → improve scanning → reduce errors"
      ]
    },
    "persuasiveWriting": {
      "keywords": ["email", "pitch", "proposal", "convince"],
      "intent_patterns": [
        "establish problem → propose solution → motivate action",
        "hook attention → build credibility → clear call to action"
      ]
    },
    "strategicDecision": {
      "keywords": ["decide", "option", "tradeoff", "criteria"],
      "intent_patterns": [
        "define problem → explore options → evaluate tradeoffs → decide",
        "gather evidence → challenge assumptions → commit"
      ]
    }
  }
}
```

### Routing Algorithm
```
Step 1 — Extract Intent
  "What is the Input → Process → Output of this task?"

Step 2 — Intent Match (semantic)
  Compare against intent_patterns in index.json
  Match = pattern overlap ≥ 2 steps → load domain

Step 3 — Keyword Fallback
  If no intent match → scan keywords array → load domain

Step 4 — Deep Abstraction
  If no match → abstract verbs:
    "check" = verify, validate, ensure, confirm
    "send" = emit, dispatch, publish, deliver
  Retry intent match with abstracted terms

Step 5 — Score Sort
  Multiple templates → sort by utility_score DESC
  Top score < 3.0 → warn + offer next best
  auto_captured + confidence < 0.8 → flag for review
```

### Lesson Routing
```
1. Load lessons for matched domain
2. Filter: still_relevant = true only
3. Sort by prevented_failures DESC, then applied_count DESC
4. Display top 3
5. Show confidence for auto-captured (if < 1.0)
6. Skip still_relevant = false
```

---

## 6. Auto-Capture (Failure → Lesson)

When a NEGATIVE outcome has a clear root cause:

```
NEGATIVE outcome detected
  → Analyze root cause (what pattern caused this?)
  → Search existing lessons for same pattern:

  Same content found:
    → increment applied_count (not a duplicate, reinforce)

  Different content (variant):
    → Create lesson-v2 entry, keep both

  Contradicts existing lesson:
    → Flag both, ask human to resolve
    → DO NOT auto-save

  New pattern:
    → Auto-capture with confidence: 0.75
    → Flag in knowledge-evolution hall.md: "📝 Unreviewed"
    → Append to routing-log.md
```

### Confidence Levels
```
1.0  → Human-curated (always route, highest trust)
0.8  → Outcome-validated (positive signal after fix)
0.75 → Inferred from failure (needs human review — warn user)
< 0.6 → Skip in routing until reviewed
```

**Human override always wins. Auto-captured = advisory only.**

---

## 7. Semantic Routing Upgrade (Optional — Scale Later)

Current routing (Level 0) uses manual intent_patterns. Upgrade when knowledge base grows.

### Level 0: Intent Patterns (Current — Default)
```
Manual intent_patterns in index.json
Deterministic, zero overhead, works for <50 templates
```

### Level 1: BM25 Text Ranking
```
When: > 50 templates OR > 100 lessons
How:
  - Ranks by term frequency + inverse document frequency
  - No model call needed — pure text scoring
  - Add BM25 index file alongside index.json
  - Score formula: BM25(query_terms, template_description)
  
Implementation:
  1. Extract all template/lesson descriptions into corpus
  2. Build BM25 index on session start (cache for session)
  3. Query: "task description" → rank by BM25 score
  4. Fall back to intent_patterns if BM25 score < threshold
```

### Level 2: Vector Embeddings
```
When: > 200 templates/lessons OR Level 1 recall < 70%
How:
  - Semantic similarity handles synonyms, related concepts
  - Requires embedding model call per query
  - Store embeddings in embeddings.json alongside index
  
Trade-off: Higher accuracy, higher cost (model call per routing)
```

### Upgrade Decision
```
Stay at Level 0 until: 50+ templates
Upgrade to Level 1 when: 50–200 templates
Upgrade to Level 2 when: 200+ templates OR user reports poor routing
```

---

## 8. Parallel Analysis (Batch Failure Processing)

When multiple NEGATIVE outcomes accumulate in one session (> 5 failures):

```
Protocol:
  Phase 1 — Read All First
    Load all failure contexts BEFORE writing any lessons
    Extract: root cause, domain, pattern, affected template IDs

  Phase 2 — Find Cross-Failure Patterns
    Group failures by: same root cause, same domain, same template
    Identify: patterns that span multiple failures

  Phase 3 — Consolidate
    Write ONE lesson per cross-cutting pattern (not one per failure)
    Dedup: if two failures have same root cause → one lesson
    Conflict check: do any new lessons contradict existing ones?

  Phase 4 — Write
    Batch write all new lessons
    Set confidence based on frequency: n=1 → 0.75, n=3+ → 0.80
    Flag all auto-captured for human review

Benefit: Prevents 5 near-duplicate lessons from same root cause
```

### Cross-Trace Consensus (Confidence Elevation)
```
If same pattern appears in ≥ 3 traces across DIFFERENT features/domains:
  → Elevate to "cross-cutting concern"
  → Set confidence: 0.9 (higher than single-trace 0.75 or healed 0.8)
  → Tag as reusable across domains
  → Consider adding to common/ category in global knowledge

Example:
  Trace 1 (auth): missing input validation → FAIL
  Trace 2 (payment): missing input validation → FAIL
  Trace 3 (profile): missing input validation → FAIL
  → Cross-cutting: "always validate input at entry point" (confidence: 0.9)
  → Add to common/ not just one domain
```

### 5 Conflict-Free Rules (Trace2Skill)
```
Rule 1: Never write two lessons with the same ID
Rule 2: Never write two lessons with opposite guidance on the same pattern
Rule 3: If conflict detected → write NEITHER, flag both for human review
Rule 4: Cross-trace consensus (≥3 traces agree) → higher confidence than single-trace
Rule 5: Healing-derived lessons (outcome positive after fix) → confidence 0.8, not 0.75
```
