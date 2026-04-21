# Storage — Wings, Rooms, Closets, Halls, Tunnels, Archive

Everything about WHERE and HOW things are stored in Memory Palace.

---

## Hierarchy

```
L0: Wing    — top-level domain/project  e.g. "api-integration", "form-redesign"
L1: Room    — specific topic, full detail  e.g. "error-handling", "auth-decisions"
L2: Closet  — AAAK-compressed summary of a Room (read first for global state)
L3: Raw     — verbatim records, exact reasoning (accessed on-demand only)
L4: Hall    — index of rooms within a wing (≤50 lines)
    Tunnel  — cross-wing reference link (wing A ↔ wing B)
```

```
.unified-memory/
├── palace/
│   ├── state.md                      ← palace map (≤100 lines)
│   ├── tunnels.md                    ← cross-wing links
│   ├── wings/
│   │   └── {topic}/
│   │       ├── hall.md               ← wing index (≤50 lines)
│   │       ├── hall-detail.md        ← overflow from hall (optional)
│   │       ├── rooms/{room}.md       ← full detail
│   │       ├── closets/{room}.md     ← AAAK compressed (when room >80 lines)
│   │       └── raw/YYYY-MM-DD-*.md   ← verbatim records
│   └── archive/
│       ├── index.md                  ← searchable index (≤200 lines)
│       └── {topic}/{year}/
│           ├── rooms/, closets/, raw/
│           ├── sessions.md
│           └── summary.md
└── knowledge/
    ├── index.json                    ← domain catalog + utility_score
    └── lessons/{domain}/
        ├── *LessonsIndex.json
        └── *.md
```

**Rules:**
- Top-level .unified-memory/palace/ contains ONLY: state.md, tunnels.md, user-profile.md, search-index.md, wings/, archive/

- Max folder depth = 4 levels
- hall.md ≤ 50 lines. Overflow → hall-detail.md

---

## User Profile (Cross-Session Identity)

### Concept
Persistent user model that captures preferences, work patterns, and communication style across sessions. Enables AI to adapt tone, format, and suggestions to the user.

### Storage
```
.unified-memory/palace/user-profile.md   ← single file, ≤80 lines
```

### Schema
```markdown
# User Profile

Updated: YYYY-MM-DD

## Preferences
- Language: {e.g. Thai + English mixed}
- Response style: {e.g. direct, minimal, tables preferred}
- Preferred tools: {e.g. Claude Code, Kiro}
- Work patterns: {e.g. iterates fast, compares before deciding}

## Observed Patterns (auto-captured)
- Decision style: {e.g. data-driven, compare options first}
- Common domains: {e.g. AI skills, QA automation, system design}
- Typical session length: {e.g. medium, focused bursts}
- Feedback style: {e.g. brief approval, detailed when disagreeing}

## Communication
- Likes: {e.g. tables, comparisons, bullet points, Thai mixed}
- Dislikes: {e.g. verbose summaries, unnecessary explanations}
- Tone: {e.g. casual-professional, direct}

## Domain Expertise
- Strong: {domains user demonstrates expertise in}
- Learning: {domains user is actively exploring}
- Delegated: {domains user prefers AI to handle fully}
```

### Update Rules
```
At session end (after Step 2, before Step 3):
  1. Observe: did user show new preferences or patterns this session?
  2. If new observation:
     a. Check existing profile for contradiction
     b. Same → skip
     c. New → append to appropriate section
     d. Contradicts → overwrite with temporal note: "(was: X, changed: YYYY-MM-DD)"
  3. Update "Updated:" date
  4. Keep ≤80 lines — if exceeding, compress older observations

Auto-capture signals:
  - User corrects AI format → update Communication.Likes/Dislikes
  - User consistently uses certain language → update Preferences.Language
  - User skips certain suggestions repeatedly → update Preferences
  - User shows expertise in domain → update Domain Expertise.Strong
  - User asks basic questions in domain → update Domain Expertise.Learning
```

### Load Rules (Session Start)
```
At session start (Step 1, alongside state.md):
  1. Read user-profile.md if exists
  2. Apply preferences to session behavior:
     - Adjust response language/tone
     - Prefer user's liked formats (tables, bullets, etc.)
     - Avoid user's disliked patterns
     - Route suggestions through domain expertise level
  3. If user-profile.md doesn't exist → create empty template on first session end
```

