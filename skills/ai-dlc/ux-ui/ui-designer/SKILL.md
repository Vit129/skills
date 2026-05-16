---
name: ui-designer
description: >
  Use this skill when the user asks to "design the UI", "ออกแบบ UI",
  "create a design system", "สร้าง design system",
  "generate design rules for my product", "สร้าง design rules สำหรับ product",
  "pick colors and typography", "เลือกสีและ typography",
  "set up spacing and layout", "ตั้งค่า spacing และ layout",
  "add animations", "เพิ่ม animation", "define design tokens", "กำหนด design tokens",
  "make it look distinctive", "ทำให้ดูโดดเด่น", "avoid generic design", "หลีกเลี่ยง generic design",
  "pick an aesthetic direction", "เลือก aesthetic direction",
  "recommend colors for my industry", "แนะนำสีสำหรับ industry ของฉัน",
  "validate design against best practices", "ตรวจสอบ design",
  or needs UX/UI design guidance for building consistent, scalable, visually memorable interfaces.
  Use this for DESIGN DECISIONS (what to build), not implementation (how to code it).
  Covers both aesthetic direction and industry-validated patterns across 8 sectors.
---

# UI Designer

Build consistent, polished, and distinctive interfaces for any project — from aesthetic direction to industry-validated design systems.

## Core Capabilities

| Capability | Count | Use Case |
|-----------|-------|----------|
| **Industry Rules** | 161 | Domain-specific patterns (finance ≠ e-commerce) |
| **UI Styles** | 67 | Visual approaches (minimalism, brutalism, glassmorphism, etc.) |
| **Color Palettes** | 161 | Psychology-backed, industry-aligned colors |
| **Font Pairings** | 57 | Google Fonts, accessibility-tested combinations |
| **Chart Types** | 25 | Data visualization for dashboards & analytics |
| **UX Guidelines** | 99 | Detailed interactive patterns |
| **Tech Stacks** | 15 | Web, mobile, native platform guidance |

## Workflow (Always in This Order)

1. **Phase 0** — Detect existing design system (see below)
2. **Identify Industry** — SaaS, Finance, Healthcare, E-commerce, Services, Creative, Lifestyle, Emerging Tech
3. **Run Reasoning Engine** — 4-stage analysis (search → match → generate → validate)
4. **Aesthetic Direction** — Commit to tone, differentiation, font + color direction
5. **Apply Industry Rules** — Match product type → style → color mood → anti-patterns
6. **Tokens** — Define colors, spacing, typography as CSS variables
7. **Components** — Build from primitives up
8. **Validate** — WCAG AA accessibility, responsive breakpoints, dark mode

Use this skill for design decisions. Use `frontend-dev` to implement in code.

## Phase 0: Existing Design System Detection (MANDATORY)

Before designing, check if a design system already exists:

| Found | Action |
|-------|--------|
| Figma URL exists | Analyze existing design system → extract tokens, components, patterns → extend, don't rebuild |
| Design tokens file exists (CSS vars, Tailwind config) | Import existing tokens → align, don't override |
| Component library exists (MUI, Ant Design, shadcn/ui, etc.) | Document existing components → extend with custom tokens |
| Nothing exists | Build new following industry rules + reasoning engine |

**Always ask the user first:**
> "Do you have an existing design system or Figma file? If so, share the link or file."

## Stack Detection

Identify stack before generating code or spec:

| Stack | Notes |
|-------|-------|
| React / Next.js | Use Tailwind + CSS vars; shadcn/ui if applicable |
| Vue / Nuxt | Same token approach, adapt class syntax |
| Flutter | Use ThemeData tokens, Material 3 |
| SwiftUI | Use Color assets + ViewModifier |
| HTML + Tailwind | Default if unspecified |

Full stack guidance → `references/tech-stacks.md`

## Output Format

When generating a design system, output in this format:

