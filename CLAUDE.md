# Claude Agent Workspace — ~/.claude

@plugins/marketplaces/ponytail/AGENTS.md

## What loads automatically

```
~/.claude/
  rules/core.md          — DO/DON'T, response format, trust priority
  rules/routing.md       — skill/agent routing, AIDLC gates, continuation detection
  rules/coding.md        — coding principles, citation format, commit style
  agent-memory/
    CONTEXT.md           — active task, branch, status (auto-loaded)
    INDEX.md             — catalog of plans + knowledge (auto-loaded)
    USER-PROFILE.md      — user identity, preferences (auto-loaded)
  skills/                — 84 skills, invoked on-demand via Skill() or /skill-name
```

Cross-session memory (auto-loaded):
- @agent-memory/CONTEXT.md
- @agent-memory/INDEX.md
- @agent-memory/USER-PROFILE.md

On-demand (grep, never read full):
- `agent-memory/MEMORY.md` — past decisions + lessons
- `agent-memory/knowledge/` — domain reference docs
- `agent-memory/PLAYBOOK.md` — index to `knowledge/cases/`

Grep command: `grep -rn "<keyword>" agent-memory/MEMORY.md agent-memory/knowledge/`

---

## Session Start

1. `CONTEXT.md` — active task, branch
2. `INDEX.md` — plans + knowledge catalog
3. `graphify-out/GRAPH_SUMMARY.md` — if task involves code navigation
4. Bug/pattern → grep on-demand (see above)

Continuation ("ทำต่อ", "continue") → read CONTEXT.md → derive task type → invoke matching skill.

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

- **Headroom Proxy** (`localhost:8787`) — token compression 47–92%. Always-on for Claude Code + Codex.
- **Ponytail** (`~/.claude/plugins/marketplaces/ponytail/`) — lazy senior dev mode. Activate: "ponytail" / `/ponytail`. Default: `full`.

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

**Task start:** CONTEXT.md → grep knowledge on-demand
**During:** Update CONTEXT.md; append decisions to MEMORY.md
**Task end:** Rewrite CONTEXT.md; append to MEMORY.md; update INDEX.md if new files

Promote patterns: fix/pattern → `knowledge/cases/` + PLAYBOOK.md index; domain → `knowledge/{domain}.md`

