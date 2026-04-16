---
inclusion: auto
---

# Agent Entry Point

> Single steering file — Kiro reads this every session, then self-discovers all skills from AGENT.md.

## Skills Root

```
SKILLS_ROOT = /Users/supavit.cho/.claude/skills
```

> If skills folder moves, update the path above only.

## On Session Start

Read `{SKILLS_ROOT}/AGENT.md` and follow all instructions there.

That file contains:
- Tier selection rules (Sonnet vs Opus)
- Engineering workflow + commit rules
- Full skill index with trigger phrases
- Memory Palace session rules
- Prompt cache protection rules

## Skill Discovery (on-demand)

Do NOT load all skills upfront. Load only when triggered:

| Trigger phrase | Skill to load |
|---------------|--------------|
| "playwright", "test", ".spec.ts" | `{SKILLS_ROOT}/ai-dlc/qa/playwright-rules/SKILL.md` |
| "สร้าง hook", "create hook" | `{SKILLS_ROOT}/system/hook-creator/SKILL.md` |
| "save memory", "load context" | `{SKILLS_ROOT}/system/memory-palace/SKILL.md` |
| "architect", "DDD", "design" | `{SKILLS_ROOT}/ai-dlc/product/architect/SKILL.md` |
| "frontend", "React", "Flutter" | `{SKILLS_ROOT}/ai-dlc/dev/frontend-dev/SKILL.md` |
| "backend", "API", "Node.js" | `{SKILLS_ROOT}/ai-dlc/dev/backend-dev/SKILL.md` |
| "portfolio", "dividend", "tax" | `{SKILLS_ROOT}/finance/coding/investment-architecture/SKILL.md` |

Full list: `{SKILLS_ROOT}/AGENT.md`
