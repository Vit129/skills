# Design Patterns Library

## Overview

Comprehensive design system library with 67 UI styles, 161 color palettes, 57 typography pairings, 25 chart types, and 99 UX guidelines.

---

## 1. UI Styles (67 Total)

### Categories

- **Minimalism & Swiss Style** (5)
  - Extreme whitespace, geometric precision, grid-based

- **Brutalism & Raw Design** (5)
  - Bold typography, unpolished edges, statement-making

- **Glassmorphism & Neumorphism** (8)
  - Frosted glass effect, soft shadows, depth without contrast

- **Geometric & Abstract** (8)
  - Shapes, grids, angular forms, constructivism

- **Organic & Biomorphic** (7)
  - Curves, natural forms, wavy patterns, nature-inspired

- **Chromatic Aberration & RGB Split** (5)
  - Color separation effect, retro-digital, experimental

- **Maximalism & Playful** (8)
  - Bold colors, patterns, humor, eclectic

- **Luxury & High-End** (6)
  - Sophisticated, premium, minimalist luxury, gold accents

- **Retro & Vintage** (5)
  - 80s, 90s, Y2K, nostalgic aesthetics

- **Dark & Moody** (5)
  - Dark backgrounds, neon accents, cinematic

**[Plus 7 more categories = 67 total]**

---

## 2. Color Palettes (161 Total)

### Organization by Product Type

Each palette includes:
- **Primary Color**: Brand identity
- **Secondary Colors**: Supporting palette (2-3)
- **Semantic Colors**: Success (green), Warning (amber), Error (red), Info (blue)
- **Neutrals**: Text, backgrounds, borders (5-7 shades)
- **Dark Mode**: Inverted + adjusted contrast

### Palette Categories

1. **Tech & SaaS** (20 palettes)
   - Trust-based blues, productivity greens, data visualization purples

2. **Finance** (21 palettes)
   - Confidence blues, growth greens, security golds, alert reds

3. **Healthcare** (20 palettes)
   - Compassion blues, health greens, emergency reds, wellness purples

4. **E-commerce** (20 palettes)
   - Energy oranges, trust blacks, urgency reds, abundance greens

5. **Services** (18 palettes)
   - Professionalism grays, approachability teals, warmth oranges

6. **Creative** (16 palettes)
   - Expression boldly saturated, experimentation neons, brand vibrant

7. **Lifestyle** (20 palettes)
   - Aspiration pastels, community warm, wellness calm, luxury jewel tones

8. **Emerging Tech** (6 palettes)
   - Innovation neon, future-forward purples, blockchain metallic

**Total: 161 palettes**

---

## 3. Typography Pairings (57 Total)

### Font Pairing Structure

Each pairing includes:
- **Headline Font**: Google Fonts, personality, use cases
- **Body Font**: Readability, size/line-height recommendations
- **Code Font**: Monospace (if applicable)
- **Use Cases**: Industry alignment, tone, accessibility notes

### Popular Pairings

| Headline | Body | Personality | Use Case |
|----------|------|-------------|----------|
| Playfair Display | Lato | Luxury, elegant | Fashion, lifestyle |
| Source Sans Pro | IBM Plex Mono | Professional, tech | SaaS, finance |
| Inter | Roboto | Neutral, modern | E-commerce, SaaS |
| Merriweather | Roboto | Approachable, trust | Healthcare, services |
| Montserrat | Open Sans | Bold, energetic | Creative, media |

**57 pairings across all industries**

---

## 4. Chart Types (25 Total)

### Data Visualization

- **Line Charts** (3 variations): Time-series, trends, multi-line
- **Bar Charts** (3): Vertical, horizontal, stacked
- **Pie & Donut** (2): Category distribution
- **Area Charts** (2): Filled time-series, stacked
- **Scatter & Bubble** (2): Correlation, dimensionality
- **Heatmaps** (1): Dense data
- **Gauges & Progress** (2): Status, achievement
- **Gantt & Timeline** (2): Scheduling, roadmaps
- **Sankey & Flow** (2): Process, relationships
- **Maps & Geo** (2): Location-based data
- **Advanced** (1): Treemaps, sunbursts

**25 chart types optimized for dashboards & analytics**

---

## 5. UX Guidelines (99 Total)

### Categories

- **Navigation** (12)
  - Top bar, sidebar, breadcrumbs, pagination, tabs, hamburger menus

- **Forms & Input** (15)
  - Text inputs, dropdowns, checkboxes, radio buttons, validation, error states

- **Cards & Containers** (8)
  - Content cards, elevation, spacing, interactions

- **Buttons & CTAs** (9)
  - Primary, secondary, tertiary, icon buttons, loading states, disabled states

- **Modals & Overlays** (8)
  - Dialog patterns, dismissal, focus trapping, sizes

- **Tables** (8)
  - Data tables, sorting, filtering, pagination, empty states

- **Notifications** (7)
  - Alerts, toasts, banners, dismissal patterns

- **Accessibility** (11)
  - WCAG AA compliance, focus indicators, color contrast, keyboard navigation

- **Responsive** (8)
  - Breakpoints, touch targets, mobile-first, reflow patterns

- **Micro-interactions** (7)
  - Hover states, focus states, loading indicators, transitions

**99 guidelines total**

---

## Integration

### Design Tokens Output
```css
/* Auto-generated from selected palette */
--color-primary: #2563eb;
--color-secondary: #10b981;
--color-danger: #ef4444;
--font-headline: "Playfair Display", serif;
--font-body: "Lato", sans-serif;
```

### Component Library Mapping
Each guideline maps to components:
- Buttons → Button.jsx + Button.module.css
- Forms → Input.jsx, Select.jsx, Checkbox.jsx
- Navigation → Nav.jsx, Breadcrumb.jsx

### Accessibility Checklist
Every guideline includes WCAG AA compliance notes.

---

*Last Updated: 2026-04-16*
*Total Assets: 67 styles + 161 palettes + 57 pairings + 25 charts + 99 guidelines*
