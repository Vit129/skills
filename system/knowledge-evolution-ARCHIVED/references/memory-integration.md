# Memory Palace Integration Protocol

Connects the knowledge base to Memory Palace for cross-session tracking.
Memory Palace = tracking layer. Index files = source of truth.

---

## 1. Knowledge-Evolution Wing Structure

Create this wing in any project's `.memory/` folder:

```
.memory/wings/knowledge-evolution/
├── hall.md                      ← index: top templates + lesson stats
├── rooms/
│   ├── template-health.md       ← utility scores + trends per domain
│   ├── lesson-effectiveness.md  ← which lessons prevented failures
│   ├── gap-tracker.md           ← domains with missing rules/templates
│   └── routing-log.md           ← routing decisions this session
└── closets/
    └── knowledge-state.md       ← AAAK summary (when rooms >80 lines)
```

---

## 2. Hall.md Template

```markdown
# Knowledge Evolution — Hall

Last updated: {date}

## Template Health Summary
| Domain | Top Template | Score | Used |
|--------|-------------|-------|------|
| auth   | apiAuth     | 8.5   | 12x  |
| finance| paymentFlow | 7.2   | 8x   |

## Lesson Effectiveness Summary
| Domain | Top Lesson | Prevented |
|--------|-----------|-----------|
| api    | LESSON-API-EMR-001 | 3x |

## Flags
- ⚠️ Templates with score <3.0: {list or "none"}
- 📝 Auto-captured (unreviewed): {count}
- 🔴 Gaps (no template): {domains}

## Rooms
- [template-health](rooms/template-health.md)
- [lesson-effectiveness](rooms/lesson-effectiveness.md)
- [gap-tracker](rooms/gap-tracker.md)
- [routing-log](rooms/routing-log.md)
```

---

## 3. Session Start Protocol

At the start of a session involving knowledge use:

1. Load `knowledge-evolution/hall.md` (if exists)
2. Brief the context:
   > "📚 Knowledge state: {top template} score={score}, {top lesson} prevented={n}x failures.
   > ⚠️ Flagged: {flagged templates}. Gaps: {missing domains}."
3. Load `routing-log.md` to avoid re-routing same decisions

---

## 4. Session End Protocol

At the end of a session where knowledge was used:

1. Update `rooms/template-health.md` with scores changed this session
2. Update `rooms/lesson-effectiveness.md` with lessons applied
3. Update `rooms/gap-tracker.md` if new gaps discovered
4. Append to `rooms/routing-log.md`:
   ```
   {date}: Used {template_id} (score: {before}→{after}), Applied {lesson_id} (prevented: {bool})
   ```
5. If any room >80 lines → compress to `closets/knowledge-state.md` using AAAK
6. Update `hall.md` summary
7. **Sync back to index files** (see Section 5)

---

## 5. Write-Back Sync

Memory Palace tracks scores in-session. At session end, sync back to source of truth:

```
Sync protocol:
1. Read knowledge-evolution/rooms/template-health.md
2. For each score change recorded:
   → Update corresponding entry in knowledge/automation/*/Index.json
3. Read lesson-effectiveness.md
4. For each effectiveness change:
   → Update corresponding entry in knowledge/lessons/*/Index.json
5. Confirm sync complete → log in routing-log.md
```

This keeps index files authoritative. Memory Palace is the session buffer.

---

## 6. AAAK Compression for Knowledge State

When `knowledge-state.md` closet needs updating, use this format:

```
KNOWLEDGE-STATE @{date}
TEMPLATES: auth/apiAuth=8.5(12x) finance/paymentFlow=7.2(8x) | FLAGS: none
LESSONS: api/EMR-001=prevented:3 webUi/NAV-002=prevented:1 | AUTO-CAPTURED: 2(unreviewed)
GAPS: mobile/payment(no template) | ROUTING: intent-match:85% keyword-fallback:15%
LAST-SYNC: {date} → index files updated
```

---

## 7. Tunnel Patterns

Add to `tunnels.md` when knowledge-evolution wing exists:

```markdown
## Knowledge ↔ Project Tunnels

(knowledge-evolution, template-health) → ({project-wing}, api-testing)
  Purpose: Track which templates were used in project tests
  Sync: session-end write-back

(knowledge-evolution, lesson-effectiveness) → ({project-wing}, debugging)
  Purpose: Track which lessons were applied during debugging
  Sync: session-end write-back

(knowledge-evolution, gap-tracker) → ({project-wing}, backlog)
  Purpose: Gaps in knowledge = potential backlog items for knowledge curation
  Sync: manual (when gap is confirmed)
```

---

## 8. Files to Modify

| File | Change |
|------|--------|
| `system/memory-palace/SKILL.md` | Add knowledge-evolution wing to Optional Features |
| `system/memory-palace/references/scaling-protocol.md` | Add Session Start/End knowledge protocol |
| `ai-dlc/core/memory-palace/SKILL.md` | Add knowledge tracking in workspace adapter section |
| `dev/storage/references/buffer-update.md` | Add write-back sync step at end of protocol |
