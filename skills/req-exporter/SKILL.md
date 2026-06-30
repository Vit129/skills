---
name: req-exporter
description: >
  Export requirements/specifications to multiple formats (CSV, Text, PDF, Markdown).
  Trigger: "export req", "export requirements", "convert req to csv", "req to pdf",
  "export requirements", "convert spec to markdown", "download requirements",
  "export to csv", "export to pdf", "convert to text"
version: 2.0.0
last_improved: 2026-06-30
improvement_count: 1
---

# Req Exporter

Export AIDLC requirements, decisions, and specifications into shareable formats.

---

## Supported Formats

| Format | Extension | Use Case |
|--------|-----------|----------|
| CSV | `.csv` | Import to Jira, Azure DevOps, Excel, Google Sheets |
| Text | `.txt` | Plain text for email, chat, quick sharing |
| Markdown | `.md` | Documentation, GitHub wiki, Confluence |
| PDF | `.pdf` | Formal sign-off, stakeholder review, audit trail |

---

## Load Right Reference

| Task | Load |
|------|------|
| Format templates + examples + PDF CLI tools | `references/formats.md` |
| Workflow: input sources, fields, steps, save path | `references/workflow.md` |

---

## Hard Rules

- NEVER modify source files — read-only operation
- ALWAYS include generation metadata (date, source, count)
- CSV must be RFC 4180 compliant (proper quoting, escaping)
- If requirement has no ID → auto-generate sequential (REQ-001, REQ-002...)
- If PDF tool not installed → output MD + instruction, don't fail
