# Agent Memory Redesign — Bugfix Design

## Overview

The agent-memory system has three systemic failures: (1) legacy JSON files coexist with Markdown causing format split and token waste, (2) palace saves happen without knowledge updates causing knowledge drift, and (3) spec'd features like skill crystallization, consolidation/auto-dream, and nudges are unimplemented.

The fix strategy is phased:
- Phase 1: Migrate workspace to all-Markdown, enforce palace+knowledge atomic sync, remove legacy JSON
- Phase 2: Search indexes, user profile enhancements, score-based routing
- Phase 3: Skill crystallization, consolidation/auto-dream, nudge system

The skill spec at `skills/system/agent-memory/` (SKILL.md + references/) already defines the correct Markdown-first architecture. This design describes HOW to implement the migration and enforcement mechanisms to make the workspace match that spec.

## Glossary

- **Bug_Condition (C)**: Any session save operation that writes palace files without also writing knowledge files, OR any read/write that uses JSON memory files instead of Markdown equivalents
- **Property (P)**: Every dirty session save updates both palace/ AND knowledge/ in Markdown; no JSON memory files are created or treated as authoritative
- **Preservation**: Existing palace wing/room/hall structure, knowledge article frontmatter format, tunnels.md, user-profile.md, archive/ — all continue working unchanged
- **Palace**: `agent-memory/palace/` — narrative memory (state, wings, rooms, closets, search-index)
- **Knowledge**: `agent-memory/knowledge/` — reusable patterns (index.md, evolution.md, lessons/, articles)
- **Knowledge Sync Gate**: Mandatory step in session-save that ensures knowledge/ is touched on every dirty save
- **Legacy JSON**: `index.json`, `date-index.json`, `keyword-index.json`, `toolingLessonsIndex.json` — files that must be removed or ignored
- **SKILL.md**: `skills/system/agent-memory/SKILL.md` — the authoritative architecture contract

## Bug Details

### Bug Condition

The bug manifests in two forms: (A) session saves that update palace/ without touching knowledge/, causing knowledge drift across sessions, and (B) JSON memory files that exist alongside Markdown equivalents, causing format confusion, extra parsing tokens, and stale data.

**Formal Specification:**
```
FUNCTION isBugCondition(saveOperation)
  INPUT: saveOperation of type SessionSave
  OUTPUT: boolean

  // Form A: Knowledge drift — palace updated without knowledge
  palaceChanged := saveOperation.filesWritten INTERSECT palace/*
  knowledgeChanged := saveOperation.filesWritten INTERSECT knowledge/*
  knowledgeDrift := palaceChanged IS NOT EMPTY
                    AND saveOperation.isDirty = true
                    AND knowledgeChanged IS EMPTY

  // Form B: JSON format split — JSON memory files exist or are written
  jsonWritten := saveOperation.filesWritten INTERSECT agent-memory/**/*.json
  jsonExists := EXISTS file IN agent-memory/ WHERE file.extension = '.json'
                AND file NOT IN ['.config.kiro']  // tool configs are OK

  RETURN knowledgeDrift OR jsonWritten OR jsonExists
END FUNCTION
```

### Examples

- Session saves `palace/state.md` and `palace/search-index.md` but does NOT touch `knowledge/index.md` or `knowledge/evolution.md` → knowledge drift (Form A)
- `knowledge/index.json` exists with hardcoded settings while `knowledge/index.md` has the real data → format split confusion (Form B)
- `palace/date-index.json` and `palace/keyword-index.json` exist but are empty `{}` → dead files wasting attention (Form B)
- `lessons/tooling/toolingLessonsIndex.json` exists alongside `lessons/tooling/index.md` → dual source of truth (Form B)
- Session has decisions and file writes (dirty=true) but save hook only updates `state.md` → incomplete save (Form A)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Palace wing/room/hall/closet directory hierarchy (`wings/{name}/hall.md`, `rooms/`, `closets/`, `skills/`, `raw/`)
- Knowledge article format with YAML frontmatter (`id`, `type`, `scope`, `status`, `score`, `updated`, `keywords`)
- Lesson detail file format (`---` frontmatter + Summary/Detail/Apply Next Time/Evidence sections)
- Session narrative stored in room files under `wings/{name}/rooms/`
- Cross-wing relationships tracked in `tunnels.md` with markdown table
- Global state tracked in `state.md` with Active Wings, Recent Sessions, Current Focus, Open Threads
- User profile stored in `user-profile.md`
- Archive directory structure under `archive/`
- Search-index.md table format (Date, Wing, Keywords, Path, Summary)

