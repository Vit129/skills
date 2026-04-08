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
- **Aesthetic Direction** — Tone, typography, color, motion, composition, boundary with frontend-dev. (Read `references/aesthetic-direction.md`)

## Conventions

- Aesthetic direction first → tokens → components (in that order)
- Tokens first: define colors, spacing, typography before building components
- Mobile-first responsive design
- Semantic color names (`--color-primary` not `--blue`)
- Respect accessibility: contrast ratios, focus states, reduced motion

Use this skill for design decisions. Use `frontend-dev` to implement in code.
