# Claude Agent Workspace — ~/.claude

@plugins/marketplaces/ponytail/AGENTS.md

## Session Start

```bash
bash ~/.claude/scripts/session-start.sh [project-dir]
# Prints .claude/memory index (feedback + user prefs)
```

- New task → read `rules/coding.md` before writing code
- Continuation ("ทำต่อ", "continue") → read the feature's `agent-memory/plans/[FEATURE]/dev-task-progress.md` or `qa-task-progress.md` → resume at first unchecked task
- Search/plan → read `INDEX.md` on-demand

---

## Session End

```bash
bash ~/.claude/scripts/session-end.sh [project-dir]
# 1. Update INDEX.md if new plans/knowledge files added
# 2. Update graphify + GRAPH_SUMMARY (current project, if git HEAD changed)
```

---

## Infrastructure

- **Ponytail** — lazy senior dev mode, always-on (`full` mode). Loaded via `@plugins/marketplaces/ponytail/AGENTS.md`.

---

## Graphify

```
mcp__graphify__query_graph   # focused question
mcp__graphify__get_node      # concept/symbol
mcp__graphify__shortest_path # dependency path A → B
mcp__graphify__save_result   # close the feedback loop — see below
```

Graphified projects auto-load `@graphify-out/GRAPH_SUMMARY.md` via their own CLAUDE.md.

**GRAPH_SUMMARY.md is capped/stale orientation only (top god-nodes, no file paths).** Before editing code, don't guess the target file from it — query the MCP tools above (or `mcp__graphify__get_neighbors`, `mcp__graphify__blast_radius`) for the live, per-node `source_file` path.

**Close the feedback loop — call `save_result` once the outcome is known**, not just query: after a `query_graph`/`get_node`/etc. result actually gets used (you edited the file it pointed at) or turns out wrong (dead end, or the answer needed correcting), call `mcp__graphify__save_result` with `outcome: useful|dead_end|corrected`. This is the one step in graphify's own self-tuning loop that isn't automatic — `graphify reflect` already aggregates these into decayed, corroboration-gated node weights that future queries are ranked by (wired into `query.py`/`serve.py`/`export.py`/`report.py`), but only if the outcome actually gets recorded. Skipping this silently starves the loop of data.

---

## Memory Lifecycle

Task progress lives in `agent-memory/plans/[FEATURE]/dev-task-progress.md` / `qa-task-progress.md` (per-feature, checkbox-tracked). Durable lessons: `knowledge/cases/` + `PLAYBOOK.md` index; domain patterns → `knowledge/{domain}.md`.

---

## Maintenance Scripts

```bash
~/.claude/scripts/session-start.sh [project-dir]
# Print .claude/memory index (feedback + user prefs)

~/.claude/scripts/session-end.sh [project-dir]
# End-of-session: update graphify (current project)

~/.claude/scripts/update-graphify-all.sh [--force]
# Update graphify + GRAPH_SUMMARY for all projects where git HEAD changed since last build

~/.claude/scripts/sync-all.sh
# Sync skills/rules/commands from ~/.claude/ → Codex + Gemini
```

@RTK.md
