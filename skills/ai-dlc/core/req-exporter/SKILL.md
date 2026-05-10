---
name: req-exporter
description: >
  Export requirements/specifications to multiple formats (CSV, Text, PDF, Markdown).
  Trigger: "export req", "export requirements", "แปลง req เป็น csv", "req to pdf",
  "ส่งออก requirements", "convert spec to markdown", "download requirements",
  "export ออกมา", "ส่งออกเป็น csv", "ส่งออกเป็น pdf", "แปลงเป็น text"
---

# Req Exporter

Export AIDLC requirements, decisions, and specifications into shareable formats.

## Supported Output Formats

| Format | Extension | Use Case |
|--------|-----------|----------|
| CSV | `.csv` | Import to Jira, Azure DevOps, Excel, Google Sheets |
| Text | `.txt` | Plain text for email, chat, quick sharing |
| Markdown | `.md` | Documentation, GitHub wiki, Confluence |
| PDF | `.pdf` | Formal sign-off, stakeholder review, audit trail |

## Input Sources (auto-detected)

The skill reads from these locations in priority order:

1. `.aidlc/[system]/[feature]/DECISIONS.md` — requirements & decisions
2. `.aidlc/[system]/[feature]/phase-*/` — phase outputs (inception, task design)
3. User-specified file path — any markdown/text file with requirements
4. Chat context — requirements provided inline by user

## Workflow

### Step 1: Identify Source

```text
Agent reads:
  1. Scan .aidlc/ for existing requirement files
  2. If not found → ask user for source file or inline content
  3. Parse requirements into structured data
```

### Step 2: Parse Requirements Structure

Extract these fields from source:

| Field | Description | Required |
|-------|-------------|----------|
| ID | Requirement identifier (e.g., REQ-001, US-001) | Yes |
| Title | Short title/summary | Yes |
| Description | Full requirement text | Yes |
| Type | Functional / Non-functional / Constraint | No |
| Priority | Must / Should / Could / Won't (MoSCoW) | No |
| Acceptance Criteria | Testable conditions | No |
| Status | Draft / Approved / Implemented / Verified | No |
| Sprint | Sprint assignment (if from SP planning) | No |

### Step 3: Generate Output

#### CSV Format
```csv
ID,Title,Type,Priority,Description,Acceptance Criteria,Status,Sprint
REQ-001,"User Login","Functional","Must","As a user I want to login...","Given valid credentials...",Draft,Sprint-1
```

#### Text Format
```text
=== Requirements Export ===
Generated: {date}
Source: {source_path}
Total: {count} requirements

---
[REQ-001] User Login
Type: Functional | Priority: Must | Status: Draft
Description: As a user I want to login...
Acceptance Criteria:
  - Given valid credentials, when I submit login form, then I am redirected to dashboard
---
```

#### Markdown Format
```markdown
# Requirements Export

> Generated: {date} | Source: `{source_path}` | Total: {count}

## REQ-001: User Login

| Field | Value |
|-------|-------|
| Type | Functional |
| Priority | Must |
| Status | Draft |

**Description:** As a user I want to login...

**Acceptance Criteria:**
- [ ] Given valid credentials, when I submit login form, then I am redirected to dashboard
```

#### PDF Format
```text
1. Generate Markdown first (using template above)
2. Convert using: npx md-to-pdf {output}.md
   OR: pandoc {output}.md -o {output}.pdf
3. If tools not available → output Markdown and instruct user to convert
```

### Step 4: Save Output

Default output location: `.aidlc/[system]/[feature]/exports/`

```text
.aidlc/
  booking-system/
    user-auth/
      exports/
        requirements-2026-05-10.csv
        requirements-2026-05-10.md
        requirements-2026-05-10.pdf
```

## Hard Rules

- NEVER modify source files — read-only operation
- ALWAYS include generation metadata (date, source, count)
- CSV must be RFC 4180 compliant (proper quoting, escaping)
- If requirement has no ID → auto-generate sequential ID (REQ-001, REQ-002...)
- If PDF tool not installed → output MD + instruction, don't fail
- Language: file content in English, user interaction in Thai

## CLI Tools (optional, for PDF generation)

```bash
# Option 1: md-to-pdf (Node.js)
npm install -g md-to-pdf
md-to-pdf requirements.md

# Option 2: pandoc (universal)
brew install pandoc
pandoc requirements.md -o requirements.pdf

# Option 3: mdpdf (Node.js, with styling)
npm install -g mdpdf
mdpdf requirements.md
```

## Integration with AIDLC Pipeline

```text
Phase 1 (Inception) → DECISIONS.md created
                          │
                          ▼
              req-exporter → CSV/MD/PDF/Text
                          │
                          ▼
              Share with stakeholders / Import to PM tool
```
