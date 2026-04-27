---
id: design-craftsmanship-tokens
name: Design & Craftsmanship Token System
type: pattern
scope: global
status: active
score: 5.0
created: 2026-04-26
updated: 2026-04-27
keywords: design tokens, typography hierarchy, reusable components, anti-AI-slop, craftsmanship
---

# Design & Craftsmanship Tokens

**Pattern:** Centralized tokens for consistent premium design across projects.

## Foundational Tokens

### Color
- Use design tokens (not hardcoded hex)
- Source from `.claude/shared/` design system or project design tokens
- Never use random colors inline

### Typography
- Consistent font families across project
- Modular scale: 12px, 14px, 16px, 18px, 24px, 32px+
- Weight hierarchy: Regular (400), Medium (500), Bold (700)
- Line height: 1.2 (tight), 1.5 (body), 1.6 (relaxed)

### Spacing
- Modular scale base: 8px, 12px, 16px, 24px, 32px, 48px
- Use consistent scale (don't use arbitrary 13px, 15px)
- Grid-based alignment (4px or 8px baseline)

### Shadows
- Depth hierarchy: shadow-sm (cards), shadow-md (modals), shadow-lg (overlays)

### Borders
- Radius consistency: 0px, 4px, 8px, 12px
- Border widths: 1px (default), 2px (strong), 3px (emphasis)

### Animation
- Standard durations: 150ms (fast), 250ms (normal), 350ms (slow)
- Easing: ease-out (entrance), ease-in (exit), ease-in-out (transitions)

## Anti-AI-Slop Checklist

Before shipping:
- [ ] No placeholder text
- [ ] All interactive states present (hover, focus, active, disabled)
- [ ] Color contrast passes WCAG AA (4.5:1 for body text)
- [ ] Complete feedback loop (loading, error, success states)
