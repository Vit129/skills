---
name: skill-creator
description: >
  This skill should be used when the user asks to "create skill", "write new skill",
  "สร้าง skill", "improve skill", "fix skill format",
  or needs guidance on SKILL.md structure, progressive disclosure, description writing,
  or skill development best practices.
version: 2.0.0
last_improved: 2026-06-30
improvement_count: 1
---

# Skill Creator

Create, improve, and validate agent skills using the 5-Part Framework.

---

## Load Right Reference

| Task | Load |
|------|------|
| Skill directory structure + progressive disclosure (3 levels) | `references/anatomy.md` |
| The 5-Part Framework (what every skill must have) | `references/framework.md` |
| Creating a new skill step-by-step | `references/process.md` |
| Fix a skill that isn't working | `references/iteration.md` |

---

## Red Flags

- SKILL.md > 500 lines (push detail to `references/`)
- Trigger phrases too vague ("helps with X") instead of specific user utterances
- No HitL points in the process section
- Referenced files that don't actually exist
- Duplicated information across SKILL.md and references/