---

## Wing

### Before Creating — Search First
```
Discovery check:
  1. Read state.md → list all active wings
  2. Score semantic overlap with new topic (0–10)
  3. ≥70% overlap → update existing wing, don't create new
  4. <70% → create new wing

Naming: kebab-case, lowercase, domain-specific
  Good: "payment-api", "form-redesign", "auth-decisions"
  Bad:  "api" (too broad), "work" (too vague)
```

### Wing Split Rule (Overflow Prevention)
```
Trigger: wing has >15 rooms

Action:
  1. Identify sub-clusters (group rooms by semantic similarity)
  2. Create child wings: {parent}-{subtopic}/
  3. Move rooms to child wings
  4. Parent wing becomes "umbrella" — hall.md links to child wings only
  5. Update state.md: replace parent with child wings
  6. Update tunnels.md: remap references to new child wing paths

Example:
  api-integration/ (18 rooms)
    → api-integration-auth/ (5 rooms)
    → api-integration-payment/ (7 rooms)
    → api-integration-notification/ (6 rooms)

Rule: child wing inherits parent's Hot/Warm/Cold status initially.
```

### Wing Classification (Hot / Cold / Warm)
```
Hot  = relevant to today's task (score ≥5/10) → load hall + closets
Warm = adjacent to task (score 3–4/10)        → load hall only
Cold = unrelated today (score <3/10)           → one summary line

On-demand promotion: Cold/Warm → Hot when task requires it
```

### hall.md Schema
```markdown
# {Wing Name} — Hall

Last_Updated: YYYY-MM-DD
Token_Estimate: {n}

## Summary
{One sentence: what this wing is about}

## Status
Hot | Warm | Cold | Pending Archive

## Rooms
| Room | Description | Lines | Last Updated |
|------|-------------|-------|--------------|
| error-handling | REST error handler patterns | 42 | 2026-04-18 |

## Open Threads
- {thread}: {description}

## Key Decisions
- {date}: {decision made}
```

### Hall Health (Check at Session End)
```
1. List all files in rooms/
2. Compare to hall.md room list
3. In directory but not in hall → add
4. In hall but not in directory → remove
5. Update Token_Estimate if changed
```

---

## Room

### Before Creating — Gap Analysis
```
1. Load wing's hall.md
2. Search rooms for this topic
3. Topic exists → update existing room
4. Partial match → add section to existing
5. Clearly distinct → create new room
```

### Writing Rules
```
- Length: 30–80 lines optimal
- Over 80 lines → create closet (AAAK)
- One room = one topic (single responsibility)
- Format: facts + decisions, not narrative
- Include: what decided, why, when, what rejected
- No filler: "decided: {X}" not "we decided to..."
```

### Room Schema
```markdown
# {Room Name}

## Current State
{Active fact — overwrite when it changes, add temporal triple}

## Decisions Log
{date}: {decision} — reason: {why}

## Temporal Triples
(subject, predicate, value) [valid_from — valid_to]

## Implementation Details
{Key facts, paths, configs — grep-verified}

## Rejected Approaches
- {approach}: rejected because {reason}

## Open Questions
- {question}
```

### Contradiction Check (Before Overwriting)
```
New fact arrives for same subject/predicate:
  Same meaning   → skip (no-op)
  Updated/superseded → overwrite + add temporal triple
  Contradicts strategy → warn user before overwriting
```

---

## Closet (AAAK Compression)

### When to Compress
```
Trigger: room.md > 80 lines
Action: create/update closets/{room}.md
Rule: regenerate after any room edit > 10 lines
```

### AAAK Format
```
Principles:
  Lossless Density  — symbols, abbreviations, structural shorthand
  Context Pinning   — always include "Current Truth" pointer
  Relational Links  — use ->, => and temporal markers (@YYYY-MM-DD)


```

