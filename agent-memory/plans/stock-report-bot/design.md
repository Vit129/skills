# stock-report-bot — bi-weekly portfolio sector pulse via LINE

## Context

The user actively trades a ~25-ticker portfolio tracked in `My-Investment-Port` and wants a periodic pulse without manually checking each ticker. This session already: (1) built `line-claude-bot` (a LINE chatbot backed by headless `claude -p`), (2) found and fixed a real production bug — `com.supavit.portfolio.backup`'s launchd job had pointed at a stale, now-empty directory for ~2 months, silently failing every night — and (3) confirmed the custom category data (`sectors.json`: AI/SEMICONDUCTORS/ENERGY/FINANCIAL/ROBOTICS/SPACE/PASSIVE INCOME) already exists 1:1 mapped to every holding, so no custom grouping needs to be invented.

This plan builds a new bi-weekly scheduled job, `stock-report-bot`, that regroups the active (non-passive) holdings by these categories and pushes a short web-search-backed "sector pulse" to LINE — confirmed scope: qualitative summary only (no personal P&L/position numbers), delivered at 08:00 on whichever day the bi-weekly interval lands.

## Recommended Approach

### Directory — `~/Git/Personal/stock-report-bot/` (new, standalone, sibling to `line-claude-bot`)

```
stock-report-bot/
├── .env / .env.example / .gitignore
├── README.md
├── config.py            # stdlib .env loader, trimmed to this job's needs
├── line_client.py       # push() + curl-based _post() copied from line-claude-bot,
│                         # HMAC/reply/webhook code dropped entirely (no inbound here)
├── portfolio.py          # load_latest_backup, group_by_sector (pure functions)
├── claude_worker.py       # single-shot claude -p call, no session/resume
├── main.py                 # orchestrator
├── scripts/run.sh            # launchd entrypoint: throttle gate + state write
├── state/last_run.md          # gitignored — `last_check: YYYY-MM-DD`
└── logs/{run.log,cron.log}     # gitignored
```
No new dependencies (stdlib only), matching `line-claude-bot`'s convention.

### Critical findings baked into the design (verified this session, not guesses)

- **`npm run backup`'s exit code is not trustworthy** — `backup.js` never calls `process.exit(1)` on failure. Freshness is verified by inspecting the produced `holdings.json` (non-empty, recent date), not the subprocess return code.
- **UTC/local date mismatch** — `backup.js` names its folder from UTC `toISOString()`; local time is UTC+7. Don't construct the expected dirname — glob `backups/????-??-??`, take the newest, sanity-check its date is within 1 day of local today.
- **State file only advances on success** — deliberately diverges from `candidate-scheduler.sh`'s unconditional rewrite (that script has no expensive/failure-prone payload; this one does). A failed run must not eat 14 days of silence.
- **LINE's 5000-char message cap** — a 6-group report can exceed one message; `push_report()` chunks on paragraph boundaries, ≤5 messages per call (LINE's own per-call limit).
- **`subprocess.run(cwd=...)` doesn't expand `~`** — use the absolute `My-Investment-Port` path.
- **launchd's minimal PATH** (already fixed once this session for `line-claude-bot`) — `scripts/run.sh` invokes python3 by absolute path (`/Library/Frameworks/Python.framework/Versions/3.13/bin/python3`), matching `webhook-wrapper.sh`'s existing fix.

### Flow (`main.py`, called by `scripts/run.sh` only after the throttle gate passes)

