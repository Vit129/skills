---
id: LESSON-TOOLING-005
domain: tooling
type: workflow
status: active
confidence: 0.95
created: 2026-04-27
updated: 2026-04-27
---

# Always Sync Both Hook Sets (Kiro + Claude Code)

## Summary

When updating agent-memory hooks, always sync both Kiro hooks (`.kiro/hooks/`) and Claude Code hooks (`.claude/hooks/`). They share the same logic but live in different locations.

## Detail

The agent-memory system runs on both Kiro and Claude Code. Hook templates live at `skills/system/hook-creator/templates/kiro/` and must be copied to both `.kiro/hooks/` (Kiro active) and `.claude/hooks/` (Claude Code active). If only one set is updated, the other falls behind and loses features like nudges, routing, crystallization, or consolidation counter.

## Apply Next Time

- After editing any hook template, copy to both `.kiro/hooks/` and `.claude/hooks/`.
- Verify both with JSON validation.
- Check version numbers match across all 3 locations (template, Kiro active, Claude Code active).

## Evidence

- 2026-04-27: Claude Code hooks were v3.0.0/simplified while Kiro hooks were v3.1.0/v6.0.0 full-feature. Synced both.
