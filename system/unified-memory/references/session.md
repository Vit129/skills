# Session — Start, Execute, End, Schemas

Everything about how a session flows: loading context, tracking work, saving + syncing.

---

## Session Start

### Step 1: Load Palace State
```
Read .unified-memory/palace/state.md
Extract:
  - Active wings (name, status, last_updated, description)
  - Open threads (decisions pending)
  - Recent sessions (last 5)
  - Next session intent
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

  [Obsidian] Cross-references during work:
  - When referencing another room → note as [[wing/room]] (not file path)
  - When tagging a decision → note tags for frontmatter (e.g. #auth #decision)
  - Collect wikilinks + tags in-session → write to frontmatter at session end
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

  2g. [Obsidian] Write frontmatter + backlinks for each room touched:
      - frontmatter: wing, status, tags, created, updated, links
      - inline wikilinks in Implementation Details / Decisions Log
      - update Backlinks section in every room that was linked TO

  2h. [Obsidian] Auto-generate graph files:
      graph.json → nodes (wings + rooms) + edges (tunnels + wikilinks)
      graph.md   → Mermaid diagram from graph.json
      Skip if: no rooms changed this session

  Pro tip: Re-generating graph files (2h) is mandatory if any [[wikilinks]] were added or rooms renamed.
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
  1. Read {project}/.unified-memory/knowledge/index.json
  2. Find template by ID
  3. Update: utility_score, usage_count, outcome counts, last_used, last_outcome
  4. Write back
  5. Verify: re-read + confirm match
     Match → log "✅ Synced: {id} {before}→{after}"
     Mismatch → re-sync + log "⚠️ Mismatch re-synced: {id}"

For each lesson change in lesson-effectiveness.md:
  1. Read .unified-memory/knowledge/lessons/{domain}/*LessonsIndex.json
  2. Update: applied_count, prevented_failures
  3. Write back + verify

Global knowledge (~/.claude/skills/ai-dlc/knowledge/):
  Sync only when template is cross-project (auto_captured = false, used ≥3 projects)
  Otherwise per-project .knowledge/ is enough
```

### Step 5: Confirm
```
"✅ Session saved:
 - Rooms: {N} written to wings: {list}
 - Templates: {id} {before}→{after} (×N sessions)
 - Lessons: {N} applied, {M} auto-captured
 - Synced: .unified-memory/knowledge/index.json ✓
 - Graph: {N} nodes, {M} edges → graph.json + graph.md updated
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
