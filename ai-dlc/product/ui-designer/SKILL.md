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

- **Design System** — Aesthetic direction, industry rules, colors, typography, spacing, layout, animation, accessibility, pre-delivery checklist. (Read `references/design-system.md`)
- **Sovereign DS** — Project-specific rules for My Investment Port. (Read `references/sovereign-ds.md`)

## Workflow (Always in This Order)

1. **Phase 0** — Detect existing design system (see below)
2. **Aesthetic Direction** — Commit to tone, differentiation, font + color direction
3. **Industry Rules** — Match product type → style → color mood → anti-patterns
4. **Tokens** — Define colors, spacing, typography as CSS variables
5. **Components** — Build from primitives up

Use this skill for design decisions. Use `frontend-dev` to implement in code.

## Phase 0: Existing Design System Detection (MANDATORY)

ก่อนเริ่มออกแบบ ต้องตรวจว่ามี design system อยู่แล้วหรือไม่:

| สิ่งที่พบ | Action |
|---------|--------|
| Figma URL มีอยู่แล้ว | Analyze existing design system → extract tokens, components, patterns → extend ไม่ใช่สร้างใหม่ |
| Design tokens file มีอยู่แล้ว (CSS vars, Tailwind config) | Import existing tokens → align ไม่ใช่ override |
| Component library มีอยู่แล้ว (MUI, Ant Design, shadcn/ui, etc.) | Document existing components → extend ด้วย custom tokens |
| ไม่มีอะไรเลย | สร้างใหม่ตาม design-system.md |

**ถาม user ก่อนเสมอ:**
> "มี design system หรือ Figma อยู่แล้วไหม? ถ้ามี ส่ง link หรือ file มาได้เลย"

## Stack Detection

ระบุ stack ก่อน generate code หรือ spec:

| Stack | Notes |
|---|---|
| React / Next.js | Use Tailwind + CSS vars; shadcn/ui if applicable |
| Vue / Nuxt | Same token approach, adapt class syntax |
| Flutter | Use ThemeData tokens, Material 3 |
| SwiftUI | Use Color assets + ViewModifier |
| HTML + Tailwind | Default if unspecified |

## Design System Generator Output Format

เมื่อ generate design system ให้ output ในรูปแบบนี้:

```
TARGET: [Project Name] — RECOMMENDED DESIGN SYSTEM
─────────────────────────────────────────────────
PATTERN:   [Landing page / app structure]
STYLE:     [UI style name + keywords]
COLORS:    Primary / Secondary / CTA / Background / Text
TYPOGRAPHY: [Display font] / [Body font]
KEY EFFECTS: [Animations, interactions]
AVOID:     [Anti-patterns for this industry]
─────────────────────────────────────────────────
PRE-DELIVERY CHECKLIST: (from design-system.md)
```

## Conventions

- Aesthetic direction first → tokens → components (always in this order)
- Semantic color names (`--color-primary` not `--blue`)
- Mobile-first responsive design
- Respect accessibility: contrast ratios, focus states, reduced motion
- No emojis as icons — use SVG (Heroicons, Lucide)
