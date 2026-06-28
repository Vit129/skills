---
name: req-exporter
description: >
  Export requirements/specifications to multiple formats (CSV, Text, PDF, Markdown).
  Trigger: "export req", "export requirements", "convert req to csv", "req to pdf",
  "export requirements", "convert spec to markdown", "download requirements",
  "export to csv", "export to pdf", "convert to text"
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
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

1. `agent-memory/MEMORY.md` Decisions section — requirements & decisions
2. Artifact root `phase-*/` phase outputs — phase outputs (inception, task design)
3. User-specified file path — any markdown/text file with requirements
4. Chat context — requirements provided inline by user

## Workflow

### Step 1: Identify Source

```text
Agent reads:
  1. Scan `agent-memory/plans/` for existing requirement files
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

Output: `agent-memory/plans/[feature]/exports/`

```text
agent-memory/plans/[feature]/
  [feature]/
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


---

## Verification

Before declaring export complete, confirm:

- [ ] Source files read correctly (requirements parsed with IDs)
- [ ] Output format matches user request (CSV/Text/MD/PDF)
- [ ] CSV is RFC 4180 compliant (proper quoting, escaping)
- [ ] Generation metadata included (date, source, count)
- [ ] Output saved to `agent-memory/plans/[feature]/exports/`
- [ ] Source files NOT modified (read-only operation)

---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| `agent-memory/MEMORY.md` + `agent-memory/plans/[feature]/outputs/` | Input source | Requirements to export |
| Output format tools (`md-to-pdf`, `pandoc`) | CLI tools | PDF generation (optional) |
| RFC 4180 CSV standard | Format spec | Ensure valid CSV output |
| `knowledge/lessons/` | Lessons learnt | Check before execute |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After parsing (confirm structure) | Checkbox (verify requirement IDs + fields) | After extracting requirements from source |
| After output (confirm format) | Single select (correct format / regenerate / different format) | After generating export file |
| Missing fields | Open field | When required fields (Priority, Type) not found in source |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.

## Self-Learning

After user approves the output:

1. **Record good example:** Save approved output to `knowledge/lessons/tooling/{pattern}.md`
2. **Record failures:** If output was rejected → note what went wrong for next time
3. **Progressive update:** If a new pattern proved effective → append to relevant knowledge index
4. **Confidence tracking:** `confidence: 1.0` (user-approved) vs `confidence: 0.7` (auto-generated)

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
