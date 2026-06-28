---
name: ui-designer
description: >
  Use when: design UI, ออกแบบ UI, create design system, make it look better, polish UI,
  audit design, improve colors, fix typography, add animations, avoid generic design,
  recommend colors for industry, build landing page, define design tokens.
  Covers design decisions (what to build) AND implementation quality (how it looks/feels).
  Industry-validated patterns (8 sectors) + pbakaus/impeccable anti-slop principles.
credit: >
  Inspired by impeccable (https://github.com/pbakaus/impeccable) by Paul Bakaus
  and UI-UX Pro skill (https://github.com/saifyxpro/ui-ux-design-pro-skill) by saifyxpro
  — merged and adapted into our own design system workflow
version: 2.0.0
last_improved: 2026-06-01
improvement_count: 1
---

# UI Designer

Design and implement distinctive, production-grade interfaces — from aesthetic direction to pixel-perfect code that doesn't look like "AI slop."

## AIDLC Gate

⚠️ If this skill is triggered as part of a coding/QA task:
- AIDLC governance MUST be active (`agent-memory/plans/[feature]/` must exist with DECISIONS + PLAN)
- If not → STOP and route to `governance/aidlc/` first
- Exception: pure investigation/analysis (no code changes) can proceed without AIDLC

## Core Capabilities

| Capability | Count | Use Case |
| ---------- | ----- | -------- |
| **Industry Rules** | 161 | Domain-specific patterns (finance ≠ e-commerce) |
| **UI Styles** | 67 | Visual approaches (minimalism, brutalism, etc.) |
| **Color Palettes** | 161 | Psychology-backed, industry-aligned colors |
| **Font Pairings** | 57 | Google Fonts, accessibility-tested combinations |
| **Chart Types** | 25 | Data visualization for dashboards & analytics |
| **UX Guidelines** | 99 | Detailed interactive patterns |
| **Anti-Patterns** | 24+ | Explicit bans to avoid generic AI aesthetics |
| **Slash Commands** | 17 | Targeted design operations (audit, polish, critique, etc.) |

## Two Modes

| Mode | Trigger | Output |
| ---- | ------- | ------ |
| **Design** | "ออกแบบ", "design system", "pick colors", "industry rules" | Design spec, tokens, system rules |
| **Implement** | "polish", "make it look better", "build this UI", "audit" | Working code with high aesthetic quality |

Both modes share the same principles and anti-patterns.

## Workflow

### Design Mode (spec → tokens → components)

1. **Phase 0** — Detect existing design system
2. **Identify Industry** — SaaS, Finance, Healthcare, E-commerce, Services, Creative, Lifestyle, Emerging Tech
3. **Context Gathering** — Audience, use cases, brand personality/tone
4. **Aesthetic Direction** — Commit to BOLD tone + differentiation
5. **Run Reasoning Engine** — 4-stage analysis (search → match → generate → validate)
6. **Apply Industry Rules** — Match product type → style → color mood → anti-patterns
7. **Tokens** — Define colors, spacing, typography as CSS variables
8. **Validate** — AI Slop Test + WCAG AA + responsive + dark mode

### Implement Mode (structure → polish)

1. Structure first (HTML/semantic, no styling)
2. Layout and spacing
3. Typography and color
4. Interactive states (hover, focus, active, disabled)
5. Edge case states (empty, loading, error)
6. Motion (purposeful transitions)
7. Responsive adaptation
8. **AI Slop Test** — would someone immediately say "AI made this"? If yes, redo.

## Phase 0: Existing Design System Detection (MANDATORY)

Before designing, check if a design system already exists:

| Found | Action |
| ----- | ------ |
| Figma URL exists | Analyze → extract tokens, components → extend, don't rebuild |
| Design tokens file exists (CSS vars, Tailwind config) | Import existing → align, don't override |
| Component library exists (MUI, Ant Design, shadcn/ui) | Document existing → extend with custom tokens |
| Nothing exists | Build new following industry rules + reasoning engine |

**Always ask:** "Do you have an existing design system or Figma file?"

## Context Gathering (REQUIRED)

You MUST have confirmed design context before any design work:
- **Target audience**: Who uses this product and in what context?
- **Use cases**: What jobs are they trying to get done?
- **Brand personality/tone**: How should the interface feel?

You cannot infer this by reading the codebase. Code tells you what was built, not who it's for.

## The AI Slop Test

If you showed this interface to someone and said "AI made this," would they believe you immediately? If yes, that's the problem. A distinctive interface should make someone ask "how was this made?"

## Anti-Patterns (Hard Bans)

### Typography
- ❌ Overused fonts: Inter, Roboto, Arial, Open Sans, DM Sans, Fraunces, Playfair Display, Instrument Sans/Serif, Plus Jakarta Sans, Space Grotesk
- ❌ Monospace as lazy shorthand for "technical" vibes
- ❌ Only one font family for the entire page
- ✅ Reject your first 3 font instincts — they're from training data

### Color
- ❌ Pure black (#000) or pure white (#fff) — always tint neutrals toward brand hue
- ❌ Gray text on colored backgrounds
- ❌ The AI color palette: cyan-on-dark, purple-to-blue gradients, neon accents on dark
- ❌ Default to dark mode with glowing accents
- ❌ Heavy `rgba()` / alpha transparency (design smell = incomplete palette)
- ✅ Use OKLCH, not HSL
- ✅ 60-30-10 rule: 60% neutral, 30% secondary, 10% accent
- ✅ Tint neutrals toward brand hue (chroma 0.005-0.01)

### Layout
- ❌ Wrap everything in cards — not everything needs a container
- ❌ Nest cards inside cards
- ❌ Identical card grids (same-sized cards with icon + heading + text, repeated)
- ❌ Center everything — left-aligned with asymmetric layouts feels more designed
- ✅ Use `gap` instead of margins for sibling spacing
- ✅ 4pt base spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px

### Motion
- ❌ Bounce or elastic easing — feels dated
- ❌ Animate anything except `transform` and `opacity`
- ✅ Exponential easing (ease-out-quart/quint/expo)
- ✅ 100-150ms feedback, 200-300ms state changes, 300-500ms layout changes
- ✅ Always respect `prefers-reduced-motion`

### Visual
- ❌ Glassmorphism everywhere
- ❌ Rounded rectangles with generic drop shadows
- ❌ Modals unless truly no better alternative
- ❌ Side-stripe borders (`border-left` > 1px as accent)
- ❌ Gradient text (`background-clip: text` with gradients)
- ❌ Emojis as icons — use SVG (Heroicons, Lucide)

## Slash Commands (Implement Mode)

| Command | Purpose |
| ------- | ------- |
| `/audit` | Comprehensive quality check (accessibility, performance, anti-patterns) |
| `/critique` | UX evaluation with actionable feedback |
| `/polish` | Final pass — alignment, spacing, consistency, detail |
| `/normalize` | Align with design system standards |
| `/distill` | Strip to essence, remove unnecessary complexity |
| `/clarify` | Improve UX copy, error messages, labels |
| `/optimize` | Performance (loading, rendering, animations, bundle) |
| `/harden` | Resilience (error handling, i18n, overflow, edge cases) |
| `/animate` | Add purposeful motion and micro-interactions |
| `/colorize` | Add strategic color to monochromatic interfaces |
| `/bolder` | Amplify safe/boring designs to be memorable |
| `/quieter` | Tone down overwhelming designs |
| `/delight` | Add moments of joy and personality |
| `/extract` | Pull repeated patterns into reusable components |
| `/adapt` | Responsive adaptation for different devices |
| `/onboard` | Design effective onboarding flows |
| `/teach` | One-time setup: gather design context for project |

### Command Workflows

```text
Quality:     /audit → /normalize → /harden → /polish
Enhancement: /critique → /distill → /colorize → /animate → /polish
New Project: /teach → /critique → /normalize → /animate → /audit → /polish
```

## Stack Detection

| Stack | Notes |
| ----- | ----- |
| React / Next.js | Tailwind + CSS vars; shadcn/ui if applicable |
| Vue / Nuxt | Same token approach, adapt class syntax |
| Flutter | ThemeData tokens, Material 3 |
| SwiftUI | Color assets + ViewModifier |
| HTML + Tailwind | Default if unspecified |

## Output Format (Design Mode)

```text
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
□ Passes AI Slop Test
□ WCAG AA contrast ratios
□ Responsive breakpoints (320 / 768 / 1024px)
□ Touch targets 44px+
□ Dark mode tokens
□ Focus states & keyboard navigation
□ prefers-reduced-motion respected
```

## Quick Reference

### Typography
- Modular type scale with fluid sizing (`clamp`) for headings
- Cap line length at ~65-75ch
- Pair a distinctive display font with a refined body font

### Spacing
- Vary spacing for hierarchy — not uniform gaps everywhere
- Use whitespace as a design element (cards are overused)

### Design Direction
- Commit to a BOLD aesthetic: brutally minimal, maximalist, retro-futuristic, organic, luxury, playful, editorial, brutalist, art deco, soft/pastel, industrial
- What makes this UNFORGETTABLE?

## Gotchas

- **Font reflex** — First 3 choices are training data defaults. Reject them.
- **Theme = context** — Dark/light derived from audience, not preference.
- **Alpha = design smell** — Heavy transparency means incomplete palette.
- **Cards are overused** — Spacing and alignment create grouping naturally.

## When to Load Each Reference

| User says | Load |
| --------- | ---- |
| "typography", "fonts", "type scale", "font pairing" | `references/typography.md` |
| "colors", "palette", "dark mode", "contrast", "OKLCH" | `references/color-and-contrast.md` |
| "spacing", "layout", "grid", "cards", "visual hierarchy" | `references/spatial-design.md` |
| "animation", "motion", "transitions", "easing" | `references/motion-design.md` |
| "forms", "focus", "loading", "modals", "interaction states" | `references/interaction-design.md` |
| "responsive", "mobile", "breakpoints", "fluid design" | `references/responsive-design.md` |
| "copy", "labels", "error messages", "empty states" | `references/ux-writing.md` |
| "craft", "build feature", "shape then build" | `references/craft.md` |
| "extract", "design system", "tokens", "reusable components" | `references/extract.md` |
| "industry rules", "finance", "healthcare", "SaaS" | `references/design-patterns/overview.md` |
| "reasoning engine", "4-stage process" | `references/reasoning-engine/four-stage-process.md` |
| "color palette options", "color index" | `references/design-patterns/colors-index.md` |
| "tech stack", "React", "Flutter", "SwiftUI" | `references/tech-stacks.md` |
| "figma", "existing design system" | `references/figma.md` |

## Conventions

- Aesthetic direction first → tokens → components (always in this order)
- Semantic color names (`--color-primary` not `--blue`)
- Mobile-first responsive design
- No emojis as icons — use SVG (Heroicons, Lucide)

---

## Red Flags

- 🚩 Uses Inter, Roboto, DM Sans, or any banned font → Reject and find distinctive alternative
- 🚩 No context gathering happened → Stop and ask user for audience, use cases, brand tone
- 🚩 Passes "AI Slop Test" negatively → Lacks bold direction; commit to specific tone
- 🚩 Heavy `rgba()` / alpha transparency → Incomplete palette; define explicit tokens
- 🚩 No industry identification → Reasoning engine skipped; identify sector first
- 🚩 Implementation starts with colors before HTML structure → Wrong order
- 🚩 Pure #000/#fff in tokens → Always tint neutrals toward brand hue

---

## Verification

Before declaring complete, confirm:

- [ ] Context gathered (audience, use cases, brand tone)
- [ ] Industry identified (SaaS/Finance/Healthcare/etc.)
- [ ] Existing design system checked (Phase 0)
- [ ] Passes AI Slop Test — doesn't look generically AI-generated
- [ ] No banned fonts used
- [ ] Color tokens defined (no pure #000/#fff, no rgba overuse)
- [ ] WCAG AA contrast ratios validated
- [ ] Implementation order followed (if code was written)
- [ ] `prefers-reduced-motion` respected
- [ ] Pre-delivery checklist passed (responsive, touch targets, dark mode, focus states)
- [ ] Tokens defined BEFORE component design

---

## Required Context

| Dependency | Type | Purpose |
| ---------- | ---- | ------- |
| Figma / tokens / component library | Design input | Phase 0 — extend, don't rebuild |
| `references/*.md` | Skill reference | Typography, color, spatial, motion, interaction, responsive, UX writing, craft, extract |
| `references/design-patterns/` | Industry patterns | 161 domain-specific rules |
| `references/reasoning-engine/` | Design process | 4-stage analysis |
| User context (audience, use cases, brand tone) | Live input | Required before any design work |
| `knowledge/lessons/` | Lessons learnt | Check before execute |

## Human-in-the-Loop Points

| Step | Approval Type | When |
| ---- | ------------- | ---- |
| Context gathering | Open field | Before any design work (audience, tone, use cases) |
| After design concept (aesthetic direction) | Single select (3-5 options) | Before committing to visual direction |
| After component spec (tokens + components) | Checkbox (confirm tokens match brand) | Before generating implementation code |
| After implementation | Checkbox (passes AI Slop Test) | Before declaring design complete |
| Existing design system detected | Open field (extend vs rebuild) | When Phase 0 finds existing tokens/Figma |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.

## Self-Learning

- Approved output → save to `knowledge/lessons/ux-ui/{pattern}.md`
- Rejected output → note what went wrong
- 3x same issue in skill-log → auto-apply fix + bump version
