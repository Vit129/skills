# Dev Task Progress — stock-report-bot

Last updated: 2026-08-12 08:20
Status: In Progress

## Context
- System: stock-report-bot
- Feature: initial-build
- Workflow: Dev
- Complexity: Standard
- Test Root: N/A (no automated test suite — personal single-user tool, manual verification steps per design.md)

## Artifacts
- Design: agent-memory/plans/stock-report-bot/design.md
- Published: N/A

## Summary
- Total tasks: 12
- Completed: 12
- Remaining: 0

## Infrastructure
- [x] Project scaffold — `~/Git/Personal/stock-report-bot/` dir, `git init`, `.gitignore` (`.env`, `state/`, `logs/`, `__pycache__/`, `*.pyc`)
- [x] `.env` + `.env.example` — LINE secrets copied from `line-claude-bot/.env`, `MY_INVESTMENT_PORT_DIR`, `CLAUDE_BIN`, `CLAUDE_TIMEOUT_SECONDS=1200`, `PUSH_TEXT_CHAR_LIMIT=4500`, `MAX_BUDGET_USD` left blank pending Step 0
- [x] `config.py` — stdlib `.env` loader, trimmed (no `LINE_CHANNEL_SECRET`/`PORT`/quota fields — no webhook server here)

## Server Logic — data + claude + delivery
- [x] `line_client.py` — copy `_post()` (curl-based) + `push()` from line-claude-bot, drop HMAC/reply/webhook code entirely; add `push_report(user_id, texts)` (chunked, ≤5 messages/call)
- [x] `portfolio.py` — `load_latest_backup()` (glob newest `backups/<date>/`, `StaleBackupError` on missing/empty/stale — sanity-check date within 1 day of local today, not UTC-derived dirname match), `group_by_sector()` (dedupe by ticker, keep only ticker/name/sector/current/offHigh, drop PASSIVE INCOME unconditionally)
- [x] `claude_worker.py` — single-shot `claude -p` call (no session/resume), `_run_claude` command per design, stdout-then-stderr JSON parse, `is_error`-before-`result` branch (same verified pattern as line-claude-bot)
- [x] `main.py` — orchestrator: `npm run backup` subprocess (absolute cwd path) → `load_latest_backup` (freshness check, NOT the subprocess exit code) → `group_by_sector` → build prompt → `claude_worker.ask` → chunk → `push_report` → log to `logs/run.log` → exit code meaningful (0/nonzero) for `run.sh`'s state-write gate
- [x] ✅ Run Step 0 — **bug found + fixed**: `config.py`'s `os.environ.get("MAX_BUDGET_USD", "10.00")` default never triggers when `.env` sets the key to an explicit empty string (present-but-empty ≠ missing) — first run failed with `claude` CLI rejecting `--max-budget-usd ''`. Filled a real ceiling (10.00) in `.env` to unblock, reran clean: real cost **$1.85**, 171.5s, 1 chunk (fit under 4500 chars, no splitting needed). Set final `MAX_BUDGET_USD=4.00` (~2.2x observed) in both `.env` and `.env.example`.
- [x] ✅ Run Step 1 — all 3 checks PASSED: grouping matched exactly (24 tickers/6 groups, QQQI excluded), `StaleBackupError` raised cleanly against an empty dir, chunking split a 12,630-char string into 3×4207-char chunks and all 3 delivered via real LINE push (3 `sentMessages` IDs returned)

## Integration — launchd throttle + scheduling
- [x] `scripts/run.sh` — throttle gate copied from `candidate-scheduler.sh` pattern (`CHECK_INTERVAL_DAYS=14`, `--force` support) + **success-gated state write** (deliberate divergence — only advance `last_check` on `main.py` exit 0) + absolute python3 path + volta PATH export (npm resolution fix)
- [x] `scripts/install-plist.sh` (extra, user-requested) — generates `~/Library/LaunchAgents/com.claude.stock-report.plist` from `SCHEDULE_HOUR`/`SCHEDULE_MINUTE` in `.env` + loads/reloads it — makes rescheduling a config change + rerun, not a hand-edited XML file. `StartCalendarInterval` daily, no `RunAtLoad`/`KeepAlive` (periodic, not a daemon)
- [x] `README.md` — setup, `install-plist.sh` usage, operating notes (bi-weekly via internal throttle not launchd itself, cost/budget notes)
- [x] ✅ Run Step 2 — **bug found + fixed**: `EXCLUDED_SECTORS="PASSIVE INCOME"` (added per user request for config-driven sector exclusion) has a space, and `run.sh`'s `source .env` interpreted it as two bash tokens (`.env: line 8: INCOME: command not found`) — fixed by quoting the value in `.env`/`.env.example` AND making `config.py`'s loader strip matching quotes (handles both bash-`source`d and Python-parsed cases correctly). Re-verified clean: all 4 throttle scenarios passed (today→NOT_DUE, 15d-ago→proceeds-then-fails-without-advancing-state, `--force`→proceeds regardless, missing-state→bootstraps-and-proceeds) using `/usr/bin/false` as a free fast-failing `CLAUDE_BIN` stub, real `.env` restored after.
- [x] ✅ Run Step 3 — **real bug found + fixed**: `install-plist.sh`'s heredoc wrote a literal unescaped `&` in `2>&1` inside the plist XML (`plutil -lint` failed: "unknown ampersand-escape sequence") — macOS's plist reader tolerated it loosely enough that the job still mostly ran, but behavior was unreliable. Rewrote the plist by hand with proper `&amp;`/`&gt;` entities, then switched to the more robust `StandardOutPath`/`StandardErrorPath` plist keys instead of an inline shell redirect (avoids this whole class of shell-escaping-in-XML footgun going forward). **Red herring chased and resolved**: `logs/cron.log` staying empty after real successful runs looked like a second bug, but isn't — `run.sh` has no unconditional echo on the success path (only NOT_DUE/failure branches print) and `main.py` has zero stdout output by design (structured logging to `run.log` only, no `print()`), so a clean success run legitimately produces 0 bytes of console output. Added one `report sent OK` echo on the success path so future launchd debugging has a visible heartbeat instead of looking silently broken. Final isolated, non-overlapping kickstart test **PASSED cleanly end-to-end**: real report ($0.46, 75.0s, 2 chunks), `state/last_run.md` correctly advanced to today.
- ⚠️ **Cost note**: chasing the cron.log red herring involved firing several overlapping/rapid `launchctl kickstart -k` calls while real ~75-170s claude calls were still in flight — this produced **5 duplicate real reports sent to the user's LINE** during this session's testing (not a design flaw, a self-inflicted testing cost from debugging too aggressively without waiting for each run to fully settle first).
