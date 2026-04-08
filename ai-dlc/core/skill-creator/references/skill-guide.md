# Skill Creator Detailed Guide

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

For skills with multiple references, add a routing table so Claude knows which file to load:

```markdown
## When to Load Each Reference

| User says | Load |
|-----------|------|
| "phrase A", "phrase B" | `references/file-a.md` |
| "phrase C", "phrase D" | `references/file-b.md` |
```

Load ONE reference per request unless the user explicitly asks for a combined analysis.

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
