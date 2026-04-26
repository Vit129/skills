# Adaptation — Domain Setup, Signal Mapping, Implementation Phases

Everything about adapting the Agent Memory System to YOUR specific domain.

---

## Core Concept

The system is domain-agnostic at the framework level.
You provide the domain-specific layer: signals, templates, lessons, intent patterns.

```
Framework (fixed):        Your Domain Layer (you define):
  - session workflow    ←  - what counts as POSITIVE/NEGATIVE signal
  - storage hierarchy   ←  - what topics become wings/rooms
  - scoring system      ←  - what templates are worth tracking
  - routing engine      ←  - what intent patterns match your work
```

---

## Step 1: Define Your Outcome Signals

**Rule:** Use domain-native terminology, NOT generic SUCCESS/FAILURE.

```
Domain           | POSITIVE Signal  | NEGATIVE Signal  | Trigger Point
-----------------|-----------------|-----------------|------------------
Code             | PASS            | FAIL            | After test run
Design (UI/UX)   | APPROVE         | REJECT          | After stakeholder review
Writing/Content  | ACCEPT          | REVISE          | After editor feedback
Decision/Strategy| POSITIVE        | NEGATIVE        | After outcome visible
Learning/Study   | MASTERED        | GAP             | After quiz/assessment
Research         | VALIDATED       | DISPROVEN       | After experiment
Product/Feature  | SHIPPED         | ROLLED_BACK     | After deployment
Collaboration    | ALIGNED         | MISALIGNED      | After team sync
```

---

## Step 2: Map Template and Lesson to Your Domain

**Template** = a reusable approach (how you do something)
**Lesson** = a pattern learned from an outcome (what you discovered)

### By Domain

**Code:**
- Template: error handler pattern, auth flow, query structure, API contract
- Lesson: "validate input before processing", "always add timeout to HTTP calls"

**Design (UI/UX):**
- Template: form layout, modal pattern, nav structure, component state
- Lesson: "group related fields reduces errors", "avoid >4 colors per screen"

**Writing:**
- Template: blog outline, email opener structure, technical doc skeleton
- Lesson: "lead with problem not solution", "short sentences scan better"

**Decision/Strategy:**
- Template: pros-cons framework, RICE scoring, 6-hats, evaluation criteria
- Lesson: "consider second-order effects", "separate reversible from irreversible"

**Learning:**
- Template: spaced repetition schedule, feynman technique, active recall drill
- Lesson: "active recall beats re-reading", "teach it to learn it faster"

---

## Step 3: Write Intent Patterns for Your Domain

Format: `"{Input} → {Process} → {Output}"`

Describes abstract flow, NOT implementation details.

### Templates by Domain

**Code:**
```json
"errorHandling": {
  "keywords": ["error", "exception", "catch", "retry", "throw"],
  "intent_patterns": [
    "detect error → classify type → respond appropriately",
    "catch exception → log context → retry or fail gracefully",
    "validate input → reject early → prevent downstream errors"
  ]
},
"auth": {
  "keywords": ["login", "token", "session", "oauth", "jwt"],
  "intent_patterns": [
    "receive credentials → validate identity → issue session",
    "verify token → check expiry → grant or refresh"
  ]
}
```

**Design:**
```json
"formDesign": {
  "keywords": ["form", "input", "field", "submit", "validation"],
  "intent_patterns": [
    "user enters data → validate → show inline feedback",
    "group related fields → improve scanning → reduce errors"
  ]
},
"navigationDesign": {
  "keywords": ["menu", "nav", "breadcrumb", "tab", "sidebar"],
  "intent_patterns": [
    "user wants action → clear path → execute → confirm",
    "current location → context → available next steps"
  ]
}
```

**Writing:**
```json
"persuasive": {
  "keywords": ["pitch", "email", "proposal", "convince"],
  "intent_patterns": [
    "establish problem → propose solution → motivate action",
    "hook attention → build credibility → clear call to action"
  ]
},
"technical": {
  "keywords": ["readme", "spec", "guide", "doc"],
  "intent_patterns": [
    "explain what → show why → demonstrate how → troubleshoot",
    "define scope → list prerequisites → step by step → verify"
  ]
}
```

**Decision:**
```json
"strategicDecision": {
  "keywords": ["decide", "option", "tradeoff", "strategy", "criteria"],
  "intent_patterns": [
    "define problem → explore options → evaluate tradeoffs → decide",
    "gather evidence → challenge assumptions → check reasoning → commit"
  ]
},
"prioritization": {
  "keywords": ["priority", "backlog", "effort", "value", "score"],
  "intent_patterns": [
    "list candidates → score value + effort → sort → select top",
    "define criteria → weight factors → evaluate → rank"
  ]
}
```

**Learning:**
```json
"conceptLearning": {
  "keywords": ["concept", "theory", "understand", "study"],
  "intent_patterns": [
    "read concept → connect to known → generate example → verify",
    "encounter confusion → identify gap → seek explanation → re-test"
  ]
},
"retention": {
  "keywords": ["remember", "recall", "memory", "retention", "spaced"],
  "intent_patterns": [
    "learn → wait interval → recall → correct → extend interval",
    "encode clearly → review before forgetting → space repetitions"
  ]
}
```

---

## Global Knowledge Structure (Cross-Project)

```
{project_root}/agent-memory/knowledge/   ← per-project, single source of truth
├── index.md                              ← knowledge catalog (Markdown table)
├── evolution.md                          ← score/status change log
├── {article}.md                          ← knowledge articles with YAML frontmatter
└── lessons/
    └── {domain}/
        ├── index.md                      ← domain lesson table
        └── {lesson-id}.md               ← lesson detail files
```

