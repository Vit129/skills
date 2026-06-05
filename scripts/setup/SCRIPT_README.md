# scripts/setup — Setup Scripts

Scripts for bootstrapping a new project to be ready for AI use

## 🚀 Start Here — Main Entry Point

```bash
bash ~/.kiro/scripts/setup/setupAgentSkills.sh <PROJECT_FOLDER>
```

**`setupAgentSkills.sh` is the main script** — Run just this one, and it will prompt you step-by-step:

1. `setupMemory.sh` — Create `agent-memory/` (Runs automatically, no prompt)
2. `setupKiro.sh` — Setup `.kiro/` hooks + MCP config (Prompts first)
3. `setupTests.sh` — Bootstrap `tests/` API/Web/Mobile (Prompts first)
4. `postmanToPlaywright.sh` — Copy postman migration skill (Prompts first)

> No need to run scripts separately, using `setupAgentSkills.sh` alone is sufficient
> But if you want to run only specific ones, you can always run them separately

## All Scripts

| Script | Role |
|--------|--------|
| `setupAgentSkills.sh` | **⭐ Main** — wrapper prompting step-by-step, calling all scripts |
| `setupMemory.sh` | Create `agent-memory/` (memory.md, playbook.md, skill-log.md) |
| `setupKiro.sh` | setup `.kiro/` hooks, steering, MCP config |
| `setupTests.sh` | bootstrap `tests/` COE structure (API/Web/Mobile) |
| `postmanToPlaywright.sh` | Copy postman migration skill to the project |
| `_resolveTarget.sh` | Helper: resolve target folder (used internally) |
| `mcpSetup.sh` | setup MCP server connections |

## Hooks copied to the new project

`setupKiro.sh` copies from `skills/meta-skills/hook-creator/templates/kiro/`:

| Hook | Trigger | Purpose |
|------|---------|---------|
| `aidlc-gate-check` | promptSubmit | Detect SDLC intent → route to AIDLC |
| `phase-gate-enforcer` | preToolUse:write | Block writes if DECISIONS/PLAN missing |
| `session-save` | agentStop | Log skills used + improvement proposals |
| `skill-improve` | promptSubmit | Detect user corrections → log silently |
| `eval-check` | promptSubmit | Weekly pass@3 eval on flagged skills |

## How to Use

```bash
# Recommended: Run just the main script, and answer y/N as prompted
bash ~/.kiro/scripts/setup/setupAgentSkills.sh MyProject

# Or run specifically the ones you want separately
bash ~/.kiro/scripts/setup/setupMemory.sh MyProject
bash ~/.kiro/scripts/setup/setupKiro.sh MyProject
bash ~/.kiro/scripts/setup/setupTests.sh MyProject
bash ~/.kiro/scripts/setup/postmanToPlaywright.sh MyProject
```

## Architecture

```
~/.kiro/                    ← global config
├── AGENTS.md               ← skill map, routing rules
├── skills/                 ← AI-DLC skills (global, shared across projects)
├── scripts/
│   ├── setup/              ← THIS FOLDER (bootstrap scripts)
│   ├── azure-devops/       ← ADO pipeline scripts
│   ├── eval-scheduler.sh   ← Weekly skill eval scheduler
│   └── batch-update-skills.py ← Skill maintenance
├── steering/               ← global steering rules
├── hooks/                  ← agent hooks (source of truth)
└── agent-memory/           ← global agent memory
```

All scripts use `$HOME/.kiro/skills/` as SKILLS_ROOT — no need to copy skills to each project

## Skill Auto-Improvement System

Scripts ที่เกี่ยวข้องกับ skill improvement:

| Script/Hook | Role |
|-------------|------|
| `hooks/session-save.json` | Log skill usage + quality per session |
| `hooks/skill-improve.json` | Detect user corrections silently |
| `hooks/eval-check.json` | Trigger weekly eval |
| `scripts/eval-scheduler.sh` | Check if eval is due + list skills to eval |
| `agent-memory/skill-log.md` | Append-only improvement proposals |
| `agent-memory/eval-state.md` | Track last eval date |
| `agent-memory/evals/` | Store eval reports |
