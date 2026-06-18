# Headroom Proxy — Token Compression for AI Agents

## Status: ACTIVE (installed 2026-06-18)

Headroom v0.26.0 runs as a LaunchAgent on port 8787, compressing all AI agent traffic automatically.

## Architecture

```
Agent (Claude Code / Codex) → localhost:8787 → Headroom compress → upstream API
```

- LaunchAgent: `~/Library/LaunchAgents/com.headroom.proxy.plist`
- Binary: `/Library/Frameworks/Python.framework/Versions/3.13/bin/headroom`
- Log: `/tmp/headroom-proxy.log`
- Error log: `/tmp/headroom-proxy.err`
- Output shaper: ON (`HEADROOM_OUTPUT_SHAPER=1`)

## Shell Config (~/.zshrc)

```bash
export ANTHROPIC_BASE_URL=http://127.0.0.1:8787
export OPENAI_BASE_URL=http://127.0.0.1:8787/v1
```

## Routing Table

| Path | Upstream |
|------|----------|
| `/v1/messages` | `https://api.anthropic.com` |
| `/v1/chat/completions` | `https://api.openai.com` |
| `/v1/responses` | `https://api.openai.com` (HTTP + WebSocket) |
| `/v1internal:streamGenerateContent` | `https://cloudcode-pa.googleapis.com` |

## Agent Compatibility

| Agent | Works via proxy | Method |
|-------|----------------|--------|
| Claude Code | ✅ | `ANTHROPIC_BASE_URL` env var |
| Codex CLI | ✅ | `OPENAI_BASE_URL` env var |
| Aider | ✅ | `headroom wrap aider` |
| Cursor | ✅ | Config paste (prints instructions) |
| Kiro CLI | ❌ | Uses AWS Bedrock (gRPC, no HTTP override) |
| Agy (Antigravity CLI) | ❌ | Uses `cloudcode-pa.googleapis.com` via gRPC (hardcoded, no env override) |

## Commands

```bash
# Check health
curl http://127.0.0.1:8787/health

# View compression stats
curl http://127.0.0.1:8787/stats

# View stats history
curl http://127.0.0.1:8787/stats-history

# Restart
launchctl unload ~/Library/LaunchAgents/com.headroom.proxy.plist
launchctl load ~/Library/LaunchAgents/com.headroom.proxy.plist

# Tail logs
tail -f /tmp/headroom-proxy.log
```

## Savings (benchmarked)

- Code search: 92% reduction
- SRE debugging: 92% reduction
- GitHub triage: 73% reduction
- Codebase exploration: 47% reduction
- Effective Claude Code usage increase: ~34% before hitting rate limits