Per-Project Knowledge:
```
{project_root}/agent-memory/knowledge/
├── index.md                              ← project catalog (Markdown table)
├── evolution.md                          ← evolution log
├── {article}.md                          ← knowledge articles
└── lessons/
    └── {domain}/
        ├── index.md                      ← domain lesson index
        └── {lesson-id}.md               ← lesson details
```

**Knowledge location:** `{project_root}/agent-memory/knowledge/` (per-project, single source of truth)
`skills/` contains only execution logic (SKILL.md + references/) — not knowledge data.

---

## Placeholder Mapping (Adapt Concepts to Your System)

| Concept | Default Value | Your System's Equivalent |
|---------|--------------|--------------------------|
| `{knowledge_store}` | `{project_root}/agent-memory/knowledge/` | |
| `{index_file}` | `index.md` (Markdown table) | |
| `{execution_trigger}` | test run, review, publish, decision | |
| `{score_field}` | `utility_score` (0–10 scale) | |
| `{lesson_store}` | `lessons/` under knowledge | |
| `{routing_logic}` | project first → global fallback | |
| `{memory_layer}` | `{project_root}/agent-memory/palace/` | |
| `{positive_signal}` | PASS / APPROVE / ACCEPT / POSITIVE | |
| `{negative_signal}` | FAIL / REJECT / REVISE / NEGATIVE | |

Fill in "Your System's Equivalent" when adapting to a new domain or project.

---

## Step 4: Create knowledge/index.md

Create `agent-memory/knowledge/index.md` following the schema in `references/storage.md`:

```markdown
# Knowledge Index

Updated: YYYY-MM-DD

## Articles
| ID | Type | Scope | Status | Score | Updated | Path | Keywords |
|----|------|-------|--------|-------|---------|------|----------|

## Lessons
| ID | Domain | Type | Status | Applied | Prevented | Updated | Path |
|----|--------|------|--------|---------|-----------|---------|------|

## Gaps
| Domain | Gap | First Seen | Status | Notes |
|--------|-----|------------|--------|-------|
```

Create `agent-memory/knowledge/evolution.md`:

```markdown
# Knowledge Evolution

Updated: YYYY-MM-DD

## Change Log
| Date | ID | Change | Signal | Before | After | Evidence |
|------|----|--------|--------|--------|-------|----------|
```

Create domain lesson indexes as needed at `agent-memory/knowledge/lessons/{domain}/index.md`:

```markdown
# {Domain} Lessons

Updated: YYYY-MM-DD

| ID | Type | Status | Applied | Prevented | Confidence | Summary | Detail |
|----|------|--------|---------|-----------|------------|---------|--------|
```

---

## Step 5: Set Up Outcome Capture Hooks (In Your Workflow)

Add signal capture at the natural end of each execution:

**Code:**
```
After test run:
  if tests PASS → note: "template X: PASS"
  if tests FAIL → note: "template X: FAIL, root cause: {pattern}"
```

**Design:**
```
After stakeholder review:
  if APPROVED → note: "pattern X: APPROVE"
  if REJECTED → note: "pattern X: REJECT, feedback: {reason}"
```

**Writing:**
```
After editor review:
  if ACCEPTED → note: "structure X: ACCEPT"
  if REVISED → note: "structure X: REVISE, reason: {feedback}"
```

**Decision:**
```
After outcome visible:
  if POSITIVE → note: "framework X: POSITIVE"
  if NEGATIVE → note: "framework X: NEGATIVE, consequence: {what happened}"
```

---

## Implementation Phases (A → D)

### Phase A: Storage Only (Start Here)
```
Effort: 30 minutes
Goal: Memory Palace working

□ Create agent-memory/palace/state.md (empty template)
□ Run first "load memory" → palace initialized
□ Work normally, note important decisions
□ Run "save session + learn" at end → first rooms created
□ Verify: agent-memory/palace/wings/{topic}/rooms/ has files

No knowledge tracking yet. Just memory.
```

### Phase B: Scoring Live (Add Intelligence)
```
Effort: 1 hour
Goal: Template scoring working

□ Create agent-memory/knowledge/index.md with 3–5 articles
□ Create agent-memory/knowledge/evolution.md
□ Write intent_patterns for your top 2 domains
□ Start tracking outcomes in session (PASS/FAIL etc.)
□ At session end: update knowledge/index.md scores
□ Append changes to knowledge/evolution.md (verify match)

Outcome: Articles start accumulating scores.
```

### Phase C: Cross-Session Learning (Full Loop)
```
Effort: 2–3 sessions
Goal: System learns from history

□ 3+ sessions completed with scoring
□ Check: knowledge/evolution.md has meaningful change log entries
□ Verify: top article scores drifting up from baseline 5.0
□ Check: at least 1 lesson captured from a negative outcome
□ Test routing: "use template for {intent}" → correct article selected

Outcome: System actively prefers proven approaches.
```

### Phase D: Automation (Optional — Later)
```
Effort: variable (depends on hooks setup)
Goal: Reduce manual trigger burden

□ Auto-consolidation trigger configured
□ Session start summary briefed automatically
□ Outcome capture semi-automated (pattern recognition)

Note: Hooks are expensive (tokens). Only add when friction is genuinely painful.
Recommendation: Stay at Phase C for most use cases.
```

---

## Quick-Start Checklist (New Domain)

```
□ Define domain-specific signal names (PASS/FAIL, APPROVE/REJECT, etc.)
□ List 5 templates you reuse most (any format)
□ List 3 lessons you've already learned from experience
□ Create knowledge/index.md from template above (Step 4)
□ Create knowledge/evolution.md
□ Write intent_patterns for your 2 most common task types
□ Create agent-memory/palace/state.md (empty)
□ Run Phase A (30 min)
□ Run Phase B (1 hour)
□ Do 3 real sessions → evaluate Phase C readiness
```
