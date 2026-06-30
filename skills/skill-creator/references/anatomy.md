# Skill Anatomy

## Directory Structure

```text
skill-name/
├── SKILL.md              (required — thin router, lean)
├── references/           (optional — detailed docs, loaded as needed)
├── scripts/              (optional — executable code)
└── assets/               (optional — templates, images)
```

## Progressive Disclosure (3 levels)

1. **Metadata** (name + description) — always in context (~100 words)
2. **SKILL.md body** — loaded when skill triggers (<500 lines ideal, target ~50L)
3. **Bundled resources** — loaded as needed (unlimited)

**Golden rule:** Keep SKILL.md focused on routing. Push detailed content to `references/`.

## Frontmatter Fields

```yaml
---
name: skill-name
description: >
  This skill should be used when the user asks to "phrase 1", "phrase 2".
version: 1.0.0
last_improved: YYYY-MM-DD
improvement_count: 0
---
```
