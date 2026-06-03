---
name: ui-to-text
description: >
  This skill should be used when the user provides a UI screenshot, mockup, Figma export,
  or any image of an interface and asks to "describe this UI", "write spec from screenshot",
  "convert UI to text", "analyze this screen", "write requirements from this design",
  "สรุป UI นี้", "เขียน spec จากรูป", "อ่าน UI", "แปล UI เป็น text",
  or needs to extract structured documentation from a visual interface.
  Output is always Markdown unless the user specifies otherwise.
version: 1.0.0
last_improved: 2026-06-03
improvement_count: 0
---

# UI to Text

Convert UI screenshots or design images into structured Markdown documentation.

## Output Modes

Detect from context — ask only if ambiguous:

| User intent | Output |
|-------------|--------|
| "write spec", "requirements", "BRD" | **Spec Mode** — functional spec with sections |
| "user story", "acceptance criteria" | **Story Mode** — As a / I want / So that format |
| "describe", "explain", "summarize" | **Description Mode** — narrative flow walkthrough |
| "document this", "feature list" | **Doc Mode** — feature list + component breakdown |

Default when unclear: **Spec Mode**

---

## Step 1 — Visual Scan (always do this first)

Before writing anything, read the image systematically:

1. **Page/Screen name** — what is this screen called or what does it represent?
2. **Layout structure** — header, sidebar, content area, footer, modal?
3. **Key components** — buttons, forms, tables, cards, nav, icons
4. **User actions** — what can the user do on this screen?
5. **Data displayed** — what information is shown?
6. **States visible** — empty, loading, error, filled, selected?

---

## Step 2 — Write Output by Mode

### Spec Mode

```markdown
# [Screen Name] — Functional Spec

## Overview
[1–2 sentence summary of what this screen does]

## Layout
[Describe the visual structure: top nav, left sidebar, main content, etc.]

## Components

### [Component Name]
- **Type:** [button / form / table / card / modal / etc.]
- **Purpose:** [what it does]
- **Content:** [what text/data it shows]
- **Actions:** [what happens when interacted with]

## User Flows
1. [Action] → [Result]
2. [Action] → [Result]

## Data Requirements
- [Field name]: [type, source, validation if visible]

## Edge Cases / States
- Empty state: [description]
- Error state: [description if visible]
```

### Story Mode

```markdown
## [Feature Name] — User Stories

**US-001**: As a [role], I want to [action], so that [benefit].
- Acceptance Criteria:
  - [ ] [criterion]
  - [ ] [criterion]

**US-002**: ...
```

### Description Mode

```markdown
## [Screen Name]

[Narrative walkthrough — describe what the user sees and experiences, top to bottom, left to right]
```

### Doc Mode

```markdown
## [Screen Name] — Feature Documentation

### Features
- **[Feature]:** [description]

### Components
| Component | Type | Description |
|-----------|------|-------------|
| [name] | [type] | [what it does] |
```

---

## Rules

- Always base output on what is **visually present** — do not invent features not shown
- If text in the image is unclear, note it: `[text unclear]`
- If multiple screens are provided, document each separately with a `---` divider
- Keep language English unless the user writes in Thai (then use Thai)
- Do not add opinions or design recommendations unless asked

---

## Multi-Image Handling

When user provides multiple screenshots:
1. Identify if they are different screens or states of the same screen
2. Document each separately, then add a **Flow Summary** section connecting them:

```markdown
## Flow Summary
Screen A → [action] → Screen B → [action] → Screen C
```