```
TARGET: [Project Name] — RECOMMENDED DESIGN SYSTEM
─────────────────────────────────────────────────
INDUSTRY:  [Sector]
PATTERN:   [Landing page / app structure]
STYLE:     [UI style name + keywords]
COLORS:    Primary / Secondary / CTA / Background / Text
TYPOGRAPHY: [Display font] / [Body font]
KEY EFFECTS: [Animations, interactions]
AVOID:     [Anti-patterns for this industry]
─────────────────────────────────────────────────
PRE-DELIVERY CHECKLIST:
□ WCAG AA contrast ratios
□ Responsive breakpoints (320 / 768 / 1024px)
□ Touch targets 44px+
□ Dark mode tokens
□ Focus states & keyboard navigation
```

## Conventions

- Aesthetic direction first → tokens → components (always in this order)
- Semantic color names (`--color-primary` not `--blue`)
- Mobile-first responsive design
- Respect accessibility: contrast ratios, focus states, reduced motion
- No emojis as icons — use SVG (Heroicons, Lucide)

## References

| Task | Read |
|------|------|
| Building a design system from scratch | `references/reasoning-engine/four-stage-process.md` |
| Finance, banking, investment products | `ai-dlc/rules/industry-rules/references/finance.md` |
| Healthcare, medical, telemedicine | `ai-dlc/rules/industry-rules/references/healthcare.md` |
| SaaS, dashboards, analytics | `ai-dlc/rules/industry-rules/references/tech-saas.md` |
| E-commerce, retail, marketplaces | `ai-dlc/rules/industry-rules/references/ecommerce.md` |
| Color palette options | `references/design-patterns/colors-index.md` |
| Full design patterns library | `references/design-patterns/overview.md` |
| Tech stack guidance | `references/tech-stacks.md` |
| Figma integration | `references/figma.md` |


---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "I'll skip Phase 0 (existing design system detection) — this is a new project" | Even "new" projects may have a Tailwind config, shadcn/ui setup, or MUI installation. Skipping Phase 0 means you might rebuild what already exists or create conflicting token systems. |
| "I don't need to identify the industry — good design is universal" | The skill has 161 industry-specific rules because finance ≠ e-commerce ≠ healthcare. A playful e-commerce palette on a banking app destroys user trust. Industry context is mandatory. |
| "I'll pick colors based on what looks good to me" | Color selection must be psychology-backed and industry-aligned (161 palettes exist for this reason). Personal preference without validation against industry norms creates inconsistency. |
| "I'll generate the design system without asking about existing Figma/tokens" | The skill explicitly requires asking: "Do you have an existing design system or Figma file?" Skipping this question risks overwriting established design decisions the team already made. |
| "WCAG AA compliance can be checked at the end" | The pre-delivery checklist includes WCAG AA contrast ratios as a hard requirement. Designing first and checking contrast last means redesigning colors when they fail — check during selection. |

---

## Red Flags

- 🚩 Design system output has no industry identification → Reasoning engine was skipped; identify the sector (SaaS/Finance/Healthcare/etc.) before generating tokens.
- 🚩 Color tokens use hex values like `#000` or `#fff` → Pure black/white violates impeccable-design principles; always tint neutrals toward brand hue.
- 🚩 No stack detection performed before generating code → Output may use wrong syntax (Tailwind vs ThemeData vs SwiftUI); identify the tech stack first.
- 🚩 Agent jumped to component design without defining tokens first → Workflow order violated (aesthetic direction → tokens → components); go back and define tokens.
- 🚩 Pre-delivery checklist items unchecked (WCAG, responsive, touch targets, dark mode, focus states) → Design is incomplete; validate all checklist items before declaring done.

---

## Verification

Before declaring design system complete, confirm:

- [ ] Industry identified (SaaS/Finance/Healthcare/etc.)
- [ ] Existing design system checked (Phase 0)
- [ ] Tech stack detected (Tailwind/ThemeData/SwiftUI)
- [ ] Color tokens defined (no pure #000/#fff)
- [ ] WCAG AA contrast ratios validated
- [ ] Pre-delivery checklist passed (responsive, touch targets, dark mode, focus states)
- [ ] Tokens defined BEFORE component design started
