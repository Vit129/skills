---
name: Design & Craftsmanship Token System
description: Foundational design tokens and premium standards for consistent UI/code quality
type: lesson
scope: global
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
- Depth hierarchy:
  - shadow-sm: small, subtle (cards)
  - shadow-md: medium (modals, dropdowns)
  - shadow-lg: large (overlays, popovers)

### Borders
- Radius consistency: 0px, 4px, 8px, 12px (not random 5px, 6px)
- Border widths: 1px (default), 2px (strong), 3px (emphasis)

### Animation
- Standard durations: 150ms (fast), 250ms (normal), 350ms (slow)
- Easing: ease-out (entrance), ease-in (exit), ease-in-out (transitions)

## Typography Hierarchy

| Level | Use Case | Typical Size |
|-------|----------|--------------|
| Display | Page titles, hero text | 32px+ |
| Heading | Section titles | 24px |
| Subheading | Subsection titles | 18px |
| Body | Main content, paragraphs | 16px |
| Label | Form labels, captions | 14px |
| Caption | Metadata, hints, help text | 12px |

**Never skip levels** — jump straight from Heading to Body, not through all sizes.

## Reusable Components

- Extract patterns after appearing 2x (not 3x)
- Props-based customization (size, variant, disabled state)
- Built-in accessibility (ARIA labels, semantic HTML, keyboard nav)
- Dark mode support from day 1 (use CSS vars, not hardcoded colors)
- Separate concerns: styling from logic, layout from content

## Anti-AI-Slop Checklist

Before shipping:
- [ ] No placeholder text ("Click here", "Submit", "OK")
- [ ] No orphaned UI (every button/control has clear purpose)
- [ ] No inconsistent spacing (grid/flex alignment)
- [ ] All interactive states present (hover, focus, active, disabled)
- [ ] Color contrast passes WCAG AA (4.5:1 for body text)
- [ ] Text readable (min 14px for body, 12px for captions)
- [ ] Whitespace intentional (breathing room, not cramped)
- [ ] Complete feedback loop (loading, error, success states)

## Code Craftsmanship

**Naming:** Clear, pronounceable, intent-revealing
- Good: `isLoading`, `submitButton`, `userAuthentication`
- Bad: `temp`, `data`, `thing`, `x`, `doStuff`

**Function Length:** Single responsibility, <20 lines when possible
- Each function = one reason to change
- Extract helpers for repeated patterns
- Avoid deeply nested logic (3+ levels = extract function)

**Comments:** Why, not what
- Bad: `// increment counter` (code already shows this)
- Good: `// pause polling during user input to avoid race conditions`

**DRY Principle:** Extract after 2 occurrences
- 1st time: let it be
- 2nd time: still might be coincidence
- 3rd time: extract to helper/utility

**Testing:** Arrange-Act-Assert pattern
```javascript
// Arrange: set up test data
const user = createUser({ name: 'Alice' });

// Act: perform the action
const result = calculateAge(user);

// Assert: verify the outcome
expect(result).toBe(25);
```

**Performance:** Measure, then optimize
- Profile first (don't guess)
- Measure improvement (before/after)
- Document the trade-off (why this approach)
