---
id: agent-config-transparency-pattern
type: pattern
scope: global
status: draft
score: 5.0
created: 2026-04-26
updated: 2026-04-26
keywords: agent-config, skill-invocation, transparency, announce, CLAUDE.md, skill-map, global-config
---

# Pattern: Agent Config Transparency

## Summary
Agent configurations should be explicit and transparent — both in what skills are available and how they are invoked.

## Rules

1. **CLAUDE.md must list all skill domains** — not just coding/SDLC. Include ux-ui, finance, po, qa, rules, system.
2. **Skill invocation must be announced** — format: `[Skill: {path}]` before using any skill. Path from `skill-map.md`.
3. **skill-map.md is the SSOT** for all skill paths — never hardcode paths in CLAUDE.md or agent configs.

## Evidence
- `session-2026-04-26-kiro-9`: Added Skill Invocation Rule to agent-core.md
- `session-2026-04-26-kiro-10`: Expanded CLAUDE.md Skills table to all domains

## When to Apply
- Setting up a new agent config
- Reviewing CLAUDE.md / GEMINI.md / CODEX.md
- Adding a new skill domain to the ecosystem
