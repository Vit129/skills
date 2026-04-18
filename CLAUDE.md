# Workspace Configuration — Skills + Rules + Infrastructure

**Purpose:** Central registry for workspace integration. Maps skills → hooks → automation.

> **Related:** See `skills/CLAUDE.md` for **agent selection strategy** (Gemini vs Claude tier decisions). This file covers **workspace infrastructure** (what's activated, hooks, setup).

---

## 1. Directory Structure (What's Activated)

```
.claude/
├── CLAUDE.md                    ← You are here
├── settings.json                ← Hooks registry
├── rules/                       ← Coding standards (test-coverage, optimization, playwright-standards)
├── skills/                      ← Feature skills (ai-dlc, finance, system)
│   ├── CLAUDE.md               ← Agent tier selection strategy
│   ├── ai-dlc/                 ← Dev lifecycle: core, dev, product, qa
│   ├── finance/                ← Investment portfolio skills
│   ├── system/                 ← Meta-skills: unified-memory, skill-creator
│   └── ...
├── .unified-memory/             ← Active memory: palace/ (Wings, Archive) + knowledge/
└── projects/                    ← Session projects
```

---

## 2. Active Integrations

### Rules (Always Active)
- `rules/test-coverage.md` — Test commands per file
- `rules/optimization.md` — Token management, cache protection
- `rules/playwright-standards.md` — Test coding standards

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

## 5. References

- **Agent Strategy:** `skills/CLAUDE.md` (tier selection, Gemini vs Claude)
- **Karpathy Principles:** `skills/CLAUDE.md` §5 (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution)
- **Test Standards:** `rules/test-coverage.md` + `rules/playwright-standards.md`
- **Token Management:** `rules/optimization.md`
- **Unified Memory:** `skills/system/unified-memory/` (Memory Palace + Knowledge Evolution — auto-activated SessionStart)
