---
name: skill-creator
description: >
  This skill should be used when the user asks to "create a skill", "write a new skill",
  "improve skill description", "organize skill content", "fix skill format",
  or needs guidance on SKILL.md structure, progressive disclosure, description writing,
  or skill development best practices for Claude Code.
---

# Skill Creator

Create, improve, and validate Claude Code skills.

## Skill Anatomy

```
skill-name/
├── SKILL.md              (required — frontmatter + instructions)
├── references/           (optional — detailed docs, loaded as needed)
├── scripts/              (optional — executable code)
└── assets/               (optional — templates, images)
```

## Progressive Disclosure (3 levels)

1. **Metadata** (name + description) — always in context (~100 words)
2. **SKILL.md body** — loaded when skill triggers (<500 lines)
3. **Bundled resources** — loaded as needed (unlimited)

Keep SKILL.md lean. Move detailed content to `references/`.

## Detailed Guide

Format rules, description rules, writing style, validation checklist, iteration process → (Read `references/skill-guide.md`)
