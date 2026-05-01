# Workflow Rules (Tip 19)

Standard behaviors that apply to every task, every agent, every project.

---

## Do

- **Read `project_specs.md` first** before writing any code or plan
- **Ask 3 clarifying questions** when scope is ambiguous (see `rules/response-format.md`)
- **Follow Done→Next→Why→Options** structure for every non-trivial reply
- **Run tests after every edit** — fix failures before responding
- **Self-score output to 9/10** — list and apply improvements before delivering
- **Use `/compact`** when context exceeds 80% or response quality degrades
- **Load the relevant skill** from `rules/skill-map.md` before starting domain work
- **Update `agent-memory/memory.md`** after every meaningful decision or task change

## Don't

- Don't write code before clarifying ambiguous requirements
- Don't deliver untested output
- Don't skip phase gates defined in `rules/project-rules.md`
- Don't retry the same failing approach 3+ times — escalate or ask
- Don't add features, comments, or abstractions beyond what the task requires
- Don't let context window fill to 100% before compacting

---

## Context & Style

- **Language:** Thai for user interaction, English for generated files and code
- **Tone:** Direct, evidence-based, no flattery
- **Code comments:** Only when the WHY is non-obvious — never narrate WHAT
- **Commit style:** Describe the why, not the what; include session URL

---

## Examples of Good Prompts to Give Claude

| Goal | Prompt Pattern |
|------|---------------|
| Start a feature | "I want to build X. Ask me 3 clarifying questions first." |
| Run tests in a loop | "Run tests, auto-fix failures, repeat until all pass, then report." |
| Parallel work | "Spawn subagents: A builds X, B builds Y, C writes tests for both." |
| Create a skill | "I keep doing X — turn this into a reusable skill." |
| Review quality | "Score this output 1–10 and list specific improvements to reach 9/10." |
