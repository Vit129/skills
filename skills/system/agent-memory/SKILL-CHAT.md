---
name: agent-memory-for-chat
description: >
  Lightweight persistent memory + learning system for chat apps (Claude, ChatGPT, Gemini).
  No file system required — memory lives in-context and as a copy-paste Memory Block.
  Use when: "save memory", "load context", "remember this", "what did we do last time",
  "save session", "update memory", "load my memory".
  Works in: Claude Desktop, Claude.ai Projects, ChatGPT, Gemini, any chat interface.
concurrency: unsafe
isolation: shared
---

# Agent Memory Lite — Chat Mode

Persistent memory for chat apps without file system access.

```text
Memory Block  = compact Markdown block stored in Project Instructions / Custom Instructions
In-context    = agent tracks state during the current conversation
Session Save  = agent outputs updated Memory Block → user copies and saves
```

## How It Works

**No files.** Memory lives in two places:
1. **In-context** — agent tracks decisions, lessons, open threads during the conversation
2. **Memory Block** — a compact Markdown block the user stores in Project Instructions / Custom Instructions / Gems / Notes

**Workflow:**
```
Session Start: User pastes Memory Block → agent reads it → loads context
During Work:   Agent tracks decisions, lessons, open threads in-context
Session End:   Agent outputs updated Memory Block → user copies and saves
```

---

## Platform Setup

### Claude Projects (claude.ai / Claude Desktop)
- Create a Project → paste Memory Block into Project Instructions
- Memory persists across all conversations in that project

### ChatGPT Custom Instructions
- Settings → Personalization → Custom Instructions
- Paste Memory Block in "What would you like ChatGPT to know about you?"
- Or use ChatGPT Memory: say "Remember: [fact]" during conversation

### Gemini Gems / Saved Info
- Create a Gem → paste Memory Block as instructions
- Or: Settings → Saved Info → paste Memory Block

### Any Chat App
- Keep Memory Block in Notes/Obsidian
- Paste at start of each session: "Here's my memory context: [paste block]"

---

## Memory Block Format

This is the only "file" — a compact Markdown block:

```markdown
<!-- MEMORY BLOCK v2 | Updated: YYYY-MM-DD -->

## Context
- Domain: {what this memory is about}
- Focus: {current focus}
- Sessions: {count}

## Recent Sessions
| Date | Topic | Summary |
|------|-------|---------|
| YYYY-MM-DD | {topic} | {1-line summary} |

## Open Threads
- [ ] {unresolved item}

## Key Facts
- {stable fact 1}
- {stable fact 2}

## Knowledge
### Lessons
| ID | Domain | Summary | Applied | Prevented |
|----|--------|---------|---------|-----------|
| L001 | {domain} | {lesson} | 0 | 0 |

### Patterns
| ID | Summary | Score |
|----|---------|-------|
| P001 | {pattern} | 5.0 |

## Consolidation
- sessions_since: {N}
- last: YYYY-MM-DD
<!-- END MEMORY BLOCK -->
```

---

## Session Start

When user pastes a Memory Block or says "load memory":

1. Parse the Memory Block silently
2. Load: Context, Recent Sessions, Open Threads, Key Facts, Knowledge
3. Score-based routing: match current prompt against Lessons/Patterns by domain + keyword
   - Prefer lessons with higher Applied+Prevented scores (top 2)
4. Nudge check (max 2):
   - Consolidation due? (sessions_since >= 5 OR days >= 7)
   - Open thread relevant to current task?
5. Brief user: last session summary + open threads + relevant knowledge
6. dirty=false

If no Memory Block provided → bootstrap empty block, ask user to save it.

---

## Session Save

When user says "save memory", "save session", "update memory block":

### Save/Discard Gate

Before saving a lesson or pattern, evaluate 3 criteria:
- **Novel**: not already covered by an existing lesson
- **Likely to recur**: the problem pattern may appear again
- **Non-trivial**: the fix is not obvious or single-step

Score >= 2/3 → save. Score < 2/3 → discard silently.

### Save Steps

1. Evaluate new lessons/patterns through Save/Discard Gate
2. Update in-context state:
   - Add row to Recent Sessions (keep last 10)
   - Update Open Threads (check off completed, add new)
   - Update Key Facts (add/update stable facts)
   - Add passing lessons/patterns to Knowledge
   - Increment sessions_since_consolidation
3. Score increment: if a lesson was actively used this session → Applied++; if recognizing it prevented a problem → Prevented++
4. Output the complete updated Memory Block in a code block
5. Tell user: "Copy this Memory Block and paste it into [platform instructions]"

---

## Consolidation

When sessions_since >= 5 OR days_since >= 7:
- Merge duplicate lessons (same domain + keyword overlap)
- Archive old sessions (keep last 5 in block, summarize older ones in Key Facts)
- Auto-crystallize: if 3+ lessons share same domain AND keyword → create a Pattern entry
- Reset sessions_since to 0
- Output consolidated Memory Block

---

## Dirty Tracking

Track in-context during session:
- dirty=false at start
- dirty=true when: decision made, lesson learned, fact changed, thread opened/closed
- If dirty=false at end → no save needed, tell user: "No changes to save this session."

---

## Non-Negotiables

- Never claim to "read a file" — memory comes from the pasted Memory Block only
- Always output the complete updated Memory Block (not a diff) so user can replace the old one
- Keep Memory Block compact — if >50 lines, consolidate before saving
- Verify facts from Memory Block before acting on them ("according to your memory...")
- Never store secrets, credentials, or PII in the Memory Block

