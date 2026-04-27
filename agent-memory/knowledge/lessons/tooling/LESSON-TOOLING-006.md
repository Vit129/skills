---
id: LESSON-TOOLING-006
domain: tooling
type: pattern
status: active
confidence: 0.90
created: 2026-04-27
updated: 2026-04-27
---

# CLAUDE.md Reference Pattern Replaces Hooks for Token Efficiency

## Summary
Add `agent-memory/palace/state.md` and `agent-memory/knowledge/index.md` to the Required Reading section of CLAUDE.md (or CODEX.md / GEMINI.md). The agent reads these on session start without any hook overhead.

## Detail
Hooks that use `askAgent` fire an LLM call on every session start — expensive in tokens. CLAUDE.md is already read by Claude Code / Codex / Gemini on every session as part of the system prompt. Adding memory file paths to Required Reading achieves the same result at near-zero token cost.

## Apply Next Time
- Add to CLAUDE.md Required Reading:
  ```markdown
  4. **[agent-memory/palace/state.md](agent-memory/palace/state.md)** — Active Session State
  5. **[agent-memory/knowledge/index.md](agent-memory/knowledge/index.md)** — Knowledge Index (keyword routing)
  ```
- Remove or disable memory-load hook if CLAUDE.md reference is in place
- For Kiro: use Steering file (static inject) instead of askAgent hook

## Evidence
- 2026-04-27: HA CLAUDE.md already has state.md in Required Reading; My Investment Port CLAUDE.md same pattern
- Confirmed: agent reads CLAUDE.md every session → no hook needed for memory bootstrap
