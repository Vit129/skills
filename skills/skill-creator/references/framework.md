# Skill Framework

## Frontmatter + Trigger Phrases

```yaml
---
name: skill-name
description: >
  This skill should be used when the user asks to "phrase 1", "phrase 2",
  "phrase 3", or needs [what it provides].
---
```

- Third-person: `"This skill should be used when..."`
- Include specific trigger phrases users would actually type (EN + TH)
- Be concrete: `"create a pipeline"` — not `"helps with pipelines"`
- Lean slightly "pushy" — agents tend to under-trigger
- Cover edge cases where the skill should trigger even if user doesn't name it

## The 5-Part Checklist

Every skill MUST have:
1. **Name + Trigger** — frontmatter (see above)
2. **Objective** — 1-2 lines: what this skill produces
3. **Context** — Load Right Reference table; inline if short, `references/` file if long/specialized
4. **Process** — numbered steps, each answering: what it produces, where the user approves (HitL), what info is needed, the deliverable
5. **Rules + Verification** — predict what will go wrong; `NEVER`/`ALWAYS`/edge-case rules

## Human-in-the-Loop (HitL) Taxonomy

At every HitL point, present multiple options (2-5), never a single answer:
- **checkbox** — approve items
- **single select** — pick one
- **open field** — free input

## Line Budget

- SKILL.md: target ~50 lines, hard cap 500 lines (push detail to `references/`)
- Move detail out once SKILL.md gets cluttered — keep only core routing

## Validation Checklist

- [ ] Frontmatter has `name` + `description` with trigger phrases (EN + TH)
- [ ] Objective is 1-2 lines, clear
- [ ] Load Right Reference table exists
- [ ] Process has numbered steps with HitL points marked
- [ ] Rules section exists (predict what will go wrong)
- [ ] SKILL.md is <500 lines (move excess to references/)
- [ ] All referenced files actually exist
- [ ] No duplicated information across files
