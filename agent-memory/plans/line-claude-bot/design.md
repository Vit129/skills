# LINE → Claude chatbot (personal, single-user)

## Context

The user already has a LINE Official Account wired up this session (`line-bot` MCP server in `~/.claude/settings.json` — outbound-only, for manual pushes from an interactive Claude Code session). They now want the reverse direction: type a message in LINE, have it trigger Claude to web-search and answer, get a reply back in LINE automatically — a real always-on personal assistant bot, not a one-off script.

Requirements were captured via a full `interview` (me.md) round: single user, general investment-topic web search (deliberately not tied to the `My-Investment-Port` project/portfolio), backend powered by the user's existing Claude Code subscription via headless `claude -p` calls (not a separate billed API key), conversation memory must persist across messages, hosted on this Mac 24/7 best-effort via `launchd`. The user has no Cloudflare-managed domain, so a DNS-routed named tunnel isn't possible — the design instead keeps the ephemeral `cloudflared` quick tunnel but auto-re-registers the fresh URL with LINE's webhook-endpoint API every time it restarts, removing the need to ever hand-paste a URL into the LINE console again.

A Plan-phase dry run of the real `claude -p` CLI surfaced two facts that shaped the final flow: (1) cold-cache overhead alone costs ~$0.30/call before any search happens, so the per-call budget cap must come from an observed real number, not a guess; (2) LINE reply tokens expire ~30s after the event timestamp, which real web-search turns often exceed. The user was asked and chose a **single final message, no filler "searching…" ack** — so the flow opportunistically uses the reply token if the answer is ready in time, and falls back to a push message (LINE free-tier: 300/month, ~9.9/day average) if not, but never sends two messages for one question.

## Recommended Approach

### Directory layout — `~/Git/Personal/line-claude-bot/`

```
line-claude-bot/
├── .env                  # gitignored — real secrets, see below
├── .env.example           # checked in, placeholder keys
├── .gitignore              # .env, state/, logs/, __pycache__/, *.pyc
├── README.md               # setup + manual launchctl steps (no PRODUCT.md/DESIGN.md — backend-only, single-purpose, per rules/product-design.md)
├── server.py                # HTTP layer: webhook receipt, signature verify, dispatch to worker
├── claude_worker.py          # session bootstrap + `claude -p` subprocess call + JSON parse
├── line_client.py             # reply/push HTTP calls to LINE Messaging API + HMAC verify helper
├── state.py                    # atomic read/write of state/session.json, state/push_quota.json
├── config.py                    # stdlib-only .env loader
├── state/                        # gitignored, created at runtime
├── logs/                          # gitignored, created at runtime
└── scripts/
    ├── webhook-wrapper.sh          # launchd ProgramArguments target for the server
    └── tunnel-wrapper.sh            # launchd ProgramArguments target for cloudflared + LINE re-registration
```

No new dependencies — stdlib only (`http.server`, `urllib.request`, `hmac`, `hashlib`, `base64`, `json`, `subprocess`, `threading`, `queue`, `uuid`, `os`), matching the existing diagnostic script's own choice and this workspace's no-new-dependency default. Reuse the HMAC-verify logic already proven at `/Users/supavit.cho/.claude/jobs/e2764bc8/tmp/line_webhook.py` (throwaway diagnostic from earlier this session) — same verification approach, but `server.py` uses `http.server.ThreadingHTTPServer` instead of plain `HTTPServer` so a slow in-flight request can't stall LINE's own retry behavior.

### Request flow (`server.py` + `claude_worker.py` + `line_client.py`)

