# Sovereign Design System

The visual language for "My Investment Port" — focusing on high-end finance with glassmorphism and deep dark aesthetics.

## Aesthetics

- **Dark Mode Only:** Deep charcoal/black backgrounds (`#0a0a0a` to `#121212`)
- **Glassmorphism:** Layered transparencies with backdrop-blur
- **Accent Colors:** Teal/Cyan for performance, Emerald for gains, Rose for losses, Amber for alerts
- **Atmosphere:** Subtle gradients, noise textures, and sharp card borders

## Component Library (`src/components/`)

- `ui/` — Button, Input, Badge, Select, Icons, Pagination, ProgressBar, TickerBadge
- `layout/` — SovereignCard, MetricCard, CardHeader, PageHeader
- `charts/` — ChartCanvas (Chart.js wrapper)
- `forms/` — CrudForm, ActionButtons
- `modals/` — ConfirmDialog

## Styling Rules

- **Inline Styles + Tokens:** ใช้ `style={{ color: COLORS.X, fontSize: TYPOGRAPHY.Y }}` — ไม่ใช้ Tailwind utility classes
- **Color Tokens:** ต้องมาจาก `src/data/config/colors.js` เสมอ ห้าม hardcode hex
- **Typography Tokens:** ต้องมาจาก `src/data/config/typography.js` เสมอ
- **Reuse First:** Never create a primitive UI element if one exists in `src/components/`
- **data-testid:** ทุก interactive element และ container หลักต้องมี `data-testid` เพื่อ QA Playwright

## Glassmorphism Pattern

```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```
