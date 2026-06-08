# Agent Memory — Hot State

<!-- Max 2,500 bytes. Usage updated at session end. See user-profile.md for user preferences. -->
<!-- Usage: ~1,800/2,500 bytes (72%) after 2026-06-02 optimization -->

## Task_Ledger

<!-- Max 5 entries. Coding: system/feature/phase/status | Non-Coding: domain/goal/status -->
<!-- Mark stale after 3 sessions without update. Remove oldest stale when full. -->
<!-- If all 5 active and new task needed → prompt user to archive one. -->

| # | Type | Entry | Last Updated |
|---|------|-------|--------------|
| 1 | non-coding | Auto-create skill drafts — knowledge-curate hook v2.0: promote/crystallize → auto-draft SKILL.md in skills/drafts/ if criteria pass. skill-map + SKILL.md updated | 2026-05-18 |

## Recent_Lessons

<!-- Last 5 lesson IDs only. Detail lives in playbook.md or knowledge/. -->

- CASE-001 — memory target routing: global skill changes → `.claude/agent-memory/`, project changes → `{project}/agent-memory/`
- CASE-002 — AIDLC Vibe/Spec: detection=Kiro IDE mode (not keyword), artifacts→`.aidlc/` only, dialog=global rule all agents
- CASE-004 — project_specs.md at repo root is ignored by `.gitignore` (`*` rule) — put templates in `rules/` instead
- CASE-005 — hooks askAgent ไม่ reliable สำหรับ memory update → ใช้ workflow Step 10 (agent เขียนเอง) แทน
- MEM-UPGRADE-001 — Hermes-inspired: user-profile.md separates stable prefs from hot state; capacity indicator in memory.md header

## Skill_Flags

<!-- Max 5 entries. Auto-clear when 3 consecutive successes. -->
<!-- When full, replace entry with most successes since flagging. -->

| Skill | Domain | Failure | Flagged | Successes |
|-------|--------|---------|---------|-----------|

## Decisions_In_Force

<!-- Active decisions that persist across sessions. Remove when superseded. -->
<!-- Entries older than ~30 days archived to knowledge/archive-decisions.md (settled architecture, not active calls) -->

- **2026-05-11**: Auto Memory = complementary layer (not replacement). agent-memory/ keeps structured AIDLC state (Task_Ledger, Playbook, Skill_Flags). Auto Memory keeps session knowledge (build commands, debugging insights). Dream consolidation = manual trigger when needed.
- **2026-05-11**: Hooks simplified — skip Q&A/ทำต่อ sessions. Memory update moved to AIDLC workflow Step 10 (agent writes directly) instead of relying on askAgent hooks.
- **2026-05-23**: Hermes Agent re-adopted (cost concern resolved — uses GitHub Copilot gpt-4o-mini, free). Hermes integrated with Graphify via graphi-usage skill. Delegation: `hermes chat -q "Use graphify first, then answer: <Q>"`. graphify-ssot.md in .claude/rules/. hermes-graphify skill at skills/system/hermes-graphify/. GRAPHIFY_USAGE.md standardized across all 3 workspaces.
- **2026-05-18**: Auto-create skill drafts: knowledge-curate hook v2.0 creates `skills/drafts/{domain}-{name}/SKILL.md` when promoted/crystallized pattern passes criteria (Applied>=3 OR crystallized, actionable, no existing skill). User approves with "approve skill draft {name}".
