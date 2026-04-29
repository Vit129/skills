---
id: LESSON-TOOLING-008
domain: tooling
type: pattern
status: active
applied: 2
prevented: 1
confidence: 1.0
created: 2026-04-29
updated: 2026-04-29
keywords: aidlc, vibe-mode, spec-mode, kiro-ide-mode, detection, dialog-ux, artifact-path
---

# LESSON-TOOLING-008: AIDLC Vibe/Spec Mode — 3 Design Corrections

## Summary

When designing AIDLC Vibe/Spec mode for Kiro IDE, three assumptions were wrong in the initial implementation.

## Corrections

### 1. Detection = Kiro IDE mode, not keyword in chat

**Wrong:** Agent detects "vibe"/"spec" keyword typed by user in chat.
**Right:** Kiro IDE has built-in Vibe mode and Spec mode. User selects in UI — never types it. Agent reads the Kiro context/mode, not chat keywords.

User always uses Autopilot mode — so detection must come from Kiro's mode context, not prompt parsing.

### 2. Spec artifacts → `.aidlc/` not `.kiro/specs/`

**Wrong:** `kiro-spec-integration.md` exported artifacts to `.kiro/specs/{feature}/`.
**Right:** Both Vibe and Spec modes write ALL artifacts to `.aidlc/[system]/[feature]/`. The `.kiro/specs/` path is Kiro's own spec system — AIDLC does not write there.

### 3. Dialog UX = global rule for ALL AIDLC interactions, ALL AI agents

**Wrong:** Only Kiro Spec mode uses dialog message format.
**Right:** Dialog message format is a **global rule** for every AIDLC phase interaction, regardless of which AI agent is running (Kiro, Claude Code, Gemini, or any other). Reason: dialog format is easier to read and easier to track progress than plain chat.

This applies to: Vibe mode, Spec mode, Full mode, QA Only, Dev Only — every mode, every agent.

## Files to Fix

- `references/vibe-mode.md` — remove keyword detection, add Kiro IDE mode detection
- `references/kiro-spec-integration.md` — remove `.kiro/specs/` target, clarify `.aidlc/` is the only target
- `references/workflow.md` — fix Mode Selection detection logic
- `core/aidlc/SKILL.md` — fix Pre-Flight Mode Detection section
