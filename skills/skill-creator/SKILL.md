---
name: skill-creator
description: >
  This skill should be used when the user asks to "create a skill", "write a new skill",
  "สร้าง skill", "improve skill", "fix skill format",
  or needs guidance on SKILL.md structure, progressive disclosure, description writing,
  or skill development best practices.
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# Skill Creator

Create, improve, and validate agent skills using the 5-Part Framework.

## Skill Anatomy

```text
skill-name/
├── SKILL.md              (required — core process, lean)
├── references/           (optional — detailed docs, loaded as needed)
├── scripts/              (optional — executable code)
└── assets/               (optional — templates, images)
```

## Progressive Disclosure (3 levels)

1. **Metadata** (name + description) — always in context (~100 words)
2. **SKILL.md body** — loaded when skill triggers (<500 lines ideal)
3. **Bundled resources** — loaded as needed (unlimited)

**Golden rule:** Keep SKILL.md focused on core process. Push detailed content to `references/`.

---

## The 5-Part Framework

Every skill MUST have these 5 parts. This is what separates a good skill from a great one.

### Part 1: Name + Trigger

The frontmatter. This is what the agent uses to decide whether to activate the skill.

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
- Lean slightly "pushy" — agents tend to under-trigger, so be generous
- Cover edge cases: include phrases where skill should trigger even if user doesn't name it

### Part 2: Objective

1-2 lines immediately after the heading. What this skill produces.

```markdown
# Skill Name

Create X that does Y for audience Z.
```

Short is fine — the process section carries the detail.

### Part 3: Context

Tell the agent what tools, files, APIs, or references it needs before executing.

```markdown
## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| `playwright-rules` | Coding standards | MUST read before writing code |
| `knowledge/lessons/` | Lessons learnt | Check before execute |
| MCP azure-devops tools | Integration | Fetch work items |
| Playwright CLI | Shell tool | Run tests |
```

**Rules:**
- If short context → inline in SKILL.md
- If specialized/long → separate `references/` file
- Always include `knowledge/lessons/` — agents skip it otherwise

### Part 4: Process (สำคัญที่สุด)

Step-by-step instructions. For EACH step, answer 4 questions:

1. **ทำอะไร?** — What does this step produce?
2. **Human-in-the-loop ตรงไหน?** — Where does the user approve/choose?
3. **Context เพิ่มอะไร?** — What extra info is needed?
4. **Output คืออะไร?** — What's the deliverable?

```markdown
## Process

### Step 1: [Action]
- **Do:** [what to produce]
- **HitL:** Present 3 options → user picks (single select)
- **Context:** Read `references/patterns.md`
- **Output:** [artifact name]

### Step 2: [Action]
...
```

**Critical tricks:**
- At every human-in-the-loop point → **always present multiple options** (2-5), never a single answer
- Types of HitL: `checkbox` (approve items), `single select` (pick one), `open field` (free input)
- If a step has no HitL → it runs autonomously (state this explicitly)

**Add a structured table:**

```markdown
## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After architecture proposal | Single select | Present 3 options with tradeoffs |
| After first file written | Checkbox | Confirm pattern before scaling |
| Before commit | Open field | User reviews changes |
```

### Part 5: Rules + Self-Learning

Two sub-sections:

#### Rules (ป้องกันพัง)

Predict what will go wrong and write rules to prevent it.

```markdown
## Rules

- NEVER [common mistake the agent makes]
- ALWAYS [thing the agent tends to skip]
- If [edge case] → [what to do instead]
```

**Bonus sections (optional but powerful):**
- **Gotchas** — known pitfalls specific to this domain
- **Anti-Rationalization Table** — excuses the agent might make + counter-arguments
- **Red Flags** — early warning signs that something is going wrong

#### Self-Learning (ทำให้ skill เก่งขึ้นเอง)

```markdown
## Self-Learning

After user approves the output:

1. **Record good example:** Save approved output to `knowledge/lessons/{domain}/{pattern}.md`
2. **Record failures:** If rejected → note what went wrong
3. **Progressive update:** If new pattern proved effective → append to knowledge index
4. **Confidence:** `1.0` (user-approved) vs `0.7` (auto-generated)
```

**The power move:** If user approves the final result → save it as a "good example" so the skill learns what "good" looks like automatically.

#### Verification Checklist

```markdown
## Verification

- [ ] [Key quality check 1]
- [ ] [Key quality check 2]
- [ ] `knowledge/lessons/` checked before execute
```

---

## Iteration Rules (เมื่อ skill ทำงานไม่ดี)

| Problem | Fix |
|---------|-----|
| Agent ไม่ทำตาม process | แก้ที่ SKILL.md — ทำ step ให้ชัดขึ้น |
| Agent ต้องการข้อมูลเพิ่ม | เพิ่ม reference file |
| Agent ทำสิ่งที่ไม่ต้องการ | เพิ่ม rule ("NEVER...") |
| Agent ใช้ tool ไม่เป็น | สอนด้วยมือ 1 ครั้ง → สร้าง MCP reference doc |
| SKILL.md รก | ย้าย detail ไป references/ — เก็บแค่ core process |

---

## Process: Creating a New Skill

### Step 1: Define the ideal process

Before writing anything — think through the ideal workflow step by step.

- **Do:** Map out what a perfect execution looks like, step by step
- **HitL:** Present the process outline → user approves or adjusts
- **Output:** Process outline (numbered steps)

### Step 2: Write SKILL.md

- **Do:** Write frontmatter + 5 parts following the framework above
- **HitL:** Present draft → user reviews
- **Output:** `SKILL.md` file

### Step 3: Create references (if needed)

- **Do:** Move detailed/specialized content to `references/`
- **Rule:** Only create references if content is >50 lines or highly specialized
- **Output:** `references/*.md` files (or none)

### Step 4: Validate

Run this checklist:

- [ ] Frontmatter has `name` + `description` with trigger phrases (EN + TH)
- [ ] Objective is 1-2 lines, clear
- [ ] Required Context table exists
- [ ] Process has numbered steps with HitL points marked
- [ ] Human-in-the-Loop table exists (Step / Approval Type / When)
- [ ] Rules section exists (predict what will go wrong)
- [ ] Self-Learning section exists (record good examples)
- [ ] Verification checklist exists
- [ ] SKILL.md is <500 lines (move excess to references/)
- [ ] All referenced files actually exist
- [ ] No duplicated information across files

### Step 5: Test & iterate

- Test trigger phrases — does it activate on expected queries?
- Run the skill once — does it follow the process?
- If not → apply iteration rules (table above)

---

## Description Writing Rules

- Use third-person: `"This skill should be used when the user asks to..."`
- Include 5-10 specific trigger phrases
- Mix EN + TH triggers for bilingual users
- Be concrete: `"create a pipeline"`, `"design the database"`
- Cover edge cases: phrases where skill should trigger even if user doesn't name it explicitly

## Writing Style

- Imperative form: `"Parse the config"` not `"You should parse the config"`
- Explain the why — agents respond better to reasoning than rigid MUSTs
- No second person in body
- Third-person in description only

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
