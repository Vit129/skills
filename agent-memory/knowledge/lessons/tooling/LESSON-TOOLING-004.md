---
id: LESSON-TOOLING-004
domain: tooling
type: workflow
status: active
confidence: 0.95
created: 2026-04-26
updated: 2026-04-26
---

# Session Save Needs A Knowledge Sync Gate

## Summary

Dirty session saves must always touch Markdown knowledge. If no new reusable lesson exists, the hook should still append an audit row to `knowledge/evolution.md`.

## Detail

The old save hook could update palace state while leaving knowledge unchanged, and its timeout fallback explicitly saved `state.md` only. That made knowledge drift predictable. Hook v6.0.0 replaces this with a mandatory Knowledge Sync Gate and a minimal safe save that updates both palace and knowledge.

## Apply Next Time

- Never allow `state.md only` as a memory-save fallback.
- For every dirty save, update `knowledge/index.md`, a domain lesson index, or `knowledge/evolution.md`.
- Verify no `agent-memory/**/*.json` files were created or updated.

## Evidence

- 2026-04-26: Updated Kiro hook template and installed `.kiro/hooks` save hook to v6.0.0.
