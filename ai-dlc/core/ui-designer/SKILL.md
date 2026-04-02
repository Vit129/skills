---
name: ui-designer
description: >
  This skill should be used when the user asks to "design the UI", "create a design system",
  "pick colors and typography", "set up spacing and layout", "add animations", "define design tokens",
  "make it look distinctive", "avoid generic design", "pick an aesthetic direction",
  or needs UX/UI design guidance for building consistent, scalable, visually memorable interfaces.
  Use this for DESIGN DECISIONS (what to build), not implementation (how to code it).
---

# UI Designer

Build consistent, polished, and distinctive interfaces for any project.

- **Design System** — Colors, typography, spacing, layout, animation, accessibility. (Read `references/design-system.md`)
- **Sovereign DS** — Project-specific rules for My Investment Port. (Read `references/sovereign-ds.md`)

## Step 0 — Aesthetic Direction (before tokens)

Before defining any token, commit to a clear aesthetic direction. Ask:

- **Purpose** — What problem does this interface solve? Who uses it?
- **Tone** — Pick one and commit: brutally minimal / maximalist / retro-futuristic / luxury / editorial / playful / brutalist / art deco / soft/pastel / industrial. Intentionality beats intensity.
- **Differentiation** — What's the one thing a user will remember about this UI?

**Typography** — Choose fonts that match the tone. Avoid generic defaults (Inter, Roboto, Arial, system-ui). Pair a distinctive display font with a refined body font.

**Color** — Dominant color with sharp accent outperforms timid, evenly-distributed palettes. Commit to a cohesive theme. Use CSS variables for consistency.

**Motion** — One well-orchestrated entrance (staggered reveal, scroll-trigger) creates more delight than scattered micro-interactions. Use animation purposefully.

**Composition** — Consider asymmetry, overlap, diagonal flow, grid-breaking elements, generous negative space, or controlled density. Avoid predictable centered-everything layouts.

**Atmosphere** — Gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows — add depth that matches the tone. Never default to plain solid backgrounds unless minimalism is the intent.

## Boundary with `frontend-dev`

> Use **this skill** for design decisions — tokens, visual language, component spec, accessibility rules.
> Use **`frontend-dev`** to implement those decisions in React, Tailwind, Flutter, or native code.

| This skill (ui-designer) | frontend-dev skill |
|--------------------------|--------------------|
| Define `--color-primary` token | Apply `text-primary` in React/Tailwind |
| Spec spacing scale (4/8/16/24px) | Implement `p-4`, `gap-6` in component |
| Define animation easing curve | Write `transition-all duration-200` in code |
| Spec tone: "luxury, high contrast" | Execute in actual component code |
| Accessibility: contrast ratio rule | Implement `aria-label`, `focus-visible` in JSX |

## Conventions
- Aesthetic direction first → tokens → components (in that order)
- Tokens first: define colors, spacing, typography before building components
- Mobile-first responsive design
- Semantic color names, not literal (`--color-primary` not `--blue`)
- Respect accessibility: contrast ratios, focus states, reduced motion
- No two designs should look the same — vary theme, font, layout per project
