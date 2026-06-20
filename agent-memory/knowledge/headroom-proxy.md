# Headroom — Context Compression for AI Agents

**GitHub:** https://github.com/chopratejas/headroom  
**Status:** ACTIVE — v0.26.0 installed 2026-06-18, running as LaunchAgent

## What it does

Compresses everything an AI agent reads (tool outputs, logs, RAG chunks, files, conversation history) before it reaches the LLM — same answers, 60–95% fewer tokens.

Also trims what the model **writes back** via Output Shaper (`HEADROOM_OUTPUT_SHAPER=1`).

## Architecture

```
Claude Code / Codex
  → localhost:8787 (Headroom proxy)
    → CacheAligner → ContentRouter → CCR
         ├─ SmartCrusher   (JSON)
         ├─ CodeCompressor (AST: Python, JS, Go, Rust, Java, C++)
         └─ Kompress-base  (text — local HuggingFace model)
  → upstream API (Anthropic / OpenAI)
```

- LaunchAgent: `~/Library/LaunchAgents/com.headroom.proxy.plist`
- Binary: `/Library/Frameworks/Python.framework/Versions/3.13/bin/headroom`
- Log: `/tmp/headroom-proxy.log` · Error: `/tmp/headroom-proxy.err`

## Shell Config (~/.zshrc)

```bash
export ANTHROPIC_BASE_URL=http://127.0.0.1:8787
export OPENAI_BASE_URL=http://127.0.0.1:8787/v1
export HEADROOM_OUTPUT_SHAPER=1
```

## Routing Table

| Path | Upstream |
|------|----------|
| `/v1/messages` | `https://api.anthropic.com` |
| `/v1/chat/completions` | `https://api.openai.com` |
| `/v1/responses` | `https://api.openai.com` (HTTP + WebSocket) |
| `/v1internal:streamGenerateContent` | `https://cloudcode-pa.googleapis.com` |

## Agent Compatibility

| Agent | Works | Method |
|-------|-------|--------|
| Claude Code | ✅ | `ANTHROPIC_BASE_URL` env var |
| Codex CLI | ✅ | `OPENAI_BASE_URL` env var, shares memory with Claude |
| Cursor | ✅ | `headroom wrap cursor` (prints config once) |
| Aider | ✅ | `headroom wrap aider` |
| Copilot CLI | ✅ | `headroom wrap copilot` |
| Kiro CLI | ❌ | AWS Bedrock/gRPC — no HTTP override |
| Agy (Antigravity CLI) | ❌ | `cloudcode-pa.googleapis.com` gRPC hardcoded |

## Core Commands

```bash
# Health & stats
curl http://127.0.0.1:8787/health
curl http://127.0.0.1:8787/stats
curl http://127.0.0.1:8787/stats-history

# Output token savings estimate
headroom output-savings

# Restart proxy
launchctl unload ~/Library/LaunchAgents/com.headroom.proxy.plist
launchctl load ~/Library/LaunchAgents/com.headroom.proxy.plist

# Update
headroom update           # auto-detects pip/pipx/uv and upgrades
headroom update --check   # check without upgrading

# Logs
tail -f /tmp/headroom-proxy.log
```

## headroom learn (auto-improve CLAUDE.md)

Mines past failed sessions and writes corrections/lessons directly into `CLAUDE.md` / `AGENTS.md`:

```bash
headroom learn                     # dry run — preview what it found
headroom learn --apply             # writes corrections to CLAUDE.md / AGENTS.md

headroom learn --verbosity         # learn preferred terseness (dry run)
headroom learn --verbosity --apply # save; proxy uses it immediately
```

Run periodically — especially after debugging sessions or repeated tool failures.

## Cross-Agent Memory

Shared context store across Claude Code, Codex, Gemini — with auto-dedup:

```bash
headroom wrap claude --memory      # enable shared memory
headroom wrap codex --memory       # Codex shares same store as Claude
```

## MCP Server

```bash
headroom mcp install               # install as MCP server for any MCP client
```

Tools: `headroom_compress`, `headroom_retrieve`, `headroom_stats`

CCR (reversible compression): originals cached locally; LLM calls `headroom_retrieve` if it needs full context back.

## Savings (benchmarked)

| Workload | Before | After | Savings |
|----------|-------:|------:|--------:|
| Code search (100 results) | 17,765 | 1,408 | **92%** |
| SRE debugging | 65,694 | 5,118 | **92%** |
| GitHub issue triage | 54,174 | 14,761 | **73%** |
| Codebase exploration | 78,502 | 41,254 | **47%** |

Accuracy preserved: GSM8K ±0.000, TruthfulQA +0.030, SQuAD v2 97% at 19% compression, BFCL 97% at 32% compression.

Effective Claude Code usage increase: ~34% before hitting rate limits.
