# Domain Adaptation Guide — Knowledge Evolution for Any Domain

Universal pattern for Knowledge Evolution across any domain: code, design, writing, research, decision-making, learning.

---

## Core: Outcome Signals (Domain-Independent)

Replace **"test PASS/FAIL"** with your domain's natural **SUCCESS/FAILURE** outcomes.

| Domain | SUCCESS | FAILURE | Capture When |
|--------|---------|---------|--------------|
| **Code** | Test passes | Test fails | After test run |
| **Design** | Design approved | Design rejected | After stakeholder review |
| **Writing** | Draft accepted | Draft needs revision | After editor feedback |
| **Decision** | Positive outcome | Negative consequence | After results visible |
| **Learning** | Concept mastered | Knowledge gap found | After quiz/assessment |
| **Research** | Hypothesis validated | Hypothesis disproven | After experiment |

---

## Step 1: Define Template & Lesson for Your Domain

**Template** = reusable approach (code pattern, design pattern, writing technique, decision framework)  
**Lesson** = pattern learned from outcome (what worked, what failed)

### Domain Examples

**Code:** Template = error handler pattern → Lesson = "always validate before processing"  
**Design:** Template = form layout → Lesson = "group related fields reduces errors"  
**Writing:** Template = persuasive opener → Lesson = "lead with problem, not solution"  
**Decision:** Template = evaluation criteria → Lesson = "consider second-order effects"  
**Learning:** Template = study method → Lesson = "spaced repetition beats cramming"

---

## Step 2: Update Index Schema (Outcome-Based)

All domains use same scoring fields:

```json
{
  "templates": {
    "{category}": [{
      "id": "templateId",
      "utility_score": 5.0,
      "usage_count": 0,
      "last_used": null,
      "outcome_success_count": 0,
      "outcome_failure_count": 0,
      "auto_captured": false
    }]
  }
}
```

**Scoring rule (universal):**
- SUCCESS outcome → `utility_score += 0.5` (max 10.0)
- FAILURE outcome → `utility_score -= 1.0` (min 0.0)
- Thresholds: ≥7.0 (Proven), 3.0–6.9 (Active), <3.0 (Flagged), 0.0 (Deprecated)

---

## Step 3: Define Intent Patterns for Your Domain

Format: `{Input} → {Process} → {Output}`

```json
{
  "domains": {
    "auth": {
      "intent_patterns": [
        "user submits credentials → system validates → session created",
        "refresh token required → validate expiry → issue new token"
      ]
    },
    "formDesign": {
      "intent_patterns": [
        "user enters data → validate format → show feedback",
        "group related fields → improve scanning → reduce errors"
      ]
    },
    "persuasiveWriting": {
      "intent_patterns": [
        "establish problem → propose solution → motivate action",
        "hook attention → build credibility → close strongly"
      ]
    },
    "decision": {
      "intent_patterns": [
        "define problem → explore options → evaluate tradeoffs → decide",
        "gather evidence → challenge assumptions → check reasoning → commit"
      ]
    }
  }
}
```

---

## Step 4: Set Up Outcome Capture Hooks

Add signals to your natural workflow:

### Code Workflow
```
After test run:
  if test PASSED → signal(outcome=success, template_id, domain)
  if test FAILED → signal(outcome=failure, template_id, domain, root_cause)
```

### Design Workflow
```
After stakeholder review:
  if APPROVED → signal(outcome=success, design_pattern_id)
  if REJECTED → signal(outcome=failure, design_pattern_id, feedback)
```

### Writing Workflow
```
After editor review:
  if ACCEPTED → signal(outcome=success, writing_pattern_id)
  if NEEDS_REVISION → signal(outcome=failure, writing_pattern_id, feedback)
```

### Decision Workflow
```
After decision results:
  if POSITIVE_OUTCOME → signal(outcome=success, decision_framework_id)
  if NEGATIVE_OUTCOME → signal(outcome=failure, decision_framework_id, consequence)
```

---

## Step 5: Create Domain Index

Create `{project}/.knowledge/index.json`:

```json
{
  "domain": "your-domain",
  "templates_path": "./templates/",
  "lessons_path": "./lessons/",
  "scoring": {
    "success_boost": 0.5,
    "failure_penalty": 1.0,
    "threshold_proven": 7.0,
    "threshold_flagged": 3.0
  },
  "domains": {
    "category-1": {
      "intent_patterns": [
        "input → process → output"
      ]
    }
  }
}
```

---

## Implementation Checklist

- [ ] Define SUCCESS/FAILURE signals for your domain (Step 1)
- [ ] Map domain concepts to Template/Lesson (Step 1)
- [ ] Create `.knowledge/index.json` (Step 5)
- [ ] Add outcome capture hooks to workflow (Step 4)
- [ ] Read `references/utility-scoring.md` (outcome-based)
- [ ] Read `references/smart-routing.md` (intent-based)
- [ ] Track consolidation in `.memory/knowledge-evolution/hall.md`

Done — Knowledge Evolution now works for your domain ✅
