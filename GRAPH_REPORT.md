# Claude Global Config — Knowledge Graph Report
<!-- Auto-generated: 2026-05-04 | Update when adding new rules/skills/hooks -->

---

## God Nodes
*Files everything flows through — always check these first*

| Node | Type | Connected To | Role |
|------|------|-------------|------|
| `rules/agent-core.md` | Rules | All agents (Claude, Gemini, Codex), all skills | Master behavior rules: Karpathy Principles, quality gates, security checklist, escalation rules |
| `rules/skill-map.md` | Rules | All agents, all skill invocations | Single source of truth for skill routing — every skill invocation starts here |
| `rules/project-rules.md` | Rules | AIDLC routing, phase gates | AIDLC auto-detect signals, phase gate enforcement, mode routing |
| `skills/ai-dlc/core/aidlc/` | Skill | All dev/QA tasks | Mandatory gateway for all SDLC work — DECISIONS → PLAN → EXECUTE |
| `agent-memory/memory.md` | Memory | All sessions, all agents | Hot state: tasks, decisions, skill flags, lessons (2.5KB max) |

---

## Dependency Map

### Rules Loading Order
```
Agent starts session
      │
      ▼
CLAUDE.md (global config)
      │
      ├── rules/agent-core.md        ← Karpathy Principles, quality gates, security
      ├── rules/skill-map.md         ← Skill routing table
      ├── rules/project-rules.md     ← AIDLC auto-detect, phase gates
      ├── rules/response-format.md   ← Done→Next→Why→Options structure
      ├── rules/workflow.md          ← Do/Don't list, context & style
      ├── rules/citation-format.md   ← Citation conventions
      └── output-styles/communication-style.md ← Tone, evidence, trade-offs
```

### Skill Invocation Flow
```
User request
      │
      ▼
rules/skill-map.md (keyword match)
      │
      ├── SDLC intent detected ──► skills/ai-dlc/core/aidlc/ (MANDATORY gateway)
      │                                    │
      │                                    ├── Full mode: Phase 0→1→2→3
      │                                    ├── QA Only: Lite Inception→2.1→2.2→2.3→2.4
      │                                    └── Dev Only: Lite Inception→2.5→3.1→3.2→3.3
      │
      ├── Finance task ──► skills/finance/
      ├── UI design ──► skills/ai-dlc/ux-ui/ui-designer/
      ├── Postman migration ──► skills/postman-to-playwright/ (bypasses AIDLC)
      ├── New skill needed ──► skills/system/skill-creator/
      └── Agent memory work ──► skills/system/agent-memory/
```

### Agent Memory Pipeline
```
Session events
      │
      ├── promptSubmit ──► session-load hook (v3.1)
      │                         ├── Load agent-memory/memory.md
      │                         ├── Load agent-memory/user-profile.md
      │                         └── Search agent-memory/playbook.md
      │
      ├── postTaskExecution ──► checkpoint hook (v1.0) → save progress
      │                    ──► skill-evolve hook (v1.0) → propose skill improvements
      │
      ├── postToolUse (write) ──► skill-check hook (v1.0) → flag underperforming skills
      │
      └── agentStop ──► knowledge-curate hook (v1.0) → promote/crystallize/archive
                   ──► session-save hook (v4.0) → final state save + scoring + nudges
```

### Knowledge Pipeline
```
Problem encountered
      │
      ▼
agent-memory/drafts/ (raw capture)
      │
      ▼ Save/Discard Gate (novel + recur + non-trivial, 2/3 = save)
      │
      ▼
agent-memory/playbook.md (Applied=0, Prevented=0)
      │
      ▼ Applied >= 3 → promote
      │
      ▼
agent-memory/knowledge/{case-id}.md
      │
      ▼ 3+ files same domain + shared trigger keyword → crystallize
      │
      ▼
agent-memory/knowledge/{domain}-pattern.md
      │
      ▼ Applied+Prevented >= 5 AND no use in 30 days → archive
      │
      ▼
agent-memory/knowledge/archive-playbook.md
```

---

## File Index

### Rules (`rules/`)

