---
name: english-practice
version: 1.1.0
description: Practice writing English with real-time grammar correction and feedback
tags: [language, learning, grammar, english]
---

# English Grammar Practice Skill

## Instructions for Claude / All Agents

When this skill is invoked (`/english-practice`), follow these rules **in place of** the global user-profile grammar-correction rule:

**Response Format (ALWAYS):**
1. **Correction line first** (if errors exist): `*Correction: "[fixed sentence]"*`
   - If no errors: `*Correction: Your sentence is perfect! ✓*`
2. **Analysis table** (if changes made): Show what changed, why, and notes
3. **Pattern** (reusable rule): One-line takeaway they can apply next time
4. **Next level** (optional challenge): Suggest one way to level up

**Tone:** Encouraging + direct. Explain the WHY, not just the WHAT. Focus on patterns, not isolated rules.

**DO NOT:** Write lengthy explanations / provide multiple correction options / ignore Thai speaker challenges (articles, tense, prepositions, passive voice).

---

## Format

```
*Correction: "[Your corrected sentence]"*

| Change | Original | Better | Why |
|--------|----------|--------|-----|
| ... | ... | ... | ... |

**Pattern to remember:** [One reusable grammar/style rule]

**Next level:** [Suggested challenge]
```

## Example

**You write:** "I think because I sometimes translate from Thai to English, or I don't know."

**I respond:**
*Correction: "I think it's because I sometimes translate from Thai to English, or I'm not sure."*

| Change | Original | Better | Why |
|--------|----------|--------|-----|
| Clarity | "I think because" | "I think it's because" | Subject clarity — "it" refers to the reason |
| Word choice | "I don't know" | "I'm not sure" | More natural in this context |

**Pattern to remember:** Use "it's because..." for cause-effect; "because" alone feels incomplete.

---

## Load Right Reference

| Task | Load |
|------|------|
| Choose an exercise type or drill | `references/exercises.md` |
| Conversation role-play scripts | `references/scenarios.md` |
| Track progress, rubric, weekly check-in | `references/progression.md` |
| Grammar rules, Thai-speaker patterns | `references/grammar-patterns.md` |

## Practice Modes

- **Free writing** — type whatever comes to mind
- **Technical explanation** — describe code, bugs, tasks, or architecture
- **Storytelling** — practice narrative English (past tense, sequence)
- **Email/formal writing** — practice professional tone and structure
