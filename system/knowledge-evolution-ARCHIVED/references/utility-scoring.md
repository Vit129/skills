# Utility Scoring Protocol — Any Domain

Adds measurable quality signals to templates and lessons. Works for any domain: code, design, writing, decision-making, learning, etc.

---

## 1. Template Index Schema (Universal)

Add these fields to `{project}/.knowledge/` or `~/.claude/skills/ai-dlc/knowledge/`:

```json
{
  "templates": {
    "{category}": [{
      "id": "templateId",
      "path": "template.file",
      "utility_score": 5.0,
      "usage_count": 0,
      "last_used": null,
      "outcome_success_count": 0,
      "outcome_failure_count": 0,
      "last_outcome": null,
      "auto_captured": false
    }]
  }
}
```

**Field rules (domain-independent):**
- `utility_score` — float 0–10, default 5.0 for new templates
- `usage_count` — increment on every use (success or failure)
- `last_used` — ISO date string, update on every use
- `outcome_success_count` — increment on SUCCESS outcome
- `outcome_failure_count` — increment on FAILURE outcome
- `last_outcome` — "success" | "failure" | null
- `auto_captured` — true if AI created (needs human review)

---

## 2. Lesson Index Schema

Add these fields to every `lessons/*/Index.json`:

```json
{
  "lessons": [{
    "id": "LESSON-XXX-001",
    "effectiveness": {
      "applied_count": 0,
      "prevented_failures": 0,
      "still_relevant": true,
      "confidence": 1.0
    },
    "auto_captured": false
  }]
}
```

**Field rules:**
- `applied_count` — how many times this lesson was read and applied
- `prevented_failures` — increment when applying this lesson avoided a known failure
- `still_relevant` — set false to soft-delete (skip in routing, keep for audit)
- `confidence` — 1.0 for human-curated, 0.6–0.9 for auto-captured (needs review)
- `auto_captured` — true if AI created this lesson from failure analysis

---

## 3. Score Update Protocol (Domain-Agnostic)

### After SUCCESS outcome
```
template.utility_score += 0.5     (max 10.0)
template.usage_count += 1
template.last_used = today
template.last_outcome = "success"
template.outcome_success_count += 1
```

Examples: test passes, design approved, draft accepted, decision succeeds, learning validated

### After FAILURE outcome
```
template.utility_score -= 1.0     (min 0.0)
template.usage_count += 1
template.last_used = today
template.last_outcome = "failure"
template.outcome_failure_count += 1
```

Examples: test fails, design rejected, draft needs revision, decision backfires, misconception found

### After lesson applied and prevented failure
```
lesson.effectiveness.applied_count += 1
lesson.effectiveness.prevented_failures += 1
```

### After lesson applied (no prevention)
```
lesson.effectiveness.applied_count += 1
```

---

## 4. Score Thresholds (Universal)

| Score | Status | Action |
|-------|--------|--------|
| ≥ 7.0 | Proven | Prefer first in routing, reliable |
| 3.0–6.9 | Active | Normal use, balanced |
| < 3.0 | Flagged | ⚠️ Warn user before use, needs review |
| 0.0 | Deprecated | Skip unless explicitly requested |

### Threshold Customization (Optional)

Adjust per domain in `{project}/.knowledge/index.json`:

```json
{
  "scoring": {
    "threshold_proven": 7.0,
    "threshold_flagged": 3.0,
    "threshold_deprecated": 0.0,
    "success_boost": 0.5,
    "failure_penalty": 1.0
  }
}
```

---

## 5. Auto-Capture Protocol

When a test fails and root cause is a new pattern (not in lessons):

1. AI analyzes failure → extracts root cause
2. Check existing lessons for duplicates (match by keywords + domain)
3. If no duplicate → create new lesson entry with:
   - `"auto_captured": true`
   - `"confidence": 0.75`
   - `"still_relevant": true`
4. Add to appropriate lessons index
5. Flag in Memory Palace: "⚠️ Auto-captured lesson — needs human review"

When a test passes after healing:
1. Extract healing strategy
2. Save as lesson with `"confidence": 0.8`
3. Link to original failure lesson if exists

**Admission control:** Auto-captured lessons are used in routing only if `confidence ≥ 0.6`.
Human-reviewed lessons (`auto_captured: false`) always take priority.

---

## 6. Conflict Detection

Before saving a new lesson or template:

1. Load existing index
2. Check for entries with same `id` prefix + domain
3. If duplicate found:
   - Same content → increment `applied_count`, skip save
   - Different content → create new entry with suffix `-v2`, keep both
   - Contradicting content → flag for human review, do not auto-save
4. Log decision in Memory Palace `knowledge-evolution` wing

---

## 7. Files to Modify

| File | Change |
|------|--------|
| `knowledge/automation/api/apiIndex.json` | Add utility fields to all template entries |
| `knowledge/automation/webUi/webUiIndex.json` | Add utility fields to all template entries |
| `knowledge/automation/mobile/mobileIndex.json` | Add utility fields to all template entries |
| `knowledge/lessons/api/apiLessonsIndex.json` | Add effectiveness fields to all lesson entries |
| `knowledge/lessons/webUi/webUiLessonsIndex.json` | Add effectiveness fields to all lesson entries |
| `knowledge/lessons/mobile/mobileLessonsIndex.json` | Add effectiveness fields to all lesson entries |
| `dev/storage/references/automation-save.md` | Add auto-capture + score update steps |
| `core/aidlc/references/knowledge-buffer.md` | Add Reflect → auto-evolve protocol |