| File | Purpose | Read By |
|------|---------|---------|
| `agent-core.md` | Master behavior: Karpathy Principles, quality gates, security checklist, testing strategy, escalation rules | All agents every session |
| `skill-map.md` | Skill routing table — keyword → skill path mapping | All agents on skill invocation |
| `project-rules.md` | AIDLC auto-detect signals, phase gate enforcement, mode routing | All agents on SDLC tasks |
| `response-format.md` | Done→Next→Why→Options structure, clarifying questions protocol, quality self-assessment | All agents on every response |
| `workflow.md` | Universal Do/Don't list, context & style guide, example prompt patterns | All agents every session |
| `citation-format.md` | Citation conventions for research and evidence | All agents when citing sources |
| `token_efficient.md` | Token management, context window health, batch operations | All agents for performance |
| `project_specs.template.md` | Template for project_specs.md — must be filled before coding | Agents starting new projects |

### Output Styles (`output-styles/`)

| File | Purpose | Read By |
|------|---------|---------|
| `communication-style.md` | Tone, evidence standards, trade-off presentation, end-of-turn summary format | All agents every session |

### Skills (`skills/`)

| Path | Domain | Activation |
|------|--------|-----------|
| `ai-dlc/core/aidlc/` | SDLC governance — DECISIONS→PLAN→EXECUTE | Auto-detect on any SDLC intent |
| `ai-dlc/core/brainstorming/` | Idea exploration before AIDLC | Manual: "brainstorm", "คิดก่อน" |
| `ai-dlc/core/subagent-driven/` | Parallel task dispatch | Manual: "spawn subagent", "parallel tasks" |
| `ai-dlc/core/analysis-skills/` | Gap analysis, requirements, reverse-eng | Manual: "analyze", "requirements" |
| `ai-dlc/qa/playwright-testing/` | Write/run/fix Playwright tests | Via AIDLC QA mode |
| `ai-dlc/qa/playwright-cli/` | Browser CLI, navigate, screenshot | Manual: "browser CLI" |
| `ai-dlc/qa/test-scenario/` | Test case design | Via AIDLC QA mode |
| `ai-dlc/qa/robotframework-testing/` | RF mobile tests | Via AIDLC QA mode |
| `ai-dlc/qa/performance-testing/` | Load test, k6 | Manual: "load test", "k6" |
| `ai-dlc/dev/backend-dev/` | Backend API, Node, Python, Docker | Via AIDLC Dev mode |
| `ai-dlc/dev/frontend-dev/` | React, Next.js, Flutter, Swift | Via AIDLC Dev mode |
| `ai-dlc/dev/devops-pipeline/` | CI/CD, GitHub Actions, PR | Via AIDLC Dev mode |
| `ai-dlc/dev/impeccable-design/` | Anti-AI-slop, typography, craft UI | Manual: "impeccable", "polish UI" |
| `ai-dlc/po/architect/` | Domain design, DDD, bounded contexts | Manual: "domain design", "DDD" |
| `ai-dlc/ux-ui/ui-designer/` | UI design, Figma, design system | Manual: "UI design", "figma" |
| `ai-dlc/rules/playwright-rules/` | Playwright coding standards | Load first for Playwright work |
| `ai-dlc/rules/test-scenario-rules/` | Test scenario CSV format | Load first for test scenarios |
| `ai-dlc/rules/robotframework-rules/` | RF standards | Load first for RF work |
| `ai-dlc/rules/industry-rules/` | Finance/healthcare/ecommerce design rules | Load first for domain work |
| `claude-code-tips/` | Claude Code productivity tips | Manual: "code tips", "workspace setup" |
| `finance/` | Stock analysis, fundamental research | Manual: "finance", "stock analysis" |
| `fitness/` | Workout plans, nutrition tracking | Manual: "fitness", "workout" |
| `postman-to-playwright/` | Postman → Playwright migration | Manual: "postman migration" (bypasses AIDLC) |
| `system/skill-creator/` | Create new skills | Manual: "create new skill" |
| `system/hook-creator/` | Create new hooks | Manual: "create hook" |
| `system/agent-memory/` | Memory system management | Manual: "agent memory", "bootstrap memory" |
| `system/ai-techniques/` | CoT, LATS, AoT reasoning | Manual: "CoT", "reasoning technique" |
| `KIRO.md` | Tier selection, skill map, Karpathy Principles (Kiro-specific) | Kiro IDE sessions |

### Agent Memory (`agent-memory/`)

| File | Purpose | Updated When |
|------|---------|-------------|
| `memory.md` | Hot state: tasks, decisions, skill flags, lessons (2.5KB max) | Every meaningful turn |
| `user-profile.md` | Stable user preferences: language, style, IDE, commits | User explicitly changes preferences |
| `playbook.md` | Problem resolution cases with Applied/Prevented scoring | Bug fixed or pattern found |
| `skill-log.md` | Append-only skill improvement proposals | Pattern or improvement found |
| `knowledge/` | Promoted cases, crystallized patterns, archived playbook | Applied >= 3 triggers promotion |

