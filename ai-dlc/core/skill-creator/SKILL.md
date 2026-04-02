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
├── scripts/              (optional — executable code, deterministic tasks)
└── assets/               (optional — templates, images, fonts for output)
```

## SKILL.md Format

```yaml
---
name: skill-name
description: >
  This skill should be used when the user asks to "phrase 1", "phrase 2",
  "phrase 3", or needs [what it provides].
---
```

Body: concise markdown, imperative form, under 2,000 words ideal.
Reference bundled resources with `(Read references/xxx.md)` pointers.

## Progressive Disclosure (3 levels)

1. **Metadata** (name + description) — always in context (~100 words)
2. **SKILL.md body** — loaded when skill triggers (<500 lines)
3. **Bundled resources** — loaded as needed (unlimited)

Keep SKILL.md lean. Move detailed content to `references/`.

## Description Rules

The description is the primary trigger mechanism. Write it well.

- Use third-person: `"This skill should be used when the user asks to..."`
- Include specific trigger phrases users would actually type
- Be concrete: `"create a pipeline"`, `"design the database"` — not `"helps with pipelines"`
- Cover edge cases: include phrases where skill should trigger even if user doesn't name it explicitly
- Lean slightly "pushy" — Claude tends to under-trigger, so be generous with trigger phrases

## Writing Style

- Imperative form: `"Parse the config"` not `"You should parse the config"`
- Explain the why — Claude responds better to reasoning than rigid MUSTs
- No second person in body or description
- Third-person in description only

## Reference Files

For content that's too detailed for SKILL.md:

- `references/` — docs loaded into context as needed (schemas, patterns, guides)
- Large references (>300 lines): include a table of contents
- SKILL.md must reference these files so Claude knows they exist

## Validation Checklist

- [ ] SKILL.md has frontmatter with `name` and `description`
- [ ] Description uses third-person + specific trigger phrases
- [ ] Body uses imperative form, not second person
- [ ] Body is lean (<2,000 words), detailed content in references/
- [ ] All referenced files actually exist
- [ ] No duplicated information across files
- [ ] No branding or project-specific paths

## Iteration Process

1. Understand what the skill should do (ask for concrete examples)
2. Identify reusable resources (scripts, references, assets)
3. Write SKILL.md draft — frontmatter + lean body
4. Create references/ for detailed content
5. Test trigger phrases — does it activate on expected queries?
6. Improve based on usage feedback
