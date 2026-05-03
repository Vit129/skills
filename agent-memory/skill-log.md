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
| 2026-05-03 | skills/finance + .claude/.gemini/agents | Finance subagent usage was documented for fundamentals only, leaving newer lanes and cross-runtime prompt portability implicit | Added bounded lane patterns for news/portfolio-fit/ETF lens, matching Claude/Gemini agent definitions, and a cross-runtime usage guide that preserves the evidence-only contract | applied |
| 2026-05-03 | skills/finance/etf + portfolio | ETF and portfolio skills had high overlap (both portfolio-level view) but were separate skills adding routing complexity | Merged into `portfolio-etf-analysis` with mode detection (Portfolio/ETF/Combined); renamed `mock-orchestration-prompts` → `orchestration-prompts`; updated all references | applied |
| 2026-05-03 | system/agent-memory | User_Profile mixed into memory.md hot state consumed ~300 bytes of 2,500 budget; no capacity visibility; zero-score playbook cases accumulated indefinitely | Separate user-profile.md (Hermes USER.md pattern); add capacity indicator in memory.md header; archive zero-score cases after 30 days; session-load hook v3.1.0 | applied |
| 2026-05-03 | system/agent-memory | No self-evolve loop: skills only improved manually; no knowledge pipeline automation; no subagent delegation for curation | Added skill-evolve hook (postTaskExecution: propose improvements), knowledge-curate hook (agentStop: promote/crystallize/archive via subagent), lesson pipeline rules in steering, session-save v4.0 delegates heavy curation | applied |
| 2026-05-03 | system/agent-memory | SKILL.md, session-flow.md, subagent-patterns.md outdated — missing self-evolve hooks, knowledge pipeline, 6-hook table, user-profile.md | Updated all 4 reference files + added user-profile.md template to reflect full system: 6 hooks, 2 closed loops, subagent delegation thresholds | applied |