### AAAK Priority Order (What to Keep vs Drop)
```
KEEP (never cut):
  1. Decision + Reason     ← why this choice was made
  2. Core Business Logic   ← domain rules that don't change
  3. Current State         ← verified facts only (not assumptions)
  4. Open Questions        ← unresolved decisions

COMPRESS (shorten):
  5. Technical Decisions   ← keep conclusion + reason, drop explanation
  6. Implementation paths  ← compress to pattern name + path
  7. Context/background    ← drop if obvious from room name

DROP (remove):
  - Filler text ("we decided to...", "it was agreed that...")
  - Repeated context (use tunnel instead)
  - Speculative content ("might", "could", "maybe")
  - Process steps with no decision (e.g. "ran npm install")
```
```markdown
# {Room Name} — Closet [AAAK]

Updated: YYYY-MM-DD | Room_Lines: {n}/80

## Current Truth
{AAAK summary of active state}

## Key Decisions
{date}: {AAAK decision}

## Temporal Triples
(S, P, V) [from—to]

## Open
{open threads in shorthand}
```

---

## Tunnels (Cross-Wing Links)

### When to Create
```
Create when:
  - Decision in Wing A affects Wing B
  - Knowledge-evolution score impacts project wing
  - Bug in domain A explains behavior in domain B


```

### tunnels.md Schema
```markdown
# Cross-Wing Tunnels

## Active
(knowledge-evolution, template-health) → (api-integration, error-handling)
  Purpose: bearer-token template used in API work — track score
  Sync: session-end write-back

(auth-service, decisions) → (api-integration, auth-decisions)
  Purpose: Auth approach drives API integration choices
  Sync: when auth strategy changes

## Archived
(keep for audit, mark archived: YYYY-MM-DD)
```

### Tunnel Maintenance
```
On wing archive → mark all tunnels FROM that wing as archived
On room rename → update tunnel references to match new room name
```

---

## Archive

### When to Archive
```
Archive wing when ANY of:
  - No activity > 30 days
  - Project explicitly finished
  - User: "archive {wing-name}"
  - state.md Recent_Sessions has no mention in 10+ rows

Never hard-delete — always archive (audit trail)
```

### Archive Steps
```
1. Copy wing/ → archive/{topic}/{year}/
2. Create archive/{topic}/{year}/summary.md (AAAK of whole wing)
3. Update archive/index.md (add entry)
4. Remove from state.md Active_Wings
5. state.md: wings_active--, wings_archived++
6. Update tunnels.md: mark related tunnels as archived
```

### archive/index.md Schema
```markdown
# Archive Index

| Wing | Topic | Year | Summary | Archived |
|------|-------|------|---------|----------|
| payment-api | Payment REST integration | 2025 | OAuth2 + Stripe, completed | 2026-01-15 |
```

### Searching Archive
```
User: "search for {keyword} in old notes"

1. Read archive/index.md → find matching entries
2. Read archive/{topic}/summary.md → overview
3. Drill into archive/{topic}/{year}/rooms/ if detail needed
4. Never load entire archive — search incrementally
```

---

## Raw Files

### When to Write
```
Write raw/ when:
  - Exact verbatim record needed (meeting notes, exact error output)
  - Reasoning chain that must be preserved exactly
  - Source material referenced from rooms
  
Naming: YYYY-MM-DD-{short-description}.md
```

### When to Read
```
Read raw/ ONLY when:
  - User asks for exact detail from a specific date
  - Debugging a decision that may have been wrong
  - Room/closet references a raw file by name
  
Never load raw/ by default at session start.
```

---

## Wing Self-Review (Before Committing Wing Changes)

Challenge yourself after creating or modifying a wing:

```
1. Pre-mortem: "If this wing structure is wrong, what did I miss?"
2. Redundancy check: "Is there another wing covering the same abstract concept?"
3. Naming check: "Would someone reading state.md understand what this wing is?"
4. Scope check: "Too broad (should split)? Too narrow (should be a room instead)?"
```

### Wing Common Pitfalls
```
❌ Creating wing without checking state.md first
   Fix: always read state.md, search existing wings before creating

❌ Wing name too specific: "jwt-token-fix"
   Fix: use domain name → "auth-decisions"

❌ Wing name too generic: "misc"
   Fix: every wing needs a clear domain boundary

❌ Forgetting to update state.md after creating wing
   Fix: state.md update is mandatory — part of creation step

❌ Not creating hall.md
   Fix: hall.md is required for every wing

❌ Archiving wing that has active open threads
   Fix: check Open Threads before archiving — resolve or transfer first
```

