# Tech & SaaS Industry Rules (20 Rules)

## Overview
Tech & SaaS products prioritize clarity, efficiency, and data visualization. Users expect fast interactions, predictable patterns, and accessibility.

---

## Recommended Patterns (5 Rules)

### 1. Dashboard-First Layout
- **Pattern**: Data-heavy cards, charts, KPI cards above fold
- **Rationale**: Users need immediate insight into key metrics
- **Best For**: Analytics, project management, monitoring tools
- **Example Structure**:
  ```
  Top: KPI Cards (4 columns, responsive to 2/1)
  Middle: Charts (line, bar, pie)
  Bottom: Data tables with sorting/filtering
  ```
- **Accessibility**: Tables must have proper `<thead>`, semantic markup

### 2. Sidebar Navigation (Primary)
- **Pattern**: Persistent left sidebar, collapsible on mobile
- **Rationale**: SaaS products have 5–20+ features; horizontal nav insufficient
- **Tooltip**: Show labels on hover when collapsed
- **Mobile**: Bottom tab bar or slide-over drawer
- **Current Item**: Highlight with left border, background color

### 3. Modal Dialogs for Settings & Config
- **Pattern**: Modal for non-critical changes (form inputs, selections)
- **Rationale**: Keeps users in context without full-page navigation
- **Anti-pattern**: Don't use modals for confirmation of destructive actions (use page)
- **Focus**: Trap focus inside modal; provide escape hatch
- **Accessibility**: Role="dialog", aria-labelledby, aria-describedby

### 4. Tabbed Interfaces for Related Content
- **Pattern**: Horizontal tabs for feature variations (All, Assigned, Archived, etc.)
- **Rationale**: Reduces cognitive load, keeps users in same view
- **Indicator**: Underline, background, or badge on active tab
- **Keyboard**: Arrow keys to navigate, Enter to activate
- **Mobile**: Scroll horizontally or collapse to dropdown

### 5. Breadcrumb Navigation
- **Pattern**: Root > Parent > Current (always clickable)
- **Rationale**: Users need orientation in deep hierarchies
- **Hidden on Mobile**: Usually hidden; available in menu
- **Current Page**: Not clickable; shows full path
- **Example**: `Dashboard / Reports / Q4 Analytics`

---

## Style Priorities (5 Rules)

### 6. Minimalism & Clarity
- **Priority**: Remove visual noise; emphasize content
- **Colors**: 2–3 colors max; neutral backgrounds
- **Spacing**: Generous whitespace; breathing room
- **Typography**: Clear hierarchy; sans-serif preferred
- **Rationale**: Users scan quickly; visual clarity speeds decision-making

### 7. Professional & Trustworthy
- **Priority**: Convey competence, reliability, security
- **Colors**: Blues, teals, grays (avoid playful pastels)
- **Tone**: Formal, straightforward language
- **Imagery**: Professional photography, abstract illustrations
- **No Gradients**: Use flat colors for clarity

### 8. Flat Design (No Skeuomorphism)
- **Priority**: Digital-native, not mimicking physical objects
- **Shadows**: Subtle elevation shadows only (not drop shadows)
- **Borders**: Minimal; use spacing for separation
- **Icons**: Clean line icons (24px–32px), not filled blobs
- **Animation**: Smooth, 200–300ms transitions

