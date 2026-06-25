# 🧠 Central AI Agent Workspace

The ultimate personal knowledge base and "Single Source of Truth" (SSOT) configuration hub for AI-assisted software engineering. This repository acts as the master brain that syncs rules, skills, and memory across multiple AI agents (Claude Code, Gemini CLI, Codex CLI, and Kiro IDE).

---

## 🌟 Core Philosophy

- **Single Source of Truth (SSOT):** Write a rule or a skill once, deploy it to every AI agent instantly. No more copy-pasting prompts.
- **Context-Aware Memory:** Agents share cross-session memory (`agent-memory/`) so they never forget past mistakes, user preferences, or successful playbooks.
- **Modular AI Skills:** Treats AI prompts like code packages. Need a tax accountant? Load `thai-accountant/`. Need Playwright E2E tests? Load `qa/playwright-testing/`.
- **Graph-First Navigation:** Graphify maps the workspace into a queryable knowledge graph — agents query before reading files.

---

## 🔑 Key Features

### 1. 🔄 Multi-Agent Sync Engine

Automated bash scripts ensure every CLI tool reads the same rules. Translates global Markdown configurations into the specific formats required by `CLAUDE.md`, `GEMINI.md`, and `AGENTS.md`.

```bash
bash scripts/sync-rules.sh              # Mirror rules/ to all agents
bash scripts/sync-agent-instructions.sh # Regenerate GEMINI.md and AGENTS.md
bash scripts/sync-all.sh --only skills  # Merge skills/ to ~/.agents/skills for Codex + Gemini
```


```bash
```

### 2. 📚 Universal Skill Library

Skills are organized in a flat domain-based structure under `skills/`:

```
skills/
├── governance/          # AIDLC process control (aidlc, subagent-driven)
├── thinking/            # Ideation & analysis (brainstorming, doubt-driven, interview-me, ...)
├── dev/                 # Implementation (backend-dev, frontend-dev, dev-architect, ...)
├── qa/                  # Quality & testing (playwright-testing, test-scenario, ...)
├── debugging/           # Bug lifecycle (debug-mantra, find-mismatch, post-mortem)
├── review/              # Code review & communication (review-personas, management-talk)
├── tooling/             # Integrations (azure-devops-bridge, postman-to-playwright, ...)
├── ux-ui/               # Design (ui-designer)
├── rules/               # Coding standards (playwright-rules, robotframework-rules, ...)
├── knowledge/           # Reference data (automation, business, lessons)
├── templates/           # Reusable templates
├── meta-skills/         # Generic reusable skills (agent-memory, skill-creator, graph-report, ...)
├── drafts/              # Staging area — auto-created by /skill-review when a skill hits ≥3 uses
│
│ ── Personal (Claude-only, not synced to Kiro) ──
├── finance/             # Investment research, portfolio analysis
├── fitness/             # Workout, nutrition, body composition
├── thai-accountant/     # Thai tax, TFRS, accounting
├── claude-code-tips/    # Claude Code productivity tips
└── playwright-cli/      # Browser CLI automation
```

Skills follow the **5-Part Framework** (Ben AI): Name+Trigger, Objective, Required Context, Process (with Human-in-the-Loop), Rules+Self-Learning.

### 3. 🧠 Cross-Domain Persistent Memory

Two complementary layers — neither replaces the other:

**Layer 1 — agent-memory/ (Structured, Cross-Agent)**

| File | Purpose |
|------|---------|
| `memory.md` | Hot state: Task_Ledger, Decisions_In_Force, Skill_Flags (2.5KB max) |
| `playbook.md` | Proven bug fixes and solutions (CASE-xxx, scored) |
| `skill-log.md` | Skill improvement proposals (proposed → approved → applied) |
| `skill-usage.log` | Raw skill invocation log (`DATE\|skill-name`) written by PostToolUse hook |
| `user-profile.md` | Stable user preferences + inferred work patterns |
| `knowledge/` | Promoted domain patterns (biz, arch, qa, bug) |

Readable by Claude Code, Kiro, Codex, and Gemini via their respective config files.

**Layer 2 — Auto Memory (Claude Code Native)**

- Stored at `~/.claude/projects/<project>/memory/`
- Claude writes automatically: build commands, debugging patterns, YAML tricks
- `/dream` consolidates it (dedup, stale removal, date resolution)
- Auto Dream triggers every 24h after 5+ sessions

