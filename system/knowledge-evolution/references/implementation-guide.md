# Implementation Guide Concept

A phased approach for integrating knowledge-evolution into any system.
Each phase is independently useful — stop at any phase and the system still benefits.

Adapted from: `system/knowledge-evolution` integration plan (Memento-Skills concepts)

---

## Before Starting

Identify your system's equivalents for these concepts:

| Concept | Your System's Equivalent |
|---------|--------------------------|
| `{knowledge_store}` | Where templates/lessons/rules live (json, markdown, db, etc.) |
| `{index_file}` | The catalog/index that lists available knowledge items |
| `{execution_trigger}` | When execution happens (test run, build, deploy, save) |
| `{score_field}` | What you'll call the quality signal (utility_score, rank, weight) |
| `{lesson_store}` | Where lessons learned are kept |
| `{routing_logic}` | How the system currently finds the right knowledge item |
| `{memory_layer}` | Where cross-session state is tracked (Memory Palace, db, file) |

---

## Phase A — Foundation: Add Quality Signals

**Goal:** Add measurable fields to existing knowledge items. No behavior changes yet.
Safe to do immediately — existing consumers still work.

### A1. Add scoring fields to {knowledge_store} items

For each item in `{index_file}`:

```
// Add to each knowledge item:
{score_field}: {neutral_default}    // e.g., 5.0 on a 0–10 scale
usage_count: 0
last_used: null
last_failure: null                  // or last_error, last_degraded
auto_captured: false                // true = AI-generated, needs review
```

Choose defaults that are neutral — don't bias routing before any data exists.

### A2. Add effectiveness fields to {lesson_store} items

For each lesson in `{lesson_store}`:

```
// Add to each lesson:
effectiveness:
  applied_count: 0
  prevented_failures: 0
  still_relevant: true
  confidence: 1.0                   // 1.0 = human-curated, <1.0 = auto-captured
auto_captured: false
```

### A3. Add intent patterns to {routing_logic}

Alongside existing keyword/tag matching, add abstract flow patterns:

```
// For each {domain} or {category}:
intent_patterns: [
  "{Input} → {Process} → {Output}",   // abstract flow description
  ...
]
```

Pattern format: describe the abstract flow, not the implementation.
Match when the task's flow overlaps ≥2 steps with a pattern.

### A4. Update {execution_trigger} to capture signals

After each execution event, record the outcome:
- Success → increment `{score_field}`, update `last_used`
- Failure caused by this item → decrement `{score_field}`, set `last_failure`
- New pattern discovered → auto-capture to `{lesson_store}` with `confidence: 0.75`

### A5. Update save/capture protocol

When saving new knowledge items, add:
1. Conflict check — same id exists? → same content: skip, different: `-v2`, contradicting: flag
2. Set `auto_captured: true` if AI-generated
3. Set `confidence` based on source (human = 1.0, healed = 0.8, inferred = 0.75)

---

## Phase B — Activate: Use Signals in Workflow

**Goal:** Make existing workflows score-aware. Requires Phase A complete.

### B1. Update {execution_trigger} post-processing

After execution completes:
```
If SUCCESS:
  → {score_field} += {increment}    // e.g., +0.5
  → usage_count += 1
  → last_used = today
  → Extract new patterns → check for duplicates → auto-capture if new

If FAILURE:
  → {score_field} -= {penalty}      // e.g., -1.0
  → last_failure = today
  → Analyze root cause → check if pattern exists in {lesson_store}
  → If new pattern → auto-capture lesson (confidence: 0.75)
```

### B2. Update {routing_logic} to prefer proven items

When selecting from multiple matching items:
```
1. Filter: still_relevant = true (or equivalent)
2. Sort: {score_field} DESC
3. Select top match
4. If top match {score_field} < {warn_threshold}:
   → Warn: "This item has a low score — review before using"
5. If auto_captured = true AND confidence < 0.6:
   → Note: "Auto-captured — not yet verified"
```

### B3. Update task design / planning step

When reading lessons before starting work:
```
1. Load {lesson_store} for relevant {domain}
2. Filter: still_relevant = true
3. Sort: effectiveness.prevented_failures DESC, then applied_count DESC
4. Surface top 3 most effective lessons first
5. Skip lessons where still_relevant = false
```

### B4. Update knowledge sync step

At the end of any knowledge-writing operation:
```
If {memory_layer} is active:
  → Read score changes from {memory_layer}
  → Apply to {index_file}
  → Log sync completion
```

---

## Phase C — Memory: Cross-Session Tracking

**Goal:** Track knowledge quality across sessions. Requires Phase B complete.

### C1. Create knowledge tracking structure in {memory_layer}

```
{memory_layer}/knowledge-evolution/
├── index                    ← summary: top items, flags, gaps
├── template-health          ← score trends per {category}
├── lesson-effectiveness     ← which lessons prevented failures
├── gap-tracker              ← {domains} with missing knowledge
└── routing-log              ← routing decisions this session
```

### C2. Session Start protocol

```
1. Load knowledge-evolution index from {memory_layer} (if exists)
2. Brief context:
   "Top item: {id} score={score}, Top lesson: {id} prevented={n}x
    Flagged: {low_score_items}. Gaps: {missing_domains}"
3. Load routing-log to avoid re-routing same decisions
```

### C3. Session End protocol

```
1. Update template-health with score changes this session
2. Update lesson-effectiveness with lessons applied
3. Update gap-tracker if new gaps discovered
4. Append to routing-log: "{date}: Used {id} (score: {before}→{after})"
5. If any section >80 lines → compress to AAAK summary
6. Sync back to {index_file} (source of truth)
```

### C4. Write-back sync

```
Memory layer = tracking buffer (session-scoped)
{index_file} = source of truth (persistent)

At session end:
  → Read score changes from memory layer
  → Apply to {index_file}
  → Confirm sync → log completion
```

---

## Phase D — Automate: Hooks

**Goal:** Remove manual trigger points. Requires Phase C complete.

### D1. Post-execution hook

Trigger: after `{execution_trigger}` completes
Action: check result → update `{score_field}` and `last_used`/`last_failure` in `{index_file}`

### D2. Session-end sync hook

Trigger: on session/agent stop
Action: if knowledge was used this session → update `{memory_layer}` → sync to `{index_file}`

Hook implementation depends on your system's hook mechanism.
For Kiro hooks: see `system/hook-creator` skill.

---

## Score Thresholds (adapt to your scale)

| Score | Status | Action |
|-------|--------|--------|
| ≥ 70% of max | Proven | Prefer first in routing |
| 30–70% of max | Active | Normal use |
| < 30% of max | Flagged | Warn before use |
| 0 | Deprecated | Skip unless explicitly requested |

Default scale: 0–10. Adjust thresholds to match your domain's signal density.

---

## What This Pattern Does NOT Require

- ❌ No vector database or semantic search engine
- ❌ No runtime process or background service
- ❌ No changes to existing knowledge item format (fields are additive)
- ❌ No specific programming language or framework
- ❌ No Memento-Skills code — concepts only

---

## Concepts Sourced From

| Concept | Source |
|---------|--------|
| Utility scoring + Pareto selection | EvoSkill (arXiv:2603.02766), OpenSpace |
| Auto-capture from failures | EvoSkill, ACE (arXiv:2510.04618) |
| Conflict-free consolidation | Trace2Skill (arXiv:2603.25158) |
| Verifier-backed promotion | ASG-SI (arXiv:2512.23760) |
| Living Skillbook → context injection | ACE (Agentic Context Engineering) |
| Closed loop Read→Execute→Reflect→Write | Memento-Skills (arXiv:2603.18743) |