1. `subprocess.run(["npm","run","backup"], cwd=<absolute My-Investment-Port path>, timeout=120)` — force a fresh pull; ignore the exit code, verify via step 2 instead.
2. `portfolio.load_latest_backup()` — glob for the newest `backups/<date>/holdings.json`+`sectors.json`, raise `StaleBackupError` if missing/empty/too old. On failure: log, best-effort failure push, `sys.exit(1)` (state file NOT advanced).
3. `portfolio.group_by_sector()` — dedupe by ticker (positions appear once per broker), keep only `ticker/name/sector/current/offHigh` (no shares/avgCost/mv/pl/broker — confirmed scope: sector pulse only), drop the `PASSIVE INCOME` group unconditionally (hardcoded, not configurable — single-user tool).
4. Build one combined prompt listing all groups+tickers, instructing the model to return plain LINE-ready text (no markdown), one short paragraph per group (overall movement + 1-2 notable movers), total length under `PUSH_TEXT_CHAR_LIMIT`.
5. `claude_worker.ask(prompt)` — `claude -p <prompt> --output-format json --tools WebSearch --permission-mode bypassPermissions --max-budget-usd <sized in Step 0 below>`, `timeout=1200`. No `--session-id`/`--resume` — each report is independent. Parse JSON from stdout-then-stderr (same verified pattern as `line-claude-bot`), branch on `is_error` before reading `result`.
6. On failure: log `raw_error`+`cost_usd`, best-effort failure push (own try/except so a LINE outage doesn't mask the real error), `sys.exit(1)`.
7. Chunk the result text under `PUSH_TEXT_CHAR_LIMIT`, `line_client.push_report(LINE_USER_ID, chunks)`.
8. Append `{timestamp, status, cost_usd, elapsed_s, backup_date}` to `logs/run.log`, `sys.exit(0)`.

### Scheduling — `scripts/run.sh` (throttle pattern copied from `~/.claude/scripts/candidate-scheduler.sh`, `CHECK_INTERVAL_DAYS=14`)

```bash
STATE="$HOME/Git/Personal/stock-report-bot/state/last_run.md"
[ ! -f "$STATE" ] && echo "last_check: 1970-01-01" > "$STATE"
LAST_CHECK=$(grep "last_check:" "$STATE" | cut -d' ' -f2)
LAST_EPOCH=$(date -j -f "%Y-%m-%d" "$LAST_CHECK" "+%s" 2>/dev/null || echo "0")
DIFF_DAYS=$(( ($(date "+%s") - LAST_EPOCH) / 86400 ))
[ "$1" != "--force" ] && [ "$DIFF_DAYS" -lt 14 ] && { echo "NOT_DUE"; exit 1; }

/Library/Frameworks/Python.framework/Versions/3.13/bin/python3 "$HOME/Git/Personal/stock-report-bot/main.py"
RC=$?
[ "$RC" -eq 0 ] && echo "last_check: $(date +%Y-%m-%d)" > "$STATE"
exit $RC
```

`~/Library/LaunchAgents/com.claude.stock-report.plist` (not in the repo, matches convention) — `StartCalendarInterval` `{Hour: 8, Minute: 0}` **daily** (no native "every N weeks" launchd key exists — the script's own 14-day throttle is what makes it actually bi-weekly), no `RunAtLoad`/`KeepAlive` (periodic job, not a daemon — matches `com.claude.candidate-scheduler.plist`, not `com.claude.line-bot-webhook.plist`).

### `.env` (independent copy of the LINE secrets already sitting in `line-claude-bot/.env` — no shared runtime between the two standalone processes)
```
LINE_CHANNEL_ACCESS_TOKEN=<copy>
LINE_USER_ID=<copy>
MY_INVESTMENT_PORT_DIR=/Users/supavit.cho/Git/Personal/My-Investment-Port
CLAUDE_BIN=/Users/supavit.cho/.local/bin/claude
MAX_BUDGET_USD=<from Step 0 dry-run below — do not guess>
CLAUDE_TIMEOUT_SECONDS=1200
PUSH_TEXT_CHAR_LIMIT=4500
```

## Verification

**Step 0 (blocking, do first)** — size `MAX_BUDGET_USD` for real: run `main.py` once with a high ceiling (e.g. 10.00), read `total_cost_usd` from the logged envelope, set the real cap to ~2x observed (hitting the cap mid-run returns `is_error` with no `result` — err high, not low).

**Step 1** — component checks against the real `backups/2026-08-12/` data already on disk: confirm `load_latest_backup()` yields 24 unique tickers / 6 groups (PASSIVE INCOME excluded) matching the verified grouping from this session; force a stale-backup condition and confirm `StaleBackupError` fires cleanly; test `push_report()` with a >5000-char string and confirm it chunks and both messages arrive.

**Step 2** — throttle logic without waiting 14 days: backdate `state/last_run.md` 15 days → confirm it runs; run again immediately → confirm `NOT_DUE`; `--force` → confirm it runs regardless; delete the state file → confirm it bootstraps and runs. Also confirm the success-gated divergence: force `main.py` to fail (e.g. `CLAUDE_BIN=/bin/false`) and confirm `state/last_run.md` does NOT advance.

**Step 3** — full end-to-end with launchd loaded: `launchctl load` the plist, `launchctl kickstart -k gui/$(id -u)/com.claude.stock-report` to fire it immediately without waiting for 08:00, tail `logs/cron.log`, confirm the LINE push arrives and `logs/run.log` has a success entry.

### Critical files
- `/Users/supavit.cho/Git/Personal/stock-report-bot/main.py`
- `/Users/supavit.cho/Git/Personal/stock-report-bot/portfolio.py`
- `/Users/supavit.cho/Git/Personal/stock-report-bot/claude_worker.py`
- `/Users/supavit.cho/Git/Personal/stock-report-bot/scripts/run.sh`
- `/Users/supavit.cho/Git/Personal/stock-report-bot/line_client.py`
- `~/Library/LaunchAgents/com.claude.stock-report.plist`