---

## Room Gap Analysis

Before creating a room, assess what's missing:

```
Step 1 — Extract Required Context
  What context does this task need?
  What decisions need recording?
  What facts need tracking?

Step 2 — Match Against Available Rooms
  Direct Match   → room has exactly what's needed → use it
  Partial Match  → room has related info → update existing
  No Match       → create new room

Step 3 — Prioritize Gaps
  Critical → task can't proceed without this context
  High     → wrong decisions without this context
  Medium   → slower work without this context
  Low      → nice to have
```

### Room Reusability Score
```
Formula: (reuse + extend items) / total required × 100

🟢 >80% — mostly covered by existing rooms, minimal new content
🟡 60–80% — some new rooms needed
🔴 <60% — significant new content, consider new wing instead
```

### Room Self-Review (Before Committing Room Changes)
```
1. Pre-mortem: "If I need this info next session, will I find it here?"
2. Redundancy: "Is this content already in another room (different wing)?"
3. Completeness: "Did I capture the decision AND the reasoning, not just outcome?"
4. Temporal: "Did I add temporal markers so future sessions know WHEN this was true?"
```

### Room Common Pitfalls
```
❌ Creating room without checking hall.md → Fix: read hall.md first
❌ Writing without conflict check → Fix: search existing facts before writing
❌ Room >80 lines without closet → Fix: create closet immediately
❌ Forgetting to update hall.md → Fix: hall.md update is mandatory

❌ Duplicating content across rooms → Fix: use tunnels to link, don't copy
```

---

## Skills (Crystallized Execution Paths)

### Concept
When a task is solved successfully and the same pattern appears ≥2 times, crystallize the execution path into a reusable skill file. Skills live inside wings alongside rooms.

### Storage
```
wings/{topic}/skills/{skill-name}.md   ← crystallized skill
```

### Skill File Schema
```markdown
# Skill: {skill-name}

Created: YYYY-MM-DD
Version: 1
Status: DRAFT | ACTIVE | STALE
Uses: 0
Positive_Uses: 0
Negative_Uses: 0
Last_Used: null
Last_Execution_Steps: null
Source_Rooms: [room-a, room-b]

## When to Use
{One-line trigger condition — when should this skill be invoked?}

## Steps
1. {Step 1}
2. {Step 2}
3. ...

## Previous Steps (rollback safety)
{Empty until first self-improvement. Stores v(n-1) Steps for regression rollback.}

## Improvement Log
| Date | Version | Change | Outcome | Auto? |
|------|---------|--------|---------|-------|
```

### Crystallization Rules (Auto-write Draft)
```
Trigger: same pattern solved ≥2 times (check routing-log.md for repeats)

Auto-crystallize flow (no user confirmation needed):
  1. Detect repeat: same domain + similar intent in routing-log ≥2 entries
  2. Verify intent match: both source sessions must have same Input→Process→Output pattern
     (if intent differs → skip, don't crystallize — Gotcha #23)
  3. Auto-write skill file with Status: DRAFT
  4. Update hall.md: add skill to index with "(draft)" marker
  5. Notify: "🔮 Auto-crystallized: {name} (draft) — will activate after first successful use"
  6. Log: "🔮 Skill crystallized (draft): {name} from rooms: {list}"

Lifecycle:
  DRAFT → used successfully 1x → promote to ACTIVE
  DRAFT → unused 30 days → auto-remove + notify: "🗑️ Draft skill '{name}' removed (unused 30d)"
  ACTIVE → unused 60 days → demote to STALE
  STALE → used successfully → promote back to ACTIVE
  STALE → unused 30 more days (90 total) → archive

Status rules for session start:
  ACTIVE → suggest to user when task matches
  DRAFT  → do NOT suggest (invisible until proven)
  STALE  → suggest with warning: "⚠️ Stale skill — last used {n} days ago"

Manual: user says "crystallize skill from {room}" → write as ACTIVE directly (human-curated)
```