**Promote Rule:** When Auto Memory contains a pattern that recurred 2+ times → promote to `agent-memory/playbook.md` or `knowledge/`.

**Session Search:** Use `grep_search` across `knowledge/` + `playbook.md` + `memory.md` for cross-session recall before starting a new task.

### 4. 🔁 Skill Self-Improvement Loop

Skills get better automatically over time through a three-layer feedback loop:

```
Use skill → PostToolUse hook logs DATE|skill-name → skill-usage.log
                    ↓ (weekly)
              /skill-review reads log
              → counts uses per skill
              → diffs against skill-log.md
              → writes "proposed" entries for skills with ≥3 uses
              → auto-drafts skills/drafts/{name}/SKILL.md for crystallized patterns
                    ↓ (user-gated)
              "approve skill draft {name}"
              → Claude merges draft into live skill
```

**Key rule (CASE-005):** The capture hook is shell-only — no model calls. Only `/skill-review` does model-driven judgment. This prevents the unreliable askAgent pattern.

```bash
/skill-review                        # Weekly review — propose + draft improvements
"approve skill draft {name}"         # Merge a draft into the live skill
"reject skill draft {name}"          # Discard + update skill-log status
```

### 5. 📐 Karpathy Principles & AIDLC

Enforces strict engineering standards based on Andrej Karpathy's 4 principles (always active via `rules/agent-core.md`):

1. **Think Before Coding** — Don't assume. Surface tradeoffs. Ask when unclear.
2. **Simplicity First** — Minimum code that solves the problem. Nothing speculative.
3. **Surgical Changes** — Touch only what you must. Clean up only your own mess.
4. **Goal-Driven Execution** — Define success criteria. Loop until verified.

Combined with **AIDLC** (AI Development Life Cycle) — a structured workflow that enforces phase gates (Inception → Task Design → Execute) before any code is written.

### 6. 🗺️ Graphify Knowledge Graph

Graphify maps the workspace into a queryable knowledge graph. Agents use it as the **first navigation layer** before broad file reading.

```bash
graphify .                    # Build graph
graphify . --update           # Update after changes (AST-only, no LLM cost)
graphify query "..."          # Query the graph
graphify explain "X"          # Explain a node
graphify path "A" "B"         # Find connection between two nodes
```

Outputs: `graphify-out/graph.json`, `graphify-out/graph.html`, `graphify-out/GRAPH_REPORT.md`

See `GRAPHIFY_USAGE.md` for full routing and install instructions.

### Managing Rules

```bash
bash scripts/sync-rules.sh               # Mirror rules/ to all agents
bash scripts/sync-agent-instructions.sh  # Regenerate GEMINI.md and AGENTS.md
```

### Managing Skills

```bash
# Sync ~/.claude/skills/ → shared Codex + Gemini runtime
bash scripts/sync-all.sh --only skills

```

Append `--dry-run` to any script to preview changes before applying.

### Skill Self-Improvement

```bash
/skill-review                        # Review usage log → propose/draft improvements
"approve skill draft {name}"         # Merge skills/drafts/{name}/SKILL.md into live skill
cat ~/.claude/agent-memory/skill-usage.log  # Raw usage log (DATE|skill-name per line)
```

### Building the Knowledge Graph

```bash
graphify .                    # First time
graphify . --update           # After changes
graphify cluster-only .       # Rerun clustering only (fastest)
```

---

## 📁 Key Files

| Path | Purpose |
|------|---------|
| `CLAUDE.md` | Entry point — rules index, agent routing, memory protocol |
| `GRAPHIFY_USAGE.md` | Graphify routing SSOT — install paths and triggers |
| `rules/agent-core.md` | Core standards: Karpathy principles, security, testing, documentation |
| `rules/skill-map.md` | Keyword → skill routing table (updated to new flat structure) |
| `rules/project-rules.md` | AIDLC enforcement, phase gates, language rules |
| `rules/workflow.md` | Working style, response format, do/don't list, citation format |
| `rules/frontend.md` | React/TypeScript/Tailwind standards |
| `rules/token_efficient.md` | 12 token optimization techniques |
| `agent-memory/memory.md` | Hot state (2.5KB max) |
| `agent-memory/playbook.md` | Problem resolution cases (scored) |
| `graphify-out/GRAPH_REPORT.md` | Workspace knowledge graph (when generated) |

---

*For detailed architecture mapping, see `graphify-out/GRAPH_REPORT.md`. For rule logic and sync protocols, check the `rules/` directory.*