### 9. Dark Mode Support
- **Priority**: Essential for developer tools, monitoring platforms
- **Contrast**: Ensure 4.5:1 on both light & dark
- **Inversion**: Not simple light↔dark swap; adjust hue, saturation
- **Background**: Dark gray (#1a1a1a–#2a2a2a), not pure black
- **Implementation**: CSS custom properties, prefers-color-scheme

### 10. Dense Information Display
- **Priority**: Show more data per screen without clutter
- **Padding**: Compact spacing (8px, not 16px) in tables & lists
- **Font Size**: 12–13px for body, 14px for inputs
- **Icons**: Use instead of text labels to save space
- **Rationale**: Power users prefer density; casual users prefer spacious UI

---

## Color Moods (3 Rules)

### 11. Trust & Stability (Blues)
- **Primary**: #2563eb, #0ea5e9, #0284c7
- **Psychology**: Conveys trust, security, professionalism
- **Use Cases**: Primary CTA, headers, trusted sections
- **Avoid**: Bright, vibrant blues (feels less professional)

### 12. Growth & Success (Greens)
- **Accent**: #10b981, #16a34a, #059669
- **Psychology**: Progress, achievement, positive outcomes
- **Use Cases**: Success messages, growth metrics, positive indicators
- **Example**: "Revenue Up 12%" in green

### 13. Caution & Urgency (Reds/Oranges)
- **Alert**: #ef4444, #f97316, #dc2626
- **Psychology**: Danger, error, immediate attention needed
- **Use Cases**: Error messages, destructive actions, warnings
- **Contrast**: Must meet 4.5:1 on white background

---

## Typography Personality (4 Rules)

### 14. Sans-Serif + Monospace Combination
- **Headline**: Inter, Source Sans Pro, or Roboto (clean, modern)
- **Body**: Same sans-serif for consistency
- **Code**: JetBrains Mono, Fira Code, or Monaco (monospace)
- **Rationale**: Matches tech aesthetic; monospace signals "code"

### 15. Clear Hierarchy
- **h1**: 28–32px, bold (700), title of page
- **h2**: 20–24px, bold (700), section headers
- **h3**: 16–18px, bold (600), subsections
- **Body**: 14–16px, regular (400), max 75 characters per line
- **Caption**: 12px, regular (400), for metadata, timestamps

### 16. Readability Over Personality
- **Priority**: Speed of comprehension > Brand expression
- **Letter Spacing**: +0.5px for body text (not condensed)
- **Line Height**: 1.6 for body, 1.3 for headings
- **Contrast**: 4.5:1 minimum (WCAG AA)
- **No Decorative Fonts**: Avoid handwriting, display fonts in body

### 17. Consistent Font Weights
- **Light (300)**: Not used (too faint)
- **Regular (400)**: Body, navigation, default state
- **Medium (500)**: Labels, buttons, slightly emphasized
- **Bold (700)**: Headers, highlights, strong emphasis
- **Black (900)**: Rarely used; avoid

---

## Key Effects (2 Rules)

### 18. Smooth Transitions on Interaction
- **Duration**: 150–200ms for quick feedback (hover, focus)
- **Easing**: ease-out for enter, ease-in for exit
- **Property**: Apply to color, background-color, transform (avoid width/height)
- **Hover**: Button color change, subtle scale (transform: scale(1.02))
- **Focus**: Outline (3px solid, 4:1 contrast), no outline removal

### 19. Loading States & Skeletons
- **Loading Spinner**: SVG or CSS animation, 200ms rotation
- **Skeleton Screens**: Use exact layout of content; match height, width
- **Transition**: Fade skeleton out, content fade in
- **Duration**: Skeleton shows 200–500ms minimum (avoids flash)
- **No Loading Text**: Prefer visual spinner + skeleton

---

## Anti-Patterns (2 Rules)

### 20. What to Avoid in Tech & SaaS

❌ **Excessive Animations**: Auto-play videos, scroll triggers, parallax
- **Why**: Distracts from data, slows down performance
- **Instead**: Static content, animation on user interaction

❌ **Playful, Casual Tone**
- **Why**: Doesn't match professional context
- **Example**: Don't use playful illustrations or puns in error messages
- **Instead**: Direct, helpful language ("Check your connection" not "Oops!")

❌ **Auto-Save Without Indication**
- **Why**: Users don't know if changes are persisted
- **Instead**: Show save status ("Saving..." → "✓ Saved")

❌ **Truncated Data Without Tooltip**
- **Why**: Users miss critical information
- **Instead**: Title attribute or hover popover

❌ **Poor Keyboard Navigation**
- **Why**: Power users expect keyboard shortcuts (Cmd+K for search, J/K for navigation)
- **Instead**: Implement accessible keyboard navigation, document shortcuts

---

*Last Updated: 2026-04-16*
*Rules Count: 20*