**Scope:**
All inputs that do NOT involve session save operations or memory file format should be completely unaffected by this fix. This includes:
- Reading existing palace rooms and halls
- Reading existing knowledge articles
- Wing classification (Hot/Warm/Cold)
- Dirty flag detection logic
- Admission control scoring
- User profile reads/writes
- Archive operations

## Hypothesized Root Cause

Based on the bug analysis and spec-vs-reality gap audit:

1. **Missing Knowledge Sync Gate in original hooks**: The original session-save hook (pre-v6.0.0) only updated `palace/state.md` and optionally rooms. There was no mandatory step requiring knowledge/ to be touched. The v6.0.0 hook adds this gate but the workspace still has artifacts from the pre-gate era.

2. **JSON-first legacy from initial implementation**: The system was originally designed with JSON indexes (`index.json`, `*Index.json`). The Markdown-first contract was established later (SKILL.md rewrite), but the workspace was never migrated — only the global `~/.claude/agent-memory/` was migrated.

3. **No migration script or bootstrap check**: There is no mechanism to detect "workspace has legacy JSON but should be Markdown-only" and auto-migrate. The bootstrap in `references/session.md` creates new Markdown files but doesn't clean up existing JSON.

4. **Reference files still contain JSON examples**: `references/adaptation.md` Step 4 still shows JSON index creation. `references/maintenance.md` has a legacy note header but agents may still follow the JSON patterns shown in the body.

## Correctness Properties

Property 1: Bug Condition — Atomic Palace+Knowledge Sync

_For any_ dirty session save operation, the save function SHALL update at least one file in `knowledge/` (index.md Updated date, evolution.md audit row, or lesson files) whenever it updates any file in `palace/`. A save that touches palace/ without touching knowledge/ is an incomplete save.

**Validates: Requirements 2.4, 2.5, 2.8**

Property 2: Bug Condition — Zero JSON Memory Storage

_For any_ memory read or write operation, the system SHALL use only Markdown files (`.md`) for persistent memory storage under `agent-memory/`. No `.json` file under `agent-memory/` shall be created, updated, or treated as authoritative. Legacy JSON files shall be removed during migration.

**Validates: Requirements 2.1, 2.2, 2.3, 2.6, 2.10**

Property 3: Preservation — Palace Structure Unchanged

_For any_ input that does NOT involve session save sync or file format, the fixed system SHALL produce the same palace directory structure, room format, hall format, closet format, tunnels format, and state format as the original system.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7**

Property 4: Preservation — Knowledge Article Format Unchanged

_For any_ existing knowledge article or lesson detail file, the fixed system SHALL preserve the YAML frontmatter schema and markdown body structure, only changing the index/catalog format from JSON to Markdown tables.

**Validates: Requirements 3.2, 3.8**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:


### Phase 1: Workspace Migration + Atomic Sync (Core Fix)

**Goal**: Workspace `agent-memory/` matches the Markdown-first contract in SKILL.md. Palace and Knowledge always save together.

#### 1A. Legacy JSON Cleanup

**Files to remove from workspace:**
- `agent-memory/palace/date-index.json` (empty, replaced by `search-index.md`)
- `agent-memory/palace/keyword-index.json` (empty, replaced by `search-index.md`)
- `agent-memory/knowledge/index.json` (replaced by `knowledge/index.md`)
- `agent-memory/knowledge/lessons/tooling/toolingLessonsIndex.json` (replaced by `lessons/tooling/index.md`)

**Migration strategy:**
1. Check if Markdown equivalent exists and has data (it does — `index.md`, `evolution.md`, `lessons/tooling/index.md` all exist in workspace now)
2. Verify no unique data in JSON that isn't in Markdown (JSON files are empty or have hardcoded stale data)
3. Delete JSON files
4. Verify system still loads correctly via session-load hook

#### 1B. Verify Markdown Knowledge Files

**Files that must exist in workspace** (per SKILL.md Storage Architecture):
- `agent-memory/knowledge/index.md` — ✅ exists
- `agent-memory/knowledge/evolution.md` — ✅ exists
- `agent-memory/knowledge/lessons/tooling/index.md` — ✅ exists

**Verify format matches** `references/storage.md` schemas:
- `index.md`: Articles table, Lessons table, Gaps table with correct columns
- `evolution.md`: Change Log table with Date/ID/Change/Signal/Before/After/Evidence
- `lessons/tooling/index.md`: ID/Type/Status/Applied/Prevented/Confidence/Summary/Detail columns

