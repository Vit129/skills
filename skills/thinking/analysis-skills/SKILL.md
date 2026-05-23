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

## Inline Process

1. **Identify the analysis type** — Match user's request to exactly ONE sub-skill: Context (goals/scope/conflicts), Discovery-Domain (existing assets/reusable patterns), Gap (required vs actual), Requirements (user stories/BDD), or Reverse-Eng (scan codebase architecture). If unclear, ask.
2. **Check per-project knowledge first** — Look for `{cwd}/agent-memory/knowledge/` walking up from cwd. Only fall back to `{project_root}/skills/knowledge/` if not found.
3. **Execute the analysis framework** — Context: zoom out → extract rules → check conflicts. Discovery: scan existing assets → classify reuse/extend/create. Gap: extract required → match against available → calculate reusability %. Requirements: find source → write user stories with BDD. Reverse-Eng: scan codebase → map architecture.
4. **Ground findings in actual artifacts** — Every claim must cite specific files/lines discovered. No assumptions presented as facts.
5. **Resolve conflicts** — If contradictions found, surface them to user. Never silently pick one side.
6. **Write output to file** — Write to `.aidlc/` audit trail. Never dump full analysis in chat only.
7. **Verify** — Exactly ONE reference loaded, findings cite real files, recommendations actionable, per-project knowledge checked first.

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

---

## Verification

Before declaring analysis complete, confirm:

- [ ] Exactly ONE reference file was loaded (not multiple)
- [ ] Per-project knowledge checked before global fallback
- [ ] Output is grounded in actual codebase/artifact reads (not assumptions)
- [ ] Findings cite specific files/lines discovered
- [ ] Recommendations are actionable (not vague)


---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| Source documents (PRD, specs, requirements) | Analysis input | Primary material to analyze |
| Codebase (`{cwd}/`) | Discovery target | Scan for existing assets, architecture, patterns |
| `agent-memory/knowledge/` (per-project) | Knowledge root | Project-specific patterns and lessons |
| `references/*.md` (one per request) | Analysis framework | Context, Discovery, Gap, Requirements, or Reverse-Eng |
| `knowledge/lessons/` | Lessons learnt | Check before execute |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After gap analysis results | Checkbox (confirm findings) | After required vs actual comparison |
| Before recommendations | Single select (which gaps to address) | Before producing actionable recommendations |
| Conflict resolution | Open field | When contradictions found between sources |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.

## Self-Learning

After user approves the output:

1. **Record good example:** Save approved output to `knowledge/lessons/analysis/{pattern}.md`
2. **Record failures:** If output was rejected → note what went wrong for next time
3. **Progressive update:** If a new pattern proved effective → append to relevant knowledge index
4. **Confidence tracking:** `confidence: 1.0` (user-approved) vs `confidence: 0.7` (auto-generated)
