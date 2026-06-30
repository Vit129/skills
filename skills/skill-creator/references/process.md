# Creating a New Skill

## Step 1: Define the Ideal Process

Before writing anything — think through the ideal workflow step by step.

- **Do:** Map out what a perfect execution looks like, step by step
- **HitL:** Present the process outline → user approves or adjusts
- **Output:** Process outline (numbered steps)

## Step 2: Write SKILL.md

- **Do:** Write frontmatter + thin router body following the framework
- **HitL:** Present draft → user reviews
- **Output:** `SKILL.md` file

## Step 3: Create References (if needed)

- **Do:** Move detailed/specialized content to `references/`
- **Rule:** Only create references if content is >50 lines or highly specialized
- **Output:** `references/*.md` files (or none)

## Step 4: Validate

Run the 5-Part Framework validation checklist (see `framework.md`).

## Step 5: Test and Iterate

- Test trigger phrases — does it activate on expected queries?
- Run the skill once — does it follow the process?
- If not → apply iteration rules (see `iteration.md`)

## Description Writing Rules

- Use third-person: `"This skill should be used when the user asks to..."`
- Include 5-10 specific trigger phrases
- Mix EN + TH triggers for bilingual users
- Be concrete: `"create a pipeline"`, `"design the database"`

## Writing Style

- Imperative form: `"Parse the config"` not `"You should parse the config"`
- Explain the why — agents respond better to reasoning than rigid MUSTs
- No second person in body
- Third-person in description only
