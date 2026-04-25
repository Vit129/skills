# Hook Versions — agent-memory-save

Tags: #hook #agent-memory #versioning
Last_Updated: 2026-04-20

## Decision
Rewrote all hooks in `settings.json` to align with agent-memory spec after restructure.

## Version Comparison
| Version | Path | Save scope | Verification | Prompt size |
|---------|------|-----------|--------------|-------------|
| v1 | .claude/memory/ | state.md only | ❌ | verbose ~10 lines |
| v2 | .memory/ | state.md only | ❌ | verbose ~15 lines |
| v3.5 | .memory/ | state.md only | ❌ | compressed 3 lines |
| v4.0 | agent-memory/palace/ | full 5-step workflow | ✅ verify before confirm | references session.md |

## Why v4.0
- v3.5 root cause of data drift: only updated state.md, wings/rooms/knowledge never touched
- v4.0 references session.md for full workflow (admission → wings → learning → sync → verify)
- Verification step: checks all touched wings updated before confirming ✅
- If verify fails → ⚠️ Incomplete instead of false ✅
- SessionStart also fixed: loads from correct `agent-memory/palace/` path

## Gap Found (2026-04-20)
- state.md was updated Apr 20 but all wings stuck at Apr 19
- Root cause: Stop hook only wrote state.md with old `.memory/` path
- Fix: GOTCHA #22 added, hooks rewritten to v4.0
