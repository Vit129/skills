# Wing: token-optimization-tooling

> Research and configuration of token optimization tools for Claude Code / AI agents

## Room: token-efficient-md-content

**Topic:** `.claude/rules/token_efficient.md` — content structure and sources
**Date:** 2026-04-26

### Current State

File at `.claude/rules/token_efficient.md` contains 12 sections covering all major token optimization dimensions, written in English.

### Content Structure (12 sections)

1. Extended Thinking Token Management — toggle Tab, MAX_THINKING_TOKENS=8000
2. Prompt Cache Protection — don't edit rules mid-session
3. Autocompact Circuit Breaker — /model 1M then /compact
4. Context Efficiency with .claudeignore — exclude build/deps/test/secrets
5. Output Compression (Caveman) — cut filler/articles/hedging, ~65-75% output reduction
6. CLI Output Filtering (RTK) — filter shell output before context, 60-90% reduction
7. Documentation Layering — 4 core files at startup, rest on-demand, ~90% startup reduction
8. Structural Code Navigation — AST symbol graph, blast-radius, ~97% reduction
9. MCP Tool Context Sandboxing — sandbox + Think-in-Code paradigm, ~98% reduction
10. MCP Tool Caching (token-optimizer-mcp) — cache repeated MCP calls, ~95%+ reduction
11. Ghost Token Detection (Token Optimizer) — dashboard, compaction survival
12. Vector Search (Claude Context) — semantic search via Milvus/Zilliz

### Source Repos Researched

| # | Repo | Key Principle |
| --- | --- | --- |
| 1 | JuliusBrussee/caveman | Caveman-speak output compression ~75% |
| 2 | rtk-ai/rtk | CLI proxy filters shell output 60-90% |
| 3 | tirth8205/code-review-graph | AST blast-radius navigation 8.2x avg |
| 4 | mksglu/context-mode | MCP sandbox + Think-in-Code ~98% |
| 5 | nadimtuhin/claude-token-optimizer | Doc layering 4 core files ~90% startup |
| 6 | alexgreensh/token-optimizer | Ghost token detection + compaction survival |
| 7 | ooples/token-optimizer-mcp | MCP caching + compression ~95%+ |
| 8 | zilliztech/claude-context | Vector semantic search for large codebases |
| 9 | drona23/claude-token-efficient | Single CLAUDE.md rules file ~63% output |
| 10 | mibayy/token-savior | Symbol nav 97% + persistent memory engine |

### Decision

All 10 repos researched and principles extracted. File rewritten in English (was partially Thai). Section #10 (token-optimizer-mcp) added as separate section — was missing in first draft.

## Room: session-save-hook-routing

**Topic:** session-save hook v4.0.0 — workspace-aware agent-memory routing
**Date:** 2026-04-26

### Problem

Hook was always writing to `{root}/agent-memory/` (VitProjects) even when files were edited in `~/.claude/`. Cross-project knowledge (token optimization, tooling) ended up in wrong location.

### Fix (v4.0.0)

Added Step 0 to session-save hook prompt:

- Files edited in `~/.claude/` → write to `~/.claude/agent-memory/`
- Files edited in project workspace → write to `{project_root}/agent-memory/`
- Both edited → update both

### Also Fixed

- Content filter relaxed: tooling, hooks, rules, skills config are now always captured (were being skipped as "general AI tool explanations")
- Both VitProjects and .claude hooks updated to v4.0.0 simultaneously
