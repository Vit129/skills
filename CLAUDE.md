# Claude Agent Workspace — ~/.claude

@plugins/marketplaces/ponytail/AGENTS.md
@agent-memory/USER-PROFILE.md

## Session Start

- New task → read `rules/coding.md` before writing code
- Continuation ("ทำต่อ", "continue") → read `CONTEXT.md` → derive task type → invoke matching skill
- Search/plan → read `INDEX.md` on-demand

---

## Infrastructure

- **Headroom Proxy** (`localhost:8787`) — token compression 47–92%. Always-on via `.zshrc` env vars.
- **Ponytail** — lazy senior dev mode, always-on (`full` mode).

---

## Graphify

```bash
graphify query "..."   # focused question
graphify explain "X"   # concept/symbol
graphify path "A" "B"  # dependency path
```

Graphified projects auto-load `@graphify-out/GRAPH_SUMMARY.md` via their own CLAUDE.md.
After update: `graphify update . && ~/.claude/scripts/generate-graph-summary.sh .`

---

## Memory Lifecycle

**Task start:** read `CONTEXT.md` on-demand → grep knowledge on-demand
**During:** Update CONTEXT.md; append decisions to MEMORY.md
**Task end:** Rewrite CONTEXT.md; append to MEMORY.md; update INDEX.md if new files

Promote patterns: fix/pattern → `knowledge/cases/` + PLAYBOOK.md index; domain → `knowledge/{domain}.md`
