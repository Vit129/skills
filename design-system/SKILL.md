---
name: design-system
description: >
  AI-powered design system generator. Use this skill when the user asks to "generate a design system",
  "create design rules for my product", "recommend colors and typography for my industry",
  "define design tokens for my app", "validate design against best practices", "scale design patterns",
  or needs a complete design system tailored to their industry and tech stack.
  Complements ui-designer for industry-specific, battle-tested patterns across 8 sectors.
---

# design-system

AI-powered design system generator that analyzes project requirements and automatically generates complete, tailored design systems using 161 industry rules, 67 UI styles, 161 color palettes, and 57 typography pairings.

---

## Workflow (Always in This Order)

1. **Identify Industry** — SaaS, Finance, Healthcare, E-commerce, Services, Creative, Lifestyle, Emerging Tech
2. **Run Reasoning Engine** — 4-stage analysis (search → match → generate → validate)
3. **Apply Industry Rules** — 161 battle-tested patterns organized by sector
4. **Output Design System** — Colors, typography, patterns, tokens, checklist
5. **Validate** — WCAG AA accessibility, responsive breakpoints, dark mode

---

## Core Capabilities

| Capability | Count | Use Case |
|-----------|-------|----------|
| **Industry Rules** | 161 | Domain-specific patterns (finance ≠ e-commerce) |
| **UI Styles** | 67 | Visual approaches (minimalism, brutalism, glassmorphism, etc.) |
| **Color Palettes** | 161 | Psychology-backed, industry-aligned colors |
| **Font Pairings** | 57 | Google Fonts, accessibility-tested combinations |
| **Chart Types** | 25 | Data visualization for dashboards & analytics |
| **UX Guidelines** | 99 | Detailed interactive patterns |
| **Tech Stacks** | 15 | Web, mobile, native platform guidance |

---

## When to Use @design-system

✅ **Use this skill when:**
- Generating a complete design system from scratch
- Scaling design patterns across multiple products
- Validating existing designs against industry best practices
- Recommending colors, typography, patterns for a specific industry
- Creating design tokens (CSS variables, Tailwind config)

✅ **Works with:**
- `ui-designer` — UI Designer handles aesthetic direction + tone; design-system provides industry-validated patterns
- `frontend-dev` — Implement design tokens in code after system generation

❌ **Don't use when:**
- Implementing UI code (use `frontend-dev`)
- Tweaking an existing design (use `ui-designer`)
- Just need aesthetic direction (use `ui-designer`)

---

## Quick Start

### Example: Fintech Dashboard
```
Command: design-system --industry finance --stack react

Output:
→ Color palette: Navy + Deep Green (trust + growth)
→ Typography: Playfair Display + Source Sans 3
→ Patterns: Account dashboard, transaction lists, 2FA flows
→ Tokens: CSS variables for Tailwind config
→ Checklist: WCAG AAA, dark mode, responsive (320px/768px/1024px)
```

### Example 2: Healthcare App
```
Industry: Healthcare
Stack: Next.js
Goal: Patient telemedicine platform

Output:
→ Color palette: Soft blue + wellness green
→ Typography: Merriweather + Roboto
→ Patterns: Timeline, medication instructions, appointment booking
→ Accessibility: 16px+, 1.6 line-height, HIPAA-friendly data viz
→ Checklist: Privacy disclaimers, emoji icons, alt text
```

### Example 3: E-commerce Store
```
Industry: E-commerce
Stack: Vue + Vite
Goal: Multi-category product catalog

Output:
→ Color palette: Orange CTA + Blue trust
→ Typography: Montserrat + Lato
→ Patterns: Product grid, filters, checkout flow, reviews
→ Performance: Lazy-load images, 200ms max interactions
→ Checklist: Mobile-first, abandoned cart recovery, returns policy
```

---

## References

- **Reasoning Engine** — `references/reasoning-engine/four-stage-process.md`
- **Industry Rules** — `references/industry-rules/` (161 rules across 8 sectors)
  - Tech & SaaS (20 rules)
  - Finance (21 rules)
  - Healthcare (20 rules)
  - E-commerce (20 rules)
  - Services, Creative, Lifestyle, Emerging Tech (80 rules total — in progress)
