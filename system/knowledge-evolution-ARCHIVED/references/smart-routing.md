# Smart Routing Protocol — Any Domain

Upgrades knowledge discovery from keyword matching to intent-aware, score-weighted routing.  
Works for code, design, writing, decision-making, learning, or any domain.

---

## 1. Intent Pattern Schema (Universal)

Add `intent_patterns` to `{project}/.knowledge/index.json` per domain:

```json
{
  "domains": {
    "domain-name": {
      "keywords": ["key1", "key2"],
      "intent_patterns": [
        "input → process → output",
        "state → action → result"
      ]
    }
  }
}
```

### Domain Examples

**Code (Auth):**
```json
"auth": {
  "keywords": ["login", "token", "session"],
  "intent_patterns": [
    "verify identity → grant access → create session",
    "input credentials → validate → issue token"
  ]
}
```

**Design (Forms):**
```json
"forms": {
  "keywords": ["input", "field", "validation"],
  "intent_patterns": [
    "user enters data → system validates → show feedback",
    "group related fields → improve scanning → reduce errors"
  ]
}
```

**Writing (Persuasion):**
```json
"persuasive": {
  "keywords": ["problem", "solution", "action"],
  "intent_patterns": [
    "establish problem → propose solution → motivate action",
    "hook attention → build credibility → close strongly"
  ]
}
```

**Decision (Analysis):**
```json
"decision": {
  "keywords": ["tradeoff", "option", "criteria"],
  "intent_patterns": [
    "define problem → explore options → evaluate tradeoffs → decide",
    "gather evidence → challenge assumptions → test reasoning → commit"
  ]
}
```

**Intent pattern format:** `{Input} → {Process} → {Output}` — abstract flow independent of implementation or domain jargon.

---

## 2. Domain Matching — Intent + Keywords

Routing sequence (same for all domains):

```
Step 1 — Extract Intent
  "What is the input → process → output of this task?"
  
Step 2 — Intent Match (Semantic)
  Compare against intent_patterns in index.json
  Match = pattern overlap ≥ 2 steps → load domain

Step 3 — Keyword Fallback
  If no intent match → scan keywords array
  → load domain if found

Step 4 — Deep Abstraction
  If no match → abstract verbs, retry intent with abstracted terms
  Example: "verify" = check, validate, ensure
```

---

## 3. Template Selection — Score-Weighted (Any Domain)

When multiple templates match, rank by utility_score:

```
1. Collect all templates matching the domain
2. Sort by utility_score DESC (highest first)
3. Select top match
4. If utility_score < 3.0:
   → Warn: "⚠️ Template '{id}' has low score {score} — review before use"
   → Suggest next best alternative
5. If auto_captured = true AND confidence < 0.8:
   → Note: "📝 Template auto-captured — pending human review"
```

**Example:**
- Code: Select test pattern by proven success rate
- Design: Select layout by approval rate
- Writing: Select opener by engagement rate
- Decision: Select framework by decision quality

---

## 4. Lesson Effectiveness Sorting (Universal)

When loading lessons for a matched domain:

```
1. Load lessons index for matched domain
2. Filter: still_relevant = true only
3. Sort by effectiveness.prevented_failures DESC (most prevented)
   then by effectiveness.applied_count DESC (most used)
4. Display top 3 most effective lessons first
5. Show confidence score for auto-captured lessons (< 1.0)
6. Skip lessons where still_relevant = false (archived)
```

**Rationale:** Lessons preventing most failures = highest value. Applied-only lessons = informational, less critical.

---

## 5. Conflict-Free Routing (Universal)

Before using a template or lesson, check for contradictions:

```
Contradiction detection:
- Two templates for same domain with opposite approaches → flag both
- Lesson says "always X" + another says "never X" → flag, ask human
- Template last_outcome = "failure" (recent, < 7 days) → warn before use
- Lesson confidence < 0.6 → flag as "pending review"
```

Log all routing decisions in `.memory/knowledge-evolution/routing-log.md`.

---

## 6. Setup Checklist

- [ ] Create `{project}/.knowledge/index.json` with intent_patterns
- [ ] Add utility_score fields to template index
- [ ] Define outcome signals for your domain (success/failure)
- [ ] Implement outcome capture hooks in workflow
- [ ] Sort templates by utility_score DESC in routing
- [ ] Sort lessons by prevented_failures DESC
- [ ] Log routing decisions to `.memory/knowledge-evolution/routing-log.md`
- [ ] Read `references/domain-adaptation-guide.md` for your specific domain
