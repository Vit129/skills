---
name: curator
description: >
  Autonomous skill/knowledge maintenance agent. Grades, consolidates, and prunes
  skills and knowledge files on a periodic basis or on-demand.
  Triggers: "curate skills", "grade knowledge", "prune dead skills", "consolidate skills",
  "curator run", "skill health check", "knowledge maintenance", "ดูแล skill", "จัดระเบียบ knowledge".
  Can run as: manual (user triggers), hook-driven (agentStop/cron), or subagent.
---

# Curator — Autonomous Skill & Knowledge Maintenance

Inspired by Hermes Agent's Autonomous Curator. Grades, consolidates, and prunes
your skill library and knowledge base — all via markdown files, no database.

## When to Use

- Periodically (every 7 days or after 10+ sessions)
- When `knowledge/` has 10+ files and you suspect duplication
- When skills haven't been used in 30+ days
- On-demand: user says "curate" or "skill health check"

## How It Works

```
Curator Agent
    ↓
1. Scan → inventory all skills + knowledge files
2. Grade → score each by usage + recency + quality
3. Consolidate → merge duplicates / overlapping patterns
4. Prune → archive unused items (never delete)
5. Report → write curator-report.md
```

## Grading Rubric

Read `references/grading-rubric.md` for:
- Usage score (from knowledge index or playbook Applied column)
- Recency score (last modified date)
- Quality score (completeness, no TODOs, has examples)

## Consolidation Rules

Read `references/consolidation-rules.md` for:
- When 2+ knowledge files share 70%+ trigger keywords → merge
- When 2+ skills serve the same role → propose merge to user
- Output: consolidated file + redirect note in original location

## Pruning Rules

Read `references/pruning-rules.md` for:
- Archive threshold: 0 usage in 30 days + quality score < 3/10
- Archive location: `knowledge/archive/` (skills) or `agent-memory/knowledge/archive-playbook.md` (cases)
- Never delete — always archive with metadata

## Running the Curator

### Manual
```
User: "curate skills" or "run curator"
Agent: loads this skill → executes scan/grade/consolidate/prune → writes report
```

### Hook-driven (recommended)
- Event: `agentStop` or `userTriggered`
- Action: `askAgent` with prompt "Run curator pass on knowledge/ and skills/"
- Frequency: track last run date in `agent-memory/curator-state.md`

### As Subagent
- Orchestrator dispatches curator as a background task
- Curator has read/write access to `knowledge/` and `agent-memory/` only
- Reports back with changes made

## State File

`agent-memory/curator-state.md` — tracks:
- Last run date
- Skills graded (count)
- Items consolidated (count)
- Items archived (count)

## Output

After each run, write `agent-memory/curator-report.md`:

```markdown
# Curator Report — {date}

## Summary
- Scanned: {N} skills, {M} knowledge files
- Graded: {N} items
- Consolidated: {X} merges
- Archived: {Y} items
- No action: {Z} items (healthy)

## Actions Taken
| Item | Action | Reason |
|------|--------|--------|
| knowledge/lessons/api/old-pattern.md | archived | 0 usage, 45 days stale |
| knowledge/automation/api/auth-v1.md + auth-v2.md | consolidated | 80% overlap |

## Recommendations
- Consider reviewing: {skill} (low quality score but recent usage)
```

## Constraints

- **Markdown only** — no SQL, no JSON DB, no external services
- **Never delete** — always archive (move to archive/ subfolder)
- **User skills are sacred** — only consolidate/archive with clear evidence
- **Bundled skills untouchable** — curator cannot modify skills in `rules/` or `core/aidlc/`
- **Report before act** — if unsure, write recommendation instead of acting

## ⚠️ Gotchas

- **Over-pruning** — don't archive skills that are seasonal (used only during certain project types)
- **False consolidation** — two files may look similar but serve different contexts (API vs Mobile)
- **Stale ≠ useless** — a skill used once a quarter for critical tasks should not be pruned
