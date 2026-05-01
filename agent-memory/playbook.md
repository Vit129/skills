# Playbook — Problem Resolution Cases

<!-- Flat table. Search by domain or trigger keywords at session start. -->
<!-- Trigger/Fix: 120 chars max. If more detail needed → store in knowledge/ and reference path. -->
<!-- Sequential IDs: CASE-001, CASE-002, etc. -->

<!-- Applied/Prevented: increment when case is used or prevents a repeat. -->
<!-- Archive rule: when Applied+Prevented >= 5 AND no use in 30 days → move to knowledge/archive-playbook.md -->

| ID | Trigger | Fix | Domain | Outcome | Applied | Prevented |
|----|---------|-----|--------|---------|---------|-----------|
| CASE-001 | Saving memory after editing global skill/hook/rule but workspace is a project | Route to `.claude/agent-memory/` (not project). Ask: "global skill or project feature?" | tooling/memory-routing | Prevents lessons landing in wrong project | 1 | 0 |
| CASE-002 | AIDLC Vibe/Spec mode: wrong detection, wrong artifact path, wrong dialog scope | Detection=Kiro IDE mode context; artifacts→`.aidlc/` only; dialog=global rule all agents | tooling/aidlc | 3 design corrections applied in v2 | 1 | 0 |
| CASE-003 | Hook routing uses `~/` or workspace discovery for user-level memory | Use absolute path `/Users/supavit.cho/.claude/agent-memory/` explicitly | tooling/hooks | Prevents lessons landing in wrong location | 1 | 0 |
| CASE-004 | New file at repo root gitignored by `*` rule (e.g. project_specs.md) | Put templates/references in `rules/` or another tracked folder — not repo root | tooling/gitignore | Prevented silent loss of committed files | 0 | 1 |
