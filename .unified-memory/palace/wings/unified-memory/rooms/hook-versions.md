# Hook Versions — memory-palace-save

Tags: #hook #memory-palace #versioning
Last_Updated: 2026-04-13

## Decision
Updated `memory-palace-save.kiro.hook` from v2 → v3.5 (from template).

## Version Comparison
| Version | Path | SKIP logic | Thread cleanup | Prompt size |
|---------|------|-----------|----------------|-------------|
| v1 | .claude/memory/ | ❌ | ❌ | verbose ~10 lines |
| v2 | .memory/ | ✅ | mark [x] + purge >2 sprints | verbose ~15 lines |
| v3.5 | .memory/ | ✅ | 14-day grace period | compressed 3 lines |

## Why v3.5
- Shorter prompt = less token per session
- 14-day grace period clearer than "2 sprints"
- `✓ Memory Palace updated` feedback to user
- C1/C2 labels help AI decide SKIP/SAVE faster
