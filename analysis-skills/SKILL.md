---
name: analysis-skills
description: >
  This skill should be used when the user asks to "analyze the codebase", "extract requirements",
  "do gap analysis", "map business domains", "reverse engineer this system", "read Figma design",
  or needs to understand what exists, what's needed, and what's missing before implementation.
---

# Analysis Skills

Understand what exists, what's needed, and what's missing.

## Sub-Skills — Load EXACTLY ONE reference per request

Each sub-skill is fully independent. Match the request to ONE row, load that reference only.
If the request matches multiple rows → ask the user which analysis to run first.

| User says | Load |
|-----------|------|
| "analyze context", "what are the goals", "extract conflicts" | `references/context.md` |
| "read Figma", "analyze design", "extract UI components" | `references/figma.md` |
| "gap analysis", "what's missing", "compare required vs actual" | `references/gap.md` |
| "map domains", "business logic", "find reusable patterns" | `references/domain.md` |
| "gather requirements", "write user stories", "BDD scenarios" | `references/requirements.md` |
| "reverse engineer", "scan codebase", "understand architecture" | `references/reverse-eng.md` |
| "parse test scenarios", "extract test cases", "read CSV scenarios" | `references/scenario-reader.md` |

**Hard rules:**
- Load ONE reference file — never load multiple in the same turn unless the user explicitly asks for a combined analysis
- Each reference is self-contained — updating one file has zero effect on others
- If none of the rows match clearly → ask the user to clarify which analysis they need
