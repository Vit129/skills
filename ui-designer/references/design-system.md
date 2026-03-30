# Design System

Principles for building consistent, scalable UI across any project.

## Color

- Define all colors as CSS custom properties in `:root` — never hardcode hex in components
- Use semantic names: `--color-primary`, `--color-danger`, `--color-muted` — not `--blue`, `--red`
- Provide dimmed variants for backgrounds: `rgba(primary, 0.15)`
- Support both light and dark themes via separate variable sets or `prefers-color-scheme`

## Typography

- Use a type scale with consistent ratios (e.g., 1.25 major third):
  - xs: 12px, sm: 14px, base: 16px, lg: 20px, xl: 24px, 2xl: 32px
- Limit to 2 font families max (one for headings, one for body)
- Line height: 1.4-1.6 for body text, 1.1-1.2 for headings
- For Thai content: use fonts with Thai support (Sarabun, Noto Sans Thai, IBM Plex Sans Thai)

## Spacing

- Use a consistent spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px
- Apply spacing via utility classes or design tokens — not arbitrary values
- Padding inside components, margin between components

## Layout

- Mobile-first: default styles for mobile, `min-width` breakpoints for larger screens
- Common breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Use CSS Grid for page layout, Flexbox for component layout
- Max content width: 1280px with auto margins for centering

## Components

- Build from smallest to largest: tokens → primitives → components → patterns → pages
- Every component should work in isolation — no implicit dependencies on parent styles
- Use consistent border-radius scale: sm (4px), md (8px), lg (12px), full (9999px)
- Shadows: subtle for cards (0 1px 3px), elevated for modals (0 4px 12px)

## Animation

- Keep animations subtle and purposeful — never decorative-only
- Duration: micro-interactions 150-200ms, transitions 300-400ms, emphasis 500ms+
- Easing: `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for state changes
- Respect `prefers-reduced-motion` — disable non-essential animations

## Glassmorphism (when applicable)

```css
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 12px;
}
```

## Accessibility

- Color contrast: minimum 4.5:1 for normal text, 3:1 for large text (WCAG AA)
- Don't rely on color alone — use icons, text, or patterns alongside color
- Focus states: visible outline on all interactive elements
- Touch targets: minimum 44×44px on mobile

## Tips

- Start with tokens (colors, spacing, typography) before building components
- Document decisions — "why this color?" matters more than "what color?"
- Test on real devices — not just browser resize
- Prefer utility-first CSS (Tailwind) for rapid iteration, extract components when patterns repeat 3+ times