- **Design Patterns** — `references/design-patterns/` (67 styles, 161 palettes, 57 fonts, 25 charts, 99 guidelines)
- **Tech Stacks** — `references/tech-stacks.md` (React, Next.js, Vue, Flutter, SwiftUI, etc.)

---

## Output Format

@design-system generates:

1. **Pattern Recommendations**
   - Landing page layouts
   - Navigation structures
   - Component patterns (buttons, forms, cards, tables)
   - Modal, tooltip, notification patterns

2. **Color System**
   ```css
   --color-primary: #2563eb;       /* Trust, primary actions */
   --color-secondary: #10b981;     /* Growth, success, accent */
   --color-danger: #ef4444;        /* Error, warning, caution */
   --color-neutral-bg: #f3f4f6;    /* Background, light mode */
   --color-neutral-text: #1f2937;  /* Text, high contrast */
   ```

3. **Typography Scale**
   ```css
   --font-display: Playfair Display, serif;
   --font-body: Source Sans 3, sans-serif;
   --font-code: JetBrains Mono, monospace;
   --font-size-h1: 32px; --font-weight: 700;
   --font-size-body: 16px; --font-weight: 400;
   --line-height-body: 1.6;
   ```

4. **Spacing Scale**
   ```
   xs: 4px  sm: 8px  md: 16px  lg: 24px  xl: 32px  2xl: 48px
   ```

5. **Animation Spec**
   - Duration: micro (150ms), normal (300ms), slow (500ms)
   - Easing: ease-out (entrance), ease-in (exit), ease-in-out (state)
   - Examples: "Button hover: 150ms ease-out scale 1.02"

6. **Accessibility Checklist**
   - WCAG AA/AAA compliance
   - Color contrast validation
   - Touch target sizes (44px+)
   - Keyboard navigation
   - Screen reader support

7. **Responsive Breakpoints**
   ```
   320px (mobile) → 768px (tablet) → 1024px (desktop) → 1280px (wide)
   ```

---

## Skill Integration

### Call from ui-designer
`ui-designer` uses @design-system to:
- Validate design direction against industry patterns
- Extract color recommendations for specific sectors
- Suggest typography pairings
- Cross-check against anti-patterns

**Example:**
```
ui-designer: Design a fintech dashboard
→ Calls @design-system --industry finance
→ Gets: Navy + green palette, table layouts, 2FA patterns
→ Builds: Custom design tokens, component hierarchy
```

### Generate Design Tokens
```
@design-system → Output
→ Copy colors, typography, spacing into project:
   • Tailwind config (web)
   • CSS custom properties (CSS-in-JS)
   • ThemeData (Flutter)
   • SwiftUI modifiers
```

### Validate Existing Design
```
@design-system --validate --file="current-design.figma"
→ Check against: WCAG AA, responsive, anti-patterns
→ Report: Passed/failed, recommendations
```

---

## Key Decisions Made

**Why separate from ui-designer?**
- ui-designer: Aesthetic direction, tone, personality → "What should this feel like?"
- @design-system: Industry patterns, rules, validation → "What does this industry need?"
- Both work together but serve different purposes

**Why 161 industry rules?**
- 20–21 rules per sector ensures specificity without overwhelming choice
- Rules are battle-tested, not invented
- Each rule includes anti-patterns (what to avoid)

**Why 8 sectors?**
- Covers 95% of product categories
- Remaining 5% use closest match + validation

---

## References (Read First)

Start here based on your task:

| Task | Read |
|------|------|
| Building a design system from scratch | `references/reasoning-engine/four-stage-process.md` |
| Fintech, banking, investment products | `references/industry-rules/finance.md` |
| Healthcare, medical, telemedicine | `references/industry-rules/healthcare.md` |
| SaaS, dashboards, analytics | `references/industry-rules/tech-saas.md` |
| E-commerce, retail, marketplaces | `references/industry-rules/ecommerce.md` |
| Color palette options | `references/design-patterns/colors-index.md` |
| Tech stack guidance | `references/tech-stacks.md` |
| Full design patterns library | `references/design-patterns/overview.md` |

---

*Last Updated: 2026-04-16*
*Status: Complete core structure (4/8 industry sectors documented, extendable)*
