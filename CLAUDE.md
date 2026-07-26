# Claude Agent Workspace — ~/.claude

@plugins/marketplaces/ponytail/AGENTS.md

## Session Start

```bash
bash ~/.claude/scripts/session-start.sh [project-dir]
# Prints .claude/memory index (feedback + user prefs)
```

- New task → read `rules/coding.md` before writing code
- Continuation ("ทำต่อ", "continue") → read the feature's `agent-memory/plans/[FEATURE]/dev-task-progress.md` or `qa-task-progress.md` → resume at first unchecked task
- Search/plan → read `index.md` on-demand

---

## Session End

```bash
bash ~/.claude/scripts/session-end.sh [project-dir]
# 1. Update index.md if new plans/knowledge files added
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

**Skill-candidate shadow capture** (`~/.claude/skills/candidates/`, see its `README.md` for the format): when solving something took 2+ real attempts (wrong approach, corrected) AND the pattern is genuinely reusable — not project-specific — write a candidate file there instead of just a feedback memory. Write-only right now: nothing reads this directory automatically (no context loading, no auto-promotion), and `sync-all.sh` excludes it from Codex/Gemini propagation. This produces real examples toward `routing.md`'s existing 3x-occurrence promotion bar — it does not lower or replace that bar. Promotion to a real skill stays manual (`skill-creator`), same as today.

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

python3 ~/.claude/scripts/session_search.py "<query>" [--project SLUG] [--limit N]
# Full-text search across every past session transcript, all projects (auto-reindexes
# incrementally first). The one real gap found comparing against Hermes Agent's FTS5
# cross-session recall — native SQLite FTS5 addition, not the Hermes runtime itself.
# Use when the user references something from an earlier session you don't have in
# context ("we talked about this before", "what did we decide about X last time").

uv run ~/.claude/scripts/memory_vector_search.py "<query>" [--limit N]
# Semantic (embedding) search over the CURATED memory layer — agent-memory/*.md,
# knowledge/**/*.md, skills/candidates/*.md, projects/*/memory/*.md. Complements
# session_search.py: that one is raw-transcript keyword search, this one is
# meaning-based search over distilled facts (catches a query phrased differently
# than the memory file's own wording). Local sentence-transformers model
# (all-MiniLM-L6-v2, same model class as graphify's optional `embeddings` extra),
# no hosted API. First run downloads the model (~90MB, cached after).
# Use when a keyword/FTS5 memory search comes up empty but the fact might still
# be there under different phrasing.

~/.claude/scripts/memory-decay-scheduler.sh [--force]
# Daily staleness sweep (wired into session-end.sh) — flags agent-memory/knowledge
# files untouched >90d (mtime proxy, review not auto-action) and PLAYBOOK.md rows
# already meeting its own documented archive rule (Applied+Prevented >= 5).
# Never auto-deletes/auto-archives — output is a flag list for human/AI review.
```

@RTK.md
