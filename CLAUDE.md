# Claude Agent Workspace — ~/.claude

@plugins/marketplaces/ponytail/AGENTS.md

## Session Start

```bash
bash ~/.claude/scripts/session-start.sh [project-dir]
# Prints .claude/memory index (feedback + user prefs)
```

- New task → read `rules/coding.md` before writing code
- Continuation ("ทำต่อ", "continue") → read the feature's `agent-memory/plans/[FEATURE]/dev-task-progress.md` or `qa-task-progress.md` → resume at first unchecked task
- Paused HITL gate → `session-start.sh` surfaces any `Status: OPEN` entry in `agent-memory/GATE-STATE.md` automatically — resume the named skill at the stated gate, don't restart cold (see that file's template; `debug-mantra-workflow` is the reference implementation)
- **Auto-act due** → `session-start.sh` surfaces any unmarked `agent-memory/evals/*.md`, `agent-memory/candidate-checks/*.md`, or `agent-memory/routing-adherence-checks/*.md` DUE report (written unattended by the daily scheduler — launchd for eval/candidate since 2026-08-07, cron for routing-adherence; see Skill Eval / Skill Candidates / Routing Adherence in Maintenance Scripts. eval/candidate reports only list a bullet when genuinely actionable — proposed-status row / hit_count>=3 — since the 2026-08-07 grep-anchor and threshold-filter fix; a report with no bullets means nothing was due, not a broken pipeline) as this session's first action, not a to-do to mention and skip: promote candidates at `hit_count>=3` via `skill-creator`, run pass@3 eval / apply safe `SKILL-LOG.md` `proposed` rows (otherwise leave `proposed` with a one-line reason), or for routing-adherence review each gap and only act on real misses (not correctly-ignored keyword false positives). Append `ACTED: <date>` to that log file once handled so it stops resurfacing. This is the deliberate, safer alternative to a fully unattended cron-triggered write (rejected 2026-07-27 — `--dangerously-skip-permissions` on a real non-sandboxed machine has no permission gate left if any read content carries a prompt injection); this way the actual write only ever happens inside a real session, where hooks/gates stay live.
- Search/plan → read `INDEX.md` on-demand
- Curated facts (user prefs, feedback, project decisions) also live in `/Users/supavit.cho/.claude/projects/-Users-supavit-cho--claude/memory/MEMORY.md` (Claude Code's own per-project memory index) — read it too when working in this `~/.claude` workspace itself, alongside `agent-memory/`. It's plain markdown, no special tooling needed to read it.

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

**Skill-candidate shadow capture** (`~/.claude/skills/candidates/`, see its `README.md` for the format): when solving something took 2+ real attempts (wrong approach, corrected) AND the pattern is genuinely reusable — not project-specific — write a candidate file there instead of just a feedback memory. Write-only right now: nothing reads this directory automatically (no context loading, no auto-promotion), and `sync-all.sh` excludes it from Codex/Gemini propagation. This produces real examples toward `routing.md`'s existing 3x-occurrence promotion bar — it does not lower or replace that bar. Promotion to a real skill stays manual (`skill-creator`), same as today.

**Per-project `agent-memory/` (2026-08-16+):** for `~/Git/Personal/*` projects, `agent-memory/` is gitignored from that project's own repo, not deleted — it still lives on disk at the same path, every skill/rule/CLAUDE.md reference in that project keeps working unchanged. It's centrally mirrored (daily + on-demand) to the private `github.com/Vit129/claude-memory-private` repo (second top-level dir, `agent-memory/<project>/`, alongside the `projects/*/memory/` mirror of Claude Code's own auto-memory) via `scripts/memory-backup-sync.sh`, and restored on a fresh machine by `scripts/bootstrap-new-machine.sh`. Known accepted tradeoff: graphify does not index a project's gitignored `agent-memory/` (its `.graphifyignore` semantics can only exclude more than `.gitignore`, never re-include) — agent-memory search in those projects goes through grep, not `graphify query`. See `project_new_machine_memory_backup` (Claude Code memory, this project) for the full migration record.

---

## Maintenance Scripts

Full reference (session/graphify/memory-search/decay/cache/cron/hooks/mcp/bootstrap) →
`MAINTENANCE.md`, read on-demand — not loaded every session. Read it before running,
debugging, or explaining any script under `scripts/`.

@RTK.md