### Hooks (`.kiro/hooks/`)

| Hook | Version | Event | Role |
|------|---------|-------|------|
| `session-load` | v3.1 | promptSubmit | Load memory + user-profile + playbook search |
| `checkpoint` | v1.0 | postTaskExecution | Save progress mid-session |
| `skill-check` | v1.0 | postToolUse (write) | Flag underperforming skills |
| `skill-evolve` | v1.0 | postTaskExecution | Propose skill improvements |
| `knowledge-curate` | v1.0 | agentStop | Promote/crystallize/archive (subagent when threshold) |
| `session-save` | v4.0 | agentStop | Final state save + scoring + nudges |

### Scripts (`scripts/`)

| File | Purpose |
|------|---------|
| `sync-agent-instructions.sh` | Reads `rules/` + `output-styles/` → generates `CLAUDE.md`, `~/.codex/CODEX.md`, `~/.gemini/GEMINI.md` |

---

## Key Relationships

| Relationship | Detail |
|-------------|--------|
| `agent-core.md` → all agents | Loaded every session; defines Karpathy Principles, quality gates, security checklist |
| `skill-map.md` → skill invocation | Every skill call must announce `[Skill: {path}]` and match a keyword in this file |
| `project-rules.md` → AIDLC | Auto-detect SDLC intent → route to `core/aidlc/` without waiting for user to say "start AIDLC" |
| `response-format.md` → every reply | Done→Next→Why→Options structure mandatory for all non-trivial responses |
| `session-save` hook → `memory.md` | Final state persisted after every session; playbook scored; knowledge pipeline triggered |
| `knowledge-curate` hook → `knowledge/` | Runs at agentStop; promotes cases with Applied >= 3; crystallizes when 3+ same domain |
| `sync-agent-instructions.sh` → agent configs | SSOT: edit `rules/` → run script → all 3 agent configs updated |

---

## Surprising Connections

- **`project-rules.md` auto-detects SDLC intent** — agents don't wait for "start AIDLC"; any verb + software artifact triggers routing automatically
- **Postman migration bypasses AIDLC entirely** — `postman-to-playwright/` is the only skill that skips the AIDLC gateway; source of truth is the Postman collection, not requirements
- **`agent-core.md` contains Karpathy Principles** — "Think Before Coding", "Simplicity First", "Surgical Changes", "Goal-Driven Execution" are always active for all agents
- **`sync-agent-instructions.sh` is the SSOT mechanism** — editing `rules/` files alone doesn't update agents; the script must be run to propagate changes to `CLAUDE.md`, `CODEX.md`, `GEMINI.md`
- **`knowledge-curate` uses a subagent threshold** — if 5+ playbook cases OR 3+ knowledge files in same domain, it delegates to a subagent instead of running inline
- **`session-save` v4.0 delegates heavy curation** — session-save handles scoring/nudges; knowledge-curate handles promotion/crystallization/archive (separation of concerns)
- **`user-profile.md` is intentionally stable** — separated from `memory.md` hot state so stable preferences don't get overwritten by session churn

---

## Suggested Questions

### "I want to add a new coding standard — where does it go?"
Add it to `rules/agent-core.md` (universal) or `rules/project-rules.md` (AIDLC-specific). Then run `scripts/sync-agent-instructions.sh` to propagate to all agent configs.

### "How do I add a new skill?"
Use `[Skill: system/skill-creator/]` — it guides you through creating the SKILL.md file. Then add the keyword mapping to `rules/skill-map.md`.

### "Why did the agent start AIDLC without me asking?"
`rules/project-rules.md` has auto-detect signals. Any SDLC intent (implement, build, fix, test, deploy) triggers automatic routing to `core/aidlc/`. This is intentional.

### "How does knowledge get promoted from playbook to knowledge/?"
`knowledge-curate` hook runs at agentStop. Cases with Applied >= 3 get promoted to `knowledge/{case-id}.md`. When 3+ cases share a domain + trigger keyword, they crystallize into `knowledge/{domain}-pattern.md`.

### "What's the difference between session-save and knowledge-curate hooks?"
Both run at agentStop. `session-save` handles: memory.md update, playbook scoring, skill flag nudges. `knowledge-curate` handles: promotion, crystallization, archive. They're separate to keep each hook focused.
