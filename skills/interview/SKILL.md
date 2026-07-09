---
name: interview
description: >
  Multi-mode interview and review skill. Triggers: "interview me", "ถามมาเลย", "grill me",
  "ถามจนชัด", "interview-doc", "grill with docs", "ถามกับ code", "ตรวจสอบกับ codebase",
  "brainstorm", "3 amigos", "คุยก่อนแบ่งงาน", "ช่วยคิด", "stress-test",
  "doubt-driven", "adversarial review", "challenge this plan",
  "source-driven", "verify against docs", "cite sources", "check framework version".
  For post-hoc glossary extraction use /ubiquitous-language instead.
version: 1.1.0
last_improved: 2026-06-27
---

# Interview — Router

## Mode Detection (auto — do NOT ask)

| Situation | Load |
|-----------|------|
| No codebase, vague/underspecified idea → extract via Q&A | `references/me.md` |
| Has codebase, align language, stress-test plan against code | `references/doc.md` |
| After requirements captured (CONTEXT.md), before `/plan`, complex feature | `references/amigos.md` |
| High-stakes decision, non-trivial logic, before commit/deploy | `references/doubt.md` |
| Framework/library specific implementation, API version matters | `references/source.md` |

> **Note:** `doc.md` uses `references/domain-modeling.md` for CONTEXT.md and decision-recording rules.
> Other skills that need to update domain docs should read `domain-modeling.md` directly.
