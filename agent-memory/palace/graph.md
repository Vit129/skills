# Palace Graph

Updated: 2026-04-27

## Nodes

| ID | Type | Status | Tags | Notes |
|----|------|--------|------|-------|
| agent-memory | wing | hot | agent-memory, skills, hooks, knowledge, markdown | Global memory & intelligence management |
| ai-dlc-skills | wing | hot | ai-dlc, skills, qa, dev, po, ux-ui, rules | AI-DLC skill ecosystem |
| token-optimization-tooling | wing | active | token, optimization, rules, tooling | Token optimization research + rules |

## Rooms

| ID | Wing | Status | Tags |
|----|------|--------|------|
| agent-memory/skill-structure | agent-memory | active | architecture, references, rules |
| agent-memory/hook-versions | agent-memory | active | hooks, versions, workflow |
| agent-memory/template-health | agent-memory | active | templates, scores, usage |
| agent-memory/lesson-effectiveness | agent-memory | active | lessons, effectiveness, prevention |
| agent-memory/gap-tracker | agent-memory | active | gaps, missing, knowledge |
| agent-memory/routing-log | agent-memory | active | routing, sessions, stats |
| agent-memory/knowledge-state | agent-memory | active | knowledge, health, closet |
| agent-memory/competitive-analysis-roadmap | agent-memory | active | competitive, roadmap, P1, P2 |
| agent-memory/wiki-graph-pattern | agent-memory | active | wiki, graph, rag, ingest |
| agent-memory/search-scaling-research | agent-memory | active | search, BM25, inverted-index |
| agent-memory/agents-vs-agent-memory-architecture | agent-memory | active | agents, architecture, decision |
| ai-dlc-skills/aidlc-mode-routing | ai-dlc-skills | active | aidlc, modes, routing |
| ai-dlc-skills/impeccable-design-skill | ai-dlc-skills | active | design, impeccable, skill |
| ai-dlc-skills/knowledge-evolution-skill | ai-dlc-skills | active | knowledge, evolution, skill |
| ai-dlc-skills/memory-palace-setup | ai-dlc-skills | active | memory, palace, setup |
| ai-dlc-skills/rules-folder-restructure | ai-dlc-skills | active | rules, folder, restructure |
| ai-dlc-skills/setup-script-root-support | ai-dlc-skills | active | setup, script, root |
| ai-dlc-skills/skill-structure-upgrade-2026-04-12 | ai-dlc-skills | active | skill, structure, upgrade |
| ai-dlc-skills/skill-testing-progress | ai-dlc-skills | active | skill, testing, progress |
| ai-dlc-skills/standards-update-2026-04-09 | ai-dlc-skills | active | standards, update |
| ai-dlc-skills/v1-v2-full-comparison | ai-dlc-skills | active | v1, v2, comparison |

## Edges

| From | To | Type | Purpose |
|------|----|------|---------|
| agent-memory | ai-dlc-skills | tunnel | Shared engineering standards and workflow rules |
| agent-memory/skill-structure | knowledge/articles/tooling/agent-memory-structure-pattern | knowledge | Proven structure pattern for agent-memory layout |
| agent-memory/hook-versions | knowledge/lessons/tooling/LESSON-TOOLING-004 | knowledge | Knowledge Sync Gate lesson from hook v6 work |
| agent-memory/lesson-effectiveness | knowledge/lessons/tooling/ | knowledge | Tooling lessons feed effectiveness tracking |
