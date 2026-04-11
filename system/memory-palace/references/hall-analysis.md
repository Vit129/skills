# Hall & State Analysis

How to manage halls, tunnels, state.md, and palace-level operations.
Combines: `analysis-concept/reverse-eng-concept.md` + `analysis-concept/gap-concept.md` + `ai-techniques/lats.md`

## 1. Hall Management

### 1.1: Hall as Wing Index

hall.md is the entry point for every wing. Keep it:
- ≤50 lines (split to hall-detail.md if exceeded)
- ≤200 tokens (for efficient loading)
- Always read hall.md BEFORE any room in that wing

### 1.2: Hall Update Protocol

When adding/removing rooms:
1. Update Rooms table atomically
2. Update Tags if new room introduces new concepts
3. Update Token_Estimate
4. Update Last_Updated
5. If hall.md >50 lines → split room descriptions to hall-detail.md immediately

### 1.3: Hall Health Check (from reverse-eng-concept Steps 1-4)

Periodically scan hall.md for issues:
- Room listed but file missing → log warning, mark "missing"
- Room exists but not listed → add to hall.md
- Tags outdated → update to reflect current rooms
- Token_Estimate wrong → recalculate

## 2. Tunnel Management

### 2.1: When to Create Tunnels

Create tunnel when:
- Room in Wing A references content in Wing B
- Decision in one wing affects another wing
- Shared concept spans multiple wings

### 2.2: Tunnel Format

```text
(Wing_A, Room_A) → (Wing_B, Room_B): {reason}
```

### 2.3: Tunnel Discovery (from discovery-domain-concept Phase 4)

When creating a new room, check:
- Does this topic relate to any other wing?
- Use Deep Abstraction: forget wing names, look at concept overlap
- If overlap found → create tunnel

## 3. State.md Management

### 3.1: State as Palace Map

state.md is the single source of truth for palace structure:
- ≤100 lines (refuse write if exceeded → prompt archive)
- Active Wings table
- Open Threads
- Recent Sessions (max 10 rows)

### 3.2: State Gap Analysis (from gap-concept Steps 1-3)

Compare state.md against actual file structure:

```text
Required: all wings in wings/ folder should be listed
Available: wings listed in state.md Active Wings
Gap: any wing folder not in state.md = orphan → add or archive
```

### 3.3: State Overflow Decision (from ai-techniques/lats.md)

When state.md approaches 100 lines:

- Sim 1: Archive old sessions → reduces lines, loses quick access
- Sim 2: Archive inactive wings → reduces Active Wings section
- Sim 3: Compress Open Threads (mark completed, remove old) → quick win
- Hybrid: compress threads first → archive sessions → archive wings last

### 3.4: Open Threads Cleanup

Periodically review Open Threads:
- [x] items older than 2 sprints → remove (already done)
- [ ] items with no recent activity → ask user if still relevant
- Duplicate threads → merge

## 4. Archive Decision (from ai-techniques/aot.md)

When deciding what to archive, use AoT exploration:

```text
[D1] Archive entire wing?
  ├─ ✅ Wing inactive >2 sprints → ARCHIVE
  ├─ ⚠️ Wing has 1 active thread → KEEP, archive old rooms only
  └─ ❌ Wing actively used this sprint → DO NOT ARCHIVE

[D2] Archive specific rooms?
  ├─ ✅ Room not referenced in 5+ sessions → ARCHIVE
  ├─ ⚠️ Room has raw/ files → archive raw/ first, keep room
  └─ ❌ Room referenced in open thread → DO NOT ARCHIVE
```

## 5. Palace Structure Reverse Engineering (from reverse-eng-concept)

When palace structure feels messy or undocumented:

1. Scan all wings/ folders → compare with state.md
2. Scan all rooms/ in each wing → compare with hall.md
3. Check tunnels.md → verify both endpoints exist
4. Check archive/index.md → verify paths exist
5. Document findings → update state.md, hall.md, tunnels.md

Output:
```text
Wings: [N] active, [N] archived, [N] orphan
Rooms: [N] total, [N] with closets, [N] missing from hall
Tunnels: [N] valid, [N] broken (endpoint missing)
Archive: [N] entries, [N] with summary.md
Issues: [list of problems found]
```
