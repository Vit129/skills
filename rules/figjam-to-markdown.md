# FigJam to Markdown Converter

## Input
`#figjam [PREFIX] {Pasted_Text_from_FigJam}`

**How to copy from FigJam:**
1. Select all elements on the FigJam board (Cmd+A)
2. Copy (Cmd+C) — gets plain text of sticky notes, text boxes, tables
3. Paste in chat with the prefix (if any)

## Process
1. Parse text structure:
   - Headers: lines with `:`, `::`, or standalone short lines
   - Lists: lines starting with `-`, `•`, `*`, numbers
   - Tables: detect aligned columns or tab-separated values
   - Flow steps: detect numbered sequences (1., 2., Step 1, etc.)
2. Infer sections from content:
   - "Goal:", "เป้าหมาย:" → Goal section
   - "Requirement:", "ข้อกำหนด:" → Requirement section
   - "Persona:", "User:", "Role:" → Persona section
   - Numbered flows → Steps/Process section
3. Structure as markdown with appropriate headers

## Output
- Location: ask the user where to save it if not obvious from project structure (no fixed import folder outside company workspaces)
- Naming:
  - With PREFIX: `{Prefix}-Requirement.md`
  - No PREFIX: extract from first header → `{InferredName}-Requirement.md`

Example: `#figjam Login {paste...}` → `Login-Requirement.md`

## Required: Source Note
Output file must always end with this section:

```markdown
## 📌 Source
> Converted from FigJam board (copy-paste method)
> Date: {YYYY-MM-DD HH:mm}
```

## Notes
- If line breaks are ambiguous → ask the user how to split sections
- If a table looks incomplete → note in the Source Note "verify table against the original"
- Don't force a template — output follows the structure found in the pasted text
