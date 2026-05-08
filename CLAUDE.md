# Claude Agent Workspace (Global Config)

> 🔗 **Full SSOT Architecture:**
> - Shared rules: `rules/` (agent-core.md, skill-map.md, project-rules.md, citation-format.md)
> - Output styles: `output-styles/` (communication-style.md)
> - `scripts/sync-agent-instructions.sh` — Reads rules/ + generates agent configs
> - `~/.codex/CODEX.md` and `~/.gemini/GEMINI.md` — Auto-generated per agent
>
> **Workflow:** Edit `rules/` or `output-styles/` files → run sync script → all agents updated ✅

---

## Knowledge Graph

**[GRAPH_REPORT.md](GRAPH_REPORT.md)** — Full map: rules loading order, skill invocation flow, agent memory pipeline, knowledge pipeline, file index, surprising connections.
- Read this first when navigating unfamiliar parts of the global config
- Use "Suggested Questions" section to query the graph

---

## Skill Map Reference

See `rules/skill-map.md` for the complete skill map used by all agents.

## Project Rules Reference

See `rules/project-rules.md` for project-specific rules and phase gates.

## Citation Format Reference

See `rules/citation-format.md` for citation conventions.

## Communication Style Reference

See `output-styles/communication-style.md` for tone and interaction guidelines.

## Response Format Reference

See `rules/response-format.md` for the standard response structure:
**Done → Next → Why → Options** (used by all agents and skills).

Includes: clarifying questions protocol (Tip 9), quality self-assessment to 9/10 (Tip 10),
test-before-deliver gate (Tip 11), and context window health triggers (Tip 12/26).

## Workflow Rules Reference

See `rules/workflow.md` for the universal do/don't list, context & style guide, and example prompt patterns (Tip 19).

## Project Specs

Every project must have a `project_specs.md` at its root.
Copy template from `rules/project_specs.template.md` and fill before coding begins.

### Skills (Conditional Activation)

| Category | Activated By | Usage |
|----------|--------------|-------|
| **ai-dlc/core** | Hooks (PostToolUse) | Dev/QA lifecycle — auto-run tests after Write/Edit |
| **ai-dlc/qa** | Manual or hook | Playwright, Robot Framework, test scenarios, performance |
| **ai-dlc/dev** | Manual | Backend, frontend, CI/CD, impeccable design |
| **ai-dlc/po** | Manual | Domain design, DDD, bounded contexts |
| **ai-dlc/rules** | Manual (load first) | Coding standards — Playwright, RF, test scenarios, industry rules |
| **ux-ui** | Manual | UI design, Figma, design system, tokens |
| **finance** | Manual | Stock analysis, fundamental research |
| **fitness** | Manual | Workout plans, nutrition tracking, fitness coaching |
| **system** | Manual or hooks | skill-creator, agent-memory, AI techniques |

> All skill paths in `rules/skill-map.md`. When invoking a skill, announce `[Skill: {path}]` first.

### Hooks (Configured in settings.json)

| Hook | Matcher | Action |
|------|---------|--------|
| **PreToolUse** | Write/Edit/MultiEdit | Check design → decomposition → implementation sequence |
| **PostToolUse** | Write/Edit (test files) | Run test, auto-heal if fails |

### Agent Memory

Persistent cross-session memory at `agent-memory/`:

| File | Purpose |
|------|---------|
| `memory.md` | Hot state: tasks, decisions, skill flags, lessons (2.5KB max, capacity indicator) |
| `user-profile.md` | User preferences: language, style, IDE, commits (stable, rarely changes) |
| `playbook.md` | Problem resolution cases with Applied/Prevented scoring |
| `skill-log.md` | Append-only skill improvement proposals |
| `knowledge/` | Promoted cases, crystallized patterns, archived playbook |

Hooks (Kiro — 6 hooks):

| Hook | Version | Event | Role |
|------|---------|-------|------|
| session-load | v3.1 | promptSubmit | Load memory + user-profile + playbook search |
| checkpoint | v1.0 | postTaskExecution | Save progress mid-session |
| skill-check | v1.0 | postToolUse (write) | Flag underperforming skills |
| skill-evolve | v1.0 | postTaskExecution | Propose skill improvements |
| knowledge-curate | v1.0 | agentStop | Promote/crystallize/archive (subagent when threshold) |
| session-save | v4.0 | agentStop | Final state save + scoring + nudges |

Steering: `agent-memory-self-improve.md` (auto-injected every session)

Closed learning loops:
- **Skill self-evolution:** skill-check → flag → skill-evolve → propose → apply → verify
- **Knowledge pipeline:** draft → Save/Discard Gate → playbook (scored) → knowledge (promoted) → pattern (crystallized)

### Agent Memory — update ALL files when code/decisions changed (skip if Q&A only)

| File | When to update | What to write |
|------|---------------|---------------|
| `agent-memory/memory.md` | Every meaningful turn | Task_Ledger status · Recent_Lessons (last 5 IDs) · Decisions_In_Force · capacity indicator |
| `agent-memory/user-profile.md` | User explicitly changes preferences | Language, style, IDE, commits |
| `agent-memory/playbook.md` | Bug fixed | Append `CASE-xxx` row: Trigger / Fix / Domain / Outcome / Applied=0 / Prevented=0 |
| `agent-memory/skill-log.md` | Pattern or improvement found | Append proposal row: Date / Skill / Problem / Proposed Change / Status |
| `agent-memory/knowledge/` | Case promoted (Applied >= 3) | Create `{case-id}.md` with full detail; crystallize when 3+ same domain |

---

## 3. New Workspace Setup Checklist

→ See `.setup-checklist` for step-by-step migration

**Quick summary:**

1. Copy `~/.claude/` to new workspace
2. Verify `settings.json` hooks are loaded
3. Confirm test commands match new project structure
4. Done — skills auto-activate

---

## 4. Workspace Portability Notes

### What's Portable ✅

- `rules/` — universal standards (all domains)
- `skills/system/` — core meta-skills (skill-creator)
- `skills/ai-dlc/` — dev/QA lifecycle
- `skills/ux-ui/` — UI design
- `skills/finance/` — investment research (paths may need adjustment)
- `settings.json` hooks schema

### What Needs Adjustment ⚠️

- `rules/token_efficient.md` → Token management (review for new project)
- `skills/finance/` → Investment portfolio paths (project-specific)

### Migration Path

1. Copy everything
2. Done

---

## 6. Multi-Agent Routing — Gemini / Codex + Claude

Route high-token tasks (reading entire structure, large-scale planning) through Gemini or Codex first, then let Claude verify + implement.

→ See `skills/system/multi-agent-router/SKILL.md` for routing table, token budget rules, trigger keywords, and CLI commands.

---

## 7. References

- **Agent Strategy:** `skills/KIRO.md` (tier selection, skill map, Karpathy principles)
- **Karpathy Principles:** `skills/KIRO.md` §Karpathy Principles (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution)
- **Token Management:** `rules/token_efficient.md`
