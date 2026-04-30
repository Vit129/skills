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
