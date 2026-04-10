# Memory Palace Scaling Protocol

Session loading, file schemas, archive system, and rolling distillation.

## 🔁 Session Workflow

### On Session Start

**Step-Back Protocol — zoom out before loading context:**

1. "What is the task?" — identify primary goal
2. "Which wings are relevant?" — don't load everything
3. "What did I decide last time?" — check open threads
4. "What's the token budget?" — plan before loading

**Loading procedure:**

1. Read `state.md` first (≤100 lines — palace map)
2. Extract task context: goal, domains touched, open threads, potential contradictions
3. Classify wings as Hot or Cold using Wing Classification CoT (see below)
4. Load Hot_Wings: read `hall.md` + closets fully
5. Represent Cold_Wings as single line: `{name} | {last_updated} | {description}`
6. Token budget check: if Hot_Wings total >2000 tokens → warn user, ask which wings to prioritize
7. Brief user on last session context

**Wing Classification CoT:**

```text
Step 1: Read state.md → list all active wings
Step 2: Extract task keywords → [keyword1, keyword2, ...]
Step 3: For each wing, score relevance (0–10):
  - wing-A: 8/10 (direct match on keyword1)
  - wing-B: 2/10 (no keyword match)
Step 4: Hot = score ≥ 5, Cold = score < 5
Step 5: Token budget check → sum Hot_Wing Token_Estimate values
         (default 200 tokens per wing if no Token_Estimate in hall.md)
Conclusion: Load [N] Hot_Wings, [M] Cold_Wings as summaries
```

**On-demand promotion:** Cold → Hot when task requires it — load `hall.md` for that wing on demand.

**File read order within a wing:**

```text
hall.md (≤200 tokens)
    ↓
closets/{room}.md  (AAAK compressed)
    ↓
rooms/{room}.md    (full detail, on demand)
    ↓
raw/YYYY-MM-DD-*.md  (verbatim, on demand only)
```

### On Session End

**SKIP saving if session was ONLY:**

- Q&A with no decisions made
- Comparisons without a conclusion
- Commit messages / git commands only
- Repeating information already in palace

**SAVE if session had ANY of:**

- File writes or code changes
- A decision made (even from a comparison)
- New open threads identified
- Architecture or design choices

If SAVE → apply Admission Control check first (see `references/admission-control.md`), then follow 10-step process.

## 📊 State File Schema

```markdown
# Palace State — {project}

Palace_Stats:
  wings_active: {n}
  wings_archived: {n}
  rooms_total: {n}
  last_full_load: YYYY-MM-DD

## Active Wings
| Wing | Last Updated | Summary |
|------|-------------|---------|
| {name} | YYYY-MM-DD | {one line} |

## Wing Index  ← (add when active wings > 10, grouped by domain)
### automation
- wing-a, wing-b
### ai-skills
- wing-c

## Cold Wings (Archived)
- {name} | archived YYYY-MM-DD | {one line}

## Open Threads
- [ ] {thread description} @{wing}

## Recent Sessions (max 10 rows)
| Date | Wing | Summary |
|------|------|---------|
| YYYY-MM-DD | {wing} | {one line} |
```

**Constraints:** ≤100 lines, no room-level detail, no code snippets.

- Session rows >10 → move oldest to `archive/{topic}/{year}/sessions.md`
- Inactive wings (>2 sprints) → archive and remove from active list
- state.md >100 lines → refuse write, prompt user to archive sessions first

## 🏛️ Hall File Schema

```markdown
# Hall: {wing_name}

Tags: #tag1 #tag2 #tag3
Token_Estimate: ~{n} tokens
Last_Updated: YYYY-MM-DD

## Purpose
{1–2 sentences describing wing purpose}

## Rooms
| Room | Description |
|------|-------------|
| rooms/{name}.md | {one line} |

## Connections (Tunnels)
- → {other_wing}/{room}: {reason}
```

**Constraints:** ≤50 lines. If exceeded → auto-split room descriptions to `hall-detail.md`.

- Always read `hall.md` before any room file within a wing
- Update `hall.md` atomically when adding/removing rooms
- hall.md >50 lines → split room descriptions to `hall-detail.md` immediately

## 🔗 Tunnel File Schema

```markdown
# Tunnels

(Wing_A, Room_A) → (Wing_B, Room_B): {reason}
```

One triple per line.

