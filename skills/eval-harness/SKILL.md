---
name: eval-harness
description: >
  Measure skill consistency and reliability using pass@k and checkpoint evals.
  Use when a skill is flagged in memory.md, after creating/updating a skill,
  or for periodic skill health checks. Trigger on "eval skill", "measure skill quality",
  "pass@k", "consistency check", "skill health", "eval harness".
version: 2.0.0
last_improved: 2026-06-30
improvement_count: 1
---

# Eval Harness

Measure skill consistency and reliability before trusting it in production workflows.

---

## When to Use

- After creating or updating a skill — verify it produces consistent output
- When a skill is flagged in `agent-memory/memory.md` — measure improvement
- Periodic skill health checks (monthly)
- Before promoting a playbook entry to knowledge

---

## Load Right Reference

| Task | Load |
|------|------|
| Choose eval type (pass@k, pass^k, checkpoint) | `references/eval-types.md` |
| Run the eval process + grade + score and decide | `references/process.md` |

---

## Report Format

```markdown
## 📊 Eval Report: [Skill Name]

**Date:** YYYY-MM-DD  **Task:** [Description]  **Runs:** k=3  **Grader:** automated

| Run | Result | Notes |
|-----|--------|-------|
| 1 | ✅ Pass | Clean output |
| 2 | ✅ Pass | Minor style diff |
| 3 | ❌ Fail | Missing error handling |

**pass@3:** 67% (2/3)  **Verdict:** Minor tuning needed  **Action:** Update SKILL.md
```

---

## Rules

- Never eval during active implementation (context waste)
- Store eval reports in `agent-memory/plans/[feature]/evals/` (project) or `knowledge/lessons/` (skill-level)
- Flag skills with pass@3 < 67% in `agent-memory/memory.md`

---

## Anti-Rationalization

| Excuse | Rebuttal |
|--------|----------|
| "The skill works fine — I don't need to eval" | "Works fine" is subjective. pass@3 gives you a number. A skill that passes 2/3 times has a 33% failure rate. |
| "k=3 wastes tokens — one run is enough" | One success proves nothing about consistency. k=3 reveals true reliability. |
| "I'll eval after the feature ships" | Post-ship evals discover problems after users hit them. Eval during development, not after. |

---

## Red Flags

- 🚩 Skill flagged in memory.md but no eval report exists
- 🚩 pass@3 = 100% on a skill known to be problematic → eval was too easy
- 🚩 Results stored only in chat, not persisted to file
- 🚩 Skill with pass@3 < 67% not flagged in memory.md
