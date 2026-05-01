# Skill Log — Improvement Proposals

<!-- Append-only. Never delete entries. -->
<!-- Status lifecycle: proposed → approved → applied | rejected -->
<!-- Max 1 proposal per skill per session. -->
<!-- Accepts all skill types: ai-dlc/*, finance/*, fitness/*, thai-accountant/*, system/* -->

| Date | Skill | Problem | Proposed Change | Status |
|------|-------|---------|-----------------|--------|
| 2026-04-29 | system/agent-memory | palace/graph/tunnels/archive were Markdown ports of SQLite-derived data — unmaintainable | Cut derived files; keep only Markdown-native core (memory.md, playbook.md, skill-log.md, knowledge/) | applied |
| 2026-04-29 | ai-dlc/core/aidlc | Vibe/Spec mode detection used keyword parsing; artifacts went to `.kiro/specs/`; dialog was Kiro-only | Detection=IDE mode context; artifacts→`.aidlc/` only; dialog=global rule all agents | applied |
| 2026-04-29 | ai-dlc/core | brainstorming (Party Mode) + subagent-driven skills missing from ai-dlc ecosystem | Created `core/brainstorming/` + `core/subagent-driven/` skills; registered in all routing points | applied |
| 2026-05-01 | skills/claude-code-tips | No single place to look up Claude Code productivity patterns — tips scattered across docs | Created `skills/claude-code-tips/SKILL.md` with 27-tip reference table, quick-start checklist, and workflow templates | applied |
| 2026-05-01 | rules/response-format | No enforceable standard for response structure, quality gate, or test-before-deliver across agents | Created `rules/response-format.md` with Done→Next→Why→Options, 9/10 gate, clarifying Qs, periodic self-review | applied |