## 🏷️ Keyword Tag Search

- Every room and closet file must have a `Tags:` line with 3–7 `#tag` entries
- Tags: line with <3 or >7 tags → warn and request correction
- Archive index search: read `archive/index.md` first, return wing name + summary + date range only
- Load specific room/closet only when user requests detail after search result
- Archive index must be updated atomically

## 🗂️ Archive System

### Archive Index Schema

```markdown
# Archive Index

## {YYYY-MM-DD} — {wing_name}
Tags: #tag1 #tag2 #tag3
Summary: {one line}
Date Range: YYYY-MM-DD – YYYY-MM-DD
Status: archived | restored
Path: archive/{topic}/{year}/
```

**Constraints:** ≤200 lines, sorted most-recently-archived first.

- archive/index.md >200 lines → split to `index.md` (recent 2 years) + `index-{year}.md`

### When to Archive

- Wing has no activity for >2 sprints (or user says "archive {wing}")
- Recent Sessions in state.md >10 rows → move old rows to `archive/{topic}/{year}/sessions.md`
- User explicitly requests archival

### How to Archive

1. Move entire wing folder from `wings/{topic}/` to `archive/{topic}/{year}/`
2. Create/update `archive/{topic}/summary.md` with AAAK snapshot
3. Update `archive/index.md` atomically with new entry
4. Remove wing from `state.md` Active Wings, add to Cold Wings section
5. Move related tunnel entries to archive if both wings are archived
6. Move raw files to `archive/{topic}/{year}/raw/`
7. Failed archival → rollback (restore wing folder if already moved, do not update index.md)

### How to Search Archives

1. Read `archive/index.md` → find topic by keyword/tag
2. Return: wing name + summary + date range only (do NOT load room files)
3. User requests detail → load specific room/closet only
4. Read `archive/{topic}/summary.md` → get overview before drilling down

### Restore from Archive

1. Copy wing folder from `archive/{topic}/{year}/` back to `wings/{topic}/`
2. Re-add to `state.md` Active Wings
3. Mark restored in `archive/index.md` (Status: restored)

## 🔄 Rolling Distillation

Every 5 sessions in the same wing:

1. Compress recent sessions into a closet update (AAAK summary)
2. Move raw session details to `archive/{topic}/{year}/sessions.md`
3. Keep only closet + last 2 sessions in active wing

## 📦 Raw Verbatim Storage

**Read order:** closet → room → raw (only when exact reasoning needed)

**Create raw file for:**

- Architecture decisions with complex reasoning
- Hard-to-debug errors + full debug process
- Important agreements / conclusions with exact wording
- Any context where loss would require significant re-work

**Skip raw file for:** Q&A, routine code changes, info already in room

**Raw File Rules:**

- Naming: `raw/YYYY-MM-DD-{short-description}.md` only
- Add `## Raw References` section in room file when creating a raw file
- Move raw files to `archive/{topic}/{year}/raw/` when wing is archived
- Apply admission control (score ≥ 0.6) before creating raw file

### Room File Schema

```markdown
---
Tags: #tag1 #tag2 #tag3
Closet: closets/{filename}.md   ← (add when room >80 lines)
---

# {Room Title}

{content}

## Raw References
- YYYY-MM-DD: raw/YYYY-MM-DD-{desc}.md — {one line description}
```

Room >80 lines → create closet + add `Closet:` reference at top of room file.

## ⚠️ Error Handling

| Situation | Behavior |
|-----------|---------|
| `state.md` not found | Initialize new palace — not an error |
| `hall.md` missing for listed wing | Log warning, skip wing, continue session |
| Room file referenced in hall.md missing | Log warning in hall.md as "missing", update hall.md |
| `state.md` >100 lines | Refuse write, prompt user to archive sessions first |
| `hall.md` >50 lines | Auto-split to `hall-detail.md` immediately |
| Raw file name doesn't match pattern | Reject, return error with correct format example |
| Tags: line has <3 or >7 tags | Warn and request correction |
| `archive/index.md` not found during search | Return "no archive index found" — not an error |
| Archival fails mid-operation | Rollback: restore wing folder, do not update index.md |
| `index.md` >200 lines | Split before writing new entry |
| No `Token_Estimate` in hall.md | Use default 200 tokens per wing |
| User doesn't respond to budget warning | Load only wings with most recent `last_updated` |
