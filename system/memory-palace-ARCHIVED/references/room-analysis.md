# Room Analysis

How to discover, create, extend, and compress rooms within a wing.
Combines: `analysis-concept/discovery-domain-concept.md` + `analysis-concept/gap-concept.md` + `analysis-concept/context-concept.md`

## 1. Room Discovery (Before Creating New Room)

From discovery-domain-concept Phases 2-3:

### 1.1: Search Existing Rooms

1. Read hall.md of the target wing → list all rooms
2. Read closets/ for quick overview of each room's content
3. Deep Abstraction Match: does any existing room cover this topic?

```text
Forget room names — look at concept:
"auth-decisions" might cover "jwt-architecture" (same abstract concern)
"api-testing-setup" might cover "playwright-config" (same tooling concern)
```

4. Classify:
   - `reuse` → write into existing room
   - `extend` → add section to existing room
   - `create` → ONLY if no existing room covers this concept

**Anti-Redundancy Rule:** Never create duplicate rooms.

### 1.2: Similar Rooms Search (In-Context Learning)

- Search rooms with similar tags or purpose across ALL wings (not just current)
- Read top 2-3 most relevant rooms
- Extract: structure, conventions, AAAK patterns used

## 2. Room Gap Analysis (What Context Is Missing?)

From gap-concept Steps 1-4:

### 2.1: Extract Required Context

- What context does this task need?
- What decisions need to be recorded?
- What facts need to be tracked?

### 2.2: Match Against Available Rooms

- Direct Match → room has exactly what's needed
- Partial Match → room has related info, needs update
- No Match → new room needed

### 2.3: Prioritize Gaps

- **Critical** → task can't proceed without this context
- **High** → wrong decisions without this context
- **Medium** → slower work without this context
- **Low** → nice to have

## 3. Room Creation

Only after Discovery confirms "create":

1. Create `wings/{topic}/rooms/{room-name}.md` with Tags (3-7)
2. Update `wings/{topic}/hall.md` Rooms table
3. If room relates to other wings → add tunnel in `tunnels.md`

## 4. Room Content — Structured Extraction (Session End)

From context-concept Phase 2:

When saving session content to a room:

1. Extract functional facts — what was done, what changed
2. Extract decisions — what was decided and why
3. Identify rules — constraints, patterns established
4. Identify dependencies — what this connects to

### Conflict Check (from context-concept Phase 3)

Before writing to an existing room:
- Search for existing facts on same subject
- Same meaning → skip (no-op)
- Updated/superseded → overwrite + temporal triple
- Contradicts → warn user before overwriting

## 5. Room Compression (Closet Creation)

When room >80 lines:

1. Create `wings/{topic}/closets/{room-name}.md`
2. Compress using AAAK principles:
   - Symbols, abbreviations, structural shorthand
   - Context Pinning: "Current Truth" pointer
   - Relational Links: `->`, `=>`, temporal markers
3. Add `Closet: closets/{room-name}.md` reference at top of room file
4. Read order: closet first → room only when detail needed

## 6. Room Reusability Score

From discovery-domain-concept Phase 6:

- Formula: (reuse + extend items) / total required × 100
- 🟢 >80% — mostly covered by existing rooms
- 🟡 60-80% — some new rooms needed
- 🔴 <60% — significant new content needed, consider new wing

## 7. Common Pitfalls

- ❌ Creating new room without checking hall.md → Fix: always read hall.md first, search existing rooms
- ❌ Writing to room without conflict check → Fix: search for existing facts on same subject before writing
- ❌ Room growing past 80 lines without closet → Fix: create closet immediately when room >80 lines
- ❌ Forgetting to update hall.md after creating room → Fix: hall.md update is mandatory
- ❌ Missing Tags line → Fix: every room needs 3-7 tags
- ❌ Duplicating content across rooms → Fix: use tunnels to link, don't copy

## 8. Self-Review (before committing room changes)

After creating or modifying a room, challenge yourself:

1. **Pre-mortem:** "If I need this info next session, will I find it here?"
2. **Redundancy check:** "Is this content already in another room (even in a different wing)?"
3. **Completeness check:** "Did I capture the decision AND the reasoning, not just the outcome?"
4. **Temporal check:** "Did I add temporal markers so future sessions know WHEN this was true?"
