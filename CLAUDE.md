# Claude Agent Workspace

`CLAUDE.md` is the entry point and index.

Source of truth:
- `rules/` for behavior, routing, response format, and skill map
- `output-styles/communication-style.md` for tone
- `agent-memory/` for cross-session memory
- `GRAPH_REPORT.md` for structural navigation when present

Cross-session memory (loaded every session):
- @agent-memory/memory.md

Key references:
- `rules/agent-core.md`
- `rules/skill-map.md`
- `rules/project-rules.md`
- `rules/response-format.md`
- `rules/workflow.md`
- `rules/skills-sync-protocol.md`
- `rules/citation-format.md`
- `rules/token_efficient.md`
- `output-styles/communication-style.md`

Generated agent configs:
- `scripts/sync-agent-instructions.sh` writes `~/.codex/AGENTS.md`
- `scripts/sync-agent-instructions.sh` writes `~/.gemini/GEMINI.md`

Project-specific notes:
- Update `rules/` first, then resync generated configs.
- Use `rules/skill-map.md` when deciding which skill to load.
- Use `agent-memory/` for session state, playbook, and knowledge promotion.

## Auto Memory + Dream Protocol

Claude Code maintains two complementary memory layers — use both:

| Layer | Location | Purpose | Who writes |
|-------|----------|---------|------------|
| **Auto Memory** | `~/.claude/projects/.../memory/` | Session knowledge: build commands, debugging patterns, YAML tricks | Claude (automatic) |
| **agent-memory/** | `~/.claude/agent-memory/` | Structured state: Task_Ledger, Decisions, Playbook, cross-agent | Claude via hooks |

### Promote Rule
When Auto Memory contains a pattern that has recurred 2+ times or prevented a mistake → promote it:
- Reusable fix/pattern → `agent-memory/playbook.md` (new CASE-xxx row)
- Domain knowledge → `agent-memory/knowledge/{domain}.md`
- Skill improvement → `agent-memory/skill-log.md`

### Dream
Run `/dream` when Auto Memory feels cluttered or after 5+ sessions. It deduplicates entries, removes stale notes, and resolves relative dates. Auto Dream runs automatically every 24h after 5+ sessions — no manual trigger needed unless memory is degraded.
