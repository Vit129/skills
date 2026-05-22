# Graphify Usage

Source: https://github.com/safishamsi/graphify

Graphify turns this workspace into a persistent knowledge graph. Use it as the first navigation layer for questions about Claude/Codex rules, skills, memory, scripts, generated agent configs, or workspace structure before broad `rg`, raw file browsing, or reading the full report.

## Local Outputs

This workspace stores the graph in `graphify-out/` when generated:

- `graphify-out/graph.json` - queryable graph data
- `graphify-out/graph.html` - interactive graph visualization
- `graphify-out/GRAPH_REPORT.md` - broad architecture and relationship report

## Source of Truth

Graphify routing for this workspace is defined in:

- `~/.codex/rules/graphify-ssot.md`
- `~/.claude/CLAUDE.md`
- `~/.codex/AGENTS.md`

Update `~/.codex/rules/graphify-ssot.md` first when Graphify routing changes, then resync generated agent entrypoints.

## Agent Entry Points

- Claude Code / Claude CLI: `graphify cluster-only .`
- Gemini CLI: `/graphify .`
- Codex CLI: `graphify cluster-only .`
- Hermes CLI: `graphify cluster-only .`
- Codex platform skill: `$graphify .` when installed; otherwise use the `graphify` CLI commands below.

If the user invokes `/graphify` or `$graphify`, use the Graphify skill/integration first when available. If the skill tool is unavailable, run the equivalent CLI command.

For Claude CLI, Codex CLI, and Hermes CLI entrypoint refreshes, prefer `graphify cluster-only .` when `graphify-out/graph.json` already exists so agents reuse the existing graph and regenerate communities/report/HTML without re-extracting the corpus.

If `graphify-out/graph.json` does not exist yet, build the graph first with `graphify extract .`.

## Query-First Workflow

For workspace questions, use the smallest graph command that can answer the question:

```bash
graphify query "how are agent instructions generated?"
graphify query "which files define Graphify routing?"
graphify query "what connects skills to agent memory?"
graphify explain "agent-memory"
graphify path "CLAUDE.md" "AGENTS.md"
```

Use `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when `query`, `explain`, and `path` do not surface enough context.

## Common Commands

Build or rebuild the graph:

```bash
graphify extract .
```

Query the existing graph:

```bash
graphify query "how do Claude and Codex share instructions?"
graphify query "which scripts sync generated agent configs?"
graphify query "what files describe memory promotion?"
graphify explain "Graphify SSOT"
graphify path "skills" "rules"
```

Update after rule, skill, script, or memory changes:

```bash
graphify update .
```

Rerun clustering/report generation without full extraction:

```bash
graphify cluster-only .
```

Open or regenerate a call-flow architecture page:

```bash
graphify export callflow-html
```

## Platform Install Commands

Run these once if an assistant does not already know to use Graphify in this workspace:

```bash
graphify claude install
graphify codex install
graphify gemini install
```

Codex also needs `multi_agent = true` under `[features]` in `~/.codex/config.toml` for Graphify's multi-agent extraction workflow.

## Update Safety

`graphify update .` is AST-only and should not use LLM credits. If it refuses to overwrite because the new graph has fewer nodes than the existing graph, do not force it by default. Use `--force` only after confirming the missing nodes are expected.

## Ignore Rules

Use `.graphifyignore` in the workspace root to exclude generated files, secrets, bulky caches, session history, telemetry, and other irrelevant paths from graph extraction.

Recommended exclusions for this workspace include:

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

## Team Rule

Keep `graphify-out/graph.json`, `graphify-out/graph.html`, and `graphify-out/GRAPH_REPORT.md` available to agents so new sessions can query the existing map without rebuilding the workspace from scratch.
