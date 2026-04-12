# Utility Scoring Protocol

Adds measurable quality signals to templates and lessons so the system knows what works.

---

## 1. Template Index Schema

Add these fields to every `automation/*/Index.json`:

```json
{
  "templates": {
    "{category}": [{
      "id": "templateId",
      "path": "template.file",
      "utility_score": 5.0,
      "usage_count": 0,
      "last_used": null,
      "last_failure": null,
      "auto_captured": false
    }]
  }
}
```

**Field rules:**
- `utility_score` — float 0–10, default 5.0 for existing templates
- `usage_count` — increment on every successful use
- `last_used` — ISO date string, update on every use
- `last_failure` — ISO date string or null, set when template causes test failure
- `auto_captured` — true if AI created this template (needs human review)

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

## 3. Score Update Protocol

### After test PASS (Phase 3.2 success)
```
template.utility_score += 0.5   (max 10.0)
template.usage_count += 1
template.last_used = today
```

### After test FAIL caused by template
```
template.utility_score -= 1.0   (min 0.0)
template.last_failure = today
```

### After lesson applied and failure prevented
```
lesson.effectiveness.applied_count += 1
lesson.effectiveness.prevented_failures += 1
```

### After lesson applied (no failure to prevent)
```
lesson.effectiveness.applied_count += 1
```

---

## 4. Score Thresholds

| Score | Status | Action |
|-------|--------|--------|
| ≥ 7.0 | Proven | Prefer first in routing |
| 3.0–6.9 | Active | Normal use |
| < 3.0 | Flagged | Warn user: "template มีปัญหาบ่อย — review ก่อนใช้" |
| 0.0 | Deprecated | Skip unless explicitly requested |

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
