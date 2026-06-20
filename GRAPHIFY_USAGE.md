# Graphify Usage & Routing

Source: https://github.com/safishamsi/graphify
Official package: `graphifyy` | CLI: `graphify` | Path: `~/.local/bin/graphify`

Graphify turns this workspace into a persistent knowledge graph. Use it as the **first navigation layer** for questions about rules, skills, memory, scripts, or workspace structure — before broad `rg`, raw file browsing, or reading the full report.

---

## Installed Skill Paths

| Agent | Skill Path |
|-------|-----------|
| Claude Code | `~/.claude/skills/graphify/SKILL.md` |
| Codex | `~/.agents/skills/graphify/SKILL.md` |

---

## Trigger Rules

When the user types `/graphify`, `$graphify`, asks to map a project, create a knowledge graph, query `graphify-out/`, or inspect architecture with graph context:

1. Load the Graphify skill before broad file reading.
2. If `graphify-out/graph.json` exists → query/explain/path through Graphify before `rg` or multi-file reads.
3. If no path is provided → use the current working directory.
4. Preserve Graphify honesty rules: never invent edges, surface corpus warnings, show raw cohesion scores.

---

## Local Outputs

```
graphify-out/
├── graph.json         — queryable graph data
├── graph.html         — interactive visualization
├── GRAPH_REPORT.md    — full architecture and relationship report (~4000 lines)
└── GRAPH_SUMMARY.md   — capped 70-line digest for CLAUDE.md auto-load (generated)
```

Keep these committed so new sessions can query the existing map without rebuilding.

`GRAPH_SUMMARY.md` is auto-loaded at session start via `@graphify-out/GRAPH_SUMMARY.md` in each project's CLAUDE.md — contains god nodes, community hubs top 25, graph freshness, and surprising connections.

---

## Query-First Workflow

Use the smallest command that can answer the question:

```bash
graphify query "how are agent instructions generated?"
graphify query "which files define Graphify routing?"
graphify query "what connects skills to agent memory?"
graphify explain "agent-memory"
graphify path "CLAUDE.md" "AGENTS.md"
```

Use `GRAPH_REPORT.md` only for broad architecture review when `query`, `explain`, and `path` don't surface enough context.

---

## Common Commands

```bash
# Build or rebuild the graph
graphify extract .

# Update after code/rule/skill/memory changes (AST-only, no LLM cost)
# ALWAYS follow with summary regen so GRAPH_SUMMARY.md stays current:
graphify update . && ~/.claude/scripts/generate-graph-summary.sh .

# Rerun clustering/report without full extraction
graphify cluster-only .

# Open or regenerate call-flow architecture page
graphify export callflow-html

# Query the existing graph
graphify query "how do Claude and Codex share instructions?"
graphify explain "Graphify SSOT"
graphify path "skills" "rules"
```

**Prefer `cluster-only`** when `graph.json` already exists — reuses the existing graph, regenerates communities/report/HTML without re-extracting.

---


## Platform Install (run once per workspace)

```bash
graphify claude install
graphify codex install
graphify gemini install
```

Codex also needs `multi_agent = true` under `[features]` in `~/.codex/config.toml`.

---

## Agent Entrypoints

| Agent | Entrypoint |
|-------|-----------|
| Claude Code / CLI | `graphify cluster-only .` |
| Gemini CLI | `/graphify .` |
| Codex CLI | `graphify cluster-only .` or `$graphify .` |

---

## Update Safety

`graphify update .` is AST-only — no LLM credits. If it refuses to overwrite (new graph has fewer nodes), do **not** use `--force` by default. Use `--force` only after confirming missing nodes are expected.

---

## Source of Truth Protocol

When Graphify routing changes:
1. Update this file (`~/.claude/GRAPHIFY_USAGE.md`) first
2. Mirror to `~/.codex/rules/graphify-ssot.md` if it exists
3. Regenerate agent entrypoints as needed

---

## .graphifyignore (recommended)

```gitignore
.DS_Store
history.jsonl
stats-cache.json
file-history/
session-env/
sessions/
shell-snapshots/
telemetry/
todos/
downloads/
backups/
cache/
graphify-out/
```