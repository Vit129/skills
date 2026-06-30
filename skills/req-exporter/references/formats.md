# Export Formats

## CSV Format

```csv
ID,Title,Type,Priority,Description,Acceptance Criteria,Status,Sprint
REQ-001,"User Login","Functional","Must","As a user I want to login...","Given valid credentials...",Draft,Sprint-1
```

Rules: RFC 4180 compliant (proper quoting, escaping). If no ID → auto-generate sequential (REQ-001, REQ-002...).

## Text Format

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

## Markdown Format

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

## PDF Format

```text
1. Generate Markdown first (using template above)
2. Convert using: npx md-to-pdf {output}.md
   OR: pandoc {output}.md -o {output}.pdf
3. If tools not available → output Markdown and instruct user to convert
```

### CLI Tools

```bash
# Option 1: md-to-pdf (Node.js)
npm install -g md-to-pdf && md-to-pdf requirements.md

# Option 2: pandoc (universal)
brew install pandoc && pandoc requirements.md -o requirements.pdf
```
