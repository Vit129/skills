# Skill Candidates (shadow-capture, staging only)

Staging area for reusable patterns hit during real sessions, captured immediately instead of
waiting for the 3x-occurrence threshold in `routing.md`'s Cross-Project Stack Detection section to
be noticed by memory alone.

**Status: shadow mode.** Files here are write-only right now:
- **Not loaded into any session's context.** No retrieval code reads this directory yet.
- **Not auto-promoted** to a real `~/.claude/skills/<name>/SKILL.md`.
- **Excluded from `sync-all.sh`** (`merge_skills_dir`'s rsync `--exclude`) — never reaches Codex/
  Gemini/Agents until a human promotes it manually.

This exists to produce real candidate examples before deciding the open question: should
promotion stay gated by `routing.md`'s 3x-occurrence rule (automate the *counting*, keep the
manual sign-off), or go threshold-free like Hermes Agent (auto-promote on first real hit)? That's
a real reversal of a decision the user made on purpose (anti-sprawl) — not to be decided by
silently building one or the other. See `agent-memory/knowledge/` (if a decision doc exists there)
before assuming.

## When to write one

Only when solving something took more than 2 real attempts (wrong approach tried, corrected) AND
the pattern is genuinely reusable (not project-specific, not a one-off) — not for every fix. This
mirrors `routing.md`'s existing 3x-promotion bar in spirit: a candidate here is evidence toward
that bar, not a shortcut around it.

## Format

```markdown
---
id: cand-YYYYMMDD-<short-slug>
name: <candidate-skill-name>
description: <one line — when this applies>
confidence_score: 0.5
hit_count: 1
created_at: <ISO8601>
last_used: <ISO8601>
source_project: <repo name or ~/.claude>
status: candidate
trigger_patterns:
  - "<keyword or phrase that should surface this>"
---

# <Title>

## Context & Problem
<what went wrong / what took >2 attempts>

## Learned Solution
<the pattern that actually worked>
```

## Promoting a candidate

Manual only, for now: read the file, decide if it's genuinely reusable (same bar as
`skill-creator`'s own judgment), then use `skill-creator` to build a real skill. Delete the
candidate file once promoted (or once it's clearly not worth promoting) — this directory is not
meant to accumulate indefinitely.