1. `do_POST /webhook`: read body, verify `X-Line-Signature` via HMAC-SHA256 over the raw body with `LINE_CHANNEL_SECRET`. Invalid → `403`, log, stop. Valid → respond `200` immediately (LINE needs a fast ack), then parse events.
2. For each `type=="message"` / `message.type=="text"` event, push `{event, received_at_ms}` onto a single module-level `queue.Queue`. Ignore all other event types (follow/unfollow/leave/etc.), log-only.
3. `do_GET /healthz` → `200 OK` (used by the tunnel wrapper's readiness poll).
4. One dedicated background worker thread consumes the queue **serially** — concurrent `--resume <same-uuid>` calls would race and corrupt the single continuous session this bot needs.
5. Per job: `deadline_ms = event["timestamp"] + 25000` (25s margin under LINE's ~30s reply-token expiry, measured from LINE's own event timestamp, not wall-clock-since-receipt).
6. Call `claude_worker.ask(user_text)` (up to 180s subprocess timeout, no retry on timeout).
7. On completion: if `now_ms() < deadline_ms` → `line_client.reply(reply_token, answer)` (free, saves quota). Else → `line_client.push(LINE_USER_ID, answer)` (counts against the 300/month quota — expected to be the common path for real web-search answers per the Plan-phase timing test). Exactly one outbound message per question either way — no ack.
8. On `claude_worker` failure: push/reply a short generic apology, log full detail to `logs/claude-calls.log` only.
9. Append one jsonl line per call to `logs/claude-calls.log`: `{ts, user_text, session_id, cost_usd, is_error, elapsed_ms, delivery: "reply"|"push", push_quota_month_count}`.
10. After every push, `state.increment_push_quota()`; if the running monthly count crosses `PUSH_QUOTA_WARN_THRESHOLD` (default 250), send one warning push then keep working (fail open — user still asked for personal convenience, not automated hard cutoff at 300, which would just fail silently otherwise).

**`claude_worker.ask(user_text)`** — session bootstrap logic:
```
session = state.load_session()   # {"session_id": None, "initialized": False} default
if not session["initialized"]:
    new_id = uuid4()
    result = _run_claude(["--session-id", new_id], user_text)
    if result.ok: state.save_session({"session_id": new_id, "initialized": True})
else:
    result = _run_claude(["--resume", session["session_id"]], user_text)
    if not result.ok and _looks_like_session_error(result):
        new_id = uuid4()
        result = _run_claude(["--session-id", new_id], user_text)   # fresh session, memory lost — log it
        if result.ok: state.save_session({"session_id": new_id, "initialized": True})
```
Session id is written **only after a confirmed-successful call** — a failed first call must never leave `state/session.json` pointing at a session that was never created. Non-session errors (e.g. budget-cap hit) must NOT trigger a session reset.

**`_run_claude` exact command**:
```
[CLAUDE_BIN, "-p", user_text,
 "--output-format", "json",
 "--tools", "WebSearch",
 "--permission-mode", "bypassPermissions",
 "--max-budget-usd", str(MAX_BUDGET_USD)]  # set from the real Step 0a test below, not guessed
 + session_args
```
Parse JSON from stdout first, fall back to stderr (observed to vary by exit status). Branch on `parsed.get("is_error")` before reading `parsed.get("result")` — the error shape has no `result` key.

### `.env` (gitignored — copy of the two secrets already known from this session, kept independent of `~/.claude/settings.json`'s `mcpServers.line-bot` block since this is a standalone always-on process, not a Claude Code MCP client)
```
LINE_CHANNEL_SECRET=<known channel secret>
LINE_CHANNEL_ACCESS_TOKEN=<copy of CHANNEL_ACCESS_TOKEN from settings.json>
LINE_USER_ID=<copy of DESTINATION_USER_ID from settings.json>
PORT=8787
CLAUDE_BIN=/Users/supavit.cho/.local/bin/claude
MAX_BUDGET_USD=<from Step 0a>
PUSH_QUOTA_WARN_THRESHOLD=250
```

### launchd (plists live in `~/Library/LaunchAgents/`, NOT checked into the repo — matches this workspace's existing convention that plists are loaded manually via `launchctl load`, not installed by any script)

**`com.claude.line-bot-webhook.plist`** — `RunAtLoad: true`, `KeepAlive: true` (plain bool, restarts on any exit, not just crash — this should never exit), `ThrottleInterval: 5`. `ProgramArguments`: `/bin/bash -c "<repo>/scripts/webhook-wrapper.sh >> <repo>/logs/webhook.cron.log 2>&1"`.

`scripts/webhook-wrapper.sh`: `cd` to repo root, `source .env`, `exec python3 server.py`.

**`com.claude.line-bot-tunnel.plist`** — same shape, `ProgramArguments` → `scripts/tunnel-wrapper.sh >> logs/tunnel.cron.log 2>&1`.

`scripts/tunnel-wrapper.sh` responsibilities, in order:
1. Poll `http://127.0.0.1:$PORT/healthz` (up to 60s) — no ordering guarantee between the two independently-managed plists.
2. Start `cloudflared tunnel --url http://127.0.0.1:$PORT` into a fresh temp log file (never reuse a prior run's log).
3. Poll that log for the newly assigned `https://*.trycloudflare.com` hostname (up to 60s); exit 1 (triggering launchd retry) if it never appears.
4. `PUT https://api.line.me/v2/bot/channel/webhook/endpoint` with the new URL — this is the auto-reregistration step that removes the manual-paste requirement permanently.
5. `POST https://api.line.me/v2/bot/channel/webhook/test` to confirm LINE can actually reach the new endpoint.
6. `wait` on the cloudflared process — its exit is what launchd's `KeepAlive` reacts to, re-running this whole script (fresh URL, fresh registration) on any tunnel drop, matching the already-agreed best-effort-uptime tradeoff from the interview.

## Verification

**Step 0a (blocking, run manually before writing any code)** — confirms headless auth actually works standalone and gives a real cost number to size `MAX_BUDGET_USD` from:
```bash
claude -p "What is the current S&P 500 level per a web search" \
  --output-format json --tools WebSearch --permission-mode bypassPermissions
```
Check exit 0, JSON has `result` + `session_id`, read `total_cost_usd`, set `MAX_BUDGET_USD` to ~3-4x that number.

**Step 0b** — confirm `--session-id` → `--resume` actually persists memory, and capture the real error shape for an invalid `--resume` (to make `_looks_like_session_error` precise instead of guessed):
```bash
UUID=$(uuidgen)
claude -p "My favorite color is teal, remember that." --session-id "$UUID" --output-format json --tools WebSearch --permission-mode bypassPermissions --max-budget-usd <observed cap>
claude -p "What's my favorite color?" --resume "$UUID" --output-format json --tools WebSearch --permission-mode bypassPermissions --max-budget-usd <observed cap>
```
Confirm the second answer references teal.

**Step 1** — local dry run, no launchd/tunnel: run `python3 server.py` directly, POST a synthetic LINE-shaped body with a correctly computed HMAC signature to `localhost:8787/webhook`, confirm `200` and that a real answer arrives in LINE (spends one real push against the 300/month quota — expected).

**Step 2** — manual tunnel dry run: with `server.py` still running, manually run `cloudflared tunnel --url ...`, manually `PUT` the URL to LINE, send a real message from the LINE app, confirm end-to-end delivery.

**Step 3** — wire launchd: copy both plists, `launchctl load` both, tail both log files, confirm both processes come up and the tunnel registers successfully (cross-check via `GET https://api.line.me/v2/bot/channel/webhook/endpoint`).

**Step 4 (the specific behavior this design exists to prove)** — kill the running `cloudflared` process directly. Confirm: a new log block appears, a *different* hostname is assigned, the `PUT` re-registration fires again, and a real LINE message sent afterward is still answered correctly.

**Step 5** — kill `python3 server.py`, confirm `KeepAlive` restarts it within ~`ThrottleInterval` seconds, confirm the tunnel plist is unaffected (same local port).

**Step 6 (recommended given the 24/7 requirement)** — reboot the Mac, confirm both agents auto-load via `RunAtLoad` and the full sequence self-heals with no manual step.

**Ongoing** — watch `state/push_quota.json` against the 300/month ceiling; `logs/claude-calls.log`'s `cost_usd` field lets the user sanity-check actual subscription usage against the "no separate billing" assumption.

### Critical files
- `/Users/supavit.cho/Git/Personal/line-claude-bot/server.py`
- `/Users/supavit.cho/Git/Personal/line-claude-bot/claude_worker.py`
- `/Users/supavit.cho/Git/Personal/line-claude-bot/line_client.py`
- `/Users/supavit.cho/Git/Personal/line-claude-bot/scripts/tunnel-wrapper.sh`
- `/Users/supavit.cho/Git/Personal/line-claude-bot/.env`
- `~/Library/LaunchAgents/com.claude.line-bot-webhook.plist`
- `~/Library/LaunchAgents/com.claude.line-bot-tunnel.plist`
