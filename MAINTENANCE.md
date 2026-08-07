# Maintenance Scripts Reference

Read on-demand — not auto-loaded every session (unlike `CLAUDE.md`). Consult this
when running, debugging, or explaining a maintenance/setup script under `scripts/`.

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
# Installs/refreshes the real OS crontab entry for build-cache-scheduler.sh only (runs
# it weekly independent of any Claude Code session — session-end.sh only fires when a
# session actually ends). Idempotent (marker-delimited block in scripts/crontab.claude,
# safe to re-run, never touches unrelated personal crontab lines). New machine setup:
# clone this repo, run this script once — crontab entry is portable, no manual re-add.
#
# eval-scheduler.sh, candidate-scheduler.sh, memory-decay-scheduler.sh moved OUT of
# crontab to launchd 2026-08-07 (~/Library/LaunchAgents/com.claude.{eval,candidate,
# memory-decay}-scheduler.plist, StartCalendarInterval 08:00) — plain cron silently
# skips a run if the machine is asleep at the scheduled minute (observed: 2 real misses
# in an 8-day sample), launchd coalesces missed StartCalendarInterval events on wake.
# Not portable via install-cron.sh; the plists themselves are the source of truth and
# must be copied + `launchctl load`ed manually on a new machine.

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
# New-machine setup, ~/.claude only (never touches ~/.kiro) — checks for the CLI
# companions (claude, codex via `npm install -g @openai/codex`, agy) first; claude/agy
# use a curl|bash installer so this only prints the command and stops rather than
# auto-running it unattended — run it yourself, then re-run this script. Then installs
# rtk (brew) and
# graphify (uv tool, always from github.com/Vit129/graphify — the personal fork, never
# PyPI, since upstream graphifyy[mcp] resolves mcp>=2.0 and breaks graphify-mcp at
# startup; the fork pins mcp<2.0) if missing, adds+installs the agy plugin
# (github.com/Vit129/agy-plugin-cc, via `claude plugin marketplace add` + `install` —
# idempotent, no-ops if already present) and the 9arm-skills plugin (upstream
# github.com/thananon/9arm-skills has no marketplace.json of its own, so it's added
# via scripts/marketplace-manifests/9arm/ — a small checked-in wrapper manifest
# declaring it, name-matched to the existing "9arm-marketplace" so the enabledPlugins
# key never changes). Also installs 9arm-skills for Codex/Gemini via `npx skills add
# thananon/9arm-skills --agent codex gemini-cli -g` — the Claude Code plugin above only
# reaches Claude Code, this is what makes debug-mantra/scrutinize/etc. usable from
# Codex/Gemini too. That CLI has proven unreliable propagating every skill to every
# agent dir in one pass (silently dropped 3 of 6 on a real run), so the step verifies
# its own canonical ~/.agents/skills/ output against ~/.codex/skills/ and
# ~/.gemini/antigravity-cli/skills/ and backfills anything skipped. Then runs
# install-hooks.py + install-mcp.py + install-cron.sh in order. Idempotent, safe to
# re-run. Clone this repo to ~/.claude on a fresh machine, run this once, restart
# Claude Code — hooks, MCP servers, both plugins, and cron are
# all wired without any manual step. kouen MCP entry lands disabled by default
# (Kouen.app is a personal Mac app, not on brew — install it
# separately if wanted).
```
