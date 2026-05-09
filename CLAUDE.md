# Claude Agent Workspace

`CLAUDE.md` is the entry point and index.

Source of truth:
- `rules/` for behavior, routing, response format, and skill map
- `output-styles/communication-style.md` for tone
- `agent-memory/` for cross-session memory
- `GRAPH_REPORT.md` for structural navigation when present

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
- `skills/KIRO.md`

Generated agent configs:
- `scripts/sync-agent-instructions.sh` writes `~/.codex/AGENTS.md`
- `scripts/sync-agent-instructions.sh` writes `~/.gemini/GEMINI.md`

Project-specific notes:
- Update `rules/` first, then resync generated configs.
- Use `rules/skill-map.md` when deciding which skill to load.
- Use `agent-memory/` for session state, playbook, and knowledge promotion.
