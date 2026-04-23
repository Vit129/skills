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
| 1. Per-project | `{cwd}/.unified-memory/knowledge/` | Working within a specific project workspace — walk up from cwd until found |
| 2. Global fallback | `{project_root}/skills/knowledge/` | No per-project knowledge found — cross-project shared patterns |

**Rule:** Always check per-project first. Fall back to global only if `.unified-memory/knowledge/` does not exist in the project tree.
