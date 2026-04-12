# AI-DLC Full Upgrade Plan
# Knowledge Evolution Integration

วันที่: 2026-04-12 (revised)
สถานะ: Ready to Execute — all tasks reset to TODO

Reference: `system/knowledge-evolution/KNOWLEDGE_EVOLUTION_README.md`

---

## Current State (verified 2026-04-12)

All index files are at original state — no utility/effectiveness fields exist yet.
All workflow files are unmodified.
memory-palace scaling-protocol now has Auto-Consolidation section ✅

---

## Phase A — Foundation: Add Quality Signals
**Goal:** Add fields only. No behavior change. Safe to do immediately.

### A1. automation/api/apiIndex.json ❌ TODO
Add to each template entry:
```json
"utility_score": 5.0,
"usage_count": 0,
"last_used": null,
"last_failure": null,
"auto_captured": false
```
Templates: apiauth, apifile, apivalidation, apiutils

### A2. automation/webUi/webUiIndex.json ❌ TODO
Same fields as A1.
Templates: webUiAuth, webUiDialog, webUiFile, webUiForm, webUiNavigation, webUiTable, webUiCard, webUiDrawer, webUiAppLauncher

### A3. automation/mobile/mobileIndex.json ❌ TODO
Same fields as A1.
Templates: mobileAppLaunch, mobileAuth, mobileGestures, mobilePermissions, mobileDeepLink, mobileApiSetup, mobileBiometrics

### A4. lessons/api/* — all lesson json files ❌ TODO
Add to each lesson entry:
```json
"effectiveness": {
  "applied_count": 0,
  "prevented_failures": 0,
  "still_relevant": true,
  "confidence": 1.0
},
"auto_captured": false
```
Files: apiLesAuth, apiLesData, apiLesFile, apiLesMockStrategy, apiLesNetwork, apiLesSetup, apiLesValidation

### A5. lessons/webUi/* — all lesson json files ❌ TODO
Same fields as A4.
Files: webUiLesFile, webUiLesLocator, webUiLesLocators, webUiLesTiming, webUiLesVisibility

### A6. lessons/mobile/mobileLessonsIndex.json ❌ TODO
Add to each lesson entry in `lessons` array:
```json
"effectiveness": {
  "applied_count": 0,
  "prevented_failures": 0,
  "still_relevant": true,
  "confidence": 1.0
},
"auto_captured": false
```
Entries: L-MOB-001, L-MOB-002, L-MOB-003, L-MOB-004

### A7. business/businessIndex.json ❌ TODO
Add `intent_patterns` alongside existing `keywords` per domain:
```json
"auth": {
  "keywords": [...existing...],
  "intent_patterns": [
    "verify identity → grant access",
    "input credentials → validate → create session",
    "revoke access → destroy session"
  ]
},
"common": {
  "keywords": [...existing...],
  "intent_patterns": [
    "input query → filter results → display list",
    "select item → validate → confirm action"
  ]
},
"document": {
  "keywords": [...existing...],
  "intent_patterns": [
    "select file → validate format → upload → confirm",
    "request document → fetch → render → download"
  ]
},
"finance": {
  "keywords": [...existing...],
  "intent_patterns": [
    "calculate amount → validate → process transaction",
    "generate document → apply rules → produce output"
  ]
}
```

---

## Phase B — Activate: Update Workflow Files
**Goal:** Make workflows score-aware. Requires Phase A complete.

### B1. dev/storage/references/automation-save.md ❌ TODO
Add after existing save steps:

```markdown
## Score Update (after saving lesson)

After saving lesson, update score in index file:
- Test PASS → template.utility_score += 0.5, usage_count += 1, last_used = today
- Test FAIL → template.utility_score -= 1.0, last_failure = today
- New auto-captured lesson → confidence: 0.75, auto_captured: true

Conflict check before save:
1. Load existing index
2. Same id + same content → skip (increment applied_count)
3. Same id + different content → create -v2 entry
4. Contradicting → flag for human review, do NOT save
5. Log: "✅ Knowledge updated: {id} score {before}→{after}"
```

