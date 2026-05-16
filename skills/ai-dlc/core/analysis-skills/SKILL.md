---
name: analysis-skills
description: >
  This skill should be used when the user asks to "analyze the codebase", "วิเคราะห์ codebase",
  "extract requirements", "ดึง requirements", "do gap analysis", "ทำ gap analysis",
  "map business domains", "map domain", "find existing assets", "หา asset ที่มีอยู่",
  "discover before building", "ค้นหาก่อนสร้าง", "zoom out", "มองภาพรวม", "big picture first",
  "reverse engineer this system", "reverse engineer ระบบนี้",
  or needs to understand what exists, what's needed, and what's missing before implementation.
  Used by PO, Dev, and QA roles across all phases.
---

# Analysis Skills (Core)

Foundational analysis tools used across all AIDLC phases.

## Sub-Skills — Load EXACTLY ONE reference per request

| User says | Load |
|-----------|------|
| "analyze context", "what are the goals", "extract conflicts", "zoom out", "big picture first" | `references/context.md` |
| "find existing assets", "discover before building", "map domains", "business logic", "find reusable patterns" | `references/discovery-domain.md` |
| "gap analysis", "what's missing", "compare required vs actual" | `references/gap.md` |
| "gather requirements", "write user stories", "BDD scenarios" | `references/requirements.md` |
| "reverse engineer", "scan codebase", "understand architecture" | `references/reverse-eng.md` |

**Note:** For Figma analysis → use `ux-ui/ui-designer` skill. For test scenario reading → use `qa/test-scenario` skill.

**Hard rules:**
- Load ONE reference file — never load multiple in the same turn unless explicitly asked
- Each reference is self-contained
- If none match clearly → ask user to clarify

## Knowledge Root Convention

`{knowledge_root}` resolves in this order:

| Priority | Path | When to use |
|----------|------|-------------|
| 1. Per-project | `{cwd}/agent-memory/knowledge/` | Working within a specific project workspace — walk up from cwd until found |
| 2. Global fallback | `{project_root}/skills/knowledge/` | No per-project knowledge found — cross-project shared patterns |

**Rule:** Always check per-project first. Fall back to global only if `agent-memory/knowledge/` does not exist in the project tree.

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "I'll load both gap.md and requirements.md together to be thorough" | Hard rule: load ONE reference per request. Each reference is self-contained. Loading multiple creates conflicting instructions and bloated context that degrades output quality. |
| "The user said 'analyze' so I'll pick whichever reference seems closest" | If the match isn't clear, ASK the user to clarify. Guessing wrong means running the wrong analysis framework entirely — wasted effort and misleading output. |
| "I'll skip checking per-project knowledge and just use the global fallback" | Per-project knowledge (agent-memory/knowledge/) has project-specific patterns that override generic ones. Skipping it means missing lessons already learned for this exact codebase. |
| "I don't need discovery-domain.md — I already know what exists from reading code" | Discovery-domain maps business logic and reusable patterns systematically. Ad-hoc code reading misses cross-cutting concerns and domain boundaries that structured discovery catches. |
| "Gap analysis isn't needed — the requirements are clear enough" | Gap analysis compares required vs actual state. Even "clear" requirements often have implicit assumptions that only surface when systematically compared against what exists. |

---

## Red Flags

- 🚩 Multiple reference files loaded in a single turn → Violates the "load EXACTLY ONE" rule; identify which single analysis the user actually needs and load only that one.
- 🚩 Analysis output references Figma frames or test scenarios → Wrong skill invoked; Figma analysis belongs to `ux-ui/ui-designer`, test scenario reading belongs to `qa/test-scenario`.
- 🚩 Knowledge root resolved to global fallback without checking per-project first → Walk up from cwd to find `agent-memory/knowledge/` before falling back to `skills/knowledge/`.
- 🚩 Agent ran reverse-eng analysis but user asked for gap analysis → Keyword mismatch; re-read the sub-skill routing table and match the user's actual intent.
- 🚩 Analysis produced recommendations without citing what was found in the codebase → Analysis must be grounded in discovered artifacts, not assumptions; re-run with actual file reads.
