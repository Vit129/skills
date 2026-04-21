# Session — Start, Execute, End, Schemas

Everything about how a session flows: loading context, tracking work, saving + syncing.

---

## Session Start

### Step 0: Bootstrap (First-Time Init)
```
If .unified-memory/ does not exist:
  1. Create directory tree:
     .unified-memory/
       palace/
         state.md (empty schema from below)
         tunnels.md (empty: "# Cross-Wing Tunnels\n\n| From | To | Relationship |\n|------|----|-------------|")
         search-index.md (header only: "# Session Search Index\n\n| Date | Wing | Keywords | Room Path | Summary |\n|------|------|----------|-----------|---------|")
         user-profile.md (empty template from storage.md)
         wings/ (empty)
         archive/
           index.md (empty: "# Archive Index\n\n| Wing | Topic | Year | Summary | Archived |\n|------|-------|------|---------|----------|")
       knowledge/
         index.json (v3.0.0 with features flags)
         lessons/ (empty)
  2. Log: "🏛️ Memory Palace initialized"
  3. Skip to Session Execute (no wings to load yet)

If .unified-memory/ exists → proceed to Step 1
```

### Step 1: Load Palace State
```
Read .unified-memory/palace/state.md
Read .unified-memory/palace/user-profile.md (if exists)
Extract:
  - Active wings (name, status, last_updated, description)
  - Open threads (decisions pending)
  - Recent sessions (last 5)
  - Next session intent
  - User preferences (language, style, format, expertise)
```

### Step 2: Load Learning State
```
Read .unified-memory/palace/wings/knowledge-evolution/hall.md
If missing → auto-create empty template (see Schemas below)

Extract:
  - Top templates per domain (score, usage count)
  - Top lessons (prevented_failures count)
  - Flags: low-score templates, unreviewed auto-captures
  - Gaps: domains with no templates or lessons
```

### Step 3: Classify Wings (Hot / Cold)
```
Step-Back Questions:
  1. What is today's task?
  2. Which wings are relevant? → score each 0–10
  3. What did I decide last time? → check open threads
  4. What is the token budget?

CoT per wing:
  Score relevance against today's task keywords
  Hot  = score ≥5 → load hall.md + closets
  Warm = score 3–4 → load hall.md only
  Cold = score <3 → one-line summary from state.md

Token Budget:
  Hot wings total > 2000 tokens → warn user
  Ask: "Which wings to prioritize?"
  Max 3 Hot wings loaded at once
```

### Step 4: Load Hot Wings
```
Read order (per wing):
  hall.md (≤200 tokens)
    → closets/{room}.md (AAAK compressed)
      → rooms/{room}.md (full detail, on-demand)
        → raw/YYYY-MM-DD-*.md (verbatim, on-demand only)

Never load raw/ by default — too expensive.
```

### Step 5: Brief User
```
Format:
  "📋 Memory loaded — {project}

   Last session ({date}): {what happened}
   Open threads: {list or 'none'}

   📚 Learning:
   - Best template: {id} ({score}/10, {n}x used)
   - Best lesson: {id} (prevented {n} failures)
   - ⚠️ Flagged: {template} ({score}) — review before use
   - 🔴 Gaps: {domains} — no templates yet

   🎯 Today: {next_session_intent}"
```

### Step 6: Nudge Check (After Brief)
```
Run nudge rules from intelligence.md §9:
  1. Check all 6 nudge rules against current state
  2. Filter: suppress nudges seen <3 sessions ago or suppressed by user
  3. Sort by priority: High → Medium → Low
  4. Display max 3:

  "💡 Nudges:
   1. {nudge text}
   2. {nudge text}
   
   Act on any? [1/2/skip]"

  5. Log shown nudges to routing-log.md (for fatigue tracking)
```

### Step 7: Skill Suggestions
```
After nudges, check Hot wings for matching skills:
  1. For each Hot wing: scan skills/ folder
  2. Match skill "When to Use" against today's task intent
  3. If match found:
     "🔮 Available skills:
      - {skill-name}: {when-to-use summary}
      Use? [y/n]"
```

---

## Session Execute

```
During work:
  - Use templates from .unified-memory/knowledge/ (global or per-project)
  - Track outcome for each execution:
      Code: PASS or FAIL (test result)
      Design: APPROVE or REJECT (stakeholder review)
      Writing: ACCEPT or REVISE (editor feedback)
      Decision: POSITIVE or NEGATIVE (outcome visible)
      Learning: MASTERED or GAP (quiz/assessment)
  - Note reasoning in-session (written to rooms at session end)
  - Flag gaps: "no template for {domain}" → add to gap-tracker
  - Update dirty flag when saveable content detected (see below)
```

---

## Session Dirty Flag (Save Safety Net)

### Problem
Manual trigger "save session + learn" can be forgotten → session data lost.