Also update Lesson Schema to include effectiveness fields.

### B2. core/aidlc/references/knowledge-buffer.md ❌ TODO
Add Post-Execution Reflect section after Phase 3.2:

```markdown
### Post-Execution Reflect (Phase 3.2)

After test execution completes:
1. PASS → update template utility_score (+0.5), usage_count (+1), last_used = today
2. FAIL → update template utility_score (-1.0), last_failure = today
3. Extract failure pattern → check for duplicate in lessons/
4. New pattern → auto-capture lesson (confidence: 0.75, auto_captured: true)
5. Log: "✅ Knowledge Buffer updated"
```

Add enhanced Reuse Check at Phase 1.2:

```markdown
### Reuse Check (Phase 1.2 — score-aware)

1. Scan lessons/ for relevant domain
2. Filter: still_relevant = true
3. Sort: effectiveness.prevented_failures DESC, then applied_count DESC
4. Surface top 3 most effective lessons
5. Report: "📚 Top lessons: {lesson_id} (prevented {n}x failures)"
```

### B3. core/aidlc/references/qa-task-design.md ❌ TODO
Update Process Step 2 "Read Lessons Learnt":

```markdown
2. Read Lessons Learnt (score-aware):
   - Load {knowledge_root}/lessons/{platform}/ index
   - Filter: still_relevant = true
   - Sort: effectiveness.prevented_failures DESC, then applied_count DESC
   - Surface top 3 most effective lessons first
   - Note confidence for auto_captured lessons
   - Skip lessons where still_relevant = false
```

### B4. core/aidlc/references/dev-task-design.md ❌ TODO
Same update as B3 for Step 2.

### B5. core/analysis-skills/references/discovery-domain.md ❌ TODO
Update Phase 4 — add intent matching before keyword fallback:

```markdown
### Phase 4.0 (NEW): Extract Intent
"What is the Input → Process → Output of this feature?"

### Phase 4.1 (NEW): Intent Match
Compare extracted intent against intent_patterns in businessIndex.json
Match = pattern overlap ≥ 2 steps → load domain, proceed to Phase 5
If no match → continue to Phase 4.2 (keyword, original behavior)
```

Update Phase 5 — add utility-weighted selection:

```markdown
### Phase 5 (updated): Utility-Weighted Selection
When multiple templates match:
1. Sort by utility_score DESC
2. Select top match
3. If top score < 3.0 → warn: "⚠️ Template มีปัญหาบ่อย — review ก่อนใช้"
4. If auto_captured = true AND confidence < 0.8 → note: "📝 Auto-captured — ยังไม่ verified"
```

### B6. dev/storage/references/buffer-update.md ❌ TODO
Add at end of process:

```markdown
## Score Sync (final step)

If Memory Palace knowledge-evolution wing exists:
→ Read template-health.md and lesson-effectiveness.md
→ Apply score changes to index files
→ Log: "✅ Score sync complete"
```

---

## Phase C — Memory: Connect Memory Palace
**Goal:** Cross-session tracking. Requires Phase B complete.

### C1. Create knowledge-evolution wing template ❌ TODO
Template structure (from `system/knowledge-evolution/references/memory-integration.md` §1-2):
```
.memory/wings/knowledge-evolution/
├── hall.md
├── rooms/
│   ├── template-health.md
│   ├── lesson-effectiveness.md
│   ├── gap-tracker.md
│   └── routing-log.md
└── closets/
    └── knowledge-state.md
```

### C2. core/memory-palace/SKILL.md ❌ TODO
Add Knowledge Tracking section:
```markdown
## Knowledge Tracking

On session start:
- Load knowledge-evolution/hall.md if exists
- Brief: top template score, top lesson effectiveness, flags, gaps

On session end:
- Update knowledge-evolution wing with score changes
- Sync back to index files
- Tunnel: knowledge-evolution ↔ active project wing
```

