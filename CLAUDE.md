# Claude Code Workspace (Project Root)

> 🔗 **Full SSOT Architecture:** 
> - Shared rules: `.claude/shared/` (agent-core.md, skill-map.md, project-rules.md, citation-format.md)
> - `.claude/scripts/sync-agent-instructions.sh` — Reads shared files + generates agents
> - `~/.codex/CODEX.md` and `~/.gemini/GEMINI.md` — Auto-generated per agent
>
> **Workflow:** Edit `.claude/shared/` files, run sync script, all agents updated ✅

---

## Skill Map Reference

See `.claude/shared/skill-map.md` for the complete skill map used by all agents.

## Project Rules Reference

See `.claude/shared/project-rules.md` for project-specific rules and phase gates.

## Citation Format Reference

See `.claude/shared/citation-format.md` for citation conventions.

### Skills (Conditional Activation)

| Category | Activated By | Usage |
|----------|--------------|-------|
| **ai-dlc** | Hooks (PostToolUse) | Auto-run tests after Write/Edit |
| **finance** | Manual skill invoke | `/finance-*` or Kiro |
| **system** | SessionStart hook | unified-memory, skill-creator |

### Hooks (Configured in settings.json)

| Hook | Matcher | Action |
|------|---------|--------|
| **SessionStart** | Always | Load `.unified-memory/palace/state.md` (Memory Palace) |
| **PreToolUse** | Write/Edit/MultiEdit | Check design → decomposition → implementation sequence |
| **PostToolUse** | Write/Edit (test files) | Run test, auto-heal if fails, trigger Memory Palace |

---

## 3. New Workspace Setup Checklist

→ See `.setup-checklist` for step-by-step migration

**Quick summary:**
1. Copy `~/.claude/` to new workspace
2. Verify `settings.json` hooks are loaded
3. Initialize `.memory/state.md` (first SessionStart does this)
4. Confirm test commands match new project structure
5. Done — skills auto-activate

---

## 4. Workspace Portability Notes

### What's Portable ✅
- `rules/` — universal standards
- `skills/system/` — core meta-skills (unified-memory, skill-creator)
- `skills/ai-dlc/` — dev lifecycle
- `settings.json` hooks schema

### What Needs Adjustment ⚠️
- `rules/test-coverage.md` → Test mapping depends on project structure
- `skills/finance/` → Investment portfolio paths (project-specific)
- `.unified-memory/` → Session-specific state (auto-recreated per workspace)

### Migration Path
1. Copy everything except `.unified-memory/`
2. Update `rules/test-coverage.md` test commands for new project
3. First SessionStart auto-initializes `.unified-memory/palace/state.md`
4. Done

---

## 5. Unified Memory Resolution Rules

### Global + Per-Project Pattern

Lessons, templates, and knowledge follow a **cascade resolution** pattern:

```
Read order (stop at first match):
  1. {project_root}/.unified-memory/knowledge/lessons/{domain}/     ← per-project (custom)
  2. {project_root}/skills/system/unified-memory/references/        ← global shared
  3. If not found in (1) or (2): Create in (1) based on (2)
```

### Key Rules

| Scenario | Action |
|----------|--------|
| **Agent needs design-craftsmanship-tokens** | Read .unified-memory/ first, fallback to skills/system/unified-memory/ |
| **Per-project customization** | Copy from skills/ → .unified-memory/, edit locally (doesn't affect global) |
| **Global improvement** | Edit skills/system/unified-memory/, then document in state.md |
| **New lesson discovered** | Write to .unified-memory/ (project-specific), optionally promote to skills/ (global) |

### Example: Error Recovery Strategy

```
Agent looking for error-recovery-strategy:
  ↓
1. Check: .unified-memory/knowledge/lessons/common/error-recovery-strategy.md
   ✗ Not found
  ↓
2. Check: skills/system/unified-memory/references/error-recovery-strategy.md
   ✓ Found! Use this
  ↓
3. (Optional) Copy to .unified-memory/knowledge/lessons/common/ for project customization
```

---

## 6. References

- **Agent Strategy:** `skills/CLAUDE.md` (tier selection, Gemini vs Claude)
- **Karpathy Principles:** `skills/CLAUDE.md` §5 (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution)
- **Test Standards:** `rules/test-coverage.md` + `rules/playwright-standards.md`
- **Token Management:** `rules/optimization.md`
- **Unified Memory:** `skills/system/unified-memory/` (Memory Palace + Knowledge Evolution — auto-activated SessionStart)