### Solution: Dirty Flag + Reminder

#### Dirty Flag Rules
```
dirty = false  (at session start)

Set dirty = true when ANY of:
  - Code changes or file writes made
  - A decision was made (architecture, strategy, approach)
  - New open thread identified
  - Template used with outcome tracked (PASS/FAIL/etc.)
  - Lesson applied or new pattern discovered
  - Knowledge gap identified
  - Significant reasoning chain worth preserving

Stay dirty = false when ONLY:
  - Q&A with no decisions
  - Reading/browsing files without changes
  - Git status/log commands only
  - Trivial edits (typo fixes, formatting)
```

#### Reminder Trigger Points
```
When dirty = true, remind user at these moments:

1. Natural pause (user hasn't sent message for extended period):
   "💾 Unsaved session content detected. Save before closing?
    Say 'save session + learn' to persist."

2. Topic switch (user starts unrelated task):
   "💾 Note: Previous topic had unsaveable content.
    Want to save before switching? [save / skip]"

3. Explicit session end signals (user says "thanks", "done", "bye", etc.):
   "💾 This session has unsaved decisions/patterns:
    - {brief list of dirty items}
    Save now? [save session + learn / skip]"
```

#### Implementation (In-Session Tracking)
```
Track in-memory (not persisted until save):

session_dirty_items = []

On each saveable event:
  session_dirty_items.append({
    type: "decision" | "code_change" | "lesson" | "gap" | "outcome",
    summary: "one-line description",
    timestamp: now
  })

dirty = session_dirty_items.length > 0
```

#### Reminder Message Format
```
When triggered:
  "💾 Session has {N} unsaved items:
   {top 3 items from session_dirty_items, one line each}
   {if N > 3: '...and {N-3} more'}

   → 'save session + learn' to persist
   → 'skip save' to discard"
```

#### Edge Cases
```
- User says "skip save" → clear dirty flag, no save, no further reminders
- User ignores reminder → remind once more at next natural pause, then stop
- Max reminders per session: 2 (avoid nagging)
- If admission control rejects (score <0.6) → still show items + explain why
  "Score 0.45 — items are low-novelty. Save anyway? [y/n]"
```

---

## Session End (Manual: "save session + learn")

### Step 1: Admission Control
```
Score session content on 5 factors:

  Factor              | Weight | Question
  --------------------|--------|-------------------------------------------
  Future Utility      | 0.30   | Will this be needed in future sessions?
  Factual Confidence  | 0.20   | Is this confirmed, not speculative?
  Semantic Novelty    | 0.20   | Is this new info not already in palace?
  Temporal Recency    | 0.15   | Is this current, not outdated?
  Content Type Prior  | 0.15   | decision/arch > Q&A > routine work

Score ≥ 0.60 → proceed
Score < 0.60 → explain + offer override:
  "Score 0.45 (low novelty: mostly Q&A).
   Save anyway? [y = override / n = skip]"

SKIP if session was ONLY:
  - Q&A with no decisions made
  - Git/commit commands only
  - Info already in palace

SAVE if session had ANY of:
  - Code changes or file writes
  - A decision made
  - New open threads identified
  - Architecture or design choices
```

### Step 2: Write to Memory Palace
```
For each topic worked on:

  2a. Find or create wing (search before creating)
  
  2b. Write / update rooms:
      Check contradiction before overwriting:
        Same meaning → skip (no-op)
        Updated → overwrite + add temporal triple
        Contradicts strategy → warn user first

  2c. Compress if room > 80 lines:
      Create / update closets/{room}.md (AAAK format)

  2d. Update hall.md:
      Add new rooms, remove archived rooms, refresh descriptions

  2e. Update state.md:
      Update wings_active count
      Add to Recent_Sessions (keep last 10)
      Update open threads
      Set next_session_intent

  2f. Update tunnels.md:
      Add cross-wing references created this session

  2g. Update search-index.md:
      For each room written/updated this session:
        Extract 3-5 keywords (nouns + decisions)
        Append row: date | wing | keywords | room_path | summary
        Dedup: same room_path + same date → overwrite

  2h. Skill crystallization check:
      Check routing-log.md for repeated patterns (same domain + similar intent ≥2x)
      If found AND intent match verified → auto-write skill as DRAFT
      Update hall.md with new skill entry "(draft)"
      Notify user (no confirmation needed)

  2i. Update user-profile.md:
      Check: did user show new preferences, patterns, or expertise this session?
      New observation → append to appropriate section
      Contradiction → overwrite with temporal note
      No change → skip
      Keep ≤80 lines
```

