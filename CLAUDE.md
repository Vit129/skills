# Claude Agent Workspace

`CLAUDE.md` is the entry point and index.

Source of truth:

- `rules/` for behavior, routing, response format, and skill map
- `output-styles/communication-style.md` for tone
- `agent-memory/` for cross-session memory
- `GRAPHIFY_USAGE.md` for Graphify routing and install paths
- `GRAPH_REPORT.md` for structural navigation when present

Cross-session memory (loaded every session):

- @agent-memory/CONTEXT.md
- @agent-memory/index.md

On-demand:
- @agent-memory/MEMORY.md — past decisions + lessons
- @agent-memory/user-profile.md

---

## Rules — Auto (every session)

- @rules/project-rules.md — AIDLC enforcement, phase gates, language rules
- @rules/workflow.md — working style, response format (Done/Next/Why), do/don't list, citation format
- @rules/skill-auto-detect.md — skill keyword→invocation routing table (MANDATORY: invoke Skill() when keyword matches, before responding)

## Rules — On-demand (read when triggered)

- `rules/agent-core.md` — Read when: complex multi-file implementation, security review, architecture decision, or planning phase
- `rules/skill-map.md` — Read when: routing to a skill, user invokes `/skill-name`, or skill selection is unclear
- `rules/skills-sync-protocol.md` — Read when: creating, updating, or syncing skills across agents
- `rules/coding-guidelines.md` — Read when: writing/editing code, citing sources/lessons/skills, or composing routing/skill-review prompts (split out of `workflow.md` to keep auto-loaded core lean)
- `output-styles/communication-style.md` — Read when: adjusting tone or formatting style

## Skills — On-demand (load via Skill tool when triggered)

Skills are invoked via the `Skill` tool — not auto-loaded. Trigger by keyword or `/skill-name`:

- `dev/frontend-dev/` — React, TypeScript, Tailwind, Flutter, Android, iOS
- `finance/` — investment research, portfolio analysis, stock screening
- `thai-accountant/` — Thai tax, TFRS, accounting
- `fitness/` — workout, nutrition, body composition
- Codex skill root: `~/.codex/skills/` · Agy (Antigravity CLI) global skill root: `~/.gemini/antigravity-cli/skills/`
- `meta-skills/agent-memory/` — memory bootstrap, session flow, knowledge pipeline
- See `rules/skill-map.md` for full routing table

## Infrastructure — Headroom Proxy (always-on)

All Claude Code and Codex traffic routes through Headroom proxy (`localhost:8787`) for token compression (47-92% savings). Kiro and Agy (Antigravity CLI) bypass it (gRPC backends, no HTTP override).

- Knowledge: `agent-memory/knowledge/headroom-proxy.md`
- Health: `curl http://127.0.0.1:8787/health`
- Stats: `curl http://127.0.0.1:8787/stats`

---

## Agent Routing (Plugin-based)

| Task | Agent | Trigger |
|------|-------|---------|
| Read / explore project structure | Gemini 3 Flash + Graphify | อ่านโค้ด, หาไฟล์, ดู structure |
| Planning / architecture | Claude (main) | วางแผน, ออกแบบ, เลือก approach |
| Coding / implementation | Codex | เขียนโค้ด, แก้ bug, refactor |

Rules:

- อ่าน project structure → spawn Gemini 3 Flash + Graphify ก่อน แล้วนำผลลัพธ์มาวางแผน
- วางแผนใน Claude แล้ว delegate implementation ให้ Codex
- Claude เป็น orchestrator — ไม่เขียนโค้ดเองถ้า Codex ทำได้

---

## Graphify

Routing SSOT: `GRAPHIFY_USAGE.md`

When the user types `/graphify`, invoke the Skill tool with `skill: "graphify"` before doing anything else.

Use Graphify as the **first navigation layer** before broad file reading:

```bash
graphify query "..."
graphify explain "X"
graphify path "A" "B"
```

### Auto-summary (always-on per project)

Graphified projects (`harness-terminal`, `Home-Assistant`, `My-Investment-Port`) auto-load `@graphify-out/GRAPH_SUMMARY.md` at session start via their own CLAUDE.md — no manual trigger needed. The summary contains god nodes, community hubs top 25, freshness check, and surprising connections (~70 lines).

After any `graphify update .`, always regenerate the summary:
```bash
graphify update . && ~/.claude/scripts/generate-graph-summary.sh .
```

---

## Auto Memory + Dream Protocol

Two complementary memory layers — use both:

| Layer | Location | Purpose | Who writes |
|-------|----------|---------|------------|
| Auto Memory | `~/.claude/projects/.../memory/` | Session knowledge: build commands, debugging patterns | Claude (automatic) |
| agent-memory/ | `~/.claude/agent-memory/` | Structured state: Task_Ledger, Decisions, Playbook | Claude via hooks |

### Promote Rule

When Auto Memory contains a pattern that recurred 2+ times or prevented a mistake → promote it:

- Reusable fix/pattern → `agent-memory/playbook.md` (new CASE-xxx row)
- Domain knowledge → `agent-memory/knowledge/{domain}.md`
- Skill improvement → `agent-memory/skill-log.md`

### Skill Self-Improvement Loop

Skills improve automatically through three layers:

| Layer | Mechanism | Who acts |
|-------|-----------|----------|
| Capture | `PostToolUse:Skill` hook → appends `DATE\|skill` to `agent-memory/skill-usage.log` | Automatic (shell only, no model call) |
| Review | `/skill-review` reads log, diffs `skill-log.md`, writes proposals, auto-drafts at ≥3 uses | Claude (model-driven) |
| Approve | User says `"approve skill draft {name}"` → Claude merges `skills/drafts/{name}/SKILL.md` | User-gated |

Run `/skill-review` weekly or after 5+ skill-heavy sessions.

### Dream

Run `/dream` when Auto Memory feels cluttered or after 5+ sessions. Auto Dream triggers every 24h after 5+ sessions.

---

## Sync

Generated agent configs:

- `scripts/sync-agent-instructions.sh` writes `~/.codex/AGENTS.md` and `~/.gemini/GEMINI.md`
- `scripts/sync-all.sh --only skills` merges `skills/` to `~/.codex/skills/` and `~/.gemini/antigravity-cli/skills/`
- `~/.kiro/scripts/sync-skills-to-claude.sh` syncs `~/.kiro/skills/` → `~/.claude/skills/`

Update `rules/` first, then resync generated configs.
