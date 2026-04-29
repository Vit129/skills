---
id: LESSON-TOOLING-007
domain: tooling
type: pattern
status: active
applied: 1
prevented: 0
confidence: 1.0
created: 2026-04-29
updated: 2026-04-29
keywords: agent-memory, memory-routing, global-skill, project-skill, .claude/agent-memory, target-selection
---

# LESSON-TOOLING-007: Agent Memory Target Routing Rule

## Summary

When saving agent memory, the target (`/Users/supavit.cho/.claude/agent-memory/` vs `{project}/agent-memory/`) must be chosen based on **what was changed**, not which workspace is open.

## Rule

| What changed | Target |
|---|---|
| Global skill files (`/Users/supavit.cho/.claude/skills/`) | `.claude/agent-memory/` |
| Global hooks/rules/config (`/Users/supavit.cho/.claude/`) | `.claude/agent-memory/` |
| Skill design decisions (cross-project) | `.claude/agent-memory/` |
| Project source code, project config | `{project}/agent-memory/` |
| Both global + project files | Both targets |
| No files written, decisions in Kiro workspace | `{workspace}/agent-memory/` |

## Root Cause of Mistake

AIDLC Vibe/Spec mode design was saved to `My Investment Port/agent-memory/` because the Kiro workspace was "My Investment Port". But the design is for a **global skill** (`/Users/supavit.cho/.claude/skills/ai-dlc/`) — it should go to `.claude/agent-memory/`.

## Prevention

Before saving: ask "Is this about a global skill/hook/rule, or a project-specific feature?"
- Global skill/hook/rule → `.claude/agent-memory/`
- Project feature → `{project}/agent-memory/`
- Both → both targets
