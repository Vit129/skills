---
name: impeccable-design
description: >
  Create distinctive, production-grade frontend interfaces with high design quality.
  Generates creative, polished code that avoids generic AI aesthetics ("AI slop").
  Use when the user asks to "design a UI", "ออกแบบ UI", "make it look better", "ทำให้สวยขึ้น",
  "improve the design", "ปรับปรุง design", "build a landing page", "สร้าง landing page",
  "create a component with good UX", "สร้าง component ที่ดี", "audit the design", "ตรวจสอบ design",
  "polish the UI", "polish UI", "fix the typography", "แก้ typography",
  "improve colors", "ปรับสี", "add animations", "เพิ่ม animation",
  or needs frontend design guidance that goes beyond basic implementation.
  Use this for DESIGN QUALITY (how it looks/feels), not just implementation (how to code it).
  Based on pbakaus/impeccable (Apache 2.0). See https://github.com/pbakaus/impeccable
---

# Impeccable Design

Create distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics.
Implement real working code with exceptional attention to aesthetic details and creative choices.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "typography", "fonts", "type scale", "font pairing", "heading sizes" | `references/typography.md` |
| "colors", "palette", "dark mode", "light mode", "contrast", "OKLCH" | `references/color-and-contrast.md` |
| "spacing", "layout", "grid", "cards", "visual hierarchy", "container queries" | `references/spatial-design.md` |
| "animation", "motion", "transitions", "easing", "stagger" | `references/motion-design.md` |
| "forms", "focus", "loading", "modals", "dropdowns", "interaction states" | `references/interaction-design.md` |
| "responsive", "mobile", "breakpoints", "fluid design" | `references/responsive-design.md` |
| "copy", "labels", "error messages", "empty states", "button text" | `references/ux-writing.md` |
| "craft", "build feature", "shape then build" | `references/craft.md` |
| "extract", "design system", "tokens", "reusable components" | `references/extract.md` |

## Core Design Principles

### Context Gathering (REQUIRED before any design work)

You MUST have confirmed design context before doing any design work:
- **Target audience**: Who uses this product and in what context?
- **Use cases**: What jobs are they trying to get done?
- **Brand personality/tone**: How should the interface feel?

You cannot infer this by reading the codebase. Code tells you what was built, not who it's for.

### Design Direction

Commit to a BOLD aesthetic direction:
- **Tone**: Pick an extreme — brutally minimal, maximalist, retro-futuristic, organic, luxury, playful, editorial, brutalist, art deco, soft/pastel, industrial, etc.
- **Differentiation**: What makes this UNFORGETTABLE?
- Choose a clear conceptual direction and execute with precision.

### The AI Slop Test

If you showed this interface to someone and said "AI made this," would they believe you immediately? If yes, that's the problem. A distinctive interface should make someone ask "how was this made?"

## Key Anti-Patterns (What NOT to Do)

### Absolute Bans
- **Side-stripe borders**: Never use `border-left` or `border-right` > 1px as accent stripes on cards/alerts
- **Gradient text**: Never use `background-clip: text` with gradients

### Typography
- DO NOT use overused fonts: Inter, Roboto, Arial, Open Sans, DM Sans, Fraunces, Playfair Display, Instrument Sans/Serif, Plus Jakarta Sans, Space Grotesk, etc.
- DO NOT use monospace as lazy shorthand for "technical" vibes
- DO NOT use only one font family for the entire page

### Color
- DO NOT use gray text on colored backgrounds
- DO NOT use pure black (#000) or pure white (#fff) — always tint
- DO NOT use the AI color palette: cyan-on-dark, purple-to-blue gradients, neon accents on dark
- DO NOT default to dark mode with glowing accents

### Layout
- DO NOT wrap everything in cards. Not everything needs a container
- DO NOT nest cards inside cards
- DO NOT use identical card grids (same-sized cards with icon + heading + text, repeated)
- DO NOT center everything — left-aligned with asymmetric layouts feels more designed

### Motion
- DO NOT use bounce or elastic easing — feels dated
- Only animate `transform` and `opacity` — everything else causes layout recalculation

### Visual
- DO NOT use glassmorphism everywhere
- DO NOT use rounded rectangles with generic drop shadows
- DO NOT use modals unless there's truly no better alternative

## Quick Reference

### Typography
- Use OKLCH, not HSL for colors
- Use a modular type scale with fluid sizing (clamp) for headings
- Cap line length at ~65-75ch
- Pair a distinctive display font with a refined body font
- Read `references/typography.md` for full details

### Color
- Tint neutrals toward brand hue (even chroma 0.005-0.01 creates cohesion)
- 60-30-10 rule: 60% neutral, 30% secondary, 10% accent
- Read `references/color-and-contrast.md` for full details

### Spacing
- Use 4pt base spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Use `gap` instead of margins for sibling spacing
- Vary spacing for hierarchy
- Read `references/spatial-design.md` for full details

### Motion
- 100-150ms for instant feedback, 200-300ms for state changes, 300-500ms for layout changes
- Use exponential easing (ease-out-quart/quint/expo)
- Always respect `prefers-reduced-motion`
- Read `references/motion-design.md` for full details

## Implementation Order

1. Structure first (HTML/semantic, no styling)
2. Layout and spacing
3. Typography and color
4. Interactive states (hover, focus, active, disabled)
5. Edge case states (empty, loading, error)
6. Motion (purposeful transitions)
7. Responsive adaptation

## ⚠️ Gotchas

- **Font selection reflex** — Your first instinct font choice is probably from training data defaults. Always reject your first 3 choices and look further.
- **Theme should match context** — Dark/light mode is derived from audience and viewing context, not personal preference.
- **Alpha is a design smell** — Heavy use of transparency usually means an incomplete palette.
- **Cards are overused** — Spacing and alignment create visual grouping naturally without cards.
