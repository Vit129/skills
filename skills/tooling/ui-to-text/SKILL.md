---
name: ui-to-text
description: >
  Convert UI screenshots, mockups, or Figma frames into structured text descriptions
  for QA test design, accessibility review, and developer handoff.
  Trigger: "แปลง UI เป็น text", "UI to text", "describe this screen", "อธิบาย UI",
  "extract UI elements", "screen to text", "mockup to description",
  "วิเคราะห์หน้าจอ", "UI description", "แปลง screenshot เป็น text",
  "อ่าน UI ให้หน่อย", "UI inventory"
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# UI to Text

Convert UI screenshots/mockups into structured text descriptions that QA, Dev, and PO can use directly.

## Use Cases

| Who | Why |
|-----|-----|
| QA | Generate test scenarios from UI elements without manual screen reading |
| Dev | Understand component structure before implementation |
| PO | Verify UI matches requirements without opening design tool |
| Accessibility | Generate element inventory for WCAG compliance check |

## Input Types

| Input | How to provide |
|-------|---------------|
| Screenshot (PNG/JPG) | Drag into chat or attach via clip icon |
| Figma frame | Use Figma power → export frame → attach image |
| Live page | Use `qa/playwright-cli/` → take screenshot → feed here |
| Wireframe | Attach hand-drawn or low-fi wireframe image |

## Output Formats

### 1. Element Inventory (default)

Structured list of all visible UI elements:

```text
=== UI Element Inventory ===
Screen: {screen_name}
Source: {image_filename or URL}
Generated: {date}

## Layout Structure
- Header (top bar)
  - Logo (left)
  - Navigation: [Home] [Products] [About] [Contact]
  - User menu (right): Avatar + dropdown
- Main Content (center)
  - Hero section
    - Heading: "Welcome to Our Platform"
    - Subtext: "Get started in minutes"
    - CTA Button: [Sign Up Free] (primary, blue)
  - Feature cards (3-column grid)
    - Card 1: Icon + "Fast Setup" + description
    - Card 2: Icon + "Secure" + description
    - Card 3: Icon + "Scalable" + description
- Footer
  - Links: Privacy | Terms | Support
  - Copyright text
```

### 2. Interaction Map

Focus on interactive elements and user flows:

```text
=== Interaction Map ===
Screen: {screen_name}

## Interactive Elements
| # | Element | Type | Action | Validation |
|---|---------|------|--------|------------|
| 1 | Email field | text input | accepts email format | required, email pattern |
| 2 | Password field | password input | masked input | required, min 8 chars |
| 3 | Remember me | checkbox | toggle state | optional |
| 4 | Login button | button (primary) | submit form | enabled when form valid |
| 5 | Forgot password | link | navigate to reset page | - |
| 6 | Sign up link | link | navigate to registration | - |

## States
- Default: form empty, login button disabled
- Valid: all required fields filled, button enabled
- Error: red border on invalid field + error message below
- Loading: button shows spinner, form disabled
```

### 3. Component Spec (for Dev handoff)

```text
=== Component Spec ===
Screen: {screen_name}

## Components Identified
1. **NavBar** — sticky top, contains logo + nav links + user menu
2. **HeroSection** — full-width, background image, centered text + CTA
3. **FeatureCard** — icon + title + description, 3-column responsive grid
4. **Footer** — dark background, link columns + copyright

## Visual Properties (estimated)
- Primary color: #2563EB (blue)
- Font: Sans-serif (likely Inter or system font)
- Spacing: 16px grid
- Border radius: 8px on cards
- Shadow: subtle on cards (0 2px 4px rgba)
```

### 4. Test-Ready Format (for QA pipeline)

```text
=== Test-Ready UI Description ===
Screen: Login Page
URL: /login

## Testable Elements
- [input:email] — placeholder "Enter your email", required
- [input:password] — placeholder "Password", required, masked
- [checkbox:remember] — label "Remember me", unchecked by default
- [button:submit] — text "Log In", disabled until form valid
- [link:forgot] — text "Forgot password?", navigates to /reset-password
- [link:signup] — text "Don't have an account? Sign up", navigates to /register

## Expected Behaviors
- Empty form → submit button disabled
- Invalid email → show "Please enter a valid email"
- Wrong credentials → show "Invalid email or password"
- Successful login → redirect to /dashboard
- "Remember me" checked → persist session 30 days
```

## Workflow

### Step 1: Receive Image
- User attaches screenshot/mockup to chat
- Agent uses vision capability to analyze the image

### Step 2: Identify Output Format
- If user specifies format → use that
- If from QA context → default to "Test-Ready Format"
- If from Dev context → default to "Component Spec"
- If unclear → default to "Element Inventory"

### Step 3: Analyze & Generate
```text
Vision analysis:
  1. Identify page layout (header/main/footer/sidebar)
  2. List all visible text content
  3. Identify interactive elements (buttons, inputs, links, dropdowns)
  4. Note visual states (active, disabled, error, hover indicators)
  5. Identify navigation patterns
  6. Note responsive hints (if visible)
```

### Step 4: Output
- Write to file if user requests save
- Default save location: `.aidlc/[system]/[feature]/ui-descriptions/`
- Or output directly in chat for quick use

## Hard Rules

- NEVER hallucinate elements not visible in the image
- If text is unreadable → mark as `[unreadable]` not guess
- If element purpose is ambiguous → describe visually, don't assume function
- Always note what's VISIBLE vs what's INFERRED
- Language: output in English, interaction in Thai
- If no image provided → ask user to attach one, don't proceed without visual input

## Integration with AIDLC Pipeline

```text
UI Mockup/Screenshot
        │
        ▼
  ui-to-text → Structured Text Description
        │
        ├──► req-exporter (export as part of requirements)
        └──► qa/test-scenario (direct input for scenario design at Phase 2.2)
```

## Tips for Best Results

1. **High resolution** — clearer image = more accurate extraction
2. **Full screen** — capture entire page, not partial
3. **Multiple states** — provide screenshots of different states (empty, filled, error)
4. **Annotate if needed** — circle or highlight areas of interest
5. **Provide context** — "this is the checkout page" helps agent focus


---

## Verification

Before declaring UI-to-text conversion complete, confirm:

- [ ] Image/screenshot was provided (not proceeding without visual input)
- [ ] No hallucinated elements (only what's visible in the image)
- [ ] Unreadable text marked as `[unreadable]` (not guessed)
- [ ] Output format matches context (QA → Test-Ready, Dev → Component Spec)
- [ ] Layout structure identified (header/main/footer/sidebar)
- [ ] Interactive elements listed with types and actions

---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| Screenshot/mockup image | Visual input | Primary source for element extraction |
| Vision capability (multimodal) | AI feature | Analyze image content |
| Target output format | User preference | Element Inventory / Interaction Map / Component Spec / Test-Ready |
| `.aidlc/[system]/[feature]/ui-descriptions/` | Output location | Persist structured descriptions |
| `knowledge/lessons/` | Lessons learnt | Check before execute |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After format selection | Single select (Inventory / Interaction / Component / Test-Ready) | When output format is ambiguous |
| After element inventory | Checkbox (confirm accuracy) | After generating structured description |
| Ambiguous elements | Open field | When element purpose cannot be determined from image |

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