### Self-Improvement (Auto-refine on Positive Outcome)
```
When skill is used:
  1. Increment Uses count
  2. Record Last_Execution_Steps (actual steps taken this time)
  3. Track outcome (POSITIVE/NEGATIVE)

After POSITIVE outcome:
  a. Compare Last_Execution_Steps vs current Steps
  b. If execution DEVIATED from Steps AND outcome is positive:
     → Copy current Steps to "Previous Steps" (rollback safety)
     → Auto-update Steps to match actual execution
     → Bump Version
     → Append to Improvement Log: {date, version, "auto-refined: {diff summary}", outcome, Auto: yes}
     → Log: "🔮 Self-improved: {name} v{n-1}→v{n} (better outcome with deviation)"
  c. If execution FOLLOWED Steps exactly:
     → No change to Steps
     → Increment Positive_Uses
     → If DRAFT + first positive → promote to ACTIVE

After NEGATIVE outcome:
  a. DO NOT auto-update Steps (Gotcha #27)
  b. Increment Negative_Uses
  c. Append to Improvement Log: {date, version, "negative outcome: {reason}", outcome, Auto: no}
  d. If 2 consecutive negatives:
     → Flag: "⚠️ Skill '{name}' degrading — 2 consecutive failures"
     → If Previous Steps exists → suggest rollback: "Rollback to v{n-1}? [y/n]"

Deviation detection:
  Simple: compare step count + key action verbs
  Match = same count + same verbs in same order
  Deviation = different count OR different verbs OR different order
```

### Skill in Hall.md
```
Add to hall.md Rooms Index table:

| Room/Skill | Description | Type | Last Updated |
|------------|-------------|------|--------------|
| `skills/deploy-flow` | CI/CD deployment steps | skill | 2026-04-20 |
```

### Skill Reuse (Session Start)
```
When loading Hot wing:
  1. Load hall.md (includes skill index)
  2. Filter skills by status:
     ACTIVE → eligible for suggestion
     DRAFT  → skip (invisible until proven)
     STALE  → eligible with warning
  3. If task matches skill's "When to Use":
     ACTIVE: "🔮 Skill available: {name} (v{n}, {uses}x used)"
     STALE:  "🔮 Stale skill: {name} — last used {n} days ago. Use? [y/n]"
  4. User confirms → execute skill steps
  5. Record Last_Execution_Steps (actual steps taken)
  6. Track outcome → feed back into self-improvement
```

---

## Session Search Index

### Concept
Flat-file search index enabling grep-based lookup across all sessions. No SQLite, no dependencies.

### Storage
```
.unified-memory/palace/search-index.md
```

### Schema
```markdown
# Session Search Index

| Date | Wing | Keywords | Room Path | Summary |
|------|------|----------|-----------|---------|
| 2026-04-20 | unified-memory | competitive,hermes,evolver,roadmap | wings/unified-memory/rooms/competitive-analysis-roadmap.md | Compared 4 GitHub agents, P1/P2 roadmap |
| 2026-04-18 | ai-dlc-skills | placeholder,path,convention | wings/ai-dlc-skills/rooms/standards-update.md | Standardized {project_root} across skills |
```

### Write Rules
```
At session end (Step 2f, after updating state.md):
  For each room written/updated this session:
    1. Extract 3-5 keywords from room content (nouns + decisions)
    2. Append row to search-index.md
    3. Dedup: if same room_path already has entry for same date → overwrite row

Max rows: 500 (oldest rows archived to search-index-archive.md when exceeded)
```

### Search Usage
```
User: "search memory for {query}"

1. grep search-index.md for query terms (case-insensitive)
2. Return matching rows sorted by date DESC
3. For each match: show Date, Wing, Summary
4. User picks → load the Room Path for full detail

Fuzzy: if exact match fails → split query into words, match any word
```

### Maintenance
```
During consolidation:
  - Remove rows pointing to archived rooms
  - Remove rows older than 180 days (they're in archive anyway)
  - Rebuild index if room paths changed (wing split, rename)
```

---

## Palace Reverse Engineering

When palace structure feels messy or undocumented, run a full audit:

