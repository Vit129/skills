---
name: claude-code-tips
description: >
  Claude Code productivity tips and workspace optimization.
  
  🇬🇧 English Triggers: "code tips", "productivity tips", "claude code setup",
  "workspace optimization", "bypass permissions", "auto permission", "project specs",
  "memory files", "compact context", "subagent", "skill creation", "workflow setup"
  
  🇹🇭 Thai Triggers: "เคล็ดลับ claude", "ตั้งค่า workspace", "เพิ่มประสิทธิภาพ",
  "สร้าง skill", "จัดการ context", "project specs", "memory files", "ตั้งค่า AI"
---

# Claude Code Tips & Productivity

Workspace setup, skill creation, and productivity patterns for Claude Code power users.

---

## Quick-Start Checklist (New Project)

Run through this at the start of every project:

- [ ] Create `project_specs.md` — define goal, stack, constraints
- [ ] Run `/init` to generate `CLAUDE.md` (or verify one exists)
- [ ] Set quality standard in `CLAUDE.md` → "self-score to 9/10 before delivering"
- [ ] Enable clarifying questions → "always ask 3 clarifying questions before starting"
- [ ] Enable auto-permission (Settings → Allow Dangerously Skip Permissions) for trusted local work
- [ ] Set Autosave ON in editor settings

---

## Tip Reference Table

| # | Tip | How to Apply |
|---|-----|-------------|
| 4 | Auto-permission | Settings → search "Bypass" → tick "Allow Dangerously Skip Permissions" |
| 7 | CLAUDE.md | `/init` at project root — update with project rules |
| 8 | project_specs | Copy `rules/project_specs.template.md` template, fill before coding |
| 9 | Clarifying Qs | Add to CLAUDE.md: "Ask 3 clarifying questions before executing ambiguous tasks" |
| 10 | Quality standard | Add to CLAUDE.md: "Self-score output to 9/10 before delivering" |
| 11 | Test before deliver | Add to CLAUDE.md: "Run tests and fix failures before responding" |
| 12 | Context health | Run `/compact` before context hits 80% full |
| 14 | Auto-research | Prompt: "Run tests in a loop, auto-fix failures, report when stable" |
| 15 | Response structure | Use `rules/response-format.md` — Done / Next / Why / Options |
| 16 | Memory files | `agent-memory/memory.md` — persist decisions across sessions |
| 17 | Queue messages | Type multiple prompts; Claude queues and executes in order |
| 20 | Create skill | Use `system/skill-creator/` — converts repeated workflows into `/skill-name` |
| 21 | Reference files | Put reusable standards in `rules/` — link from CLAUDE.md |
| 22 | Subagents | Use `core/subagent-driven/` — splits large tasks across parallel agents |
| 23 | Stop AI | Press `ESC` immediately to halt runaway generation |
| 26 | Compact | `/compact` — summarizes context, reduces token burn |
| 27 | Insights | `/insights` — usage stats to optimize prompt patterns |

---

## Workflow: Setup a New Skill (Tip 20)

1. Describe the repeated task to Claude: "I keep doing X — turn this into a skill"
2. Claude generates `skills/{name}/SKILL.md` with triggers + flow
3. Add entry to `rules/skill-map.md`
4. Invoke with `/skill-name` going forward

---

## Workflow: Parallel Subagents (Tip 22)

```
Spawn 3 subagents in parallel:
- Agent A: Build the homepage component
- Agent B: Build the dashboard component  
- Agent C: Write unit tests for both components

Each agent works independently. Merge results when all complete.
```

---

## Workflow: Auto-Research Loop (Tip 14)

```
Run the test suite. If any tests fail, identify the root cause, fix the code,
and re-run. Repeat until all tests pass. Report the final result.
```

---

## Anti-Patterns to Avoid

- Running out of context before using `/compact` → AI starts hallucinating
- No `project_specs.md` → AI lacks context, asks redundant questions
- Skipping clarifying questions → wasted tokens on wrong output
- Letting AI deliver untested code → bugs reach production
