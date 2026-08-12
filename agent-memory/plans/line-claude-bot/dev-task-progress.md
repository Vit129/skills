# Dev Task Progress — line-claude-bot

Last updated: 2026-08-12 00:52
Status: In Progress (only the optional reboot test remains)

## Context
- System: line-claude-bot
- Feature: initial-build
- Workflow: Dev
- Complexity: Standard
- Test Root: N/A (no automated test suite — personal single-user tool, manual verification steps per design.md)

## Artifacts
- Design: agent-memory/plans/line-claude-bot/design.md
- Published: N/A

## Summary
- Total tasks: 15
- Completed: 14
- Remaining: 1 (Step 6 reboot test, optional/user-verified)

## Infrastructure
- [x] Step 0a (BLOCKING, manual CLI, run before any code) — real cost observed: $0.68 with actual web search → `MAX_BUDGET_USD=2.50` (~3.7x)
- [x] Step 0b (manual CLI) — `--session-id`→`--resume` confirmed persists memory (teal test). Error shapes captured: invalid `--resume` → exit 1, empty stdout, plain-text stderr `"No conversation found with session ID: ..."` (not JSON); budget-exceeded → JSON on stdout, `is_error:true`, `subtype:"error_max_budget_usd"`, no `result` key, but `session_id` IS present (must NOT reset session on this path)
- [x] Project scaffold — `~/Git/Personal/line-claude-bot/` dir, `git init`, `.gitignore` (`.env`, `state/`, `logs/`, `__pycache__/`, `*.pyc`)
- [x] `.env` + `.env.example` — real secrets copied from `~/.claude/settings.json` mcpServers.line-bot.env; `CLAUDE_BIN=/Users/supavit.cho/.local/bin/claude` (resolved real binary path, not the shell-function wrapper)
- [x] `config.py` — stdlib-only `.env` loader (merge over `os.environ`, never overwrite an already-set real env var)

## Server Logic — Webhook receipt + dispatch
- [x] `line_client.py` — HMAC-SHA256 signature verify, `reply(reply_token, text)`, `push(user_id, text)`
- [x] `state.py` — atomic read/write for `state/session.json` and `state/push_quota.json` (monthly auto-reset)
- [x] `claude_worker.py` — session bootstrap + `_run_claude` with verified parse logic (stdout-then-stderr, `is_session_error` heuristic matches the real captured error text)
- [x] `server.py` — `ThreadingHTTPServer`, `do_POST /webhook` (verify → 200 ack → enqueue), `do_GET /healthz`, serial worker thread, deadline-based reply-vs-push, quota-warning push
- [x] ✅ Run Step 1 (local dry run — bug found + fixed: python.org build had no cert.pem, urllib SSL verify failed against api.line.me; switched `line_client._post` to shell out to `curl` instead of `urllib.request`. Re-tested clean: 200 ack, claude call succeeded ($0.023, no search needed for "7*8"), fake reply token correctly fell back to push, push delivered, quota incremented to 1, session_id persisted across server restarts)

## Integration — launchd + tunnel auto-registration
- [x] `scripts/webhook-wrapper.sh` + `~/Library/LaunchAgents/com.claude.line-bot-webhook.plist` (RunAtLoad+KeepAlive) — files created, plist not yet `launchctl load`ed (pending user go-ahead)
- [x] `scripts/tunnel-wrapper.sh` + `~/Library/LaunchAgents/com.claude.line-bot-tunnel.plist` — **bug found + fixed**: default `quic` protocol was blocked/dropped by the local network (`failed to dial to edge with quic: timeout: no recent network activity`, repeated); added `--protocol http2` to the cloudflared invocation, confirmed reliable (200 externally, LINE `webhook/test` success:true)
- [x] `README.md` — setup steps, manual `launchctl load` instructions, operating notes (quota/cost/uptime/memory), uninstall steps
- [x] ✅ Run Step 2 (manual tunnel dry run — real LINE message end-to-end, manually, before launchd) — **PASSED**: real message "Last time to sent " → claude answered ($0.45) → delivered via **reply** (13.7s, under the 25s deadline, no push needed). Confirmed via a live `Monitor` tail rather than more blind retries, after several earlier real-message attempts silently failed against tunnel URLs that had already died/rotated mid-debugging.
- [x] ✅ Run Step 3 (wire launchd persistently) — user confirmed go-ahead, both agents `launchctl load`ed. **2 more bugs found + fixed during wiring**: (1) launchd's minimal PATH (`/usr/bin:/bin:/usr/sbin:/sbin`) doesn't include Homebrew, so `cloudflared` wasn't found — fixed by exporting `PATH="/opt/homebrew/bin:$PATH"` in `tunnel-wrapper.sh` and using an absolute python3 path in `webhook-wrapper.sh`; (2) the script registered the tunnel URL with LINE immediately after it appeared in cloudflared's log, before Cloudflare's edge had finished propagating the route — LINE rejected it as "Invalid webhook endpoint URL" — fixed by adding a public-reachability poll (up to 30s) before the PUT. Confirmed via a real LINE message ("วิเคราะห์หุ้น APPL, GOOGL", $0.54, 48.7s, delivered via push) through the fully launchd-managed path.
- [x] ✅ Run Step 4 (kill-cloudflared re-registration test) — **PASSED**: killed the running cloudflared process directly, `KeepAlive` restarted `tunnel-wrapper.sh`, a different hostname was assigned (`mailed-knowledge-police-dramatic.trycloudflare.com`), auto re-registration fired and succeeded (`success:true`, confirmed via `GET .../webhook/endpoint`)
- [x] ✅ Run Step 5 (kill-server KeepAlive test) — **PASSED**: killed `python3 server.py` directly, `KeepAlive` restarted it (new PID) within seconds, `/healthz` returned 200 again; the tunnel process was correctly unaffected (same PID throughout)
- [ ] Step 6 (reboot test) — not run (requires an actual machine reboot, left for the user to verify at their convenience rather than done unilaterally mid-session)