### Step 3: Update Learning State
```
3a. Update .unified-memory/palace/wings/knowledge-evolution/rooms/:
    template-health.md  → log score changes: "{id}: {before}→{after} ({reason})"
    lesson-effectiveness.md → log lessons: "{id}: applied, prevented={true/false}"
    gap-tracker.md      → log new gaps: "{domain}: {type} missing since {date}"
    routing-log.md      → append: "{date}: Used {id} (score: {before}→{after})"

3b. Compress if any room > 80 lines:
    Update closets/knowledge-state.md (AAAK)

3c. Update knowledge-evolution hall.md summary
```

### Step 4: Sync to Source of Truth
```
Memory Palace = session buffer
.unified-memory/knowledge/index.json = source of truth (survives sessions)

For each score change in template-health.md:
  1. Read {project_root}/.unified-memory/knowledge/index.json
  2. Find template by ID
  3. Update: utility_score, usage_count, outcome counts, last_used, last_outcome
  4. Append to evolution_log[]: {date, action, before, after, reason, session}
  5. Write back
  6. Verify: re-read + confirm match
     Match → log "✅ Synced: {id} {before}→{after}"
     Mismatch → re-sync + log "⚠️ Mismatch re-synced: {id}"
  7. If evolution_log[] > 50 entries → archive oldest 25 to template-health.md

For each lesson change in lesson-effectiveness.md:
  1. Read .unified-memory/knowledge/lessons/{domain}/*LessonsIndex.json
  2. Update: applied_count, prevented_failures
  3. Write back + verify

Global knowledge ({project_root}/skills/knowledge/):
  Sync only when template is cross-project (auto_captured = false, used ≥3 projects)
  Otherwise per-project .knowledge/ is enough

### Cross-Project Auto-Promote
```
Field: projects_used_in[] (added to template/lesson entries in per-project index)

On session end sync:
  1. After updating per-project index.json, check projects_used_in[]
  2. If template/lesson used in ≥3 distinct projects → auto-promote to global

Promote action:
  - Copy entry to {project_root}/skills/knowledge/{domain}/
  - Set auto_captured = false (promoted = validated cross-project)
  - Preserve utility_score (average across projects if different)
  - Add note: "promoted from projects: [list] on {date}"
  - Log: "🌐 Promoted to global: {id} (used in {n} projects)"

Track field schema (per template/lesson in index.json):
  "projects_used_in": ["project-a", "project-b", "project-c"],
  "promoted_to_global": false,
  "promoted_date": null

Rule: Never demote from global. If score drops in one project, global stays.
```
```

### Step 5: Confirm
```
"✅ Session saved:
 - Rooms: {N} written to wings: {list}
 - Templates: {id} {before}→{after} (×N sessions)
 - Lessons: {N} applied, {M} auto-captured
 - Synced: .unified-memory/knowledge/index.json ✓
 Next: {next_session_intent}"
```

---

## Schemas

### state.md
```markdown
# Palace State — {project}

Palace_Stats:
  wings_active: {n}
  wings_archived: {n}
  rooms_total: {n}
  last_session: YYYY-MM-DD
  last_consolidation: YYYY-MM-DD

Recent_Sessions:
  - date: YYYY-MM-DD
    summary: "one line"
    wings_touched: [wing-a, wing-b]
    decisions: ["decision text"]

Active_Wings:
  - wing: {name}
    status: hot | warm | cold
    last_updated: YYYY-MM-DD
    rooms: {n}
    description: "one line"

Open_Threads:
  - id: thread-001
    description: "Decision pending on X"
    created: YYYY-MM-DD

Next_Session_Intent: "Continue X, decide Y"
```

### knowledge-evolution/hall.md
```markdown
# Knowledge Evolution — Hall

Last_Updated: YYYY-MM-DD
Sessions_Since_Consolidation: N
Last_Consolidation: YYYY-MM-DD

## Template Health
| Domain | Template | Score | Used | Status |
|--------|----------|-------|------|--------|
| auth | bearer-token | 7.5 | 8x | ✅ Proven |
| error | handler-v2 | 2.8 | 3x | ⚠️ Flagged |

## Lesson Effectiveness
| Domain | Lesson ID | Prevented | Confidence |
|--------|-----------|-----------|------------|
| auth | LESSON-AUTH-001 | 3 | 1.0 |

## Flags & Gaps
- ⚠️ Low score: error/handler-v2 (2.8)
- 📝 Unreviewed: 1 auto-captured lesson
- 🔴 Gaps: database (no template), mobile (no lessons)

## Rooms
- [template-health](rooms/template-health.md)
- [lesson-effectiveness](rooms/lesson-effectiveness.md)
- [gap-tracker](rooms/gap-tracker.md)
- [routing-log](rooms/routing-log.md)
```

### Temporal Triple Format
```
When overwriting a fact, preserve history:
  (Subject, Predicate, Value) [valid_from — valid_to]

Example:
  (auth-service, architecture, monolith) [2025-01-01 — 2026-03-15]
  (auth-service, architecture, microservices) [2026-03-15 — present]
```