#### 1C. Hook Enforcement (Already Implemented)

The session-save hook v6.0.0 already enforces the Knowledge Sync Gate:
- Step 4 is "Mandatory Knowledge Sync Gate" — knowledge MUST be touched every dirty save
- Step 4B requires updating `knowledge/index.md`, domain lesson indexes, and `knowledge/evolution.md`
- Step 5 verifies no JSON was written
- Minimal safe save fallback still requires `knowledge/index.md` Updated date + `evolution.md` audit row

The session-load hook v3.0.0 already reads Markdown knowledge:
- Reads `knowledge/index.md` and `knowledge/evolution.md`
- Bootstrap creates Markdown files only, no JSON

**No hook changes needed for Phase 1** — hooks are already correct.

#### 1D. Reference File Cleanup

**File**: `skills/system/agent-memory/references/adaptation.md`
- Step 4 still shows JSON index creation (`index.json` with JSON schema)
- Replace with Markdown index creation matching `references/storage.md` Knowledge Index format
- Update Global Knowledge Structure section to show Markdown paths

**File**: `skills/system/agent-memory/references/maintenance.md`
- Already has legacy note header — no structural changes needed
- Verify all examples reference Markdown files, not JSON

### Phase 2: Search Indexes + Score-Based Routing

**Goal**: `search-index.md` becomes the primary discovery mechanism. Score-based routing uses `knowledge/index.md` scores to prefer proven knowledge.

#### 2A. Search Index Enhancement

**File**: `agent-memory/palace/search-index.md`

