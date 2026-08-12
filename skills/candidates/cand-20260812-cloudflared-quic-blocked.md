---
id: cand-20260812-cloudflared-quic-blocked
name: cloudflared-quic-blocked-fallback-http2
description: cloudflared tunnel silently fails/is unreachable on networks that block or drop QUIC (UDP) — force --protocol http2
confidence_score: 0.6
hit_count: 1
created_at: 2026-08-12T00:55:00Z
last_used: 2026-08-12T00:55:00Z
source_project: line-claude-bot
status: candidate
trigger_patterns:
  - "cloudflared tunnel unreachable"
  - "cloudflared 530"
  - "trycloudflare.com not working"
  - "quic timeout no recent network activity"
---

# cloudflared quick tunnel unreachable — QUIC blocked by local network

## Context & Problem

Set up a `cloudflared tunnel --url http://127.0.0.1:PORT` quick tunnel. It created successfully
and printed a `*.trycloudflare.com` URL, but the URL was completely unreachable from the outside
(curl got `530` or connection failures/timeouts), even though the local origin server was healthy
and reachable on localhost.

Took multiple attempts to isolate: first suspected the origin server itself, then SSL/cert issues,
then DNS propagation delay — none of those were it. The real signal only showed up in cloudflared's
own log, which most default invocations don't leave visible (piped to a temp file and deleted by
convenience scripts).

## Learned Solution

Run cloudflared with a **persistent, readable log** first when diagnosing (`cloudflared tunnel
--url ... > debug.log 2>&1 &`, don't delete it) and look for:
```
ERR Failed to dial a quic connection error="failed to dial to edge with quic: timeout: no recent network activity"
```
This means the local network is blocking or dropping QUIC (UDP/443) — common behind certain
routers/firewalls/VPNs, even when normal HTTPS (TCP/443) works fine. cloudflared defaults to QUIC.

Fix: force HTTP/2 over TCP instead:
```
cloudflared tunnel --protocol http2 --url http://127.0.0.1:PORT
```
Confirmed reliable (200 from an external curl, LINE's own reachability test succeeded) immediately
after switching, on a network where the default QUIC path failed 100% of attempts.

Also learned: a URL appearing in cloudflared's own "tunnel created" log line does NOT mean
Cloudflare's edge has finished propagating the route yet — registering that URL with a downstream
service (e.g. a webhook endpoint) immediately can still fail. Poll the URL's own health endpoint
externally (not just localhost) until it returns 200 before handing the URL to anything else.
