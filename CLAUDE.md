# Claude Agent Workspace — ~/.claude

@plugins/marketplaces/ponytail/AGENTS.md
@agent-memory/USER-PROFILE.md

## What loads automatically

```
~/.claude/
  rules/core.md          — DO/DON'T, response format, trust priority (auto)
  rules/routing.md       — skill/agent routing, AIDLC gates (auto)
  agent-memory/
    USER-PROFILE.md      — user identity, preferences (auto)
  plugins/marketplaces/ponytail/AGENTS.md — lazy senior dev mode (auto)
```

On-demand (load when needed):
- `rules/coding.md` — coding principles (load before coding tasks)
- `agent-memory/CONTEXT.md` — active task state (load on continuation)
- `agent-memory/INDEX.md` — plans + knowledge catalog (load when searching)
- `agent-memory/MEMORY.md` — past decisions + lessons (grep, never read full)
- `agent-memory/knowledge/` — domain reference docs
- `agent-memory/PLAYBOOK.md` — index to `knowledge/cases/`

Grep command: `grep -rn "<keyword>" agent-memory/MEMORY.md agent-memory/knowledge/`

---

## Session Start

- New task → read `rules/coding.md` before writing code
- Continuation ("ทำต่อ", "continue") → read `CONTEXT.md` → derive task type → invoke matching skill
- Search/plan → read `INDEX.md` on-demand

---

## Agent Routing

| Task | Agent |
|------|-------|
| Read / explore structure | Gemini 3 Flash + Graphify |
| Plan / architecture | Claude (main) |
| Code / implement / fix | Codex (`gpt-5.4-mini`) |

Browser: **Harness MCP first** (`harnessBrowserOpen` → `harnessBrowser*`). Fall back only when Harness lacks the capability.

Skills: invoke via `Skill()` tool or `/skill-name`. Check `rules/routing.md` for keyword→skill table.

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