Current format works but needs:
- Archival mechanism: rows >180 days old → `search-index-archive.md` (per GOTCHAS #24)
- Hard cap: 500 rows in active index
- Consolidation trigger: check at maintenance time

#### 2B. Score-Based Knowledge Routing

**Per** `references/intelligence.md`:
- Extract intent from user request
- Scan `knowledge/index.md` for matching keywords and article titles
- Scan `knowledge/lessons/{domain}/index.md` for relevant lessons
- Prefer higher score (7.0+ = proven, 3.0-6.9 = active, <3.0 = stale)
- Record gaps when nothing matches

**Implementation**: Add routing logic to session-load hook or as a separate skill reference that agents follow during work.

#### 2C. User Profile Enhancements

**File**: `agent-memory/palace/user-profile.md`
- Track nudge skip counts (per GOTCHAS #25)
- Track preferred save sensitivity (per GOTCHAS #17)
- Track domain preferences for routing

### Phase 3: Skill Crystallization + Consolidation/Auto-Dream

**Goal**: System self-improves by crystallizing repeated patterns into skills and distilling settled knowledge.

#### 3A. Skill Crystallization

**Per** `references/intelligence.md` Auto-Crystallization:
1. Detect pattern appearing 2+ times with positive outcomes in `knowledge/evolution.md`
2. Create draft article in `knowledge/{pattern-id}.md`
3. Add to `knowledge/index.md` as `draft` status
4. Promote to `active` after one more positive use
5. Promote to `proven` at score ≥7.0 with multiple positive uses

**Safeguard** (GOTCHAS #23): Verify both source sessions had same intent before crystallizing. Always ask user confirmation.

#### 3B. Consolidation/Auto-Dream

**Per** `references/maintenance.md`:

**Trigger conditions** (any one):
- sessions_since_last_consolidation ≥ 5
- days_since_last_consolidation ≥ 7
- knowledge items increased by >20%
- User explicitly asks "consolidate knowledge"

**Consolidation steps** (in order):
1. Deduplication — group lessons by semantic similarity, merge duplicates
2. Stale detection — flag items not used in 90+ days
3. Date normalization — replace relative dates with absolute
4. Conflict resolution — flag contradictions, resolve with human
5. Score normalization — recalibrate if >80% templates ≥7.0 (quarterly max)
6. Auto-dream — distill settled facts per domain-aware thresholds:
   - arch: 5 sessions unchanged → settled
   - api: 4 sessions unchanged → settled
   - ui: 2 sessions unchanged → settled
   - default: 3 sessions unchanged → settled
7. Archive source rooms that fed into distilled statements
8. Update tracking: reset sessions_since_consolidation, log summary

#### 3C. Nudge System

**Per** `references/intelligence.md` Nudge Rules:
- At session start, show max 3 nudges:
  - Stale knowledge relevant to today's task
  - Open gaps relevant to today's task
  - Repeated lesson that may prevent failure
  - Old open thread likely to block the task
- Suppress nudges user ignored recently (track in user-profile.md)
- If skip rate >80% → reduce to max 2, show High priority only

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis.

**Test Plan**: Inspect the workspace for legacy JSON files and verify that session saves prior to v6.0.0 hooks left knowledge/ stale. Run these checks on the UNFIXED workspace state.

**Test Cases**:
1. **JSON File Existence Test**: Check if `agent-memory/**/*.json` files exist in workspace (will find legacy files on unfixed code)
2. **Knowledge Drift Test**: Compare `palace/state.md` Recent Sessions dates against `knowledge/evolution.md` Change Log dates — sessions saved without knowledge updates will show gaps (will show drift on unfixed code)
3. **Index Format Test**: Check if `knowledge/index.json` exists alongside `knowledge/index.md` — dual source of truth (will find both on unfixed code)
4. **Lesson Index Format Test**: Check if `toolingLessonsIndex.json` exists alongside `lessons/tooling/index.md` (will find both on unfixed code)

**Expected Counterexamples**:
- Legacy JSON files exist with stale/empty data while Markdown equivalents have current data
- Palace sessions exist in `search-index.md` that have no corresponding `evolution.md` entry
- Possible causes: pre-v6.0.0 hooks only saved palace, no migration script ran for workspace

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed system produces the expected behavior.

**Pseudocode:**
```
FOR ALL saveOperation WHERE isBugCondition(saveOperation) DO
  result := sessionSave_fixed(saveOperation)
  ASSERT result.knowledgeFilesChanged IS NOT EMPTY
  ASSERT result.jsonFilesWritten IS EMPTY
  ASSERT result.evolutionRowAppended = true
END FOR
```

**Verification steps after fix:**
1. No `*.json` files exist under `agent-memory/` (except tool configs outside agent-memory/)
2. `knowledge/index.md` Updated date matches latest session date
3. `knowledge/evolution.md` has a row for every session in `palace/search-index.md`
4. Every lesson in `knowledge/lessons/*/index.md` appears in `knowledge/index.md` Lessons table
5. Session-save hook v6.0.0 Step 5 verification passes on every save

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed system produces the same result as the original system.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT sessionLoad_original(input) = sessionLoad_fixed(input)
  ASSERT palaceRead_original(input) = palaceRead_fixed(input)
  ASSERT knowledgeRead_original(input) = knowledgeRead_fixed(input)
END FOR
```

**Testing Approach**: Manual verification is appropriate here because the system is file-based with no programmatic test harness. Property-based testing concepts apply to the verification checklist.

**Test Cases**:
1. **Palace Structure Preservation**: Verify `wings/*/hall.md`, `rooms/*.md`, `closets/*.md` structure unchanged after migration
2. **Knowledge Article Preservation**: Verify `design-craftsmanship-tokens.md` and `error-recovery-strategy.md` frontmatter and content unchanged
3. **Lesson Detail Preservation**: Verify `LESSON-TOOLING-001.md` through `LESSON-TOOLING-004.md` format unchanged
4. **Tunnels Preservation**: Verify `tunnels.md` table format and content unchanged
5. **State Format Preservation**: Verify `state.md` sections (Active Wings, Recent Sessions, Current Focus, Open Threads) unchanged
6. **Search Index Preservation**: Verify `search-index.md` existing rows unchanged, only new rows added

### Unit Tests

- Verify each legacy JSON file has a Markdown equivalent with equal or better data
- Verify `knowledge/index.md` schema matches `references/storage.md` Knowledge Index format
- Verify `knowledge/evolution.md` schema matches `references/storage.md` Knowledge Evolution format
- Verify `lessons/tooling/index.md` schema matches `references/storage.md` Lesson Domain Index format
- Verify session-save hook v6.0.0 prompt includes Knowledge Sync Gate
- Verify session-load hook v3.0.0 prompt reads Markdown knowledge files

### Property-Based Tests

- For any session save where dirty=true, verify knowledge/ was touched (atomic sync property)
- For any file under `agent-memory/`, verify extension is `.md` not `.json` (zero-JSON property)
- For any knowledge article, verify frontmatter contains required fields (schema preservation property)
- For any lesson in `knowledge/index.md` Lessons table, verify corresponding file exists at listed path (referential integrity property)

### Integration Tests

- Run full session-load → work → session-save cycle and verify both palace/ and knowledge/ updated
- Run session-load on migrated workspace and verify no errors from missing JSON files
- Run session-save with dirty=true and verify `evolution.md` gets audit row even when no new lesson exists
- Verify search-index.md can be used to find sessions that were previously only findable via JSON indexes
