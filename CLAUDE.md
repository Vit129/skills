# Claude Code Workspace (Project Root)

> 🔗 **Full SSOT Architecture:**
> - Shared rules: `.claude/shared/` (agent-core.md, skill-map.md, project-rules.md, citation-format.md, communication-style.md)
> - `.claude/scripts/sync-agent-instructions.sh` — Reads shared files + generates agent configs
> - `~/.codex/CODEX.md` and `~/.gemini/GEMINI.md` — Auto-generated per agent
>
> **Workflow:** Edit `.claude/shared/` files → run sync script → all agents updated ✅

---

## Skill Map Reference

See `.claude/shared/skill-map.md` for the complete skill map used by all agents.

## Project Rules Reference

See `.claude/shared/project-rules.md` for project-specific rules and phase gates.

## Citation Format Reference

See `.claude/shared/citation-format.md` for citation conventions.

## Communication Style Reference

See `.claude/shared/communication-style.md` for tone and interaction guidelines.

### Skills (Conditional Activation)

| Category | Activated By | Usage |
|----------|--------------|-------|
| **ai-dlc** | Hooks (PostToolUse) | Auto-run tests after Write/Edit |
| **finance** | Manual skill invoke | `/finance-*` or Kiro |
| **system** | SessionStart hook | agent-memory, skill-creator |

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

- `rules/` — universal standards
- `skills/system/` — core meta-skills (agent-memory, skill-creator)
- `skills/ai-dlc/` — dev lifecycle
- `settings.json` hooks schema

### What Needs Adjustment ⚠️

- `rules/optimization.md` → Token management (review for new project)
- `skills/finance/` → Investment portfolio paths (project-specific)
- `agent-memory/` → Session-specific state (auto-recreated per workspace)

### Migration Path

1. Copy everything except `agent-memory/`
2. First SessionStart auto-initializes `agent-memory/palace/state.md`
3. Done

---

## 5. Agent Memory Resolution Rules

### Knowledge = Per-Project Only

Knowledge files (design tokens, error recovery, lessons, index.json) live in `agent-memory/knowledge/` — single source of truth, per-project.

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
| **Agent needs design-craftsmanship-tokens** | Read `agent-memory/knowledge/design-craftsmanship-tokens.md` |
| **New lesson discovered** | Write to `agent-memory/knowledge/lessons/{domain}/` |
| **Knowledge index** | `agent-memory/knowledge/index.json` |

### Current Knowledge Files

- `agent-memory/knowledge/design-craftsmanship-tokens.md` — Design token standards
- `agent-memory/knowledge/error-recovery-strategy.md` — Error recovery patterns
- `agent-memory/knowledge/index.json` — Knowledge index
- `agent-memory/knowledge/lessons/` — Per-domain lessons (empty until captured)

---

## 6. References

- **Agent Strategy:** `skills/KIRO.md` (tier selection, skill map, Karpathy principles)
- **Karpathy Principles:** `skills/KIRO.md` §Karpathy Principles (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution)
- **Token Management:** `rules/optimization.md`
- **Agent Memory:** `skills/system/agent-memory/` (Memory Palace + Knowledge Evolution — auto-activated SessionStart)
- **Memory Palace State:** `agent-memory/palace/state.md`
- **Search Indexes:** `agent-memory/palace/keyword-index.json` + `date-index.json`
