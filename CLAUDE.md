# Claude Agent Workspace — ~/.claude

@plugins/marketplaces/ponytail/AGENTS.md
@agent-memory/USER-PROFILE.md

## Session Start

```bash
bash ~/.claude/scripts/session-start.sh [project-dir]
# Prints CONTEXT.md + active MEMORY decisions + PLAYBOOK tail
# Auto-archives MEMORY.md if > 100 lines
```

- New task → read `rules/coding.md` before writing code
- Continuation ("ทำต่อ", "continue") → read `CONTEXT.md` → derive task type → invoke matching skill
- Search/plan → read `INDEX.md` on-demand

---

## Session End

```bash
bash ~/.claude/scripts/session-end.sh [project-dir] [keep_days=30]
# 1. Rewrite CONTEXT.md + append MEMORY.md + update INDEX.md
# 2. Prune stale agent-memory (all projects)
# 3. Update graphify + GRAPH_SUMMARY (current project, if git HEAD changed)
```

---

## Infrastructure

- **Headroom Proxy** (`localhost:8787`) — token compression 47–92%. Always-on via `.zshrc` env vars. Use `mcp__headroom__headroom_compress` for large tool outputs.
- **Ponytail** — lazy senior dev mode, always-on (`full` mode). Loaded via `@plugins/marketplaces/ponytail/AGENTS.md`.

---

## Graphify

```
mcp__graphify__query_graph   # focused question
mcp__graphify__get_node      # concept/symbol
mcp__graphify__shortest_path # dependency path A → B
```

Graphified projects auto-load `@graphify-out/GRAPH_SUMMARY.md` via their own CLAUDE.md.

**GRAPH_SUMMARY.md is capped/stale orientation only (top god-nodes, no file paths).** Before editing code, don't guess the target file from it — query the MCP tools above (or `mcp__graphify__get_neighbors`, `mcp__graphify__blast_radius`) for the live, per-node `source_file` path.

---

## Memory Lifecycle

**Task start:** `session-start.sh` → read CONTEXT + MEMORY → grep knowledge on-demand
**During:** Update CONTEXT.md inline; append decisions to MEMORY.md (date-prefixed)
**Task end:** Rewrite CONTEXT.md; append MEMORY.md; update INDEX.md if new files → `session-end.sh`

Promote patterns: fix/pattern → `knowledge/cases/` + PLAYBOOK.md index; domain → `knowledge/{domain}.md`

---

## Maintenance Scripts

```bash
~/.claude/scripts/session-start.sh [project-dir]
# Load context: print CONTEXT + MEMORY decisions + PLAYBOOK; auto-archive if MEMORY > 100 lines

~/.claude/scripts/session-end.sh [project-dir] [keep_days=30]
# End-of-session: prune stale agent-memory (all projects) + update graphify (current project)

~/.claude/scripts/prune-all-agent-memory.sh [keep_days=30]
# Prune MEMORY.md dated entries + CONTEXT.md old session blocks across all projects

~/.claude/scripts/update-graphify-all.sh [--force]
# Update graphify + GRAPH_SUMMARY for all projects where git HEAD changed since last build

~/.claude/scripts/sync-all.sh
# Sync skills/rules/commands from ~/.claude/ → Codex + Gemini
```