```
Step 1: Scan all wings/ folders → compare with state.md Active_Wings
Step 2: Scan all rooms/ in each wing → compare with hall.md Rooms table
Step 3: Check tunnels.md → verify both endpoints exist
Step 4: Check archive/index.md → verify paths exist
Step 5: Document findings → update state.md, hall.md, tunnels.md

Output:
  Wings: [N] active, [N] archived, [N] orphan (folder not in state.md)
  Rooms: [N] total, [N] with closets, [N] missing from hall
  Tunnels: [N] valid, [N] broken (endpoint missing or archived)
  Archive: [N] entries, [N] with summary.md
  Issues: [list of problems → fix in priority order]
```

### Hall State Gap Analysis
```
Required: all wings/ folders should be listed in state.md
Available: wings listed in state.md Active_Wings
Gap: any wing folder not in state.md = orphan → add or archive

Periodically:
  - Room listed in hall.md but file missing → log "missing", mark or recreate
  - Room exists but not in hall → add to hall.md
  - Tags outdated → update to reflect current rooms
  - Token_Estimate wrong → recalculate
```

---

## Archive Decision (AoT Exploration)

When deciding what to archive, use branching exploration:

```
[D1] Archive entire wing?
  ├─ ✅ Wing inactive >30 days → ARCHIVE
  ├─ ⚠️ Wing has 1 active open thread → KEEP, archive old rooms only
  └─ ❌ Wing actively used this sprint → DO NOT ARCHIVE

[D2] Archive specific rooms?
  ├─ ✅ Room not referenced in 5+ sessions → ARCHIVE room
  ├─ ⚠️ Room has raw/ files → archive raw/ first, keep room summary
  └─ ❌ Room referenced in open thread → DO NOT ARCHIVE

[D3] state.md approaching 100 lines — what to compress?
  Option A: Archive old Recent_Sessions (rows >10) → quick, minimal loss
  Option B: Archive inactive wings → more space, loses quick access
  Option C: Mark open threads [x] completed → immediate relief
  Hybrid (recommended): A first → C → B last resort
```

---

## AAAK Technical Reference

### Full Taxonomy
```
Level | Name    | Purpose              | Data Type
------|---------|----------------------|------------------
L0    | Wing    | Domain isolation     | Metadata / URI
L1    | Room    | Semantic context     | Full markdown
L2    | Closet  | Compressed state     | AAAK markdown
L3    | Raw     | Ground truth         | Verbatim text
L4    | Hall    | Intra-wing index     | Table + metadata
      | Tunnel  | Inter-wing link      | Reference pairs
```

### AAAK Examples (Verbose → Dense)
```
Verbose (150 tokens):
  The authentication service currently uses JWT tokens with a 1-hour expiry.
  The strategy is to refresh tokens silently if the user is active,
  based on session rules defined last sprint.

AAAK (40 tokens):
  @Auth:Service | Room:TokenStrategy
  JWT: { Expiry:1h, Refresh:[SilentIfActive], Ref:SessionRulesV2 }
  Status: Active | Updated: 2026-04-11

Verbose (100 tokens):
  The script processes 473 requests from the iuser-convert collection,
  splitting by top-level folder into separate spec files.

AAAK (25 tokens):
  @Script:postmanMdToPlaywright | v:7 | Input:iuser-convert(473req)
  Mode: auto-split by topFolder → separate spec/helper/service
```

**Token saving: ~60–70% with AAAK format**

### Temporal Triple — Full JSON Schema
```json
{
  "subject": "auth-service",
  "predicate": "architecture",
  "object": "microservices",
  "metadata": {
    "valid_from": "2026-03-15T00:00:00Z",
    "valid_to": null
  }
}
```

Historical record (previous value):
```json
{
  "subject": "auth-service",
  "predicate": "architecture",
  "object": "monolith",
  "metadata": {
    "valid_from": "2025-01-01T00:00:00Z",
    "valid_to": "2026-03-15T00:00:00Z"
  }
}
```

Query capability: "What was auth-service architecture during Jan 2026?" → monolith

### Contradiction Detection (Before Writing)
```
1. Search: existing active triples (valid_to == null) for same subject/predicate
2. Verify: does new info contradict existing?
3. Resolve:
   - Update/supersede → set valid_to = now on old, write new triple
   - Contradiction → alert user, request clarification before writing
   - Same meaning → skip (no-op, avoid duplication)
```

