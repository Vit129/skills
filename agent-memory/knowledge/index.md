# Knowledge Index

Updated: 2026-04-26

## Articles

| ID | Type | Scope | Status | Score | Updated | Path | Keywords |
|----|------|-------|--------|-------|---------|------|----------|
| agent-config-transparency-pattern | pattern | global | draft | 5.0 | 2026-04-26 | knowledge/agent-config-transparency-pattern.md | agent-config, skill-invocation, transparency, CLAUDE.md |
| design-craftsmanship-tokens | lesson | global | active | 5.0 | 2026-04-26 | design-craftsmanship-tokens.md | design tokens, typography, reusable components, craftsmanship |
| error-recovery-strategy | lesson | global | active | 5.0 | 2026-04-26 | error-recovery-strategy.md | error handling, debugging, escalation, retry logic |

## Lessons

| ID | Domain | Type | Status | Applied | Prevented | Updated | Path |
|----|--------|------|--------|---------|-----------|---------|------|
| LESSON-TOOLING-001 | tooling | architecture | active | 1 | 1 | 2026-04-26 | lessons/tooling/LESSON-TOOLING-001.md |
| LESSON-TOOLING-002 | tooling | pattern | active | 1 | 0 | 2026-04-26 | lessons/tooling/LESSON-TOOLING-002.md |
| LESSON-TOOLING-003 | tooling | bug | active | 1 | 1 | 2026-04-26 | lessons/tooling/LESSON-TOOLING-003.md |
| LESSON-TOOLING-004 | tooling | workflow | active | 1 | 1 | 2026-04-26 | lessons/tooling/LESSON-TOOLING-004.md |
| LESSON-TOOLING-005 | tooling | workflow | active | 1 | 1 | 2026-04-27 | lessons/tooling/LESSON-TOOLING-005.md |

## Gaps

| Domain | Gap | First Seen | Status | Notes |
|--------|-----|------------|--------|-------|
| agent-memory | session save must update knowledge automatically | 2026-04-26 | closed | Hook v6.0.0 adds mandatory Knowledge Sync Gate and minimal safe save; verify in future real Kiro sessions. |
| agent-memory | workspace agent-memory/ still has legacy JSON files | 2026-04-26 | open | index.json, date-index.json, keyword-index.json, toolingLessonsIndex.json exist; no knowledge/index.md or evolution.md in workspace; need migration |
| tooling | maintenance.md + adaptation.md still reference JSON | 2026-04-26 | closed | Fixed: removed legacy note headers, replaced all JSON refs with Markdown (index.md, evolution.md, lesson index.md) |
| tooling | CLAUDE.md still references JSON memory files | 2026-04-26 | closed | Fixed: index.json→index.md, keyword-index.json+date-index.json→search-index.md, added evolution.md |
| tooling | Active hooks (.kiro/hooks/) out of sync with templates | 2026-04-26 | closed | Synced: load v3.1.0 (nudge+routing), save v6.0.0 (crystallization+consolidation+counter) copied to active |
| ai-dlc | skills/ai-dlc/knowledge/ has ~30 JSON files needing Markdown migration | 2026-04-26 | open | 14 index files + 16 lesson files + 4 rules files; config files (~5) can stay JSON; separate spec needed — large scope |
