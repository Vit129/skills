# The 5-Part Framework

Every skill MUST have these 5 parts.

## Part 1: Name + Trigger (Frontmatter)

```yaml
---
name: skill-name
description: >
  This skill should be used when the user asks to "phrase 1", "phrase 2",
  "phrase 3", or needs [what it provides].
---
```

**Rules:**
- Use third-person: `"This skill should be used when..."`
- Include specific trigger phrases users would actually type (EN + TH)
- Be concrete: `"create a pipeline"` — not `"helps with pipelines"`
- Lean slightly "pushy" — agents tend to under-trigger
- Cover edge cases: phrases where skill should trigger even if user doesn't name it

## Part 2: Objective

1-2 lines immediately after the heading. What this skill produces.

## Part 3: Context (Load Right Reference)

| Task | Load |
|------|------|
| specific task A | `references/file-a.md` |
| specific task B | `references/file-b.md` |

**Rules:**
- If short context → inline in SKILL.md
- If specialized/long → separate `references/` file

## Part 4: Process

Step-by-step instructions. For EACH step, answer 4 questions:
1. **What does this step produce?**
2. **Where does the user approve/choose?** (HitL)
3. **What extra info is needed?**
4. **What's the deliverable?**

At every HitL point → always present multiple options (2-5), never a single answer.
Types of HitL: `checkbox` (approve items), `single select` (pick one), `open field` (free input)

## Part 5: Rules + Verification

Predict what will go wrong and write rules to prevent it.

```markdown
## Rules

- NEVER [common mistake the agent makes]
- ALWAYS [thing the agent tends to skip]
- If [edge case] → [what to do instead]
```

**Bonus sections:**
- **Gotchas** — known pitfalls specific to this domain
- **Anti-Rationalization Table** — excuses + counter-arguments
- **Red Flags** — early warning signs

## Validation Checklist

- [ ] Frontmatter has `name` + `description` with trigger phrases (EN + TH)
- [ ] Objective is 1-2 lines, clear
- [ ] Load Right Reference table exists
- [ ] Process has numbered steps with HitL points marked
- [ ] Rules section exists (predict what will go wrong)
- [ ] SKILL.md is <500 lines (move excess to references/)
- [ ] All referenced files actually exist
- [ ] No duplicated information across files
