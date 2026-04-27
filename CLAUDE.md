# Claude Agent Workspace (Global Config)

> 🔗 **Full SSOT Architecture:**
> - Shared rules: `rules/` (agent-core.md, skill-map.md, project-rules.md, citation-format.md)
> - Output styles: `output-styles/` (communication-style.md)
> - `scripts/sync-agent-instructions.sh` — Reads rules/ + generates agent configs
> - `~/.codex/CODEX.md` and `~/.gemini/GEMINI.md` — Auto-generated per agent
>
> **Workflow:** Edit `rules/` or `output-styles/` files → run sync script → all agents updated ✅

---

## Skill Map Reference

See `rules/skill-map.md` for the complete skill map used by all agents.

## Project Rules Reference

See `rules/project-rules.md` for project-specific rules and phase gates.

## Citation Format Reference

See `rules/citation-format.md` for citation conventions.

## Communication Style Reference

See `output-styles/communication-style.md` for tone and interaction guidelines.

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
| **system** | SessionStart hook | agent-memory, skill-creator, hook-creator, AI techniques |

> All skill paths in `rules/skill-map.md`. When invoking a skill, announce `[Skill: {path}]` first.

### Hooks (Configured in settings.json)

| Hook | Matcher | Action |
|------|---------|--------|
| **SessionStart** | Always | Load `agent-memory/palace/state.md` (Memory Palace) |
| **PreToolUse** | Write/Edit/MultiEdit | Check design → decomposition → implementation sequence |
| **PostToolUse** | Write/Edit (test files) | Run test, auto-heal if fails, trigger Memory Palace |

---

## 3. New Workspace Setup Checklist

→ See `.setup-checklist` for step-by-step migration

**Quick summary:**

1. Copy `~/.claude/` to new workspace
2. Verify `settings.json` hooks are loaded
3. Initialize `agent-memory/palace/state.md` (first SessionStart does this)
4. Confirm test commands match new project structure
5. Done — skills auto-activate

---

## 4. Workspace Portability Notes

### What's Portable ✅

- `rules/` — universal standards (all domains)
- `skills/system/` — core meta-skills (agent-memory, skill-creator)
- `skills/ai-dlc/` — dev/QA lifecycle
- `skills/ux-ui/` — UI design
- `skills/finance/` — investment research (paths may need adjustment)
- `settings.json` hooks schema

### What Needs Adjustment ⚠️

- `rules/token_efficient.md` → Token management (review for new project)
- `skills/finance/` → Investment portfolio paths (project-specific)
- `agent-memory/` → Session-specific state (auto-recreated per workspace)

### Migration Path

1. Copy everything except `agent-memory/`
2. First SessionStart auto-initializes `agent-memory/palace/state.md`
3. Done

---

## 5. Agent Memory Resolution Rules

### Knowledge = Per-Project Only

Knowledge files (articles, lessons, evolution, index.md) live in `agent-memory/knowledge/` — single source of truth, per-project.

`skills/` contains only execution logic (SKILL.md + references/ = how to work). It does not store knowledge data.

```text
{project_root}/agent-memory/knowledge/     ← knowledge lives here (per-project)
{project_root}/skills/                        ← execution engine only (not data)

Bootstrap (new project, no agent-memory/ yet):
  Agent reads skills/system/agent-memory/SKILL.md → auto-creates agent-memory/ tree
  Knowledge files are created fresh for the project — not copied from skills/
```

### Key Rules

| Scenario | Action |
|----------|--------|
| **Agent needs reusable project knowledge** | Read `agent-memory/knowledge/index.md`, then the relevant `articles/{domain}/` or `lessons/{domain}/index.md` |
| **New lesson discovered** | Write to `agent-memory/knowledge/lessons/{domain}/` |
| **Knowledge index** | `agent-memory/knowledge/index.md` |

### Current Knowledge Files

- `agent-memory/knowledge/index.md` — Knowledge index (Markdown table)
- `agent-memory/knowledge/evolution.md` — Knowledge evolution log
- `agent-memory/knowledge/articles/` — Per-domain articles/playbooks
- `agent-memory/knowledge/lessons/` — Per-domain lessons

---

## 6. References

- **Agent Strategy:** `skills/KIRO.md` (tier selection, skill map, Karpathy principles)
- **Karpathy Principles:** `skills/KIRO.md` §Karpathy Principles (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution)
- **Token Management:** `rules/token_efficient.md`
- **Agent Memory:** `skills/system/agent-memory/` (Memory Palace + Knowledge Evolution — auto-activated SessionStart)
- **Memory Palace State:** `agent-memory/palace/state.md`
- **Search Index:** `agent-memory/palace/search-index.md`