### C3. system/memory-palace/references/scaling-protocol.md ✅ DONE
Auto-Consolidation section added (default=auto, 7 steps, human verify).

---

## Phase D — Automate: Hooks
**Goal:** No manual triggers. Requires Phase C complete.

### D1. Hook: post-test score update ❌ TODO
File: `system/hook-creator/templates/kiro/knowledge-score-update.kiro.hook`
```json
{
  "name": "Knowledge Score Update",
  "version": "1.0.0",
  "when": { "type": "postToolUse", "toolTypes": ["shell"] },
  "then": {
    "type": "askAgent",
    "prompt": "If the last shell command ran tests, check the result and update utility scores in the relevant knowledge index files. If tests passed, increment utility_score +0.5 and usage_count for templates used. If tests failed due to a template issue, decrement utility_score -1.0 and set last_failure to today. Use knowledge-evolution/references/utility-scoring.md for the protocol."
  }
}
```

### D2. Hook: memory palace auto-consolidation ❌ TODO
File: `system/hook-creator/templates/kiro/memory-palace-auto-consolidation.kiro.hook`
```json
{
  "name": "Memory Palace Auto-Consolidation",
  "version": "1.0.0",
  "when": { "type": "agentStop" },
  "then": {
    "type": "askAgent",
    "prompt": "Check if Memory Palace consolidation is needed: read state.md and check Consolidation_Stats.sessions_since. If mode=auto (default) AND (sessions_since >= 5 OR days_since >= 7), run Auto-Consolidation steps from memory-palace/references/scaling-protocol.md §Auto-Consolidation. Update Consolidation_Stats after completion. Show summary to user for verification."
  }
}
```

---

## Status Summary

| Phase | Task | Status |
|-------|------|--------|
| A | apiIndex.json utility fields | ❌ TODO |
| A | webUiIndex.json utility fields | ❌ TODO |
| A | mobileIndex.json utility fields | ❌ TODO |
| A | api lesson files effectiveness fields | ❌ TODO |
| A | webUi lesson files effectiveness fields | ❌ TODO |
| A | mobileLessonsIndex.json effectiveness fields | ❌ TODO |
| A | businessIndex.json intent_patterns | ❌ TODO |
| B | automation-save.md score update | ❌ TODO |
| B | knowledge-buffer.md reflect protocol | ❌ TODO |
| B | qa-task-design.md lesson sorting | ❌ TODO |
| B | dev-task-design.md lesson sorting | ❌ TODO |
| B | discovery-domain.md intent + utility routing | ❌ TODO |
| B | buffer-update.md score sync | ❌ TODO |
| C | knowledge-evolution wing template | ❌ TODO |
| C | core/memory-palace/SKILL.md | ❌ TODO |
| C | scaling-protocol.md auto-consolidation | ✅ DONE |
| D | knowledge-score-update hook | ❌ TODO |
| D | memory-palace-auto-consolidation hook | ❌ TODO |

**Done:** 1/18 tasks
**Remaining:** 17/18 tasks

---

## Recommended Order

1. **Phase A** — all 7 tasks (safe, additive only, no behavior change)
2. **Phase B** — all 6 tasks (activate scoring in real workflow)
3. **Commit after Phase B** — has value, don't wait for C-D
4. **Phase C-D** — next iteration

---

## Reference Files

| Need | File |
|------|------|
| Scoring schema + update protocol | `system/knowledge-evolution/references/utility-scoring.md` |
| Intent patterns + routing upgrade | `system/knowledge-evolution/references/smart-routing.md` |
| Memory wing structure + session sync | `system/knowledge-evolution/references/memory-integration.md` |
| Auto-consolidation protocol | `system/knowledge-evolution/references/auto-consolidation.md` |
| Full concept guide | `system/knowledge-evolution/KNOWLEDGE_EVOLUTION_README.md` |
| Hook schema (Kiro) | `system/hook-creator/references/kiro-hook-schema.md` |
