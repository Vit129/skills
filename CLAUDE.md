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
- **Auto-act due** → `session-start.sh` surfaces any unmarked `agent-memory/evals/*.md`, `agent-memory/candidate-checks/*.md`, or `agent-memory/routing-adherence-checks/*.md` DUE report (written unattended by the daily cron — see Skill Eval / Skill Candidates / Routing Adherence in Maintenance Scripts) as this session's first action, not a to-do to mention and skip: promote candidates at `hit_count>=3` via `skill-creator`, run pass@3 eval / apply safe `SKILL-LOG.md` `proposed` rows (otherwise leave `proposed` with a one-line reason), or for routing-adherence review each gap and only act on real misses (not correctly-ignored keyword false positives). Append `ACTED: <date>` to that log file once handled so it stops resurfacing. This is the deliberate, safer alternative to a fully unattended cron-triggered write (rejected 2026-07-27 — `--dangerously-skip-permissions` on a real non-sandboxed machine has no permission gate left if any read content carries a prompt injection); this way the actual write only ever happens inside a real session, where hooks/gates stay live.
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

~/.claude/scripts/clean-build-cache.sh [root-dir] [--apply] [--days N]
# Find build/cache dirs under a projects root (default ~/Git/Personal): node_modules,
# dist, build, .next, .nuxt, .turbo, .cache, .venv, .build, __pycache__, .pytest_cache,
# *.egg-info, DerivedData. Dry-run by default (lists path + size) — pass --apply to
# actually delete. Skips 9arm-skills (No-Touch Paths, third-party repo).

~/.claude/scripts/build-cache-scheduler.sh [--force]
# Weekly wrapper around clean-build-cache.sh (wired into session-end.sh) — same
# daily-cadence-state-file pattern as eval/candidate/decay schedulers but 7-day
# interval. Runs the dry-run scan and logs the report; never auto-deletes — review
# the report, then run clean-build-cache.sh --apply by hand.

~/.claude/scripts/graphify-label-scheduler.sh [--force]
# Weekly scan (wired into session-end.sh, surfaced via session-start.sh's Auto-act
# check) of every graphified project for communities still sitting as unlabeled
# "Community N" placeholders (>10% threshold). Flag-only, NEVER auto-labels —
# a 2026-07-29 incident showed a single unsupervised batch labeling pass across
# 11 projects at once silently produced garbage for 6 of them (e.g. "Fixed"
# reused as a community name 563 times) while self-reporting 100% success.
# When acting on a DUE report: dispatch labeling ONE PROJECT AT A TIME (never
# a batch), then quality-check each result (duplicate-label ratio + spot-check
# community membership in graph.json — a real duplicate like near-identical
# platform-doc copies is fine, a duplicate across unrelated content is not)
# before trusting it. Revert via git checkout or the graphify-out/<date>/
# backup folder if it fails the check.

~/.claude/scripts/routing-adherence-scheduler.sh [--force]
# Daily check (wired into session-end.sh, surfaced via session-start.sh's Auto-act
# check) cross-referencing agent-memory/routing-nudges.log (every keyword-triggered
# routing suggestion, written by hooks/user-prompt-submit.py's check_skill_trigger)
# against agent-memory/skill-usage.log (every actual Skill() call, written by
# hooks/skill-usage-log.py) to flag nudges that fired but whose suggested skill was
# never invoked in that session. interview-gate.py/mandatory-skill-gate.py are hard
# PreToolUse blocks but only cover Edit/Write + interview/a project's own MANDATORY
# skill — this catches the rest of routing.md's Skill Map, which was previously a
# soft nudge with zero audit trail either way. A flagged gap is NOT proof of a miss —
# it can be a correctly-ignored false positive (keyword matched quoted/reported text,
# not the user's actual ask). Review-not-auto-act, same contract as every other
# scheduler here.

~/.claude/scripts/install-cron.sh
# Installs/refreshes the real OS crontab entry for build-cache-scheduler.sh (runs it
# weekly independent of any Claude Code session — session-end.sh only fires when a
# session actually ends). Idempotent (marker-delimited block in scripts/crontab.claude,
# safe to re-run, never touches unrelated personal crontab lines). New machine setup:
# clone this repo, run this script once — crontab entry is portable, no manual re-add.

python3 ~/.claude/scripts/install-hooks.py [path-to-settings.json]
# settings.json is gitignored (personal, machine-local) so hook wiring (interview-gate,
# design-gate, memory-write-scan, skill-usage-log, etc.) doesn't survive a git clone the
# way scripts/hooks/ do. scripts/settings-hooks.template.json is the checked-in source
# of truth; this merges it in. Idempotent and additive-only — adds any (event, matcher,
# command) missing, never touches/removes anything already there (hand-added hooks
# survive).

python3 ~/.claude/scripts/install-mcp.py [path-to-settings.json]
# Same pattern as install-hooks.py above, but for settings.json's mcpServers block
# (graphify, kouen) — also gitignored, also doesn't survive a git clone. Reads from
# scripts/settings-mcp.template.json ($HOME-relative paths resolved on write).
# Idempotent and additive-only — adds a server entry only if that name is missing,
# never touches an existing one (hand-toggled disabled/env survive). Warns (but still
# adds) if the resolved binary isn't on disk yet — install the dependency, re-run.

bash ~/.claude/scripts/bootstrap-new-machine.sh
# New-machine setup, ~/.claude only (never touches ~/.kiro) — installs rtk (brew) and
# graphify (uv tool, always from github.com/Vit129/graphify — the personal fork, never
# PyPI, since upstream graphifyy[mcp] resolves mcp>=2.0 and breaks graphify-mcp at
# startup; the fork pins mcp<2.0) if missing, then runs install-hooks.py +
# install-mcp.py + install-cron.sh in order. Idempotent, safe to re-run. Clone this repo
# to ~/.claude on a fresh machine, run this once, restart Claude Code — hooks, MCP
# servers, and cron are all wired without any manual step. kouen MCP entry lands
# disabled by default (Kouen.app is a personal Mac app, not on brew — install it
# separately if wanted).
```

@RTK.md
